const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
    const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'sanatci_anisina' });
    try {
        const query = `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
        await pool.query(query);
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', ['admin']);
        if (rows.length === 0) {
            const hash = await bcrypt.hash('123456', 10);
            await pool.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', hash]);
            console.log('Admin account created: admin / 123456');
        } else {
            console.log('Admin account already exists.');
        }
    } catch (e) { console.error('Error:', e); }
    process.exit(0);
}
run();
