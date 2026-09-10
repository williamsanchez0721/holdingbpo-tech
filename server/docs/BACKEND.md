# Guatapay Backend — Documento provisional (MongoDB)

> **Estado:** borrador para ser implementado por otro agente/IA. Describe el backend que
> reemplazará los data sources mockeados en `src/features/*/data/datasources` de la app móvil,
> sin cambiar los contratos (`domain/repositories`) que ya consume el frontend.

## 1. Contexto

La app móvil (Expo/React Native, Clean Architecture) ya tiene definidas las interfaces de
repositorio que representan lo que el backend debe exponer. Hoy están implementadas con
datos mockeados (AsyncStorage / SecureStore / arrays en memoria). Este documento describe
el backend real que las reemplazará, para que la migración en el cliente sea solo cambiar
la implementación de cada `*RepositoryImpl.ts` (llamando a HTTP en vez de al mock), sin tocar
`domain` ni `presentation`.

Interfaces de referencia en el repo:

- `src/features/auth/domain/repositories/UsernameRepository.ts`
- `src/features/auth/domain/repositories/WalletRecoveryRepository.ts`
- `src/features/home/domain/repositories/WalletRepository.ts`
- `src/features/auth/domain/repositories/PinRepository.ts` y `BiometricRepository.ts`
  (ver sección 6 — se recomienda que sigan siendo 100% locales al dispositivo)

## 2. Stack sugerido

- **Node.js LTS + TypeScript**
- **Express** (o Fastify) para el API REST
- **MongoDB + Mongoose** para persistencia
- **jsonwebtoken** para sesiones (JWT de acceso, sin refresh token en esta primera versión)
- **bcrypt** (o `argon2`) para hash de contraseñas
- **zod** (o `joi`) para validar payloads de entrada
- **helmet + cors + express-rate-limit** para hardening básico
- Estructura por capas, similar en espíritu a la del cliente:

```
src/
├── config/           # conexión a Mongo, variables de entorno, JWT
├── models/           # esquemas de Mongoose (User, Wallet, Transaction)
├── routes/           # definición de endpoints Express
├── controllers/       # parsean request/response, llaman a services
├── services/          # lógica de negocio (equivalente a los usecases del cliente)
├── middlewares/        # auth (JWT), manejo de errores, rate limiting
└── server.ts
```

## 3. Modelos de datos (MongoDB)

### `User`

```ts
{
  _id: ObjectId,
  username: string,          // único, 5-20 chars, [a-z0-9_] — mismas reglas que
                              // evaluateUsernameFormatUseCase.ts
  email?: string,             // opcional; requerido solo si el usuario habilita recuperación por email
  passwordHash?: string,       // bcrypt; solo si eligió recuperación por email
  seedPhraseHash?: string,     // hash de las 12 palabras normalizadas (ver sección 5.3)
  walletId: ObjectId,          // referencia a Wallet
  createdAt: Date,
  updatedAt: Date,
}
```

### `Wallet`

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  amount: number,               // balance en la moneda principal (ej. USDT)
  currency: string,             // ej. "USDT"
  convertedAmount: number,      // balance convertido (ej. a COP)
  convertedCurrency: string,    // ej. "COP"
  isRecovered: boolean,         // true si el wallet fue creado vía recuperación
  createdAt: Date,
  updatedAt: Date,
}
```

Al crear una wallet nueva (flujo "Crear billetera"), `amount`, `convertedAmount` deben
inicializarse en `0` y `isRecovered` en `false` — **no** poner datos de ejemplo por defecto.

### `Transaction`

```ts
{
  _id: ObjectId,
  walletId: ObjectId,
  type: 'sent' | 'received' | 'exchanged',
  status: 'completed' | 'failed',
  title: string,        // ej. "Enviaste", "Cambiaste"
  subtitle: string,      // ej. "ERC-20 Network", "Transacción fallida"
  amountLabel: string,   // ej. "100.00 USDT" (ya formateado, como lo espera el cliente)
  date: Date,
  createdAt: Date,
}
```

`dateLabel` que consume el cliente (`Transaction.ts`) se deriva de `date` al responder
(ej. `"29 Enero"` — formatear en el backend o dejar que el cliente formatee un ISO date,
a decidir con el equipo móvil; lo más simple es que el backend devuelva el ISO y el cliente
lo formatee con `Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' })`).

## 4. Autenticación y sesión

- El JWT se emite en dos momentos: al crear una wallet nueva y al recuperar una existente.
- El cliente guarda el token en `expo-secure-store` (igual que hoy guarda el hash del PIN)
  y lo manda como `Authorization: Bearer <token>` en cada request autenticado.
- El PIN y la biometría **no viajan al backend** — ver sección 6.
- `POST /api/auth/logout` es opcional (JWT sin estado); si se agrega, solo invalida del lado
  cliente. No implementar blacklist en esta primera versión.

## 5. Endpoints

### 5.1 Username (`UsernameRepository`)

| Método | Ruta                                   | Body                           | Respuesta                      | Usecase cliente     |
| ------ | -------------------------------------- | ------------------------------ | ------------------------------ | ------------------- |
| GET    | `/api/username/:username/availability` | —                              | `{ available: boolean }`       | `checkAvailability` |
| POST   | `/api/username`                        | `{ username }` (requiere auth) | `204`                          | `reserve`           |
| GET    | `/api/me/username`                     | — (requiere auth)              | `{ username: string \| null }` | `getReserved`       |

