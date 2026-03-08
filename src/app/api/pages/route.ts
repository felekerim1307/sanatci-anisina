import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

// Tüm sayfaları listele (Menü ve Admin Listesi için)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visibleOnly = searchParams.get('visibleOnly') === 'true';

        // Eğer visibleOnly gönderilmişse sadece is_visible = 1 olanları seç
        let query = 'SELECT * FROM pages ORDER BY order_index ASC, created_at ASC';
        if (visibleOnly) {
            query = 'SELECT * FROM pages WHERE is_visible = 1 ORDER BY order_index ASC, created_at ASC';
        }

        const [rows] = await pool.query<RowDataPacket[]>(query);
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error('Pages GET Error:', error);
        return NextResponse.json({ success: false, message: 'Sayfalar getirilemedi' }, { status: 500 });
    }
}

// Yeni sayfa ekle
export async function POST(request: Request) {
    try {
        const { title, slug, subtitle, content, order_index, is_visible } = await request.json();

        if (!title || !slug) {
            return NextResponse.json({ success: false, message: 'Başlık ve slug gereklidir' }, { status: 400 });
        }

        const safeContent = content ? content.replace(/&nbsp;/g, ' ') : '';
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO pages (title, slug, subtitle, content, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)',
            [title, slug, subtitle || '', safeContent, parseInt(order_index) || 0, is_visible !== undefined ? is_visible : true]
        );

        return NextResponse.json({
            success: true,
            message: 'Sayfa eklendi',
            id: result.insertId
        }, { status: 201 });
    } catch (error: any) {
        console.error('Pages POST Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ success: false, message: 'Bu bağlantı adına sahip bir sayfa zaten var.' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Sayfa eklenirken bir hata oluştu' }, { status: 500 });
    }
}
