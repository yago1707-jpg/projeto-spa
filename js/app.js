// Os dados ficam apenas na memória.
// Se a página for atualizada, eles serão apagados.
// Alguns pratos já vêm pré-cadastrados só para o site não abrir vazio.
const pratos = [
  {
    nome: "Salada Caesar",
    categoria: "Entrada",
    preco: 22.90,
    imagem: "Sala_Caesar.jpg",
    descricao: "Alface fresca, croutons crocantes, lascas de parmesão e o tradicional molho Caesar."
  },
  {
    nome: "Lasanha à Bolonhesa",
    categoria: "Prato principal",
    preco: 38.50,
    imagem: "https://images.unsplash.com/photo-1673442635965-34f1b36d8944?w=600&q=80&auto=format&fit=crop",
    descricao: "Camadas de massa fresca, molho bolonhesa encorpado e muito queijo gratinado."
  },
  {
    nome: "Hambúrguer Artesanal",
    categoria: "Prato principal",
    preco: 32.00,
    imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80&auto=format&fit=crop",
    descricao: "Blend de carnes nobres, queijo derretido, picles e pão brioche tostado na manteiga."
  },
  {
    nome: "Petit Gâteau",
    categoria: "Sobremesa",
    preco: 18.00,
    imagem: "https://images.unsplash.com/photo-1650229576497-67e1369cd432?w=600&q=80&auto=format&fit=crop",
    descricao: "Bolinho de chocolate quente com recheio cremoso, servido com sorvete de creme."
  },
  {
    nome: "Suco Natural",
    categoria: "Bebida",
    preco: 9.50,
    imagem: "https://images.unsplash.com/photo-1650316710473-8b2ecdcd2b10?w=600&q=80&auto=format&fit=crop",
    descricao: "Suco feito na hora com frutas selecionadas, sem adição de açúcar."
  }
];
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

function adicionarAoPedido(indice) {
  const prato = pratos[indice];
  const itemExistente = pedido.find(item => item.nome === prato.nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    pedido.push({ nome: prato.nome, preco: prato.preco, quantidade: 1 });
  }

  renderizarPedido();
}

function mostrarDetalhes(indice) {
  const prato = pratos[indice];

  const detalhe = document.createElement("div");
  detalhe.className = "detalhe";
  detalhe.innerHTML = `
    <div class="detalhe-caixa">
      <div class="detalhe-topo" style="background-image: url('${prato.imagem}')">
        <button class="fechar" aria-label="Fechar">×</button>
      </div>
      <div class="detalhe-info">
        <span class="categoria">${prato.categoria}</span>
        <h1>${prato.nome}</h1>
        <div class="detalhe-preco">R$ ${prato.preco.toFixed(2)}</div>
        <p>${prato.descricao}</p>
        <button class="botao acento" id="btnAdicionarDetalhe">Adicionar ao pedido</button>
      </div>
    </div>
  `;

  document.body.appendChild(detalhe);

  detalhe.querySelector(".fechar").addEventListener("click", () => detalhe.remove());
  detalhe.addEventListener("click", evento => {
    if (evento.target === detalhe) detalhe.remove();
  });
  detalhe.querySelector("#btnAdicionarDetalhe").addEventListener("click", () => {
    adicionarAoPedido(indice);
    detalhe.remove();
  });
}

