const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function syncPhotos() {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

    const connection = await mysql.createConnection(dbConfig);
    const galleryPath = path.join(process.cwd(), 'public', 'galeri');

    if (!fs.existsSync(galleryPath)) {
        console.log('Galeri klasörü bulunamadı.');
        process.exit(0);
    }

    const files = fs.readdirSync(galleryPath).filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    const [rows] = await connection.execute('SELECT image_url FROM photos');
    const existingUrls = rows.map(r => r.image_url);

    let count = 0;
    for (const file of files) {
        const url = `/galeri/${file}`;
        if (!existingUrls.includes(url)) {
            let title = file.split('.').slice(0, -1).join('.').replace(/[-_]/g, ' ');
            await connection.execute('INSERT INTO photos (title, image_url) VALUES (?, ?)', [title, url]);
            console.log(`Eklendi: ${file}`);
            count++;
        }
    }

    console.log(`İşlem tamam. ${count} yeni fotoğraf veritabanına bağlandı.`);
    await connection.end();
}

syncPhotos().catch(err => console.error(err));
