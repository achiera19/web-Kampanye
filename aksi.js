// aksi.js - Interactive Daily Tracker & Digital Pledge Pass using LocalStorage
document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DAILY CHECKLIST TRACKER
  // =========================================================================
  const CHECKLIST_STORAGE_KEY = 'ecospark_daily_checklist';
  const checklistContainer = document.getElementById('checklist-container');
  const progressBar = document.getElementById('challenge-bar');
  const progressPercentage = document.getElementById('challenge-percentage');
  const rewardBadge = document.getElementById('reward-badge');
  const resetBtn = document.getElementById('btn-reset-challenge');

  // Load saved state or empty object
  let checklistState = {};
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (raw) checklistState = JSON.parse(raw);
  } catch (err) {
    console.warn('Gagal membaca localStorage checklist:', err);
  }

  function updateChecklistUI() {
    if (!checklistContainer) return;
    const items = checklistContainer.querySelectorAll('.check-item');
    let completedCount = 0;
    const totalCount = items.length;

    items.forEach(item => {
      const id = item.dataset.id;
      const checkbox = item.querySelector('input[type="checkbox"]');
      const isChecked = !!checklistState[id];

      if (checkbox) checkbox.checked = isChecked;
      if (isChecked) {
        item.classList.add('completed');
        completedCount++;
      } else {
        item.classList.remove('completed');
      }
    });

    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPercentage) progressPercentage.textContent = `${pct}% (${completedCount}/${totalCount} Selesai)`;

    // Update reward badge
    if (rewardBadge) {
      if (completedCount === totalCount) {
        rewardBadge.textContent = '🏆 Juara EcoSpark Hari Ini!';
        rewardBadge.style.background = '#d4edda';
        rewardBadge.style.color = '#155724';
      } else if (completedCount >= 3) {
        rewardBadge.textContent = '⚡ Penggerak Konservasi';
        rewardBadge.style.background = '#d1ecf1';
        rewardBadge.style.color = '#0c5460';
      } else if (completedCount > 0) {
        rewardBadge.textContent = '🌱 Pemula Hijau';
        rewardBadge.style.background = '#fff3cd';
        rewardBadge.style.color = '#856404';
      } else {
        rewardBadge.textContent = '🌱 Mulai Aksimu Hari Ini';
        rewardBadge.style.background = '#f8f9fa';
        rewardBadge.style.color = '#6c757d';
      }
    }
  }

  if (checklistContainer) {
    checklistContainer.addEventListener('change', (e) => {
      if (e.target && e.target.type === 'checkbox') {
        const item = e.target.closest('.check-item');
        if (item) {
          const id = item.dataset.id;
          checklistState[id] = e.target.checked;
          try {
            localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklistState));
          } catch (err) {
            console.warn('Gagal menyimpan checklist:', err);
          }
          updateChecklistUI();
        }
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset seluruh checklist tantangan hari ini?')) {
          checklistState = {};
          try {
            localStorage.removeItem(CHECKLIST_STORAGE_KEY);
          } catch (err) {
            console.warn('Gagal menghapus checklist:', err);
          }
          updateChecklistUI();
        }
      });
    }

    // Initial update on page load
    updateChecklistUI();
  }

  // =========================================================================
  // 2. DIGITAL PLEDGE PASS GENERATOR
  // =========================================================================
  const PLEDGE_STORAGE_KEY = 'ecospark_user_pledge';
  const pledgeForm = document.getElementById('pledge-form');
  const pledgeCardResult = document.getElementById('pledge-card-result');
  const passAvatar = document.getElementById('pass-avatar');
  const passName = document.getElementById('pass-name');
  const passClass = document.getElementById('pass-class');
  const passFocus = document.getElementById('pass-focus');
  const passQuote = document.getElementById('pass-quote');
  const passDate = document.getElementById('pass-date');
  const passId = document.getElementById('pass-id');
  const copyPledgeBtn = document.getElementById('btn-copy-pledge');
  const deletePledgeBtn = document.getElementById('btn-delete-pledge');

  function getInitials(name) {
    if (!name) return 'ES';
    return name.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  function displayPledgeCard(data) {
    if (!pledgeCardResult) return;
    if (passAvatar) passAvatar.textContent = getInitials(data.name);
    if (passName) passName.textContent = data.name;
    if (passClass) passClass.textContent = data.className;
    if (passFocus) passFocus.textContent = data.focus;
    if (passQuote) passQuote.textContent = `"${data.promise}"`;
    if (passDate) passDate.textContent = `Diterbitkan: ${data.date}`;
    if (passId) passId.textContent = `ID: ${data.id}`;
    pledgeCardResult.style.display = 'block';
  }

  // Load existing pledge from localStorage on startup
  try {
    const savedPledge = localStorage.getItem(PLEDGE_STORAGE_KEY);
    if (savedPledge) {
      const data = JSON.parse(savedPledge);
      displayPledgeCard(data);
    }
  } catch (err) {
    console.warn('Gagal memuat pledge dari localStorage:', err);
  }

  if (pledgeForm) {
    pledgeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pledge-name').value.trim();
      const className = document.getElementById('pledge-class').value;
      const focus = document.getElementById('pledge-focus').value;
      const promise = document.getElementById('pledge-promise').value.trim();

      if (!name || !className || !promise) {
        alert('Mohon lengkapi seluruh isian komitmen.');
        return;
      }

      // Generate verification ID & formatted date
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `ECO-XI-${randomSuffix}`;

      const pledgeData = {
        name,
        className,
        focus,
        promise,
        date: dateStr,
        id: generatedId
      };

      try {
        localStorage.setItem(PLEDGE_STORAGE_KEY, JSON.stringify(pledgeData));
      } catch (err) {
        console.warn('Gagal menyimpan pledge:', err);
      }

      displayPledgeCard(pledgeData);

      // Smooth scroll to card
      pledgeCardResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (copyPledgeBtn) {
    copyPledgeBtn.addEventListener('click', () => {
      if (!passQuote || !passName) return;
      const textToCopy = `Komitmen EcoSpark saya (${passName.textContent} - ${passClass.textContent}):\n${passQuote.textContent}\nFokus: ${passFocus.textContent}\nVerifikasi: ${passId.textContent} | Kampanye Konservasi Energi 2026`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyPledgeBtn.innerHTML;
        copyPledgeBtn.innerHTML = 'Tersalin ke Clipboard! ✓';
        setTimeout(() => {
          copyPledgeBtn.innerHTML = originalText;
        }, 2200);
      }).catch(err => {
        alert('Teks komitmen: ' + textToCopy);
      });
    });
  }

  if (deletePledgeBtn) {
    deletePledgeBtn.addEventListener('click', () => {
      if (confirm('Hapus kartu komitmen ini?')) {
        try {
          localStorage.removeItem(PLEDGE_STORAGE_KEY);
        } catch (err) {
          console.warn('Gagal menghapus pledge:', err);
        }
        if (pledgeCardResult) pledgeCardResult.style.display = 'none';
        if (pledgeForm) pledgeForm.reset();
      }
    });
  }
});

