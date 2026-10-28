// ==========================================
// USER: PENDIDIKAN (EDUCATION TIMELINE)
// ==========================================

async function syncEducationContent(getListFn) {
    try {
        let eduItems = [];
        if (typeof getListFn === 'function') {
            eduItems = await getListFn("education");
        } else if (window.getRTDBList) {
            eduItems = await window.getRTDBList("education");
        }
        if (eduItems && eduItems.length > 0) {
            const eduTimeline = document.querySelector('#education .timeline');
            if (eduTimeline) {
                eduItems.forEach(item => {
                    const existing = Array.from(eduTimeline.querySelectorAll('h3')).some(h => h.innerText.trim() === (item.school || '').trim());
                    if (!existing) {
                        const el = document.createElement('div');
                        el.className = 'timeline-item';
                        el.innerHTML = `
                            <div class="timeline-date">${item.period || ''}</div>
                            <h3>${item.school}</h3>
                            <p class="text-secondary">${item.major || ''}</p>
                        `;
                        eduTimeline.prepend(el);
                    }
                });
            }
        }
    } catch (err) {
        console.warn("syncEducationContent error:", err);
    }
}

// Expose to window
window.syncEducationContent = syncEducationContent;
