import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' });

    // Auth Cookie'sini (JWT) sil
    response.cookies.delete('admin_token');

    return response;
}
