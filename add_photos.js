const photos = [
    { title: "Cihan Unat", url: "https://yenigiresun.net/wp-content/uploads/2025/02/cihan-unat.jpg" },
    { title: "Cihan Unat", url: "https://yesilgiresun.com.tr/wp-content/uploads/2025/02/giresunun-degerli-sanatcisi-cihan-unat-hayatini-kaybetti.jpg" },
    { title: "Cihan Unat", url: "https://www.yildizhaber.com.tr/wp-content/uploads/2025/02/cihan_unat_1-1.jpg" },
    { title: "Koro Şefi Cihan Unat", url: "https://giresunoncu.com/wp-content/uploads/2025/02/cihan-unat-giresunun-degerli-sanatcisi-hayatini-kaybetti_7978_1.jpg" },
    { title: "Bestekâr Cihan Unat", url: "https://giresungazete.com.tr/wp-content/uploads/2025/02/cihan-unat.jpeg" },
    { title: "Cihan Unat", url: "https://cdn.yenicaggazetesi.com.tr/news/2025/02/220220251147558661706.jpg" },
    { title: "Giresun Sanatçısı Cihan Unat", url: "https://www.giresunilerigazetesi.com/wp-content/uploads/2025/02/cihan-unat-2.jpg" },
    { title: "Cihan Unat Hatırası", url: "https://www.giresunilerigazetesi.com/wp-content/uploads/2025/02/cihan-unat-1.jpg" },
    { title: "Cihan Unat Anısına", url: "https://giresuntelevizyonu.com/wp-content/uploads/2025/02/cihan-unat-768x432.jpg" },
    { title: "Cihan Unat Vefat", url: "https://img.internethaber.com/storage/files/images/2025/02/23/cihan-unat-kimdir-kac-yasinda-ciha-FIfX_cover.jpg" },
    { title: "Cihan Unat", url: "https://www.karadenizdeilksonhaber.com/resimler/2025-2/22/100438186259779.jpg" },
    { title: "Cihan Unat Gençlik", url: "https://www.giresunflashaber.com/wp-content/uploads/2025/02/Ekran-Resmi-2025-02-22-12.01.21.png" }
];

async function insertPhotos() {
    let count = 0;
    for (const photo of photos) {
        try {
            const res = await fetch('http://localhost:3000/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: photo.title, image_url: photo.url })
            });
            const data = await res.json();
            if (data.success) {
                console.log('Eklendi:', photo.url);
                count++;
            } else {
                console.error('API Hatasi:', data);
            }
        } catch (e) {
            console.error('Hata:', e.message);
        }
    }
    console.log('Toplam eklenen fotoğraf:', count);
}
insertPhotos();
