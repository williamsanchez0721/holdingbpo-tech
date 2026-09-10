# Guatapay Server

Backend Express + MongoDB para la app Guatapay. El contrato de API completo (endpoints, modelos
de Mongo, seguridad) está documentado en [`docs/BACKEND.md`](./docs/BACKEND.md) — léelo antes de
agregar rutas o modelos nuevos.

## Setup

```bash
npm install   # o npm install en la raíz del monorepo
npm run dev
```

No hace falta configurar nada más: si no hay un `.env` con `MONGODB_URI`, el servidor levanta
automáticamente una MongoDB en memoria solo para ese proceso (los datos se pierden al reiniciar).
Para conectar una MongoDB real (o cualquier otra config), copiá `.env.example` a `.env` y
completá los valores — ver los comentarios de cada variable ahí.

## Scripts

| Comando          | Qué hace                                       |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Levanta el servidor con recarga automática     |
| `npm run build`  | Compila TypeScript a `dist/`                   |
| `npm start`      | Corre el build compilado (`dist/server.js`)    |
| `npm run lint`   | Corre ESLint                                   |
| `npm run format` | Formatea con Prettier                          |
| `npm test`       | Corre la suite de tests (Jest)                 |
| `npm run verify` | `typecheck` + `lint` + `format:check` + `test` |
