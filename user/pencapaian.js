// ==========================================
// USER: PENCAPAIAN (ACHIEVEMENTS LIST)
// ==========================================

async function syncAchievementsContent(getListFn) {
    try {
        let achItems = [];
        if (typeof getListFn === 'function') {
            achItems = await getListFn("achievements");
        } else if (window.getRTDBList) {
            achItems = await window.getRTDBList("achievements");
        }
        if (achItems && achItems.length > 0) {
            const achContainer = document.querySelector('#achievements .card .grid-2') || document.querySelector('#achievements .card');
            if (achContainer) {
                achItems.forEach(item => {
                    const existing = Array.from(achContainer.querySelectorAll('h3, h4')).some(h => h.innerText.trim().toLowerCase() === (item.title || '').trim().toLowerCase());
                    if (!existing) {
                        const el = document.createElement('div');
                        el.style.borderLeft = '3px solid var(--accent-color)';
                        el.style.paddingLeft = '1rem';
                        el.style.marginBottom = '1rem';
                        el.innerHTML = `
                            <h3 style="margin-bottom: 0.5rem; color: #fff;">${item.title}</h3>
                            <p class="text-secondary" style="font-size: 0.85rem;">${item.year || ''} &bull; ${item.desc || ''}</p>
                        `;
                        achContainer.appendChild(el);
                    }
                });
            }
        }
    } catch (err) {
        console.warn("syncAchievementsContent error:", err);
    }
}

// Expose to window
window.syncAchievementsContent = syncAchievementsContent;
