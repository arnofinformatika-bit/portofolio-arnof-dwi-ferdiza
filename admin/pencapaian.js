// ==========================================
// ADMIN: PENCAPAIAN (ACHIEVEMENTS MANAGEMENT)
// ==========================================

async function loadAchieveData() {
    const container = document.getElementById("adminAchieveList");
    if (!container) return;
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("achievements") : [];
        if (items.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada data pencapaian.</p>";
            return;
        }
        container.innerHTML = "";
        items.forEach(a => {
            const card = document.createElement("div");
            card.className = "admin-item-card";
            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${a.title}</h4>
                    <p>${a.desc || ''}</p>
                    <div class="admin-item-meta"><i class="fas fa-trophy"></i> ${a.year}</div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('achievements', '${a.id}', 'loadAchieveData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddAchieve(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const title = document.getElementById("achieveTitle")?.value;
        const year = document.getElementById("achieveYear")?.value;
        const desc = document.getElementById("achieveDesc")?.value;
        const showToast = window.showToast || alert;

        showToast("Pencapaian berhasil disimpan!", "success");
        const form = document.getElementById("formAddAchieve");
        if (form) form.reset();

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const push = window.push;

        if (rtdb && dbRef && push) {
            push(dbRef(rtdb, "achievements"), {
                title: title,
                year: year,
                desc: desc,
                createdAt: Date.now()
            }).then(() => loadAchieveData()).catch(err => console.warn(err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadAchieveData = loadAchieveData;
window.submitAddAchieve = submitAddAchieve;
