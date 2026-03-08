'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // Login sayfasındaysak sol menüyü (sidebar) gösterme
    if (pathname === '/admin/login') return null;

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <aside className="w-64 bg-black border-r border-[#D4AF37]/20 flex flex-col shrink-0">
            <div className="p-6">
                <h2 className="text-xl font-bold text-[#D4AF37] tracking-wider">YÖNETİM</h2>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Link href="/admin/ayarlar" className="block px-4 py-2 rounded text-neutral-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors text-sm">
                    Genel Ayarlar
                </Link>
                <Link href="/admin/sayfalar" className="block px-4 py-2 rounded text-neutral-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors text-sm">
                    Sayfalar
                </Link>
                <Link href="/admin/ani-defteri" className="block px-4 py-2 rounded text-neutral-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors text-sm">
                    Anı Defteri (Onay)
                </Link>
                <Link href="/admin/fotograflar" className="block px-4 py-2 rounded text-neutral-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors text-sm">
                    Fotoğraflar (Galeri)
                </Link>
                <Link href="/admin/videolar" className="block px-4 py-2 rounded text-neutral-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors text-sm">
                    Videolar
                </Link>
            </nav>
            <div className="p-4 border-t border-[#D4AF37]/20">
                <Link href="/" className="block text-center px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    &larr; Ana Site
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full mt-2 text-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded transition-colors"
                >
                    Güvenli Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
