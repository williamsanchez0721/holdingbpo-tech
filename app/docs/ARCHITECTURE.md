# Arquitectura del proyecto

Este proyecto sigue una **Arquitectura Limpia (Clean Architecture) organizada por features** (características/módulos de negocio). El objetivo es que el código sea fácil de mantener, testear y escalar, separando claramente "qué hace la app" (reglas de negocio) de "cómo lo hace" (UI, frameworks, APIs externas).

## Idea central: la regla de dependencia

Cada feature se divide en 3 capas. Las dependencias **solo pueden apuntar hacia adentro**, nunca hacia afuera:

```
presentation  --->  domain  <---  data
   (UI)           (reglas)      (implementación)
```

- `domain` es el centro. No importa nada de `data` ni de `presentation`. No conoce React Native, ni Expo, ni ninguna librería externa.
- `presentation` conoce a `domain` (lo usa), pero no conoce los detalles de `data`.
- `data` conoce a `domain` (implementa sus interfaces), pero no conoce `presentation`.

Esta regla está **forzada automáticamente por ESLint** (ver `eslint.config.js`, regla `import/no-restricted-paths`). Si alguien intenta romperla, el lint falla con un mensaje explicando el motivo. No es solo una convención de documentación: el linter la hace cumplir.

## ¿Por qué organizar así?

- **Testable**: la lógica de negocio (`domain`) no depende de React Native ni de APIs externas, por lo que se puede probar de forma aislada y rápida.
- **Reemplazable**: si mañana cambiamos de backend, de librería HTTP o de motor de almacenamiento local, solo se toca la capa `data`. La UI y las reglas de negocio no se enteran.
- **Escalable por equipos**: cada feature es una carpeta independiente. Dos personas pueden trabajar en features distintas sin pisarse.
- **Fácil de ubicar código nuevo**: ante la pregunta "¿dónde va esto?", la respuesta depende del tipo de responsabilidad, no de gustos personales.

## Estructura de carpetas

```
src/
├── features/                    # Un modulo de negocio = una carpeta
│   └── <nombre-feature>/
│       ├── domain/               # Reglas de negocio puras (sin dependencias externas)
│       │   ├── entities/         # Modelos/tipos del negocio (ej: Greeting.ts)
│       │   ├── repositories/     # Interfaces (contratos) que data debe implementar
│       │   └── usecases/         # Una funcion = una accion de negocio (ej: getGreetingUseCase)
│       │
│       ├── data/                 # Implementacion concreta de los contratos de domain
│       │   ├── datasources/      # Origen real de los datos (API REST, storage local, SDK, etc.)
│       │   ├── repositories/     # Implementa las interfaces de domain/repositories
│       │   └── mappers/          # Convierte datos externos (DTO/JSON) a entidades de domain
│       │
│       └── presentation/         # Todo lo relacionado a UI
│           ├── screens/          # Pantallas (componentes de nivel de ruta)
│           ├── components/       # Componentes visuales especificos de este feature
│           └── hooks/            # Hooks que conectan usecases con la UI (useGreeting, etc.)
│
├── shared/                      # Codigo reutilizable entre features (NO logica de negocio de un feature especifico)
│   ├── components/               # Componentes de UI genericos (Button, Card, Input...)
│   ├── hooks/                    # Hooks genericos (useDebounce, useKeyboard...)
│   ├── services/                 # Clientes HTTP, SDKs, wrappers de librerias externas
│   ├── utils/                    # Funciones puras de proposito general (formatDate, etc.)
│   ├── types/                    # Tipos TypeScript compartidos entre features
│   └── constants/                # Colores, tamaños, textos fijos, config visual
│
├── navigation/                   # Configuracion de navegacion (React Navigation u otra)
│
└── core/                         # Infraestructura transversal de la app
    ├── config/                   # Configuracion global (env vars, endpoints base, etc.)
    └── theme/                    # Tema visual global (tipografia, spacing, dark/light mode)
```

## Ejemplo real: el feature `home`

`src/features/home` es la pantalla de inicio (dashboard) real de la app: balance de la billetera y
últimos movimientos. Sirve también como plantilla de punta a punta para crear nuevos features.

1. **`domain/entities/WalletBalance.ts` y `Transaction.ts`** — Qué es un balance y un movimiento
   para el negocio (interfaces simples).
2. **`domain/repositories/WalletRepository.ts`** — Define el contrato: "quien sea que implemente
   esto, debe saber cómo obtener el balance y los movimientos". Solo una interfaz, sin implementación.
3. **`domain/usecases/getWalletBalanceUseCase.ts` y `getRecentTransactionsUseCase.ts`** — Las
   acciones de negocio en sí. Reciben el repositorio (interfaz) como dependencia, nunca la
   implementación concreta.
4. **`data/datasources/walletLocalDataSource.ts`** — El origen real del dato (por ahora, un mock de
   una billetera recién creada; luego será un `fetch` al backend).
5. **`data/repositories/WalletRepositoryImpl.ts`** — Implementa `WalletRepository` usando el
   datasource. Es la única pieza que "sabe" de dónde viene realmente el dato.
6. **`container.ts`** (en la raíz del feature, fuera de las 3 capas) — El **composition root**: el
   único lugar que conoce tanto la interfaz de `domain` como la implementación concreta de `data`, y
   las une (`makeGetWalletBalanceUseCase(new WalletRepositoryImpl())`).
7. **`presentation/hooks/useWalletBalance.ts` y `useRecentTransactions.ts`** — Conectan los usecases
   (importados desde `container.ts`, nunca desde `data` directamente) con React.
8. **`presentation/components/`** — Piezas visuales pequeñas y con una sola responsabilidad
   (`TopBar`, `BalanceCard`, `SecurityReminderCard`, `RecentMovementsCard`), en vez de un único
   archivo gigante.
