document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('botao-pesquisar').addEventListener('click', function() {
    const campoPesquisa = document.getElementById('campo-pesquisa').value;
    buscarAlunos(campoPesquisa);
  });
});

function buscarAlunos(campoPesquisa) {
  fetch('http://localhost:3000/alunos')
    .then(response => response.json())
    .then(data => {
      const tabela = document.getElementById('tabela-alunos').getElementsByTagName('tbody')[0];
      tabela.innerHTML = ''; // Limpar a tabela antes de adicionar novos alunos
      data.forEach(aluno => {
        if (aluno.nome.includes(campoPesquisa) || aluno.telefone.includes(campoPesquisa) || aluno.cpf.includes(campoPesquisa)) {
          const linha = tabela.insertRow();
          linha.innerHTML = `<td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.telefone}</td>
            <td>${aluno.cpf}</td>
            <td>${aluno.email}</td>
            <td>
              <button onclick="editarAluno(${aluno.id})">Editar</button>
              <button onclick="deletarAluno(${aluno.id})">Deletar</button>
            </td>`;
        }
      });
    });
}

function criarAluno() {
  const nome = document.getElementById('nome-aluno').value;
  const telefone = document.getElementById('telefone-aluno').value;
  const cpf = document.getElementById('cpf-aluno').value;
  const email = document.getElementById('email-aluno').value;

  // Validar campos obrigatórios
  if (!nome || !telefone || !cpf || !email) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos os campos (nome, telefone, cpf, email) são obrigatórios.',
      confirmButtonColor: '#08295e' // Cor do botão OK
    });
    return;
  }

  fetch('http://localhost:3000/alunos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, telefone, cpf, email })
  })
  .then(response => response.json())
  .then(data => {
    buscarAlunos(); // Atualizar a lista de alunos
    document.getElementById('nome-aluno').value = ''; // Limpar os campos de entrada
    document.getElementById('telefone-aluno').value = '';
    document.getElementById('cpf-aluno').value = '';
    document.getElementById('email-aluno').value = '';
    Swal.fire({
      title: 'Sucesso!',
      text: 'Aluno adicionado com sucesso!',
      icon: 'success',
      confirmButtonColor: '#08295e' // Cor do botão OK
    });
  });
}

async function editarAluno(id) {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Aluno',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Nome">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Telefone">' +
      '<input id="swal-input3" class="swal2-input" placeholder="CPF">' +
      '<input id="swal-input4" class="swal2-input" placeholder="Email">',
    focusConfirm: false,
    confirmButtonColor: '#08295e', // Cor do botão OK
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value,
        document.getElementById('swal-input4').value
      ]
    }
  })

  if (formValues) {
    const [novoNome, novoTelefone, novoCPF, novoEmail] = formValues;
    fetch(`http://localhost:3000/alunos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome: novoNome, telefone: novoTelefone, cpf: novoCPF, email: novoEmail })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na edição do aluno');
      }
      return response.json();
    })
    .then(data => {
      buscarAlunos(); // Atualizar a lista de alunos
      Swal.fire({
        title: 'Sucesso!',
        text: 'Aluno editado com sucesso!',
        icon: 'success',
        confirmButtonColor: '#08295e' // Cor do botão OK
      });
    })
    .catch(error => {
      Swal.fire({
        title: 'Erro!',
        text: 'Aluno não editado!',
        icon: 'error',
        confirmButtonColor: '#08295e' // Cor do botão OK
      });
    });
  }
}

function deletarAluno(id) {
  Swal.fire({
    title: 'Você tem certeza que deseja excluir esse aluno?',
    text: "Você não poderá reverter isso!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#08295e',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim!',
    cancelButtonText: 'Cancelar' // Adicione esta linha
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/alunos/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        buscarAlunos(); // Atualizar a lista de alunos
      });
    }
  });
}