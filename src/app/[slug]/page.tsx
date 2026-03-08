import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import 'react-quill-new/dist/quill.snow.css'; // Quill metin hizalama ve tüm stillerin (Admin ile birebir aynı) okunabilmesi için gerekli

export const dynamic = 'force-dynamic';

async function getSettings() {
    const baseUrl = process.env.NODE_ENV === 'production'
        ? `http://localhost:3001`
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    try {
        const res = await fetch(`${baseUrl}/api/settings`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data.success ? data.data : {};
    } catch (error) {
        return {};
    }
}

async function getPageBySlug(slug: string) {
    const baseUrl = process.env.NODE_ENV === 'production'
        ? `http://localhost:3001`
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    try {
        const res = await fetch(`${baseUrl}/api/pages/${slug}`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const p = await params;
    const page = await getPageBySlug(p.slug);

    if (!page) {
        return { title: 'Sayfa Bulunamadı' };
    }

    return {
        title: `${page.title} - Sanatçı Anısına`,
        description: page.content ? page.content.substring(0, 150).replace(/<[^>]*>?/gm, '') : '',
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const p = await params;
    const page = await getPageBySlug(p.slug);

    if (!page || !page.is_active || (page.is_visible !== undefined && !page.is_visible)) {
        notFound();
    }

    // İletişim sayfası için ayarları çek
    const settings = p.slug === 'iletisim' ? await getSettings() : {};

    return (
        <div className="w-full mx-auto px-6 md:px-12 lg:px-0 pt-32 pb-24 max-w-4xl relative z-10">
            {/* Sophisticated Classic Sayfa Başlığı */}
            <div className="mb-12 border-l-2 border-[#D4AF37] pl-6 md:pl-8 animate-fade-in-up">
                <div className="inline-block border-b border-[#D4AF37]/30 pb-1 mb-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-[#D4AF37] tracking-[0.2em] uppercase">
                        {page.title}
                    </h1>
                </div>
                <p className="text-neutral-200 font-light text-sm md:text-base max-w-2xl leading-relaxed opacity-90">
                    {page.subtitle || 'Detaylı bilgi ve içerik için aşağıya göz atabilirsiniz.'}
                </p>
            </div>

            {/* İçerik Alanı - Premium Typography */}
            {page.slug === 'iletisim' ? (
                <div
                    className="max-w-xl mx-auto space-y-4 animate-fade-in-up"
                    style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}
                >
                    {/* İletişim Bilgileri Kartları */}
                    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-5 hover:border-[#D4AF37]/30 transition-all duration-500 group">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Yetkili / İsim</p>
                            <p className="text-lg text-neutral-200 font-light">{settings.contact_name || 'Erim Felek'}</p>
                        </div>
                    </div>

                    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-5 hover:border-[#D4AF37]/30 transition-all duration-500 group">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Telefon</p>
                            <a href={`tel:${(settings.contact_phone || '05414822828').replace(/\s/g, '')}`} className="text-lg text-neutral-200 font-light hover:text-[#D4AF37] transition-colors">{settings.contact_phone || '0541 482 28 28'}</a>
                        </div>
                    </div>

                    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-5 hover:border-[#D4AF37]/30 transition-all duration-500 group">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">E-Posta</p>
                            <a href={`mailto:${settings.contact_email || 'erimfelek@rootbilisim.com'}`} className="text-lg text-neutral-200 font-light hover:text-[#D4AF37] transition-colors">{settings.contact_email || 'erimfelek@rootbilisim.com'}</a>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] admin-quill-wrapper animate-fade-in-up"
                    style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}
                >
                    <div className="ql-container ql-snow" style={{ border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}>
                        <div
                            className="ql-editor max-w-none p-6 md:p-12 lg:p-16"
                            dangerouslySetInnerHTML={{ __html: page.content || '' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
