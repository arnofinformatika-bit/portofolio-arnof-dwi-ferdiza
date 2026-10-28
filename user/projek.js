// ==========================================
// USER: PROJEK (PORTFOLIO PROJECTS)
// ==========================================

const defaultProjects = [
    {
        id: 'proj_def_1',
        title: 'Diet Sehat Yuk',
        link: 'https://diet-sehat-yuks-741694573454.asia-southeast1.run.app/',
        image: 'foto/PROJECT/diet sehat yuk.png',
        desc: 'Aplikasi panduan nutrisi dan pola hidup sehat berbasis web.'
    },
    {
        id: 'proj_def_2',
        title: 'Rekap Keuangan',
        link: 'https://rekap-keuangan-five.vercel.app/',
        image: 'foto/PROJECT/rekap keuangan.jpeg',
        desc: 'Sistem rekapitulasi dan manajemen pencatatan keuangan harian.'
    },
    {
        id: 'proj_def_3',
        title: 'Deteksi Pencegah Kantuk Sopir (YOLO)',
        link: 'https://huggingface.co/spaces/Arnof24/deteksi-kantuk-yolo',
        image: 'foto/PROJECT/deteksi kantuk yolo.jpeg',
        desc: 'Sistem AI deteksi wajah realtime untuk mencegah pengemudi mengantuk.'
    },
    {
        id: 'proj_def_4',
        title: 'Game Edukasi Niko',
        link: 'https://permainan-niko-by-arnof.vercel.app/',
        image: 'foto/PROJECT/game edukasi niko.jpeg',
        desc: 'Game interaktif berbasis web sebagai media pembelajaran edukatif.'
    },
    {
        id: 'proj_def_5',
        title: 'Sistem Absensi Kamera (Realtime)',
        link: 'https://absen-perlengkapan-fiks.vercel.app/',
        image: 'foto/PROJECT/absensi kamera.jpeg',
        desc: 'Sistem absensi dan monitoring perlengkapan otomatis via kamera realtime.'
    },
    {
        id: 'proj_def_6',
        title: 'Sistem Informasi UKM ROBOTIC UBL',
        link: 'https://ukm.robotic.ubl.web.id/',
        image: 'foto/PROJECT/website UKM ROBOTIC UBL.jpeg',
        desc: 'Website resmi sistem informasi dan pendaftaran UKM ROBOTIC UBL.'
    }
];

function openProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.style.display = 'flex';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('projectForm');
    if (form) form.reset();
}

async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    let projects = [];
    try {
        const c = localStorage.getItem('arnof_projects_cache');
        if (c) projects = JSON.parse(c);
    } catch (e) { }

    let combined = [...defaultProjects];
    if (Array.isArray(projects) && projects.length > 0) {
        projects.forEach(p => {
            if (p && (p.title || p.name)) {
                const titleVal = p.title || p.name;
                const exists = combined.some(item => (p.id && String(item.id) === String(p.id)) || item.title === titleVal);
                if (!exists) {
                    // Masukkan projek yang baru ditambahkan di bagian paling depan
                    combined.unshift(p);
                }
            }
        });
    }

    container.innerHTML = '';
    combined.forEach(project => {
        const item = document.createElement('div');
        item.className = 'card';
        item.style.padding = '1.2rem';
        item.style.background = 'var(--card-bg)';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.justifyContent = 'space-between';
        item.style.minHeight = '360px';

        const projTitle = project.title || project.name || 'Projek Portofolio';
        const projImg = project.image || 'foto/PROJECT/diet sehat yuk.png';
        const projLink = project.link || project.url || '#';
        const descText = project.desc ? `<p class="text-secondary" style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.4; opacity: 0.85;">${project.desc}</p>` : '';

        item.innerHTML = `
            <div style="display: flex; flex-direction: column; flex-grow: 1;">
                <div class="gallery-item" style="height: 170px; overflow: hidden; position: relative; border-radius: 10px; margin-bottom: 0.8rem;">
                    <img src="${projImg}" alt="${projTitle}" style="height: 100%; width: 100%; object-fit: cover;">
                </div>
                <h3 style="font-size: 1rem; color: var(--text-primary); line-height: 1.3; font-weight: 600;">${projTitle}</h3>
                ${descText}
            </div>
            <div style="margin-top: 1.2rem; width: 100%;">
                <a href="${projLink}" target="_blank" class="btn" style="display: flex; width: 100%; font-size: 0.88rem; background: var(--accent-color); color: #fff; text-align: center; align-items: center; justify-content: center; gap: 8px; padding: 0.75rem 1rem; border-radius: 10px; font-weight: 600; text-decoration: none; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.2s ease;">
                    <i class="fas fa-external-link-alt"></i> Lihat Projek
                </a>
            </div>
        `;
        container.appendChild(item);
    });
}

