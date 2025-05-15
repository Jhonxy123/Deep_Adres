document.getElementById('logoutbtn').addEventListener("click", (e) => {
    
    // Elimina la cookie JWT correctamente
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirige al inicio
    window.location.href = "/index.html";
});