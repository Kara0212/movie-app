// auth.js

// Inicjalizacja IndexedDB
let db;
const request = indexedDB.open('MovieAppDB', 1);

request.onerror = function () {
    console.error('Blad otwierania IndexedDB');
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('users', { keyPath: 'username' });
    objectStore.createIndex('password', 'password', { unique: false });
};

// Rejestracja u¿ytkownika
function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');

    const getRequest = objectStore.get(username);
    getRequest.onsuccess = function () {
        if (getRequest.result) {
            alert('Uzytkownik juz istnieje.');
        } else {
            const addRequest = objectStore.add({ username, password });
            addRequest.onsuccess = function () {
                alert('Zarejestrowano pomyslnie!');
            };
        }
    };
}

// Logowanie u¿ytkownika
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');

    const getRequest = objectStore.get(username);
    getRequest.onsuccess = function () {
        const user = getRequest.result;
        if (user && user.password === password) {
            alert('Zalogowano pomyslnie!');
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'index.html'; // przekierowanie
        } else {
            alert('Nieprawidlowe dane logowania.');
        }
    };
}
