import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Veritabanından gelen fotoğrafları al
        const [rows] = await pool.query('SELECT * FROM photos ORDER BY created_at DESC');
        let dbPhotos = rows as any[];

        // public/galeri klasöründen manuel eklenen fotoğrafları al
        const galleryPath = path.join(process.cwd(), 'public', 'galeri');
        let localPhotos: any[] = [];

        if (fs.existsSync(galleryPath)) {
            const files = fs.readdirSync(galleryPath);
            localPhotos = files
                .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
                .filter(file => !dbPhotos.some(p => p.image_url === `/galeri/${file}`))
                .map((file, index) => {
                    // Dosya istatistiklerini alarak eklenme tarihini bulalım
                    const stats = fs.statSync(path.join(galleryPath, file));
                    return {
                        id: 100000 + index, // DB çakışmasını engellemek için yüksek ID
                        title: file.split('.').slice(0, -1).join('.') || 'Galeri Fotoğrafı',
                        image_url: `/galeri/${file}`,
                        created_at: stats.mtime.toISOString(), // Son değiştirme tarihi
                        isLocal: true // Sadece silme arayüzünde filtrelemek için
                    };
                });
        }

        // Önce manuel lokal dosyaları, sonra veritabanındakileri birleştir
        let allPhotos = [...localPhotos, ...dbPhotos];

        // Fotoğrafları tarihe göre (En yeni ilk) sırala
        allPhotos = allPhotos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ success: true, data: allPhotos });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        let finalImageUrl = formData.get('image_url') as string;
        const file = formData.get('file') as File | null;

        // Eğer kullanıcı bir dosya seçtiyse onu public/galeri dizinine kaydet
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Güvenli dosya adı oluştur
            const safeFileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const savePath = path.join(process.cwd(), 'public', 'galeri', safeFileName);

            fs.writeFileSync(savePath, buffer);
            finalImageUrl = `/galeri/${safeFileName}`; // Kayıt yolu
        }

        if (!finalImageUrl) {
            return NextResponse.json({ success: false, message: 'Fotoğraf URL\'si veya dosyası zorunludur' }, { status: 400 });
        }

        const [result]: any = await pool.query(
            'INSERT INTO photos (title, image_url) VALUES (?, ?)',
            [title || '', finalImageUrl]
        );

        return NextResponse.json({ success: true, message: 'Fotoğraf başarıyla eklendi', id: result.insertId });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
