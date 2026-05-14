// --- VERİTABANI VE HESAPLAR ---
const defaultImages = [
    { id: 1, title: 'Karanlık Orman', type: 'doğa', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&h=800&fit=crop', user: 'Zoro', avatar: '', comments: [] },
    { id: 2, title: 'Zindan Kapısı', type: 'fantastik', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=300&fit=crop', user: 'Umut', avatar: '', comments: [{user: 'Luffy', text: 'Çok iyi!'}] },
    { id: 3, title: 'Korsan Gemisi', type: 'deniz', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500', user: 'Luffy', avatar: '', comments: [] },
    { id: 4, title: 'Ejderha Mağarası', type: 'fantastik', url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&h=700&fit=crop', user: 'Nami', avatar: '', comments: [] }
];

let allImages = JSON.parse(localStorage.getItem('dGallery_images')) || defaultImages;
let allUsers = JSON.parse(localStorage.getItem('dGallery_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('dGallery_user')) || null;
let savedTheme = localStorage.getItem('dGallery_theme') || 'dark';

let currentViewingImageId = null;
let currentProfileUser = null; 

function verifyUserStructure(userObj) {
    if (!userObj.followers) userObj.followers = [];
    if (!userObj.following) userObj.following = [];
    if (!userObj.privacy) userObj.privacy = { showLikes: true, showSaves: true };
    return userObj;
}

function saveData() {
    try {
        localStorage.setItem('dGallery_images', JSON.stringify(allImages));
        if (currentUser) {
            currentUser = verifyUserStructure(currentUser);
            const index = allUsers.findIndex(u => u.username === currentUser.username);
            if (index > -1) { allUsers[index] = currentUser; } 
            else { allUsers.push(currentUser); }
            localStorage.setItem('dGallery_users', JSON.stringify(allUsers));
            localStorage.setItem('dGallery_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('dGallery_user');
        }
    } catch (e) {
        if (e.name === 'QuotaExceededError') alert("⚠️ Hafıza doldu! Lütfen eski gönderileri silin.");
    }
}

// Görsel Sıkıştırma (GIF hariç)
function processImageForStorage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        if (file.type === 'image/gif') { callback(e.target.result); return; }
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width, height = img.height;
            const MAX = 1200;
            if (width > height && width > MAX) { height = Math.round(height*(MAX/width)); width = MAX; } 
            else if (height > MAX) { width = Math.round(width*(MAX/height)); height = MAX; }
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}


// --- DOM ELEMANLARI ---
const authView = document.getElementById('auth-view'), appView = document.getElementById('app-view');
const feedSection = document.getElementById('feed-section'), profileSection = document.getElementById('profile-section');
const imageGrid = document.getElementById('image-grid'), profileGrid = document.getElementById('profile-grid');
const commentsList = document.getElementById('profile-comments-list');
const feedTitle = document.getElementById('feed-title');

// Sidebar ve Menü Elementleri
const sidebar = document.getElementById('left-sidebar'), sidebarOverlay = document.getElementById('sidebar-overlay');
const openMenuBtn = document.getElementById('open-menu-btn'), closeSidebarBtn = document.getElementById('close-sidebar-btn');

// Ayarlar Elementleri
const settingsModal = document.getElementById('settings-modal');
const settingTheme = document.getElementById('setting-theme');
const settingPrivacyLikes = document.getElementById('setting-privacy-likes');
const settingPrivacySaves = document.getElementById('setting-privacy-saves');

const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');


// --- BAŞLANGIÇ ---
function initApp() {
    allUsers = allUsers.map(verifyUserStructure);
    
    if (savedTheme === 'light') { document.body.classList.add('light-mode'); settingTheme.checked = true; }

    if (currentUser) {
        currentUser = verifyUserStructure(currentUser);
        authView.classList.add('hidden'); appView.classList.remove('hidden');
        updateUIWithUserData(); showFeed();
    } else {
        authView.classList.remove('hidden'); appView.classList.add('hidden');
    }
}

function updateUIWithUserData() {
    document.getElementById('nav-username').textContent = currentUser.username;
    const navImg = document.getElementById('nav-avatar-img');
    const navIcon = document.getElementById('nav-avatar-icon');

    if (currentUser.avatar && currentUser.avatar !== '') {
        navImg.src = currentUser.avatar;
        navImg.classList.remove('hidden'); navIcon.classList.add('hidden');
    } else {
        navImg.classList.add('hidden'); navIcon.classList.remove('hidden');
    }
}


// --- GİRİŞ / ÇIKIŞ ---
document.getElementById('go-to-register').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('hidden'); document.getElementById('register-form').classList.remove('hidden');
});
document.getElementById('go-to-login').addEventListener('click', () => {
    document.getElementById('register-form').classList.add('hidden'); document.getElementById('login-form').classList.remove('hidden');
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    if (allUsers.find(u => u.username === username)) { alert("Bu kullanıcı adı alınmış!"); return; }
    currentUser = verifyUserStructure({ username: username, gender: document.getElementById('reg-gender').value, avatar: '', likes: [], saves: [] });
    saveData(); 
    authView.classList.add('hidden'); appView.classList.remove('hidden');
    updateUIWithUserData(); showFeed();
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    let existingUser = allUsers.find(u => u.username === username);
    if (existingUser) { currentUser = verifyUserStructure(existingUser); } 
    else { currentUser = verifyUserStructure({ username: username, gender: 'Belirtilmedi', avatar: '', likes: [], saves: [] }); }
    saveData();
    authView.classList.add('hidden'); appView.classList.remove('hidden');
    updateUIWithUserData(); showFeed();
});

document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null; saveData(); 
    appView.classList.add('hidden'); authView.classList.remove('hidden');
});


// --- YAN MENÜ (SIDEBAR) MANTIĞI ---
function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.classList.remove('hidden'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.add('hidden'); }

openMenuBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.getElementById('menu-home').addEventListener('click', () => { closeSidebar(); showFeed(); });
document.getElementById('menu-following').addEventListener('click', () => { closeSidebar(); showFollowingFeed(); });
document.getElementById('menu-myposts').addEventListener('click', () => { closeSidebar(); viewUserProfile(currentUser.username); showProfileTab('posts'); });
document.getElementById('menu-createpost').addEventListener('click', () => { closeSidebar(); document.getElementById('upload-modal').classList.remove('hidden'); });
document.getElementById('menu-settings').addEventListener('click', () => { closeSidebar(); openSettings(); });


// --- AYARLAR MODALI ---
function openSettings() {
    settingPrivacyLikes.checked = currentUser.privacy.showLikes;
    settingPrivacySaves.checked = currentUser.privacy.showSaves;
    settingsModal.classList.remove('hidden');
}

document.getElementById('close-settings-modal').addEventListener('click', () => { settingsModal.classList.add('hidden'); });

settingTheme.addEventListener('change', (e) => {
    if(e.target.checked) {
        document.body.classList.add('light-mode');
        localStorage.setItem('dGallery_theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('dGallery_theme', 'dark');
    }
});

settingPrivacyLikes.addEventListener('change', (e) => { currentUser.privacy.showLikes = e.target.checked; saveData(); });
settingPrivacySaves.addEventListener('change', (e) => { currentUser.privacy.showSaves = e.target.checked; saveData(); });


// --- LİSTE MODALI (Takipçiler ve Takip Edilenler İçin) ---
function showUserList(usernameArray, title) {
    const listModal = document.getElementById('list-modal');
    const listContent = document.getElementById('list-modal-content');
    document.getElementById('list-modal-title').textContent = title;
    listContent.innerHTML = '';

    if (usernameArray.length === 0) {
        listContent.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:20px;">Kimse yok.</p>';
    } else {
        usernameArray.forEach(uname => {
            const uInfo = allUsers.find(u => u.username === uname);
            const avatarSrc = (uInfo && uInfo.avatar) ? uInfo.avatar : 'https://via.placeholder.com/150/2c2c2c/FFFFFF?text=User';
            
            const item = document.createElement('div');
            item.className = 'list-user-item';
            item.innerHTML = `
                <div class="list-user-info" onclick="goToProfileFromList('${uname}')">
                    <img src="${avatarSrc}" alt="Avatar">
                    <span>${uname}</span>
                </div>
            `;
            listContent.appendChild(item);
        });
    }

    listModal.classList.remove('hidden');
    appView.classList.add('content-blurred');
}

document.getElementById('close-list-modal').addEventListener('click', () => {
    document.getElementById('list-modal').classList.add('hidden');
    appView.classList.remove('content-blurred');
});

function goToProfileFromList(uname) {
    document.getElementById('list-modal').classList.add('hidden');
    appView.classList.remove('content-blurred');
    viewUserProfile(uname);
}

// Profil İstatistiklerine Tıklama Etkinliği
document.getElementById('btn-show-followers').addEventListener('click', () => {
    showUserList(currentProfileUser.followers, 'Takipçiler');
});
document.getElementById('btn-show-following').addEventListener('click', () => {
    showUserList(currentProfileUser.following, 'Takip Edilenler');
});


// --- AKIŞ GÖRÜNÜMLERİ ---
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allImages.filter(img => img.title.toLowerCase().includes(term) || img.type.toLowerCase().includes(term));
    renderGrid(filtered, imageGrid);
});

function showFeed() {
    feedTitle.textContent = "Ana Akış";
    feedSection.classList.remove('hidden'); profileSection.classList.add('hidden');
    renderGrid(allImages, imageGrid);
}

function showFollowingFeed() {
    feedTitle.textContent = "Takip Edilenler";
    feedSection.classList.remove('hidden'); profileSection.classList.add('hidden');
    
    const filtered = allImages.filter(img => currentUser.following.includes(img.user));
    if(filtered.length === 0) {
        imageGrid.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-muted);">Henüz kimseyi takip etmiyorsun veya takip ettiklerinin paylaşımı yok.</p>`;
    } else {
        renderGrid(filtered, imageGrid);
    }
}

