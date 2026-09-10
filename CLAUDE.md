@AGENTS.md

# Guatapay — Guía del proyecto

Este documento es la referencia principal del proyecto. Está escrito en español para que cualquier
persona del equipo pueda entenderlo sin fricción.

## Estructura del repositorio (monorepo)

Este repo es un **monorepo con npm workspaces** con dos proyectos independientes:

```
/
├── app/      # App móvil Expo/React Native (Clean Architecture)
├── server/   # Backend Express + MongoDB
└── package.json  # workspaces root (solo orquesta husky/lint-staged)
```

- Todo lo relacionado a la **app móvil** (código, tests, convenciones, arquitectura) vive en
  [`app/`](./app) — ver [`app/docs/ARCHITECTURE.md`](./app/docs/ARCHITECTURE.md) antes de crear
  cualquier archivo nuevo dentro de `app/src/`.
- Todo lo relacionado al **backend** vive en [`server/`](./server) — ver
  [`server/docs/BACKEND.md`](./server/docs/BACKEND.md) para el contrato de API. La app ya está
  conectada a estos endpoints (no quedan data sources mockeados en `app/`, salvo PIN y biometría,
  que son intencionalmente locales al dispositivo — ver la sección "Qué se queda 100% en el
  dispositivo" de `server/docs/BACKEND.md`).
- Los comandos (`lint`, `test`, `verify`, etc.) son **por workspace**: se corren dentro de la
  carpeta correspondiente (`cd app && npm run verify`) o desde la raíz con
  `npm run verify --workspace=app` / `npm run verify --workspace=server`.
- Husky + lint-staged viven en la raíz (único `.git` del repo) y corren lint/format por
  workspace según qué carpeta tenga archivos modificados (ver `lint-staged.config.js`).

### Cómo correr todo el proyecto (app + backend) — un solo comando

```bash
npm install
npm run dev
```

`npm run dev` (en la raíz) detecta la IP de red local de la máquina, configura `app/.env` con
`EXPO_PUBLIC_API_URL` automáticamente, y levanta el backend (con una MongoDB en memoria — sin
`.env` ni instalación de Mongo) y el servidor de Expo juntos, en la misma terminal. El detalle
completo (incluyendo el caso de una IP mal detectada) está en el [`README.md`](./README.md) raíz.
Para probar el API directamente sin la app, importar [`server/postman_collection.json`](./server/postman_collection.json)
en Postman.

**Limitación conocida:** no existe todavía una pantalla para _crear_ un método de recuperación
(email/contraseña o frase semilla) — solo para recuperar a partir de uno ya existente. El flujo
de "Recuperar billetera" no se puede probar contra una cuenta nueva hasta que se construya esa
pantalla, o se cree la cuenta a mano en Mongo. Dentro de la app, tocar el aviso "Crea un método
de recuperación" en Home muestra un aviso explicando esto (`HomeScreen.tsx`).

El resto de este documento describe las convenciones de **`app/`** (la app móvil), que es donde
vive la mayor parte del código hoy. El backend en `server/` sigue su propio stack (Node/Express/
MongoDB) descrito en `server/docs/BACKEND.md`; no aplican las convenciones de Expo/React Native
que siguen abajo.

## Stack técnico (`app/`)

- **Expo (SDK 57)** + **React Native 0.86** + **React 19**
- **TypeScript** en modo `strict` (ver `app/tsconfig.json`)
- **ESLint 9** (flat config) con `eslint-config-expo`, reglas de TypeScript, reglas de arquitectura
  e integración con Prettier
- **Prettier** para formateo automático
- **Jest** (`jest-expo`) + **React Native Testing Library** para tests — ver [`app/docs/TESTING.md`](./app/docs/TESTING.md)
- **Husky + lint-staged** (raíz del monorepo) para validar el código antes de cada commit
- Arquitectura: **Clean Architecture por features** — ver [`app/docs/ARCHITECTURE.md`](./app/docs/ARCHITECTURE.md)
  (léelo antes de crear cualquier archivo nuevo dentro de `app/src/`)

Toda la documentación extendida vive en [`app/docs/`](./app/docs/README.md) — este archivo
(`CLAUDE.md`) es solo la guía rápida de referencia.

## Requisitos previos

- **Node.js 22.13 o superior** (trae `npm`) — es lo único que hay que instalar a mano; el resto
  (Expo CLI, MongoDB, etc.) lo resuelve `npm install`. Está forzado por `engines` en los
  `package.json` + `engine-strict=true` en `.npmrc`, así que una versión vieja falla con un
  mensaje claro en vez de un error críptico más adelante.
- App **Expo Go** instalada en el celular (Android/iOS) para probar sin necesidad de Android Studio o Xcode

**Usar siempre `npm` — nunca `bun`, `pnpm`, `yarn` u otro gestor de paquetes.** El repo es un
monorepo de **npm workspaces** y todos los scripts (`predev`, `dev`, `verify`, etc.) usan la sintaxis
`npm run <script> --workspace=<paquete>`. Otros gestores no interpretan ese flag igual (por ejemplo,
`bun run` lo pasa como argumento literal en vez de resolver el workspace), lo que rompe los scripts
encadenados y puede producir errores confusos o loops de procesos anidados. Si instalaste con otro
gestor por error, borrá su lockfile (`bun.lock`, `pnpm-lock.yaml`, `yarn.lock`) y corré `npm install`
de nuevo.

No se requiere instalar Android Studio, Xcode ni un JDK local para el desarrollo diario con Expo Go.

## Comandos disponibles (dentro de `app/`)

| Comando                                           | Qué hace                                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm start`                                       | Levanta el servidor de desarrollo (Metro) y muestra el QR para abrir en Expo Go                                          |
| `npm run android` / `npm run ios` / `npm run web` | Levanta el proyecto directo en esa plataforma                                                                            |
| `npm run lint`                                    | Corre ESLint sobre todo el proyecto                                                                                      |
| `npm run lint:fix`                                | Corre ESLint y corrige automáticamente lo que se pueda                                                                   |
| `npm run format`                                  | Formatea todo el código con Prettier                                                                                     |
| `npm run format:check`                            | Verifica formato sin modificar archivos (usado en CI)                                                                    |
| `npm run typecheck`                               | Verifica tipos de TypeScript sin generar archivos (`tsc --noEmit`)                                                       |
| `npm test`                                        | Corre la suite de tests (Jest) una vez                                                                                   |
| `npm run test:watch`                              | Corre los tests en modo watch                                                                                            |
| `npm run test:coverage`                           | Corre los tests generando reporte de cobertura                                                                           |
| `npm run verify`                                  | Corre `typecheck` + `lint` + `format:check` + `test` en secuencia — **correr esto antes de dar por terminada una tarea** |

Estos comandos se corren con cwd en `app/` (`cd app && npm run verify`) o desde la raíz con
`npm run verify --workspace=app`. El hook de pre-commit (Husky, en la raíz) ya ejecuta lint y
formateo automáticamente sobre los archivos modificados de cada workspace antes de cada commit.
Si el hook falla, el commit no se realiza hasta corregir los errores.

## Estructura del proyecto (`app/`)

Ver [`app/docs/ARCHITECTURE.md`](./app/docs/ARCHITECTURE.md) para el detalle completo de capas,
ejemplo funcional (`src/features/home`) y reglas de dependencia. Resumen rápido:

```
app/src/
├── features/<feature>/{domain,data,presentation}
├── shared/{components,hooks,services,utils,types,constants}
├── navigation/
└── core/{config,theme}
```

**Regla clave:** todo lo relacionado a un módulo de negocio nuevo se crea dentro de
`app/src/features/<nombre-del-feature>/`, respetando las 3 capas (`domain`, `data`, `presentation`).
No crear pantallas, hooks o lógica de negocio sueltos en la raíz de `app/src/`.

## Convenciones de código (`app/`)

### Nombres de archivos

- Componentes y pantallas React: `PascalCase.tsx` (ej. `HomeScreen.tsx`, `PrimaryButton.tsx`)
- Hooks: `camelCase.ts` empezando con `use` (ej. `useWalletBalance.ts`)
- Entidades, interfaces de dominio, clases: `PascalCase.ts` (ej. `WalletBalance.ts`, `WalletRepositoryImpl.ts`)
- Funciones utilitarias, usecases, datasources: `camelCase.ts` (ej. `getWalletBalanceUseCase.ts`)
- Constantes y tema: `camelCase.ts` (ej. `colors.ts`)

### TypeScript

- **Nunca usar `any`.** Si el tipo es realmente desconocido, usar `unknown` y validarlo.
- Preferir `interface` para definir formas de objetos/entidades y `type` para uniones, intersecciones
  o alias de tipos primitivos.
- Todo dato que cruza una frontera externa (respuesta de API, storage, params de navegación) debe
  tener un tipo explícito — no dejar que TypeScript infiera `any` implícito.
- Usar los alias de import (`@features/*`, `@shared/*`, `@core/*`, `@navigation/*`) en vez de rutas
  relativas largas (`../../../..`) al cruzar de un feature a otro o hacia `shared`/`core`.

### Componentes y hooks (React / React Native)

- Componentes funcionales únicamente, con hooks. No usar componentes de clase.
- Un componente por archivo. El nombre del archivo coincide con el nombre exportado.
- La lógica de negocio y de datos **no va dentro de componentes de UI**: un componente solo orquesta
  hooks y renderiza. La lógica vive en `domain` (usecases) y se conecta vía hooks en `presentation/hooks`.
- Extraer un hook propio cuando un componente empieza a manejar más de un `useState`/`useEffect`
  relacionados entre sí, o cuando esa lógica se podría reutilizar.
- Evitar estilos inline repetidos: usar `StyleSheet.create` y, si el estilo se repite entre features,
  moverlo a `shared/constants` o `core/theme`.

### Buenas prácticas generales de código limpio

- **Responsabilidad única**: cada función/archivo hace una sola cosa. Si un archivo hace demasiado,
  dividirlo siguiendo las capas de `app/docs/ARCHITECTURE.md`.
- **Nombres descriptivos**: el nombre de una función o variable debe explicar qué hace/contiene sin
  necesitar un comentario adicional. Evitar abreviaciones ambiguas.
- **Sin código muerto**: no dejar imports, variables, funciones o archivos sin usar. ESLint lo marca
  como advertencia (`@typescript-eslint/no-unused-vars`); corregirlo antes de commitear.
- **Sin lógica duplicada**: si una misma lógica aparece en 3 o más lugares, extraerla a `shared/utils`
  o a un hook/usecase reutilizable. No exagerar con abstracciones para 1 o 2 usos.
- **Manejo de errores explícito**: las llamadas asíncronas (`data/datasources`, `data/repositories`)
  deben manejar errores de forma explícita (try/catch o result types), nunca dejarlos sin capturar
  cuando pueden fallar por red o entrada externa.
- **Comentarios solo cuando aportan valor**: no comentar qué hace el código (el código ya lo dice
  con buenos nombres); comentar únicamente decisiones no obvias, restricciones externas o
  workarounds temporales, explicando el porqué.
- **Commits pequeños y descriptivos**: un commit = un cambio lógico coherente. Mensaje en modo
  imperativo describiendo el "por qué", no solo el "qué".

### Imports

- Orden forzado por ESLint (`import/order`): librerías externas primero, luego internos (`@features`,
  `@shared`, etc.), luego relativos, con una línea en blanco entre grupos y orden alfabético dentro
  de cada grupo. Correr `npm run lint:fix` para que se ordenen automáticamente.
- Prohibidas las dependencias circulares (`import/no-cycle`).

### Testing

Ver [`app/docs/TESTING.md`](./app/docs/TESTING.md) para la guía completa. Resumen:

- El test va **al lado** del archivo que prueba, con sufijo `.test.ts`/`.test.tsx` (no en una
  carpeta `__tests__` separada).
- `domain` (usecases) se prueba con fakes simples que cumplen la interfaz del repositorio — sin
  librerías de mocking, gracias a que ya depende solo de abstracciones (DIP).
- `presentation` se prueba con `@testing-library/react-native` (`render` es asíncrono en la
  versión instalada: siempre `await render(...)`).
- Todo `usecase` y `repository` nuevo debe tener al menos un test.

## Principios SOLID y reglas de arquitectura forzadas por ESLint

La arquitectura por capas de `app/` existe para sostener los principios SOLID, y varias de esas
reglas están forzadas automáticamente por ESLint, no solo documentadas (detalle completo con tabla
y justificación en [`app/docs/ARCHITECTURE.md`](./app/docs/ARCHITECTURE.md)):

- `domain` no puede importar de `data` ni de `presentation` (Dependency Inversion).
- `data` no puede importar de `presentation`.
- `presentation` no puede importar clases concretas de `data` directamente — debe usar el
  `container.ts` (composition root) del feature (Dependency Inversion).
- `complexity`, `max-lines-per-function`, `max-lines`, `max-classes-per-file` y
  `sonarjs/cognitive-complexity` ponen un techo objetivo que empuja a respetar Responsabilidad
  Única: si una función/archivo lo supera, hay que dividirlo.
- `max-params` empuja a mantener interfaces pequeñas y específicas (Interface Segregation).

Si el linter rechaza un import o excede un límite de complejidad, **no se debe desactivar la
regla**: se debe reorganizar el código para respetar el principio correspondiente.

## Al agregar código nuevo en `app/` (checklist rápido)

1. ¿Es un feature de negocio nuevo? → Crear carpeta en `app/src/features/<nombre>` con sus 3 capas.
2. ¿Es reutilizable entre features y no es lógica de negocio? → `app/src/shared/`.
3. ¿Es configuración/infra transversal? → `app/src/core/`.
4. ¿Agrega una pantalla? → Registrar la ruta en `app/src/navigation/`.
5. ¿Agrega un usecase o repository? → Agregar su test junto al archivo (ver [`app/docs/TESTING.md`](./app/docs/TESTING.md)).
6. Antes de terminar: correr `npm run verify` (dentro de `app/`).
7. Si se agregan dependencias nuevas, usar `npx expo install <paquete>` en vez de `npm install`
   cuando el paquete tenga una versión específica para la versión de Expo del proyecto (SDK 57).

No crear estructuras de carpetas nuevas dentro de `app/src/` fuera de `features/`, `shared/`,
`navigation/` y `core/` sin actualizar `app/docs/ARCHITECTURE.md` primero.

## Al agregar código nuevo en `server/`

Seguir el contrato y las convenciones descritas en [`server/docs/BACKEND.md`](./server/docs/BACKEND.md):
capas `routes → controllers → services → models`, validación de payloads, y no exponer nunca
`passwordHash`/`seedPhraseHash` en las respuestas. Antes de terminar: correr `npm run verify`
dentro de `server/`.
