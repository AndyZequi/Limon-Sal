// Script para cargar y mostrar recetas guardadas en user.html

function obtenerRecetasGuardadas() {
  try {
    return JSON.parse(localStorage.getItem('recetasGuardadas')) || [];
  } catch (error) {
    console.error("Error al obtener recetas guardadas:", error);
    return [];
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

function obtenerImagenPorCategoria(titulo, ingredientes) {
  // Intentar determinar la categoría basándose en ingredientes o título
  const texto = (titulo + ' ' + ingredientes).toLowerCase();
  
  if (texto.includes('gallina') || texto.includes('pollo') || texto.includes('ave')) {
    return 'images/gallina.png';
  } else if (texto.includes('carne') || texto.includes('bife') || texto.includes('res')) {
    return 'images/bife.png';
  } else if (texto.includes('sopa') || texto.includes('crema') || texto.includes('caldo')) {
    return 'images/sopa.png';
  } else if (texto.includes('verdura') || texto.includes('ensalada') || texto.includes('vegetal')) {
    return 'images/verduras.png';
  } else if (texto.includes('postre') || texto.includes('dulce') || texto.includes('torta') || texto.includes('tarta')) {
    return 'images/postres.png';
  } else if (texto.includes('bebida') || texto.includes('jugo') || texto.includes('coctel') || texto.includes('cocktail')) {
    return 'images/bebidas.png';
  } else {
    // Imagen por defecto
    return 'images/bife.png';
  }
}

function mostrarRecetasGuardadas() {
  const cardsContainer = document.querySelector('.saved .cards');
  if (!cardsContainer) {
    console.error("No se encontró el contenedor de recetas guardadas");
    return;
  }

  const recetasGuardadas = obtenerRecetasGuardadas();

  if (recetasGuardadas.length === 0) {
    cardsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: var(--white);">
        <p>No tienes recetas guardadas todavía.</p>
        <p>Ve a <a href="home.html" style="color: var(--mint); text-decoration: underline;">home.html</a> y guarda tus recetas favoritas.</p>
      </div>
    `;
    return;
  }

  cardsContainer.innerHTML = "";

  recetasGuardadas.forEach((receta) => {
    const card = document.createElement('article');
    card.classList.add('card');
    
    const imagenSrc = obtenerImagenPorCategoria(receta.title, receta.ingredients);
    
    // Escapar HTML para seguridad
    const tituloEscapado = receta.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const ingredientesEscapados = receta.ingredients.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tituloData = receta.title.replace(/"/g, '&quot;');
    
    card.innerHTML = `
      <img src="${imagenSrc}" alt="${tituloEscapado}" onerror="this.src='images/bife.png'">
      <div class="card-content">
        <h4>${tituloEscapado}</h4>
        <p class="ingredientes-preview">${ingredientesEscapados.substring(0, 100)}${ingredientesEscapados.length > 100 ? '...' : ''}</p>
        <button class="btn-eliminar" data-titulo="${tituloData}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </div>
    `;

    cardsContainer.appendChild(card);
  });

  // Agregar event listeners a los botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
      const titulo = this.getAttribute('data-titulo');
      if (confirm(`¿Estás seguro de que quieres eliminar "${titulo}" de tus guardados?`)) {
        if (eliminarReceta(titulo)) {
          alert('Receta eliminada de guardados');
          mostrarRecetasGuardadas(); // Recargar la lista
        }
      }
    });
  });
}

// Cargar recetas guardadas cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  mostrarRecetasGuardadas();
});

