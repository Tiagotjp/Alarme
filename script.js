// Relógio e Data
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('pt-PT', dateOptions);
}

// Localização
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location').textContent = "Geolocalização não suportada";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('location').textContent = `Localização: ${data.address.city}, ${data.address.country}`;
        });
}

function showError(error) {
    document.getElementById('location').textContent = "Erro ao obter localização.";
}

// Cronômetro
let playing = false;
let currentSeconds = 0;
let timerInterval;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const newSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
}

document.getElementById('set-timer').addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minute-input').value);
    if (!isNaN(minutes)) {
        currentSeconds = minutes * 60;
        document.getElementById('timer').textContent = formatTime(currentSeconds);
    }
});

document.getElementById('play').addEventListener('click', () => {
    if (playing) {
        clearInterval(timerInterval);
    } else {
        timerInterval = setInterval(() => {
            if (currentSeconds > 0) {
                currentSeconds--;
                document.getElementById('timer').textContent = formatTime(currentSeconds);
            }
        }, 1000);
    }
    playing = !playing;
    const playIcon = document.getElementById('play').querySelector('i');
    playIcon.classList.toggle('fa-play');
    playIcon.classList.toggle('fa-pause');
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timerInterval);
    playing = false;
    currentSeconds = 0;
    document.getElementById('timer').textContent = formatTime(currentSeconds);
    const playIcon = document.getElementById('play').querySelector('i');
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
});

// Alarme
let alarmTime = null;
const alarmSound = document.getElementById('rooster-sound');
const stopAlarmBtn = document.getElementById('stop-alarm');

document.getElementById('set-alarm').addEventListener('click', () => {
    const timeInput = document.getElementById('alarm-time').value;
    if (timeInput) {
        alarmTime = timeInput;
        document.getElementById('alarm-status').textContent = `Alarme definido para ${alarmTime}`;
        stopAlarmBtn.classList.add('hidden');
    }
});

stopAlarmBtn.addEventListener('click', () => {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reiniciar o som
    document.getElementById('alarm-status').textContent = 'Alarme parado';
    stopAlarmBtn.classList.add('hidden');
});

setInterval(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    if (alarmTime === currentTime) {
        alarmSound.play();
        document.getElementById('alarm-status').textContent = "Alarme tocando!";
        stopAlarmBtn.classList.remove('hidden');
        alarmTime = null; // Resetar o alarme após tocar
    }
}, 1000);

// Inicialização
setInterval(updateClock, 1000);
getLocation();
