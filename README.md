# Guatapay

Monorepo con la app móvil y el backend de Guatapay.

- [`app/`](./app) — app móvil Expo/React Native (Clean Architecture). Ver [`app/docs/README.md`](./app/docs/README.md).
- [`server/`](./server) — backend Express + MongoDB. Ver [`server/docs/BACKEND.md`](./server/docs/BACKEND.md).

Guía general de convenciones y comandos: [`CLAUDE.md`](./CLAUDE.md).

## Cómo correr el proyecto completo (app + backend)

Requisitos: Node.js LTS + la app **Expo Go** instalada en tu celular (Android/iOS), en la misma
red Wi-Fi que esta computadora.

```bash
npm install
npm run dev
```

Con eso alcanza. `npm run dev`:

1. Detecta automáticamente la IP de tu red local y configura `app/.env` para que la app apunte
   al backend con esa IP (no hay que buscarla a mano ni copiar ningún archivo).
2. Levanta el backend (`server/`) — sin `.env`, sin instalar MongoDB: usa una MongoDB en memoria
   solo para este proceso (los datos se pierden al reiniciarlo, lo cual está bien para probar).
3. Levanta la app (`app/`) y muestra el QR de Expo — escanealo con Expo Go.

Ambos procesos corren juntos en la misma terminal (con prefijos de color `server`/`app`).
`Ctrl+C` los detiene a los dos.

Si la detección automática de IP falla o da una IP incorrecta (ej. tenés varias interfaces de
red / VPN activa), edit'a `app/.env` a mano con `EXPO_PUBLIC_API_URL=http://TU_IP:3000/api` y
volvé a correr `npm run dev` (no lo va a pisar si ya existe la variable).

### Probar los endpoints directo con Postman

Importá [`server/postman_collection.json`](./server/postman_collection.json) en Postman — trae
todos los endpoints documentados en [`server/docs/BACKEND.md`](./server/docs/BACKEND.md) con
ejemplos de body. Variables de colección: `baseUrl` (por defecto `http://localhost:3000/api`,
cambialo por la IP si Postman corre en otra máquina que el server) y `token` (pegar ahí el valor
que devuelve "Crear wallet nueva" o "Recuperar por email/seed phrase" para las requests
autenticadas).

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
