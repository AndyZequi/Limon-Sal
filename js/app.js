// ===== CONFIGURACIÓN GLOBAL =====
const API = "https://api.api-ninjas.com/v1/recipe";
const API_KEY = "H3C3LxDAjAjzPO5h+AQ1aw==ElDXRgZHc1kB9Vxt";


// ===== FIREBASE =====

// Variables globales
let auth, provider;

// ===== INICIALIZACIÓN FIREBASE =====
function initializeFirebase() {
  try {
    // Firebase ya está disponible globalmente desde el CDN
    if (typeof firebase !== 'undefined') {
      const firebaseConfig = {
        apiKey: "AIzaSyAl1l39pvBaW5yRxELe37X4-HUdg3lRPqk",
        authDomain: "limonysal-7763a.firebaseapp.com",
        projectId: "limonysal-7763a",
        storageBucket: "limonysal-7763a.firebasestorage.app",
        messagingSenderId: "162226982725",
        appId: "1:162226982725:web:6ee003a84e29324e26b82c"
      };

      // Inicializar Firebase
      const app = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      provider = new firebase.auth.GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log("✅ Firebase inicializado correctamente");
      return true;
    } else {
      console.error("❌ Firebase no está disponible");
      return false;
    }
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
    return false;
  }
}

//FUNCIONALIDAD DE RECETA ALEATORIA EN HOME 
document.addEventListener("DOMContentLoaded", () => {
  const explorarBtn = document.getElementById("explorarRecetas");
  const recetaSection = document.getElementById("recetaAleatoria");

  explorarBtn.addEventListener("click", async () => {
    try {
      // Palabras aleatorias base
      const keywords = ["chicken", "pasta", "salad", "cake", "fish", "soup", "beef", "tacos", "burger", "pizza", "sushi"];
      const randomQuery = keywords[Math.floor(Math.random() * keywords.length)];

      // Petición a la API
      const response = await fetch(`${API}?query=${randomQuery}`, {
        headers: { "X-Api-Key": API_KEY },
      });

      const data = await response.json();

      if (!data || data.length === 0) {
        alert("No se encontró ninguna receta, intenta de nuevo.");
        return;
      }

      // Selecciona una receta aleatoria
      const randomRecipe = data[Math.floor(Math.random() * data.length)];

      // Inserta la receta en el DOM
      document.getElementById("recetaTitulo").textContent = randomRecipe.title;
      document.getElementById("recetaIngredientes").innerHTML = `<strong>Ingredientes:</strong> ${randomRecipe.ingredients}`;
      document.getElementById("recetaInstrucciones").innerHTML = `<strong>Instrucciones:</strong> ${randomRecipe.instructions}`;
  
      recetaSection.style.display = "block";
      recetaSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
      console.error("Error al obtener receta:", error);
      alert("Ocurrió un error al buscar una receta aleatoria.");
    }
  });
});

