function clear() {
    const container = document.getElementsByClassName('container')[0];
    while (container.firstChild)
        container.removeChild(container.firstChild);
}

function clearPage() {
    const page = document.getElementsByClassName('page')[0];
    while (page.firstChild)
        page.removeChild(page.firstChild);
}

function updateCard(id) {
    const nameInput = document.getElementsByClassName('input')[0];
    const descInput = document.getElementsByClassName('input')[1];

console.log(nameInput.value)

    const name = nameInput.value;
    const desc = descInput.value;

    axios({
        method: 'put',
        url: `http://localhost:3002/id/${id}`,
        data: { name, desc }
    }).then(() => clearPage())
      .then(() => returnPage());
}

function renderNewPage(cardData) {
    const cardForm = document.createElement('form');
    cardForm.classList.add("card-form")

    const cardImage = new Image();
    cardImage.src = new URL(cardData.image);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    const nameLabel = document.createElement('b');
    nameLabel.innerText = 'Name: ';
    
    const nameInput = document.createElement('input')
    nameInput.value = cardData.name;
    nameInput.className = 'input';

    const descLabel = document.createElement('b');
    descLabel.innerText = 'Description: ';

    const descInput = document.createElement('input');
    descInput.value = cardData.description;
    descInput.className = 'input';

    infoContainer.append(nameLabel, nameInput, descLabel, descInput);

    const sendButton = document.createElement('div');
    sendButton.className = 'send-button';
    sendButton.innerText = 'Update';
    sendButton.addEventListener('click', updateCard.bind(this, cardData.id));

    const page = document.getElementsByClassName('page')[0];
    cardForm.append(cardImage, infoContainer, sendButton);
    page.appendChild(cardForm);
    page.className = 'page-alter';
}

function getCardData(id) {
    axios.get(`http://localhost:3002/id/${id}`)
        .then((response) => renderNewPage(response.data))
}

function returnPage() {
    const page = document.getElementsByClassName('page-alter')[0];
    page.className = 'page';

    let header = document.createElement('h1');
    header.innerText = 'Lorem cardsum';

    let container = document.createElement('div');
    container.classList.add('container');

    page.append(header, container);
    getCards(container);
}

function renderDescription(id) {
    clearPage();
    getCardData(id);
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
        //description.addEventListener('click', renderDescription.bind(this, card.id));

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