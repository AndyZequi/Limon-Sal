//Ninja API
const API = "https://api.api-ninjas.com/v1/recipe"
const API_KEY = "H3C3LxDAjAjzPO5h+AQ1aw==ElDXRgZHc1kB9Vxt"

// ===== CARRUSEL =====
document.addEventListener('DOMContentLoaded', function() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const carouselImages = document.querySelectorAll('.hero-image');
  let currentIndex = 0;

  // Función para mostrar imagen específica
  function showImage(index) {
    carouselImages.forEach((img, i) => {
      img.classList.remove('active');
      if (i === index) {
        img.classList.add('active');
      }
    });
  }

  // Botón anterior
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
      showImage(currentIndex);
    });
  }

  // Botón siguiente
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % carouselImages.length;
      showImage(currentIndex);
    });
  }

  // Auto-play (opcional - cada 5 segundos)
  setInterval(function() {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    showImage(currentIndex);
  }, 5000);

  // ===== CATEGORÍAS - Click handlers =====
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      const categoryTitle = this.querySelector('.category-title').textContent;
      console.log('Categoría seleccionada:', categoryTitle);
      // Aquí puedes agregar la lógica para navegar a la página de categoría
      // window.location.href = `category.html?name=${encodeURIComponent(categoryTitle)}`;
    });
  });

  // ===== BÚSQUEDA =====
  const searchInput = document.querySelector('.search-input');
  const searchIcon = document.querySelector('.search-icon');

  if (searchIcon) {
    searchIcon.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (query) {
        console.log('Buscando receta:', query);
        // Aquí puedes agregar la lógica de búsqueda con la API
        // searchRecipe(query);
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          console.log('Buscando receta:', query);
          // Aquí puedes agregar la lógica de búsqueda con la API
          // searchRecipe(query);
        }
      }
    });
  }

  // ===== BOTONES DE AUTENTICACIÓN =====
  const loginBtn = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');

  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = 'login.html';
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      // Por ahora redirige al login, después puedes crear register.html
      window.location.href = 'login.html';
    });
  }

  // ===== MENÚ HAMBURGUESA =====
  const menuBtn = document.querySelector('.btn-menu');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      console.log('Abrir menú de navegación');
      // Aquí puedes agregar la lógica para abrir un menú lateral
    });
  }

  // ===== ICONO DE USUARIO =====
  const userIcon = document.querySelector('.user-icon');
  
  if (userIcon) {
    userIcon.addEventListener('click', function() {
      console.log('Abrir perfil de usuario');
      // Aquí puedes agregar un menú desplegable o ir al perfil
      // window.location.href = 'profile.html';
    });
  }
});

// ===== FUNCIÓN PARA BUSCAR RECETAS (usando la API) =====
async function searchRecipe(query) {
  try {
    const response = await fetch(`${API}?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Resultados:', data);
      // Aquí puedes procesar y mostrar los resultados
    } else {
      console.error('Error en la búsqueda:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