9. **`presentation/screens/HomeScreen.tsx`** — La pantalla. Solo orquesta los hooks y compone los
   componentes de arriba.

Flujo de datos: `HomeScreen` → `useWalletBalance` (presentation) → `getWalletBalanceUseCase` (vía
`container.ts`) → `WalletRepositoryImpl` (data) → `walletLocalDataSource` (data).

## Cómo agregar un nuevo feature

1. Crear `src/features/<nombre>/domain/entities`, `/repositories`, `/usecases`.
2. Definir la entidad y la interfaz del repositorio primero (pensar en el negocio, no en la API).
3. Escribir el usecase usando solo la interfaz del repositorio.
4. Implementar `data/datasources` y `data/repositories` (la implementación real, ej. llamado HTTP).
5. Crear el hook en `presentation/hooks` que use el usecase.
6. Crear la pantalla/componentes en `presentation/screens` o `presentation/components`.
7. Si el feature necesita navegación, registrar la pantalla en `src/navigation`.

No es necesario crear las 3 capas si el feature es trivial (ej. una pantalla estática sin lógica), pero **si hay lógica de negocio o llamados a datos, sí se debe respetar la separación**.

Si el feature tiene lógica de negocio, se crea también un `container.ts` en la raíz del feature
(al mismo nivel que `domain/`, `data/` y `presentation/`) que arme las dependencias concretas y las
exponga ya listas para usar. `presentation` importa siempre desde `container.ts`, nunca desde
`data` directamente (ver sección de SOLID más abajo).

## Cuándo algo va en `shared/` o `core/` en vez de en un feature

- Si el código se usa (o se usará) en **más de un feature** y no representa una regla de negocio de un feature específico → `shared/`.
- Si es infraestructura transversal de la app completa (configuración, tema visual, inicialización) → `core/`.
- Si es específico de un solo feature → se queda dentro de ese feature, no se sube a `shared/` "por si acaso".

## Alias de importación

Configurados en `tsconfig.json` y `babel.config.js` (deben mantenerse sincronizados):

| Alias           | Apunta a           |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@features/*`   | `src/features/*`   |
| `@shared/*`     | `src/shared/*`     |
| `@navigation/*` | `src/navigation/*` |
| `@core/*`       | `src/core/*`       |

Usar siempre los alias para imports entre features o hacia `shared`/`core`. Dentro de un mismo feature, usar rutas relativas (`../domain/...`) para dejar explícita la cercanía entre las capas.

## Principios SOLID aplicados y cómo se verifican

Esta arquitectura no es solo una convención de carpetas: cada capa existe para sostener un
principio SOLID concreto, y varios de ellos están **forzados automáticamente por ESLint**
(`eslint.config.js`), no solo documentados.

| Principio                         | Cómo se aplica aquí                                                                                                                                                                    | Verificación automática                                                                                                                                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S — Responsabilidad única**     | Cada `usecase` hace una sola acción de negocio; cada `repository` expone un solo recurso; un componente solo orquesta un hook y renderiza.                                             | `complexity`, `max-lines-per-function`, `max-lines`, `max-classes-per-file`, `sonarjs/cognitive-complexity` ponen un techo objetivo — si una función/archivo lo supera, es señal de que hace más de una cosa y hay que dividirlo. |
| **O — Abierto/cerrado**           | Nuevas variantes de una regla de negocio se agregan implementando una nueva clase que cumpla la interfaz existente (ej. otro `Repository`), sin modificar el `usecase` que la consume. | No es verificable por lint; se sostiene con revisión de código y con el hábito de programar contra interfaces (ver DIP).                                                                                                          |
| **L — Sustitución de Liskov**     | Cualquier implementación de una interfaz de `domain/repositories` debe poder reemplazar a otra sin romper al `usecase` que la usa (mismo contrato de entrada/salida).                  | No es verificable por lint; se cubre con los tests del `usecase` corriendo contra distintos fakes/implementaciones (ver [`TESTING.md`](./TESTING.md)).                                                                            |
| **I — Segregación de interfaces** | Las interfaces de `domain/repositories` exponen solo los métodos que el `usecase` realmente necesita, no interfaces "todo en uno".                                                     | `max-params` desalienta funciones/constructores con demasiados parámetros posicionales, señal de una interfaz demasiado amplia.                                                                                                   |
| **D — Inversión de dependencias** | `domain` define interfaces; `data` las implementa; `presentation` nunca instancia una clase concreta de `data`, solo usa lo que expone el `container.ts` del feature.                  | `import/no-restricted-paths` bloquea con **error** cualquier import de `domain` hacia `data`/`presentation`, de `data` hacia `presentation`, y de `presentation` hacia `data`. Intentarlo hace fallar `npm run lint`.             |

Esto significa que romper SRP o DIP en este proyecto no es "una mala práctica que alguien puede
pasar por alto en code review": el pipeline de `npm run verify` falla y el commit no pasa el hook
de pre-commit.

## Reglas no negociables

- `domain` nunca importa de `data` ni de `presentation` (forzado por ESLint).
- `data` nunca importa de `presentation` (forzado por ESLint).
- `presentation` nunca importa clases concretas de `data` directamente; siempre a través del `container.ts` del feature (forzado por ESLint).
- La UI (`presentation`) nunca accede directamente a un `datasource`; siempre pasa por un `usecase`.
- Todo `usecase` y todo `repository` debe tener al menos un test (ver [`TESTING.md`](./TESTING.md)).
- No se crean carpetas nuevas en `src/` fuera de `features/`, `shared/`, `navigation/` y `core/` sin actualizar este documento.
