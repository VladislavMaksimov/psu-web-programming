function clear() {
    const container = document.getElementsByClassName('container')[0];
    while (container.firstChild)
        container.removeChild(container.firstChild);
}

function addRandomCard() {
    axios.post('http://localhost:3002/add/random')
    .then(() => {
        clear();
        const container = document.getElementsByClassName('container')[0];
        getCards(container);
    })
        
}

function getCards(container) {
    axios.get('http://localhost:3002/')
        .then((response) => {
            setCards(container, response.data);
        })
}

// Удаление карточки
function deleteCard(id) {
    axios.delete(`http://localhost:3002/id/${id}`)
        .then(() => {
            clear();
            const container = document.getElementsByClassName('container')[0];
            getCards(container);
        })
}

function setCards(container, cards) {
    Object.values(cards).map(card => {
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card-info');

        const logo = document.createElement('div');
        logo.classList.add('logo');
        logo.style.backgroundImage = "url(" + card.image +")";
        
        const name = document.createElement('h2');
        name.classList.add('name');
        name.innerText = card.name;

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const description = document.createElement('a');
        description.classList.add('description');
        description.innerText = 'Description';
        description.href = `/card/${card.id}`

        const deleteDiv = document.createElement('div');
        deleteDiv.classList.add('delete');
        deleteDiv.innerText = 'Delete';
        deleteDiv.addEventListener('click', deleteCard.bind(this, card.id));

        actions.append(description, deleteDiv);
        cardInfo.append(logo, name, actions);

        container.appendChild(cardInfo);
    });

    const addCard = document.createElement('div');
    addCard.classList.add('card-add');
    addCard.addEventListener('click', () => addRandomCard());

    const plus = document.createElement('i');
    plus.classList.add('fa', 'fa-plus-circle');

    addCard.appendChild(plus);
    container.appendChild(addCard);
}

window.addEventListener('load', function() {
    const container = document.getElementsByClassName('container')[0];
    getCards(container);  
})