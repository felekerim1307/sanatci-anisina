import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { newPassword } = await request.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ success: false, message: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, 'admin']);

        return NextResponse.json({ success: true, message: 'Şifre başarıyla güncellendi.' });
    } catch (error) {
        console.error('Şifre değiştirme hatası:', error);
        return NextResponse.json({ success: false, message: 'Şifre güncellenemedi.' }, { status: 500 });
    }
}
