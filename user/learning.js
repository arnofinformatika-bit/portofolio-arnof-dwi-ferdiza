// ==========================================
// USER: LEARNING (LEARNING PATH & TRANSCRIPT)
// ==========================================

// Synchronize Learning Path Updates to Transcript Table
function updateTranscriptFromFirebase(overridesMap, customList) {
    const transcriptTbody = document.querySelector('#transcript-template .transcript-table tbody');
    if (!transcriptTbody) return;

    // 1. Update grades for existing courses in transcript table
    if (overridesMap) {
        const rows = transcriptTbody.querySelectorAll('tr');
        rows.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 5) {
                const codeText = tds[1].innerText.trim();
                const ov = overridesMap[codeText];
                if (ov && ov.grade !== undefined) {
                    tds[4].innerText = (ov.grade === 'Belum Ada' || !ov.grade) ? '-' : ov.grade;
                }
            }
        });
    }

    // 2. Add custom courses from learning_path to transcript table
    if (Array.isArray(customList)) {
        customList.forEach(cr => {
            if (!cr || !cr.code) return;
            const rows = transcriptTbody.querySelectorAll('tr');
            let existingRow = null;
            rows.forEach(tr => {
                const tds = tr.querySelectorAll('td');
                if (tds.length >= 5 && tds[1].innerText.trim() === cr.code) {
                    existingRow = tr;
                }
            });

            const cleanGrade = (!cr.grade || cr.grade === 'Belum Ada') ? '-' : cr.grade;

            if (existingRow) {
                const tds = existingRow.querySelectorAll('td');
                tds[2].innerText = cr.name;
                tds[3].innerText = (cr.sks ? String(cr.sks).replace(/[^0-9]/g, '') : '3');
                tds[4].innerText = cleanGrade;
            } else {
                const newTr = document.createElement('tr');
                const dataRowCount = transcriptTbody.querySelectorAll('tr:not([colspan])').length + 1;
                newTr.innerHTML = `
                    <td style="text-align: center;">${dataRowCount}</td>
                    <td>${cr.code}</td>
                    <td>${cr.name}</td>
                    <td style="text-align: center;">${cr.sks ? String(cr.sks).replace(/[^0-9]/g, '') : 3}</td>
                    <td style="text-align: center;">${cleanGrade}</td>
                `;
                transcriptTbody.appendChild(newTr);
            }
        });
    }
}

// Helper override matkul & grade
function applyCourseOverrides(overridesMap) {
    if (!overridesMap) return;
    const cards = document.querySelectorAll('#learning-path .course-card');
    cards.forEach(card => {
        const codeEl = card.querySelector('.course-code');
        if (!codeEl) return;
        const code = codeEl.innerText.trim();
        const ov = overridesMap[code];
        if (ov) {
            if (ov.status) {
                const statusBadge = card.querySelector('.course-status-badge');
                if (statusBadge) {
                    statusBadge.innerText = ov.status;
                    statusBadge.className = 'course-status-badge ' + (
                        ov.status === 'Sudah Ambil' ? 'status-sudah' :
                            ov.status === 'Sedang Ambil' ? 'status-sedang' : 'status-belum'
                    );
                }
            }
            if (ov.grade !== undefined) {
                const gradeBox = card.querySelector('.course-grade');
                if (gradeBox) {
                    const isNone = (ov.grade === '-' || ov.grade === 'Belum Ada');
                    const gradeClass = isNone ? 'grade-none' : 'grade-' + String(ov.grade).toLowerCase();
                    const gradeLabel = isNone ? 'Belum Ada' : ov.grade;
                    gradeBox.innerHTML = `Nilai: <span class="badge-grade ${gradeClass}">${gradeLabel}</span>`;
                }
            }
        }
    });

    updateTranscriptFromFirebase(overridesMap, null);
}

function renderCustomCourses(customList) {
    if (!Array.isArray(customList) || customList.length === 0) return;
    customList.forEach(cr => {
        if (!cr || !cr.code) return;
        const existing = Array.from(document.querySelectorAll('#learning-path .course-code')).some(el => el.innerText.trim() === cr.code);
        if (!existing) {
            const card = document.createElement('div');
            card.className = 'course-card';
            const statusClass = cr.status === 'Sudah Ambil' ? 'status-sudah' : cr.status === 'Sedang Ambil' ? 'status-sedang' : 'status-belum';
            const isNone = (!cr.grade || cr.grade === '-' || cr.grade === 'Belum Ada');
            const gradeClass = isNone ? 'grade-none' : 'grade-' + String(cr.grade).toLowerCase();
            const gradeLabel = isNone ? 'Belum Ada' : cr.grade;

            card.innerHTML = `
                <div class="course-status-badge ${statusClass}">${cr.status || 'Sudah Ambil'}</div>
                <div class="course-code">${cr.code}</div>
                <div class="course-name">${cr.name}</div>
                <div class="course-type-container">
                    <span class="badge badge-wajib">Kustom</span>
                    <span class="badge badge-category">${cr.semester || 'Semester 1'}</span>
                </div>
                <div class="course-info-row">
                    <div class="course-sks-val"><i class="fas fa-clock"></i> ${cr.sks || '3 SKS'}</div>
                    <div class="course-grade">Nilai: <span class="badge-grade ${gradeClass}">${gradeLabel}</span></div>
                </div>
            `;
            const grid = document.querySelector('#learning-path .courses-grid');
            if (grid) grid.appendChild(card);
        }
    });

    updateTranscriptFromFirebase(null, customList);
}

function initLearningPathRealtime() {
    if (window.rtdb && window.onValue && window.dbRef) {
        try {
            window.onValue(window.dbRef(window.rtdb, "learning_path_overrides"), (snapshot) => {
                if (snapshot.exists()) {
                    applyCourseOverrides(snapshot.val());
                }
            });

            window.onValue(window.dbRef(window.rtdb, "learning_path"), (snapshot) => {
                if (snapshot.exists()) {
                    const val = snapshot.val();
                    const customList = Object.keys(val).map(k => ({ id: k, ...val[k] }));
                    renderCustomCourses(customList);
                }
            });
        } catch (e) { }
    }
}

// Expose to window
window.updateTranscriptFromFirebase = updateTranscriptFromFirebase;
window.applyCourseOverrides = applyCourseOverrides;
window.renderCustomCourses = renderCustomCourses;
window.initLearningPathRealtime = initLearningPathRealtime;
