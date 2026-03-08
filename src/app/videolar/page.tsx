'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Video {
    id: number;
    filename: string;
    title: string;
    description: string;
    cover_image: string;
    is_youtube: boolean;
    video_url: string;
    rotation: number;
    created_at: string;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [pageInfo, setPageInfo] = useState<any>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('/api/videos');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setVideos(data);
                }
            } catch (error) {
                console.error('Videolar yüklenemedi:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchPageInfo = async () => {
            try {
                const res = await fetch('/api/pages/videolar');
                const data = await res.json();
                if (data.success) {
                    setPageInfo(data.data);
                }
            } catch (error) {
                console.error('Sayfa bilgisi yüklenemedi:', error);
            }
        };

        fetchVideos();
        fetchPageInfo();
    }, []);

    if (loading) {
        return (
            <div className="w-full mx-auto px-4 lg:px-12 pt-32 pb-24 relative z-10 flex justify-center items-center min-h-[50vh]">
                <div className="text-[#D4AF37] font-light tracking-widest animate-pulse">VİDEOLAR YÜKLENİYOR...</div>
            </div>
        );
    }

    const getYtId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="w-full mx-auto px-6 md:px-12 pt-32 pb-24 max-w-7xl relative z-10">
            <div className="mb-12 border-l-2 border-[#D4AF37] pl-6 md:pl-8 animate-fade-in-up">
                <div className="inline-block border-b border-[#D4AF37]/30 pb-1 mb-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-[#D4AF37] tracking-[0.2em] uppercase">
                        {pageInfo?.title || 'Videolar'}
                    </h1>
                </div>
                <p className="text-neutral-200 font-light text-sm md:text-base max-w-2xl leading-relaxed opacity-90">
                    {pageInfo?.subtitle || "Cihan Unat'a ait konser, röportaj ve performans kayıtları."}
                </p>
            </div>

            {/* Video Listesi (Grid) */}
            {videos.length === 0 ? (
                <div className="text-neutral-500 text-center py-16 border border-neutral-800/20 rounded-lg bg-neutral-900/30 font-light text-sm">
                    Henüz hiç video yüklenmemiş.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className="group cursor-pointer flex flex-col gap-3"
                        >
                            {/* Video Küçük Resim (Thumbnail) */}
                            <div className="aspect-video relative rounded-xl overflow-hidden bg-black border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors shadow-2xl">
                                {video.is_youtube ? (
                                    <img
                                        src={video.cover_image || `https://img.youtube.com/vi/${getYtId(video.video_url)}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                ) : video.cover_image ? (
                                    <img src={video.cover_image} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                ) : (
                                    <video
                                        src={`/uploads/videos/${video.filename}`}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                                        style={{ transform: `rotate(${video.rotation || 0}deg)` }}
                                        preload="metadata"
                                    />
                                )}

                                {/* Oynat İkonu (Hover'da Parlar) */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all duration-500">
                                    <div className="w-14 h-14 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white group-hover:border-l-black border-b-[8px] border-b-transparent ml-1 transition-colors"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Video Bilgileri */}
                            <div className="flex flex-col px-1">
                                <h3 className="text-white text-base font-medium leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                                    {video.title}
                                </h3>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video İzleme Modalı (Sinema Modu) */}
            {selectedVideo && (
                <div className="fixed top-[96px] left-0 right-0 bottom-0 z-40 flex flex-col items-center justify-start p-4 md:p-8 animate-fade-in-up bg-black/95 backdrop-blur-xl overflow-y-auto">

                    {/* Model İçeriği Kaplayıcısı */}
                    <div className="w-full max-w-6xl flex flex-col relative w-full mt-4">

                        {/* Kapat Butonu (Videonun / Ekranın Hemen Üstünde) */}
                        <div className="flex justify-between items-center w-full mb-4">
                            <span className="text-[#D4AF37] tracking-widest text-sm uppercase font-light">
                                Sinema Modu
                            </span>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="flex items-center gap-2 text-neutral-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors bg-white/5 backdrop-blur-md"
                            >
                                <span className="text-sm tracking-wider">KAPAT</span>
                                <span className="text-xl leading-none">✕</span>
                            </button>
                        </div>

                        {/* Sinema Ekranı Konteyneri */}
                        <div className="w-full flex flex-col bg-black/50 border border-white/5 md:rounded-2xl shadow-[0_0_100px_rgba(212,175,55,0.05)] overflow-hidden">
                            {/* Video Player Alanı */}
                            <div className="w-full bg-black flex-shrink-0 flex items-center justify-center">
                                {selectedVideo.is_youtube ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYtId(selectedVideo.video_url)}?autoplay=1`}
                                        title={selectedVideo.title}
                                        className="w-full aspect-video max-h-[60vh] md:max-h-[70vh] border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video
                                        src={`/uploads/videos/${selectedVideo.filename}`}
                                        controls
                                        autoPlay
                                        className="w-full h-auto max-h-[60vh] md:max-h-[70vh] object-contain outline-none border-none"
                                        style={{ transform: `rotate(${selectedVideo.rotation || 0}deg)` }}
                                    />
                                )}
                            </div>

                            {/* Video Altı Detaylar */}
                            <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                                <h2 className="text-xl md:text-2xl text-[#D4AF37] font-light tracking-wide mb-2">
                                    {selectedVideo.title}
                                </h2>
                                <div className="w-16 h-[1px] bg-[#D4AF37]/30 mb-6 mt-2"></div>

                                {selectedVideo.description && (
                                    <p className="text-neutral-300 font-light leading-relaxed text-[15px] whitespace-pre-wrap">
                                        {selectedVideo.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
