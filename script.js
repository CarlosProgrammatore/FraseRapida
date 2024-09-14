document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const notification = document.getElementById('notification');
    let quotes = [];

    // Cargar las frases desde el archivo JSON
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data.quotes;
            console.log('Frases cargadas:', quotes); // Para depuración
        })
        .catch(error => {
            console.error('Error al cargar las frases:', error);
            quoteElement.textContent = "Error al cargar las frases. Por favor, intenta de nuevo más tarde.";
        });

    generateBtn.addEventListener('click', generateQuote);
    copyBtn.addEventListener('click', copyQuote);

    function generateQuote() {
        if (quotes.length === 0) {
            quoteElement.textContent = "No hay frases disponibles en este momento.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteElement.classList.remove('fade-in');
        void quoteElement.offsetWidth; // Trigger reflow
        quoteElement.classList.add('fade-in');
        quoteElement.textContent = randomQuote;
    }

    function copyQuote() {
        const currentQuote = quoteElement.textContent;
        if (currentQuote !== "¡Haz clic en el botón para generar una frase!" && 
            currentQuote !== "No hay frases disponibles en este momento.") {
            navigator.clipboard.writeText(currentQuote).then(() => {
                showNotification();
            }).catch(err => {
                console.error('Error al copiar la frase: ', err);
            });
        }
    }

    function showNotification() {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
});