// ==========================================
// USER: TENTANG (ABOUT ME PROFILE)
// ==========================================

async function syncAboutContent() {
    try {
        let a = null;
        if (window.rtdb && window.getRtdb && window.dbRef) {
            try {
                const aSnap = await window.getRtdb(window.dbRef(window.rtdb, "portfolio_content/about"));
                if (aSnap.exists()) a = aSnap.val();
            } catch (e) {
                console.warn("RTDB about sync note:", e.message);
            }
        }
        if (!a && window.db && window.getDoc && window.doc) {
            try {
                const fA = await window.getDoc(window.doc(window.db, "portfolio_content", "about"));
                if (fA.exists()) a = fA.data();
            } catch (e) {
                console.warn("Firestore about sync note:", e.message);
            }
        }
        if (a) {
            const aboutCard = document.querySelector('#about .card');
            if (aboutCard && a.bio) {
                const bioP = aboutCard.querySelector('p.text-lead');
                if (bioP) bioP.innerHTML = a.bio;
            }
        }
    } catch (err) {
        console.error("Error in syncAboutContent:", err);
    }
}

// Expose to window
window.syncAboutContent = syncAboutContent;
