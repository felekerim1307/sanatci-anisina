'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function AniDefteriPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [files, setFiles] = useState<File[]>([]);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const [pageInfo, setPageInfo] = useState<any>(null);
    const [pageContent, setPageContent] = useState<string>("Cihan Unat ile ilgili duygularınızı ve anılarınızı paylaşabilir ve yazılanları okuyabilirsiniz.");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sadece onaylı mesajları getir
    useEffect(() => {
        fetch('/api/guestbook')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const parsedData = data.data.map((m: any) => {
                        let parsedImages: string[] = [];
                        if (m.image) {
                            if (m.image.startsWith('[')) {
                                try { parsedImages = JSON.parse(m.image); }
                                catch (e) { parsedImages = []; }
                            } else {
                                parsedImages = [m.image];
                            }
                        }
                        return { ...m, images: parsedImages };
                    });

                    setMessages(parsedData);
                }
                setLoading(false);
            });

        // Sayfa İçeriğini Getir (Admin panelinden HTML Editör ile girilen)
        fetch('/api/pages/ani-defteri')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setPageInfo(data.data);
                    if (data.data.content) setPageContent(data.data.content);
                }
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            if (formData.email) submitData.append('email', formData.email);
            submitData.append('message', formData.message);
            files.forEach(f => submitData.append('files', f));

            const res = await fetch('/api/guestbook', {
                method: 'POST',
                body: submitData
            });
            const data = await res.json();

            if (data.success) {
                setSubmitStatus('success');
                setSubmitMessage(data.message);
                setFormData({ name: '', email: '', message: '' });
                setFiles([]);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Bir hata oluştu.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Bağlantı kurulamadı.');
        }
    };

    // Modal İçi Yönlendirme (Prev / Next) Mantığı - Sonsuz Döngü
    const currentIndex = selectedMessage ? messages.findIndex(m => m.id === selectedMessage.id) : -1;

    // Eğer en baştaysa (0) en son mesajı 'prev' yap, değilse bir öncekini al
    const prevMessage = currentIndex !== -1
        ? (currentIndex === 0 ? messages[messages.length - 1] : messages[currentIndex - 1])
        : null;

    // Eğer en sondayken (length - 1) en baştaki mesajı (0) 'next' yap, değilse bir sonrakini al
    const nextMessage = currentIndex !== -1
        ? (currentIndex === messages.length - 1 ? messages[0] : messages[currentIndex + 1])
        : null;

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (prevMessage) setSelectedMessage(prevMessage);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (nextMessage) setSelectedMessage(nextMessage);
    };

    return (
        <div className="container mx-auto px-6 pt-32 pb-12 max-w-5xl relative z-10">
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .snap-x-mandatory { scroll-snap-type: x mandatory; scroll-behavior: smooth; }
                
                /* Okuma Metni İçin Özel Şık Scrollbar */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.6); }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(212,175,55,0.3) rgba(0,0,0,0.2); }
            `}} />



            <div className="mb-12 border-l-2 border-[#D4AF37] pl-6 md:pl-8 animate-fade-in-up relative z-10">
                <div className="inline-block border-b border-[#D4AF37]/30 pb-1 mb-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-[#D4AF37] tracking-[0.2em] uppercase">
                        {pageInfo?.title || 'Anı Defteri'}
                    </h1>
                </div>
                <p className="text-neutral-200 font-light text-sm md:text-base max-w-2xl leading-relaxed opacity-90">
                    {pageInfo?.subtitle || "Cihan Unat ile ilgili duygularınızı ve anılarınızı paylaşabilir ve yazılanları okuyabilirsiniz."}
                </p>
            </div>

            {/* Onaylı Mesajlar Listesi (Yatay Kaydırmalı Slider Tasarımı) */}
            <div className="animate-fade-in-up w-full mb-16" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
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

                        {/* Sol Kaydırma Oku - Sonsuz Döngü */}
                        <button
                            onClick={() => {
                                if (scrollContainerRef.current) {
                                    const { scrollLeft, scrollWidth } = scrollContainerRef.current;
                                    if (scrollLeft <= 5) {
                                        scrollContainerRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' }); // En başa gelince sona at
                                    } else {
                                        scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
                                    }
                                }
                            }}
                            className="absolute left-0 z-20 w-12 h-12 rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300 md:opacity-0 md:group-hover/slider:opacity-100 -ml-2 md:-ml-6"
                        >
                            ←
                        </button>

                        {/* Asıl Scroll Edilen Div - Eşit Boyutlu Kartlar */}
                        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-6 pb-8 pt-4 px-2 md:px-8 snap-x-mandatory hide-scrollbar w-full">
                            {messages.map((msg: any) => {
                                const isLong = msg.message.length > 120;

                                return (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className="w-[300px] md:w-[340px] h-[260px] shrink-0 snap-center bg-zinc-900/50 backdrop-blur-md border border-zinc-700/30 hover:border-[#D4AF37]/40 cursor-pointer transition-all duration-500 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col relative group overflow-hidden"
                                    >
                                        {/* Kart İçi Hafif Hover Işığı */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                        {/* Kart Arka Plan Görseli */}
                                        <div className="absolute inset-0 bg-[url('/images/ani-ana-modal-bg.jpg')] bg-cover bg-center opacity-[0.08] pointer-events-none -z-0"></div>

                                        {/* Kart Üst (Header) - Profil ve İsim */}
                                        <div className="flex items-center gap-4 mb-3 relative z-10 shrink-0">
                                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#D4AF37]/50 bg-black/50 flex items-center justify-center relative shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                                <span className="text-[#D4AF37] text-2xl font-serif relative z-10">𝄞</span>
                                            </div>
                                            <div>
                                                <h3 className="text-[#D4AF37] font-light tracking-[0.15em] uppercase text-sm leading-tight line-clamp-1 mt-1">{msg.name}</h3>
                                            </div>
                                        </div>

                                        {/* Ayırıcı Sarı Çizgi */}
                                        <div className="w-12 h-[1px] bg-[#D4AF37]/40 mb-5 relative z-10 shrink-0"></div>

                                        {/* Mesaj İçeriği */}
                                        <div className="relative z-10 flex-grow overflow-hidden">
                                            <p className="text-neutral-300 font-light leading-relaxed text-sm italic whitespace-pre-wrap line-clamp-4">
                                                "{msg.message}"
                                            </p>
                                        </div>

                                        {/* Devamını Oku Tıklama İpucu */}
                                        {isLong && (
                                            <div className="mt-4 text-right relative z-10 shrink-0">
                                                <span className="text-[#D4AF37]/70 group-hover:text-[#D4AF37] text-[11px] font-light tracking-widest uppercase transition-colors inline-flex items-center gap-1">
                                                    Okumak için tıklayın <span className="text-lg leading-none transition-transform group-hover:translate-x-1">»</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sağ Kaydırma Oku - Sonsuz Döngü */}
                        <button
                            onClick={() => {
                                if (scrollContainerRef.current) {
                                    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                                    if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5) {
                                        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' }); // En sona gelince başa at
                                    } else {
                                        scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
                                    }
                                }
                            }}
                            className="absolute right-0 z-20 w-12 h-12 rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300 md:opacity-0 md:group-hover/slider:opacity-100 -mr-2 md:-mr-6"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {/* Antrasit Gri Flu Premium Mesaj Gönderme Formu - ALTA ALINDI */}
            <div id="mesaj-form" ref={formRef} className="max-w-3xl mx-auto bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-lg p-6 md:p-8 mb-16 shadow-2xl animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                {/* İnce Işık Efektleri */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-lg text-white font-light tracking-widest uppercase text-[#D4AF37]/80">Anı Bırakın / Fotoğraf Ekleyin</h2>
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

                            {/* Profil Görseli veya Fotoğraf */}
                            <div className="space-y-1.5">
                                <label className="block text-xs text-[#D4AF37]/60 font-light tracking-wider uppercase">En fazla 10 Fotoğraf Ekle (Opsiyonel)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files) {
                                            let selected = Array.from(e.target.files);
                                            if (selected.length > 10) {
                                                alert('En fazla 10 fotoğraf seçebilirsiniz. İlk 10 fotoğraf eklenecektir.');
                                                selected = selected.slice(0, 10);
                                            }
                                            setFiles(selected);
                                        }
                                    }}
                                    className="w-full bg-black/30 border-b border-neutral-700/50 p-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/70 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30"
                                />
                                {files.length > 0 && <p className="text-[#D4AF37] text-xs mt-1">{files.length} fotoğraf seçildi.</p>}
                            </div>
                        </div>

                        {/* Mesaj */}
                        <div className="space-y-1.5 pt-2">
                            <label className="block text-xs text-[#D4AF37]/60 font-light tracking-wider uppercase">Anınız *</label>
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

            {/* Premium Okuma Modalı (Açılıp Kapanır) - Portal ile en üste taşındı */}
            {mounted && selectedMessage && createPortal(
                <div className="fixed inset-0 !z-[999999] flex items-start md:items-center justify-center p-4 pt-24 md:pt-4 md:p-10 animate-fade-in-up">
                    {/* Arka plan overlay (koyu antrasit flu) */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                        onClick={() => setSelectedMessage(null)}
                    ></div>

                    {/* Modal Wrapper for Navigation and Content */}
                    <div className="relative w-full max-w-4xl flex items-center justify-center z-[1000000]">

                        {/* Varsa Önceki Anı Oku (Çerçeveye Yaslı) */}
                        {prevMessage && (
                            <button
                                onClick={handlePrev}
                                className="hidden md:flex absolute -left-6 lg:-left-14 z-50 w-12 h-12 rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-md items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300"
                            >
                                ←
                            </button>
                        )}

                        {/* Modal İçeriği */}
                        <div className="w-full bg-zinc-900/95 backdrop-blur-2xl border border-[#D4AF37]/50 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] md:h-[80vh] min-h-0 relative z-[1000000]">

                            {/* Mobilde/Küçük Ekranlarda Tüm Modalı Kaplayan Arka Plan */}
                            <div className="md:hidden absolute inset-0 bg-[url('/images/ani-modal-bg.jpg')] bg-cover bg-top opacity-[0.12] pointer-events-none z-0"></div>

                            {/* Kapat Butonu */}
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-[#D4AF37] transition-colors bg-black/40 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-md"
                            >
                                ✕
                            </button>

                            {/* SOL KISIM - Metin ve İçerik */}
                            <div className="w-full flex-1 h-full min-h-0 md:w-[55%] flex flex-col relative z-10 overflow-hidden">
                                {/* Modal Header Kapsayıcı - Koyu alan çizgide biter */}
                                <div className="w-full shrink-0 relative z-20 bg-black/20 border-b border-[#D4AF37]/10">
                                    <div className="pt-1.5 pb-1.5 px-6 md:pt-4 md:pb-4 md:px-10 flex flex-row items-center gap-4">
                                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border border-[#D4AF37]/40 bg-black/50 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.1)] shrink-0 relative">
                                            <span className="text-[#D4AF37] text-lg md:text-2xl font-serif relative z-10">𝄞</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-sm md:text-lg text-[#D4AF37] font-light tracking-[0.2em] uppercase text-left leading-none">{selectedMessage.name}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Scroll Olabilen Uzun Metin Kısmı - Çizginin hemen altından başlıyor */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-10 pb-6 mt-0 relative min-h-0 z-10">
                                    <p className="text-neutral-200 font-light leading-relaxed text-[15px] md:text-[16px] text-left italic whitespace-pre-wrap break-words block w-full mb-8 pt-0">
                                        "{selectedMessage.message}"
                                    </p>

                                    {/* Mobil Sonraki İleri Tuşları Üstüste Binmemesi İçin Ek Boşluk */}
                                    <div className="h-8 md:hidden w-full"></div>
                                </div>

                                {/* Mobil için Prev/Next Okları Metin Altına (Sabitlenmiş shrink-0) */}
                                <div className="md:hidden flex justify-between items-center px-6 pb-6 pt-4 border-t border-[#D4AF37]/10 mt-auto shrink-0 bg-transparent">
                                    {prevMessage ? (
                                        <button onClick={handlePrev} className="text-[#D4AF37] text-sm flex items-center gap-2 hover:text-white transition-colors">
                                            ← Önceki
                                        </button>
                                    ) : <div></div>}
                                    {nextMessage && (
                                        <button onClick={handleNext} className="text-[#D4AF37] text-sm flex items-center gap-2 hover:text-white transition-colors">
                                            Sonraki →
                                        </button>
                                    )}
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

                        {/* Varsa Sonraki Anı Oku (Çerçeveye Yaslı) */}
                        {nextMessage && (
                            <button
                                onClick={handleNext}
                                className="hidden md:flex absolute -right-6 lg:-right-14 z-50 w-12 h-12 rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-md items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300"
                            >
                                →
                            </button>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
