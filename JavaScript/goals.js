const cards = document.querySelectorAll('.goals-card');
    cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
});