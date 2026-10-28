// ==========================================
// USER: LOGBOOK (ACTIVITY LOGS)
// ==========================================

function openLogbookModal() {
    const modal = document.getElementById('logbookModal');
    if (modal) modal.style.display = 'flex';
}

function closeLogbookModal() {
    const modal = document.getElementById('logbookModal');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('logbookForm');
    if (form) form.reset();
}

function loadLogbook() {
    const container = document.getElementById('logbook-container');
    if (!container) return;

    const logs = JSON.parse(localStorage.getItem('logbookEntries')) || [];

    if (logs.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-info-circle" style="display: block; font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    Belum ada data logbook. Klik "Tambah Data" untuk memulai.
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = '';
    logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Aktifitas">${log.activity}</td>
            <td data-label="Hasil">${log.result}</td>
            <td data-label="Kendala">${log.obstacle}</td>
            <td data-label="Waktu Dibuat" style="font-size: 0.8rem; color: var(--text-secondary);">${log.time}</td>
            <td class="col-action">
                <button class="btn-delete" onclick="deleteLog(${log.id})" title="Hapus Log">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        container.appendChild(tr);
    });
}

function deleteLog(id) {
    if (confirm('Hapus catatan logbook ini?')) {
        let logs = JSON.parse(localStorage.getItem('logbookEntries')) || [];
        logs = logs.filter(l => l.id !== id);
        localStorage.setItem('logbookEntries', JSON.stringify(logs));
        loadLogbook();
    }
}

async function syncLogbookContent(getListFn) {
    try {
        let logItems = [];
        if (typeof getListFn === 'function') {
            logItems = await getListFn("logbook");
        } else if (window.getRTDBList) {
            logItems = await window.getRTDBList("logbook");
        }
        if (logItems && logItems.length > 0) {
            const logContainer = document.getElementById('logbook-container') || document.querySelector('#logbook tbody');
            if (logContainer) {
                logItems.forEach(item => {
                    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-';
                    const existing = Array.from(logContainer.querySelectorAll('td')).some(td => td.innerText.trim() === (item.activity || '').trim());
                    if (!existing) {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.activity}</td>
                            <td>${item.result || '-'}</td>
                            <td>${item.obstacle || '-'}</td>
                            <td>${dateStr}</td>
                            <td><span class="badge badge-wajib" style="background: rgba(16,185,129,0.2); color: #10b981;">Tersimpan</span></td>
                        `;
                        logContainer.prepend(tr);
                    }
                });
            }
        }
    } catch (err) {
        console.warn("syncLogbookContent error:", err);
    }
}

function initLogbookFormListener() {
    const logbookForm = document.getElementById('logbookForm');
    if (logbookForm && !logbookForm.dataset.listenerBound) {
        logbookForm.dataset.listenerBound = 'true';
        logbookForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const activity = document.getElementById('logActivity').value;
            const result = document.getElementById('logResult').value;
            const obstacle = document.getElementById('logObstacle').value || '-';
            const timestamp = new Date().toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const newLog = {
                id: Date.now(),
                activity: activity,
                result: result,
                obstacle: obstacle,
                time: timestamp
            };

            let logs = JSON.parse(localStorage.getItem('logbookEntries')) || [];
            logs.unshift(newLog);
            localStorage.setItem('logbookEntries', JSON.stringify(logs));

            loadLogbook();
            closeLogbookModal();
        });
    }
}

// Expose to window
window.openLogbookModal = openLogbookModal;
window.closeLogbookModal = closeLogbookModal;
window.loadLogbook = loadLogbook;
window.deleteLog = deleteLog;
window.syncLogbookContent = syncLogbookContent;

document.addEventListener('DOMContentLoaded', () => {
    initLogbookFormListener();
    loadLogbook();
});
