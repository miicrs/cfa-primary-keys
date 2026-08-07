// Bank selection selecting 
const cards = document.querySelectorAll('.bank-card, .other-card');
    cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
});
