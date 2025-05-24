// script.js

// Sprawdzanie stanu zalogowania (mo¿na przechowywaæ w Local Storage)
const isLoggedIn = () => {
    return localStorage.getItem('loggedIn') === 'true';
};

// Logowanie
const login = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Tutaj mo¿na dodaæ logikê walidacji u¿ytkownika
    if (username === 'admin' && password === 'password') {
        localStorage.setItem('loggedIn', 'true');
        showDashboard();
    } else {
        alert('Nieprawid³owa nazwa u¿ytkownika lub has³o.');
    }
};

// Wylogowywanie
const logout = () => {
    localStorage.removeItem('loggedIn');
    showLoginPage();
};

// Poka¿ ekran logowania
const showLoginPage = () => {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
};

// Poka¿ g³ówny dashboard
const showDashboard = () => {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
};

// SprawdŸ stan zalogowania przy za³adowaniu strony
window.onload = () => {
    if (isLoggedIn()) {
        showDashboard();
    } else {
        showLoginPage();
    }
};
// script.js

const apiUrl = 'http://localhost:3000/api/users';

const createUser = async (username, password) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(data.message); // Komunikat z serwera
    } catch (error) {
        console.error('B³¹d podczas tworzenia u¿ytkownika:', error);
    }
};

// Wywo³anie funkcji createUser() po klikniêciu przycisku "Zarejestruj"
const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    createUser(username, password);
});
