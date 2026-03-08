import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Sadece veritabanında kayıtlı olan fotoğrafları getir (Source of Truth)
        const [rows] = await pool.query('SELECT * FROM photos ORDER BY created_at DESC');
        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        console.error("Fotoğraf listeleme hatası:", error);
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
