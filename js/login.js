// Manejo del formulario de login
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Validación básica
      if (email && password) {
        console.log('Intentando iniciar sesión con:', email);
        
        // Aquí iría la lógica de autenticación real
        // Por ahora, simulamos un login exitoso
        alert('¡Login exitoso! Redirigiendo...');
        
        // Redirigir a la página principal
        window.location.href = 'index.html';
      } else {
        alert('Por favor completa todos los campos');
      }
    });
  }

  // Manejo del enlace de "Forgot password"
  const forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Funcionalidad de recuperación de contraseña próximamente...');
    });
  }
});

