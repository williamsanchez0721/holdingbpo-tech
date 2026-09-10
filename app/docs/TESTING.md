# Testing

Este proyecto usa **Jest** (con el preset `jest-expo`) y **React Native Testing Library** para
pruebas de UI. La forma en que está organizada la arquitectura (ver
[`ARCHITECTURE.md`](./ARCHITECTURE.md)) hace que cada capa se pueda probar de forma aislada, sin
necesidad de levantar la app completa.

## Comandos

| Comando                 | Qué hace                                                 |
| ----------------------- | -------------------------------------------------------- |
| `npm test`              | Corre todos los tests una vez                            |
| `npm run test:watch`    | Corre los tests en modo watch (ideal durante desarrollo) |
| `npm run test:coverage` | Corre los tests y genera reporte de cobertura            |

Los tests corren automáticamente como parte de `npm run verify`.

## Dónde va cada test

Los tests viven **junto al archivo que prueban**, con el sufijo `.test.ts` o `.test.tsx`
(convención de colocation, no una carpeta `__tests__` separada):

```
src/features/home/domain/usecases/getGreetingUseCase.ts
src/features/home/domain/usecases/getGreetingUseCase.test.ts   <- al lado del archivo
```

## Cómo probar cada capa

### `domain` (usecases) — tests unitarios puros, sin mocks de librerías

Como `domain` solo depende de interfaces propias (nunca de implementaciones concretas), probar un
usecase es tan simple como crear un "fake" que cumpla la interfaz del repositorio, sin necesidad de
ninguna librería de mocking:

```ts
function makeFakeRepository(greeting: Greeting): GreetingRepository {
  return { getGreeting: () => Promise.resolve(greeting) };
}
```

Esto es una consecuencia directa de aplicar el **Principio de Inversión de Dependencias (DIP)**:
si el usecase dependiera de la clase concreta (`GreetingRepositoryImpl`), probarlo sin red o sin
storage real sería mucho más difícil.

Ver ejemplo completo en `src/features/home/domain/usecases/getGreetingUseCase.test.ts`
(incluye caso feliz y caso de error).

### `data` (repositories, datasources) — tests de integración ligeros

Prueban que la implementación concreta realmente cumple el contrato de la interfaz de `domain` y
que transforma correctamente los datos (mappers). Si el datasource real llama a una API externa,
en el test se debe mockear esa llamada de red (`fetch`, cliente HTTP, SDK), nunca hacer la llamada
real.

Ver ejemplo en `src/features/home/data/repositories/GreetingRepositoryImpl.test.ts`.

### `presentation` (screens, componentes, hooks) — tests con React Native Testing Library

Se prueba el comportamiento visible para el usuario (qué se renderiza, qué pasa al interactuar),
no los detalles internos de implementación. Se usa `render`, `screen` y `waitFor` de
`@testing-library/react-native`.

```tsx
await render(<HomeScreen />);
await waitFor(() => {
  expect(screen.getByText(/algo visible/i)).toBeTruthy();
});
```

Notas importantes de la versión instalada (`@testing-library/react-native` v14):

- `render(...)` es **asíncrono** — siempre usar `await render(...)`.
- Preferir queries accesibles (`getByText`, `getByRole`, `getByLabelText`) sobre `testID` cuando
  sea posible; son más parecidas a como un usuario real encuentra el elemento.
- No testear estilos ni estructura interna del árbol de componentes — eso acopla el test a
  detalles de implementación y lo vuelve frágil.

Ver ejemplo en `src/features/home/presentation/screens/HomeScreen.test.tsx`.

## Qué SÍ y qué NO probar

- **Sí**: reglas de negocio en `domain` (casos felices, casos de error, casos límite).
- **Sí**: que la UI muestre el estado correcto según los datos que recibe (loading, error, data).
- **Sí**: transformaciones de datos en `data/mappers`.
- **No**: implementación interna de librerías de terceros (React, React Native, Expo) — se asume
  que ya están probadas por sus mantenedores.
- **No**: estilos visuales exactos (colores, tamaños) — eso se valida visualmente, no con tests.

## Al agregar un feature nuevo

Cada usecase nuevo en `domain` y cada repositorio nuevo en `data` **debe** tener al menos un test.
Las pantallas y componentes en `presentation` deben tener al menos un test que verifique el
comportamiento principal (qué se muestra según el estado del hook que consumen).
