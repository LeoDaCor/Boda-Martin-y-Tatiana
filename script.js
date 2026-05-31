const pages = document.querySelectorAll('.page');
let currentPage = 0;

/* ==========================================================================
   1. CONTROL 3D Y FLIP DE PÁGINAS (Z-INDEX DINÁMICO)
   ========================================================================== */
function updateZIndex() {
    pages.forEach((page, index) => {
        if (index < currentPage) {
            page.style.zIndex = index + 1;
        } else {
            page.style.zIndex = pages.length - index;
        }
    });
}

// Inicializar z-index al cargar
updateZIndex();

/* AVANZAR (Activado únicamente por el botón Siguiente o Teclado) */
function nextPage() {
    if (currentPage >= pages.length) return;
    pages[currentPage].classList.add('flipped');
    currentPage++;
    updateZIndex();
}

/* RETROCEDER (Activado únicamente por el botón Anterior o Teclado) */
function prevPage() {
    if (currentPage <= 0) return;
    currentPage--;
    pages[currentPage].classList.remove('flipped');
    updateZIndex();
}

/* NAVEGACIÓN CON TECLADO */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
});

/* ==========================================================================
   2. MAPA INTERACTIVO (APERTURA DIRECTA A PANTALLA COMPLETA)
   ========================================================================== */
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');

function abrirFotoPin(e, pin) {
    e.stopPropagation(); // Evita interferencias con otros elementos
    const rutaImagen = pin.getAttribute('data-img');
    
    if (rutaImagen) {
        modal.style.display = "flex";
        modalImg.src = rutaImagen;
    }
}

function closeModal() {
    modal.style.display = "none";
    modalImg.src = "";
}

// Asignar eventos a los pines tanto para PC (click) como para Móviles (touchstart)
document.querySelectorAll('.country-pin').forEach(pin => {
    pin.addEventListener('click', function(e) {
        abrirFotoPin(e, this);
    });

    pin.addEventListener('touchstart', function(e) {
        abrirFotoPin(e, this);
    }, { passive: true });
});

/* ==========================================================================
   3. CONTADOR REGRESIVO (CUENTA ATRÁS)
   ========================================================================== */
const weddingDate = new Date('July 25, 2026 17:00:00').getTime();

function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '00';
        });
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
    };

    setValue('days', days);
    setValue('hours', hours);
    setValue('minutes', minutes);
    setValue('seconds', seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================================================
   4. CONTROL DE AUDIO (REPRODUCTOR EXTERNO CON BUCLE)
   ========================================================================== */
const audio = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

const inicioSegmento = 50; 
const finSegmento = 107;

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        musicToggle.innerText = '🔇 Silenciar';
    } else {
        audio.pause();
        musicToggle.innerText = '🔊 Música';
    }
}

audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= finSegmento) {
        audio.currentTime = inicioSegmento;
    }
});

document.body.addEventListener('click', function() {
    if (audio.paused) {
        audio.currentTime = inicioSegmento;
        audio.play().catch(e => console.log("Interacción requerida para el audio."));
        musicToggle.innerText = '🔇 Silenciar';
    }
}, { once: true });
