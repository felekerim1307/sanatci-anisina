'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SayfalarPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/pages');
            const data = await res.json();
            if (data.success) {
                setPages(data.data);
            }
        } catch (error) {
            console.error('Sayfalar yüklenemedi');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/pages/${slug}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPages(pages.filter(p => p.slug !== slug));
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Silme işlemi başarısız');
        }
    };

    if (loading) return <div className="text-neutral-400">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
                <h1 className="text-3xl font-light text-[#D4AF37]">Sayfalar</h1>
                <Link
                    href="/admin/sayfalar/yeni"
                    className="bg-[#D4AF37] text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors font-medium text-sm"
                >
                    + Yeni Sayfa Ekle
                </Link>
            </div>

            <div className="bg-neutral-900 rounded border border-neutral-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black border-b border-neutral-800">
                        <tr>
                            <th className="p-4 text-neutral-400 font-medium">Sayfa Adı</th>
                            <th className="p-4 text-neutral-400 font-medium">Bağlantı (Slug)</th>
                            <th className="p-4 text-neutral-400 font-medium text-center">Durum</th>
                            <th className="p-4 text-neutral-400 font-medium">Tarih</th>
                            <th className="p-4 text-right text-neutral-400 font-medium">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-neutral-500">Henüz sayfa eklenmemiş</td>
                            </tr>
                        ) : (
                            pages.map((page) => (
                                <tr key={page.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20">
                                    <td className="p-4 font-medium text-neutral-200">{page.title}</td>
                                    <td className="p-4 text-neutral-400 text-sm">/{page.slug}</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-2 py-1 rounded text-xs border ${page.is_visible ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {page.is_visible ? 'Görünür' : 'Gizli'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-neutral-500 text-sm">{new Date(page.created_at).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-4 text-right space-x-3">
                                        <Link
                                            href={`/admin/sayfalar/duzenle/${page.slug}`}
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                            Düzenle
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(page.slug)}
                                            className="text-red-400 hover:text-red-300 text-sm"
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
    );
}
