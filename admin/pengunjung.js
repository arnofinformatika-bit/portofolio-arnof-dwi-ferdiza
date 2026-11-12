// ==========================================
// ADMIN: LOG PENGUNJUNG TERVERIFIKASI (FIREBASE RTDB)
// ==========================================

function escapeVisitorHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatVisitorTime(ts) {
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

async function loadVisitorsData() {
    const container = document.getElementById('adminVisitorsList');
    const countEl = document.getElementById('adminVisitorsTotalCount');
    if (!container) return;

    try {
        const fetchFn = window.fetchRtdbOrFirestore;
        const items = fetchFn ? await fetchFn('visitors') : [];
        const sorted = Array.isArray(items)
            ? [...items].sort((a, b) => (Number(b.verifiedAt || b.createdAt) || 0) - (Number(a.verifiedAt || a.createdAt) || 0))
            : [];

        if (countEl) {
            countEl.textContent = `${sorted.length} Pengunjung`;
        }

        if (sorted.length === 0) {
            container.innerHTML = "<p style='color:#888;'>Belum ada log pengunjung yang masuk.</p>";
            return;
        }

        container.innerHTML = '';
        sorted.forEach(v => {
            const card = document.createElement('div');
            card.className = 'admin-item-card';
            card.id = `card_visitor_${v.id}`;

            const device = escapeVisitorHtml(v.device || 'Web');
            const browser = escapeVisitorHtml(v.browser || 'Browser');
            const deviceIcon = device.toLowerCase() === 'mobile' ? 'fa-mobile-alt' : 'fa-desktop';

            card.innerHTML = `
                <div class="admin-item-info">
                    <h4>
                        ${escapeVisitorHtml(v.name || 'Tamu')}
                        <span style="background: rgba(16, 185, 129, 0.16); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; margin-left: 6px;">
                            <i class="fas fa-shield-check"></i> Captcha OK
                        </span>
                    </h4>
                    <p style="font-size: 0.85rem; color: #cbd5e1;">
                        <i class="fas ${deviceIcon}" style="color: var(--accent-color); margin-right: 4px;"></i> ${device} &bull; ${browser}
                    </p>
                    <div class="admin-item-meta">
                        <i class="fas fa-clock"></i> ${formatVisitorTime(v.verifiedAt || v.createdAt)}
                    </div>
                </div>
                <div class="admin-item-btns">
                    <button class="btn-action-del" onclick="deleteItem('visitors', '${v.id}', 'loadVisitorsData')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${escapeVisitorHtml(err.message)}</p>`;
    }
}

window.loadVisitorsData = loadVisitorsData;
