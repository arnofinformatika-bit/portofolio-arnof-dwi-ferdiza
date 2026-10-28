// ==========================================
// ADMIN: LOGBOOK (ACTIVITY LOGS MANAGEMENT)
// ==========================================

async function loadLogbookData() {
    const container = document.getElementById("adminLogbookList");
    if (!container) return;
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("logbook") : [];
        if (items.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada logbook.</p>";
            return;
        }
        container.innerHTML = "";
        items.forEach(l => {
            const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('id-ID') : '';
            const card = document.createElement("div");
            card.className = "admin-item-card";
            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${l.activity}</h4>
                    <p><strong>Hasil:</strong> ${l.result || '-'}</p>
                    <div class="admin-item-meta"><i class="fas fa-clock"></i> ${dateStr}</div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('logbook', '${l.id}', 'loadLogbookData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddLogbook(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const activity = document.getElementById("logbookActivity")?.value;
        const result = document.getElementById("logbookResult")?.value;
        const obstacle = document.getElementById("logbookObstacle")?.value;
        const showToast = window.showToast || alert;

        showToast("Logbook berhasil disimpan!", "success");
        const form = document.getElementById("formAddLogbook");
        if (form) form.reset();

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const push = window.push;

        if (rtdb && dbRef && push) {
            push(dbRef(rtdb, "logbook"), {
                activity: activity,
                result: result,
                obstacle: obstacle,
                createdAt: Date.now()
            }).then(() => loadLogbookData()).catch(err => console.warn(err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadLogbookData = loadLogbookData;
window.submitAddLogbook = submitAddLogbook;
