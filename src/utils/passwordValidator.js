import { blacklist } from './passwordBlacklist.js';

export const validarPassword = (password) => {
  let score = 0;
  const errores = [];

  if (password.length < 20) {
    errores.push('Debe tener mínimo 20 caracteres');
  } else score++;

  if (/[A-Z]/.test(password)) score++;
  else errores.push('Debe contener mayúsculas');

  if (/[a-z]/.test(password)) score++;
  else errores.push('Debe contener minúsculas');

  if (/\d/.test(password)) score++;
  else errores.push('Debe contener números');

  if (/[@$!%*?&#._-]/.test(password)) score++;
  else errores.push('Debe contener caracteres especiales');

  const contienePalabraProhibida = blacklist.some(p =>
    password.toLowerCase().includes(p)
  );

  if (contienePalabraProhibida) {
    errores.push('Contiene palabras no permitidas');
  } else score++;

  let nivel = 'Débil';
  if (score >= 6) nivel = 'Fuerte';
  else if (score >= 4) nivel = 'Media';

  return {
    valida: errores.length === 0,
    nivel,
    errores
  };
};
