'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/sayfalar');
                router.refresh();
            } else {
                setError(data.message || 'Hatalı kullanıcı adı veya şifre.');
            }
        } catch (err) {
            setError('Sunucu bağlantı hatası.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-md border border-[#D4AF37]/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif text-[#D4AF37] tracking-widest mb-2">YÖNETİM PANELİ</h1>
                    <p className="text-neutral-500 text-sm">Devam etmek için lütfen giriş yapın.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded bg-red-900/40 text-red-200 border border-red-800 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2 font-light tracking-wide">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2 font-light tracking-wide">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D4AF37] text-black font-medium py-3 rounded-lg hover:bg-yellow-500 transition-colors tracking-widest uppercase text-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'GİRİŞ YAP'}
                    </button>

                    <a href="/" className="block text-center text-xs text-neutral-500 hover:text-[#D4AF37] mt-6 transition-colors transition-duration-300">
                        &larr; Siteye Geri Dön
                    </a>
                </form>
            </div>
        </div>
    );
}
