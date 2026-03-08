import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT id, filename, title, description, cover_image, is_youtube, video_url, rotation, created_at FROM videos WHERE is_active = 1 ORDER BY created_at DESC'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Videoları getirirken hata:', error);
        return NextResponse.json({ error: 'Videolar listelenemedi' }, { status: 500 });
    }
}
