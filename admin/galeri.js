// ==========================================
// ADMIN: GALERI (GALLERY & HMIF MANAGEMENT)
// ==========================================

function renderGalleryCard(g, prepend = false) {
    const container = document.getElementById("adminGalleryList");
    if (!container) return;

    if (!container.querySelector(".admin-item-card") && !container.querySelector("img")) {
        container.innerHTML = "";
    }

    const existing = document.getElementById(`card_gal_${g.id}`);
    if (existing) existing.remove();

    const isHMIF = (g.period === '2025/2026' || g.period === '2026/2027' || g.period === 'hmif') || (g.category === 'hmif');
    const isGeneral = (g.period === 'general' || g.category === 'general');
    const badgeText = (g.period && g.period !== 'general' && g.period !== 'hmif') ? 'HMIF ' + g.period : (isGeneral ? 'DOKUMENTASI UMUM' : (isHMIF ? 'KEGIATAN HMIF' : 'DOKUMENTASI UMUM'));
    const badgeBg = (isHMIF && !isGeneral) ? '#06b6d4' : '#64748b';

    const card = document.createElement("div");
    card.className = "admin-item-card";
    card.style.cssText = "background: rgba(20,20,20,0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: relative;";
    card.id = `card_gal_${g.id}`;
    card.innerHTML = `
        <div style="position: relative; width: 100%; height: 140px; overflow: hidden;">
            <img src="${g.image}" style="width: 100%; height: 100%; object-fit: cover;">
            <span style="position: absolute; top: 8px; left: 8px; background: ${badgeBg}; color: #fff; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                ${badgeText}
            </span>
        </div>
        <div style="padding: 0.8rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 0.5rem;">
            <h5 style="font-size: 0.85rem; color: #fff; line-height: 1.3;">${g.title}</h5>
            <button class="btn-action-del" onclick="deleteItem('gallery', '${g.id}', 'loadGalleryData')" style="width: 100%; justify-content: center;"><i class="fas fa-trash"></i> Hapus</button>
        </div>
    `;
    if (prepend && container.firstChild) {
        container.insertBefore(card, container.firstChild);
    } else {
        container.appendChild(card);
    }
}

async function loadGalleryData() {
    const container = document.getElementById("adminGalleryList");
    if (!container) return;

    let deletedIds = [];
    try {
        const d = localStorage.getItem('arnof_deleted_gallery');
        if (d) deletedIds = JSON.parse(d);
    } catch (e) { }

    const rtdb = window.rtdb;
    const dbRef = window.dbRef;
    const get = window.get;

    if (rtdb && dbRef && get) {
        try {
            const delSnap = await get(dbRef(rtdb, "deleted_gallery"));
            if (delSnap.exists()) {
                deletedIds = Object.keys(delSnap.val());
                localStorage.setItem('arnof_deleted_gallery', JSON.stringify(deletedIds));
            }
        } catch (e) { }
    }

    // 1. Render dari cache lokal instan
    let cached = (window.getLocalCache ? window.getLocalCache("gallery") : []).filter(g => g && g.title && !deletedIds.includes(String(g.id)));
    if (cached.length > 0) {
        container.innerHTML = "";
        cached.forEach(g => renderGalleryCard(g, false));
    }

    // 2. Fetch data dari server
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("gallery") : [];
        const filtered = items.filter(g => g && g.title && !deletedIds.includes(String(g.id)));

        if (filtered.length > 0) {
            if (window.saveLocalCache) window.saveLocalCache("gallery", filtered);
            try { localStorage.setItem('galleryActivities', JSON.stringify(filtered)); } catch (e) { }
            container.innerHTML = "";
            filtered.forEach(g => renderGalleryCard(g, false));
        } else if (cached.length === 0) {
            container.innerHTML = "<p style='color:#888; grid-column: 1/-1;'>Belum ada foto galeri kustom.</p>";
        }
    } catch (err) {
        if (cached.length === 0) {
            container.innerHTML = "<p style='color:#888; grid-column: 1/-1;'>Belum ada foto galeri.</p>";
        }
    }
}

async function submitAddGallery(e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById("btnSubmitGallery");
    const fileInput = document.getElementById("galleryFile");
    const files = Array.from(fileInput?.files || []);
    const titleInput = document.getElementById("galleryTitle");
    const baseTitle = titleInput?.value.trim();
    const periodSelect = document.getElementById("galleryPeriod");
    const period = periodSelect ? periodSelect.value : "2026/2027";
    const showToast = window.showToast || alert;

    if (!files || files.length === 0) return showToast("Pilih setidaknya 1 foto terlebih dahulu!", "error");
    if (!baseTitle) return showToast("Judul foto tidak boleh kosong!", "error");

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class='fas fa-spinner fa-spin'></i> Memproses ${files.length} Foto...`;
    }

    try {
        let successCount = 0;
        const compressImage = window.compressImage;
        const rtdb = window.rtdb;
        const db = window.db;
        const push = window.push;
        const set = window.set;
        const setDoc = window.setDoc;
        const doc = window.doc;
        const dbRef = window.dbRef;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const photoTitle = files.length > 1 ? `${baseTitle} (${i + 1})` : baseTitle;

            const { dataUrl } = compressImage ? await compressImage(file, 1920, 1920, 0.85) : { dataUrl: URL.createObjectURL(file) };
            let galId = 'gal_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7);

            if (rtdb && push && dbRef) {
                const newRef = push(dbRef(rtdb, "gallery"));
                if (newRef && newRef.key) galId = newRef.key;
            }

            const isHMIFCategory = (period === '2025/2026' || period === '2026/2027' || period === 'hmif');
            const galPayload = {
                id: galId,
                title: photoTitle,
                period: period,
                category: isHMIFCategory ? 'hmif' : 'general',
                image: dataUrl,
                createdAt: Date.now() + i
            };

            // Simpan ke Cache Lokal seketika
            if (window.getLocalCache && window.saveLocalCache) {
                const cached = window.getLocalCache("gallery");
                cached.unshift(galPayload);
                window.saveLocalCache("gallery", cached);
                try { localStorage.setItem('galleryActivities', JSON.stringify(cached)); } catch (e) { }
            }

            // OPTIMISTIC UI: LANGSUNG MASUK KE LIST SEKETIKA
            renderGalleryCard(galPayload, true);

            // Simpan ke Realtime Database & Firestore
            try {
                if (rtdb && set && dbRef) {
                    await set(dbRef(rtdb, `gallery/${galId}`), galPayload);
                }
            } catch (rErr) {
                console.error("RTDB Save Error:", rErr);
            }

            try {
                if (db && setDoc && doc) {
                    await setDoc(doc(db, "gallery", galId), galPayload);
                }
            } catch (fErr) {
                console.error("Firestore Save Error:", fErr);
            }

            successCount++;
        }

        // Reset form & preview seketika
        const form = document.getElementById("formAddGallery");
        if (form) form.reset();
        const preview = document.getElementById("galleryImgPreview");
        if (preview) preview.style.display = 'none';
        const placeholder = document.getElementById("galleryImgPlaceholder");
        if (placeholder) placeholder.style.display = 'block';

        showToast(`✨ ${successCount} foto galeri HMIF berhasil tersimpan ke Firebase!`, "success");
        loadGalleryData();

    } catch (err) {
        showToast("Gagal menyimpan foto: " + err.message, "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "<i class='fas fa-cloud-upload-alt'></i> Upload Ke Galeri Firebase (HD)";
        }
    }
}

// Expose to window
window.renderGalleryCard = renderGalleryCard;
window.loadGalleryData = loadGalleryData;
window.submitAddGallery = submitAddGallery;
