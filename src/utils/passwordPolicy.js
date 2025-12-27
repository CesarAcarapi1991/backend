export const MAX_INTENTOS = 5;
export const BLOQUEO_MINUTOS = 15;
export const PASSWORD_DIAS_VIGENCIA = 90;

export const passwordExpirada = (fecha) => {
  const hoy = new Date();
  const diff = (hoy - new Date(fecha)) / (1000 * 60 * 60 * 24);
  return diff > PASSWORD_DIAS_VIGENCIA;
};

const palabrasProhibidas = [
  'password', 'admin', '123456', 'qwerty',
  'inventario', 'ventas', 'usuario'
];

export const evaluarPassword = (password, opciones = {}) => {
  const {
    minLength = 20,
    requireSpecial = true,
    specialChars = '!@#$%^&*()_+-=[]{};:\'",.<>/?',
  } = opciones;

  const resultado = {
    valido: true,
    errores: [],
    score: 0,
    nivel: 'Débil'
  };

  // Longitud
  if (password.length < minLength) {
    resultado.valido = false;
    resultado.errores.push(`Debe tener al menos ${minLength} caracteres`);
  } else {
    resultado.score += 3;
  }

  // Mayúsculas
  if (/[A-Z]/.test(password)) resultado.score += 1;
  else resultado.errores.push('Debe incluir mayúsculas');

  // Minúsculas
  if (/[a-z]/.test(password)) resultado.score += 1;
  else resultado.errores.push('Debe incluir minúsculas');

  // Números
  if (/\d/.test(password)) resultado.score += 1;
  else resultado.errores.push('Debe incluir números');

  // Caracteres especiales
  const specialRegex = new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
  if (requireSpecial && specialRegex.test(password)) {
    resultado.score += 2;
  } else {
    resultado.valido = false;
    resultado.errores.push('Debe incluir caracteres especiales');
  }

  // Palabras prohibidas
  for (const palabra of palabrasProhibidas) {
    if (password.toLowerCase().includes(palabra)) {
      resultado.valido = false;
      resultado.errores.push(`No debe contener palabras comunes (${palabra})`);
      break;
    }
  }

  // Nivel de criticidad
  if (resultado.score >= 8) resultado.nivel = 'Muy Fuerte';
  else if (resultado.score >= 6) resultado.nivel = 'Fuerte';
  else if (resultado.score >= 4) resultado.nivel = 'Media';

  return resultado;
};
