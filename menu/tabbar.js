// ==========================================
// MENU: TABBAR (BOTTOM MOBILE TAB BAR)
// ==========================================

// Fungsi Update State Aktif Tab Bar
function updateActiveTab(element) {
    if (!element) return;
    const tabs = document.querySelectorAll('.tab-bar .tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
}

// Sinkronisasi Tab Bar berdasarkan Section ID / Route Slug
function syncActiveTab(sectionId) {
    if (!sectionId) return;
    const slugMap = {
        'home': 'beranda',
        'projects': 'projek',
        'about': 'tentang'
    };
    const slug = slugMap[sectionId] || sectionId;

    const tabs = document.querySelectorAll('.tab-bar .tab-item');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const onclickVal = tab.getAttribute('onclick') || '';
        const hrefVal = tab.getAttribute('href') || '';
        if (onclickVal.includes(sectionId) || hrefVal.includes(slug)) {
            tab.classList.add('active');
        }
    });
}

// Inisialisasi Event Listener Tab Bar
function initTabBar() {
    const tabs = document.querySelectorAll('.tab-bar .tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Jika bukan tombol Lainnya (sidebar toggle), update active
            if (!this.querySelector('.fa-bars')) {
                updateActiveTab(this);
            }
        });
    });
}

// Expose ke window
window.updateActiveTab = updateActiveTab;
window.syncActiveTab = syncActiveTab;
window.initTabBar = initTabBar;

document.addEventListener('DOMContentLoaded', () => {
    initTabBar();
});