function mostrarInicio() {
  app.innerHTML = `
    <section class="banner">
      <div class="banner-conteudo">
        <h1>Bem-vindo ao Sabor & Cia</h1>
        <p>Confira nosso cardápio, monte seu pedido e acompanhe o total em tempo real.</p>
        <div class="acoes">
          <button class="botao acento" id="btnCadastrar">Cadastrar prato</button>
          <button class="botao" id="btnVerCardapio">Ver cardápio</button>
        </div>
      </div>
    </section>

    <div class="contador">Pratos cadastrados nesta sessão: <strong>${pratos.length}</strong></div>
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

      <div class="campo">
        <label for="descricao">Descrição</label>
        <input id="descricao" type="text" placeholder="Uma breve descrição do prato" />
      </div>

      <div class="campo">
        <label for="imagem">URL da imagem (opcional)</label>
        <input id="imagem" type="url" placeholder="Cole o link de uma imagem, se quiser" />
      </div>

      <button class="botao acento" type="submit">Salvar prato</button>
      <div id="mensagem"></div>
    </form>
  `;

  document.querySelector("#formPrato").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const categoria = document.querySelector("#categoria").value.trim();
    const preco = Number(document.querySelector("#preco").value);
    const descricao = document.querySelector("#descricao").value.trim() || "Prato preparado com ingredientes selecionados.";
    const imagemInformada = document.querySelector("#imagem").value.trim();

    const imagem = imagemInformada
      ? imagemInformada
      : "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80&auto=format&fit=crop";

    pratos.push({ nome, categoria, preco, imagem, descricao });

    document.querySelector("#mensagem").innerHTML =
      `<div class="mensagem">Prato cadastrado com sucesso.</div>`;

    evento.target.reset();
  });
}

function mostrarCardapio() {
  app.innerHTML = `
    <h1>Cardápio</h1>
    <p>Clique em um prato para ver os detalhes, ou adicione direto ao pedido.</p>
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
    conteudo.innerHTML = `<div class="vazio">Nenhum prato cadastrado ainda.</div>`;
    return;
  }

  let cartoes = "";

  pratos.forEach((prato, indice) => {
    cartoes += `
      <div class="cartao-prato" data-indice="${indice}">
        <img src="${prato.imagem}" alt="${prato.nome}" />
        <div class="cartao-conteudo">
          <span class="categoria">${prato.categoria}</span>
          <h3>${prato.nome}</h3>
          <span class="preco">R$ ${prato.preco.toFixed(2)}</span>
          <button class="adicionar" data-indice="${indice}">Adicionar ao pedido</button>
        </div>
      </div>
    `;
  });

  conteudo.innerHTML = `<div class="grade-cardapio">${cartoes}</div>`;

  document.querySelectorAll(".cartao-prato").forEach(cartao => {
    cartao.addEventListener("click", function() {
      mostrarDetalhes(Number(this.dataset.indice));
    });
  });

  document.querySelectorAll(".adicionar").forEach(botao => {
    botao.addEventListener("click", function(evento) {
      evento.stopPropagation();
      adicionarAoPedido(Number(this.dataset.indice));
    });
  });
}

function renderizarPedido() {
  const conteudo = document.querySelector("#conteudoPedido");

  if (pedido.length === 0) {
    conteudo.innerHTML = `<div class="vazio">Nenhum item adicionado ao pedido ainda.</div>`;
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
        <td><button class="remover" data-indice="${indice}">Remover</button></td>
      </tr>
    `;
  });

  conteudo.innerHTML = `
    <div class="tabela-container">
      <table>
        <thead>
          <tr><th>Prato</th><th>Qtd.</th><th>Subtotal</th><th>Ações</th></tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>
    <div class="total">Total do pedido: R$ ${total.toFixed(2)}</div>
  `;

  document.querySelectorAll(".remover").forEach(botao => {
    botao.addEventListener("click", function() {
      pedido.splice(Number(this.dataset.indice), 1);
      renderizarPedido();
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o projeto</h1>
    <p>Este exemplo foi criado para demonstrar uma Single Page Application simples.</p>
    <p>Existe apenas um arquivo HTML. Ao clicar nas opções do menu, o JavaScript modifica o conteúdo do elemento <strong>#app</strong>.</p>
    <p>O projeto também demonstra cadastro em array, manipulação do DOM, eventos de clique, envio de formulário, listagem e a ação de adicionar/remover itens de um pedido.</p>
  `;
}

botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => irPara(botao.dataset.rota));
});

mostrarInicio();
mostrarInicio();
