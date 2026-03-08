import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Videoların tutulduğu fiziksel klasör yolu
const VIDEOS_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos');

// Kategori senkronizasyon fonksiyonu (Klasördeki dosyaları DB ile eşleştirir)
async function syncVideos() {
    // Klasör yoksa oluştur
    if (!fs.existsSync(VIDEOS_DIR)) {
        fs.mkdirSync(VIDEOS_DIR, { recursive: true });
    }

    // Klasördeki dosyaları oku
    const files = fs.readdirSync(VIDEOS_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);
    });

    // Sadece fiziksel dosyalar olan (youtube olmayan) kayıtların listesini al
    const [rows]: any = await pool.query('SELECT filename FROM videos WHERE is_youtube = 0 OR is_youtube IS NULL');
    const dbVideosList = rows.map((r: any) => r.filename).filter(Boolean);

    const newFiles = files.filter(f => !dbVideosList.includes(f));

    // Yeni dosyalar varsa DB'ye otomatik ekle (İsmi başlık olarak ayarla)
    if (newFiles.length > 0) {
        for (const filename of newFiles) {
            // Uzantısız dosya ismini al (Tireleri ve alt tireleri boşluğa çevir)
            let title = path.basename(filename, path.extname(filename));
            title = title.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

            await pool.query(
                'INSERT INTO videos (type, filename, title, is_active, is_youtube) VALUES (?, ?, ?, ?, ?)',
                ['local', filename, title, true, 0]
            );
        }
    }

    // DB'de olup da klasörde olmayan fiziksel dosyaları pasife al veya db'den sil?
    // Güvenlik için sadece DB'den silebiliriz veya 'is_active = false' yapabiliriz.
    // Şimdilik klasörden silinen dosyaları DB'den tamamen siliyoruz (Temizlik)
    const missingInFolder = dbVideosList.filter((f: string) => !files.includes(f));
    if (missingInFolder.length > 0) {
        const placeholders = missingInFolder.map(() => '?').join(',');
        await pool.query(`DELETE FROM videos WHERE filename IN (${placeholders})`, missingInFolder);
    }
}

// Admin için tüm videoları getir
export async function GET() {
    try {
        await syncVideos();
        const [rows] = await pool.query('SELECT * FROM videos ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Videoları getirirken hata:', error);
        return NextResponse.json({ error: 'Videolar listelenemedi' }, { status: 500 });
    }
}

// Youtube Video Ekle (Manuel POST)
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { title, video_url } = data;

        if (!title || !video_url) {
            return NextResponse.json({ error: 'Başlık ve Video URL gerekli' }, { status: 400 });
        }

        await pool.query(
            'INSERT INTO videos (type, title, video_url, is_youtube, is_active) VALUES (?, ?, ?, ?, ?)',
            ['youtube', title, video_url, 1, true]
        );

        return NextResponse.json({ success: true, message: 'YouTube videosu eklendi' });
    } catch (error) {
        console.error('YouTube video eklerken hata:', error);
        return NextResponse.json({ error: 'YouTube videosu eklenemedi' }, { status: 500 });
    }
}

// Video detaylarını güncelle (Başlık, Açıklama, Kapak, Aktiflik)
export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, title, description, cover_image, is_active, order_index, rotation } = data;

        if (!id) {
            return NextResponse.json({ error: 'Video ID gerekli' }, { status: 400 });
        }

        await pool.query(
            'UPDATE videos SET title = ?, description = ?, cover_image = ?, is_active = ?, order_index = ?, rotation = ? WHERE id = ?',
            [title, description || null, cover_image || null, is_active !== false, order_index || 0, rotation || 0, id]
        );

        return NextResponse.json({ success: true, message: 'Video başarıyla güncellendi' });
    } catch (error) {
        console.error('Video güncellenirken hata:', error);
        return NextResponse.json({ error: 'Video güncellenemedi' }, { status: 500 });
    }
}

// Bir videoyu sil (Hem veritabanından hem fiziksel dosyayı)
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Video ID gerekli' }, { status: 400 });
        }

        const [rows]: any = await pool.query('SELECT filename FROM videos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Video bulunamadı' }, { status: 404 });
        }

        const filename = rows[0].filename;
        const filePath = path.join(VIDEOS_DIR, filename);

        // Fiziksel dosyayı sil (Eğer youtube değilse ve filename varsa)
        if (filename && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // DB'den sil
        await pool.query('DELETE FROM videos WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: 'Video ve dosyası silindi' });
    } catch (error) {
        console.error('Video silinirken hata:', error);
        return NextResponse.json({ error: 'Video silinemedi' }, { status: 500 });
    }
}
