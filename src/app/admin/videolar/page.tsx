'use client';

import { useState, useEffect } from 'react';

interface Video {
    id: number;
    filename: string;
    title: string;
    description: string;
    cover_image: string;
    is_youtube: boolean;
    video_url: string;
    is_active: boolean;
    rotation: number;
    created_at: string;
}

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ id: 0, title: '', description: '', cover_image: '', is_active: true, rotation: 0 });

    // YouTube Form state
    const [ytTitle, setYtTitle] = useState('');
    const [ytUrl, setYtUrl] = useState('');
    const [isYtSubmitting, setIsYtSubmitting] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/admin/videos');
            const data = await res.json();
            if (Array.isArray(data)) {
                setVideos(data);
            }
        } catch (error) {
            console.error('Video yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCoverUpload = async (file: File) => {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'video-cover');

        const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            body: uploadData
        });
        const data = await res.json();
        if (data.success) {
            return data.image_url;
        }
        throw new Error(data.message || 'Kapak yüklenemedi');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage('Güncelleniyor...');

        try {
            let finalCoverUrl = formData.cover_image;

            // Eğer yeni kapak fotoğrafı seçildiyse önce onu yükle
            if (coverFile) {
                finalCoverUrl = await handleCoverUpload(coverFile);
            }

            const res = await fetch('/api/admin/videos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id,
                    title: formData.title,
                    description: formData.description,
                    cover_image: finalCoverUrl,
                    is_active: formData.is_active,
                    rotation: formData.rotation
                })
            });

            const data = await res.json();
            if (data.success) {
                setStatusMessage('Video başarıyla güncellendi!');
                setFormData({ id: 0, title: '', description: '', cover_image: '', is_active: true, rotation: 0 });
                setCoverFile(null);
                setEditingId(null);
                fetchVideos();
            } else {
                setStatusMessage(data.message || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatusMessage('Bağlantı hatası.');
        }

        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleYoutubeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsYtSubmitting(true);
        setStatusMessage('YouTube Videosu Ekleniyor...');
        try {
            const res = await fetch('/api/admin/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: ytTitle, video_url: ytUrl })
            });
            const data = await res.json();
            if (data.success) {
                setStatusMessage('YouTube videosu başarıyla eklendi!');
                setYtTitle('');
                setYtUrl('');
                fetchVideos();
            } else {
                setStatusMessage(data.error || 'Hata oluştu');
            }
        } catch (error) {
            setStatusMessage('Bağlantı hatası.');
        }
        setIsYtSubmitting(false);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleEdit = (video: Video) => {
        setFormData({
            id: video.id,
            title: video.title,
            description: video.description || '',
            cover_image: video.cover_image || '',
            is_active: video.is_active,
            rotation: video.rotation || 0
        });
        setEditingId(video.id);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id: number, filename: string) => {
        if (!confirm(`"${filename}" videosu sunucudan TAMAMEN silinecek. Emin misiniz?`)) return;

        try {
            const res = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setVideos(videos.filter(v => v.id !== id));
            } else {
                alert(data.error || 'Silinemedi.');
            }
        } catch (error) {
            alert('Bağlantı hatası.');
        }
    };

    if (loading) return <div className="text-neutral-400 p-8">Sistemdeki videolar taranıyor (Klasör Senkronizasyonu)...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-light text-[#D4AF37] border-b border-neutral-800 pb-4">
                Videolar (Otomatik Senkronizasyon)
            </h1>
            <p className="text-sm text-neutral-400 font-light">
                * Sunucunuzdaki <code className="bg-black text-[#D4AF37] px-1 py-0.5 rounded">public/uploads/videos</code> klasörüne manuel yüklediğiniz MP4 dosyaları burada otomatik olarak belirir ve düzeltmenize imkan tanır.
            </p>

            {/* YouTube Ekleme Alanı */}
            {!editingId && (
                <div className="bg-zinc-900 border border-neutral-800 rounded-lg p-6 animate-fade-in-up">
                    <h2 className="text-lg text-white mb-4 font-light">Yeni YouTube Videosu Ekle</h2>
                    <form onSubmit={handleYoutubeSubmit} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                required
                                value={ytTitle}
                                onChange={(e) => setYtTitle(e.target.value)}
                                placeholder="Video Başlığı"
                                className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="url"
                                required
                                value={ytUrl}
                                onChange={(e) => setYtUrl(e.target.value)}
                                placeholder="YouTube Video URL (Örn: https://youtube.com/...)"
                                className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isYtSubmitting}
                            className={`bg-white text-black px-6 py-3 rounded-md transition-colors whitespace-nowrap ${isYtSubmitting ? 'opacity-50' : 'hover:bg-gray-200'}`}
                        >
                            {isYtSubmitting ? 'Ekleniyor...' : 'YouTube Ekle'}
                        </button>
                    </form>
                    {statusMessage && !editingId && <p className="text-[#D4AF37] text-sm mt-4">{statusMessage}</p>}
                </div>
            )}

            {/* Düzenle Formu */}
            {editingId && (
                <div className="bg-zinc-900 border border-[#D4AF37]/30 rounded-lg p-6 animate-fade-in-up">
                    <h2 className="text-xl text-[#D4AF37] mb-6 font-light border-b border-[#D4AF37]/20 pb-2">Videoyu Düzenle</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">Başlık</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">Açıklama (Opsiyonel - Video izlenirken altta görünür)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                        placeholder="Konser veya röportaj hakkında kısa bilgi..."
                                    />
                                </div>

                                <label className="flex items-center space-x-3 cursor-pointer mt-4">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="sr-only"
                                        />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-[#D4AF37]' : 'bg-neutral-600'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <span className="text-sm text-neutral-400">Ziyaretçilere Göster (Aktif Gözüksün Mü?)</span>
                                </label>

                                <div className="mt-4">
                                    <label className="block text-sm text-neutral-400 mb-2">Video Yönü (Döndür)</label>
                                    <select
                                        value={formData.rotation}
                                        onChange={e => setFormData({ ...formData, rotation: Number(e.target.value) })}
                                        className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-neutral-300 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    >
                                        <option value={0}>Normal (0&deg;)</option>
                                        <option value={90}>Sağa Yatık (90&deg;)</option>
                                        <option value={180}>Ters Çevrilmiş (180&deg;)</option>
                                        <option value={270}>Sola Yatık (270&deg;)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm text-neutral-400 mb-2">Zorunlu Olmayan Özel Kapak Fotoğrafı</label>
                                <div className="border border-neutral-700 bg-black/50 rounded-md p-4 flex flex-col items-center justify-center relative overflow-hidden h-40">
                                    {formData.cover_image || coverFile ? (
                                        <img
                                            src={coverFile ? URL.createObjectURL(coverFile) : formData.cover_image}
                                            alt="Kapak Önizleme"
                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                        />
                                    ) : (
                                        <div className="text-neutral-500 text-sm text-center z-10 px-4">
                                            Kapak fotoğrafı seçmezseniz sistem videonun kendi karesini (thumbnail) kapak yapacaktır.
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setCoverFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full bg-black/50 border border-neutral-700 rounded-md p-2 text-neutral-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30"
                                />
                            </div>
                        </div>

                        {statusMessage && <p className="text-[#D4AF37] text-sm mt-4">{statusMessage}</p>}

                        <div className="flex gap-4 pt-4 border-t border-neutral-800 mt-6">
                            <button
                                type="submit"
                                className="bg-[#D4AF37] hover:bg-yellow-500 text-black px-8 py-2 rounded-md transition-colors"
                            >
                                Değişiklikleri Kaydet
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); setCoverFile(null); }}
                                className="bg-transparent border border-neutral-600 text-neutral-400 hover:text-white hover:border-white px-6 py-2 rounded-md transition-colors"
                            >
                                Düzenlemeyi İptal Et
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Videolar Listesi (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {videos.length === 0 ? (
                    <div className="col-span-3 text-neutral-500 border border-neutral-800 p-8 rounded-lg text-center bg-black/20">
                        Klasörde hiç video bulunamadı. Lütfen "public/uploads/videos" klasörüne mp4 dosyaları yükleyin.
                    </div>
                ) : (
                    videos.map(video => (
                        <div key={video.id} className={`bg-zinc-900 border ${editingId === video.id ? 'border-[#D4AF37]' : 'border-neutral-800'} rounded-lg overflow-hidden flex flex-col shadow-lg transition-all duration-300 hover:border-[#D4AF37]/50`}>
                            {/* Medya Önizlemesi */}
                            <div className="aspect-[16/9] relative bg-black flex items-center justify-center overflow-hidden border-b border-white/5">
                                {video.cover_image ? (
                                    <img src={video.cover_image} alt={video.title} className="w-full h-full object-cover opacity-80" />
                                ) : video.is_youtube ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-[#D4AF37]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                        <span className="text-xs uppercase tracking-widest mt-2 px-4 text-center">{video.title}</span>
                                    </div>
                                ) : (
                                    <video
                                        src={`/uploads/videos/${video.filename}`}
                                        className="w-full h-full object-cover opacity-80"
                                        style={{ transform: `rotate(${video.rotation || 0}deg)` }}
                                        preload="metadata"
                                    />
                                )}

                                {!video.is_active && (
                                    <div className="absolute inset-0 bg-red-900/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                                        <span className="bg-red-900 text-white text-xs px-3 py-1 rounded font-bold uppercase tracking-wider shadow-lg">GİZLİ</span>
                                    </div>
                                )}

                                {/* Video İkonu */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1 opacity-90"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-white font-medium mb-1 line-clamp-1">{video.title}</h3>
                                {video.is_youtube ? (
                                    <p className="text-neutral-500 text-xs font-mono mb-3 line-clamp-1 break-all bg-black/50 p-1.5 rounded" title={video.video_url}>
                                        🔗 {video.video_url}
                                    </p>
                                ) : (
                                    <p className="text-neutral-500 text-xs font-mono mb-3 line-clamp-1 break-all bg-black/50 p-1.5 rounded" title={video.filename}>
                                        📁 {video.filename}
                                    </p>
                                )}
                                <p className="text-neutral-400 text-sm flex-1 line-clamp-2 italic font-light">
                                    {video.description || "Açıklama girilmemiş"}
                                </p>

                                {/* Aksiyonlar */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-800">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="flex-1 bg-black border border-[#D4AF37]/40 text-[#D4AF37] py-2 rounded text-sm hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video.id, video.filename)}
                                        className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500 px-4 py-2 rounded text-sm transition-colors"
                                        title="Videoyu tamamen sil"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
