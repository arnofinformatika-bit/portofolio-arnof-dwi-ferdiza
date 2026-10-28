// ==========================================
// USER: BERANDA (HOME PROFILE & STATS)
// ==========================================

async function syncHomeContent() {
    try {
        let h = null;
        if (window.rtdb && window.getRtdb && window.dbRef) {
            try {
                const hSnap = await window.getRtdb(window.dbRef(window.rtdb, "portfolio_content/home"));
                if (hSnap.exists()) h = hSnap.val();
            } catch (e) {
                console.warn("RTDB home sync note:", e.message);
            }
        }
        if (!h && window.db && window.getDoc && window.doc) {
            try {
                const fH = await window.getDoc(window.doc(window.db, "portfolio_content", "home"));
                if (fH.exists()) h = fH.data();
            } catch (e) {
                console.warn("Firestore home sync note:", e.message);
            }
        }
        if (h) {
            const statCards = document.querySelectorAll('#home .card');
            statCards.forEach(c => {
                const text = c.innerText || '';
                if (text.includes('PROJEK SELESAI') && h.projects) {
                    const num = c.querySelector('div[style*="font-size: 2rem"], div[style*="font-weight: 700"]');
                    if (num) num.innerText = h.projects;
                }
                if (text.includes('SERTIFIKASI') && h.certs) {
                    const num = c.querySelector('div[style*="font-size: 2rem"], div[style*="font-weight: 700"]');
                    if (num) num.innerText = h.certs;
                }
                if (text.includes('PENGALAMAN') && h.exp) {
                    const num = c.querySelector('div[style*="font-size: 2rem"], div[style*="font-weight: 700"]');
                    if (num) num.innerText = h.exp;
                }
            });
            const homeCard = document.querySelector('#home .card');
            if (homeCard) {
                const pTags = homeCard.querySelectorAll('p.text-lead');
                if (pTags[0] && h.bio1) pTags[0].innerHTML = h.bio1;
                if (pTags[1] && h.bio2) pTags[1].innerHTML = h.bio2;
            }
        }
    } catch (err) {
        console.error("Error in syncHomeContent:", err);
    }
}

// Expose to window
window.syncHomeContent = syncHomeContent;
