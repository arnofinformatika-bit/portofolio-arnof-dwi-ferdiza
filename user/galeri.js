// ==========================================
// USER: GALERI (GALLERY & HMIF ACTIVITIES)
// ==========================================

const defaultGalleryActivities = [
    { id: 'def_1', title: 'Kegiatan 1', image: 'foto/kegiatan/q.jpeg' },
    { id: 'def_2', title: 'Kegiatan 2', image: 'foto/kegiatan/w.jpeg' },
    { id: 'def_3', title: 'Kegiatan 3', image: 'foto/kegiatan/e.jpeg' },
    { id: 'def_4', title: 'Kegiatan 4', image: 'foto/kegiatan/r.jpeg' },
    { id: 'def_5', title: 'Kegiatan 5', image: 'foto/kegiatan/t.jpeg' },
    { id: 'def_6', title: 'Kegiatan 6', image: 'foto/kegiatan/y.jpeg' },
    { id: 'def_7', title: 'Kegiatan 7', image: 'foto/kegiatan/a.jpeg' },
    { id: 'def_8', title: 'Kegiatan 8', image: 'foto/kegiatan/d.jpeg' },
    { id: 'def_9', title: 'Kegiatan 9', image: 'foto/kegiatan/f.jpeg' },
    { id: 'def_10', title: 'Kegiatan 10', image: 'foto/kegiatan/h.jpeg' },
    { id: 'def_11', title: 'Kegiatan 11', image: 'foto/kegiatan/i.jpeg' },
    { id: 'def_12', title: 'Kegiatan 12', image: 'foto/kegiatan/o.jpeg' },
    { id: 'def_13', title: 'Kegiatan 13', image: 'foto/kegiatan/p.jpeg' },
    { id: 'def_14', title: 'Kegiatan 14', image: 'foto/kegiatan/s.jpeg' },
    { id: 'def_15', title: 'Kegiatan 15', image: 'foto/kegiatan/u.jpeg' },
    { id: 'def_16', title: 'Kegiatan 16 Seminar 2026', image: 'foto/kegiatan/kegiatan seminar 2026.jpeg' },
    { id: 'def_17', title: 'Kegiatan 17 Seminar Teknologi 2026', image: 'foto/kegiatan/kegiatan seminar teknologi 2026.jpeg' },
    { id: 'def_18', title: 'Kegiatan 18 Seminar Umum', image: 'foto/kegiatan/kegiatan seminar.jpeg' },
    { id: 'def_19', title: 'Kegiatan 19 Sosialisasi mesin iris pisang pada mitra..', image: 'foto/kegiatan/KEGIATAN 19.jpeg' },
    { id: 'def_20', title: 'Kegiatan 20 Evaluasi pelaksanaan dan keberlanjutan program', image: 'foto/kegiatan/KEGIATAN 20.jpeg' }
];

let currentGalleryFilter = 'all';

function filterGallery(period, btnElement) {
    currentGalleryFilter = period;
    const buttons = document.querySelectorAll('.capsule-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        const targetBtn = document.querySelector(`.capsule-btn[data-period="${period}"]`);
        if (targetBtn) targetBtn.classList.add('active');
    }
    loadGallery();
}

function showAllHMIFKegiatan() {
    const section = document.getElementById('gallery');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    filterGallery('hmif');
}

function openUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'flex';
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('uploadForm');
    if (form) form.reset();
}

function compressImageHD(file, maxWidth = 1200, maxHeight = 1200, quality = 0.80) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d', { alpha: false });
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = () => resolve(event.target.result);
        };
        reader.onerror = () => reject(new Error("Gagal membaca file foto"));
    });
}

function loadGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    let deletedIds = [];
    try {
        const d = localStorage.getItem('arnof_deleted_gallery');
        if (d) deletedIds = JSON.parse(d);
    } catch (e) { }

    let customItems = [];

    // 1. Read local cache first
    try {
        const c1 = localStorage.getItem('arnof_gallery_cache');
        if (c1) {
            const parsed = JSON.parse(c1);
            if (Array.isArray(parsed)) customItems = parsed;
        } else {
            const c2 = localStorage.getItem('galleryActivities');
            if (c2) {
                const parsed = JSON.parse(c2);
                if (Array.isArray(parsed)) customItems = parsed;
            }
        }
    } catch (e) { }

    // 2. Merge with Firebase live server items
    if (Array.isArray(window.arnof_live_gallery)) {
        window.arnof_live_gallery.forEach(sItem => {
            if (sItem && sItem.id && sItem.image) {
                const idx = customItems.findIndex(ci => String(ci.id) === String(sItem.id));
                if (idx >= 0) {
                    customItems[idx] = { ...customItems[idx], ...sItem };
                } else {
                    customItems.unshift(sItem);
                }
            }
        });
    }

    let activities = [];
    if (Array.isArray(customItems)) {
        customItems.forEach(item => {
            if (item && item.image && !deletedIds.includes(String(item.id))) {
                const exists = activities.some(a => String(a.id) === String(item.id));
                if (!exists) {
                    activities.push(item);
                }
            }
        });
    }

    defaultGalleryActivities.forEach(item => {
        if (!deletedIds.includes(String(item.id))) {
            const exists = activities.some(a => String(a.id) === String(item.id));
            if (!exists) {
                activities.push(item);
            }
        }
    });

    let filteredActivities = activities;
    if (currentGalleryFilter === 'all') {
        filteredActivities = activities.filter(a => {
            if (a.period === 'general' || a.category === 'general') return true;
            if (a.period === '2025/2026' || a.period === '2026/2027' || a.period === 'hmif' || a.category === 'hmif') return false;
            return true;
        });
    } else if (currentGalleryFilter === 'hmif') {
        filteredActivities = activities.filter(a => {
            if (a.period === 'general' || a.category === 'general') return false;
            return (a.period === '2025/2026' || a.period === '2026/2027' || a.period === 'hmif' || a.category === 'hmif' || (a.title && a.title.toUpperCase().includes('HMIF')));
        });
    } else {
        filteredActivities = activities.filter(a => {
            const p = a.period || '';
            return p === currentGalleryFilter || p.includes(currentGalleryFilter);
        });
    }

    container.innerHTML = '';

    if (filteredActivities.length === 0) {
        let filterLabel = 'Dokumentasi Umum';
        if (currentGalleryFilter === 'hmif') filterLabel = 'Kegiatan HMIF';
        else if (currentGalleryFilter === '2025/2026') filterLabel = 'HMIF KEPENGURUSAN 2025/2026';
        else if (currentGalleryFilter === '2026/2027') filterLabel = 'HMIF KEPENGURUSAN 2026/2027';

        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.1);">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-color); opacity: 0.7;"></i>
                <h4 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.1rem;">Belum Ada Foto Kegiatan (${filterLabel})</h4>
                <p style="font-size: 0.9rem; color: #94a3b8; max-width: 500px; margin: 0 auto;">Menunggu Admin memasukkan foto-foto kegiatan HMIF untuk kategori ini...</p>
            </div>
        `;
        return;
    }

    filteredActivities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.position = 'relative';
        item.style.overflow = 'hidden';
        item.style.flexDirection = 'column';
        item.style.borderRadius = '16px';
        item.style.cursor = 'pointer';

        const imgSrc = activity.image;
        const actId = String(activity.id || '');

        const isHMIF = (activity.period && activity.period.length > 0) || (activity.category && activity.category === 'hmif') || (activity.title && activity.title.toUpperCase().includes('HMIF'));
        const badgeText = activity.period ? 'HMIF ' + activity.period : (isHMIF ? 'KEGIATAN HMIF' : 'DOKUMENTASI');
        const badgeBg = isHMIF ? 'rgba(6, 182, 212, 0.85)' : 'rgba(59, 130, 246, 0.85)';

        item.innerHTML = `
            <img src="${imgSrc}" alt="${activity.title}" onclick="openImageViewer('${imgSrc}')" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); image-rendering: high-quality; backface-visibility: hidden; transform: translateZ(0);">
            <div style="position: absolute; top: 10px; left: 10px; background: ${badgeBg}; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); font-size: 0.72rem; color: #ffffff; font-weight: 700; padding: 4px 10px; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); letter-spacing: 0.3px;">
                <i class="${isHMIF ? 'fas fa-users' : 'fas fa-camera'}" style="margin-right: 4px; font-size: 0.65rem;"></i>${badgeText}
            </div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(8,11,17,0.92) 0%, rgba(8,11,17,0.5) 70%, transparent 100%); padding: 16px 12px 10px 12px; font-size: 0.88rem; color: #ffffff; font-weight: 600; text-shadow: 0 1px 3px rgba(0,0,0,0.8); pointer-events: none; line-height: 1.35;">
                ${activity.title}
            </div>
            <button class="download-btn" onclick="event.stopPropagation(); downloadImage('${imgSrc}', '${activity.title}')" title="Unduh Gambar"><i class="fas fa-download"></i></button>
            <button class="delete-btn" onclick="event.stopPropagation(); deleteActivity('${actId}')" title="Hapus"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(item);
    });
}

