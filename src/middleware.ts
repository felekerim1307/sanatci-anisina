import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-cihan-unat-key-2024');

export async function middleware(request: NextRequest) {
    // Sadece /admin ile başlayan rotaları koru, ancak /admin/login rotasını serbest bırak
    const isApiRoute = request.nextUrl.pathname.startsWith('/api/admin');
    const isAdminPageRoute = request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login');

    if (isAdminPageRoute || isApiRoute) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            if (isApiRoute) {
                return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);

            // Kullanıcı /admin kök dizinine tıklarsa doğrudan /admin/sayfalar'a yönlendir.
            if (request.nextUrl.pathname === '/admin') {
                return NextResponse.redirect(new URL('/admin/sayfalar', request.url));
            }

            return NextResponse.next();
        } catch (error) {
            if (isApiRoute) {
                return NextResponse.json({ success: false, message: 'Geçersiz oturum' }, { status: 401 });
            }
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
