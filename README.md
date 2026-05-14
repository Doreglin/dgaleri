# D-Gallery Pro 

D-Gallery Pro, herhangi bir sunucuya (backend) veya dış veritabanına ihtiyaç duymadan tamamen tarayıcı üzerinde çalışan, modern bir **İstemci Tabanlı (Client-Side) Sosyal Medya ve Resim Galerisi** simülasyonudur.

Sistem, Pinterest tarzı estetik bir duvar örgüsü (Masonry Grid) tasarımı sunarken, kullanıcıların fotoğraf paylaşmasına, birbirlerini takip etmesine, yorum yapmasına ve içerikleri beğenip kaydetmesine olanak tanır.

##  Özellikler

*   **Single Page Application (SPA):** Sayfa yenilemesi olmadan anında ve akıcı ekran geçişleri.
*   **Çoklu Kullanıcı ve Oturum Yönetimi:** Yerel hafıza (LocalStorage) kullanılarak birden fazla hesabın verileri ayrı ayrı tutulur ve yönetilir.
*   **Görsel Sıkıştırma Motoru (Canvas API):** Tarayıcının 5MB'lık hafıza sınırını aşmak için büyük fotoğrafları kalitesini bozmadan otomatik olarak küçültür. GIF animasyonlarını algılar ve dokunmadan orijinal haliyle bırakır.
*   **Masonry Grid Tasarımı:** Yatay, dikey veya kare fotoğrafları kırpmadan, doğal oranlarıyla şık bir "tuğla duvar" düzeninde sergiler.
*   **Sosyal Etkileşimler:** Başka profilleri takip etme, takibi bırakma, gönderilere yorum yapma, beğenme ve özel koleksiyona kaydetme.
*   **Dinamik UI & Efektler:** Sağ/Sol kayan yan menüler, resme tıklandığında beliren aksiyon butonları ve modallar açıldığında arka planı bulanıklaştıran dinamik odak sistemi.
*   **Aydınlık / Karanlık Tema:** Kullanıcının tercihini hafızada tutan ve tek tıkla değişebilen gelişmiş tema mimarisi.
*   **Gizlilik Ayarları:** Kullanıcıların beğendikleri ve kaydettikleri gönderileri diğer kullanıcılardan gizleyebilme seçeneği.

## 🛠️ Kullanılan Teknolojiler

Bu proje hiçbir harici kütüphane, framework (React, Vue vb.) veya backend dili kullanılmadan "Vanilla" teknolojilerle geliştirilmiştir:

*   **HTML5:** Semantik yapı ve görünüm iskeleti.
*   **CSS3:** CSS Değişkenleri (Custom Properties), Flexbox, Multi-column Layout (Masonry için), Transitions ve animasyonlar.
*   **Vanilla JavaScript (ES6+):** DOM manipülasyonu, olay dinleyiciler (Event Listeners), FileReader API, Canvas API ve LocalStorage yönetimi.
*   **FontAwesome:** UI ikonları.

##  Dosya Yapısı

Proje, okunabilirliği ve sadeliği korumak adına 3 temel dosyadan oluşur:

*   `index.html`: Tüm görünümlerin ve modalların bir arada bulunduğu ana şablon.
*   `style.css`: Karanlık/Aydınlık tema değişkenlerini ve tüm stil/animasyon kurallarını barındıran stil dosyası.
*   `script.js`: Veritabanı illüzyonunu, sıkıştırma motorunu ve tüm dinamik etkileşimleri yöneten JavaScript dosyası.

##  Nasıl Çalıştırılır?

Bu proje bir sunucu (Node.js, Apache vb.) gerektirmez. Kurulumu çok basittir:

1.  Projeyi bilgisayarınıza indirin veya klonlayın.
2.  Klasörün içindeki `index.html` dosyasına çift tıklayarak modern bir web tarayıcısında (Chrome, Firefox, Edge, Safari vb.) açın.
3.  Bir hesap oluşturun ve uygulamanın tadını çıkarın!

## ⚠️ Bilinen Kısıtlamalar

*   **Tarayıcı Hafıza Sınırı:** Proje verileri saklamak için `LocalStorage` kullanır. Görsel sıkıştırma motoru entegre edilmiş olsa da, tarayıcıların genellikle 5MB civarında bir yerel depolama sınırı vardır. Çok fazla büyük GIF dosyası yüklendiğinde bu sınır dolabilir. Sınır aşıldığında sistem kullanıcıyı eski paylaşımlarını silmesi için uyarır.
*   **Cihazlar Arası Senkronizasyon:** Veriler sadece projeyi çalıştırdığınız cihazın tarayıcısında tutulur. Farklı bir cihaza veya tarayıcıya geçildiğinde veriler aktarılmaz.
