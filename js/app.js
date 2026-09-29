// Os dados ficam apenas na memória.
// Se a página for atualizada, eles serão apagados.
const pratos = [];
const pedido = [];

const app = document.querySelector("#app");
const botoesMenu = document.querySelectorAll("nav button");

function marcarMenuAtivo(rota) {
  botoesMenu.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.rota === rota);
  });
}

function irPara(rota) {
  marcarMenuAtivo(rota);

  if (rota === "inicio") mostrarInicio();
  if (rota === "cadastro") mostrarCadastro();
  if (rota === "lista") mostrarCardapio();
  if (rota === "sobre") mostrarSobre();
}

function mostrarInicio() {
  app.innerHTML = `
    <h1>Cardápio do Restaurante</h1>
    <p>
      Este é um exemplo simples de SPA feita com HTML, CSS e JavaScript.
      A navegação acontece sem recarregar a página.
    </p>

    <p>
      Os pratos cadastrados e os itens do pedido ficam temporariamente guardados em arrays JavaScript.
    </p>

    <div class="contador">
      Pratos cadastrados nesta sessão: <strong>${pratos.length}</strong>
    </div>

    <div class="acoes">
      <button class="botao" id="btnCadastrar">Cadastrar prato</button>
      <button class="botao secundario" id="btnVerCardapio">Ver cardápio</button>
    </div>
  `;

  document.querySelector("#btnCadastrar")
    .addEventListener("click", () => irPara("cadastro"));

  document.querySelector("#btnVerCardapio")
    .addEventListener("click", () => irPara("lista"));
}

function mostrarCadastro() {
  app.innerHTML = `
    <h1>Cadastrar Prato</h1>

    <form id="formPrato">
      <div class="campo">
        <label for="nome">Nome do prato</label>
        <input id="nome" type="text" placeholder="Digite o nome do prato" required />
      </div>

      <div class="campo">
        <label for="categoria">Categoria</label>
        <input id="categoria" type="text" placeholder="Ex: Entrada, Prato principal, Sobremesa" required />
      </div>

      <div class="campo">
        <label for="preco">Preço (R$)</label>
        <input id="preco" type="number" step="0.01" min="0" placeholder="Digite o preço" required />
      </div>

      <button class="botao" type="submit">Salvar prato</button>
      <div id="mensagem"></div>
    </form>
  `;

  document.querySelector("#formPrato").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const categoria = document.querySelector("#categoria").value.trim();
    const preco = Number(document.querySelector("#preco").value);

    pratos.push({
      nome,
      categoria,
      preco
    });

    document.querySelector("#mensagem").innerHTML =
      `<div class="mensagem">Prato cadastrado com sucesso.</div>`;

    evento.target.reset();
  });
}

function mostrarCardapio() {
  app.innerHTML = `
    <h1>Cardápio</h1>
    <p>Estas tabelas são criadas dinamicamente pelo JavaScript a partir dos arrays de pratos e do pedido.</p>
    <div id="conteudoCardapio"></div>

    <h2>Meu Pedido</h2>
    <div id="conteudoPedido"></div>
  `;

  renderizarCardapio();
  renderizarPedido();
}

function renderizarCardapio() {
  const conteudo = document.querySelector("#conteudoCardapio");

  if (pratos.length === 0) {
    conteudo.innerHTML = `
      <div class="vazio">
        Nenhum prato cadastrado ainda.
      </div>
    `;
    return;
  }

  let linhas = "";

  pratos.forEach((prato, indice) => {
    linhas += `
      <tr>
        <td>${prato.nome}</td>
        <td>${prato.categoria}</td>
        <td>R$ ${prato.preco.toFixed(2)}</td>
        <td>
          <button class="adicionar" data-indice="${indice}">Adicionar ao pedido</button>
        </td>
      </tr>
    `;
  });

  conteudo.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Prato</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${linhas}
      </tbody>
    </table>
  `;

  document.querySelectorAll(".adicionar").forEach(botao => {
    botao.addEventListener("click", function() {
      const indice = Number(this.dataset.indice);
      const prato = pratos[indice];

      const itemExistente = pedido.find(item => item.nome === prato.nome);

      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        pedido.push({
          nome: prato.nome,
          preco: prato.preco,
          quantidade: 1
        });
      }

      renderizarPedido();
    });
  });
}

function renderizarPedido() {
  const conteudo = document.querySelector("#conteudoPedido");

  if (pedido.length === 0) {
    conteudo.innerHTML = `
      <div class="vazio">
        Nenhum item adicionado ao pedido ainda.
      </div>
    `;
    return;
  }

  let linhas = "";
  let total = 0;

  pedido.forEach((item, indice) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    linhas += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${subtotal.toFixed(2)}</td>
        <td>
          <button class="remover" data-indice="${indice}">Remover</button>
        </td>
      </tr>
    `;
  });

  conteudo.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Prato</th>
          <th>Qtd.</th>
          <th>Subtotal</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${linhas}
      </tbody>
    </table>
    <div class="total">Total do pedido: R$ ${total.toFixed(2)}</div>
  `;

  document.querySelectorAll(".remover").forEach(botao => {
    botao.addEventListener("click", function() {
      const indice = Number(this.dataset.indice);
      pedido.splice(indice, 1);
      renderizarPedido();
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o projeto</h1>
    <p>
      Este exemplo foi criado para demonstrar uma Single Page Application simples.
    </p>
    <p>
      Existe apenas um arquivo HTML. Ao clicar nas opções do menu,
      o JavaScript modifica o conteúdo do elemento <strong>#app</strong>.
    </p>
    <p>
      O projeto também demonstra cadastro em array, manipulação do DOM,
      eventos de clique, envio de formulário, listagem e a ação de
      adicionar/remover itens de um pedido.
    </p>
  `;
}

botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => {
    irPara(botao.dataset.rota);
  });
});

mostrarInicio();
