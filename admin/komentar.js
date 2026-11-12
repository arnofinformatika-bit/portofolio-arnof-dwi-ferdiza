// ==========================================
// ADMIN: KOMENTAR MANAGEMENT (FIREBASE RTDB)
// ==========================================

window.adminCommentsCacheMap = {};

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

    // Pre-fill admin name from session if empty & not currently editing
    const editId = (document.getElementById('adminCommentEditId')?.value || '').trim();
    const adminNameEl = document.getElementById('adminCommentName');
    if (adminNameEl && !adminNameEl.value.trim() && !editId) {
        adminNameEl.value = sessionStorage.getItem('admin_name') || 'Arnof Dwi Ferdiza';
    }

    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn('comments') : [];
        const sorted = Array.isArray(items)
            ? [...items].sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
            : [];

        window.adminCommentsCacheMap = {};

        if (sorted.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada komentar di Firebase.</p>";
            return;
        }

        container.innerHTML = '';
        sorted.forEach(c => {
            window.adminCommentsCacheMap[c.id] = c;

            const card = document.createElement('div');
            card.className = 'admin-item-card';
            card.id = `card_comment_${c.id}`;
            const isAdmin = c.role === 'admin';
            const badge = isAdmin
                ? '<span style="background: rgba(212, 175, 55, 0.2); color: #ffd700; border: 1px solid rgba(212, 175, 55, 0.45); padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; margin-left: 6px;"><i class="fas fa-crown"></i> Admin</span>'
                : '<span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; margin-left: 6px;">Pengunjung</span>';
            const editedTag = c.updatedAt
                ? ' <span style="font-size: 0.72rem; color: #94a3b8; font-style: italic;">(diedit)</span>'
                : '';

            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>${escapeAdminCommentHtml(c.name || 'Pengunjung')} ${badge}</h4>
                    <p>${escapeAdminCommentHtml(c.message || '')}</p>
                    <div class="admin-item-meta"><i class="fas fa-clock"></i> ${formatAdminCommentDate(c.createdAt)}${editedTag}</div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-edit" onclick="startEditComment('${c.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action-del" onclick="deleteItem('comments', '${c.id}', 'loadCommentsData')"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${escapeAdminCommentHtml(err.message)}</p>`;
    }
}

function startEditComment(id) {
    const comment = window.adminCommentsCacheMap?.[id];
    if (!comment) return;

    const editIdEl = document.getElementById('adminCommentEditId');
    const nameEl = document.getElementById('adminCommentName');
    const roleEl = document.getElementById('adminCommentRole');
    const msgEl = document.getElementById('adminCommentMessage');
    const titleEl = document.getElementById('adminCommentFormTitle');
    const submitBtn = document.getElementById('btnSubmitAdminComment');
    const cancelBtn = document.getElementById('btnCancelEditComment');

    if (editIdEl) editIdEl.value = id;
    if (nameEl) nameEl.value = comment.name || '';
    if (roleEl) roleEl.value = comment.role === 'visitor' ? 'visitor' : 'admin';
    if (msgEl) msgEl.value = comment.message || '';

    if (titleEl) {
        titleEl.innerHTML = '<i class="fas fa-edit"></i> Edit Komentar';
    }
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'inline-flex';
    }

    const formCard = document.getElementById('formAddComment');
    if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (msgEl) {
        setTimeout(() => msgEl.focus(), 200);
    }
}

function cancelEditComment() {
    const editIdEl = document.getElementById('adminCommentEditId');
    const nameEl = document.getElementById('adminCommentName');
    const roleEl = document.getElementById('adminCommentRole');
    const msgEl = document.getElementById('adminCommentMessage');
    const titleEl = document.getElementById('adminCommentFormTitle');
    const submitBtn = document.getElementById('btnSubmitAdminComment');
    const cancelBtn = document.getElementById('btnCancelEditComment');

    if (editIdEl) editIdEl.value = '';
    if (nameEl) nameEl.value = sessionStorage.getItem('admin_name') || 'Arnof Dwi Ferdiza';
    if (roleEl) roleEl.value = 'admin';
    if (msgEl) msgEl.value = '';

    if (titleEl) {
        titleEl.innerHTML = '<i class="fas fa-comment-medical"></i> Tulis Komentar Baru';
    }
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Komentar ke Firebase';
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

async function submitAdminComment(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        const editId = (document.getElementById('adminCommentEditId')?.value || '').trim();
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
        const updateRtdb = window.updateRtdb;
        const set = window.set;

        if (!rtdb || !dbRef) {
            showToast('Firebase belum siap, coba beberapa detik lagi.', 'error');
            return;
        }

        if (editId) {
            const existing = window.adminCommentsCacheMap?.[editId] || {};
            const updatePayload = {
                name: name,
                message: message,
                role: role,
                createdAt: existing.createdAt || Date.now(),
                updatedAt: Date.now()
            };

            if (typeof updateRtdb === 'function') {
                await updateRtdb(dbRef(rtdb, `comments/${editId}`), updatePayload);
            } else if (typeof set === 'function') {
                await set(dbRef(rtdb, `comments/${editId}`), updatePayload);
            }

            cancelEditComment();
            showToast('Komentar berhasil diperbarui di Firebase!', 'success');
            loadCommentsData();
        } else {
            if (!push) {
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
        }
    } catch (err) {
        if (window.showToast) window.showToast(err.message, 'error');
        else console.error(err);
    }
}

window.loadCommentsData = loadCommentsData;
window.startEditComment = startEditComment;
window.cancelEditComment = cancelEditComment;
window.submitAdminComment = submitAdminComment;
