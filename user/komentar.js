// ==========================================
// USER: KOMENTAR PENGUNJUNG & ADMIN (REALTIME FIREBASE)
// ==========================================

function escapeCommentHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatCommentTime(ts) {
    if (!ts) return 'Baru saja';
    try {
        const d = new Date(Number(ts) || ts);
        if (isNaN(d.getTime())) return 'Baru saja';
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Baru saja';
    }
}

function prefillVisitorCommentName() {
    const nameInput = document.getElementById('visitorCommentName');
    if (nameInput && !nameInput.value.trim()) {
        const savedName = sessionStorage.getItem('visitorName');
        if (savedName) {
            nameInput.value = savedName;
        }
    }
}

function renderUserComments(items) {
    const listEl = document.getElementById('userCommentsList');
    const countEl = document.getElementById('userCommentsCount');
    if (!listEl) return;

    const sorted = Array.isArray(items)
        ? [...items].sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
        : [];

    if (countEl) {
        countEl.textContent = `${sorted.length} Komentar`;
    }

    if (sorted.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; padding: 2.2rem 1rem; color: var(--text-secondary);">
                <i class="fas fa-comments" style="font-size: 2.2rem; color: var(--accent-color); opacity: 0.55; margin-bottom: 0.7rem; display: block;"></i>
                <p style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">Belum ada komentar</p>
                <span style="font-size: 0.85rem;">Jadilah pengunjung pertama yang meninggalkan pesan atau kesan!</span>
            </div>
        `;
        return;
    }

    listEl.innerHTML = sorted.map(item => {
        const name = escapeCommentHtml(item.name || 'Pengunjung');
        const message = escapeCommentHtml(item.message || '').replace(/\n/g, '<br>');
        const isAdmin = item.role === 'admin';
        const initial = (name.trim().charAt(0) || 'P').toUpperCase();
        const timeStr = formatCommentTime(item.createdAt);
        const editedBadge = item.updatedAt ? ' <span style="opacity:0.75;font-style:italic;">(diedit)</span>' : '';

        return `
            <div class="comment-card-item ${isAdmin ? 'comment-is-admin' : ''}">
                <div class="comment-avatar ${isAdmin ? 'admin-avatar' : ''}">
                    ${isAdmin ? '<i class="fas fa-crown"></i>' : initial}
                </div>
                <div class="comment-body">
                    <div class="comment-header-row">
                        <div class="comment-author-wrap">
                            <span class="comment-author-name">${name}</span>
                            ${isAdmin ? '<span class="comment-admin-badge"><i class="fas fa-check-circle"></i> Admin</span>' : ''}
                        </div>
                        <span class="comment-time">${timeStr}${editedBadge}</span>
                    </div>
                    <p class="comment-message-text">${message}</p>
                </div>
            </div>
        `;
    }).join('');
}

async function syncCommentsContent(getListFn) {
    prefillVisitorCommentName();
    try {
        let items = [];
        if (typeof getListFn === 'function') {
            items = await getListFn('comments');
        } else if (window.getRTDBList) {
            items = await window.getRTDBList('comments');
        }
        renderUserComments(items);
    } catch (err) {
        console.warn('syncCommentsContent error:', err);
    }
}

let commentsRealtimeStarted = false;
function initCommentsRealtime() {
    prefillVisitorCommentName();
    if (commentsRealtimeStarted) return;
    if (!window.rtdb || !window.dbRef || !window.onValue) return;

    commentsRealtimeStarted = true;
    try {
        const commentsRef = window.dbRef(window.rtdb, 'comments');
        window.onValue(commentsRef, (snapshot) => {
            const list = [];
            if (snapshot.exists()) {
                const val = snapshot.val();
                Object.keys(val).forEach(key => {
                    list.push({ id: key, ...val[key] });
                });
            }
            try {
                localStorage.setItem('arnof_comments_cache', JSON.stringify(list));
            } catch (e) { }
            renderUserComments(list);
        }, (err) => {
            console.warn('Realtime comments listener error:', err);
        });
    } catch (err) {
        console.warn('initCommentsRealtime error:', err);
    }
}

async function submitVisitorComment(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const nameInput = document.getElementById('visitorCommentName');
    const msgInput = document.getElementById('visitorCommentMessage');
    const submitBtn = document.getElementById('btnSubmitVisitorComment');
    const feedbackEl = document.getElementById('userCommentFeedback');

    const name = (nameInput ? nameInput.value : '').trim();
    const message = (msgInput ? msgInput.value : '').trim();

    if (name.length < 2 || message.length < 2) {
        if (feedbackEl) {
            feedbackEl.style.display = 'flex';
            feedbackEl.style.color = '#ef4444';
            feedbackEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Mohon isi nama dan komentar minimal 2 karakter.';
        }
        return false;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }

    try {
        if (!window.rtdb || !window.dbRef || !window.push) {
            throw new Error('Koneksi Firebase belum siap. Coba lagi sebentar.');
        }

        const payload = {
            name: name,
            message: message,
            role: 'visitor',
            createdAt: Date.now()
        };

        await window.push(window.dbRef(window.rtdb, 'comments'), payload);

        if (msgInput) msgInput.value = '';
        if (feedbackEl) {
            feedbackEl.style.display = 'flex';
            feedbackEl.style.color = '#10b981';
            feedbackEl.innerHTML = '<i class="fas fa-check-circle"></i> Komentar berhasil dikirim ke Firebase!';
            setTimeout(() => { feedbackEl.style.display = 'none'; }, 3500);
        }
    } catch (err) {
        console.warn('submitVisitorComment error:', err);
        if (feedbackEl) {
            feedbackEl.style.display = 'flex';
            feedbackEl.style.color = '#ef4444';
            feedbackEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Gagal mengirim: ${escapeCommentHtml(err.message)}`;
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Komentar';
        }
    }
    return false;
}

window.syncCommentsContent = syncCommentsContent;
window.initCommentsRealtime = initCommentsRealtime;
window.submitVisitorComment = submitVisitorComment;

