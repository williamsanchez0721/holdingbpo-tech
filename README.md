# Guatapay

Monorepo con la app móvil y el backend de Guatapay.

- [`app/`](./app) — app móvil Expo/React Native (Clean Architecture). Ver [`app/docs/README.md`](./app/docs/README.md).
- [`server/`](./server) — backend Express + MongoDB. Ver [`server/docs/BACKEND.md`](./server/docs/BACKEND.md).

Guía general de convenciones y comandos: [`CLAUDE.md`](./CLAUDE.md).

## Setup inicial

```bash
npm install
```

Esto instala las dependencias de ambos workspaces (`app` y `server`) usando npm workspaces.

## Comandos por workspace

```bash
npm run <script> --workspace=app
npm run <script> --workspace=server
```

Ver los scripts disponibles de cada proyecto en su propio `package.json`.
