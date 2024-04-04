let menu = document.querySelector('.ri-apps-line')
let navbar = document.querySelector('.navbar')

menu.onclick = () => {
    navbar.classList.toggle('open')
}

//  _______________________________________________________

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('myForm');
    const tableBody = document.querySelector('.listaDespesas');

    function saveData(vencimento, fornecedor, descricao, valor, situacao) {
        let data = localStorage.getItem('formData');
        if (!data) {
            data = [];
        } else {
            data = JSON.parse(data);
        }
        data.push({vencimento, fornecedor, descricao, valor, situacao });
        localStorage.setItem('formData', JSON.stringify(data));
    }

    // Função para exibir os dados na tabela
    function displayData() {
        listaDespesas.innerHTML = '';
        let data = localStorage.getItem('formData');
        if (data) {
            data = JSON.parse(data);
            data.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'saved-row'
                row.innerHTML = `<td>${item.vencimento}</td><td>${item.fornecedor}</td><td>${item.descricao}</td><td>${item.valor}</td><td>${item.situacao}</td>`;
                listaDespesas.appendChild(row);
            });
        }
    }

    // Exibir dados salvos ao carregar a página
    displayData();

    // Lidar com o envio do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const vencimento = document.getElementById('vencimento').value.trim();
        const fornecedor = document.getElementById('fornecedor').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const valor = document.getElementById('valor').value.trim();
        const situacao = document.getElementById('situacao').value.trim();
        if (vencimento && fornecedor && descricao && valor && situacao) {
            saveData(vencimento, fornecedor, descricao, valor, situacao);
            displayData();
            form.reset();
        } else {
            alert('Por favor, preencha todos os campos');
        }
    });
});
