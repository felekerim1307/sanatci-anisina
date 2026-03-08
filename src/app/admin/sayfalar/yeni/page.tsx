'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function YeniSayfaPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ title: '', slug: '', subtitle: '', content: '', order_index: 0, is_visible: true });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: slugify(title) });
    };

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
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                router.push('/admin/sayfalar');
                router.refresh();
            } else {
                setError(data.message || 'Sayfa eklenirken bir hata oluştu');
            }
        } catch (err) {
            setError('Bağlantı hatası.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8 pb-4 border-b border-neutral-800 flex items-center justify-between">
                <h1 className="text-3xl font-light text-[#D4AF37]">Yeni Sayfa Ekle</h1>
                <Link href="/admin/sayfalar" className="text-neutral-400 hover:text-white text-sm">İptal ve Geri Dön</Link>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded bg-red-900/40 text-red-200 border border-red-800">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Sayfa Başlığı (Menüde Görünecek İsim)</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Örn: Biyografi"
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
                        placeholder="Örn: Cihan Unat'ın hayat hikayesi..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Bağlantı URL'si (Otomatik Oluşturulur)</label>
                    <div className="flex bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
                        <span className="p-3 text-neutral-600 bg-black/50 border-r border-neutral-800">/</span>
                        <input
                            type="text"
                            name="slug"
                            required
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="biyografi"
                            className="w-full bg-transparent p-3 text-white focus:outline-none"
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
                        disabled={loading}
                        className="bg-[#D4AF37] text-black font-semibold py-3 px-8 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Ekleniyor...' : 'Sayfayı Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
