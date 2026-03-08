'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SifreDegistirPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('Şifreler uyuşmuyor.');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Şifre başarıyla değiştirildi. Tekrar giriş yapmanız gerekebilir.');
                setNewPassword('');
                setConfirmPassword('');
                // Opsiyonel: 2 saniye sonra logout'a yönlendirilebilir
                setTimeout(() => {
                    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                        router.push('/admin/login');
                        router.refresh();
                    });
                }, 2000);
            } else {
                setMessage('Hata: ' + data.message);
            }
        } catch (error) {
            setMessage('Bağlantı hatası.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md">
            <h1 className="text-3xl font-light text-[#D4AF37] mb-8 pb-2 border-b border-neutral-800">
                Şifre Değiştir
            </h1>

            {message && (
                <div className={`mb-6 p-4 rounded ${message.includes('başarıyla') ? 'bg-green-500/10 text-green-500' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Yeni Şifre</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Yeni Şifre (Tekrar)</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#D4AF37] text-black font-semibold py-3 px-8 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
            </form>
        </div>
    );
}