Reglas de validación de `username` (replicar `evaluateUsernameFormatUseCase.ts`):
longitud 5–20, solo `[a-z0-9_]`, único en la colección `User`.

`reserve` es idempotente para el propio usuario autenticado: si el username ya le pertenece
(ej. el cliente lo vuelve a "reservar" localmente después de recuperar una billetera cuyo
username ya vino asignado desde el backend), no se rechaza como `409` — solo se rechaza si le
pertenece a otro usuario.

### 5.2 Creación de wallet nueva

| Método | Ruta           | Body | Respuesta                             |
| ------ | -------------- | ---- | ------------------------------------- |
| POST   | `/api/wallets` | `{}` | `{ token: string, walletId: string }` |

Crea un `User` + `Wallet` en `0`, sin username todavía (se reserva después con 5.1).
Se llama justo después de que el cliente confirma el PIN (`ConfirmPinScreen`, flujo `create`).

### 5.3 Recuperación de wallet (`WalletRecoveryRepository`)

| Método | Ruta                            | Body                  | Respuesta                    | Usecase cliente         |
| ------ | ------------------------------- | --------------------- | ---------------------------- | ----------------------- |
| POST   | `/api/auth/recover/email`       | `{ email, password }` | `{ token, username } \| 401` | `recoverWithEmail`      |
| POST   | `/api/auth/recover/seed-phrase` | `{ seedPhrase }`      | `{ token, username } \| 401` | `recoverWithSeedPhrase` |

- Reglas de formato ya las valida el cliente antes de llamar
  (`evaluateEmailCredentialsFormatUseCase.ts`, `evaluateSeedPhraseFormatUseCase.ts` — seed
  phrase de exactamente 12 palabras). El backend igual debe re-validar server-side.
- Comparar `password` con `passwordHash` vía bcrypt.
- Para la seed phrase: normalizar igual que el cliente (`trim`, colapsar espacios, minúsculas)
  antes de hashear/comparar contra `seedPhraseHash`.
- Si coincide, marcar `wallet.isRecovered = true` (reemplaza `markAsRecovered` — ya no hace
  falta un endpoint aparte para esto, queda implícito en la recuperación exitosa).
- Mensaje de error genérico en `401`, igual al que ya usa el cliente:
  `"Las credenciales ingresadas no son válidas. Por favor verifica."` (el texto vive en el
  cliente; el backend solo necesita devolver un status 401 sin filtrar cuál dato falló).
- Aplicar rate limiting agresivo en estas dos rutas (fuerza bruta sobre password/seed phrase).

### 5.4 Wallet (`WalletRepository`)

| Método | Ruta                              | Respuesta                                                  | Usecase cliente                |
| ------ | --------------------------------- | ---------------------------------------------------------- | ------------------------------ |
| GET    | `/api/wallet/balance` (auth)      | `{ amount, currency, convertedAmount, convertedCurrency }` | `getWalletBalanceUseCase`      |
| GET    | `/api/wallet/transactions` (auth) | `Transaction[]` (recientes, ej. últimas 20)                | `getRecentTransactionsUseCase` |

## 6. Qué se queda 100% en el dispositivo (no va al backend)

- **PIN** (`PinRepository`): hash guardado en `expo-secure-store`, verificado localmente.
  No hay ninguna razón de negocio para que el backend conozca el PIN — es un gate de
  acceso a la app en ese dispositivo, no una credencial de cuenta.
- **Biometría** (`BiometricRepository`): flag de "habilitado" y verificación via
  `expo-local-authentication`, todo local.
- **Logout** (`logoutUseCase`): limpia PIN, biometría y username reservado localmente;
  no requiere llamada al backend salvo que más adelante se agregue invalidación de sesión.

Si en el futuro se quiere PIN recuperable entre dispositivos, eso es un cambio de alcance
que hay que discutir aparte (implica mandar el hash del PIN al backend, lo cual cambia el
modelo de amenazas actual).

## 7. Seguridad — checklist para quien implemente

- [ ] Contraseñas con `bcrypt`/`argon2`, nunca en texto plano ni en logs.
- [ ] Seed phrase: solo se guarda su hash, nunca la frase en texto plano.
- [ ] Rate limiting en `/api/auth/recover/*` (ej. 5 intentos / 15 min por IP).
- [ ] JWT con expiración razonable (ej. 30 días) y `JWT_SECRET` fuera del repo (`.env`).
- [ ] Validar todos los payloads con zod/joi antes de tocar Mongo.
- [ ] HTTPS obligatorio en producción (Expo Go / builds no deben hablar con HTTP plano).
- [ ] CORS restringido a los orígenes esperados.
- [ ] Nunca devolver `passwordHash` ni `seedPhraseHash` en ninguna respuesta.

## 8. Variables de entorno esperadas

```
MONGODB_URI=
JWT_SECRET=
PORT=3000
NODE_ENV=development
```

## 9. Fuera de alcance de esta primera versión

- Enviar/recibir/cambiar cripto real (los botones "Enviar/Recibir/Cambiar" del Home siguen
  siendo solo UI por ahora).
- Multi-dispositivo / refresh tokens.
- Recuperación de PIN entre dispositivos (ver sección 6).
