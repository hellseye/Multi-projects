const lists = document.querySelectorAll('.board .list');
const cards = document.querySelectorAll('.board .list .card');

// Make cards draggable
cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
        card.classList.add('active');
    });
    
    card.addEventListener('dragend', (e) => {
        card.classList.remove('active');
        lists.forEach(list => list.classList.remove('over'));
    });
});

// Handle drag over lists
lists.forEach(list => {
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        list.classList.add('over');
    });
    
    list.addEventListener('dragleave', () => {
        list.classList.remove('over');
    });
    
    list.addEventListener('drop', (e) => {
        e.preventDefault();
        const activeCard = document.querySelector('.card.active');
        if (activeCard) {
            list.appendChild(activeCard);
        }
        list.classList.remove('over');
    });
});