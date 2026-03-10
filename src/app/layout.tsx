import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cihan Unat ∞ Hatırasına Saygıyla',
  description: 'Sanat asla ölmez...',
};

// Layout'un her zaman sunucuda (SSR) render edilmesini zorla ve veritabanına bağlan
export const dynamic = 'force-dynamic';

async function getLayoutData() {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? `http://localhost:3001`
    : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  const [settingsRes, pagesRes] = await Promise.all([
    fetch(`${baseUrl}/api/settings`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/pages?visibleOnly=true`, { cache: 'no-store' })
  ]);

  const settingsData = settingsRes.ok ? await settingsRes.json() : { data: {} };
  const pagesData = pagesRes.ok ? await pagesRes.json() : { data: [] };

  return {
    settings: settingsData.data || {},
    pages: pagesData.data || []
  };
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, pages } = await getLayoutData();

  const themeDark = settings.theme_dark || '#1a1a1a';
  const themeGold = settings.theme_gold || '#D4AF37';

  // CSS Değişkenlerini kök elemana tanımla
  const themeStyles = {
    '--theme-dark': themeDark,
    '--theme-gold': themeGold,
  } as React.CSSProperties;

  return (
    <html lang="tr">
      <body className={`${inter.className} bg-[var(--theme-dark)] text-neutral-200 antialiased min-h-screen flex flex-col`} style={themeStyles}>

        {/* Navigation Header (Tam Şeffaf ve İç içe geçmiş overlay, Hafif Flu) */}
        <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-transparent transition-all duration-300">
          <div className="container mx-auto px-6 lg:px-12 xl:px-24 py-6 flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <Link href="/" className="text-3xl md:text-4xl font-serif tracking-wide text-[var(--theme-gold)] drop-shadow-md leading-none">
                {settings.site_title || 'Cihan Unat ∞'}
              </Link>
              <span className="text-xs md:text-sm text-white/90 font-light mt-2 drop-shadow-sm">
                {settings.site_subtitle || 'Bestekâr · Ses Sanatçısı · Koro Şefi'}
              </span>
            </div>

            <Navigation pages={pages.filter((p: any) => p.is_active && p.slug !== 'ani-defteri' && p.slug !== 'fotograflar' && p.slug !== 'iletisim')} />
          </div>
        </header>

        {/* Main Content Render (Artık mt-20 yok, sayfa direkt tepeden başlıyor) */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-12 mt-auto border-t border-[var(--theme-gold)]/10 text-neutral-500 bg-black/20 backdrop-blur-sm relative z-50">
          <div className="container mx-auto px-6 flex flex-col items-center justify-center space-y-4">

            {/* Üst Metin Kartı */}
            <div className="text-center space-y-2">
              <p className="text-sm md:text-[15px] font-light tracking-wide text-neutral-400">
                {settings.footer_copyright || '© 2025 Cihan Unat Resmi Arşiv | Tüm hakları saklıdır.'}
              </p>
              <p className="text-xs md:text-sm font-light text-[var(--theme-gold)]/80 tracking-widest uppercase">
                {settings.footer_subtitle || 'Aile tarafından yönetilmektedir.'}
              </p>
              <p className="text-sm md:text-base font-medium text-[var(--theme-gold)] tracking-widest uppercase mt-2 flex items-center justify-center gap-2">
                {settings.footer_title || 'Saygıyla anıyoruz'} <span className="text-xl leading-none">∞</span>
              </p>
            </div>

            {/* İnce Çizgi Ayırıcı */}
            <div className="w-12 h-[1px] bg-[var(--theme-gold)]/20" />

            {/* Alt Link Ortak Yüzeyi */}
            <div className="flex items-center gap-4 text-xs tracking-wider uppercase font-medium">
              <Link href="/iletisim" className="hover:text-[var(--theme-gold)] transition-colors opacity-60 hover:opacity-100">
                İletişim
              </Link>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
