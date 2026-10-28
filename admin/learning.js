// ==========================================
// ADMIN: LEARNING (LEARNING PATH MANAGEMENT)
// ==========================================

const defaultCourses = [
    // Semester 1
    { code: "UN108", name: "Personal Development", sks: "1 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK107", name: "Pengantar Desain Sistem", sks: "3 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK102", name: "Matematika Dasar", sks: "3 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK101", name: "Pengantar TI & Komunikasi", sks: "3 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "UN101", name: "Pendidikan Agama Islam", sks: "2 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "UN-6102", name: "Pancasila", sks: "2 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "UN-6105", name: "English for General Communication", sks: "2 SKS", semester: "Semester 1", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "UN-6104", name: "Innovation & Entrepreunership", sks: "2 SKS", semester: "Semester 1", defaultStatus: "Sudah Ambil", defaultGrade: "A" },

    // Semester 2
    { code: "FK-6205", name: "Algoritma dan Struktur Data", sks: "2 SKS", semester: "Semester 2", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "UN-6202", name: "Bahasa Indonesia", sks: "2 SKS", semester: "Semester 2", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "UN-6203", name: "Kewarganegaraan", sks: "2 SKS", semester: "Semester 2", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "UN-6205", name: "Analytical and Creative Thinking", sks: "2 SKS", semester: "Semester 2", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "FK-6206", name: "Prak. Algoritma dan Struktur Data", sks: "1 SKS", semester: "Semester 2", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "UN305", name: "Pendidikan Anti Korupsi", sks: "2 SKS", semester: "Semester 2", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "UN109", name: "Olahraga, Seni & Budaya I", sks: "1 SKS", semester: "Semester 2", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK103", name: "Pemrograman I", sks: "3 SKS", semester: "Semester 2", defaultStatus: "Sudah Ambil", defaultGrade: "B" },
    { code: "FK105", name: "Basis Data I", sks: "3 SKS", semester: "Semester 2", defaultStatus: "Sudah Ambil", defaultGrade: "B" },
    { code: "FK104", name: "Prak. Pemrograman I", sks: "1 SKS", semester: "Semester 2", defaultStatus: "Sudah Ambil", defaultGrade: "AB" },
    { code: "FK106", name: "Prak Basis Data I", sks: "1 SKS", semester: "Semester 2", defaultStatus: "Sudah Ambil", defaultGrade: "B" },

    // Semester 3
    { code: "FK202", name: "Pemrograman II", sks: "3 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "AB" },
    { code: "FK206", name: "Analisa Kebutuhan Sistem", sks: "3 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK-6306", name: "Jaringan Komputer", sks: "3 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "IF-6301", name: "Kecerdasan Buatan", sks: "3 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "AB" },
    { code: "FK204", name: "Basis Data II", sks: "3 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "B" },
    { code: "FK205", name: "Prak. Basis Data II", sks: "1 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "B" },
    { code: "FK203", name: "Prak. Pemrograman II", sks: "1 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "AB" },
    { code: "UN-6301", name: "Pilihan Industri 1", sks: "2 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK201", name: "Matematika Lanjut", sks: "3 SKS", semester: "Semester 3", defaultStatus: "Sudah Ambil", defaultGrade: "A" },

    // Semester 4
    { code: "UN-6302", name: "Pilihan Industri 2", sks: "2 SKS", semester: "Semester 4", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6401", name: "Rekayasa Perangkat Lunak", sks: "3 SKS", semester: "Semester 4", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6403", name: "Prak. Pemrograman III", sks: "1 SKS", semester: "Semester 4", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "IF-6401", name: "IoT & Cyber-Physical Systems", sks: "3 SKS", semester: "Semester 4", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "IF-6402", name: "Computer Vision & Pengolahan Citra Digital", sks: "3 SKS", semester: "Semester 4", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "IF-6403", name: "Sistem Cerdas dan Otomasi", sks: "3 SKS", semester: "Semester 4", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "FK-6402", name: "Pemrograman III", sks: "2 SKS", semester: "Semester 4", defaultStatus: "Sedang Ambil", defaultGrade: "-" },
    { code: "FK-6404", name: "Sistem Operasi", sks: "3 SKS", semester: "Semester 4", defaultStatus: "Sedang Ambil", defaultGrade: "-" },

    // Semester 5
    { code: "IF-6503", name: "Rekayasa Perangkat Lunak Lanjut", sks: "2 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "UN-6303", name: "Pilihan Industri 3", sks: "2 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "UN-6501", name: "Community & Industrial Service", sks: "2 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "UN-6502", name: "Persiapan Pemagangan", sks: "0 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6604", name: "Pilihan Profesi 1", sks: "2 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6502", name: "Data Mining", sks: "3 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6501", name: "Statistik", sks: "3 SKS", semester: "Semester 5", defaultStatus: "Sudah Ambil", defaultGrade: "B" },
    { code: "FK-6503", name: "Interaksi Manusia dan Komputer", sks: "3 SKS", semester: "Semester 5", defaultStatus: "Sudah Ambil", defaultGrade: "A" },
    { code: "FK-6504", name: "Sistem Terdistribusi", sks: "3 SKS", semester: "Semester 5", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6505", name: "Kewirausahaan dan Teknologi", sks: "3 SKS", semester: "Semester 5", defaultStatus: "Sudah Ambil", defaultGrade: "A" },

    // Semester 6
    { code: "FK-6602", name: "Etika Profesi TI", sks: "2 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "UN-6304", name: "Pilihan Industri 4", sks: "2 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6405", name: "Cloud, Edge, & Fog Computing", sks: "3 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6605", name: "Metodologi Penelitian", sks: "2 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6604", name: "Keamanan Siber", sks: "3 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6601", name: "Pengujian dan Kualitas Sistem", sks: "3 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6605", name: "Pilihan Profesi 2", sks: "2 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6601", name: "Teori Bahasa Formal & Otomata", sks: "3 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "FK-6603", name: "Manajemen Proyek", sks: "3 SKS", semester: "Semester 6", defaultStatus: "Belum Ambil", defaultGrade: "-" },

    // Semester 7
    { code: "UN-6701", name: "Pemagangan", sks: "4 SKS", semester: "Semester 7", defaultStatus: "Belum Ambil", defaultGrade: "-" },

    // Semester 8
    { code: "UN-6305", name: "Pilihan Industri 5", sks: "2 SKS", semester: "Semester 8", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6501", name: "Graph Database & Knowledge Graph", sks: "3 SKS", semester: "Semester 8", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6502", name: "Green Computing & Sustainable AI", sks: "3 SKS", semester: "Semester 8", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6404", name: "Deep Learning", sks: "3 SKS", semester: "Semester 8", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6606", name: "Pilihan Profesi 3", sks: "2 SKS", semester: "Semester 8", defaultStatus: "Belum Ambil", defaultGrade: "-" },
    { code: "IF-6302", name: "Machine Learning", sks: "3 SKS", semester: "Semester 8", defaultStatus: "Sudah Ambil", defaultGrade: "AB" },
    { code: "FK-6801", name: "Tugas Akhir", sks: "4 SKS", semester: "Semester 8", defaultStatus: "Belum Ambil", defaultGrade: "-" }
];

let allMergedCourses = [];

async function loadCourseData() {
    const container = document.getElementById("adminCourseList");
    if (!container) return;

    try {
        let overrides = {};
        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const get = window.get;

        if (rtdb && dbRef && get) {
            try {
                const snap = await get(dbRef(rtdb, "learning_path_overrides"));
                if (snap.exists()) overrides = snap.val();
            } catch (e) { }
        }

        let customCourses = [];
        try {
            const fetchFn = window.fetchRtdbOrFirestore;
            if (fetchFn) customCourses = await fetchFn("learning_path");
        } catch (e) { }

        const listMap = new Map();

        defaultCourses.forEach(c => {
            const ov = overrides[c.code] || {};
            listMap.set(c.code, {
                id: c.code,
                code: c.code,
                name: c.name,
                sks: c.sks,
                semester: c.semester,
                status: ov.status || c.defaultStatus,
                grade: ov.grade || c.defaultGrade,
                isCustom: false
            });
        });

        if (Array.isArray(customCourses)) {
            customCourses.forEach(c => {
                if (c && c.code) {
                    const ov = overrides[c.code] || {};
                    listMap.set(c.code, {
                        id: c.id || c.code,
                        code: c.code,
                        name: c.name,
                        sks: c.sks || "3 SKS",
                        semester: c.semester || "Semester 1",
                        status: ov.status || c.status || "Sudah Ambil",
                        grade: ov.grade || c.grade || "-",
                        isCustom: true
                    });
                }
            });
        }

        allMergedCourses = Array.from(listMap.values());
        renderCourseTableRows(allMergedCourses);

    } catch (err) {
        container.innerHTML = `<tr><td colspan="8" style="color:red; text-align:center; padding:1.5rem;">Gagal memuat mata kuliah: ${err.message}</td></tr>`;
    }
}

function renderCourseTableRows(courses) {
    const container = document.getElementById("adminCourseList");
    if (!container) return;

    if (courses.length === 0) {
        container.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #888; padding: 2rem;">Tidak ada mata kuliah yang cocok.</td></tr>`;
        return;
    }

    let html = "";
    courses.forEach((c, idx) => {
        const statusOptions = ["Sudah Ambil", "Sedang Ambil", "Belum Ambil"].map(st =>
            `<option value="${st}" ${c.status === st ? 'selected' : ''}>${st}</option>`
        ).join('');

        const gradeOptions = ["-", "A", "AB", "B", "BC", "C", "D", "E"].map(gr =>
            `<option value="${gr}" ${c.grade === gr ? 'selected' : ''}>${gr === '-' ? 'Belum Ada (-)' : 'Nilai ' + gr}</option>`
        ).join('');

        const customBadge = c.isCustom ? '<span style="font-size:0.65rem; background:rgba(212,175,55,0.2); color:var(--accent-color); padding:2px 6px; border-radius:4px; margin-left:4px;">Kustom</span>' : '';

        html += `
            <tr id="row_${c.code}">
                <td style="text-align: center; color: #64748b; font-weight: 500;">${idx + 1}</td>
                <td><span style="font-weight: 700; color: var(--accent-color);">${c.code}</span>${customBadge}</td>
                <td style="font-weight: 500; color: #f8fafc;">${c.name}</td>
                <td><span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:6px;">${c.sks}</span></td>
                <td><span style="font-size:0.75rem; color:#94a3b8;">${c.semester}</span></td>
                <td>
                    <select id="status_${c.code}" class="course-select-sm" onchange="saveCourseRow('${c.code}')">
                        ${statusOptions}
                    </select>
                </td>
                <td>
                    <select id="grade_${c.code}" class="course-select-sm" onchange="saveCourseRow('${c.code}')">
                        ${gradeOptions}
                    </select>
                </td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 4px; justify-content: center;">
                        <button class="btn-action-edit" onclick="saveCourseRow('${c.code}')" title="Simpan Perubahan"><i class="fas fa-save"></i> Simpan</button>
                        ${c.isCustom ? `<button class="btn-action-del" onclick="deleteItem('learning_path', '${c.id}', 'loadCourseData')" title="Hapus"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

function filterCourseTable() {
    const search = (document.getElementById("courseSearchInput")?.value || "").toLowerCase().trim();
    const semFilter = document.getElementById("courseSemesterFilter")?.value || "ALL";
    const statFilter = document.getElementById("courseStatusFilter")?.value || "ALL";

    const filtered = allMergedCourses.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search);
        const matchSem = semFilter === "ALL" || c.semester.includes(semFilter);
        const matchStat = statFilter === "ALL" || c.status === statFilter;
        return matchSearch && matchSem && matchStat;
    });

    renderCourseTableRows(filtered);
}

async function saveCourseRow(code) {
    const statusEl = document.getElementById(`status_${code}`);
    const gradeEl = document.getElementById(`grade_${code}`);
    if (!statusEl || !gradeEl) return;

    const newStatus = statusEl.value;
    const newGrade = gradeEl.value;
    const showToast = window.showToast || alert;

    const found = allMergedCourses.find(c => c.code === code);
    if (found) {
        found.status = newStatus;
        found.grade = newGrade;
    }

    const payload = {
        code: code,
        status: newStatus,
        grade: newGrade,
        updatedAt: Date.now()
    };

    showToast(`✨ Status & Nilai Matkul ${code} tersimpan!`, "success");

    try {
        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const set = window.set;
        const setDoc = window.setDoc;
        const doc = window.doc;

        if (rtdb && dbRef && set) {
            await set(dbRef(rtdb, `learning_path_overrides/${code}`), payload);
        }
        if (db && doc && setDoc) {
            await setDoc(doc(db, "learning_path_overrides", code), payload);
        }
    } catch (err) {
        console.warn("Course override save note:", err.message);
    }
}

async function submitAddCourse(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const code = document.getElementById("courseCode")?.value.trim().toUpperCase();
        const name = document.getElementById("courseName")?.value.trim();
        const sks = document.getElementById("courseSks")?.value.trim() || "3 SKS";
        const semester = document.getElementById("courseSemester")?.value;
        const status = document.getElementById("courseStatus")?.value;
        const grade = document.getElementById("courseGrade")?.value;
        const showToast = window.showToast || alert;

        if (!code || !name) return showToast("Isi kode dan nama mata kuliah!", "error");

        showToast("✨ Mata kuliah berhasil ditambahkan!", "success");
        const form = document.getElementById("formAddCourse");
        if (form) form.reset();

        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const push = window.push;
        const set = window.set;
        const setDoc = window.setDoc;
        const doc = window.doc;

        let courseId = "course_" + Date.now();
        let newRef = null;

        if (rtdb && push && dbRef) {
            newRef = push(dbRef(rtdb, "learning_path"));
            courseId = newRef.key;
        }

        const coursePayload = {
            id: courseId,
            code: code,
            name: name,
            sks: sks,
            semester: semester,
            status: status,
            grade: grade,
            createdAt: Date.now()
        };

        if (newRef && set) {
            await set(newRef, coursePayload).catch(err => console.warn(err));
        }
        if (db && doc && setDoc) {
            await setDoc(doc(db, "learning_path", courseId), coursePayload).catch(err => console.warn(err));
        }

        if (rtdb && dbRef && set) {
            await set(dbRef(rtdb, `learning_path_overrides/${code}`), {
                code: code,
                status: status,
                grade: grade,
                updatedAt: Date.now()
            }).catch(err => console.warn(err));
        }

        loadCourseData();
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.defaultCourses = defaultCourses;
window.allMergedCourses = allMergedCourses;
window.loadCourseData = loadCourseData;
window.renderCourseTableRows = renderCourseTableRows;
window.filterCourseTable = filterCourseTable;
window.saveCourseRow = saveCourseRow;
window.submitAddCourse = submitAddCourse;
