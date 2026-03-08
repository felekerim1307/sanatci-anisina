'use client';

import { useState, useEffect, useRef } from 'react';

export default function AniDefteriPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', message: '', image: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Sadece onaylı mesajları getir
    useEffect(() => {
        fetch('/api/guestbook')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessages(data.data);
                }
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');

        try {
            const res = await fetch('/api/guestbook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setSubmitStatus('success');
                setSubmitMessage(data.message);
                setFormData({ name: '', email: '', message: '', image: '' }); // Formu temizle
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Bir hata oluştu.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Bağlantı kurulamadı.');
        }
    };

    return (
        <div className="container mx-auto px-6 pt-32 pb-12 max-w-5xl relative z-10">
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .snap-x-mandatory { scroll-snap-type: x mandatory; scroll-behavior: smooth; }
            `}} />

            <div className="mb-12 border-b border-[#D4AF37]/20 pb-6 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-light text-[#D4AF37] mb-4 tracking-wide">
                    Anı Defteri
                </h1>
                <p className="text-neutral-300 text-lg font-light tracking-wide">
                    Cihan Unat ile ilgili duygularınızı ve anılarınızı paylaşabilirsiniz..
                </p>
            </div>

            {/* Antrasit Gri Flu Premium Mesaj Gönderme Formu */}
            <div className="max-w-3xl mx-auto bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-lg p-6 md:p-8 mb-16 shadow-2xl animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                {/* İnce Işık Efektleri */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-lg text-white font-light tracking-widest uppercase text-[#D4AF37]/80">Mesaj Bırakın</h2>
                    <div className="w-10 h-[1px] bg-[#D4AF37]/30 mx-auto mt-3"></div>
                </div>

                {submitStatus === 'success' ? (
                    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37] p-5 rounded-md text-center backdrop-blur-sm relative z-10 text-sm">
                        <span className="block text-xl mb-1">✨</span>
                        {submitMessage}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* İsim Soyisim */}
                            <div className="space-y-1.5">
                                <label className="block text-xs text-[#D4AF37]/60 font-light tracking-wider uppercase">Adınız Soyadınız *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/30 border-b border-neutral-700/50 p-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/70 transition-colors placeholder:text-neutral-700"
                                    placeholder="Örn. Ahmet Yılmaz"
                                />
                            </div>

                            {/* E-posta (Gizli) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs text-[#D4AF37]/60 font-light tracking-wider uppercase">E-Posta (Gizli) *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/30 border-b border-neutral-700/50 p-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/70 transition-colors placeholder:text-neutral-700"
                                    placeholder="ornek@posta.com"
                                />
                            </div>

                            {/* Profil Görseli Linki */}
                            <div className="space-y-1.5">
                                <label className="block text-xs text-[#D4AF37]/60 font-light tracking-wider uppercase">Fotoğraf URL (Opsiyonel)</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-black/30 border-b border-neutral-700/50 p-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/70 transition-colors placeholder:text-neutral-700"
                                    placeholder="https://"
                                />
                            </div>
                        </div>

                        {/* Mesaj */}
                        <div className="space-y-1.5 pt-2">
                            <label className="block text-xs text-[#D4AF37]/60 font-light tracking-wider uppercase">Mesajınız *</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-black/30 border border-neutral-800/50 rounded-md p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-neutral-700 resize-none"
                                placeholder="Duygularınızı buraya yazabilirsiniz..."
                            />
                        </div>

                        {submitStatus === 'error' && (
                            <p className="text-red-400 text-xs text-center">{submitMessage}</p>
                        )}

                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                disabled={submitStatus === 'loading'}
                                className="bg-transparent border border-[#D4AF37]/80 text-[#D4AF37]/90 hover:bg-[#D4AF37] hover:text-black font-light tracking-widest uppercase py-2 px-10 text-xs rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#D4AF37] group inline-flex items-center gap-2"
                            >
                                {submitStatus === 'loading' ? 'Gönderiliyor...' : 'Gönder'}
                                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                            </button>
                            <p className="text-[10px] text-neutral-600 mt-4 tracking-wide font-light">
                                * E-posta adresiniz sayfada yayınlanmaz, sadece yöneticiler görebilir.
                            </p>
                        </div>
                    </form>
                )}
            </div>

            {/* Onaylı Mesajlar Listesi (Yatay Kaydırmalı Slider Tasarımı) */}
            <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
                <h2 className="text-2xl text-[#D4AF37] mb-8 font-light border-b border-neutral-800/50 pb-3 text-center md:text-left">Yayınlanan Anılar</h2>

                {loading ? (
                    <div className="text-neutral-500 text-center py-8">Mesajlar yükleniyor...</div>
                ) : messages.length === 0 ? (
                    <div className="text-neutral-500 text-center py-8 border border-neutral-800/20 rounded-lg bg-neutral-900/30 font-light text-sm">
                        Henüz hiç mesaj yayınlanmamış. İlk hatıranızı siz bırakın.
                    </div>
                ) : (
                    /* Yatay Scroll Container Wrapper */
                    <div className="relative group/slider w-full flex items-center">

                        {/* Sol Kaydırma Oku */}
                        <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
                            className="absolute left-0 z-20 w-12 h-12 rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300 md:opacity-0 md:group-hover/slider:opacity-100 -ml-2 md:-ml-6"
                        >
                            ←
                        </button>

                        {/* Asıl Scroll Edilen Div */}
                        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-6 pb-8 pt-4 px-2 md:px-8 snap-x-mandatory hide-scrollbar w-full">
                            {messages.map((msg: any) => {
                                const isLong = msg.message.length > 120;

                                return (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className="min-w-[300px] max-w-[300px] md:min-w-[340px] md:max-w-[340px] shrink-0 snap-center bg-zinc-900/50 backdrop-blur-md border border-zinc-700/30 hover:border-[#D4AF37]/40 cursor-pointer transition-all duration-500 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col relative group overflow-hidden"
                                    >
                                        {/* Kart İçi Hafif Hover Işığı */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                        {/* Kart Üst (Header) - Profil ve İsim */}
                                        <div className="flex items-center gap-4 mb-5 relative z-10">
                                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center">
                                                {msg.image ? (
                                                    <img src={msg.image} alt={msg.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[#D4AF37]/50 text-xl font-serif">♪</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium tracking-wide leading-tight">{msg.name}</h3>
                                                <span className="text-neutral-500 text-[10px] font-light tracking-wider uppercase">
                                                    {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Mesaj İçeriği */}
                                        <div className="relative z-10 flex-grow">
                                            <p className="text-neutral-300 font-light leading-relaxed text-sm italic whitespace-pre-wrap line-clamp-4">
                                                "{msg.message}"
                                            </p>
                                        </div>

                                        {/* Devamını Oku Tıklama İpucu */}
                                        {isLong && (
                                            <div className="mt-4 text-right relative z-10">
                                                <span className="text-[#D4AF37]/70 group-hover:text-[#D4AF37] text-[11px] font-light tracking-widest uppercase transition-colors inline-flex items-center gap-1">
                                                    Okumak için tıklayın <span className="text-lg leading-none transition-transform group-hover:translate-x-1">»</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sağ Kaydırma Oku */}
                        <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                            className="absolute right-0 z-20 w-12 h-12 rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300 md:opacity-0 md:group-hover/slider:opacity-100 -mr-2 md:-mr-6"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
            {/* Premium Okuma Modalı (Açılıp Kapanır) */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-fade-in-up">
                    {/* Arka plan overlay (koyu antrasit flu) */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        onClick={() => setSelectedMessage(null)}
                    ></div>

                    {/* Modal İçeriği */}
                    <div className="relative w-full max-w-4xl bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:max-h-[75vh]">
                        {/* Kapat Butonu */}
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-[#D4AF37] transition-colors bg-black/40 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-md"
                        >
                            ✕
                        </button>

                        {/* SOL KISIM - Metin ve İçerik */}
                        <div className="w-full md:w-[55%] h-full flex flex-col relative z-10 overflow-hidden">
                            {/* Mobilde arkada flu kalsın */}
                            <div className="md:hidden absolute inset-0 bg-[url('/images/ani-modal-bg.jpg')] bg-cover bg-top opacity-20 blur-[2px] pointer-events-none -z-10"></div>

                            {/* Modal Header Sabit Kısım - Sola Hizalı */}
                            <div className="pt-8 px-6 md:pt-12 md:px-10 flex flex-col items-start shrink-0">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-5 border border-[#D4AF37]/50 bg-black/50 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] shrink-0">
                                    {selectedMessage.image ? (
                                        <img src={selectedMessage.image} alt={selectedMessage.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#D4AF37]/50 text-4xl md:text-5xl font-serif">♪</span>
                                    )}
                                </div>
                                <h3 className="text-xl md:text-2xl text-[#D4AF37] font-light tracking-widest uppercase text-left">{selectedMessage.name}</h3>
                                <span className="text-neutral-500 text-[11px] md:text-xs font-light tracking-wider uppercase mt-1">
                                    {new Date(selectedMessage.created_at).toLocaleDateString('tr-TR')}
                                </span>
                                <div className="w-12 h-[1px] bg-[#D4AF37]/30 mt-6 md:mb-2"></div>
                            </div>

                            {/* Scroll Olabilen Uzun Metin Kısmı - Sola Hizalı */}
                            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 md:px-10 pb-10 mt-2">
                                <p className="text-neutral-200 font-light leading-relaxed text-[15px] md:text-[16px] text-left italic whitespace-pre-wrap">
                                    "{selectedMessage.message}"
                                </p>
                            </div>
                        </div>

                        {/* SAĞ KISIM - Sadece Sanatçı Görseli (Masaüstü) */}
                        <div className="hidden md:block w-full md:w-[45%] relative bg-[#18181b] shrink-0">
                            {/* Yumuşak Gradyan Geçiş Efekti (Soldan Sağa) */}
                            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#18181b] to-transparent z-10 pointer-events-none"></div>
                            {/* Tam Boy Görsel (Bulanıklık Yok) */}
                            <div className="absolute inset-0 bg-[url('/images/ani-modal-bg.jpg')] bg-cover bg-top opacity-60 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
