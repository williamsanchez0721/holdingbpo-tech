import { useEffect, useState } from 'react';

import { getReservedUsernameUseCase } from '@features/auth/container';

const DEFAULT_USERNAME = 'Usuario';

export function useReservedUsername(): string {
  const [username, setUsername] = useState(DEFAULT_USERNAME);

  useEffect(() => {
    let isMounted = true;

    getReservedUsernameUseCase()
      .then((result) => {
        if (isMounted && result) {
          setUsername(result);
        }
      })
      .catch(() => {
        console.warn('No se pudo obtener el nombre de usuario reservado.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return username;
}
