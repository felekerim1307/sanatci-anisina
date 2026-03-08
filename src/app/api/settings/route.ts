import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

// Ayarları getir (GET)
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM settings');

        // Key-value objesine çevir
        const settings = rows.reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ success: false, message: 'Ayarlar getirilemedi' }, { status: 500 });
    }
}

// Ayarları güncelle (POST)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Gelen her bir ayar anahtarını veritabanında güncelle
        for (const [key, value] of Object.entries(body)) {
            if (typeof value === 'string') {
                await pool.query(
                    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                    [key, value, value]
                );
            }
        }

        return NextResponse.json({ success: true, message: 'Ayarlar güncellendi' });
    } catch (error) {
        console.error('Settings POST Error:', error);
        return NextResponse.json({ success: false, message: 'Ayarlar güncellenemedi' }, { status: 500 });
    }
}
