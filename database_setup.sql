-- Cihan Unat Arşiv Projesi - Veritabanı Kurulum Dosyası
CREATE DATABASE IF NOT EXISTS `sanatci_anisina` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sanatci_anisina`;

CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admins` (`id`, `username`, `password_hash`, `created_at`) VALUES 
(1, 'admin', '$2b$10$lBvhGPGofPyiR9ShqlPOkuCxSCi3RyNGvpmWVDf0.8JRRzkbkc1D.', '2026-02-23 16:55:24');

CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `message` text NOT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `guestbook` (`id`, `name`, `email`, `image`, `message`, `is_approved`, `created_at`) VALUES 
(4, 'Ahmet Yılmaz', 'ahmet@example.com', NULL, 'Yıllar geçse de o muazzam sesin kulaklarımızdan silinmeyecek. Büyük sanatçı, seni hiç unutmayacağız. Her şarkında ayrı bir hikaye, ayrı bir yaşanmışlık vardı.', 1, '2026-02-22 15:23:21'),
(5, 'Ayşe Kaya', 'ayse@example.com', 'https://i.pravatar.cc/150?img=1', 'Sahnede devleşen, müziğiyle ruhumuza dokunan eşsiz insan. Mekanın cennet olsun.', 1, '2026-02-22 15:23:21'),
(6, 'Mehmet Demir', 'mehmet@example.com', NULL, 'Çok özlüyoruz. Eserlerinle yaşamaya devam ediyorsun.', 1, '2026-02-22 15:23:21'),
(7, 'Elif Yıldız', 'elif@example.com', 'https://i.pravatar.cc/150?img=5', 'Senin şarkılarınla büyüdük, senin şarkılarınla ağladık. Yerin asla dolmayacak büyük usta. Huzur içinde uyu.', 1, '2026-02-22 15:23:21'),
(8, 'Can Öztürk', 'can@example.com', NULL, 'Müzik dünyası seninle çok daha güzeldi. Bıraktığın miras için sonsuz teşekkürler...', 1, '2026-02-22 15:23:21'),
(9, 'Zeynep Tekin', 'zeynep@example.com', 'https://i.pravatar.cc/150?img=9', 'Işıklar içinde uyu. Her plağını dinlediğimde sanki odamda şarkı söylüyormuşçasına bir his kaplıyor içimi.', 1, '2026-02-22 15:23:21'),
(10, 'Bora Aksoy', 'bora@example.com', NULL, 'Efsaneler ölmez, sadece şekil değiştirir. Sen de şarkılarınla sonsuzluğa ulaştın.', 1, '2026-02-22 15:23:21'),
(11, 'Cemre Aslan', 'cemre@example.com', 'https://i.pravatar.cc/150?img=12', 'Manevi değerin paha biçilemez. İyi ki geçtin bu dünyadan, dimağımızda bıraktığın o güzel tat hiç kaybolmayacak.', 1, '2026-02-22 15:23:21'),
(12, 'Burak Çelik', 'burak@example.com', NULL, 'Bir neslin idolü, sesiyle yürekleri titreten adam...', 1, '2026-02-22 15:23:21'),
(13, 'Selin Polat', 'selin@example.com', 'https://i.pravatar.cc/150?img=16', 'Konserlerini en ön sıradan izleme şerefine nail oldum. O sahne tozu, o ihtişam... Asla unutamam. Ruhun şad olsun.', 1, '2026-02-22 15:23:21'),
(18, 'erim felek', 'bilgialmak28@gmail.com', '["/guestbook_images/1772484274535_429_cihan_unat.png","/guestbook_images/1772484274544_322_hero-artistd__1_.webp","/guestbook_images/1772484274549_204_ChatGPT_Image_2_Mar_2026_22_38_12.png"]', 'Sevgili Cihan Unat,

Bu satırları yazmak kolay değil… Çünkü bazı insanlar sadece bir sanatçı değil, aynı zamanda bir hayat dersidir. Sen de öyleydin.

Müziğe duyduğun saygı, hayata duyduğun saygıyla aynıydı. Disiplinliydin ama kırıcı değildin. Ciddiydin ama mesafeliydin demek doğru olmaz; çünkü yüreğin hep sıcaktı.

Bugün senin sesin kayıtlarda yaşamaya devam ediyor. Her notada bir iz, her eserde bir karakter var. Sen müziği icra etmedin; onu yaşadın ve yaşattın. Şimdi bizler, o mirası dinlerken hem gurur duyuyor hem de özlem hissediyoruz.

İyi ki vardın.

Saygı, sevgi ve minnetle…', 1, '2026-03-02 23:44:34');

CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(500) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_visible` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pages` (`id`, `slug`, `title`, `subtitle`, `content`, `is_active`, `order_index`, `created_at`, `updated_at`, `is_visible`) VALUES 
(1, 'fotograflar', 'Fotoğraflar', 'Zamanın içinden kalan izler, hatıralar ve sessiz anlar.', '<p></p>', 1, 4, '2026-02-21 22:03:33', '2026-03-03 15:10:24', 1),
(2, 'videolar', 'Videolar', 'Cihan Unat''ın konser performansları ve özel kayıtlarından seçkiler. ', '<p></p>', 1, 3, '2026-02-21 22:03:33', '2026-03-03 15:10:24', 1),
(3, 'ani-defteri', 'Anı Defteri', 'Müzik gibi hatıralar da yaşamaya devam eder. Cihan Unat ile ilgili anınızı ya da duygunuzu burada paylaşabilirsiniz.', '<p></p>', 1, 5, '2026-02-21 22:03:33', '2026-03-03 14:37:36', 1),
(5, 'biyografi', 'Biyografi', 'Müziğe adanmış bir ömrün, notalarla yazılmış yolculuğu. Dünden Bugüne Cihan Unat ∞', '<p><strong>Cihan UNAT</strong></p><p></p><p>05 Mart 1958 tarihinde dünyaya gelen Cihan Unat, Giresun Keşap ilçesi nüfusuna kayıtlıdır. İlk ve orta öğrenimini Giresun’da, lise eğitimini ise İstanbul Aryemehr Lisesi’nde tamamladı. İstanbul Güzel Sanatlar Akademisi Mimarlık Bölümü’nü yarıda bırakarak hayali olan İTÜ Türk Musikisi Devlet Konservatuvarı’ndan başarıyla mezun oldu.</p><p></p><p>Alaeddin Yavaşça, Nida Tüfekçi, Neriman Altındağ Tüfekçi, Tülin Korman, Erol Sayan, İnci Çayırlı, Selahattin İçli, Kani Karaca, Arif Sağ, Ruhi Ayangil ve Bekir Sıtkı Sezgin gibi Türk müziğinin değerli üstatlarının öğreticiliğinde; nazariyat bilgisi, makam, usûl ve teknik uygulamalar alanında eğitim aldı. Özellikle piyano ve kanun başta olmak üzere enstrümanlara yönelik çalışmalar yaptı.</p><p></p><p>Konservatuvar yıllarından itibaren hem sahnede hem stüdyoda üretken bir sanat yolculuğu sürdürdü. 1980’li yıllarda müzisyen arkadaşlarıyla birlikte Grup Akdeniz’i kurdu ve bu toplulukla dönemin dikkat çeken çalışmaları arasında yer alan “Dün Öyle Bugün Böyle” albümünü yayımladı.</p><p></p><p>Türkiye’de vokal müziğin akademik bir anlayışla ele alınmasına önemli katkılar sundu. Eurovision Türkiye elemelerine “İstemem” adlı bestesiyle katılarak derece elde etti. Reklam müzikleri, özel projeler ve Avrupa Birliği kapsamındaki uluslararası çalışmalarda yer aldı; eserleri yurt dışında da seslendirildi.</p><p></p><p>Sanat yaşamı boyunca pek çok kıymetli isimle aynı sahneyi paylaşan Cihan Unat, müziği yalnızca icra eden değil; onu yaşayan ve yaşatan bir sanat insanıydı. TRT ile yürüttüğü çalışmalar, müzikal serüveninin güçlü bir ayağını oluşturdu.</p><p></p><p>Giresun/Görele’li şair Ahmet Kaçar’ın “Yeşeren Umutlar” adlı dörtlüğünü bestelemesiyle söz ve melodiyi derin bir ahenk içinde buluşturdu.</p><p></p><p>“Can İlacım Giresun’um”, “Kırkından Sonra”, “Yeşeren Umutlar”, “İç Dostum”, “Devasız Aşk”, “Sensizlik Ölüm Şimdi”, “Ağustos Sıcağı”, “Kim Kanar Sana”, “Neredesin Şimdi?”, “Affediyorum”, “Elveda” ve “Hiç Değişmemişsin” gibi eserleri; yalnızca notalarda değil, dinleyenlerin kalbinde de yer buldu.</p><p></p><p>Cihan Unat’ın sanat yolculuğunun en kalıcı yönlerinden biri eğitimci kimliğiydi. Millî Eğitim Bakanlığı bünyesinde okullarda ve halk eğitim merkezlerinde uzun yıllar müzik öğretmenliği yaptı. Yüzlerce öğrencinin yeteneğini keşfetti, onlara sahne cesareti kazandırdı ve müziği hayatlarının ayrılmaz bir parçası hâline getirdi. Giresun Güzel Sanatlar Lisesi’nin kuruluş sürecinde aktif rol aldı ve kurucu müdür olarak görev yaptı.</p><p></p><p>Türk müziğinin yalnızca sahnede değil, kurumsal bir yapı içinde de yaşaması gerektiğine inanan Cihan Unat, Bolahenk Türk Müziği Derneği’ni kurdu. Dernek; her yaştan müziksevere eğitim imkânı sunmayı, yeni sesler keşfetmeyi ve Türk müziğini daha geniş kitlelere ulaştırmayı amaçladı.</p><p></p><p>Cihan Unat için Giresun yalnızca bir memleket değil, ilham kaynağıydı. Yıllar boyunca Giresun’da düzenlediği konserlerle Türk müziğini şehirle buluşturdu; sahneye taşıdığı eserlerle dinleyicilerin hafızasında iz bıraktı. Şefliğini üstlendiği korolar ile verdiği konserler sanat çevrelerinde geniş yankı uyandırdı. Bu çalışmalar, onun müziğe olan bağlılığının yalnızca bireysel üretimle sınırlı kalmadığını; toplumsal bir kültür bilinci oluşturma çabası taşıdığını da gösterdi.</p><p></p><p>Giresun aşığı olan Cihan Unat, Giresun Belediye Konservatuvarı’nda uzun yıllar müzik dersi vererek her yaştan öğrenci yetiştirdi. Son döneminde Giresun Belediyesi Kent Konseyi Başkanı Dr. İsmail Cem Feridunoğlu ile kent konseyinde birlikte çalışma arzusunu iletti. Bu isteği başkan tarafından onaylandı ve yürütme kurulu üyesi olarak görev aldı. Daha sonra gerçekleştirilen görüşmelerde eksikliğini dile getirdiği kent orkestrasının kurulması başkanlık tarafından onaylanarak şefliğine Cihan Unat getirildi. 24 Kasım 2025 tarihinde kent orkestrasıyla birlikte gerçekleştirdiği konser, onun ilk ve son konseri oldu.</p><p></p><p>Giresun Üniversitesi Devlet Konservatuvarı’nın kurulma sürecinde yer alarak burada ilk Türk Müziği Nazariyatı ve solfej derslerini verdi; böylece akademik temelin oluşmasına katkı sundu. Giresun Üniversitesi’nde Türk Sanat Müziği Korosu’nu kurarak en büyük hayallerinden birini gerçekleştirdi. Ancak şefliğini üstlendiği koro ile verdiği ikinci konser, onun son sahnesi oldu. Konser sonunda dinleyicileriyle helalleşmesi, sanat yolculuğunun duygusal bir vedasıydı.</p><p></p><p>Vefatının ardından koro, Giresun Üniversitesi Rektörlüğü tarafından “Cihan Unat Türk Müziği Korosu” olarak isimlendirildi; bu isim, onun sanat mirasının üniversite çatısı altında yaşamaya devam edeceğinin en anlamlı göstergesi oldu.</p><p></p><p>Cihan Unat, ailesini hayatının merkezinde tutan bir eş, bir ağabey, bir baba ve bir dedeydi. Ailesine sevgi ve sanat bilinciyle rehberlik etmiş, destek vermiş; renkli kişiliği ve pozitif enerjisiyle birleştirici bir güç olmuştur. Üç torun sahibidir. Kızları Ezgi ve Şehnaz’ın isimleri de hayatını adadığı müziğe bağlılığının ailedeki yansımasıdır.</p><p></p><p>Cihan Unat, 20 Şubat 2025 tarihinde sevenlerinin kalbinde derin bir boşluk bırakarak aramızdan ayrıldı.</p><p></p><p>Bu kısacık ömrünün ardında yalnızca besteler değil; sevgiyle büyüyen bir aile, yetiştirdiği öğrenciler, oluşumlarına katkı sunduğu kurumlar, vefalı dostlar ve güçlü bir sanat mirası bıraktı. Bugün adı eserlerinde, sesi öğrencilerinde, sıcaklığı ise ailesinin kalbinde yaşamaya devam ediyor.</p><p></p><p>Onun adı artık yalnızca bir insanı değil; Giresun’un kültür hafızasında iz bırakan bir emeği, bir sesi ve müziğe adanmış bir ömrü temsil ediyor.</p>', 1, 1, '2026-02-22 02:04:11', '2026-03-03 14:33:41', 1),
(6, 'eserleri', 'Besteler', 'Cihan Unat''ın ölümsüz eserleri.', '<h3><strong>𝄞</strong> Can İlacım Giresun’um</h3><h3><strong>𝄞 </strong>Kırkından Sonra</h3><h3><strong>𝄞 </strong>Yeşeren Umutlar</h3><h3><strong>𝄞</strong> İç Dostum</h3><h3><strong>𝄞</strong> Devasız Aşk</h3><h3><strong>𝄞</strong> Sensizlik Ölüm Şimdi</h3><h3><strong>𝄞</strong> Ağustos Sıcağı</h3><h3><strong>𝄞</strong> Kim Kanar Sana</h3><h3><strong>𝄞 </strong>Neredesin Şimdi?</h3><h3><strong>𝄞 </strong>Affediyorum</h3><h3><strong>𝄞 </strong>Elveda</h3><h3><strong>𝄞 </strong>Hiç Değişmemişsin</h3>', 1, 2, '2026-02-22 23:40:31', '2026-03-03 15:19:14', 1),
(7, 'iletisim', 'İletişim', 'Sorularınız ve katkılarınız için bizimle iletişime geçebilirsiniz. ', '<p></p>', 1, 99, '2026-03-03 13:54:20', '2026-03-03 14:30:35', 1);

CREATE TABLE `photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `image_url` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `photos` (`id`, `title`, `image_url`, `created_at`) VALUES 
(19, 'erim felek - Anı Defteri Fotoğrafı', '/guestbook_images/1772484274535_429_cihan_unat.png', '2026-03-03 01:23:19'),
(20, 'erim felek - Anı Defteri Fotoğrafı', '/guestbook_images/1772484274544_322_hero-artistd__1_.webp', '2026-03-03 01:23:19'),
(21, 'erim felek - Anı Defteri Fotoğrafı', '/guestbook_images/1772484274549_204_ChatGPT_Image_2_Mar_2026_22_38_12.png', '2026-03-03 01:23:19');

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`, `updated_at`) VALUES 
(1, 'site_title', 'CİHAN UNAT', 'Sitenin tarayÄ±cÄ± baÅŸlÄ±ÄŸÄ±', '2026-02-22 16:07:48'),
(2, 'hero_text', 'Hatırasına saygıyla...', 'Ana sayfada gÃ¶rÃ¼necek ana sÃ¶z', '2026-02-22 14:36:35'),
(3, 'hero_image', '/uploads/hero_1772481943963_cihan_unat.png', 'Ana sayfadaki bÃ¼yÃ¼k gÃ¶rselin URL''si', '2026-03-02 23:05:45'),
(4, 'theme_dark', '#1a1a1a', 'Koyu tema arka plan rengi', '2026-03-03 01:41:50'),
(5, 'theme_gold', '#D4AF37', 'AltÄ±n sarÄ±sÄ± vurgu rengi', '2026-02-21 22:03:33'),
(6, 'show_home_banner', 'false', NULL, '2026-03-03 00:56:21'),
(7, 'slideshow_music', '/music/slideshow_music.mp3?v=1771785605121', 'Slayt Gösterisi Arka Plan Müziği', '2026-02-22 21:40:18'),
(8, 'hero_subtext', 'Cihan Unat’ın sanat yolculuğu;
bir bestekârın, bir eğitimcinin,
bir gönül insanının hikâyesidir.', NULL, '2026-02-22 23:38:06'),
(73, 'hero_subtext_size', 'small', NULL, '2026-03-02 23:33:01'),
(92, 'hero_text_size', 'small', NULL, '2026-03-02 23:15:34'),
(133, 'footer_title', 'Saygıyla anıyoruz.', NULL, '2026-03-03 01:08:06'),
(145, 'footer_subtitle', 'Aile tarafından yönetilmektedir.', NULL, '2026-03-03 01:08:06'),
(146, 'footer_copyright', '© 2025 Cihan Unat Resmi Arşiv | Tüm hakları saklıdır.', NULL, '2026-03-03 01:08:06'),
(160, 'site_subtitle', 'Bestekâr · Ses Sanatçısı · Koro Şefi', NULL, '2026-03-03 01:18:17'),
(217, 'contact_name', 'Erim Felek', NULL, '2026-03-03 14:05:27'),
(218, 'contact_phone', '0541 482 28 28', NULL, '2026-03-03 14:05:27'),
(219, 'contact_email', 'erimfelek@rootbilisim.com', NULL, '2026-03-03 14:05:27');

CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT 'local',
  `title` varchar(255) NOT NULL,
  `video_url` text NOT NULL,
  `is_youtube` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `filename` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `order_index` int(11) DEFAULT 0,
  `rotation` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `videos` (`id`, `type`, `title`, `video_url`, `is_youtube`, `created_at`, `filename`, `description`, `cover_image`, `is_active`, `order_index`, `rotation`) VALUES 
(3, 'local', 'Devasız Aşk & Cihan Unat', 'https://www.youtube.com/watch?v=wRXORYwrmY8&list=RDwRXORYwrmY8&start_radio=1', 1, '2026-02-22 22:47:32', NULL, NULL, NULL, 1, 0, 0),
(4, 'local', 'Yeşeren Ümitlerin & Cihan Unat', 'https://www.youtube.com/watch?v=Bn3RkCM8eqU', 1, '2026-02-22 22:47:50', NULL, NULL, NULL, 1, 0, 0),
(5, 'local', '45. Sanat Yılı Konseri ', 'https://www.youtube.com/watch?v=qhhtnt9AUqw&list=RDqhhtnt9AUqw&start_radio=1', 1, '2026-02-22 22:49:07', NULL, NULL, NULL, 1, 0, 0),
(6, 'local', 'TSM Konseri - Cihan Unat', 'https://www.youtube.com/watch?v=CWAVbGMA_2Y&list=RDCWAVbGMA_2Y&start_radio=1', 1, '2026-02-22 22:53:01', NULL, NULL, NULL, 1, 0, 0),
(7, 'local', 'Yıldızların Altında - Giresun Üniversitesi Türk Müziği Korosu', 'https://www.youtube.com/watch?v=SABAv1ztspk', 1, '2026-02-22 22:54:37', NULL, NULL, NULL, 1, 0, 0),
(8, 'local', 'Yine Bir Gülnihal - Giresun Üniversitesi Türk Müziği Korosu', 'https://www.youtube.com/watch?v=7XkKcO0u_-U', 1, '2026-02-22 22:55:41', NULL, NULL, NULL, 1, 0, 0),
(9, 'local', 'Rüzgar Söylüyor Şimdi O Yerlerde - Şef Cihan UNAT', 'https://www.youtube.com/watch?v=7IEx7AoSRiE', 1, '2026-02-22 22:57:09', NULL, NULL, NULL, 1, 0, 0),
(10, 'local', 'Denemevideosu', '', 0, '2026-03-03 00:27:47', 'denemevideosu.mp4', NULL, NULL, 1, 0, 0);

