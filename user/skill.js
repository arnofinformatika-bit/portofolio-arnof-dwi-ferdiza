// ==========================================
// USER: SKILL (SKILLS LIST)
// ==========================================

async function syncSkillsContent(getListFn) {
    try {
        let skillItems = [];
        if (typeof getListFn === 'function') {
            skillItems = await getListFn("skills");
        } else if (window.getRTDBList) {
            skillItems = await window.getRTDBList("skills");
        }
        if (skillItems && skillItems.length > 0) {
            skillItems.forEach(item => {
                const skillTagsContainers = document.querySelectorAll('#skills .skill-tags');
                if (skillTagsContainers.length > 0) {
                    const targetBox = skillTagsContainers[0];
                    const existing = Array.from(document.querySelectorAll('#skills .skill-tag')).some(t => t.innerText.trim().toLowerCase().includes((item.name || '').trim().toLowerCase()));
                    if (!existing) {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.innerHTML = `<i class="fas fa-check-circle"></i> ${item.name}`;
                        targetBox.appendChild(tag);
                    }
                }
            });
        }
    } catch (err) {
        console.warn("syncSkillsContent error:", err);
    }
}

// Expose to window
window.syncSkillsContent = syncSkillsContent;
