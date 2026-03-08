'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function SayfaDuzenlePage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [formData, setFormData] = useState({ title: '', subtitle: '', content: '', order_index: 0, is_visible: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Sayfa bilgilerini getir
    useEffect(() => {
        fetch(`/api/pages/${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setFormData({
                        title: data.data.title,
                        subtitle: data.data.subtitle || '',
                        content: data.data.content || '',
                        order_index: data.data.order_index || 0,
                        is_visible: data.data.is_visible ?? true
                    });
                } else {
                    setError('Sayfa bulunamadı.');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Bağlantı hatası.');
                setLoading(false);
            });
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleContentChange = (value: string) => {
        setFormData({ ...formData, content: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`/api/pages/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess('Sayfa başarıyla güncellendi.');
                setTimeout(() => {
                    router.push('/admin/sayfalar');
                    router.refresh();
                }, 1500);
            } else {
                setError(data.message || 'Sayfa güncellenirken hata oluştu');
            }
        } catch (err) {
            setError('Bağlantı hatası.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-neutral-400">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl">
            <div className="mb-8 pb-4 border-b border-neutral-800 flex items-center justify-between">
                <h1 className="text-3xl font-light text-[#D4AF37]">Sayfa Düzenle: <span className="text-white font-medium">{formData.title}</span></h1>
                <Link href="/admin/sayfalar" className="text-neutral-400 hover:text-white text-sm">İptal ve Geri Dön</Link>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded bg-red-900/40 text-red-200 border border-red-800">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Sayfa Başlığı</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Sayfa Alt Başlığı (Başlığın hemen altında görünecek kısa açıklama)</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Sayfa Bağlantısı (Sabittir, Düzenlenemez)</label>
                    <div className="flex bg-neutral-900 border border-neutral-800 rounded overflow-hidden opacity-70 cursor-not-allowed">
                        <span className="p-3 text-neutral-600 bg-black/50 border-r border-neutral-800">/</span>
                        <input
                            type="text"
                            name="slug"
                            disabled
                            value={slug}
                            className="w-full bg-transparent p-3 text-white cursor-not-allowed focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-sm text-neutral-400 mb-2">Menü Sıra Numarası (Küçük numara önce çıkar)</label>
                        <input
                            type="number"
                            name="order_index"
                            value={formData.order_index}
                            onChange={handleChange}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>

                    <div className="w-48 pt-1">
                        <label className="block text-sm text-neutral-400 mb-2">Sitede Görünürlük</label>
                        <label className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-3 rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                            <input
                                type="checkbox"
                                name="is_visible"
                                checked={formData.is_visible}
                                onChange={handleChange}
                                className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
                            />
                            <span className="text-white text-sm">Görünür</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Sayfa İçeriği & Detaylar (Önyüz ile Birebir Aynı Görünüm)</label>
                    <div className="bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] admin-quill-wrapper mb-6">
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={handleContentChange}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'image', 'video'],
                                    ['clean']
                                ]
                            }}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#D4AF37] text-black font-semibold py-3 px-8 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
