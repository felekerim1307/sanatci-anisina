import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file || file.size === 0) {
            return NextResponse.json({ success: false, message: 'Dosya seçilmedi veya boş' }, { status: 400 });
        }

        const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'];
        const MAX_SIZE = 20 * 1024 * 1024; // 20MB

        if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.mp3')) {
            return NextResponse.json({ success: false, message: 'Sadece MP3 ve WAV ses dosyalarına izin verilir.' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ success: false, message: 'Ses dosyası çok büyük (Maks 20MB).' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadDir = path.join(process.cwd(), 'public', 'music');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeFileName = 'slideshow_music' + path.extname(file.name);
        const savePath = path.join(uploadDir, safeFileName);

        fs.writeFileSync(savePath, buffer);

        // Zaman damgası ekleyelim ki cache sorunu olmasın (her saniye değişebilir)
        const fileUrl = `/music/${safeFileName}?v=${Date.now()}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, message: 'Dosya yüklenemedi' }, { status: 500 });
    }
}