function renderGrid(images, container) {
    container.innerHTML = '';
    images.forEach(imgData => {
        const card = document.createElement('div');
        card.className = 'img-card';
        card.innerHTML = `<img src="${imgData.url}" alt="${imgData.title}">
            <div class="img-card-overlay">
                <h4>${imgData.title}</h4>
                <small class="uploader-name-click" data-username="${imgData.user}">@${imgData.user}</small>
            </div>`;
        card.querySelector('img').addEventListener('click', () => openModal(imgData));
        card.querySelector('.uploader-name-click').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('image-modal').classList.add('hidden'); 
            viewUserProfile(imgData.user);
        });
        container.appendChild(card);
    });
}


// --- PROFİL GÖRÜNTÜLEME VE TAKİP SİSTEMİ ---
document.getElementById('nav-profile-btn').addEventListener('click', () => { viewUserProfile(currentUser.username); });

function viewUserProfile(username) {
    feedSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
    
    let foundUser = allUsers.find(u => u.username === username);
    if (!foundUser && username === currentUser.username) foundUser = currentUser;
    if (!foundUser) return;
    
    currentProfileUser = verifyUserStructure(foundUser);
    let isMe = (currentProfileUser.username === currentUser.username);

    document.getElementById('profile-username').textContent = currentProfileUser.username;
    document.getElementById('stat-followers').textContent = currentProfileUser.followers.length;
    document.getElementById('stat-following').textContent = currentProfileUser.following.length;

    const profImg = document.getElementById('profile-avatar-img');
    const profIcon = document.getElementById('profile-avatar-icon');
    const editLayer = document.getElementById('edit-avatar-layer');

    if (currentProfileUser.avatar && currentProfileUser.avatar !== '') {
        profImg.src = currentProfileUser.avatar;
        profImg.classList.remove('hidden'); profIcon.classList.add('hidden');
    } else {
        profImg.classList.add('hidden'); profIcon.classList.remove('hidden');
    }

    const followBtn = document.getElementById('follow-btn');
    if (isMe) {
        editLayer.classList.remove('hidden');
        followBtn.classList.add('hidden');
    } else {
        editLayer.classList.add('hidden');
        followBtn.classList.remove('hidden');
        
        if (currentUser.following.includes(currentProfileUser.username)) {
            followBtn.textContent = "Takibi Bırak"; 
            followBtn.classList.add('following');
        } else {
            followBtn.textContent = "Takip Et"; 
            followBtn.classList.remove('following');
        }
    }

    const tabLikes = document.getElementById('tab-likes');
    const tabSaves = document.getElementById('tab-saves');
    
    if (!isMe && !currentProfileUser.privacy.showLikes) tabLikes.classList.add('hidden');
    else tabLikes.classList.remove('hidden');

    if (!isMe && !currentProfileUser.privacy.showSaves) tabSaves.classList.add('hidden');
    else tabSaves.classList.remove('hidden');

    showProfileTab('posts'); 
}

