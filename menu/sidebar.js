// ==========================================
// MENU: SIDEBAR (NAVIGATION & CONTROLS)
// ==========================================

// Buka / Tutup Sidebar Mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('show');
    if (overlay) overlay.classList.toggle('show');
}

// Tutup Sidebar Mobile saat item menu diklik
function closeSidebarMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
}

// Sinkronisasi Menu Sidebar Aktif sesuai Section
function syncSidebarActive(sectionId) {
    if (!sectionId) return;
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const onclickVal = link.getAttribute('onclick') || '';
        const hrefVal = link.getAttribute('href') || '';
        if (onclickVal.includes(sectionId) || hrefVal.includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

// Inisialisasi Toggle Theme (Gelap / Terang)
function initThemeToggle() {
    const themeCheckbox = document.getElementById('checkbox');
    const body = document.body;
    if (!themeCheckbox) return;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeCheckbox.checked = true;
    }

    themeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Shortcut Rahasia Panel Admin (Ctrl + Shift + A atau Ctrl + A)
function initSecretAdminShortcut() {
    document.addEventListener('keydown', function (e) {
        const isCtrl = e.ctrlKey || e.metaKey;
        const isKeyA = e.key && e.key.toLowerCase() === 'a';

        if (isCtrl && isKeyA) {
            const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
                return;
            }

            e.preventDefault();
            const adminLi = document.getElementById('adminNavLi');
            if (adminLi) {
                const isHidden = adminLi.style.display === 'none' || adminLi.style.display === '';
                if (isHidden) {
                    adminLi.style.display = 'block';
                    if (typeof showAdminToast === 'function') {
                        showAdminToast('🔓 Panel Admin ditampilkan!');
                    }
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar && !sidebar.classList.contains('active') && !sidebar.classList.contains('show')) {
                        sidebar.classList.add('show');
                    }
                } else {
                    adminLi.style.display = 'none';
                    if (typeof showAdminToast === 'function') {
                        showAdminToast('🔒 Panel Admin disembunyikan!');
                    }
                }
            }
        }
    });
}



// Logout Tamu / Pengunjung
function logoutVisitor() {
    if (confirm('Apakah Anda yakin ingin mengganti nama tamu atau keluar dari sesi ini bro?')) {
        sessionStorage.removeItem('visitorName');
        location.reload();
    }
}

// Inisialisasi Sidebar
function initSidebar() {
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuBtn) {
        menuBtn.onclick = toggleSidebar;
    }
    if (overlay) {
        overlay.onclick = closeSidebarMobile;
    }

    initThemeToggle();
    initSecretAdminShortcut();
}

// Expose ke window
window.toggleSidebar = toggleSidebar;
window.closeSidebarMobile = closeSidebarMobile;
window.syncSidebarActive = syncSidebarActive;
window.logoutVisitor = logoutVisitor;
window.initSidebar = initSidebar;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});
