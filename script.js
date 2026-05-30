const pages = document.querySelectorAll('.page');
let currentPage = 0;

/* ==========================================================================
   1. CONTROL 3D Y FLIP DE PÁGINAS (Z-INDEX DINÁMICO)
   ========================================================================== */
function updateZIndex() {
    pages.forEach((page, index) => {
        if (index < currentPage) {
            // Hojas ya volteadas (hacia la izquierda): se apilan secuencialmente hacia el frente
            page.style.zIndex = index + 1;
        } else {
            // Hojas por voltear (hacia la derecha): se apilan de forma inversa
            page.style.zIndex = pages.length - index;
        }
    });
}

// Inicializar z-index al cargar
updateZIndex();

/* AVANZAR */
function nextPage() {
    if (currentPage >= pages.length) return;
    pages[currentPage].classList.add('flipped');
    currentPage++;
    updateZIndex();
}

/* RETROCEDER */
function prevPage() {
    if (currentPage <= 0) return;
    currentPage--;
    pages[currentPage].classList.remove('flipped');
    updateZIndex();
}

/* FUNCIÓN DE CLICK INTERNO EN LAS HOJAS */
function turnPage(index) {
    if (index === currentPage) {
        nextPage();
    } else if (index === currentPage - 1) {
        prevPage(); // Regresar si se hace click en la hoja izquierda activa
    }
}

/* NAVEGACIÓN CON TECLADO */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
});

/* ==========================================================================
   2. MAPA INTERACTIVO (SOPORTE SMARTPHONES / TOUCH)
   ========================================================================== */
document.querySelectorAll('.country-pin').forEach(pin => {
    pin.addEventListener('touchstart', function(e) {
        e.stopPropagation(); // Previene que el toque pase la página
        
        const tooltip = this.querySelector('.tooltip-photo');
        if(tooltip.style.transform === 'translateX(-50%) scale(1)') {
            tooltip.style.transform = 'translateX(-50%) scale(0)';
        } else {
            // Limpia otros tooltips abiertos antes de abrir este
            document.querySelectorAll('.tooltip-photo').forEach(t => t.style.transform = 'translateX(-50%) scale(0)');
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        }
    });
});

// Cerrar fotos flotantes si se toca fuera de los pines en móviles
document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.country-pin')) {
        document.querySelectorAll('.tooltip-photo').forEach(t => t.style.transform = 'translateX(-50%) scale(0)');
    }
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

// Iniciar y actualizar cada segundo
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

// Controla el bucle de reproducción dentro del segmento personalizado
audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= finSegmento) {
        audio.currentTime = inicioSegmento;
    }
});

// Activa la música automáticamente al hacer el primer click en la pantalla (Políticas del Navegador)
document.body.addEventListener('click', function() {
    if (audio.paused) {
        audio.currentTime = inicioSegmento;
        audio.play().catch(e => console.log("Se requiere interacción directa para activar música."));
        musicToggle.innerText = '🔇 Silenciar';
    }
}, { once: true });
