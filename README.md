# Guatapay

Monorepo con la app móvil y el backend de Guatapay.

- [`app/`](./app) — app móvil Expo/React Native (Clean Architecture). Ver [`app/docs/README.md`](./app/docs/README.md).
- [`server/`](./server) — backend Express + MongoDB. Ver [`server/docs/BACKEND.md`](./server/docs/BACKEND.md).

Guía general de convenciones y comandos: [`CLAUDE.md`](./CLAUDE.md).

## Cómo correr el proyecto completo (app + backend)

Requisitos: Node.js LTS + la app **Expo Go** instalada en tu celular (Android/iOS).

### 1. Instalar dependencias (una sola vez)

```bash
npm install
```

Esto instala las dependencias de `app/` y `server/` juntas (npm workspaces).

### 2. Levantar el backend

```bash
npm run dev --workspace=server
```

No hace falta ningún `.env` ni instalar MongoDB: si no hay `MONGODB_URI` configurado, el server
levanta automáticamente una MongoDB en memoria solo para ese proceso (los datos se pierden al
reiniciarlo, lo cual está bien para probar la app). Dejalo corriendo en una terminal.

### 3. Apuntar la app al backend

Copiá el archivo de ejemplo:

```bash
cp app/.env.example app/.env
```

- Si vas a abrir la app en un **simulador/emulador** (corriendo en la misma computadora que el
  backend), el valor por defecto (`http://localhost:3000/api`) ya funciona — no hace falta tocar nada.
- Si vas a abrir la app en tu **celular con Expo Go**, `localhost` no sirve (apunta al celular, no
  a tu computadora). Cambiá `EXPO_PUBLIC_API_URL` en `app/.env` por la IP local de tu computadora,
  por ejemplo `http://192.168.1.10:3000/api` (obtenela con `ipconfig` en Windows o
  `ifconfig`/`ip addr` en Mac/Linux — celular y computadora deben estar en la misma red Wi-Fi).

### 4. Levantar la app

En otra terminal:

```bash
npm run start --workspace=app
```

Escaneá el QR con Expo Go.

### Qué podés probar

- **Crear billetera**: Onboarding → PIN → nombre de usuario → Home con balance en $0.
- **Recuperar billetera**: actualmente no hay una pantalla para _generar_ un backup (email/password
  o frase semilla) — es un feature pendiente (ver el aviso "Crea un método de recuperación" en
  Home). Sin una cuenta con backup ya configurada en la base de datos, el flujo de recuperación
  siempre va a responder "credenciales inválidas". Para probarlo igual, hay que crear esa cuenta
  a mano en Mongo (hashear password/seed phrase con bcrypt) o esperar a que se construya esa pantalla.

## Comandos por workspace

```bash
npm run <script> --workspace=app
npm run <script> --workspace=server
```

Ver los scripts disponibles de cada proyecto en su propio `package.json`.