// ===== FUNCIONALIDAD: MOSTRAR RECETAS POR CATEGORÍA =====
document.addEventListener("DOMContentLoaded", () => {
  const categorias = document.querySelectorAll(".category-card");
  const categoriaSection = document.getElementById("categoriaRecetas");
  const categoriaTitulo = document.getElementById("categoriaTitulo");
  const categoriaLista = document.getElementById("categoriaLista");

  categorias.forEach(card => {
    card.addEventListener("click", async () => {
      
      const categoriaNombre = card.querySelector(".category-title")?.textContent.trim();

      const categoriasMap = {
        "Aves": "chicken",
        "Carnes Rojas": "beef",
        "Pescados y Mariscos": "fish",
        "Sopas y Cremas": "soup",
        "Ensaladas": "salad",
        "Acompañamientos": "side dish",
        "Postres": "cake",
        "Bebidas y Coctelería": "drink"
      };

      const categoriaQuery = categoriasMap[categoriaNombre] || categoriaNombre;
      console.log(`🔍 Buscando recetas para: ${categoriaNombre} → ${categoriaQuery}`);

      try {
        const response = await fetch(`${API}?query=${categoriaQuery}`, {
          headers: { "X-Api-Key": API_KEY },
        });

        const data = await response.json();

        if (!data || data.length === 0) {
          categoriaLista.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: #777;">
              No se encontraron recetas para <strong>${categoriaNombre}</strong>.
            </p>`;
          categoriaSection.style.display = "block";
          categoriaSection.scrollIntoView({ behavior: "smooth" });
          return;
        }

        categoriaTitulo.textContent = `Recetas de ${categoriaNombre}`;
        categoriaLista.innerHTML = "";
        categoriaSection.style.display = "block";
        categoriaSection.scrollIntoView({ behavior: "smooth" });

        data.slice(0, 6).forEach(receta => {
          const card = document.createElement("div");
          card.classList.add("receta-card");
          card.style.border = "1px solid #ddd";
          card.style.borderRadius = "10px";
          card.style.padding = "1rem";
          card.style.backgroundColor = "#fff";
          card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
          card.style.marginBottom = "1rem";

          card.innerHTML = `
            <h3>${receta.title}</h3>
            <p><strong>Ingredientes:</strong> ${receta.ingredients}</p>
            <p><strong>Instrucciones:</strong> ${receta.instructions}</p>
          `;
          categoriaLista.appendChild(card);
        });

      } catch (error) {
        console.error("Error al obtener recetas:", error);
        alert("Hubo un error al cargar las recetas de la categoría.");
      }
    });
  });
});


// ===== FUNCIONES DEL MENÚ LATERAL =====
function initializeMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const sideMenu = document.getElementById('sideMenu');

  if (!menuBtn || !sideMenu) {
    console.warn("⚠️ Elementos del menú no encontrados");
    return;
  }

  // Abrir menú
  menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Cerrar menú
  function closeMenuFunc() {
    sideMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeMenu) closeMenu.addEventListener('click', closeMenuFunc);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenuFunc);

  // Cerrar menú con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
      closeMenuFunc();
    }
  });

  console.log("✅ Menú inicializado correctamente");
}

// ===== FUNCIONES DE BÚSQUEDA UNIFICADAS =====
function initializeSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('buscarRecetas');

  if (!searchBtn || !searchInput) {
    console.warn("⚠️ Elementos de búsqueda no encontrados");
    return;
  }

  // Determinar en qué página estamos
  const isHomePage = window.location.pathname.includes('home.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname.endsWith('/');
  
  const isResultsPage = window.location.pathname.includes('results.html');

  // Event listener para el botón de búsqueda
  searchBtn.addEventListener('click', handleSearch);

  // Event listener para buscar al presionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });

  function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
      showAlert('Por favor, ingresa un término de búsqueda');
      return;
    }

    if (isHomePage) {
      // Redirigir a results.html desde home
      localStorage.setItem('terminoBusqueda', query);
      window.location.href = `results.html?q=${encodeURIComponent(query)}`;
    } else if (isResultsPage) {
      // Buscar en la misma página (results.html)
      localStorage.setItem('terminoBusqueda', query);
      buscarRecetas(query);
    } else {
      // Para otras páginas, redirigir a results.html
      localStorage.setItem('terminoBusqueda', query);
      window.location.href = `results.html?q=${encodeURIComponent(query)}`;
    }
  }

  // Si estamos en results.html, cargar búsqueda automáticamente
  if (isResultsPage) {
    const termino = obtenerTerminoBusqueda();
    if (termino && searchInput) {
      searchInput.value = termino;
      buscarRecetas(termino);
    }
  }

  console.log("✅ Búsqueda inicializada correctamente");
}

// ===== FUNCIONES DE AUTENTICACIÓN =====
function initializeAuth() {
  const btnLogin = document.getElementById('loginGoogle');
  const btnLogout = document.getElementById('logoutGoogle');

  // Inicializar Firebase primero
  const firebaseReady = initializeFirebase();
  
  if (!firebaseReady) {
    console.error("❌ Firebase no está disponible");
    if (btnLogin) {
      btnLogin.disabled = true;
      btnLogin.textContent = "Error: Firebase no disponible";
    }
    return;
  }

  // Estado de autenticación
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("✅ Usuario autenticado:", user.displayName);
      if (btnLogout) btnLogout.style.display = "block";
      
      // Si estamos en login y hay usuario, redirigir a home
      if (window.location.pathname.includes('index.html')) {
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      }
    } else {
      console.log("🔒 No hay usuario autenticado");
      if (btnLogout) btnLogout.style.display = "none";
    }
  });

  // Iniciar sesión con Google
  if (btnLogin) {
    btnLogin.addEventListener('click', async (e) => {
      e.preventDefault();
      
      try {
        console.log("🔑 Intentando iniciar sesión con Google...");
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        console.log("✅ Usuario autenticado:", user.displayName);

        showAlert(`¡Bienvenido ${user.displayName}!`, 'success');
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);

      } catch (error) {
        console.error("❌ Error en el inicio de sesión:", error);
        let errorMessage = "Error al iniciar sesión con Google.";
        
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Cerraste la ventana de autenticación. Intenta de nuevo.";
        } else if (error.code === "auth/popup-blocked") {
          errorMessage = "El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Error de red. Verifica tu conexión a internet.";
        }
        
        showAlert(errorMessage, 'error');
      }
    });
  }

  // Cerrar sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        await auth.signOut();
        console.log("🚪 Sesión cerrada");
        showAlert("Sesión cerrada correctamente", 'success');
        
        // Redirigir al login si no estamos ahí
        if (!window.location.pathname.includes('index.html')) {
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        }
      } catch (error) {
        console.error("❌ Error al cerrar sesión:", error);
        showAlert("Error al cerrar sesión: " + error.message, 'error');
      }
    });
  }

  console.log("✅ Autenticación inicializada correctamente");
}

// ===== FUNCIONES DE RECETAS =====
function obtenerTerminoBusqueda() {
  // Intentar obtener de localStorage primero
  const terminoLocalStorage = localStorage.getItem('terminoBusqueda');
  if (terminoLocalStorage) {
    localStorage.removeItem('terminoBusqueda');
    return terminoLocalStorage;
  }

  // Intentar obtener de parámetros URL
  const urlParams = new URLSearchParams(window.location.search);
  const terminoURL = urlParams.get('q');
  if (terminoURL) {
    return decodeURIComponent(terminoURL);
  }

  return null;
}

async function buscarRecetas(query) {
  const recipesContainer = document.getElementById("recipesContainer");
  const noResults = document.getElementById("noResults");
  const searchTerm = document.getElementById("searchTerm");
  
  if (!recipesContainer) {
    console.error("❌ Contenedor de recetas no encontrado");
    return;
  }

  // Mostrar el término de búsqueda
  if (searchTerm) {
    searchTerm.textContent = `Buscando: "${query}"`;
  }

  // Mostrar mensaje de carga
  recipesContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Buscando recetas...</span>
      </div>
      <p class="mt-3">Buscando recetas...</p>
    </div>
  `;
  
  if (noResults) noResults.style.display = "none";

  try {
    const response = await fetch(`${API}?query=${encodeURIComponent(query)}`, {
      headers: { "X-Api-Key": API_KEY },
    });

    if (!response.ok) throw new Error("Error al buscar recetas");

    const data = await response.json();
    
    if (data.length === 0) {
      mostrarSinResultados();
    } else {
      mostrarRecetas(data);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    recipesContainer.innerHTML = `
      <div class="col-12 text-center text-danger py-5">
        <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Error al cargar las recetas</h4>
        <p class="text-muted">${error.message}</p>
        <button class="btn btn-primary mt-3" onclick="location.reload()">
          <i class="bi bi-arrow-clockwise"></i> Intentar de nuevo
        </button>
      </div>
    `;
  }
}

function mostrarSinResultados() {
  const recipesContainer = document.getElementById("recipesContainer");
  const noResults = document.getElementById("noResults");
  
  if (recipesContainer) recipesContainer.innerHTML = "";
  if (noResults) noResults.style.display = "block";
}

// ===== FUNCIONES PRINCIPALES =====
function mostrarSinResultados() {
  const recipesContainer = document.getElementById("recipesContainer");
  const noResults = document.getElementById("noResults");
  
  if (recipesContainer) recipesContainer.innerHTML = "";
  if (noResults) noResults.style.display = "block";
}

function mostrarRecetas(recetas) {
  const recipesContainer = document.getElementById("recipesContainer");
  const noResults = document.getElementById("noResults");
  
  if (!recipesContainer) return;
  
  recipesContainer.innerHTML = "";
  if (noResults) noResults.style.display = "none";

  if (recetas.length === 0) {
    mostrarSinResultados();
    return;
  }

  recetas.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "col-sm-6", "mb-4");

    const estaGuardada = recetaEstaGuardada(r.title);
    const botonTexto = estaGuardada ? 'Guardada' : 'Guardar';
    const botonClase = estaGuardada ? 'btn-success' : 'btn-primary';
    const icono = estaGuardada ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus';

    // Escapar HTML para seguridad
    const tituloEscapado = escapeHTML(r.title);
    const ingredientesEscapados = escapeHTML(r.ingredients);
    const instruccionesEscapadas = escapeHTML(r.instructions);
    
    const recetaData = encodeURIComponent(JSON.stringify(r));

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-success">${tituloEscapado}</h5>
          <p class="card-text"><strong>Ingredientes:</strong> ${ingredientesEscapados}</p>
          <p class="card-text"><strong>Instrucciones:</strong> ${instruccionesEscapadas}</p>
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
          showAlert('Receta eliminada de guardados', 'success');
        }
      } else {
        // Guardar receta
        if (guardarReceta(receta)) {
          this.innerHTML = '<i class="bi bi-bookmark-check-fill"></i> Guardada';
          this.classList.remove('btn-primary');
          this.classList.add('btn-success');
          showAlert('Receta guardada correctamente', 'success');
        } else {
          showAlert('Esta receta ya está guardada', 'warning');
        }
      }
    });
  });
}

// ===== FUNCIONES DE LOCALSTORAGE =====
function obtenerRecetasGuardadas() {
  try {
    return JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
  } catch (error) {
    console.error("❌ Error al obtener recetas guardadas:", error);
    return [];
  }
}

function guardarReceta(receta) {
  try {
    let recetasGuardadas = obtenerRecetasGuardadas();
    const existe = recetasGuardadas.some(r => r.title === receta.title);
    
    if (!existe) {
      recetasGuardadas.push(receta);
      localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("❌ Error al guardar receta:", error);
    return false;
  }
}

function eliminarReceta(titulo) {
  try {
    let recetasGuardadas = obtenerRecetasGuardadas();
    recetasGuardadas = recetasGuardadas.filter(r => r.title !== titulo);
    localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar receta:", error);
    return false;
  }
}

function recetaEstaGuardada(titulo) {
  const recetasGuardadas = obtenerRecetasGuardadas();
  return recetasGuardadas.some(r => r.title === titulo);
}

// ===== FUNCIONES DE USUARIO =====
function initializeUserPage() {
  const savedRecipesContainer = document.getElementById('savedRecipesContainer');
  
  if (savedRecipesContainer) {
    mostrarRecetasGuardadas();
  }
}

// ===== recetas en perfil (modificado YA NO LE MUEVAAAN)=====
function mostrarRecetasGuardadas() {
  const savedRecipesContainer = document.getElementById('savedRecipesContainer');
  
  if (!savedRecipesContainer) {
    console.error("❌ Contenedor de recetas guardadas no encontrado");
    return;
  }

  const recetasGuardadas = obtenerRecetasGuardadas();

  if (recetasGuardadas.length === 0) {
    savedRecipesContainer.innerHTML = `
      <div class="no-saved">
        <i class="bi bi-bookmark-heart"></i>
        <h3>No tienes recetas guardadas</h3>
        <p>Ve a <a href="home.html">home.html</a> y guarda tus recetas favoritas.</p>
      </div>
    `;
    return;
  }

  savedRecipesContainer.innerHTML = '';

  recetasGuardadas.forEach((receta) => {
    const card = document.createElement('div');
    card.classList.add('saved-card');
    
    const tituloEscapado = escapeHTML(receta.title);
    const ingredientesEscapados = escapeHTML(receta.ingredients);
    const tituloData = escapeHTML(receta.title);
    
    card.innerHTML = `
      <div class="card-content">
        <h4>${tituloEscapado}</h4>
        <p class="ingredientes-preview">${ingredientesEscapados.substring(0, 100)}${ingredientesEscapados.length > 100 ? '...' : ''}</p>
        <button class="btn-eliminar" data-titulo="${tituloData}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </div>
    `;

    savedRecipesContainer.appendChild(card);
  });

  // Agregar event listeners a los botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
      const titulo = this.getAttribute('data-titulo');
      if (confirm(`¿Estás seguro de que quieres eliminar "${titulo}" de tus guardados?`)) {
        if (eliminarReceta(titulo)) {
          showAlert('Receta eliminada de guardados', 'success');
          mostrarRecetasGuardadas();
        }
      }
    });
  });
}

