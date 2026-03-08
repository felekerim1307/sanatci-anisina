import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;

        // 1. Önce fotoğrafın URL'sini bul
        const [rows]: any = await pool.query('SELECT image_url FROM photos WHERE id = ?', [id]);

        if (rows.length > 0) {
            const imageUrl = rows[0].image_url;

            // 2. Eğer yerel bir dosyaysa fiziksel olarak sil
            if (imageUrl && imageUrl.startsWith('/galeri/')) {
                const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (fsError) {
                    console.error("Fiziksel dosya silme hatası:", fsError);
                }
            }
        }

        // 3. Veritabanından kaydı sil
        await pool.query('DELETE FROM photos WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: 'Fotoğraf başarıyla silindi' });
    } catch (error: any) {
        console.error("Silme hatası:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const body = await req.json();
        const { title, image_url } = body;

        if (!image_url) {
            return NextResponse.json({ success: false, message: 'Fotoğraf URL\'si zorunludur' }, { status: 400 });
        }

        // ESKİ DOSYAYI BUL VE İHTİYAÇ VARSA FİZİKSEL YENİDEN ADLANDIR
        const [rows]: any = await pool.query('SELECT image_url FROM photos WHERE id = ?', [id]);
        if (rows.length > 0) {
            const oldUrl = rows[0].image_url;

            // Eğer URL değişmişse ve her ikisi de yerel sunucu yollarıysa (örn: /galeri/eski.jpg -> /galeri/yeni.jpg)
            if (oldUrl !== image_url && oldUrl.startsWith('/') && image_url.startsWith('/')) {
                const oldPath = path.join(process.cwd(), 'public', oldUrl.replace(/^\//, ''));
                const newPath = path.join(process.cwd(), 'public', image_url.replace(/^\//, ''));

                try {
                    if (fs.existsSync(oldPath)) {
                        fs.renameSync(oldPath, newPath);
                    }
                } catch (fsError) {
                    console.error("Dosya yeniden adlandırma hatası:", fsError);
                    // Dosya işlemleri patlasa bile veritabanı adını güncelleyebiliriz (veya hata dönebiliriz).
                    // Basitlik için sadece hata bastırıyoruz.
                }
            }
        }

        await pool.query(
            'UPDATE photos SET title = ?, image_url = ? WHERE id = ?',
            [title || '', image_url, id]
        );

        return NextResponse.json({ success: true, message: 'Fotoğraf düzenlendi' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
