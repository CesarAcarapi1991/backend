// import bcrypt from 'bcrypt';
// import { pool } from '../src/config/db.js';

// const crearAdmin = async () => {
//   const passwordHash = await bcrypt.hash('admin123', 10);

//   const rol = await pool.query(
//     "SELECT id FROM roles WHERE nombre = 'ADMIN'"
//   );

//   await pool.query(
//     `INSERT INTO usuarios (nombre, email, password, rol_id)
//      VALUES ($1, $2, $3, $4)`,
//     ['Administrador', 'admin@admin.com', passwordHash, rol.rows[0].id]
//   );

//   console.log('✅ Usuario ADMIN creado');
//   process.exit();
// };

// crearAdmin();


import bcrypt from 'bcrypt';
import { pool } from '../src/config/db.js';

const crearAdmin = async () => {
  try {
    // 🔐 Password fuerte (solo para bootstrap)
    const passwordPlano = 'Admin@2025!PasswordSuperSeguro';
    const passwordHash = await bcrypt.hash(passwordPlano, 12);

    // 🔎 Obtener rol ADMIN
    const rolResult = await pool.query(
      "SELECT id FROM roles WHERE nombre = 'ADMIN'"
    );

    if (rolResult.rows.length === 0) {
      console.error('❌ El rol ADMIN no existe');
      process.exit(1);
    }

    const rolId = rolResult.rows[0].id;

    // 👤 Crear usuario ADMIN
    await pool.query(
      `INSERT INTO usuarios 
       (nombre, email, password, rol_id, estado, intentos_fallidos, bloqueado_hasta, password_updated_at)
       VALUES ($1, $2, $3, $4, true, 0, NULL, NOW())
       ON CONFLICT (email) DO NOTHING`,
      [
        'Administrador',
        'admin@admin.com',
        passwordHash,
        rolId
      ]
    );

    console.log('✅ Usuario ADMIN creado correctamente');
    console.log('📧 Email: admin@admin.com');
    console.log('🔐 Password inicial: Admin@2025!PasswordSuperSeguro');
    console.log('⚠️ Cambiar contraseña en el primer login');

    process.exit();
  } catch (error) {
    console.error('❌ Error al crear ADMIN:', error);
    process.exit(1);
  }
};

crearAdmin();
