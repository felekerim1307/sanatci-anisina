'use client';

import { useState, useEffect } from 'react';

export default function AniDefteriAdminPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<Record<number, string[]>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', message: '' });

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/guestbook');
            const data = await res.json();
            if (data.success) {
                const msgs = data.data.map((m: any) => {
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
                setMessages(msgs);

                const initialSelected: Record<number, string[]> = {};
                msgs.forEach((m: any) => {
                    initialSelected[m.id] = m.images || [];
                });
                setSelectedImages(initialSelected);
            }
        } catch (error) {
            console.error('Mesajlar yüklenemedi');
        }
        setLoading(false);
    };

    const toggleImage = (msgId: number, img: string) => {
        setSelectedImages(prev => {
            const current = prev[msgId] || [];
            if (current.includes(img)) {
                return { ...prev, [msgId]: current.filter(i => i !== img) };
            } else {
                return { ...prev, [msgId]: [...current, img] };
            }
        });
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleApprove = async (id: number, currentStatus: boolean) => {
        try {
            const approved_images = selectedImages[id] || [];
            const res = await fetch('/api/admin/guestbook', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_approved: !currentStatus, approved_images }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, is_approved: !currentStatus } : m));
            }
        } catch (error) {
            alert('Onaylama işlemi başarısız');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch('/api/admin/guestbook', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (error) {
            alert('Silme işlemi başarısız');
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const res = await fetch('/api/admin/guestbook', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    name: editForm.name,
                    message: editForm.message,
                    is_approved: messages.find((m: any) => m.id === id).is_approved,
                    approved_images: selectedImages[id]
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, name: editForm.name, message: editForm.message } : m));
                setEditingId(null);
            }
        } catch (error) {
            alert('Güncelleme işlemi başarısız');
        }
    };

    const startEditing = (message: any) => {
        setEditingId(message.id);
        setEditForm({ name: message.name, message: message.message });
    };

    if (loading) return <div className="text-neutral-400">Yükleniyor...</div>;

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-light text-[#D4AF37] mb-8 pb-4 border-b border-neutral-800">
                Anı Defteri (Onay Bekleyenler)
            </h1>

            <div className="space-y-4">
                {messages.length === 0 ? (
                    <p className="text-neutral-500">Henüz hiç mesaj gönderilmemiş.</p>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="bg-neutral-900 border border-neutral-800 rounded p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-white">{message.name}</h3>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {new Date(message.created_at).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 rounded text-xs font-medium ${message.is_approved ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-yellow-900/30 text-yellow-500 border border-yellow-800'}`}>
                                        {message.is_approved ? 'Yayında' : 'Onay Bekliyor'}
                                    </span>
                                </div>
                            </div>

                            {editingId === message.id ? (
                                <div className="space-y-4 mb-4">
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-black/60 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                                        placeholder="İsim"
                                    />
                                    <textarea
                                        value={editForm.message}
                                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                        className="w-full bg-black/60 border border-neutral-700 rounded p-4 text-white focus:outline-none focus:border-[#D4AF37] min-h-[100px] whitespace-pre-wrap"
                                        placeholder="Mesaj içeriği..."
                                    />
                                </div>
                            ) : (
                                <div className="text-neutral-300 text-sm bg-black/40 p-4 rounded mb-4 whitespace-pre-wrap">
                                    {message.message}
                                </div>
                            )}

                            {message.images && message.images.length > 0 && (
                                <div className="mb-4 bg-black/20 p-4 rounded border border-neutral-800/50">
                                    <span className="text-xs text-neutral-400 uppercase tracking-widest font-light mb-3 block">📷 Eklenen Fotoğraflar (Onaylanacakları Seçin):</span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {message.images.map((img: string, idx: number) => {
                                            const isSelected = (selectedImages[message.id] || []).includes(img);
                                            return (
                                                <div key={idx} className="relative group cursor-pointer" onClick={() => toggleImage(message.id, img)}>
                                                    <div className={`block aspect-square rounded overflow-hidden border-2 transition-colors ${isSelected ? 'border-[#D4AF37]' : 'border-neutral-800 opacity-50'}`}>
                                                        <img src={img} alt="Fotoğraf" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'bg-black/80 text-white border border-white/20'}`}>
                                                        {isSelected && '✓'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-3 justify-end pt-2 border-t border-neutral-800">
                                {editingId === message.id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdate(message.id)}
                                            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                                        >
                                            Kaydet
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 text-sm bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700"
                                        >
                                            İptal
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEditing(message)}
                                            className="px-4 py-2 text-sm bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleApprove(message.id, message.is_approved)}
                                            className={`px-4 py-2 text-sm rounded transition-colors ${message.is_approved ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700' : 'bg-[#D4AF37] text-black hover:bg-yellow-600 font-medium'}`}
                                        >
                                            {message.is_approved ? 'Yayından Kaldır' : 'Onayla ve Yayınla'}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(message.id)}
                                    className="px-4 py-2 text-sm bg-red-900/20 text-red-400 rounded hover:bg-red-900/40 transition-colors"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
