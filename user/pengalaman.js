// ==========================================
// USER: PENGALAMAN (EXPERIENCE TIMELINE)
// ==========================================

async function syncExperienceContent(getListFn) {
    try {
        let expItems = [];
        if (typeof getListFn === 'function') {
            expItems = await getListFn("experience");
        } else if (window.getRTDBList) {
            expItems = await window.getRTDBList("experience");
        }
        if (expItems && expItems.length > 0) {
            const expTimeline = document.querySelector('#experience .timeline');
            if (expTimeline) {
                expItems.forEach(item => {
                    const existing = Array.from(expTimeline.querySelectorAll('h3')).some(h => h.innerText.trim().includes((item.role || '').trim()));
                    if (!existing) {
                        const el = document.createElement('div');
                        el.className = 'timeline-item';
                        el.innerHTML = `
                            <div class="timeline-date">${item.period || ''}</div>
                            <h3>${item.role} - <span style="font-size: 0.95rem; color: var(--accent-color);">${item.org || ''}</span></h3>
                            <p class="text-secondary" style="margin-top: 0.5rem;">${item.desc || ''}</p>
                        `;
                        expTimeline.prepend(el);
                    }
                });
            }
        }
    } catch (err) {
        console.warn("syncExperienceContent error:", err);
    }
}

// Expose to window
window.syncExperienceContent = syncExperienceContent;
