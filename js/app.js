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
let app, auth, provider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  
  // Configurar el provider de Google
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  console.log("Firebase inicializado correctamente");
  console.log("Auth configurado:", auth.app.name);
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
  alert("Error al inicializar Firebase. Por favor, recarga la página.");
}

// Cambios de autenticación - puede ejecutarse en cualquier momento
if (auth) {
  onAuthStateChanged(auth, (user) => {
  const btnLogout = document.getElementById("logoutGoogle");
  
  if (user) {
    console.log("Usuario activo:", user.displayName);
    // Mostrar botón de cerrar sesión si existe
    if (btnLogout) {
      btnLogout.style.display = "block";
    }
    // Si estamos en index.html y hay usuario autenticado, podemos redirigir
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
      // Opcional: redirigir automáticamente si ya está autenticado
      // window.location.href = "user.html";
    }
  } else {
    console.log("No hay usuario autenticado.");
    // Ocultar botón de cerrar sesión si existe
    if (btnLogout) {
      btnLogout.style.display = "none";
    }
  }
  });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Referencias - verificar que existan antes de usar
  const btnLogin = document.getElementById("loginGoogle");
  const btnLogout = document.getElementById("logoutGoogle");
  const recipesContainer = document.getElementById("recipesContainer");
  const buscarRecetas = document.getElementById("buscarRecetas");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("buscarRecetas");

  // Verificar que Firebase esté inicializado
  if (!auth || !provider) {
    console.error("Firebase no está inicializado correctamente");
    if (btnLogin) {
      btnLogin.disabled = true;
      btnLogin.textContent = "Error: Firebase no inicializado";
    }
    return;
  }

  // Iniciar sesión con Google
  if (btnLogin) {
    console.log("Botón de login encontrado, configurando evento...");
    btnLogin.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!auth || !provider) {
        alert("Error: Firebase no está inicializado. Por favor, recarga la página.");
        return;
      }
      try {
        console.log("Intentando iniciar sesión con Google...");
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Usuario autenticado:", user.displayName);
        console.log("Email:", user.email);

        // Redirigir a la página principal
        window.location.href = "home.html";

      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje de error:", error.message);
        
        let errorMessage = "Error al iniciar sesión con Google.";
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Cerraste la ventana de autenticación. Intenta de nuevo.";
        } else if (error.code === "auth/popup-blocked") {
          errorMessage = "El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Error de red. Verifica tu conexión a internet.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
      }
    });
  } else {
    console.warn("El botón loginGoogle no se encontró en el DOM");
  }

  // Cerrar sesión
  if (btnLogout && auth) {
    btnLogout.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("Sesión cerrada");
        // Redirigir al login si estamos en otra página
        if (window.location.pathname !== "/index.html" && !window.location.pathname.includes("index.html")) {
          window.location.href = "index.html";
        }
      } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
        alert("Error al cerrar sesión: " + error.message);
      }
    });
  }

  // === Eventos para la búsqueda ===
  // Verificar si estamos en home.html o results.html
  const esHomePage = window.location.pathname.includes('home.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname.endsWith('/');
  
  if (searchBtn && searchInput) {
    // Event listener para el botón de búsqueda
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        if (esHomePage) {
          // Si estamos en home.html, redirigir a results.html
          localStorage.setItem('terminoBusqueda', query);
          window.location.href = `results.html?q=${encodeURIComponent(query)}`;
        } else if (recipesContainer) {
          // Si estamos en otra página con contenedor, buscar ahí
          buscarRecetas(query);
        }
      } else {
        alert("Por favor, ingresa un término de búsqueda");
      }
    });

    // Event listener para buscar al presionar Enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          if (esHomePage) {
            // Si estamos en home.html, redirigir a results.html
            localStorage.setItem('terminoBusqueda', query);
            window.location.href = `results.html?q=${encodeURIComponent(query)}`;
          } else if (recipesContainer) {
            // Si estamos en otra página con contenedor, buscar ahí
            buscarRecetas(query);
          }
        } else {
          alert("Por favor, ingresa un término de búsqueda");
        }
      }
    });
  } else {
    if (!searchBtn) console.warn("Botón de búsqueda no encontrado");
    if (!searchInput) console.warn("Input de búsqueda no encontrado");
  }
  
  // Si estamos en home.html y hay recipesContainer, mantener funcionalidad local también
  if (esHomePage && recipesContainer) {
    // La búsqueda local seguirá funcionando si es necesario
    console.log("Búsqueda local disponible en home.html");
  }
});

