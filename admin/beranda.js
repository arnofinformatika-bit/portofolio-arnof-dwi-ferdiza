// ==========================================
// ADMIN: BERANDA (HOME PROFILE & STATS MANAGEMENT)
// ==========================================

async function loadHomeData() {
    try {
        let d = null;
        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const get = window.get;
        const getDoc = window.getDoc;
        const doc = window.doc;

        if (rtdb && dbRef && get) {
            const snapshot = await get(dbRef(rtdb, "portfolio_content/home"));
            if (snapshot.exists()) {
                d = snapshot.val();
            }
        }
        if (!d && db && getDoc && doc) {
            const snap = await getDoc(doc(db, "portfolio_content", "home"));
            if (snap.exists()) d = snap.data();
        }
        if (d) {
            const pInput = document.getElementById("homeStatProjects");
            const cInput = document.getElementById("homeStatCerts");
            const eInput = document.getElementById("homeStatExp");
            const b1Input = document.getElementById("homeBioP1");
            const b2Input = document.getElementById("homeBioP2");

            if (pInput && d.projects) pInput.value = d.projects;
            if (cInput && d.certs) cInput.value = d.certs;
            if (eInput && d.exp) eInput.value = d.exp;
            if (b1Input && d.bio1) b1Input.value = d.bio1;
            if (b2Input && d.bio2) b2Input.value = d.bio2;
        }
    } catch (e) {
        console.error("Error loading home data:", e);
    }
}

async function saveHomeProfile(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const rtdb = window.rtdb;
        const db = window.db;
        const dbRef = window.dbRef;
        const set = window.set;
        const setDoc = window.setDoc;
        const doc = window.doc;
        const showToast = window.showToast || alert;

        const data = {
            projects: document.getElementById("homeStatProjects")?.value || "6+",
            certs: document.getElementById("homeStatCerts")?.value || "10+",
            exp: document.getElementById("homeStatExp")?.value || "5+",
            bio1: document.getElementById("homeBioP1")?.value || "",
            bio2: document.getElementById("homeBioP2")?.value || "",
            updatedAt: Date.now()
        };

        // Save to local cache
        try { localStorage.setItem("arnof_home_cache", JSON.stringify(data)); } catch (e) { }

        showToast("✨ Data Beranda berhasil disimpan!", "success");

        // Save to RTDB and Firestore
        if (rtdb && dbRef && set) {
            set(dbRef(rtdb, "portfolio_content/home"), data).catch(err => console.warn("Home RTDB error:", err));
        }
        if (db && doc && setDoc) {
            setDoc(doc(db, "portfolio_content", "home"), data).catch(err => console.warn("Home Firestore error:", err));
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, "error");
        else console.error(err);
    }
}

// Expose to window
window.loadHomeData = loadHomeData;
window.saveHomeProfile = saveHomeProfile;
