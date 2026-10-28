// ==========================================
// ADMIN: TENTANG (ABOUT ME MANAGEMENT)
// ==========================================

async function loadAboutData() {
    try {
        let d = null;
        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const get = window.get;
        const getDoc = window.getDoc;
        const doc = window.doc;

        if (rtdb && dbRef && get) {
            const snapshot = await get(dbRef(rtdb, "portfolio_content/about"));
            if (snapshot.exists()) {
                d = snapshot.val();
            }
        }
        if (!d && db && getDoc && doc) {
            const snap = await getDoc(doc(db, "portfolio_content", "about"));
            if (snap.exists()) d = snap.data();
        }
        if (d) {
            const bioEl = document.getElementById("aboutBioText");
            const waEl = document.getElementById("aboutWa");
            const igEl = document.getElementById("aboutIg");
            const inEl = document.getElementById("aboutIn");
            const emailEl = document.getElementById("aboutEmail");

            if (bioEl && d.bio) bioEl.value = d.bio;
            if (waEl && d.wa) waEl.value = d.wa;
            if (igEl && d.ig) igEl.value = d.ig;
            if (inEl && d.linkedin) inEl.value = d.linkedin;
            if (emailEl && d.email) emailEl.value = d.email;
        }
    } catch (e) {
        console.error("Error loading about data:", e);
    }
}

async function saveAboutData(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const set = window.set;
        const showToast = window.showToast || alert;

        const data = {
            bio: document.getElementById("aboutBioText")?.value || "",
            wa: document.getElementById("aboutWa")?.value || "",
            ig: document.getElementById("aboutIg")?.value || "",
            linkedin: document.getElementById("aboutIn")?.value || "",
            email: document.getElementById("aboutEmail")?.value || "",
            updatedAt: Date.now()
        };
        showToast("✨ Data Tentang Saya berhasil disimpan!", "success");

        if (rtdb && dbRef && set) {
            set(dbRef(rtdb, "portfolio_content/about"), data).catch(err => console.warn(err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadAboutData = loadAboutData;
window.saveAboutData = saveAboutData;
