import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js'; // Mise à jour version Firebase
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js'; // Mise à jour version Firebase

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const signupLink = document.getElementById('signupLink');
    const signupFormDiv = document.getElementById('signupForm');
    const cancelSignupButton = document.getElementById('cancelSignup');
    const errorMessageDiv = document.getElementById('errorMessage');
    const signupErrorMessageDiv = document.getElementById('signupErrorMessage');


    // --- Firebase Configuration ---
    // Configuration Firebase mise à jour AVEC VOS INFORMATIONS
    const firebaseConfig = {
        apiKey: "AIzaSyCBJwF-jRCcVCJPPFTuLONaoHL4aWWzo00",
        authDomain: "dacapo-fe973.firebaseapp.com",
        projectId: "dacapo-fe973",
        storageBucket: "dacapo-fe973.firebasestorage.app",
        messagingSenderId: "740304498836",
        appId: "1:740304498836:web:2de8d160157f81c4db0481",
        measurementId: "G-99H7ZTTR1P"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);


    // --- Gestion du formulaire de connexion ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Connexion réussie
                const user = userCredential.user;
                console.log("Utilisateur connecté: ", user.email);
                errorMessageDiv.classList.add('hidden'); // Cacher les messages d'erreur précédents
                window.location.href = 'index.html'; // Rediriger vers index.html
            })
            .catch((error) => {
                // Erreur de connexion
                console.error("Erreur de connexion: ", error.code, error.message);
                errorMessageDiv.textContent = "Erreur de connexion: " + error.message;
                errorMessageDiv.classList.remove('hidden');
            });
    });


    // --- Gestion du formulaire d'inscription ---
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = registerForm.signupEmail.value;
        const password = registerForm.signupPassword.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Inscription réussie
                const user = userCredential.user;
                console.log("Utilisateur inscrit: ", user.email);
                signupErrorMessageDiv.classList.add('hidden'); // Cacher les messages d'erreur précédents
                // Vous pouvez choisir de rediriger directement après l'inscription ou afficher un message de succès
                alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                showLoginForm(); // Retourner au formulaire de connexion
            })
            .catch((error) => {
                // Erreur d'inscription
                console.error("Erreur d'inscription: ", error.code, error.message);
                signupErrorMessageDiv.textContent = "Erreur d'inscription: " + error.message;
                signupErrorMessageDiv.classList.remove('hidden');
            });
    });


    // --- Affichage/Masquage des formulaires ---
    signupLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSignupForm();
    });

    cancelSignupButton.addEventListener('click', (event) => {
        event.preventDefault();
        showLoginForm();
    });

    function showSignupForm() {
        loginForm.classList.add('hidden');
        signupFormDiv.classList.remove('hidden');
        errorMessageDiv.classList.add('hidden'); // Cacher les erreurs de connexion
        signupErrorMessageDiv.classList.add('hidden'); // Cacher les erreurs d'inscription
    }

    function showLoginForm() {
        signupFormDiv.classList.add('hidden');
        loginForm.classList.remove('hidden');
        errorMessageDiv.classList.add('hidden'); // Cacher les erreurs de connexion
        signupErrorMessageDiv.classList.add('hidden'); // Cacher les erreurs d'inscription
    }
});
