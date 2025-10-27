//Ninja API
const API = "https://api.api-ninjas.com/v1/recipe"
const API_KEY = "H3C3LxDAjAjzPO5h+AQ1aw==ElDXRgZHc1kB9Vxt"

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAl1l39pvBaW5yRxELe37X4-HUdg3lRPqk",
  authDomain: "limonysal-7763a.firebaseapp.com",
  projectId: "limonysal-7763a",
  storageBucket: "limonysal-7763a.firebasestorage.app",
  messagingSenderId: "162226982725",
  appId: "1:162226982725:web:6ee003a84e29324e26b82c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Referencias
const btnLogin = document.getElementById("loginGoogle");
const btnLogout = document.getElementById("logoutGoogle");

// Iniciar sesión con Google
btnLogin.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuario autenticado:", user.displayName);

    // Redirigir a la página principal
    window.location.href = "principalpage.html";

  } catch (error) {
    console.error("Error en el inicio de sesión:", error.message);
  }
});
// cerrar sesion (aun no termino de implementarlo)
btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
});