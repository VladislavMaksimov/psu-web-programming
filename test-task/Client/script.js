function getCards(container) {
    axios.get('http://localhost:3002/')
        .then((response) => {
            console.log(response)
            setCards(container, response.data);
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

        actions.append(description, deleteDiv);
        cardInfo.append(logo, name, actions);

        container.appendChild(cardInfo);
    });

    const addCard = document.createElement('div');
    addCard.classList.add('card-add');

    const plus = document.createElement('i');
    plus.classList.add('fa', 'fa-plus-circle');

    addCard.appendChild(plus);
    container.appendChild(addCard);
}

window.addEventListener('load', function() {
    const container = document.getElementsByClassName('container')[0];
    getCards(container);    
})