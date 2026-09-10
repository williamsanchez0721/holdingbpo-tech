// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const sonarjsPlugin = require('eslint-plugin-sonarjs');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',

      // Buenas practicas generales de calidad de codigo
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',

      // --- Reglas orientadas a principios SOLID ---
      //
      // S — Single Responsibility: un archivo/funcion pequeño y con baja complejidad
      // suele significar que hace una sola cosa. Estas reglas no "detectan" SRP
      // directamente (eso requiere criterio humano), pero ponen un techo objetivo
      // que obliga a dividir responsabilidades cuando se supera.
      complexity: ['warn', 10],
      'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-depth': ['warn', 3],
      'max-params': ['warn', 4],
      'max-classes-per-file': ['error', 1],
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-duplicate-string': ['warn', { threshold: 4 }],

      // I — Interface Segregation: evita funciones con parametros posicionales
      // interminables (senal de que deberian recibir un objeto/interfaz mas chica
      // y especifica en vez de "una interfaz que sirve para todo").
      // Cubierta arriba por 'max-params'.

      // D — Dependency Inversion: reforzada por 'import/no-restricted-paths' abajo,
      // que obliga a que domain solo dependa de abstracciones (interfaces) propias
      // y a que presentation no instancie implementaciones concretas de data
      // directamente, sino a traves de un composition root (container.ts).

      // Reglas de import ordenadas y sin ciclos
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': 'error',

      // Reglas de arquitectura (fuerzan Dependency Inversion Principle entre capas).
      // container.ts vive en la raiz del feature (fuera de domain/data/presentation),
      // por eso es el unico archivo autorizado a importar de ambas capas y unirlas.
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/features/*/domain/**',
              from: './src/features/*/data/**',
              message:
                'La capa "domain" no debe depender de "data". Invierte la dependencia usando una interfaz (repository) definida en domain.',
            },
            {
              target: './src/features/*/domain/**',
              from: './src/features/*/presentation/**',
              message: 'La capa "domain" no debe depender de "presentation".',
            },
            {
              target: './src/features/*/data/**',
              from: './src/features/*/presentation/**',
              message: 'La capa "data" no debe depender de "presentation".',
            },
            {
              target: './src/features/*/presentation/**',
              from: './src/features/*/data/**',
              message:
                'La capa "presentation" no debe instanciar clases concretas de "data" directamente. Usa el composition root del feature (container.ts) para inyectar la dependencia.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
    rules: {
      'max-lines-per-function': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
