const pages = document.querySelectorAll('.page');

let currentPage = 0;

/* Z-INDEX INICIAL */
pages.forEach((page, index) => {
    page.style.zIndex = pages.length - index;
});

/* AVANZAR */
function nextPage() {

    // Permite girar TODAS las hojas, incluida la última
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
    pages[currentPage].style.zIndex =
        pages.length - currentPage;
}

/* CLICK SOBRE LA PÁGINA ACTUAL */
pages.forEach((page, index) => {

    page.addEventListener('click', () => {

        if (index === currentPage) {
            nextPage();
        }

    });

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
const weddingDate =
    new Date('July 25, 2026 17:00:00').getTime();

function updateCountdown() {

    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {

        ['days', 'hours', 'minutes', 'seconds']
            .forEach(id => {

                const el = document.getElementById(id);

                if (el) {
                    el.textContent = '00';
                }

            });

        return;
    }

    const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (diff % (1000 * 60)) /
        1000
    );

    const setValue = (id, value) => {

        const el = document.getElementById(id);

        if (el) {
            el.textContent =
                String(value).padStart(2, '0');
        }

    };

    setValue('days', days);
    setValue('hours', hours);
    setValue('minutes', minutes);
    setValue('seconds', seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const audio = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

const inicioSegmento = 50; 
const finSegmento = 107;

// Función que el botón HTML busca
function toggleMusic() {
    if (audio.paused) {
        audio.play();
        musicToggle.innerText = '🔇 Silenciar';
    } else {
        audio.pause();
        musicToggle.innerText = '🔊 Música';
    }
}

// Bucle para el segmento
audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= finSegmento) {
        audio.currentTime = inicioSegmento;
    }
});

// Inicio automático al primer clic en la página
document.body.addEventListener('click', function() {
    if (audio.paused) {
        audio.currentTime = inicioSegmento;
        audio.play().catch(e => console.log("Esperando interacción"));
        musicToggle.innerText = '🔇 Silenciar';
    }
}, { once: true });