@AGENTS.md

# holdingbpo-tech — Guía del proyecto

Este documento es la referencia principal del proyecto. Está escrito en español para que cualquier
persona del equipo pueda entenderlo sin fricción. **Antes de escribir código nuevo, seguir directamente
lo que está definido aquí y en `docs/ARCHITECTURE.md`, sin necesidad de preguntar ni de definir un proceso
nuevo cada vez.**

## Stack técnico

- **Expo (SDK 57)** + **React Native 0.86** + **React 19**
- **TypeScript** en modo `strict` (ver `tsconfig.json`)
- **ESLint 9** (flat config) con `eslint-config-expo`, reglas de TypeScript, reglas de arquitectura
  e integración con Prettier
- **Prettier** para formateo automático
- **Jest** (`jest-expo`) + **React Native Testing Library** para tests — ver [`docs/TESTING.md`](./docs/TESTING.md)
- **Husky + lint-staged** para validar el código antes de cada commit
- Arquitectura: **Clean Architecture por features** — ver [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
  (léelo antes de crear cualquier archivo nuevo dentro de `src/`)

Toda la documentación extendida vive en [`docs/`](./docs/README.md) — este archivo (`CLAUDE.md`)
es solo la guía rápida de referencia.

## Requisitos previos

- Node.js LTS y npm
- App **Expo Go** instalada en el celular (Android/iOS) para probar sin necesidad de Android Studio o Xcode

No se requiere instalar Android Studio, Xcode ni un JDK local para el desarrollo diario con Expo Go.

## Comandos disponibles

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

El hook de pre-commit (Husky) ya ejecuta lint y formateo automáticamente sobre los archivos
modificados antes de cada commit. Si el hook falla, el commit no se realiza hasta corregir los errores.

## Estructura del proyecto

Ver [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) para el detalle completo de capas, ejemplo funcional
(`src/features/home`) y reglas de dependencia. Resumen rápido:

```
src/
├── features/<feature>/{domain,data,presentation}
├── shared/{components,hooks,services,utils,types,constants}
├── navigation/
└── core/{config,theme}
```

**Regla clave:** todo lo relacionado a un módulo de negocio nuevo se crea dentro de
`src/features/<nombre-del-feature>/`, respetando las 3 capas (`domain`, `data`, `presentation`).
No crear pantallas, hooks o lógica de negocio sueltos en la raíz de `src/`.

## Convenciones de código

### Nombres de archivos

- Componentes y pantallas React: `PascalCase.tsx` (ej. `HomeScreen.tsx`, `PrimaryButton.tsx`)
- Hooks: `camelCase.ts` empezando con `use` (ej. `useGreeting.ts`)
- Entidades, interfaces de dominio, clases: `PascalCase.ts` (ej. `Greeting.ts`, `GreetingRepositoryImpl.ts`)
- Funciones utilitarias, usecases, datasources: `camelCase.ts` (ej. `getGreetingUseCase.ts`)
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
  dividirlo siguiendo las capas de `docs/ARCHITECTURE.md`.
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

Ver [`docs/TESTING.md`](./docs/TESTING.md) para la guía completa. Resumen:

- El test va **al lado** del archivo que prueba, con sufijo `.test.ts`/`.test.tsx` (no en una
  carpeta `__tests__` separada).
- `domain` (usecases) se prueba con fakes simples que cumplen la interfaz del repositorio — sin
  librerías de mocking, gracias a que ya depende solo de abstracciones (DIP).
- `presentation` se prueba con `@testing-library/react-native` (`render` es asíncrono en la
  versión instalada: siempre `await render(...)`).
- Todo `usecase` y `repository` nuevo debe tener al menos un test.

## Principios SOLID y reglas de arquitectura forzadas por ESLint

La arquitectura por capas de este proyecto existe para sostener los principios SOLID, y varias de
esas reglas están forzadas automáticamente por ESLint, no solo documentadas (detalle completo con
tabla y justificación en [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)):

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

## Al agregar código nuevo (checklist rápido)

1. ¿Es un feature de negocio nuevo? → Crear carpeta en `src/features/<nombre>` con sus 3 capas.
2. ¿Es reutilizable entre features y no es lógica de negocio? → `src/shared/`.
3. ¿Es configuración/infra transversal? → `src/core/`.
4. ¿Agrega una pantalla? → Registrar la ruta en `src/navigation/`.
5. ¿Agrega un usecase o repository? → Agregar su test junto al archivo (ver [`docs/TESTING.md`](./docs/TESTING.md)).
6. Antes de terminar: correr `npm run verify`.
7. Si se agregan dependencias nuevas, usar `npx expo install <paquete>` en vez de `npm install`
   cuando el paquete tenga una versión específica para la versión de Expo del proyecto (SDK 57).

No crear estructuras de carpetas nuevas dentro de `src/` fuera de `features/`, `shared/`,
`navigation/` y `core/` sin actualizar `docs/ARCHITECTURE.md` primero.
