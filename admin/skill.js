// ==========================================
// ADMIN: SKILL (SKILLS MANAGEMENT)
// ==========================================

async function loadSkillsData() {
    const container = document.getElementById("adminSkillsList");
    if (!container) return;
    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn("skills") : [];
        if (items.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada skill.</p>";
            return;
        }
        container.innerHTML = "";
        items.forEach(s => {
            const card = document.createElement("div");
            card.className = "admin-item-card";
            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${s.name}</h4>
                    <p style="color: var(--accent-color); font-size: 0.8rem;">Kategori: ${s.category}</p>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('skills', '${s.id}', 'loadSkillsData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function submitAddSkill(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const name = document.getElementById("skillName")?.value;
        const category = document.getElementById("skillCategory")?.value;
        const showToast = window.showToast || alert;

        showToast("Skill berhasil ditambahkan!", "success");
        const form = document.getElementById("formAddSkill");
        if (form) form.reset();

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const push = window.push;

        if (rtdb && dbRef && push) {
            push(dbRef(rtdb, "skills"), {
                name: name,
                category: category,
                createdAt: Date.now()
            }).then(() => loadSkillsData()).catch(err => console.warn(err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadSkillsData = loadSkillsData;
window.submitAddSkill = submitAddSkill;