// Fungsi Hapus Projek menggunakan Firestore / RTDB
async function deleteProject(id) {
    if (confirm('Hapus projek ini dari database?')) {
        try {
            if (window.deleteDoc && window.doc && window.db) {
                await window.deleteDoc(window.doc(window.db, "projects", id));
            }
            if (window.remove && window.dbRef && window.rtdb) {
                await window.remove(window.dbRef(window.rtdb, "projects/" + id));
            }
            // Update cache
            let cached = [];
            try { cached = JSON.parse(localStorage.getItem('arnof_projects_cache') || "[]"); } catch(e){}
            cached = cached.filter(p => String(p.id) !== String(id));
            localStorage.setItem('arnof_projects_cache', JSON.stringify(cached));
            loadProjects();
        } catch (error) {
            console.error("Gagal menghapus: ", error);
        }
    }
}

async function syncProjectsContent(getListFn) {
    try {
        let projItems = [];
        // 1. Ambil dari RTDB
        if (typeof getListFn === 'function') {
            projItems = await getListFn("projects");
        } else if (window.getRTDBList) {
            projItems = await window.getRTDBList("projects");
        }

        // 2. Jika di RTDB kosong / sedikit, coba ambil dari Firestore
        if (window.getDocs && window.collection && window.db) {
            try {
                const snap = await window.getDocs(window.collection(window.db, "projects"));
                const firestoreItems = [];
                snap.forEach(d => {
                    firestoreItems.push({ id: d.id, ...d.data() });
                });
                if (firestoreItems.length > 0) {
                    // Gabungkan items tanpa duplikasi
                    firestoreItems.forEach(fi => {
                        const exists = projItems.some(pi => String(pi.id) === String(fi.id) || pi.title === fi.title);
                        if (!exists) projItems.push(fi);
                    });
                }
            } catch (fErr) {
                console.warn("Firestore projects sync note:", fErr.message);
            }
        }

        if (projItems.length > 0) {
            try {
                localStorage.setItem('arnof_projects_cache', JSON.stringify(projItems));
            } catch (e) { }
        }
    } catch (err) {
        console.warn("syncProjectsContent error:", err);
    } finally {
        // Selalu muat projek ke tampilan UI
        loadProjects();
    }
}

// Inisialisasi Event Listener Form Tambah Projek
function initProjectFormListener() {
    const projectForm = document.getElementById('projectForm');
    if (projectForm && !projectForm.dataset.listenerBound) {
        projectForm.dataset.listenerBound = 'true';
        projectForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const title = document.getElementById('projectTitle').value;
            const link = document.getElementById('projectLink').value;
            const fileInput = document.getElementById('projectImage');
            const file = fileInput.files[0];

            if (file) {
                try {
                    if (!window.storage || !window.ref || !window.uploadBytesResumable) {
                        alert("Firebase Storage belum siap, coba sesaat lagi.");
                        return;
                    }
                    const storageRef = window.ref(window.storage, 'projects_images/' + Date.now() + '_' + file.name);
                    const uploadTask = window.uploadBytesResumable(storageRef, file);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            console.log("Sedang mengunggah foto...");
                        },
                        (error) => {
                            console.error("Gagal mengunggah foto:", error);
                            alert("Gagal mengunggah foto.");
                        },
                        async () => {
                            const downloadURL = await window.getDownloadURL(uploadTask.snapshot.ref);
                            await window.addDoc(window.collection(window.db, "projects"), {
                                title: title,
                                link: link,
                                image: downloadURL,
                                createdAt: Date.now()
                            });

                            alert("Projek berhasil ditambahkan ke Database!");
                            closeProjectModal();
                            loadProjects();
                        }
                    );
                } catch (error) {
                    console.error("Gagal menyimpan data:", error);
                }
            }
        });
    }
}

// Expose to window
window.defaultProjects = defaultProjects;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.loadProjects = loadProjects;
window.deleteProject = deleteProject;
window.syncProjectsContent = syncProjectsContent;

document.addEventListener('DOMContentLoaded', () => {
    initProjectFormListener();
    loadProjects();
});

// Immediate execution if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadProjects();
}
