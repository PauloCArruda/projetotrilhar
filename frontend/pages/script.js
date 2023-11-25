document.addEventListener('DOMContentLoaded', buscarItens);

function buscarItens() {
  fetch('http://localhost:3000/itens')
    .then(response => response.json())
    .then(data => {
      const tabela = document.getElementById('tabela-itens').getElementsByTagName('tbody')[0];
      tabela.innerHTML = ''; // Limpar a tabela antes de adicionar novos itens
      data.forEach(item => {
        const linha = tabela.insertRow();
        linha.innerHTML = `<td>${item.id}</td><td>${item.nome}</td>
          <td><button onclick="editarItem(${item.id})">Editar</button>
          <button onclick="deletarItem(${item.id})">Deletar</button></td>`;
      });
    });
}

function criarItem() {
  const nome = document.getElementById('nome-item').value;
  fetch('http://localhost:3000/itens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome })
  })
  .then(response => response.json())
  .then(data => {
    buscarItens(); // Atualizar a lista de itens
    document.getElementById('nome-item').value = ''; // Limpar o campo de entrada
  });
}

function editarItem(id) {
  const nome = prompt('Insira o novo nome para o item:');
  fetch(`http://localhost:3000/itens/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome })
  })
  .then(response => response.json())
  .then(data => {
    buscarItens(); // Atualizar a lista de itens
  });
}

function deletarItem(id) {
  fetch(`http://localhost:3000/itens/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    buscarItens(); // Atualizar a lista de itens
  });
}
