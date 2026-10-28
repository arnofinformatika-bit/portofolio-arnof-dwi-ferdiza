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

// Goyang HP (Shake Gesture) untuk Membuka Panel Admin
function initShakeToAdmin() {
    let lastX = null, lastY = null, lastZ = null;
    let lastTime = new Date().getTime();
    const SHAKE_THRESHOLD = 15;

    function handleMotion(e) {
        const current = e.accelerationIncludingGravity;
        if (!current || current.x === null) return;

        const currentTime = new Date().getTime();
        const diffTime = currentTime - lastTime;

        if (diffTime > 100) {
            if (lastX !== null && lastY !== null && lastZ !== null) {
                const deltaX = Math.abs(current.x - lastX);
                const deltaY = Math.abs(current.y - lastY);
                const deltaZ = Math.abs(current.z - lastZ);

                if ((deltaX + deltaY + deltaZ) > SHAKE_THRESHOLD) {
                    const adminLi = document.getElementById('adminNavLi');
                    if (adminLi) adminLi.style.display = 'block';
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar) sidebar.classList.add('show');
                    if (typeof showAdminToast === 'function') {
                        showAdminToast('📱 Goyangan HP Terdeteksi! Membuka Panel Admin...');
                    }
                    setTimeout(() => {
                        window.open('admin.html', '_blank');
                    }, 700);
                }
            }
            lastX = current.x;
            lastY = current.y;
            lastZ = current.z;
            lastTime = currentTime;
        }
    }

    if (window.DeviceMotionEvent) {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            document.addEventListener('touchstart', function reqPermission() {
                DeviceMotionEvent.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        window.addEventListener('devicemotion', handleMotion, false);
                    }
                }).catch(console.error);
            }, { once: true });
        } else {
            window.addEventListener('devicemotion', handleMotion, false);
        }
    }
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
        menuBtn.addEventListener('click', toggleSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', closeSidebarMobile);
    }

    initThemeToggle();
    initSecretAdminShortcut();
    initShakeToAdmin();
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