function deleteActivity(id) {
    const isAdmin = sessionStorage.getItem('arnof_auth') === 'true';
    if (!isAdmin) {
        if (typeof showAdminToast === 'function') {
            showAdminToast('🔒 Akses Ditolak: Hanya Admin yang dapat menghapus foto ini.');
        }
        alert('🔒 Akses Ditolak!\n\nHanya Admin yang dapat menghapus foto galeri kegiatan.\nSilakan masuk ke Panel Admin untuk mengelola/menghapus foto.');
        return;
    }

    if (confirm('Hapus kegiatan ini dari database?')) {
        try {
            let cached = JSON.parse(localStorage.getItem('arnof_gallery_cache') || '[]');
            cached = cached.filter(a => String(a.id) !== String(id));
            localStorage.setItem('arnof_gallery_cache', JSON.stringify(cached));
            localStorage.setItem('galleryActivities', JSON.stringify(cached));
        } catch (e) { }

        try {
            let deleted = JSON.parse(localStorage.getItem('arnof_deleted_gallery') || '[]');
            if (!deleted.includes(String(id))) {
                deleted.push(String(id));
                localStorage.setItem('arnof_deleted_gallery', JSON.stringify(deleted));
            }
        } catch (e) { }

        if (window.rtdb && id) {
            if (window.remove && window.dbRef && !id.startsWith('def_')) {
                window.remove(window.dbRef(window.rtdb, `gallery/${id}`)).catch(e => console.warn(e));
            }
            if (window.setRtdb && window.dbRef) {
                window.setRtdb(window.dbRef(window.rtdb, `deleted_gallery/${id}`), true).catch(e => console.warn(e));
            }
        }

        if (window.db && window.deleteDoc && window.doc && id && !id.startsWith('def_')) {
            window.deleteDoc(window.doc(window.db, "gallery", id)).catch(e => console.warn(e));
        }

        loadGallery();
    }
}

