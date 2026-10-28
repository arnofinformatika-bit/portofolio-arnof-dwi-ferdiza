// ==========================================
// ADMIN: PENGALAMAN (EXPERIENCE MANAGEMENT)
// ==========================================

async function loadExpData() {
    const container = document.getElementById("adminExpList");
    if (!container) return;
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("experience") : [];
        if (items.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada pengalaman.</p>";
            return;
        }
        container.innerHTML = "";
        items.forEach(ex => {
            const card = document.createElement("div");
            card.className = "admin-item-card";
            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${ex.role} &bull; <span style="font-size: 0.9rem; color: #a0a0a0;">${ex.org}</span></h4>
                    <p>${ex.desc}</p>
                    <div class="admin-item-meta"><i class="fas fa-calendar"></i> ${ex.period}</div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('experience', '${ex.id}', 'loadExpData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddExp(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const role = document.getElementById("expRole")?.value;
        const org = document.getElementById("expOrg")?.value;
        const period = document.getElementById("expPeriod")?.value;
        const desc = document.getElementById("expDesc")?.value;
        const showToast = window.showToast || alert;

        showToast("Pengalaman berhasil ditambahkan!", "success");
        const form = document.getElementById("formAddExp");
        if (form) form.reset();

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const push = window.push;

        if (rtdb && dbRef && push) {
            push(dbRef(rtdb, "experience"), {
                role: role,
                org: org,
                period: period,
                desc: desc,
                createdAt: Date.now()
            }).then(() => loadExpData()).catch(err => console.warn(err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadExpData = loadExpData;
window.submitAddExp = submitAddExp;