document.getElementById('follow-btn').addEventListener('click', () => {
    const targetName = currentProfileUser.username;
    const isFollowing = currentUser.following.includes(targetName);

    if (isFollowing) {
        currentUser.following = currentUser.following.filter(n => n !== targetName);
        currentProfileUser.followers = currentProfileUser.followers.filter(n => n !== currentUser.username);
    } else {
        currentUser.following.push(targetName);
        currentProfileUser.followers.push(currentUser.username);
    }
    
    const targetIndex = allUsers.findIndex(u => u.username === targetName);
    if(targetIndex > -1) allUsers[targetIndex] = currentProfileUser;
    saveData();
    viewUserProfile(targetName);
});

document.getElementById('profile-avatar-wrapper').addEventListener('click', () => {
    if (currentProfileUser.username === currentUser.username) { document.getElementById('avatar-upload').click(); }
});

document.getElementById('avatar-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processImageForStorage(file, function(processedBase64) {
        currentUser.avatar = processedBase64;
        allImages.forEach(img => { if (img.user === currentUser.username) img.avatar = currentUser.avatar; });
        saveData(); updateUIWithUserData(); viewUserProfile(currentUser.username);
    });
});


// --- PROFİL SEKMELERİ İÇERİK YÜKLEME ---
function showProfileTab(tabType) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-target="${tabType}"]`).classList.add('active');

    const emptyState = document.getElementById('profile-empty-state');
    const emptyStateText = document.getElementById('empty-state-text');
    
    emptyState.classList.add('hidden');
    profileGrid.classList.add('hidden');
    commentsList.classList.add('hidden');

    if (tabType === 'comments') {
        commentsList.classList.remove('hidden');
        renderProfileComments(emptyState, emptyStateText);
    } else {
        profileGrid.classList.remove('hidden');
        let displayImages = [];

        if (tabType === 'posts') {
            displayImages = allImages.filter(img => img.user === currentProfileUser.username);
            if (displayImages.length === 0) { emptyStateText.textContent = "Hiç paylaşım yok."; emptyState.classList.remove('hidden'); }
        } else if (tabType === 'likes') {
            displayImages = allImages.filter(img => currentProfileUser.likes.includes(img.id));
            if (displayImages.length === 0) { emptyStateText.textContent = "Beğenilen paylaşım yok."; emptyState.classList.remove('hidden'); }
        } else if (tabType === 'saves') {
            displayImages = allImages.filter(img => currentProfileUser.saves.includes(img.id));
            if (displayImages.length === 0) { emptyStateText.textContent = "Kaydedilen paylaşım yok."; emptyState.classList.remove('hidden'); }
        }
        renderGrid(displayImages, profileGrid);
    }
}

function renderProfileComments(emptyState, emptyStateText) {
    commentsList.innerHTML = '';
    let hasComments = false;
    allImages.forEach(img => {
        img.comments.forEach(comment => {
            if(comment.user === currentProfileUser.username) {
                hasComments = true;
                const div = document.createElement('div');
                div.className = 'profile-comment-item';
                div.innerHTML = `<small><i class="fas fa-image"></i> "${img.title}" gönderisine yapılan yorum (Gitmek için tıkla)</small><p>${comment.text}</p>`;
                div.querySelector('small').addEventListener('click', () => { openModal(img); });
                commentsList.appendChild(div);
            }
        });
    });
    if(!hasComments) { emptyStateText.textContent = "Hiç yorum yapılmamış."; emptyState.classList.remove('hidden'); }
}
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => showProfileTab(e.target.dataset.target));
});


// --- MODAL VE ETKİLEŞİM MANTIĞI ---
function openModal(imgData) {
    currentViewingImageId = imgData.id;
    modalImage.src = imgData.url;
    document.getElementById('modal-image-title').textContent = imgData.title;
    document.getElementById('modal-image-type').textContent = `#${imgData.type}`;
    document.getElementById('modal-uploader-name').textContent = imgData.user;
    
    if (imgData.user === currentUser.username) { document.getElementById('delete-btn').classList.remove('hidden'); } 
    else { document.getElementById('delete-btn').classList.add('hidden'); }

    document.getElementById('modal-uploader-click').onclick = () => {
        imageModal.classList.add('hidden'); appView.classList.remove('content-blurred');
        viewUserProfile(imgData.user);
    };

    const uploader = allUsers.find(u => u.username === imgData.user);
    if(uploader && uploader.avatar) document.getElementById('modal-uploader-avatar').src = uploader.avatar;
    else if (imgData.avatar) document.getElementById('modal-uploader-avatar').src = imgData.avatar;
    else document.getElementById('modal-uploader-avatar').src = 'https://via.placeholder.com/150/2c2c2c/FFFFFF?text=User';
    
    updateInteractionButtons();
    const cList = document.getElementById('modal-comments-list');
    cList.innerHTML = '';
    imgData.comments.forEach(c => cList.innerHTML += `<div class="comment"><strong>${c.user}:</strong> ${c.text}</div>`);

    imageModal.classList.remove('hidden'); modalImage.classList.remove('slide-right');
    appView.classList.add('content-blurred');
}

