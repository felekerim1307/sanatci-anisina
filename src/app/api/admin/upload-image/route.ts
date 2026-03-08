import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ success: false, message: 'Lütfen bir resim dosyası seçin' }, { status: 400 });
        }

        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ success: false, message: 'Sadece JPG, PNG ve WEBP resimlerine izin verilir.' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ success: false, message: 'Dosya boyutu çok büyük (Maks 10MB).' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const safeFileName = 'hero_' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const savePath = path.join(uploadDir, safeFileName);
        fs.writeFileSync(savePath, buffer);

        const fileUrl = `/uploads/${safeFileName}`; // Kayıt yolu

        return NextResponse.json({
            success: true,
            message: 'Resim başarıyla yüklendi',
            url: fileUrl
        });

    } catch (error: any) {
        console.error('Image Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Resim yüklenirken bir hata oluştu: ' + error.message }, { status: 500 });
    }
}
