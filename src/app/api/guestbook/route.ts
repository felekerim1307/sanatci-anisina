import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import fs from 'fs';
import path from 'path';

// Onaylanmış anı defteri mesajlarını getir (Ziyaretçiler için)
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, name, message, created_at, image FROM guestbook WHERE is_approved = TRUE ORDER BY created_at DESC'
        );
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error('Guestbook GET Error:', error);
        return NextResponse.json({ success: false, message: 'Mesajlar getirilemedi' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = (formData.get('name') as string)?.trim().substring(0, 100);
        const email = formData.get('email') as string | null;
        const message = (formData.get('message') as string)?.trim().substring(0, 5000);
        const files = formData.getAll('files') as File[];

        if (!name || !message) {
            return NextResponse.json({ success: false, message: 'İsim ve mesaj alanları zorunludur' }, { status: 400 });
        }

        let finalImageUrls: string[] = [];
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 0) {
                    // Dosya Tipi Kontrolü
                    if (!ALLOWED_TYPES.includes(file.type)) {
                        continue; // Veya hata dönebiliriz, güvenli yol geçmek
                    }
                    // Dosya Boyutu Kontrolü
                    if (file.size > MAX_SIZE) {
                        continue;
                    }

                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const uploadDir = path.join(process.cwd(), 'public', 'guestbook_images');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const safeFileName = Date.now() + '_' + Math.floor(Math.random() * 1000) + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const savePath = path.join(uploadDir, safeFileName);

                    fs.writeFileSync(savePath, buffer);
                    finalImageUrls.push(`/guestbook_images/${safeFileName}`);
                }
            }
        }

        const imageVal = finalImageUrls.length > 0 ? JSON.stringify(finalImageUrls) : null;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO guestbook (name, email, image, message, is_approved) VALUES (?, ?, ?, ?, FALSE)',
            [name, email || null, imageVal, message]
        );

        return NextResponse.json({
            success: true,
            message: 'Mesajınız (ve varsa fotoğrafınız) alındı. Onaylandıktan sonra yayınlanacaktır.',
            id: result.insertId
        }, { status: 201 });
    } catch (error: any) {
        console.error('Guestbook POST Error:', error);
        return NextResponse.json({ success: false, message: 'Mesajınız iletilemedi, lütfen tekrar deneyin.' }, { status: 500 });
    }
}
