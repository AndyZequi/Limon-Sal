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
const recipesContainer = document.getElementById("recipesContainer");
const buscarRecetas = document.getElementById("buscarRecetas");
const searchBtn = document.getElementById("searchBtn");



// Iniciar sesión con Google
btnLogin.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuario autenticado:", user.displayName);

    // Redirigir a la página principal
    window.location.href = "home.html";

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

//Cambios de autenticacion
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario activo:", user.displayName);
    // Aquí podrías mostrar el contenido principal
  } else {
    console.log("No hay usuario autenticado.");
    // Aquí podrías ocultar contenido o redirigir al login
  }
});

//buscar recetas en HTML
async function buscarRecetas(query) {
  try {
    const response = await fetch(`${API}?query=${query}`, {
      headers: { "X-Api-Key": API_KEY },
    });

    if (!response.ok) throw new Error("Error al buscar recetas");

    const data = await response.json();
    mostrarRecetas(data);

  } catch (error) {
     console.error("Error:", error.message);
    recipesContainer.innerHTML = `
      <div class="col-12 text-center text-danger">
        <p>Error al cargar las recetas. Intenta nuevamente.</p>
      </div>
    `;
  }
}

function mostrarRecetas(recetas) {
  recipesContainer.innerHTML = ""; // Limpiar resultados previos

  if (recetas.length === 0) {
    recipesContainer.innerHTML = `
      <div class="col-12 text-center text-muted">
        <p>No se encontraron recetas con ese término.</p>
      </div>
    `;
    return;
  }

  recetas.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "col-sm-6");

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-success">${r.title}</h5>
          <p class="card-text"><strong>Ingredientes:</strong> ${r.ingredients}</p>
          <p class="card-text"><strong>Instrucciones:</strong> ${r.instructions}</p>
        </div>
      </div>
    `;

    recipesContainer.appendChild(card);
  });
}

// === Eventos para la búsqueda ===
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) buscarRecetas(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) buscarRecetas(query);
  }
});
