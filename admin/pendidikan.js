// ==========================================
// ADMIN: PENDIDIKAN (EDUCATION MANAGEMENT)
// ==========================================

async function loadEduData() {
    const container = document.getElementById("adminEduList");
    if (!container) return;
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("education") : [];
        if (items.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada data pendidikan.</p>";
            return;
        }
        container.innerHTML = "";
        items.forEach(e => {
            const card = document.createElement("div");
            card.className = "admin-item-card";
            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${e.school}</h4>
                    <p>${e.major}</p>
                    <div class="admin-item-meta"><i class="fas fa-calendar"></i> ${e.period}</div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('education', '${e.id}', 'loadEduData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddEdu(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const school = document.getElementById("eduSchool")?.value;
        const period = document.getElementById("eduPeriod")?.value;
        const major = document.getElementById("eduMajor")?.value;
        const showToast = window.showToast || alert;

        showToast("Pendidikan berhasil ditambahkan!", "success");
        const form = document.getElementById("formAddEdu");
        if (form) form.reset();

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const push = window.push;

        if (rtdb && dbRef && push) {
            push(dbRef(rtdb, "education"), {
                school: school,
                period: period,
                major: major,
                createdAt: Date.now()
            }).then(() => loadEduData()).catch(err => console.warn(err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadEduData = loadEduData;
window.submitAddEdu = submitAddEdu;
