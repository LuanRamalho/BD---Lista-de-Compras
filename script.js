// Recuperar os dados do localStorage
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

// Função para calcular e exibir o preço total
function updateTotalPrice() {
    const totalPrice = shoppingList.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalPrice').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

// Função para renderizar a tabela
function renderTable(list = shoppingList) {
    const tableBody = document.querySelector('#shoppingListTable tbody');
    tableBody.innerHTML = ''; // Limpa o conteúdo anterior da tabela

    list.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        
        const priceCell = document.createElement('td');
        priceCell.textContent = `R$ ${item.price.toFixed(2)}`;
        
        const actionsCell = document.createElement('td');

        // Botão de Editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => editItem(index));

        // Botão de Adicionar Nota
        const noteBtn = document.createElement('button');
        noteBtn.textContent = 'Nota';
        noteBtn.addEventListener('click', () => showNoteInput(index));

        // Botão de Excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => deleteItem(index));

        // Adicionar botões à célula de ações
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(noteBtn);
        actionsCell.appendChild(deleteBtn);

        // Linha com os dados e ações
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(actionsCell);

        // Adicionar textarea para a nota, se necessário
        if (item.showNote) {
            const noteTextarea = document.createElement('textarea');
            noteTextarea.value = item.note || '';
            noteTextarea.dataset.index = index; // Atribui um índice ao textarea para facilitar a busca
            noteTextarea.addEventListener('input', () => saveNote());
            document.querySelector('.notes-container').appendChild(noteTextarea);
        }

        tableBody.appendChild(row); // Adiciona a linha à tabela
    });

    updateTotalPrice(); // Atualiza o preço total após renderizar a tabela
}

// Função para adicionar um novo item à lista
function addItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);

    if (itemName && !isNaN(itemPrice)) {
        const newItem = { name: itemName, price: itemPrice, note: '', showNote: false };
        shoppingList.push(newItem);

        // Salvar no localStorage
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));

        // Renderizar a tabela
        renderTable();

        // Limpar os campos de entrada
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
    } else {
        alert('Por favor, insira um nome e um preço válidos.');
    }
}

// Função para editar um item
function editItem(index) {
    const itemName = prompt('Editar nome do item:', shoppingList[index].name);
    const itemPrice = parseFloat(prompt('Editar preço do item:', shoppingList[index].price));

    if (itemName && !isNaN(itemPrice)) {
        shoppingList[index].name = itemName;
        shoppingList[index].price = itemPrice;

        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        renderTable();
    } else {
        alert('Valores inválidos.');
    }
}

// Função para mostrar o textarea para nota
function showNoteInput(index) {
    // Primeiro, esconder os outros textareas
    document.querySelectorAll('.notes-container textarea').forEach(textarea => {
        textarea.style.display = 'none';
    });

    // Mostrar o textarea correspondente
    const existingTextarea = document.querySelector(`textarea[data-index="${index}"]`);
    if (existingTextarea) {
        existingTextarea.style.display = 'block';
    } else {
        const newTextarea = document.createElement('textarea');
        newTextarea.value = shoppingList[index].note || '';
        newTextarea.dataset.index = index;
        newTextarea.style.display = 'block';
        newTextarea.addEventListener('input', () => saveNote());
        document.querySelector('.notes-container').appendChild(newTextarea);
    }
}

// Função para salvar a nota
function saveNote() {
    const textareas = document.querySelectorAll('.notes-container textarea');
    textareas.forEach(textarea => {
        const index = textarea.dataset.index;
        shoppingList[index].note = textarea.value;
    });
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Função para excluir um item
function deleteItem(index) {
    shoppingList.splice(index, 1);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    renderTable();
}

// Função de busca
function searchItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredList = shoppingList.filter(item =>
        item.name.toLowerCase().includes(searchInput) ||
        item.price.toFixed(2).includes(searchInput)
    );
    renderTable(filteredList);
}

// Funções de ordenação
function sortByNameAsc() {
    shoppingList.sort((a, b) => a.name.localeCompare(b.name));
    renderTable();
}

function sortByNameDesc() {
    shoppingList.sort((a, b) => b.name.localeCompare(a.name));
    renderTable();
}

function sortByPriceAsc() {
    shoppingList.sort((a, b) => a.price - b.price);
    renderTable();
}

function sortByPriceDesc() {
    shoppingList.sort((a, b) => b.price - a.price);
    renderTable();
}

// Adicionar eventos
document.getElementById('addItemBtn').addEventListener('click', addItem);
document.getElementById('searchInput').addEventListener('input', searchItems);
document.getElementById('sortNameAscBtn').addEventListener('click', sortByNameAsc);
document.getElementById('sortNameDescBtn').addEventListener('click', sortByNameDesc);
document.getElementById('sortPriceAscBtn').addEventListener('click', sortByPriceAsc);
document.getElementById('sortPriceDescBtn').addEventListener('click', sortByPriceDesc);

// Salvar notas quando o usuário sai da página
window.addEventListener('beforeunload', saveNote);

// Renderizar a tabela ao carregar a página
renderTable();
