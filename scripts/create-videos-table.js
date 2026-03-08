const mysql = require('mysql2/promise');

async function createVideosTable() {
    console.log('Veritabanı bağlantısı kuruluyor...');

    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sanatci_anisina',
            charset: 'utf8mb4',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                cover_image VARCHAR(255) DEFAULT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await pool.query(createTableQuery);
        console.log('✅ "videos" tablosu oluşturuldu (veya zaten mevcut).');

        process.exit(0);
    } catch (error) {
        console.error('❌ Tablo oluşturulurken hata oluştu:', error);
        process.exit(1);
    }
}

createVideosTable();
