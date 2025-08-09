 const suratUrl = 'https://quran-api.santrikoding.com/api/surah';
    let ayatList = [];
    let currentAyatIndex = 0;

    function updateProgress() {
      if (ayatList.length > 0) {
        document.getElementById('currentAyat').textContent = currentAyatIndex + 1;
        document.getElementById('totalAyat').textContent = `dari ${ayatList.length}`;
        document.getElementById('progress').textContent = `${Math.round(((currentAyatIndex + 1) / ayatList.length) * 100)}%`;
      }
    }

    function fetchSurat() {
      fetch(suratUrl)
        .then(res => res.json())
        .then(data => {
          const suratElement = document.getElementById('surat');
          suratElement.innerHTML = `<option value="">-- Pilih Surat --</option>` +
            data.map(surat => `<option value="${surat.nomor}">${surat.nomor}. ${surat.nama_latin} (${surat.nama})</option>`).join('');
          $('#surat').select2({
            placeholder: "-- Pilih Surat --",
            allowClear: true,
            width: '100%'
          });
        })
        .catch(err => console.error('Error fetching surat:', err));
    }

    function fetchAyat(suratId) {
      if (!suratId) return;
      const ayatElement = document.getElementById('ayat');
      ayatElement.innerHTML = `
        <div class="flex justify-center items-center h-96">
          <div class="text-center">
            <span class="loading loading-spinner loading-lg text-green-500"></span>
            <p class="text-green-600 mt-4 font-medium">Memuat ayat...</p>
          </div>
        </div>
      `;

      fetch(`${suratUrl}/${suratId}`)
        .then(res => res.json())
        .then(data => {
          ayatList = data.ayat;
          currentAyatIndex = 0;
          renderAyat();
        })
        .catch(err => {
          console.error('Error fetching ayat:', err);
          ayatElement.innerHTML = `
            <div class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Gagal memuat ayat. Silakan coba lagi.</span>
            </div>
          `;
        });
    }

    function renderAyat() {
      const ayatElement = document.getElementById('ayat');
      const ayat = ayatList[currentAyatIndex];
      updateProgress();

      ayatElement.innerHTML = `
        <div class="card shadow-xl border border-green-200 bg-gradient-to-br from-white to-green-50">
          <div class="card-body p-6">
            <!-- Arabic Text -->
            <div class="text-right mb-6 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
              <p class="font-arabic text-3xl md:text-4xl leading-loose text-gray-800">${ayat.ar}</p>
            </div>
            
            <!-- Transliteration -->
            <div class="mb-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p class="text-sm text-gray-700 italic font-medium">${ayat.tr}</p>
            </div>
            
            <!-- Indonesian Translation -->
            <div class="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p class="text-base text-gray-800 leading-relaxed">${ayat.idn}</p>
            </div>
            
            <!-- Ayat Number -->
            <div class="flex justify-between items-center mt-6">
              <div class="badge badge-primary badge-lg">
                <span class="font-semibold">Ayat ${ayat.nomor}</span>
              </div>
              <div class="text-sm text-gray-500">
                ${currentAyatIndex + 1} dari ${ayatList.length} ayat
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <div class="flex justify-between items-center mt-6 gap-4">
          <button id="prevBtn" class="btn btn-outline btn-success flex-1" ${currentAyatIndex === 0 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Sebelumnya
          </button>
          
          <div class="flex-1 text-center">
            <progress class="progress progress-success w-full" value="${((currentAyatIndex + 1) / ayatList.length) * 100}" max="100"></progress>
          </div>
          
          <button id="nextBtn" class="btn btn-success flex-1" ${currentAyatIndex === ayatList.length - 1 ? 'disabled' : ''}>
            Selanjutnya
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      `;

      document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentAyatIndex > 0) {
          currentAyatIndex--;
          renderAyat();
        }
      });

      document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentAyatIndex < ayatList.length - 1) {
          currentAyatIndex++;
          renderAyat();
        }
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      fetchSurat();
      $('#surat').on('change', function () {
        fetchAyat(this.value);
      });
    });