// ==========================================
// ADMIN: PROJEK (PROJECTS MANAGEMENT)
// ==========================================

function renderProjectCard(p, prepend = false) {
    const container = document.getElementById("adminProjectsList");
    if (!container) return;
    if (container.innerText.includes("Belum ada") || container.innerText.includes("Memuat")) {
        container.innerHTML = "";
    }
    const card = document.createElement("div");
    card.className = "admin-item-card";
    card.id = `card_proj_${p.id}`;
    card.innerHTML = `
        <img src="${p.image}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div class="admin-item-info">
            <h4>${p.title}</h4>
            <p><a href="${p.link}" target="_blank" style="color: #38bdf8;">${p.link}</a></p>
        </div>
        <div class="admin-item-btns">
            <button class="btn-action-del" onclick="deleteItem('projects', '${p.id}', 'loadProjectsData')"><i class="fas fa-trash"></i> Hapus</button>
        </div>
    `;
    if (prepend && container.firstChild) {
        container.insertBefore(card, container.firstChild);
    } else {
        container.appendChild(card);
    }
}

async function loadProjectsData() {
    const container = document.getElementById("adminProjectsList");
    if (!container) return;
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("projects") : [];
        if (items.length === 0 && container.children.length === 0) {
            container.innerHTML = "<p style='color: #888;'>Belum ada projek.</p>";
            return;
        }
        if (items.length > 0) {
            container.innerHTML = "";
            items.forEach(p => renderProjectCard(p, false));
        }
    } catch (err) {
        if (container.children.length === 0) container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddProject(e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById("btnAddProj");
    const file = document.getElementById("projImageFile")?.files[0];
    const title = document.getElementById("projTitle")?.value.trim();
    const link = document.getElementById("projLink")?.value.trim();
    const showToast = window.showToast || alert;

    if (!file) return showToast("Pilih foto projek terlebih dahulu!", "error");
    if (!title) return showToast("Judul projek tidak boleh kosong!", "error");

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Memproses...";
    }

    try {
        const compressImage = window.compressImage;
        const { dataUrl } = compressImage ? await compressImage(file, 1920, 1920, 0.90) : { dataUrl: URL.createObjectURL(file) };
        const tempId = "tmp_" + Date.now();
        const projPayload = {
            title: title,
            link: link,
            image: dataUrl,
            createdAt: Date.now()
        };

        // OPTIMISTIC UI: LANGSUNG MASUK KE LIST SEKETIKA!
        renderProjectCard({ id: tempId, ...projPayload }, true);

        // Cache lokal
        if (window.getLocalCache && window.saveLocalCache) {
            let cached = window.getLocalCache("projects");
            cached.unshift({ id: tempId, ...projPayload });
            window.saveLocalCache("projects", cached);
        }

        // Reset form & preview seketika
        const form = document.getElementById("formAddProject");
        if (form) form.reset();
        const preview = document.getElementById("projImgPreview");
        if (preview) preview.style.display = 'none';
        const placeholder = document.getElementById("projImgPlaceholder");
        if (placeholder) placeholder.style.display = 'block';

        showToast("✨ Projek berhasil ditambahkan!", "success");

        // Simpan ke Realtime Database & Firestore
        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const push = window.push;
        const addDoc = window.addDoc;
        const collection = window.collection;

        if (rtdb && push && dbRef) {
            push(dbRef(rtdb, "projects"), projPayload).catch(err => console.warn("Proj rtdb note:", err.message));
        }
        if (db && addDoc && collection) {
            addDoc(collection(db, "projects"), projPayload).catch(err => console.warn("Proj firestore note:", err.message));
        }

    } catch (err) {
        showToast(err.message, "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "<i class='fas fa-cloud-upload-alt'></i> Upload & Simpan Projek";
        }
    }
}

// Expose to window
window.renderProjectCard = renderProjectCard;
window.loadProjectsData = loadProjectsData;
window.submitAddProject = submitAddProject;
