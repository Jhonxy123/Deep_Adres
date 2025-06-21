document.addEventListener('DOMContentLoaded', function() {
    // Animación para las tarjetas al cargar
    const cards = document.querySelectorAll('.section-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 * index);
    });
    
    // Animación para los elementos de resumen
    const summaryItems = document.querySelectorAll('.summary-item');
    summaryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 300 + (index * 100));
    });
});