document.getElementById('close-modal').addEventListener('click', () => { imageModal.classList.add('hidden'); appView.classList.remove('content-blurred'); });
modalImage.addEventListener('click', () => modalImage.classList.toggle('slide-right'));

function updateInteractionButtons() {
    const likeBtn = document.getElementById('like-btn'), saveBtn = document.getElementById('save-btn');
    if (currentUser.likes.includes(currentViewingImageId)) likeBtn.classList.add('liked'); else likeBtn.classList.remove('liked');
    if (currentUser.saves.includes(currentViewingImageId)) saveBtn.classList.add('saved'); else saveBtn.classList.remove('saved');
}

document.getElementById('like-btn').addEventListener('click', () => {
    if (currentUser.likes.includes(currentViewingImageId)) currentUser.likes.filter(id => id !== currentViewingImageId);
    else currentUser.likes.push(currentViewingImageId);
    updateInteractionButtons(); saveData();
    if (!profileSection.classList.contains('hidden') && document.querySelector('[data-target="likes"]').classList.contains('active')) showProfileTab('likes');
});

document.getElementById('save-btn').addEventListener('click', () => {
    if(currentUser.saves.includes(currentViewingImageId)) currentUser.saves = currentUser.saves.filter(id => id !== currentViewingImageId);
    else currentUser.saves.push(currentViewingImageId);
    updateInteractionButtons(); saveData();
    if (!profileSection.classList.contains('hidden') && document.querySelector('[data-target="saves"]').classList.contains('active')) showProfileTab('saves');
});

