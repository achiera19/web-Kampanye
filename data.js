// data.js - Rendering Charts and Data Table from DATA_ENERGI
document.addEventListener('DOMContentLoaded', () => {
  if (typeof DATA_ENERGI === 'undefined') {
    console.error('DATA_ENERGI tidak ditemukan. Pastikan data-perilaku-energi.js dimuat sebelum data.js');
    return;
  }

  // Populate dynamic KPI cards if present
  const kpiSkor = document.getElementById('kpi-skor');
  const kpiPartisipasi = document.getElementById('kpi-partisipasi');
  if (kpiSkor) kpiSkor.textContent = DATA_ENERGI.ringkasan.rata_rata_skor.toFixed(2);
  if (kpiPartisipasi) kpiPartisipasi.textContent = `${DATA_ENERGI.meta.persen_partisipasi}%`;

  // Chart Global Configurations
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.color = '#52665e';

  // =========================================================================
  // GRAFIK 1: Rata-Rata Skor 10 Butir Perilaku (P01 - P10)
  // =========================================================================
  const ctxButir = document.getElementById('chartButir');
  if (ctxButir) {
    const butirData = DATA_ENERGI.per_butir;
    const labels = butirData.map(b => `${b.kode}: ${b.label}`);
    const scores = butirData.map(b => b.rata_rata);

    // Dynamic color: highlight lowest items (P04, P09, P05) vs highest (P01, P02, P06)
    const backgroundColors = butirData.map(b => {
      if (b.kode === 'P04' || b.kode === 'P09') return '#f28c52'; // Lowest (Orange)
      if (b.kode === 'P05') return '#f9cb55'; // Third lowest (Yellow)
      if (b.kode === 'P01' || b.kode === 'P02' || b.kode === 'P06') return '#176b47'; // Top (Deep Green)
      return '#4fa679'; // Stable good (Medium Green)
    });

    new Chart(ctxButir, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Rata-Rata Skor (Skala 1–4)',
          data: scores,
          backgroundColor: backgroundColors,
          borderRadius: 6,
          borderWidth: 0,
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = butirData[context.dataIndex];
                return [
                  ` Skor Rata-rata: ${context.parsed.x.toFixed(2)}`,
                  ` % Sering: ${item.persen_sering}%`,
                  ` % Jarang: ${item.persen_jarang}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            min: 2.8,
            max: 3.8,
            grid: { color: '#e5ece7' },
            ticks: {
              stepSize: 0.2,
              callback: (val) => val.toFixed(1)
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: '600' },
              color: '#16352f'
            }
          }
        }
      }
    });
  }

  // =========================================================================
  // GRAFIK 2: Rata-Rata Skor Per Jurusan
  // =========================================================================
  const ctxJurusan = document.getElementById('chartJurusan');
  if (ctxJurusan) {
    const jurusanData = DATA_ENERGI.per_jurusan;
    const labels = jurusanData.map(j => `${j.nama} (${j.kode})`);
    const scores = jurusanData.map(j => j.rata_rata_skor);

    // Highlight PPLG & MPLB (lowest) vs PMN, HTL (highest)
    const backgroundColors = jurusanData.map(j => {
      if (j.kode === 'PPLG' || j.kode === 'MPLB') return '#f28c52'; // Lowest majors
      if (j.kode === 'PMN' || j.kode === 'HTL') return '#176b47'; // Highest majors
      return '#4fa679';
    });

    new Chart(ctxJurusan, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Skor Rata-Rata Jurusan',
          data: scores,
          backgroundColor: backgroundColors,
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = jurusanData[context.dataIndex];
                return [
                  ` Skor Rata-rata: ${item.rata_rata_skor.toFixed(2)}`,
                  ` Jumlah Siswa: ${item.jumlah_responden}`,
                  ` % Sangat Baik: ${item.kategori_persen['Sangat Baik']}%`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            min: 3.0,
            max: 3.7,
            grid: { color: '#e5ece7' },
            ticks: {
              stepSize: 0.1,
              callback: (val) => val.toFixed(2)
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10, weight: '600' },
              maxRotation: 35,
              minRotation: 25
            }
          }
        }
      }
    });
  }

  // =========================================================================
  // GRAFIK 3: Distribusi Kategori Perilaku Siswa (Doughnut)
  // =========================================================================
  const ctxKategori = document.getElementById('chartKategori');
  if (ctxKategori) {
    const katData = DATA_ENERGI.ringkasan.kategori;
    const katPersen = DATA_ENERGI.ringkasan.kategori_persen;

    new Chart(ctxKategori, {
      type: 'doughnut',
      data: {
        labels: [
          `Sangat Baik (${katPersen['Sangat Baik']}%)`,
          `Baik (${katPersen['Baik']}%)`,
          `Cukup (${katPersen['Cukup']}%)`,
          `Kurang (${katPersen['Kurang']}%)`
        ],
        datasets: [{
          data: [
            katData['Sangat Baik'],
            katData['Baik'],
            katData['Cukup'],
            katData['Kurang']
          ],
          backgroundColor: [
            '#176b47', // Sangat Baik
            '#52a379', // Baik
            '#f9cb55', // Cukup
            '#f28c52'  // Kurang
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 14,
              padding: 16,
              font: { size: 11, weight: '600' }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = 636;
                const count = context.parsed;
                const pct = ((count / total) * 100).toFixed(1);
                return ` ${count} Siswa (${pct}%)`;
              }
            }
          }
        },
        cutout: '62%'
      }
    });
  }

  // =========================================================================
  // GRAFIK 4: Eksplorasi Multidimensi (Rayon, Gaya Belajar, Sebaran Skor)
  // =========================================================================
  const ctxMulti = document.getElementById('chartMulti');
  const multiExplanation = document.getElementById('multiExplanation');
  let multiChartInstance = null;

  function renderMultiChart(tabType) {
    if (!ctxMulti) return;
    if (multiChartInstance) multiChartInstance.destroy();

    let labels = [];
    let dataValues = [];
    let bgColors = [];
    let chartType = 'bar';
    let yMin = 3.0;
    let yMax = 3.6;

    if (tabType === 'rayon') {
      const rayonData = DATA_ENERGI.per_rayon;
      labels = rayonData.map(r => `${r.rayon} (${r.jumlah_responden})`);
      dataValues = rayonData.map(r => r.rata_rata_skor);
      bgColors = rayonData.map((r, i) => i === 0 ? '#176b47' : '#52a379');
      yMin = 3.2;
      yMax = 3.5;
      if (multiExplanation) {
        multiExplanation.innerHTML = '<strong>Analisis Rayon:</strong> Rayon Tajur (3.41) dan Cicurug (3.38) menduduki peringkat teratas, didorong oleh kekompakan rombel di asrama/area sekitar. Sementara Rayon Wikrama (3.31) memiliki ruang pembinaan lebih intensif untuk menaikkan skor.';
      }
    } else if (tabType === 'gaya') {
      const gayaData = DATA_ENERGI.per_gaya_belajar;
      labels = gayaData.map(g => `${g.gaya_belajar} (${g.jumlah_responden} Siswa)`);
      dataValues = gayaData.map(g => g.rata_rata_skor);
      bgColors = ['#4fa679', '#176b47', '#125437'];
      yMin = 3.2;
      yMax = 3.5;
      if (multiExplanation) {
        multiExplanation.innerHTML = '<strong>Analisis Gaya Belajar:</strong> Siswa bertipe <strong>Kinestetik (3.40)</strong> dan <strong>Auditori (3.39)</strong> lebih unggul dibanding Visual (3.32). Artinya, kampanye berbasis aksi praktik langsung dan teguran lisan jauh lebih mengena dibanding poster pasif.';
      }
    } else if (tabType === 'skor') {
      const skorData = DATA_ENERGI.sebaran_skor_total;
      labels = skorData.map(s => `${s.skor_total}`);
      dataValues = skorData.map(s => s.jumlah);
      bgColors = skorData.map(s => s.skor_total === 40 ? '#176b47' : '#52a379');
      yMin = 0;
      yMax = 100;
      if (multiExplanation) {
        multiExplanation.innerHTML = '<strong>Analisis Sebaran Total:</strong> Sebanyak <strong>86 siswa memperoleh skor sempurna 40/40</strong>! Konsentrasi populasi terbanyak berada di rentang skor 30 hingga 40, membuktikan pemahaman konservasi yang sangat merata.';
      }
    }

    multiChartInstance = new Chart(ctxMulti, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: tabType === 'skor' ? 'Jumlah Siswa' : 'Rata-Rata Skor',
          data: dataValues,
          backgroundColor: bgColors,
          borderRadius: 5,
          barThickness: tabType === 'skor' ? 12 : 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: yMin,
            max: yMax,
            grid: { color: '#e5ece7' }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10, weight: '600' }
            }
          }
        }
      }
    });
  }

  // Initial render for Chart 4
  renderMultiChart('rayon');

  // Tab switcher for Chart 4
  const tabButtons = document.querySelectorAll('.chart-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMultiChart(btn.dataset.tab);
    });
  });

  // =========================================================================
  // POPULATE DETAIL TABLE (10 Butir Pernyataan)
  // =========================================================================
  const tableBody = document.getElementById('table-body');
  if (tableBody) {
    const butirRows = DATA_ENERGI.per_butir.map(b => {
      let badgeHtml = '';
      if (b.kode === 'P01' || b.kode === 'P02' || b.kode === 'P06') {
        badgeHtml = '<span class="badge-tag badge-green">Unggul (Top 3)</span>';
      } else if (b.kode === 'P04' || b.kode === 'P09') {
        badgeHtml = '<span class="badge-tag badge-orange">Kritis (Terendah)</span>';
      } else if (b.kode === 'P05') {
        badgeHtml = '<span class="badge-tag badge-yellow">Tantangan (13.4% Jarang)</span>';
      } else {
        badgeHtml = '<span class="badge-tag" style="background:#e8ede9; color:#425a50;">Baik & Stabil</span>';
      }

      return `
        <tr>
          <td><strong>${b.kode}</strong></td>
          <td style="font-weight: 600; color: var(--ink);">${b.label}</td>
          <td style="color: var(--muted); font-size: 0.82rem; max-width: 320px;">${b.pertanyaan}</td>
          <td><strong style="color: ${b.rata_rata >= 3.45 ? 'var(--green)' : b.rata_rata <= 3.25 ? 'var(--orange)' : 'var(--ink)'}; font-size: 0.95rem;">${b.rata_rata.toFixed(2)}</strong></td>
          <td><span style="color: var(--green); font-weight: 600;">${b.persen_sering}%</span></td>
          <td><span style="color: ${b.persen_jarang >= 13 ? 'var(--orange)' : 'var(--muted)'}; font-weight: 600;">${b.persen_jarang}%</span></td>
          <td>${badgeHtml}</td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = butirRows;
  }
});

