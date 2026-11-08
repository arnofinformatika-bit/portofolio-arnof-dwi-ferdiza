// ==========================================
// MENU: TABBAR (BOTTOM MOBILE TAB BAR) & MENU LAINNYA (UBL STYLE)
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
    const mainSections = ['home', 'projects', 'about'];
    const slug = slugMap[sectionId] || sectionId;

    const tabs = document.querySelectorAll('.tab-bar .tab-item');
    const moreTab = document.getElementById('tab-item-more');
    let anyActive = false;

    tabs.forEach(tab => {
        if (tab === moreTab) return;
        tab.classList.remove('active');
        const onclickVal = tab.getAttribute('onclick') || '';
        const hrefVal = tab.getAttribute('href') || '';
        if (onclickVal.includes(sectionId) || hrefVal.includes(slug)) {
            tab.classList.add('active');
            anyActive = true;
        }
    });

    if (moreTab) {
        if (!anyActive && !mainSections.includes(sectionId)) {
            moreTab.classList.add('active');
        } else {
            moreTab.classList.remove('active');
        }
    }

    if (typeof updateUblActiveTile === 'function') {
        updateUblActiveTile(sectionId);
    }
}

// Sinkronisasi Tile Aktif di Menu Lainnya
function updateUblActiveTile(sectionId) {
    if (!sectionId) return;
    const slugMap = {
        'home': 'beranda',
        'projects': 'projek',
        'about': 'tentang'
    };
    const slug = slugMap[sectionId] || sectionId;
    const items = document.querySelectorAll('.ubl-menu-grid .ubl-menu-item');
    items.forEach(item => {
        const tile = item.querySelector('.ubl-tile');
        if (!tile) return;
        const onclickVal = item.getAttribute('onclick') || '';
        const hrefVal = item.getAttribute('href') || '';
        if (onclickVal.includes(sectionId) || hrefVal.includes(slug)) {
            tile.classList.add('ubl-tile-active');
        } else {
            tile.classList.remove('ubl-tile-active');
        }
    });
}

// Buka / Tutup Modal Sheet Menu Lainnya
function toggleMoreMenuModal(event) {
    if (event) {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        if (typeof event.stopPropagation === 'function') event.stopPropagation();
    }
    const sheet = document.getElementById('more-menu-sheet');
    if (sheet && sheet.classList.contains('show')) {
        closeMoreMenuModal();
    } else {
        openMoreMenuModal();
    }
}

// Buka Modal Sheet Menu Lainnya
function openMoreMenuModal() {
    const overlay = document.getElementById('more-menu-overlay');
    const sheet = document.getElementById('more-menu-sheet');
    const searchInput = document.getElementById('moreMenuSearchInput');

    if (overlay) {
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.add('show'), 10);
    }
    if (sheet) {
        sheet.style.display = 'flex';
        setTimeout(() => {
            sheet.classList.add('show');
            sheet.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
    }

    // Update greeting name in profile card if visitorName exists
    const savedName = sessionStorage.getItem('visitorName');
    const subEl = document.getElementById('ubl-profile-sub');
    if (subEl) {
        if (savedName) {
            subEl.innerHTML = `Informatika UBL &bull; Tamu: <strong>${savedName}</strong>`;
        } else {
            subEl.innerHTML = `Informatika UBL &bull; 2024`;
        }
    }

    // Kunci scroll halaman belakang
    document.body.style.overflow = 'hidden';

    // Reset pencarian saat dibuka
    if (searchInput) {
        searchInput.value = '';
        filterMoreMenuItems('');
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    }
}

// Tutup Modal Sheet Menu Lainnya
function closeMoreMenuModal() {
    const overlay = document.getElementById('more-menu-overlay');
    const sheet = document.getElementById('more-menu-sheet');

    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => { overlay.style.display = ''; }, 300);
    }
    if (sheet) {
        sheet.classList.remove('show');
        sheet.style.transform = 'translateX(-50%) translateY(105%)';
        setTimeout(() => { sheet.style.display = ''; }, 350);
    }

    // Kembalikan scroll halaman
    document.body.style.overflow = '';
}

// Filter Menu secara Realtime (UBL Grid Item)
function filterMoreMenuItems(query) {
    const q = (query || '').toLowerCase().trim();
    const items = document.querySelectorAll('.ubl-menu-grid .ubl-menu-item');
    const clearBtn = document.getElementById('moreMenuSearchClear');
    const emptyState = document.getElementById('moreMenuEmptyState');
    let visibleCount = 0;

    if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
    }

    items.forEach(card => {
        const title = (card.querySelector('.ubl-menu-name')?.textContent || '').toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

        if (!q || title.includes(q) || keywords.includes(q)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (emptyState) {
        emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
    }
}

// Bersihkan Input Pencarian Menu
function clearMoreMenuSearch() {
    const input = document.getElementById('moreMenuSearchInput');
    if (input) {
        input.value = '';
        input.focus();
        filterMoreMenuItems('');
    }
}

// Toggle Cepat Tema dari tombol Pengaturan
function toggleThemeQuick() {
    if (window.toggleThemeQuick && window.toggleThemeQuick !== toggleThemeQuick) {
        window.toggleThemeQuick();
        return;
    }
    const body = document.body;
    const themeCheckbox = document.getElementById('checkbox');
    const isCurrentlyLight = body.classList.contains('light-mode');
    const newTheme = isCurrentlyLight ? 'dark' : 'light';

    if (newTheme === 'light') {
        body.classList.add('light-mode');
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        if (themeCheckbox) themeCheckbox.checked = true;
    } else {
        body.classList.remove('light-mode');
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        if (themeCheckbox) themeCheckbox.checked = false;
    }

    if (typeof updateSettingsButtonUI === 'function') updateSettingsButtonUI(newTheme);
    if (typeof showThemeToast === 'function') showThemeToast(newTheme);
}

// Inisialisasi Event Listener Tab Bar & Menu Lainnya
function initTabBar() {
    const tabs = document.querySelectorAll('.tab-bar .tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            if (this.id === 'tab-item-more') {
                toggleMoreMenuModal(e);
            } else {
                updateActiveTab(this);
            }
        });
    });

    // Tutup modal jika tombol ESC ditekan
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeMoreMenuModal();
        }
    });
}

// Expose ke window
window.updateActiveTab = updateActiveTab;
window.syncActiveTab = syncActiveTab;
window.updateUblActiveTile = updateUblActiveTile;
window.initTabBar = initTabBar;
window.toggleMoreMenuModal = toggleMoreMenuModal;
window.openMoreMenuModal = openMoreMenuModal;
window.closeMoreMenuModal = closeMoreMenuModal;
window.filterMoreMenuItems = filterMoreMenuItems;
window.clearMoreMenuSearch = clearMoreMenuSearch;
window.toggleThemeQuick = toggleThemeQuick;
window.triggerAppUpdate = function(e) {
    if (typeof window.openUpdateAppModal === 'function') {
        window.openUpdateAppModal();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTabBar();
});
