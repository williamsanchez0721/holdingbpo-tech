# Guatapay

Monorepo con la app móvil y el backend de Guatapay.

- [`app/`](./app) — app móvil Expo/React Native (Clean Architecture). Ver [`app/docs/README.md`](./app/docs/README.md).
- [`server/`](./server) — backend Express + MongoDB. Ver [`server/docs/BACKEND.md`](./server/docs/BACKEND.md).

Guía general de convenciones y comandos: [`CLAUDE.md`](./CLAUDE.md).

## Cómo correr el proyecto completo (app + backend)

### Requisitos (lo único que hay que instalar a mano)

- **[Node.js 22.13 o superior](https://nodejs.org/)** (incluye `npm`). Es el único requisito real:
  todo lo demás (Expo CLI, MongoDB, etc.) lo instala `npm install` dentro del repo — no hace falta
  tener React Native, Expo ni MongoDB instalados globalmente en la máquina.
  Si tu Node es más viejo, `npm install`/`npm run dev` van a fallar de entrada con un mensaje
  explícito ("Unsupported engine") en vez de un error críptico más adelante.
- La app **Expo Go** instalada en tu celular (Android/iOS), en la misma red Wi-Fi que esta
  computadora — esto sí es manual, es una app que se descarga desde la tienda de tu celular.

### Correrlo

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
  o frase semilla) — es un feature pendiente. Tocar el aviso "Crea un método de recuperación" en
  Home lo dice explícitamente dentro de la propia app (no hace falta leer el código para
  enterarse). Sin una cuenta con backup ya configurada en la base de datos, el flujo de
  recuperación siempre va a responder "credenciales inválidas". Para probarlo igual, hay que
  crear esa cuenta a mano en Mongo (hashear password/seed phrase con bcrypt) o esperar a que se
  construya esa pantalla.

## Correr un comando suelto en un solo workspace (opcional)

Esto **no es un paso adicional para levantar el proyecto** (para eso alcanza con `npm run dev`,
arriba) — es para cuando querés correr un script puntual (`lint`, `test`, `verify`, etc.) en un
solo paquete, sin levantar todo:

```bash
npm run <script> --workspace=app
npm run <script> --workspace=server
```

Ver los scripts disponibles de cada proyecto en su propio `package.json`.
