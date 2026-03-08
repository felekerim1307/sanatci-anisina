'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ pages }: { pages: any[] }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const getLinkClasses = (path: string) => {
        const isActive = pathname === path;
        return `group relative text-[13px] lg:text-sm font-medium hover:text-[var(--theme-gold)] transition-colors uppercase tracking-widest drop-shadow-md pb-1 after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-[var(--theme-gold)] after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap ${isActive ? 'text-[var(--theme-gold)] after:w-full' : 'text-neutral-200 after:w-0'}`;
    };

    const getMobileLinkClasses = (path: string) => {
        const isActive = pathname === path;
        return `group w-full block text-right text-[15px] font-medium hover:text-[var(--theme-gold)] transition-colors uppercase tracking-widest py-4 border-b border-white/10 last:border-0 ${isActive ? 'text-[var(--theme-gold)]' : 'text-neutral-200'}`;
    };

    return (
        <>
            {/* Masaüstü Menüsü (md ve üzeri) */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                {pages.map((page: any) => (
                    <Link key={`desktop-${page.id}`} href={`/${page.slug}`} className={getLinkClasses(`/${page.slug}`)}>
                        {page.title}
                    </Link>
                ))}
                <Link href="/fotograflar" className={getLinkClasses('/fotograflar')}>
                    Fotoğraflar
                </Link>
                <Link href="/ani-defteri" className={getLinkClasses('/ani-defteri')}>
                    Anı Defteri
                </Link>
            </nav>

            {/* Mobil Hamburger Butonu (md altı) */}
            <button
                onClick={toggleMenu}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-2 z-50 text-[var(--theme-gold)] focus:outline-none"
                aria-label="Toggle Menu"
            >
                <span className={`block w-6 h-[2px] bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[10px]' : ''}`} />
                <span className={`block w-6 h-[2px] bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block w-6 h-[2px] bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
            </button>

            {/* Mobil Açılır Menü (Sağ Üste Hizalı Balkon) */}
            <div className={`fixed top-24 right-6 w-64 bg-black/95 border border-[#D4AF37]/20 rounded-xl shadow-2xl backdrop-blur-xl z-40 transform origin-top-right transition-all duration-300 ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col w-full px-6 py-2">
                    {pages.map((page: any) => (
                        <Link
                            key={`mobile-${page.id}`}
                            href={`/${page.slug}`}
                            className={getMobileLinkClasses(`/${page.slug}`)}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {page.title}
                        </Link>
                    ))}
                    <Link
                        href="/fotograflar"
                        className={getMobileLinkClasses('/fotograflar')}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Fotoğraflar
                    </Link>
                    <Link
                        href="/ani-defteri"
                        className={getMobileLinkClasses('/ani-defteri')}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Anı Defteri
                    </Link>
                </div>
            </div>
        </>
    );
}