//buscar recetas en HTML
async function buscarRecetas(query) {
  const recipesContainer = document.getElementById("recipesContainer");
  
  if (!recipesContainer) {
    console.error("Contenedor de recetas no encontrado");
    return;
  }

  // Mostrar mensaje de carga
  recipesContainer.innerHTML = `
    <div class="col-12 text-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Buscando recetas...</span>
      </div>
      <p class="mt-2">Buscando recetas...</p>
    </div>
  `;

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
        <p class="text-muted">${error.message}</p>
      </div>
    `;
  }
}

// Funciones para guardar recetas en localStorage
function guardarReceta(receta) {
  try {
    let recetasGuardadas = JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
    
    // Verificar si la receta ya está guardada (por título)
    const existe = recetasGuardadas.some(r => r.title === receta.title);
    
    if (!existe) {
      recetasGuardadas.push(receta);
      localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
      return true;
    } else {
      return false; // Ya existe
    }
  } catch (error) {
    console.error("Error al guardar receta:", error);
    return false;
  }
}

function eliminarReceta(titulo) {
  try {
    let recetasGuardadas = JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
    recetasGuardadas = recetasGuardadas.filter(r => r.title !== titulo);
    localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
    return true;
  } catch (error) {
    console.error("Error al eliminar receta:", error);
    return false;
  }
}

function obtenerRecetasGuardadas() {
  try {
    return JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
  } catch (error) {
    console.error("Error al obtener recetas guardadas:", error);
    return [];
  }
}

function recetaEstaGuardada(titulo) {
  const recetasGuardadas = obtenerRecetasGuardadas();
  return recetasGuardadas.some(r => r.title === titulo);
}

function mostrarRecetas(recetas) {
  if (!recipesContainer) return; // Si no existe el contenedor, salir
  
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

    const estaGuardada = recetaEstaGuardada(r.title);
    const botonTexto = estaGuardada ? 'Guardada' : 'Guardar';
    const botonClase = estaGuardada ? 'btn-success' : 'btn-primary';
    const icono = estaGuardada ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus';

    // Escapar HTML en los datos de la receta
    const tituloEscapado = r.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const ingredientesEscapados = r.ingredients.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const instruccionesEscapadas = r.instructions.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Crear una copia de la receta con datos escapados para mostrar
    const recetaParaMostrar = {
      title: tituloEscapado,
      ingredients: ingredientesEscapados,
      instructions: instruccionesEscapadas
    };
    
    // Para el data attribute, usar la receta original sin escapar
    const recetaData = encodeURIComponent(JSON.stringify(r));

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-success">${recetaParaMostrar.title}</h5>
          <p class="card-text"><strong>Ingredientes:</strong> ${recetaParaMostrar.ingredients}</p>
          <p class="card-text"><strong>Instrucciones:</strong> ${recetaParaMostrar.instructions}</p>
          <button class="btn ${botonClase} btn-sm mt-2 btn-guardar-receta" 
                  data-receta="${recetaData}">
            <i class="bi ${icono}"></i> ${botonTexto}
          </button>
        </div>
      </div>
    `;

    recipesContainer.appendChild(card);
  });

  // Agregar event listeners a los botones de guardar
  document.querySelectorAll('.btn-guardar-receta').forEach(btn => {
    btn.addEventListener('click', function() {
      const recetaStr = decodeURIComponent(this.getAttribute('data-receta'));
      const receta = JSON.parse(recetaStr);
      
      if (recetaEstaGuardada(receta.title)) {
        // Eliminar de guardados
        if (eliminarReceta(receta.title)) {
          this.innerHTML = '<i class="bi bi-bookmark-plus"></i> Guardar';
          this.classList.remove('btn-success');
          this.classList.add('btn-primary');
          alert('Receta eliminada de guardados');
        }
      } else {
        // Guardar receta
        if (guardarReceta(receta)) {
          this.innerHTML = '<i class="bi bi-bookmark-check-fill"></i> Guardada';
          this.classList.remove('btn-primary');
          this.classList.add('btn-success');
          alert('Receta guardada correctamente');
        } else {
          alert('Esta receta ya está guardada');
        }
      }
    });
  });
}

// Las funciones de búsqueda están definidas arriba y los event listeners están en DOMContentLoaded