function downloadImage(imgSrc, title) {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = title || 'kegiatan-arnof';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function initUploadFormListener() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm && !uploadForm.dataset.listenerBound) {
        uploadForm.dataset.listenerBound = 'true';
        uploadForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const title = document.getElementById('activityTitle').value.trim();
            const periodSelect = document.getElementById('activityPeriod');
            const period = periodSelect ? periodSelect.value : '2026/2027';
            const fileInput = document.getElementById('activityImage');
            const file = fileInput.files[0];

            if (!title || !file) return alert('Pilih foto dan isi judul kegiatan!');

            try {
                const imageData = await compressImageHD(file, 1200, 1200, 0.80);

                let galId = 'gal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
                if (window.rtdb && window.push && window.dbRef) {
                    const newRef = window.push(window.dbRef(window.rtdb, "gallery"));
                    if (newRef && newRef.key) galId = newRef.key;
                }

                const isHMIFCategory = (period === '2025/2026' || period === '2026/2027' || period === 'hmif');
                const newActivity = {
                    id: galId,
                    title: title,
                    period: period,
                    category: isHMIFCategory ? 'hmif' : 'general',
                    image: imageData,
                    createdAt: Date.now()
                };

                let cached = [];
                try {
                    cached = JSON.parse(localStorage.getItem('arnof_gallery_cache') || '[]');
                } catch (e) { }
                cached.unshift(newActivity);
                try {
                    localStorage.setItem('arnof_gallery_cache', JSON.stringify(cached));
                    localStorage.setItem('galleryActivities', JSON.stringify(cached));
                } catch (e) { }

                if (!Array.isArray(window.arnof_live_gallery)) window.arnof_live_gallery = [];
                window.arnof_live_gallery.unshift(newActivity);

                if (window.rtdb && window.setRtdb && window.dbRef) {
                    window.setRtdb(window.dbRef(window.rtdb, `gallery/${galId}`), newActivity).catch(err => console.warn("Firebase gal note:", err.message));
                }
                if (window.db && window.setDoc && window.doc) {
                    window.setDoc(window.doc(window.db, "gallery", galId), newActivity).catch(err => console.warn("Firestore gal note:", err.message));
                }

                loadGallery();
                closeUploadModal();
                uploadForm.reset();
            } catch (err) {
                alert("Gagal memproses gambar: " + err.message);
            }
        });
    }
}

async function syncGalleryContent(getListFn) {
    try {
        let galItems = [];
        if (typeof getListFn === 'function') {
            galItems = await getListFn("gallery");
        } else if (window.getRTDBList) {
            galItems = await window.getRTDBList("gallery");
        }
        if (galItems && galItems.length > 0) {
            window.arnof_live_gallery = galItems;
            try {
                localStorage.setItem('arnof_gallery_cache', JSON.stringify(galItems));
                localStorage.setItem('galleryActivities', JSON.stringify(galItems));
            } catch (e) { }
            loadGallery();
        }
    } catch (err) {
        console.warn("syncGalleryContent error:", err);
    }
}

function initGalleryRealtime() {
    if (window.rtdb && window.onValue && window.dbRef) {
        try {
            window.onValue(window.dbRef(window.rtdb, "gallery"), (snapshot) => {
                if (snapshot.exists()) {
                    const val = snapshot.val();
                    const serverList = Object.keys(val).map(k => ({ id: k, ...val[k] }));
                    window.arnof_live_gallery = serverList;
                    try {
                        localStorage.setItem('arnof_gallery_cache', JSON.stringify(serverList));
                        localStorage.setItem('galleryActivities', JSON.stringify(serverList));
                    } catch (e) { }
                } else {
                    window.arnof_live_gallery = [];
                    try {
                        localStorage.setItem('arnof_gallery_cache', JSON.stringify([]));
                        localStorage.setItem('galleryActivities', JSON.stringify([]));
                    } catch (e) { }
                }
                loadGallery();
            });

            window.onValue(window.dbRef(window.rtdb, "deleted_gallery"), (snapshot) => {
                if (snapshot.exists()) {
                    const delVal = snapshot.val();
                    const deletedList = Object.keys(delVal);
                    try { localStorage.setItem('arnof_deleted_gallery', JSON.stringify(deletedList)); } catch (e) { }
                }
                loadGallery();
            });
        } catch (e) { }
    }
}

// Expose to window
window.defaultGalleryActivities = defaultGalleryActivities;
window.filterGallery = filterGallery;
window.showAllHMIFKegiatan = showAllHMIFKegiatan;
window.loadGallery = loadGallery;
window.deleteActivity = deleteActivity;
window.downloadImage = downloadImage;
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.compressImageHD = compressImageHD;
window.syncGalleryContent = syncGalleryContent;
window.initGalleryRealtime = initGalleryRealtime;

document.addEventListener('DOMContentLoaded', () => {
    initUploadFormListener();
    loadGallery();
});
