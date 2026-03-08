'use client';

import { useState, useEffect } from 'react';

interface Photo {
    id: number;
    title: string;
    image_url: string;
    created_at: string;
}

export default function AdminPhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', image_url: '' });
    const [file, setFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch('/api/photos');
            const data = await res.json();
            if (data.success) {
                setPhotos(data.data);
            }
        } catch (error) {
            console.error('Fotoğraf yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage('İşleniyor...');

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/photos/${editingId}` : '/api/photos';

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('image_url', formData.image_url);
            if (file) {
                submitData.append('file', file);
            }

            const res = await fetch(url, {
                method,
                body: submitData
            });

            const data = await res.json();
            if (data.success) {
                setStatusMessage('İşlem başarılı!');
                setFormData({ title: '', image_url: '' });
                setFile(null);
                setEditingId(null);
                fetchPhotos();
            } else {
                setStatusMessage(data.message || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatusMessage('Bağlantı hatası.');
        }

        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleEdit = (photo: Photo) => {
        setFormData({ title: photo.title, image_url: photo.image_url });
        setEditingId(photo.id);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bu fotoğrafı galeriden silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPhotos(photos.filter(p => p.id !== id));
            } else {
                alert(data.message || 'Silinemedi.');
            }
        } catch (error) {
            alert('Bağlantı hatası.');
        }
    };

    if (loading) return <div className="text-neutral-400 p-8">Yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-light text-[#D4AF37] border-b border-neutral-800 pb-4">
                Fotoğraf Galerisi Yönetimi
            </h1>

            {/* Yeni Ekle / Düzenle Formu */}
            <div className="bg-zinc-900 border border-neutral-800 rounded-lg p-6">
                <h2 className="text-xl text-white mb-6 font-light">{editingId ? 'Fotoğrafı Düzenle' : 'Yeni Fotoğraf Ekle'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Başlık / İsim (Opsiyonel)</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="Konser, ödül töreni vs."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Resim Dosyası veya URL (Fiziksel Dosya Adını da Değiştirebilirsiniz)</label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full bg-black/50 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    placeholder="/galeri/benim-gorselim.jpg"
                                />
                                {editingId && (
                                    <div className="text-[#D4AF37]/80 text-xs mt-1">
                                        * Yukarıdaki URL'nin sonundaki <code>.jpg</code>, <code>.png</code> kısmını koruyarak ismi değiştirirseniz sunucudaki <strong>gerçek dosyanın adı da</strong> değiştirilir.
                                    </div>
                                )}
                                {!editingId && (
                                    <>
                                        <div className="text-neutral-500 text-sm italic text-center text-xs my-1">VEYA YENİ DOSYA YÜKLEYİN</div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                            className="w-full bg-black/50 border border-neutral-700 rounded-md p-2 text-neutral-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {statusMessage && <p className="text-[#D4AF37] text-sm">{statusMessage}</p>}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-[#D4AF37] hover:bg-yellow-500 text-black px-6 py-2 rounded-md transition-colors"
                        >
                            {editingId ? 'Güncelle' : 'Galeriiye Ekle'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); setFormData({ title: '', image_url: '' }); setFile(null); }}
                                className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-md transition-colors"
                            >
                                İptal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Fotoğraf Listesi */}
            <div className="bg-zinc-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-neutral-400 text-sm uppercase">
                            <tr>
                                <th className="p-4 font-normal">Görsel</th>
                                <th className="p-4 font-normal">Başlık</th>
                                <th className="p-4 font-normal">Eklenme Tarihi</th>
                                <th className="p-4 font-normal text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {photos.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-neutral-500">
                                        Henüz galeriye fotoğraf eklenmemiş.
                                    </td>
                                </tr>
                            ) : (
                                photos.map(photo => (
                                    <tr key={photo.id} className="hover:bg-black/20 transition-colors">
                                        <td className="p-4">
                                            <div className="w-16 h-16 rounded overflow-hidden border border-neutral-700">
                                                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-white font-medium">{photo.title || '-'}</td>
                                        <td className="p-4 text-neutral-400 text-sm">
                                            {new Date(photo.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                onClick={() => handleEdit(photo)}
                                                className="text-[#D4AF37] hover:text-white transition-colors"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(photo.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
