import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Sayfa detayını getir
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const p = await params;
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM pages WHERE slug = ? LIMIT 1',
            [p.slug]
        );

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Sayfa bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Page Detail GET Error:', error);
        return NextResponse.json({ success: false, message: 'Sayfa detayı getirilemedi' }, { status: 500 });
    }
}

// Sayfayı güncelle
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const p = await params;
        const { title, subtitle, content, is_active, order_index, is_visible } = await request.json();

        const safeContent = content ? content.replace(/&nbsp;/g, ' ') : '';

        const [result] = await pool.query<any>(
            'UPDATE pages SET title = ?, subtitle = ?, content = ?, is_active = ?, order_index = ?, is_visible = ? WHERE slug = ?',
            [title, subtitle || '', safeContent, is_active ?? true, parseInt(order_index) || 0, is_visible ?? true, p.slug]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, message: 'Sayfa bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Sayfa başarıyla güncellendi' });
    } catch (error) {
        console.error('Page PUT Error:', error);
        return NextResponse.json({ success: false, message: 'Sayfa güncellenemedi' }, { status: 500 });
    }
}

// Sayfayı sil
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const p = await params;
        const [result] = await pool.query<any>('DELETE FROM pages WHERE slug = ?', [p.slug]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, message: 'Sayfa bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Sayfa başarıyla silindi' });
    } catch (error) {
        console.error('Page DELETE Error:', error);
        return NextResponse.json({ success: false, message: 'Sayfa silinemedi' }, { status: 500 });
    }
}
