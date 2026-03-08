import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-cihan-unat-key-2024');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // 1. Veritabanından kullanıcıyı bul
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
        }

        const admin = rows[0];

        // 2. Şifreyi doğrula
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
        }

        // 3. JWT oluştur (Başarılı)
        const token = await new SignJWT({ userId: admin.id, username: admin.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h') // 24 saat geçerli
            .sign(JWT_SECRET);

        // 4. Çerezi ayarla (Cookie ile)
        const response = NextResponse.json({ success: true, message: 'Giriş başarılı' });
        response.cookies.set({
            name: 'admin_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 gün
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 });
    }
}
