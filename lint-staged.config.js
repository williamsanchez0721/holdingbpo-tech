module.exports = {
  'app/**/*.{ts,tsx,js,jsx,json,md}': () => [
    'npm run format --workspace=app',
    'npm run lint:fix --workspace=app',
  ],
  'server/**/*.{ts,js,json,md}': () => [
    'npm run format --workspace=server',
    'npm run lint:fix --workspace=server',
  ],
  '*.{json,md}': ['prettier --write'],
};
