document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value; // <-- Faltaba capturar el correo
    const cedula = document.getElementById('cedula').value;
    const contrasena = document.getElementById('contrasena').value;
    const comprobar_contrasena = document.getElementById('confirmar_contrasena').value; // <-- Corregido ID
  
    try {
      const res = await fetch('/registro', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json" // <-- Corregido typo "aplication/json"
        },
        body: JSON.stringify({
          nombre,
          correo, // <-- Incluir correo
          cedula,
          contrasena,
          confirmar_contrasena: comprobar_contrasena // <-- Nombre consistente con backend
        })
      });
  
      const data = await res.json();
      
      if (res.ok) {
        window.location.href = '/login.html'; // Redirigir si es exitoso
      } else {
        alert(data.error || 'Error en el registro'); // Mostrar error
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });