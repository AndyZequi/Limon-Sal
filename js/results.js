// Script para la página de resultados
// Reutilizar funciones y configuración de app.js

//Ninja API
const API = "https://api.api-ninjas.com/v1/recipe"
const API_KEY = "H3C3LxDAjAjzPO5h+AQ1aw==ElDXRgZHc1kB9Vxt"

// Obtener el término de búsqueda de localStorage o URL
function obtenerTerminoBusqueda() {
  // Intentar obtener de localStorage primero
  const terminoLocalStorage = localStorage.getItem('terminoBusqueda');
  if (terminoLocalStorage) {
    localStorage.removeItem('terminoBusqueda'); // Limpiar después de usarlo
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

// Funciones para guardar recetas (reutilizadas)
function obtenerRecetasGuardadas() {
  try {
    return JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
  } catch (error) {
    console.error("Error al obtener recetas guardadas:", error);
    return [];
  }
}

function guardarReceta(receta) {
  try {
    let recetasGuardadas = JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
    const existe = recetasGuardadas.some(r => r.title === receta.title);
    
    if (!existe) {
      recetasGuardadas.push(receta);
      localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
      return true;
    } else {
      return false;
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

function recetaEstaGuardada(titulo) {
  const recetasGuardadas = obtenerRecetasGuardadas();
  return recetasGuardadas.some(r => r.title === titulo);
}

// Buscar recetas en la API
async function buscarRecetas(query) {
  const recipesContainer = document.getElementById("recipesContainer");
  const noResults = document.getElementById("noResults");
  const searchTerm = document.getElementById("searchTerm");
  
  if (!recipesContainer) {
    console.error("Contenedor de recetas no encontrado");
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
  
  noResults.style.display = "none";

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
    console.error("Error:", error.message);
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
  
  recipesContainer.innerHTML = "";
  noResults.style.display = "block";
}

function mostrarRecetas(recetas) {
  const recipesContainer = document.getElementById("recipesContainer");
  const noResults = document.getElementById("noResults");
  
  if (!recipesContainer) return;
  
  recipesContainer.innerHTML = "";
  noResults.style.display = "none";

  recetas.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "col-sm-6", "mb-4");

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

// Event listeners para la barra de búsqueda
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("buscarRecetas");

  // Cargar recetas si hay un término de búsqueda
  const termino = obtenerTerminoBusqueda();
  if (termino) {
    // Prellenar el input
    if (searchInput) {
      searchInput.value = termino;
    }
    buscarRecetas(termino);
  } else {
    // Si no hay término, mostrar mensaje
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

  // Event listener para el botón de búsqueda
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        // Guardar término en localStorage
        localStorage.setItem('terminoBusqueda', query);
        // Recargar para buscar
        buscarRecetas(query);
        // Actualizar el término mostrado
        const searchTerm = document.getElementById("searchTerm");
        if (searchTerm) {
          searchTerm.textContent = `Buscando: "${query}"`;
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
          // Guardar término en localStorage
          localStorage.setItem('terminoBusqueda', query);
          // Recargar para buscar
          buscarRecetas(query);
          // Actualizar el término mostrado
          const searchTerm = document.getElementById("searchTerm");
          if (searchTerm) {
            searchTerm.textContent = `Buscando: "${query}"`;
          }
        } else {
          alert("Por favor, ingresa un término de búsqueda");
        }
      }
    });
  }
});

