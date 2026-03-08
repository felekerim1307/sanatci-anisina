import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? `http://localhost:3001`
    : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  const [settingsRes, pagesRes] = await Promise.all([
    fetch(`${baseUrl}/api/settings`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/pages`, { cache: 'no-store' })
  ]);

  const settingsData = settingsRes.ok ? await settingsRes.json() : { data: {} };
  const pagesData = pagesRes.ok ? await pagesRes.json() : { data: [] };

  return {
    settings: settingsData.data || {},
    pages: pagesData.data || []
  };
}

export default async function Home() {
  const { settings, pages } = await getHomeData();

  const heroImage = settings.hero_image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop';
  const heroText = settings.hero_text || 'Sanat asla ölmez, eserlerde daima yaşar...';
  const heroSubtext = settings.hero_subtext || `"Cihan Unat’ın sanat yolculuğu;\nbir bestekârın, bir eğitimcinin,\nbir eşin, bir babanın,\nbir ağabeyin, bir dedenin ve\nbir gönül insanının hikâyesidir."`;

  // Yazı boyutu ayarları
  const heroTextSize = settings.hero_text_size || 'medium';
  const heroSubtextSize = settings.hero_subtext_size || 'medium';

  const getHeroTextClasses = (size: string) => {
    switch (size) {
      case 'small': return 'text-xl md:text-2xl lg:text-3xl';
      case 'large': return 'text-3xl md:text-4xl lg:text-5xl';
      case 'xlarge': return 'text-4xl md:text-5xl lg:text-6xl';
      case 'medium':
      default: return 'text-2xl md:text-3xl lg:text-4xl';
    }
  };

  const getHeroSubtextClasses = (size: string) => {
    switch (size) {
      case 'small': return 'text-xs md:text-sm';
      case 'large': return 'text-base md:text-lg';
      case 'xlarge': return 'text-lg md:text-xl';
      case 'medium':
      default: return 'text-sm md:text-base';
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Background Hero Image - Doğrudan Tam Ekran (Cover), Menünün Altından İtibaren Başlar */}
      <div className="absolute top-[112px] bottom-0 inset-x-0 z-0 bg-[#0a0a0a]">
        <Image
          src={heroImage}
          alt="Sanatçı Görseli"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_top] md:object-[center_15%] transition-all duration-[2000ms] ease-in-out opacity-95"
        />

        {/* Koyu renk geçici katman - Soldaki yazıların okunaklılığı ve geçiş yumuşaklığı için */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />

        {/* Sol ve Sağ Kenarlardan Merkeze Doğru Yumuşak Siyah Geçiş (Vignette) */}
        <div className="absolute inset-y-0 left-0 w-1/4 md:w-1/3 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/4 md:w-1/3 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
      </div>

      {/* Main Content (Text) - Sol alt köşeye doğru minimal ve premium */}
      <div className="absolute top-[55%] md:top-[60%] left-6 md:left-16 lg:left-24 xl:left-32 -translate-y-1/2 z-10 max-w-lg text-left">
        <h1 className={`${getHeroTextClasses(heroTextSize)} font-light leading-tight tracking-wide text-[#f5ebd7] opacity-0 animate-fade-in-up whitespace-pre-line drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]`}
          style={{
            animationDelay: '0.3s',
            animationFillMode: 'forwards',
          }}>
          {heroText}
        </h1>

        <div className="mt-8 pl-4 border-l-2 border-[#D4AF37]/50 opacity-0 animate-fade-in-up md:max-w-md"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <p className={`text-[#D4AF37]/90 ${getHeroSubtextClasses(heroSubtextSize)} font-light leading-relaxed drop-shadow-md whitespace-pre-line`}>
            {heroSubtext}
          </p>
        </div>
      </div>

      {/* Call to Navigation or specific actions */}
      {settings.show_home_banner !== 'false' && (
        <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-10 w-full flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-0 animate-fade-in-up px-6"
          style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          {/* Admin panelindeki aktif sayfalar */}
          {pages.filter((p: any) => p.is_active && p.slug !== 'ani-defteri').map((page: any) => (
            <Link
              key={page.id}
              href={`/${page.slug}`}
              className="w-full sm:w-auto text-center border border-[#D4AF37]/40 text-neutral-300 px-8 py-3 tracking-widest uppercase text-sm hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
            >
              {page.title}
            </Link>
          ))}
          {/* Sabit Anı Defteri butonu */}
          <Link
            href="/ani-defteri"
            className="w-full sm:w-auto text-center border border-[#D4AF37]/40 text-neutral-300 px-8 py-3 tracking-widest uppercase text-sm hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
          >
            Anı Defteri
          </Link>
        </div>
      )}
    </div>
  );
}