// ===== FUNCIONES UTILITARIAS =====
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showAlert(message, type = 'info') {
  // Crear alerta temporal
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
  `;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Auto-eliminar después de 4 segundos
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 4000);
}

// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 LIMÓN & SAL - Inicializando aplicación...");
  
  // Inicializar componentes según la página
  initializeMenu();
  initializeSearch();
  
  // Solo inicializar auth si estamos en index.html
  if (window.location.pathname.includes('index.html')) {
    initializeAuth();
  }
  
  // Inicializar página de usuario si es necesario
  if (window.location.pathname.includes('user.html')) {
    initializeUserPage();
  }
  
  // Inicializar página de resultados si es necesario
  if (window.location.pathname.includes('results.html')) {
    const termino = obtenerTerminoBusqueda();
    if (!termino) {
      const recipesContainer = document.getElementById("recipesContainer");
      if (recipesContainer) {
        recipesContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="bi bi-search" style="font-size: 4rem; color: #ccc;"></i>
            <h4 class="mt-3">Busca una receta</h4>
            <p class="text-muted">Ingresa un término en la barra de búsqueda</p>
            <a href="home.html" class="btn btn-primary mt-3">
              <i class="bi bi-house"></i> Volver al inicio
            </a>
          </div>
        `;
      }
    }
  }

  console.log("✅ Aplicación inicializada correctamente");
});

// ===== CARRUSEL AUTOMÁTICO =====
function initializeCarousel() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const slides = document.querySelectorAll('.hero-image');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  
  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  }
  
  // Auto-avance cada 5 segundos
  setInterval(() => showSlide(currentSlide + 1), 5000);
}


// Inicializar carrusel si existe
document.addEventListener('DOMContentLoaded', initializeCarousel);