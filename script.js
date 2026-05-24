const pages = document.querySelectorAll('.page');
let currentPage = 0;

/* Z-INDEX INICIAL */
pages.forEach((page, index) => {
    page.style.zIndex = pages.length - index;
});

/* AVANZAR */
function nextPage() {
    if (currentPage >= pages.length) {
        return;
    }
    pages[currentPage].classList.add('flipped');
    pages[currentPage].style.zIndex = currentPage + 1;
    currentPage++;
}

/* RETROCEDER */
function prevPage() {
    if (currentPage <= 0) {
        return;
    }
    currentPage--;
    pages[currentPage].classList.remove('flipped');
    pages[currentPage].style.zIndex = pages.length - currentPage;
}

/* CLICK SOBRE LA PÁGINA ACTUAL (Evitando botones e imágenes interactivas) */
pages.forEach((page, index) => {

    page.addEventListener('click', (e) => {
        
        // Si el usuario presiona un botón de acción, un pin o un enlace, NO debe pasar la página
        if (
            e.target.closest('.action-buttons') || 
            e.target.closest('.country-pin') || 
            e.target.closest('button') || 
            e.target.closest('a')
        ) {
            return; 
        }

        if (index === currentPage) {
            nextPage();
        }
    });
});

/* SOPORTE TOUCH PARA LOS PINES EN CELULARES */
// Esto permite que al tocar un pin en el celular se muestre la foto, y al tocar fuera se oculte.
document.querySelectorAll('.country-pin').forEach(pin => {
    pin.addEventListener('touchstart', function(e) {
        // Evita que el toque se propague y pase la página
        e.stopPropagation(); 
        
        // Alterna una clase activa para mostrar la foto en móvil
        const tooltip = this.querySelector('.tooltip-photo');
        if(tooltip.style.transform === 'translateX(-50%) scale(1)') {
            tooltip.style.transform = 'translateX(-50%) scale(0)';
        } else {
            // Limpiar otros pines abiertos primero
            document.querySelectorAll('.tooltip-photo').forEach(t => t.style.transform = 'translateX(-50%) scale(0)');
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        }
    });
});

// Cerrar fotos del mapa si se toca cualquier otra parte
document.addEventListener('touchstart', () => {
    document.querySelectorAll('.tooltip-photo').forEach(t => t.style.transform = 'translateX(-50%) scale(0)');
});

// Si el usuario toca cualquier otro lado del mapa, se guardan las fotos flotantes
document.addEventListener('touchstart', () => {
    document.querySelectorAll('.tooltip-photo').forEach(t => t.style.transform = 'translateX(-50%) scale(0)');
});

/* NAVEGACIÓN CON TECLADO */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextPage();
    }
    if (e.key === 'ArrowLeft') {
        prevPage();
    }
});

/* CONTADOR REGRESIVO */
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
        if (el) {
            el.textContent = String(value).padStart(2, '0');
        }
    };

    setValue('days', days);
    setValue('hours', hours);
    setValue('minutes', minutes);
    setValue('seconds', seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* SISTEMA DE AUDIO EXTERNO SEGMENTADO */
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

// Activa el audio en la zona del bucle al hacer el primer toque global
document.body.addEventListener('click', function() {
    if (audio.paused) {
        audio.currentTime = inicioSegmento;
        audio.play().catch(e => console.log("Interacción requerida por el navegador"));
        musicToggle.innerText = '🔇 Silenciar';
    }
}, { once: true });
