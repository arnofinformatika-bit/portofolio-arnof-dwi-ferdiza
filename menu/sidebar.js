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

// Update icon & text pada tombol Pengaturan di Menu Lainnya
function updateSettingsButtonUI(theme) {
    const btn = document.getElementById('ubl-btn-settings');
    if (!btn) return;
    const isLight = (theme === 'light');
    btn.innerHTML = `<i class="fas fa-${isLight ? 'sun' : 'moon'}"></i> <span>${isLight ? 'Mode Terang' : 'Mode Gelap'}</span>`;
}

// Toast notifikasi saat ganti tema
function showThemeToast(theme) {
    let toast = document.getElementById('theme-toast-alert');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'theme-toast-alert';
        toast.style.cssText = 'position:fixed;bottom:85px;left:50%;transform:translateX(-50%);background:rgba(18,18,18,0.92);color:#ffd700;padding:8px 18px;border-radius:20px;font-size:0.85rem;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,0.3);border:1px solid rgba(212,175,55,0.4);z-index:99999;transition:opacity 0.3s ease;pointer-events:none;display:flex;align-items:center;gap:8px;';
        document.body.appendChild(toast);
    }
    const isLight = (theme === 'light');
    toast.innerHTML = `<i class="fas fa-${isLight ? 'sun' : 'moon'}"></i> ${isLight ? 'Mode Terang Diaktifkan' : 'Mode Gelap Diaktifkan'}`;
    toast.style.opacity = '1';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
        toast.style.opacity = '0';
    }, 1800);
}

// Toggle Cepat Tema (Gelap / Terang)
function toggleThemeQuick() {
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

    updateSettingsButtonUI(newTheme);
    showThemeToast(newTheme);
}

// Inisialisasi Toggle Theme (Gelap / Terang)
function initThemeToggle() {
    const themeCheckbox = document.getElementById('checkbox');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        document.documentElement.classList.add('light-mode');
        if (themeCheckbox) themeCheckbox.checked = true;
    } else {
        body.classList.remove('light-mode');
        document.documentElement.classList.remove('light-mode');
        if (themeCheckbox) themeCheckbox.checked = false;
    }

    updateSettingsButtonUI(currentTheme);

    if (themeCheckbox) {
        themeCheckbox.onchange = function(e) {
            const nextTheme = e.target.checked ? 'light' : 'dark';
            if (nextTheme === 'light') {
                body.classList.add('light-mode');
                document.documentElement.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-mode');
                document.documentElement.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
            updateSettingsButtonUI(nextTheme);
            showThemeToast(nextTheme);
        };
    }
}

// Buka Custom Modal Logout (Tanpa Domain Vercel)
function logoutVisitor() {
    const overlay = document.getElementById('custom-logout-overlay');
    const modal = document.getElementById('custom-logout-modal');
    if (overlay && modal) {
        overlay.classList.add('show');
        modal.classList.add('show');
    } else {
        sessionStorage.removeItem('visitorName');
        location.reload();
    }
}

// Tutup Custom Modal Logout
function closeLogoutModal() {
    const overlay = document.getElementById('custom-logout-overlay');
    const modal = document.getElementById('custom-logout-modal');
    if (overlay && modal) {
        overlay.classList.remove('show');
        modal.classList.remove('show');
    }
}

// Konfirmasi Logout
function confirmLogoutVisitor() {
    sessionStorage.removeItem('visitorName');
    location.reload();
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
}

// Expose ke window
window.toggleSidebar = toggleSidebar;
window.closeSidebarMobile = closeSidebarMobile;
window.syncSidebarActive = syncSidebarActive;
window.logoutVisitor = logoutVisitor;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogoutVisitor = confirmLogoutVisitor;
window.initSidebar = initSidebar;
window.initThemeToggle = initThemeToggle;
window.toggleThemeQuick = toggleThemeQuick;
window.updateSettingsButtonUI = updateSettingsButtonUI;
window.showThemeToast = showThemeToast;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});
