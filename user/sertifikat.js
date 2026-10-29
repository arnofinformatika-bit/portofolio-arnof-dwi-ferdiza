// ==========================================
// USER: SERTIFIKAT (CERTIFICATES GALLERY)
// ==========================================

const defaultCertificates = [
    { id: 'cert_def_1', title: 'Dicoding - AI Praktis Untuk Produktivitas', issuer: 'Dicoding Indonesia', image: 'foto/ai.jpeg' },
    { id: 'cert_def_2', title: 'Dicoding - Membangun Aplikasi Gen AI dengan Microsoft Azure', issuer: 'Dicoding Indonesia', image: 'foto/ha.jpeg' },
    { id: 'cert_def_3', title: 'Dicoding - Belajar Penerapan Data Science dengan Microsoft Fabric', issuer: 'Dicoding Indonesia', image: 'foto/y.jpeg' },
    { id: 'cert_def_4', title: 'Dicoding - Belajar Dasar AI', issuer: 'Dicoding Indonesia', image: 'foto/h.jpeg' },
    { id: 'cert_def_5', title: 'Microsoft Elevate - "Melatih dan Mengelola Model Machine Learning di Microsoft Fabric"', issuer: 'Microsoft Elevate', image: 'foto/i.jpeg' },
    { id: 'cert_def_6', title: 'Microsoft Elevate - "Merancang Percakapan Cerdas di Azure AI Foundry"', issuer: 'Microsoft Elevate', image: 'foto/q.jpeg' },
    { id: 'cert_def_7', title: 'Microsoft Elevate - "Mempersiapkan Data untuk Model AI di Microsoft Fabric"', issuer: 'Microsoft Elevate', image: 'foto/w.jpeg' },
    { id: 'cert_def_8', title: 'UBL Trainer - Precollege 2025 - Computational Thinking Information Technology Center Universitas Bandar Lampung', issuer: 'Universitas Bandar Lampung', image: 'foto/ubl.jpeg' },
    { id: 'cert_def_9', title: 'KEMNAKER - Pembekalan 12+ Essential Skills Program Magang Nasional', issuer: 'KEMNAKER', image: 'foto/t.jpeg' },
    { id: 'cert_def_10', title: 'Sertifikat Vibe Coding 2026 Google', issuer: 'Google', image: 'foto/google.jpeg' }
];

function loadCertificates(overrideList) {
    const container = document.querySelector('#certificates .gallery-grid');
    if (!container) return;

    let deletedIds = [];
    try {
        const d = localStorage.getItem('arnof_deleted_certificates');
        if (d) deletedIds = JSON.parse(d);
    } catch (e) { }

    let customCerts = [];
    if (Array.isArray(overrideList) && overrideList.length > 0) {
        customCerts = overrideList;
        window._cachedCertificates = overrideList;
    } else if (Array.isArray(window._cachedCertificates) && window._cachedCertificates.length > 0) {
        customCerts = window._cachedCertificates;
    } else {
        try {
            const c = localStorage.getItem('arnof_certificates_cache');
            if (c) customCerts = JSON.parse(c);
        } catch (e) { }
    }

    let combined = defaultCertificates.filter(item => !deletedIds.includes(String(item.id)));
    if (Array.isArray(customCerts)) {
        customCerts.forEach(item => {
            if (item && !deletedIds.includes(String(item.id))) {
                const cTitle = item.title || item.name || item.nama;
                if (cTitle) {
                    const exists = combined.some(c => String(c.id) === String(item.id) || (c.title || c.name) === cTitle);
                    if (!exists) {
                        // Tampilkan sertifikat terbaru di paling atas
                        combined.unshift(item);
                    }
                }
            }
        });
    }

    container.innerHTML = '';
    combined.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '1rem';
        card.style.background = 'var(--card-bg)';
        card.style.position = 'relative';

        const certTitle = cert.title || cert.name || cert.nama || 'Sertifikat';
        const certIssuer = cert.issuer || cert.publisher || cert.instansi || cert.organisasi || '';
        const certImg = cert.image || cert.foto || cert.img || cert.url || 'foto/ai.jpeg';

        card.innerHTML = `
            <div class="gallery-item" style="height: 180px; overflow: hidden; position: relative; border-radius: 8px;">
                <img src="${certImg}" alt="${certTitle}" style="width: 100%; height: 100%; object-fit: cover;">
                <button class="cert-view-btn" onclick="openImageViewer('${certImg}')" title="Lihat Foto" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <h4 style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-primary); line-height: 1.3;">${certTitle}</h4>
            ${certIssuer ? `<small style="color: var(--accent-color); margin-top: 4px; display: block;">${certIssuer}</small>` : ''}
        `;
        container.appendChild(card);
    });

    const lastCard = document.createElement('div');
    lastCard.className = 'card';
    lastCard.style.padding = '1rem';
    lastCard.style.background = 'var(--card-bg)';
    lastCard.innerHTML = `
        <div class="gallery-item" style="height: 180px; border-style: solid; overflow: hidden; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            <i class="fas fa-plus fa-2x" style="color: var(--accent-color);"></i>
        </div>
        <h4 style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-primary);">Sertifikat Lainnya...</h4>
    `;
    container.appendChild(lastCard);
}

