let frases = {};
let frase = '';
let conteoFrases = 0;
let favoritos = [];
let estadisticas = { motivacion: 0, amor: 0, vida: 0 };
let autoGenerarIntervalo;
let audio = true;

const fraseContainer = document.getElementById('fraseContainer');
const generaFraseBtn = document.getElementById('generaFrase');
const categoriaSelect = document.getElementById('categoria');
const toggleFavoritoBtn = document.getElementById('toggleFavorito');
const compartirFraseBtn = document.getElementById('compartirFrase');
const autoGenerarCheckbox = document.getElementById('autoGenerar');
const velocidadSlider = document.getElementById('velocidad');
const conteoFrasesElement = document.getElementById('conteoFrases');
const favoritosList = document.getElementById('favoritosList');
const themeToggle = document.getElementById('themeToggle');
const audioToggle = document.getElementById('audioToggle');
const statsButton = document.getElementById('statsButton');
const notification = document.getElementById('notification');
const statsModal = document.getElementById('statsModal');
const closeModal = document.querySelector('.close');

// Cargar frases desde el archivo JSON
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        frases = data.quotes;
        console.log('Frases cargadas:', frases);
    })
    .catch(error => {
        console.error('Error al cargar las frases:', error);
    });

function generaFrase() {
    const categoria = categoriaSelect.value;
    const frasesCategoria = frases[categoria];
    if (frasesCategoria && frasesCategoria.length > 0) {
        frase = frasesCategoria[Math.floor(Math.random() * frasesCategoria.length)];
        fraseContainer.textContent = frase;
        conteoFrases++;
        conteoFrasesElement.textContent = `Frases Generadas: ${conteoFrases}`;
        estadisticas[categoria]++;

        if (audio) {
            new Audio('click.mp3').play();
        }

        if (conteoFrases > 0 && conteoFrases % 10 === 0) {
            confetti();
        }

        fraseContainer.classList.remove('fade-in');
        void fraseContainer.offsetWidth;
        fraseContainer.classList.add('fade-in');

        actualizaBotonFavorito();
    } else {
        console.error('No se encontraron frases para la categoría:', categoria);
    }
}

function toggleFavorito() {
    if (frase) {
        const index = favoritos.indexOf(frase);
        if (index > -1) {
            favoritos.splice(index, 1);
        } else {
            favoritos.push(frase);
        }
        actualizaBotonFavorito();
        actualizaFavoritos();
    }
}

function actualizaBotonFavorito() {
    toggleFavoritoBtn.textContent = favoritos.includes(frase) ? '❤️' : '🤍';
}

function compartirFrase() {
    if (frase) {
        navigator.clipboard.writeText(frase)
            .then(() => mostrarNotificacion('Frase copiada al portapapeles'))
            .catch(err => console.error('Error al copiar la frase: ', err));
    }
}

function actualizaFavoritos() {
    favoritosList.innerHTML = '';
    if (favoritos.length === 0) {
        favoritosList.innerHTML = '<li>Aún no tienes frases favoritas.</li>';
    } else {
        favoritos.forEach((frase, index) => {
            const li = document.createElement('li');
            li.className = 'favoritos-item';
            li.innerHTML = `
                <span>${frase}</span>
                <button class="icon-button" onclick="eliminaFavorito(${index})">🗑️</button>
            `;
            favoritosList.appendChild(li);
        });
    }
}

function eliminaFavorito(index) {
    favoritos.splice(index, 1);
    actualizaFavoritos();
}

function toggleAutoGenerar() {
    if (autoGenerarCheckbox.checked) {
        const velocidad = velocidadSlider.value;
        autoGenerarIntervalo = setInterval(generaFrase, 5000 / velocidad);
    } else {
        clearInterval(autoGenerarIntervalo);
    }
}

function actualizaVelocidad() {
    if (autoGenerarCheckbox.checked) {
        clearInterval(autoGenerarIntervalo);
        const velocidad = velocidadSlider.value;
        autoGenerarIntervalo = setInterval(generaFrase, 5000 / velocidad);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

function toggleAudio() {
    audio = !audio;
    audioToggle.textContent = audio ? '🔊' : '🔇';
}

function muestraEstadisticas() {
    const statsContent = document.getElementById('statsContent');
    statsContent.innerHTML = `
        <p>Total de frases generadas: ${conteoFrases}</p>
        <h3>Por categoría:</h3>
        <ul>
            <li>Motivación: ${estadisticas.motivacion}</li>
            <li>Amor: ${estadisticas.amor}</li>
            <li>Vida: ${estadisticas.vida}</li>
        </ul>
        <p>Frases favoritas: ${favoritos.length}</p>
    `;
    statsModal.style.display = "block";
}

function confetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.left = `${Math.random() * 100}%`;
        div.style.top = '-10px';
        div.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(div);

        const animation = div.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 1000 + 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: Math.random() * 200
        });

        animation.onfinish = () => div.remove();
    }
}

function mostrarNotificacion(mensaje) {
    notification.textContent = mensaje;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

generaFraseBtn.addEventListener('click', generaFrase);
toggleFavoritoBtn.addEventListener('click', toggleFavorito);
compartirFraseBtn.addEventListener('click', compartirFrase);
autoGenerarCheckbox.addEventListener('change', toggleAutoGenerar);
velocidadSlider.addEventListener('input', actualizaVelocidad);
themeToggle.addEventListener('click', toggleTheme);
audioToggle.addEventListener('click', toggleAudio);
statsButton.addEventListener('click', muestraEstadisticas);
closeModal.addEventListener('click', () => statsModal.style.display = "none");

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

window.onclick = (event) => {
    if (event.target == statsModal) {
        statsModal.style.display = "none";
    }
};

actualizaFavoritos();