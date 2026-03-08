'use client';
import { useState, useEffect } from 'react';

export default function AyarlarPage() {
    const [settings, setSettings] = useState({
        site_title: '',
        site_subtitle: '',
        hero_text: '',
        hero_text_size: 'medium',
        hero_subtext: '',
        hero_subtext_size: 'medium',
        hero_image: '',
        theme_dark: '',
        theme_gold: '',
        show_home_banner: 'true',
        slideshow_music: '',
        footer_copyright: '',
        footer_subtitle: '',
        footer_title: '',
        contact_name: '',
        contact_phone: '',
        contact_email: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Ayarları yükle
    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSettings(data.data);
                }
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        // Göstermelik yükleniyor efekti
        setMessage('Ses dosyası yükleniyor...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload-music', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setSettings(prev => ({ ...prev, slideshow_music: data.url }));
                setMessage('Ses dosyası yüklendi. Ayarları kaydetmeyi unutmayın.');
            } else {
                setMessage('Ses dosyası yükleme hatası: ' + data.message);
            }
        } catch (err) {
            setMessage('Ses dosyası yüklenemedi.');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        setMessage('Resim dosyası yükleniyor...');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setSettings(prev => ({ ...prev, hero_image: data.url }));
                setMessage('Resim başarıyla yüklendi. Ayarları kaydetmeyi unutmayın.');
            } else {
                setMessage('Resim yükleme hatası: ' + data.message);
            }
        } catch (err) {
            setMessage('Resim yüklenirken bağlantı hatası oluştu.');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Ayarlar başarıyla kaydedildi!');
            } else {
                setMessage('Ayarlar kaydedilirken hata oluştu.');
            }
        } catch (error) {
            setMessage('Bağlantı hatası.');
        }
        setSaving(false);
    };

    if (loading) return <div className="text-neutral-400">Yükleniyor...</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-light text-[#D4AF37] mb-8 pb-2 border-b border-neutral-800">
                Genel Ayarlar
            </h1>

            {message && (
                <div className="mb-6 p-4 rounded bg-[#D4AF37]/10 text-[#D4AF37]">
                    {message}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Site Başlığı (Logo Metni)</label>
                    <input
                        type="text"
                        name="site_title"
                        value={settings.site_title}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Site Alt Başlığı (Logo Altı Unvan)</label>
                    <input
                        type="text"
                        name="site_subtitle"
                        value={settings.site_subtitle || ''}
                        onChange={handleChange}
                        placeholder="Bestekâr · Ses Sanatçısı · Koro Şefi"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Giriş Sözü (Ana Sayfa) & Boyutu</label>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <input
                            type="text"
                            name="hero_text"
                            value={settings.hero_text}
                            onChange={handleChange}
                            className="w-full md:flex-1 bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <select
                            name="hero_text_size"
                            value={settings.hero_text_size || 'medium'}
                            onChange={handleChange as any}
                            className="w-full md:w-48 bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                        >
                            <option value="small">Küçük Boyut</option>
                            <option value="medium">Orta (Varsayılan)</option>
                            <option value="large">Büyük Boyut</option>
                            <option value="xlarge">Çok Büyük Boyut</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Alt Açıklama Metni (Ana Sayfa) & Boyutu</label>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col md:flex-row items-end md:items-start gap-4">
                            <textarea
                                name="hero_subtext"
                                value={settings.hero_subtext}
                                onChange={handleChange as any}
                                rows={5}
                                className="w-full md:flex-1 bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                            <select
                                name="hero_subtext_size"
                                value={settings.hero_subtext_size || 'medium'}
                                onChange={handleChange as any}
                                className="w-full md:w-48 bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                            >
                                <option value="small">Küçük Boyut</option>
                                <option value="medium">Orta (Varsayılan)</option>
                                <option value="large">Büyük Boyut</option>
                                <option value="xlarge">Çok Büyük Boyut</option>
                            </select>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Cihan Unat'ın sanat yolculuğu... gibi uzun açıklamalar buraya gelir.</p>
                    </div>
                </div>

                {/* Ana Görsel Yükleyici */}
                <div className="bg-neutral-900 border border-neutral-800 rounded p-4">
                    <label className="block text-sm text-[#D4AF37] mb-2 font-medium tracking-wide">Ana Sayfa Kapak Görseli (Hero Image)</label>
                    <p className="text-xs text-neutral-400 mb-4 block">Sitenin açılışında görünen devasa Cihan Unat fotoğrafı.</p>
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="bg-black/30 border border-neutral-800 rounded p-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/70 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30"
                        />
                        {/* URL veya Seçili Görseli Göster */}
                        {settings.hero_image && (
                            <div className="mt-2 flex flex-col gap-2 bg-black/40 p-3 rounded border border-[#D4AF37]/20">
                                <span className="text-xs text-neutral-300">🖼️ Mevcut Kapak Görseli:</span>
                                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-800">
                                    <img
                                        src={settings.hero_image}
                                        alt="Hero"
                                        className="object-cover w-full h-full opacity-80"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="hero_image"
                                    value={settings.hero_image}
                                    onChange={handleChange}
                                    placeholder="Veya URL yapıştırabilirsiniz..."
                                    className="w-full bg-black/50 border border-neutral-800 rounded p-2 text-xs text-neutral-500 focus:outline-none focus:border-[#D4AF37] mt-1"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Slayt Müziği */}
                <div className="bg-neutral-900 border border-neutral-800 rounded p-4">
                    <label className="block text-sm text-[#D4AF37] mb-2 font-medium tracking-wide">Slayt Gösterisi Arka Plan Müziği (MP3 vb.)</label>
                    <p className="text-xs text-neutral-400 mb-4 block">Fotoğraf Galerisinde "Play" tuşuna basıldığında arka planda çalacak müzik.</p>
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleMusicUpload}
                            className="bg-black/30 border border-neutral-800 rounded p-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/70 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30"
                        />
                        {settings.slideshow_music && (
                            <div className="mt-2 flex items-center gap-3 bg-black/40 p-3 rounded border border-[#D4AF37]/20">
                                <span className="text-xs text-neutral-300">🎵 Yüklü Ses Dosyası:</span>
                                <audio controls src={settings.slideshow_music} className="h-8 max-w-xs" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Ayarları */}
                <div className="bg-neutral-900 border border-neutral-800 rounded p-4">
                    <label className="block text-sm text-[#D4AF37] mb-4 font-medium tracking-wide">Alt Bilgi (Footer) Alanı</label>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1">Telif Hakkı Kısımları</label>
                            <input
                                type="text"
                                name="footer_copyright"
                                value={settings.footer_copyright || ''}
                                onChange={handleChange}
                                placeholder="© 2025 Cihan Unat Resmi Arşiv | Tüm hakları saklıdır."
                                className="w-full bg-black/50 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1">Alt Bilgi Açıklaması</label>
                            <input
                                type="text"
                                name="footer_subtitle"
                                value={settings.footer_subtitle || ''}
                                onChange={handleChange}
                                placeholder="Aile tarafından yönetilmektedir."
                                className="w-full bg-black/50 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1">Saygı/Hatırlama Cümlesi</label>
                            <input
                                type="text"
                                name="footer_title"
                                value={settings.footer_title || ''}
                                onChange={handleChange}
                                placeholder="Saygıyla anıyoruz."
                                className="w-full bg-black/50 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>
                </div>

                {/* İletişim Ayarları */}
                <div className="bg-neutral-900 border border-neutral-800 rounded p-4">
                    <label className="block text-sm text-[#D4AF37] mb-4 font-medium tracking-wide">İletişim Sayfası Bilgileri</label>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1">Yetkili / İsim</label>
                            <input
                                type="text"
                                name="contact_name"
                                value={settings.contact_name || ''}
                                onChange={handleChange}
                                placeholder="Erim Felek"
                                className="w-full bg-black/50 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">Telefon Numarası</label>
                                <input
                                    type="text"
                                    name="contact_phone"
                                    value={settings.contact_phone || ''}
                                    onChange={handleChange}
                                    placeholder="0541 482 28 28"
                                    className="w-full bg-black/50 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">E-Posta Adresi</label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={settings.contact_email || ''}
                                    onChange={handleChange}
                                    placeholder="erimfelek@rootbilisim.com"
                                    className="w-full bg-black/50 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Koyu Tema Rengi</label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                name="theme_dark"
                                value={settings.theme_dark || '#1a1a1a'}
                                onChange={handleChange}
                                className="h-10 w-20 bg-transparent cursor-pointer"
                            />
                            <span className="text-neutral-500 font-mono text-sm">{settings.theme_dark}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Altın Vurgu Rengi</label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                name="theme_gold"
                                value={settings.theme_gold || '#D4AF37'}
                                onChange={handleChange}
                                className="h-10 w-20 bg-transparent cursor-pointer"
                            />
                            <span className="text-neutral-500 font-mono text-sm">{settings.theme_gold}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center pt-2 pb-4">
                    <input
                        type="checkbox"
                        id="show_home_banner"
                        checked={settings.show_home_banner !== 'false'}
                        onChange={(e) => setSettings((prev) => ({ ...prev, show_home_banner: e.target.checked ? 'true' : 'false' }))}
                        className="w-5 h-5 accent-[#D4AF37] bg-neutral-900 border-neutral-800 rounded cursor-pointer"
                    />
                    <label htmlFor="show_home_banner" className="ml-3 text-sm text-neutral-300 cursor-pointer">
                        Ana Sayfa Alt Butonlarını (Fotoğraflar, vb. Banner) Göster
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#D4AF37] text-black font-semibold py-3 px-8 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
            </form >
        </div >
    );
}
