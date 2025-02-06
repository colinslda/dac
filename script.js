import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';


document.addEventListener('DOMContentLoaded', () => {
    const ajouterPieceBtn = document.getElementById('ajouterPieceBtn');
    const formulairePiece = document.getElementById('formulairePiece');
    const pieceForm = document.getElementById('pieceForm');
    const annulerAjoutBtn = document.getElementById('annulerAjout');
    const categoriesRepertoireDiv = document.getElementById('categoriesRepertoire');

    // --- Firebase Configuration ---
    // Remplacer par VOTRE configuration Firebase (voir instructions plus bas)
    const firebaseConfig = {
        apiKey: "VOTRE_API_KEY",
        authDomain: "VOTRE_AUTH_DOMAIN",
        projectId: "VOTRE_PROJECT_ID",
        storageBucket: "VOTRE_STORAGE_BUCKET",
        messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
        appId: "VOTRE_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);


    let repertoire = []; // Le répertoire sera chargé depuis Firebase
    let utilisateurConnecte = null; // Garder une trace de l'utilisateur connecté


    // Observer l'état de l'authentification Firebase
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Utilisateur connecté
            utilisateurConnecte = user;
            chargerRepertoireFirebase(); // Charger le répertoire de l'utilisateur
        } else {
            // Utilisateur non connecté, rediriger vers login.html
            window.location.href = 'login.html';
        }
    });


    // Fonction pour afficher le formulaire d'ajout de pièce
    ajouterPieceBtn.addEventListener('click', () => {
        formulairePiece.classList.remove('hidden');
        ajouterPieceBtn.classList.add('hidden');
    });

    // Fonction pour annuler l'ajout et cacher le formulaire
    annulerAjoutBtn.addEventListener('click', () => {
        formulairePiece.classList.add('hidden');
        ajouterPieceBtn.classList.remove('hidden');
    });

    // Fonction pour gérer la soumission du formulaire
    pieceForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const titre = document.getElementById('titre').value;
        const compositeur = document.getElementById('compositeur').value;
        const categorie = document.getElementById('categorie').value;

        const nouvellePiece = {
            titre: titre,
            compositeur: compositeur,
            categorie: categorie
        };

        ajouterPieceAuRepertoireFirebase(nouvellePiece);
        formulairePiece.classList.add('hidden');
        ajouterPieceBtn.classList.remove('hidden');
        pieceForm.reset(); // Réinitialise le formulaire
    });


    async function chargerRepertoireFirebase() {
        if (!utilisateurConnecte) {
            console.log("Utilisateur non connecté, répertoire non chargé.");
            return;
        }

        categoriesRepertoireDiv.innerHTML = ''; // Nettoie l'affichage actuel
        repertoire = []; // Réinitialise le répertoire local

        const categories = ["Concerto", "Sonate", "Pièce solo", "Caprices/Etudes", "Technique"];

        for (const categorieNom of categories) {
            const piecesCategorie = [];
            const piecesRef = collection(db, "users", utilisateurConnecte.uid, "repertoire");
            const querySnapshot = await getDocs(piecesRef);
            querySnapshot.forEach((doc) => {
                const pieceData = doc.data();
                if (pieceData.categorie === categorieNom) {
                    piecesCategorie.push({...pieceData, id: doc.id}); // Ajouter l'ID du document
                }
            });

            if (piecesCategorie.length > 0) {
                const categorieSection = document.createElement('div');
                categorieSection.classList.add('categorie-section');

                const categorieTitre = document.createElement('h3');
                categorieTitre.classList.add('categorie-titre');
                categorieTitre.textContent = categorieNom;
                categorieSection.appendChild(categorieTitre);

                piecesCategorie.forEach(piece => {
                    const pieceItem = document.createElement('div');
                    pieceItem.classList.add('piece-item');

                    const pieceInfo = document.createElement('div');
                    pieceInfo.classList.add('piece-info');
                    pieceInfo.innerHTML = `<strong>${piece.titre}</strong> - ${piece.compositeur}`;
                    pieceItem.appendChild(pieceInfo);

                    categorieSection.appendChild(pieceItem);
                });
                categoriesRepertoireDiv.appendChild(categorieSection);
            }
        }
    }


    async function ajouterPieceAuRepertoireFirebase(piece) {
        if (!utilisateurConnecte) {
            console.log("Utilisateur non connecté, pièce non ajoutée.");
            return;
        }

        try {
            await addDoc(collection(db, "users", utilisateurConnecte.uid, "repertoire"), piece);
            chargerRepertoireFirebase(); // Recharger le répertoire mis à jour
        } catch (e) {
            console.error("Erreur lors de l'ajout de la pièce à Firebase: ", e);
        }
    }


    // Enregistrement du Service Worker pour PWA (optionnel pour le fonctionnement de base)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
    }
});