async function syncCertificatesContent(getListFn) {
    try {
        let certItems = [];
        // 1. Ambil dari RTDB
        if (typeof getListFn === 'function') {
            certItems = await getListFn("certificates");
        } else if (window.getRTDBList) {
            certItems = await window.getRTDBList("certificates");
        }

        // 2. Ambil dari Firestore dan gabungkan jika ada
        if (window.getDocs && window.collection && window.db) {
            try {
                const snap = await window.getDocs(window.collection(window.db, "certificates"));
                const firestoreCerts = [];
                snap.forEach(d => {
                    firestoreCerts.push({ id: d.id, ...d.data() });
                });
                if (firestoreCerts.length > 0) {
                    firestoreCerts.forEach(fc => {
                        const exists = certItems.some(ci => String(ci.id) === String(fc.id) || (ci.title || ci.name) === (fc.title || fc.name));
                        if (!exists) certItems.push(fc);
                    });
                }
            } catch (fErr) {
                console.warn("Firestore certificates fetch note:", fErr.message);
            }
        }

        // 3. Gabungkan juga dari local storage agar sertifikat yang baru diupload tidak hilang
        try {
            const localSaved = JSON.parse(localStorage.getItem('arnof_certificates_cache') || '[]');
            if (Array.isArray(localSaved)) {
                localSaved.forEach(ls => {
                    if (ls && !certItems.some(ci => String(ci.id) === String(ls.id) || (ci.title || ci.name) === (ls.title || ls.name))) {
                        certItems.unshift(ls);
                    }
                });
            }
        } catch(e) {}

        if (certItems && certItems.length > 0) {
            try {
                localStorage.setItem('arnof_certificates_cache', JSON.stringify(certItems));
            } catch (e) { }
        }

        if (window.rtdb && window.getRtdb && window.dbRef) {
            try {
                const delSnap = await window.getRtdb(window.dbRef(window.rtdb, "deleted_certificates"));
                if (delSnap.exists()) {
                    const delVal = delSnap.val();
                    const deletedList = Object.keys(delVal);
                    localStorage.setItem('arnof_deleted_certificates', JSON.stringify(deletedList));
                }
            } catch (e) { }
        }

        loadCertificates(certItems);
    } catch (err) {
        console.warn("syncCertificatesContent error:", err);
        loadCertificates();
    }
}

// Realtime RTDB Listeners for Instant Live Sync
function initCertificatesRealtime() {
    if (window.rtdb && window.onValue && window.dbRef) {
        try {
            window.onValue(window.dbRef(window.rtdb, "certificates"), (snapshot) => {
                if (snapshot.exists()) {
                    const val = snapshot.val();
                    const serverList = Object.keys(val).map(k => ({ id: k, ...val[k] }));
                    try { localStorage.setItem('arnof_certificates_cache', JSON.stringify(serverList)); } catch (e) { }
                    loadCertificates(serverList);
                }
            });

            window.onValue(window.dbRef(window.rtdb, "deleted_certificates"), (snapshot) => {
                if (snapshot.exists()) {
                    const delVal = snapshot.val();
                    const deletedList = Object.keys(delVal);
                    try { localStorage.setItem('arnof_deleted_certificates', JSON.stringify(deletedList)); } catch (e) { }
                    loadCertificates();
                }
            });
        } catch (e) { }
    }
}

// Expose to window
window.defaultCertificates = defaultCertificates;
window.loadCertificates = loadCertificates;
window.syncCertificatesContent = syncCertificatesContent;
window.initCertificatesRealtime = initCertificatesRealtime;

document.addEventListener('DOMContentLoaded', () => {
    loadCertificates();
    const certificateItems = document.querySelectorAll('#certificates .gallery-item');
    certificateItems.forEach(item => {
        const img = item.querySelector('img');
        if (img && !item.querySelector('.cert-view-btn')) {
            item.style.position = 'relative';
            const btn = document.createElement('button');
            btn.className = 'cert-view-btn';
            btn.innerHTML = '<i class="fas fa-eye"></i>';
            btn.onclick = () => {
                if (typeof openImageViewer === 'function') openImageViewer(img.src);
            };
            item.appendChild(btn);
            item.addEventListener('mouseenter', () => btn.style.opacity = '1');
            item.addEventListener('mouseleave', () => btn.style.opacity = '0');
        }
    });
});
