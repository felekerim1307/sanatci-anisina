import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Admin için Tümü veya Sadece Onay Bekleyenleri Getir
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM guestbook ORDER BY created_at DESC'
        );
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Mesajlar getirilemedi' }, { status: 500 });
    }
}

// Mesajı Onayla (is_approved = TRUE yap)
export async function PUT(request: Request) {
    try {
        const { id, is_approved, approved_images, name: rawName, message: rawMsgContent } = await request.json();

        if (!id) return NextResponse.json({ success: false, message: 'ID eksik' }, { status: 400 });

        const name = rawName?.trim().substring(0, 100);
        const msgContent = rawMsgContent?.trim().substring(0, 5000);

        // Mesajın içeriğini al
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM guestbook WHERE id = ?', [id]);
        if (rows.length === 0) return NextResponse.json({ success: false, message: 'Mesaj bulunamadı' }, { status: 404 });
        const message = rows[0];

        // Eski db'deki tüm orijinal resimler:
        let originalImages: string[] = [];
        try {
            originalImages = message.image ? (message.image.startsWith('[') ? JSON.parse(message.image) : [message.image]) : [];
        } catch {
            originalImages = message.image ? [message.image] : [];
        }

        const approvedList = approved_images || [];
        const imageVal = approvedList.length > 0 ? JSON.stringify(approvedList) : null;

        const [result] = await pool.query<any>(
            'UPDATE guestbook SET is_approved = ?, image = ?, name = ?, message = ? WHERE id = ?',
            [is_approved ? 1 : 0, imageVal, name || message.name, msgContent || message.message, id]
        );

        // Fotoğraf Galerisi tablosunu (photos) güncelleyelim
        // 1. Önce bu mesaja ait orijinal listedeki tüm resimleri galeriden temizle (varsa)
        if (originalImages.length > 0) {
            const placeholders = originalImages.map(() => '?').join(',');
            await pool.query(`DELETE FROM photos WHERE image_url IN (${placeholders})`, originalImages);
        }

        // 2. Eğer YAYINA ALINIYORSA, seçilen ONAYLI resimleri galeriye geri ekle
        if (is_approved && approvedList.length > 0) {
            for (const imgUrl of approvedList) {
                await pool.query(
                    'INSERT INTO photos (title, image_url) VALUES (?, ?)',
                    [`${message.name} - Anı Defteri Fotoğrafı`, imgUrl]
                );
            }
        }

        return NextResponse.json({ success: true, message: 'Mesaj durumu güncellendi ve galeri ile senkronize edildi' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Güncelleme başarısız' }, { status: 500 });
    }
}

// Mesajı Sil
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) return NextResponse.json({ success: false, message: 'ID eksik' }, { status: 400 });

        // Önce mesajı al ki, galerideki resmi de silebilelim
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM guestbook WHERE id = ?', [id]);
        if (rows.length > 0) {
            const message = rows[0];
            let originalImages: string[] = [];
            try {
                originalImages = message.image ? (message.image.startsWith('[') ? JSON.parse(message.image) : [message.image]) : [];
            } catch {
                originalImages = message.image ? [message.image] : [];
            }

            if (originalImages.length > 0) {
                const placeholders = originalImages.map(() => '?').join(',');
                await pool.query(`DELETE FROM photos WHERE image_url IN (${placeholders})`, originalImages);
            }
        }

        const [result] = await pool.query<any>(
            'DELETE FROM guestbook WHERE id = ?',
            [id]
        );

        return NextResponse.json({ success: true, message: 'Mesaj silindi' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Silme başarısız' }, { status: 500 });
    }
}
