const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetPassword() {
    const newPassword = process.argv[2];
    if (!newPassword) {
        console.log('Lütfen yeni şifreyi argüman olarak girin: node reset-password.js YENI_SIFRE');
        process.exit(1);
    }

    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

    const connection = await mysql.createConnection(dbConfig);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await connection.execute('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, 'admin']);
    console.log('Şifre başarıyla güncellendi!');
    await connection.end();
}

resetPassword().catch(err => console.error(err));
