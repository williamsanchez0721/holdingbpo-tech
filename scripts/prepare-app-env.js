const fs = require('fs');
const os = require('os');
const path = require('path');

const APP_ENV_PATH = path.join(__dirname, '..', 'app', '.env');
const API_URL_VAR = 'EXPO_PUBLIC_API_URL';
const PORT = process.env.PORT || 3000;

function isPrivateIPv4(address) {
  return (
    /^10\./.test(address) ||
    /^192\.168\./.test(address) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(address)
  );
}

function findLanIPv4() {
  const interfaces = os.networkInterfaces();

  for (const addresses of Object.values(interfaces)) {
    for (const info of addresses || []) {
      if (info.family === 'IPv4' && !info.internal && isPrivateIPv4(info.address)) {
        return info.address;
      }
    }
  }

  return null;
}

function readExistingEnv() {
  if (!fs.existsSync(APP_ENV_PATH)) {
    return null;
  }
  return fs.readFileSync(APP_ENV_PATH, 'utf8');
}

function main() {
  const lanIp = findLanIPv4();
  const existing = readExistingEnv();

  if (!lanIp) {
    if (!existing) {
      console.warn(
        '[prepare-app-env] No se detectó una IP de red local. Corré `cp app/.env.example app/.env` ' +
          'y completá EXPO_PUBLIC_API_URL a mano (ver app/.env.example).',
      );
    }
    return;
  }

  const apiUrl = `http://${lanIp}:${PORT}/api`;
  const line = `${API_URL_VAR}=${apiUrl}\n`;

  if (existing && existing.includes(`${API_URL_VAR}=`)) {
    console.warn(
      `[prepare-app-env] app/.env ya existe, se respeta tu valor de ${API_URL_VAR}. ` +
        `Si necesitás el detectado automáticamente, es: ${apiUrl}`,
    );
    return;
  }

  fs.writeFileSync(APP_ENV_PATH, (existing ?? '') + line);
  console.warn(`[prepare-app-env] app/.env configurado con ${API_URL_VAR}=${apiUrl}`);
  console.warn(
    '[prepare-app-env] Asegurate de que tu celular con Expo Go esté en la misma red Wi-Fi que esta computadora.',
  );
}

main();