document.getElementById('delete-btn').addEventListener('click', () => {
    if (confirm("Bu gönderiyi kalıcı olarak silmek istediğine emin misin?")) {
        allImages = allImages.filter(img => img.id !== currentViewingImageId);
        saveData(); imageModal.classList.add('hidden'); appView.classList.remove('content-blurred');
        if (!profileSection.classList.contains('hidden')) showProfileTab('posts'); else showFeed();
    }
});

document.getElementById('submit-comment-btn').addEventListener('click', () => {
    const text = document.getElementById('new-comment-input').value.trim();
    if (text === '') return;
    const imgIndex = allImages.findIndex(img => img.id === currentViewingImageId);
    allImages[imgIndex].comments.push({ user: currentUser.username, text: text });
    saveData(); document.getElementById('new-comment-input').value = '';
    const cList = document.getElementById('modal-comment-list');
    cList.innerHTML += `<div class="comment"><strong>${currentUser.username}:</strong> ${text}</div>`;
});


// --- PAYLAŞIM YAPMA MANTIĞI ---
document.getElementById('close-upload-modal').addEventListener('click', () => { document.getElementById('upload-modal').classList.add('hidden'); });

document.getElementById('submit-upload-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('upload-file'), title = document.getElementById('upload-title').value, type = document.getElementById('upload-type').value;
    if (!fileInput.files[0] || !title || !type) { alert("Lütfen tüm alanları doldurun ve resim seçin!"); return; }

    processImageForStorage(fileInput.files[0], function(processedBase64) {
        allImages.unshift({ id: Date.now(), title: title, type: type, url: processedBase64, user: currentUser.username, avatar: currentUser.avatar, comments: [] });
        saveData();
        document.getElementById('upload-modal').classList.add('hidden');
        document.getElementById('upload-title').value = ''; document.getElementById('upload-type').value = ''; fileInput.value = '';
        viewUserProfile(currentUser.username); showProfileTab('posts');
    });
});

initApp();