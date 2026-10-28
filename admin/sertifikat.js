// ==========================================
// ADMIN: SERTIFIKAT (CERTIFICATES MANAGEMENT)
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

function renderCertCard(c, prepend = false) {
    const container = document.getElementById("adminCertList");
    if (!container) return;
    if (container.innerText.includes("Belum ada") || container.innerText.includes("Memuat")) {
        container.innerHTML = "";
    }
    const card = document.createElement("div");
    card.className = "admin-item-card";
    card.id = `card_cert_${c.id}`;
    card.innerHTML = `
        <img src="${c.image}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div class="admin-item-info">
            <h4>${c.title}</h4>
            <p>${c.issuer}</p>
        </div>
        <div class="admin-item-btns">
            <button class="btn-action-del" onclick="deleteItem('certificates', '${c.id}', 'loadCertData')"><i class="fas fa-trash"></i> Hapus</button>
        </div>
    `;
    if (prepend && container.firstChild) {
        container.insertBefore(card, container.firstChild);
    } else {
        container.appendChild(card);
    }
}

async function loadCertData() {
    const container = document.getElementById("adminCertList");
    if (!container) return;
    try {
        let deletedIds = [];
        try {
            const d = localStorage.getItem('arnof_deleted_certificates');
            if (d) deletedIds = JSON.parse(d);
        } catch (e) { }

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const get = window.get;

        if (rtdb && dbRef && get) {
            try {
                const delSnap = await get(dbRef(rtdb, "deleted_certificates"));
                if (delSnap.exists()) {
                    deletedIds = Object.keys(delSnap.val());
                    localStorage.setItem('arnof_deleted_certificates', JSON.stringify(deletedIds));
                }
            } catch (e) { }
        }

        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("certificates") : [];

        let combined = defaultCertificates.filter(c => !deletedIds.includes(String(c.id)));
        if (Array.isArray(items)) {
            items.forEach(c => {
                if (c && c.title && !deletedIds.includes(String(c.id))) {
                    const exists = combined.some(item => String(item.id) === String(c.id) || item.title === c.title);
                    if (!exists) combined.push(c);
                }
            });
        }

        if (combined.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada sertifikat.</p>";
            return;
        }

        container.innerHTML = "";
        combined.forEach(c => renderCertCard(c, false));
    } catch (err) {
        if (container.children.length === 0) container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddCert(e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById("btnSubmitCert");
    const file = document.getElementById("certFile")?.files[0];
    const title = document.getElementById("certTitle")?.value.trim();
    const issuer = document.getElementById("certIssuer")?.value.trim();
    const showToast = window.showToast || alert;

    if (!file) return showToast("Pilih foto sertifikat!", "error");

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Memproses...";
    }
    try {
        const compressImage = window.compressImage;
        const { dataUrl } = compressImage ? await compressImage(file, 1920, 1920, 0.90) : { dataUrl: URL.createObjectURL(file) };

        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const push = window.push;
        const set = window.set;
        const setDoc = window.setDoc;
        const doc = window.doc;

        let certId = "cert_" + Date.now();
        let newRef = null;

        if (rtdb && push && dbRef) {
            newRef = push(dbRef(rtdb, "certificates"));
            certId = newRef.key;
        }

        const certPayload = {
            id: certId,
            title: title,
            issuer: issuer,
            image: dataUrl,
            createdAt: Date.now()
        };

        // OPTIMISTIC UI: RENDER SEKETIKA
        renderCertCard(certPayload, true);

        // Cache lokal
        if (window.getLocalCache && window.saveLocalCache) {
            let cached = window.getLocalCache("certificates");
            cached.unshift(certPayload);
            window.saveLocalCache("certificates", cached);
        }

        const form = document.getElementById("formAddCert");
        if (form) form.reset();
        const preview = document.getElementById("certImgPreview");
        if (preview) preview.style.display = 'none';
        const placeholder = document.getElementById("certImgPlaceholder");
        if (placeholder) placeholder.style.display = 'block';

        showToast("✨ Sertifikat berhasil ditambahkan ke Firebase!", "success");

        // Simpan ke Realtime Database dan Firestore
        if (newRef && set) {
            await set(newRef, certPayload).catch(err => console.warn("Background cert rtdb note:", err.message));
        }
        if (db && doc && setDoc) {
            await setDoc(doc(db, "certificates", certId), certPayload).catch(err => console.warn("Background cert firestore note:", err.message));
        }

    } catch (err) {
        showToast(err.message, "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "<i class='fas fa-cloud-upload-alt'></i> Upload & Simpan Sertifikat";
        }
    }
}

// Expose to window
window.defaultCertificates = defaultCertificates;
window.renderCertCard = renderCertCard;
window.loadCertData = loadCertData;
window.submitAddCert = submitAddCert;
