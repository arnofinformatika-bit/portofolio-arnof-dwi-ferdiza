// ==========================================
// ADMIN: KOMENTAR MANAGEMENT (FIREBASE RTDB)
// ==========================================

function escapeAdminCommentHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatAdminCommentDate(ts) {
    if (!ts) return '-';
    try {
        const d = new Date(Number(ts) || ts);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return '-';
    }
}

async function loadCommentsData() {
    const container = document.getElementById('adminCommentsList');
    if (!container) return;

    // Pre-fill admin name from session if empty
    const adminNameEl = document.getElementById('adminCommentName');
    if (adminNameEl && !adminNameEl.value.trim()) {
        adminNameEl.value = sessionStorage.getItem('admin_name') || 'Arnof Dwi Ferdiza';
    }

    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn('comments') : [];
        const sorted = Array.isArray(items)
            ? [...items].sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
            : [];

        if (sorted.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada komentar di Firebase.</p>";
            return;
        }

        container.innerHTML = '';
        sorted.forEach(c => {
            const card = document.createElement('div');
            card.className = 'admin-item-card';
            card.id = `card_comment_${c.id}`;
            const isAdmin = c.role === 'admin';
            const badge = isAdmin
                ? '<span style="background: rgba(212, 175, 55, 0.2); color: #ffd700; border: 1px solid rgba(212, 175, 55, 0.45); padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; margin-left: 6px;"><i class="fas fa-crown"></i> Admin</span>'
                : '<span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; margin-left: 6px;">Pengunjung</span>';

            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${escapeAdminCommentHtml(c.name || 'Pengunjung')} ${badge}</h4>
                    <p>${escapeAdminCommentHtml(c.message || '')}</p>
                    <div class="admin-item-meta"><i class="fas fa-clock"></i> ${formatAdminCommentDate(c.createdAt)}</div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('comments', '${c.id}', 'loadCommentsData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${escapeAdminCommentHtml(err.message)}</p>`;
    }
}

async function submitAdminComment(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const name = (document.getElementById('adminCommentName')?.value || '').trim() || 'Arnof Dwi Ferdiza';
        const message = (document.getElementById('adminCommentMessage')?.value || '').trim();
        const role = document.getElementById('adminCommentRole')?.value || 'admin';
        const showToast = window.showToast || alert;

        if (message.length < 2) {
            showToast('Komentar minimal 2 karakter!', 'error');
            return;
        }

        const rtdb = window.rtdb;
        const dbRef = window.dbRef;
        const push = window.push;

        if (!rtdb || !dbRef || !push) {
            showToast('Firebase belum siap, coba beberapa detik lagi.', 'error');
            return;
        }

        await push(dbRef(rtdb, 'comments'), {
            name: name,
            message: message,
            role: role,
            createdAt: Date.now()
        });

        const msgEl = document.getElementById('adminCommentMessage');
        if (msgEl) msgEl.value = '';
        showToast('Komentar berhasil dikirim ke Firebase!', 'success');
        loadCommentsData();
    } catch (err) {
        if (window.showToast) window.showToast(err.message, 'error');
        else console.error(err);
    }
}

window.loadCommentsData = loadCommentsData;
window.submitAdminComment = submitAdminComment;
