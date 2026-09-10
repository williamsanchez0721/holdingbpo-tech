# Guatapay Server

Backend Express + MongoDB para la app Guatapay. El contrato de API completo (endpoints, modelos
de Mongo, seguridad) está documentado en [`docs/BACKEND.md`](./docs/BACKEND.md) — léelo antes de
agregar rutas o modelos nuevos.

## Setup

```bash
cp .env.example .env   # completar MONGODB_URI y JWT_SECRET
npm install             # o npm install en la raíz del monorepo
npm run dev
```

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
