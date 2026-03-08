'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Photo {
    id: number;
    title: string;
    image_url: string;
    created_at: string;
}

export default function PhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [pageInfo, setPageInfo] = useState<any>(null);
    const [pageContent, setPageContent] = useState<string>("Cihan Unat'ın anısına derlenen kareler...");
    const [slideshowMusic, setSlideshowMusic] = useState<string>('');
    const [isSlideshowActive, setIsSlideshowActive] = useState(false);
    const [mounted, setMounted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Fotoğrafları Getir
        fetch('/api/photos')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPhotos(data.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Sayfa İçeriğini Getir (Admin panelinden HTML Editör ile girilen)
        fetch('/api/pages/fotograflar')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setPageInfo(data.data);
                    if (data.data.content) setPageContent(data.data.content);
                }
            })
            .catch(console.error);

        // Ayarları Getir (Slayt Müziği vs)
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.slideshow_music) {
                    setSlideshowMusic(data.data.slideshow_music);
                }
            })
            .catch(console.error);
    }, []);

    const stopSlideshow = () => {
        setIsSlideshowActive(false);
        setSelectedPhoto(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handlePhotoClick = (photo: Photo) => {
        setSelectedPhoto(photo);
        // Müzik sadece slayt özelliğinde çalışması istendi (Kullanıcı Talebi)
    };

    const startSlideshow = () => {
        if (photos.length > 0) {
            setSelectedPhoto(photos[0]);
            setIsSlideshowActive(true);
            if (audioRef.current && slideshowMusic) {
                audioRef.current.play().catch(e => console.log('Otomatik oynatma engellendi:', e));
            }
        }
    };

    // Slayt Gösterisi Otomatik Geçiş Kontrolü
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSlideshowActive && photos.length > 0) {
            interval = setInterval(() => {
                setSelectedPhoto(prev => {
                    if (!prev) return photos[0];
                    const currentIndex = photos.findIndex(p => p.id === prev.id);
                    const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
                    return photos[nextIndex];
                });
            }, 3500); // 3.5 saniyede bir
        }
        return () => clearInterval(interval);
    }, [isSlideshowActive, photos]);

    // Klavyeden ESC ve Yön Tüşlarını dinleme
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedPhoto) return;
            if (e.key === 'Escape') stopSlideshow();

            const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
            if (e.key === 'ArrowRight') {
                const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
                setSelectedPhoto(photos[nextIndex]);
            }
            if (e.key === 'ArrowLeft') {
                const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
                setSelectedPhoto(photos[prevIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, photos]);

    // Modal Yönlendirmeleri
    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedPhoto) return;
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
        setSelectedPhoto(photos[nextIndex]);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedPhoto) return;
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
        setSelectedPhoto(photos[prevIndex]);
    };


    return (
        <div className="container mx-auto px-6 pt-32 pb-12 max-w-6xl relative z-10">
            {/* Görünmez Müzik Çalar (Portal Dışında Kalmalı, src boşsa basılmamalı) */}
            {slideshowMusic && (
                <audio ref={audioRef} src={slideshowMusic} loop />
            )}

            {/* Sayfa Başlığı ve Buton */}
            <div className="mb-12 border-b border-[#D4AF37]/20 pb-6 animate-fade-in-up flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="mb-12 border-l-2 border-[#D4AF37] pl-6 md:pl-8 animate-fade-in-up">
                    <div className="inline-block border-b border-[#D4AF37]/30 pb-1 mb-4">
                        <h1 className="text-xl md:text-2xl font-semibold text-[#D4AF37] tracking-[0.2em] uppercase">
                            {pageInfo?.title || 'Fotoğraf Galerisi'}
                        </h1>
                    </div>
                    <p className="text-neutral-200 font-light text-sm md:text-base max-w-2xl leading-relaxed opacity-90">
                        {pageInfo?.subtitle || "Cihan Unat'ın anısına derlenen kareler..."}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                    {/* Slayt Başlat Butonu */}
                    {photos.length > 0 && (
                        <button
                            onClick={startSlideshow}
                            className="bg-black/30 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-light tracking-widest uppercase py-3 px-6 text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        >
                            ▶ Slaytı Başlat
                        </button>
                    )}
                    {/* Anı Defterine Yönlendiren Fotoğraf Ekle Butonu */}
                    <a
                        href="/ani-defteri#mesaj-form"
                        className="bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-light tracking-widest uppercase py-3 px-6 text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    >
                        📷 Fotoğraf Ekle
                    </a>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                </div>
            ) : photos.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 animate-fade-in-up">
                    <p className="text-neutral-500 font-light text-lg">Henüz galeriye fotoğraf eklenmemiş.</p>
                </div>
            ) : (
                /* INSTAGRAM/PINTEREST TARZI GRID GALERİ - 5 Sütunlu Yapı */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
                    {photos.map(photo => (
                        <div
                            key={photo.id}
                            onClick={() => handlePhotoClick(photo)}
                            className="group relative aspect-square bg-zinc-900 overflow-hidden rounded-xl cursor-pointer border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-500"
                        >
                            <img
                                src={photo.image_url}
                                alt={photo.title || "Galeri Fotoğrafı"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Hover Üzerine Gelen Siyah/Altın Gradyan Karartması */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <h3 className="text-[#D4AF37] font-light text-xl tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {photo.title || 'Fotoğrafı İncele'}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SİNEMATİK TAM EKRAN BÜYÜK FOTOĞRAF MODALI / SLAYT MODU */}
            {mounted && selectedPhoto && createPortal(
                <div className="fixed inset-0 z-[999999] flex items-center justify-center animate-fade-in-up">

                    {/* Arka Plan Flu Overlay */}
                    <div
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl cursor-pointer transition-all duration-1000"
                        onClick={stopSlideshow}
                    />

                    {/* Sağ/Sol Okları Sınırlandırmak İçin Wrapper */}
                    <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 pt-20 md:p-12 md:pt-24 pointer-events-none z-[99999]">

                        {/* Sol Ok */}
                        {photos.length > 1 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 md:left-10 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/50 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-2xl transition-all duration-300 pointer-events-auto"
                            >
                                ←
                            </button>
                        )}

                        {/* Fotoğraf ve Bilgi Alanı */}
                        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center pointer-events-auto shrink-0">

                            {/* Premium Çerçeve Kutusu */}
                            <div className="relative bg-zinc-950/80 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-[#D4AF37]/20 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col items-center">

                                {/* Yakınlaştırılmış Kapat Butonu */}
                                <button
                                    onClick={stopSlideshow}
                                    className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-[999999] w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur-lg flex items-center justify-center text-white/50 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 pointer-events-auto"
                                >
                                    ✕
                                </button>

                                {/* Fotoğraf Çerçevesi */}
                                <div className="rounded-lg overflow-hidden border border-white/10 bg-black shadow-inner flex justify-center items-center">
                                    <img
                                        key={selectedPhoto.id} // Anahtarlama ile animasyonu tetikle
                                        src={selectedPhoto.image_url}
                                        alt={selectedPhoto.title || "Galeri"}
                                        className={`max-w-full object-contain ${isSlideshowActive ? 'max-h-[85vh] h-auto w-auto animate-fade-in' : 'max-h-[75vh] h-auto w-auto'}`}
                                    />
                                </div>

                                {/* Alt Bilgi */}
                                {!isSlideshowActive && (
                                    <div className="mt-5 text-center flex flex-col items-center gap-1 pointer-events-auto w-full border-t border-white/5 pt-4">
                                        <h3 className="text-sm md:text-base font-light text-[#D4AF37]/80 tracking-widest uppercase">
                                            {selectedPhoto.title || '-'}
                                        </h3>
                                    </div>
                                )}
                            </div>

                            {/* Slayt Uyarı Metni */}
                            {isSlideshowActive && (
                                <div className="absolute bottom-4 right-8 bg-black/50 px-4 py-2 rounded-full text-white/20 text-xs animate-pulse">
                                    Slayttan çıkmak için Esc'ye veya boşluğa tıklayın
                                </div>
                            )}
                        </div>

                        {/* Sağ Ok */}
                        {photos.length > 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-4 md:right-10 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/50 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black shadow-2xl transition-all duration-300 pointer-events-auto"
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
