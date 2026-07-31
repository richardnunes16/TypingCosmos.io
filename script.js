const palavras = [
"tecnologia", "computador", "programação", "javascript", "algoritmo", "desenvolvimento", "interface", "servidor", "framework", "biblioteca",
"aplicativo", "navegador", "monitor", "teclado", "processador", "memória", "internet", "protocolo", "database", "documento",
"pesquisa", "conhecimento", "criatividade", "aprendizado", "experiência", "responsabilidade", "oportunidade", "persistência", "dedicação", "transformação",
"organização", "planejamento", "estratégia", "objetivo", "resultado", "desempenho", "qualidade", "progresso", "competência", "habilidade",
"eficiência", "produtividade", "liderança", "comunicação", "colaboração", "solução", "problema", "desafio", "conquista", "inovação",
"digital", "virtual", "sistema", "arquivo", "código", "comando", "função", "variável", "constante", "estrutura",
"repetição", "condição", "execução", "compilador", "terminal", "conexão", "segurança", "criptografia", "autenticação", "permissão",
"usuário", "cadastro", "mensagem", "conteúdo", "plataforma", "ferramenta", "projeto", "empresa", "mercado", "indústria",
"profissão", "carreira", "contrato", "documentação", "engenharia", "laboratório", "cientista", "universidade", "estudante", "professor",
"biblioteca", "caderno", "caneta", "mochila", "calculadora", "experimento", "fórmula", "equação", "estatística", "geometria",
"matemática", "física", "química", "biologia", "astronomia", "planeta", "galáxia", "universo", "asteroide", "cometa",
"foguete", "astronauta", "gravidade", "atmosfera", "continente", "montanha", "cachoeira", "floresta", "natureza", "oceano",
"correnteza", "tempestade", "primavera", "inverno", "horizonte", "paisagem", "aventura", "exploração", "descoberta", "viagem",
"passagem", "aeroporto", "bicicleta", "motocicleta", "caminhão", "automóvel", "rodovia", "estacionamento", "semáforo", "combustível",
"garagem", "oficina", "mercadoria", "comércio", "restaurante", "padaria", "supermercado", "hospital", "farmácia", "academia",
"parque", "jardim", "praça", "condomínio", "apartamento", "escritório", "cozinha", "banheiro", "corredor", "janela",
"cortina", "espelho", "geladeira", "micro-ondas", "televisão", "ventilador", "aspirador", "cafeteira", "liquidificador", "refrigerante",
"chocolate", "sanduíche", "macarrão", "hambúrguer", "morango", "abacaxi", "laranja", "melancia", "abóbora", "cenoura",
"pepino", "tomate", "cebola", "alface", "espinafre", "amendoim", "castanha", "biscoito", "pipoca", "sorvete",
"camiseta", "bermuda", "jaqueta", "sapato", "tênis", "meias", "moletom", "gravata", "capacete", "guarda-chuva",
"fotografia", "desenho", "escultura", "arquitetura", "literatura", "romance", "personagem", "capítulo", "parágrafo", "diálogo",
"aventureiro", "guerreiro", "castelo", "dragão", "espada", "armadura", "escudo", "feiticeiro", "magia", "portal",
"labirinto", "cristal", "diamante", "tesouro", "recompensa", "campeonato", "competição", "jogador", "treinamento", "velocidade",
"resistência", "vencedor", "medalha", "troféu", "basquete", "voleibol", "natação", "atletismo", "xadrez", "corrida",
"futebol", "motocross", "disciplina", "motivação", "inspiração", "equilíbrio", "concentração", "atenção", "evolução", "crescimento"
];

const elementos = {
  botoesTempo: Array.from(document.querySelectorAll('.btn-tempo')),
  painelTempo: document.querySelector('.painel-estatisticas .estatistica:nth-child(1) b'),
  painelWpm: document.querySelector('.painel-estatisticas .estatistica:nth-child(2) b'),
  painelPrecisao: document.querySelector('.painel-estatisticas .estatistica:nth-child(3) b'),
  textoDigitacao: document.querySelector('.texto-digitacao'),
  campoDigitacao: document.querySelector('.entrada-digitacao'),
  painelResultados: document.querySelector('.painel-resultados'),
  valorWpm: document.querySelector('.resultado-ppm .valor'),
  valorPrecisao: document.querySelector('.resultado-precisao .porcentagem'),
  detalhesResultados: document.querySelector('.detalhes-resultados'),
  botaoReiniciar: document.querySelector('.btn-reiniciar'),
  dica: document.querySelector('.dica')
};

const estado = {
  tempoSelecionado: 30,
  tempoRestante: 30,
  rodando: false,
  timer: null,
  textoAtual: '',
  textoDigitado: '',
  acertos: 0,
  erros: 0,
  concluido: false,
  inicio: null,
  historicoTextos: [],
  textoIndex: 0,
  scrollPos: 0
};

function gerarTextoComPalavras(quantidade = 50) {
  const palavrasSelecionadas = [];
  for (let i = 0; i < quantidade; i++) {
    const indice = Math.floor(Math.random() * palavras.length);
    palavrasSelecionadas.push(palavras[indice]);
  }
  return palavrasSelecionadas.join(' ');
}

function adicionarNovoTexto() {
  const novoTexto = gerarTextoComPalavras(50);
  estado.historicoTextos.push(novoTexto);
  estado.textoIndex = estado.historicoTextos.length - 1;
  estado.textoAtual = novoTexto;
}

function renderizarTexto() {
  const textoCompleto = estado.historicoTextos.join(' ');
  const chars = textoCompleto.split('');
  const textoDigitado = estado.textoDigitado;

  let charsDigitadosAntes = 0;
  for (let i = 0; i < estado.textoIndex; i++) {
    charsDigitadosAntes += estado.historicoTextos[i].length + 1;
  }
  const posicaoAtual = charsDigitadosAntes + estado.textoDigitado.length;

  // VERIFICA SE DIGITOU UM ESPAÇO (FIM DE PALAVRA)
  if (textoDigitado.length > 0) {
    const ultimoCharDigitado = textoDigitado[textoDigitado.length - 1];
    if (ultimoCharDigitado === ' ') {
      estado.scrollPos = posicaoAtual;
    }
  }

  // SE CHEGOU NO FIM DO TEXTO, SCROLLA TAMBÉM
  if (posicaoAtual >= textoCompleto.length) {
    estado.scrollPos = posicaoAtual;
  }

  const charsPorLinha = 18;
  const linhaAtual = Math.floor(estado.scrollPos / charsPorLinha);
  const offsetY = Math.max(0, (linhaAtual - 1) * 44);
  elementos.textoDigitacao.style.transform = `translateY(-${offsetY}px)`;

  elementos.textoDigitacao.innerHTML = chars
    .map((caractere, indice) => {
      let classe = 'char';

      if (indice < textoDigitado.length + charsDigitadosAntes) {
        const charDigitado = textoDigitado[indice - charsDigitadosAntes];
        if (charDigitado === caractere) {
          classe += ' correct';
        } else {
          classe += ' wrong';
        }
      } else if (!estado.concluido && indice === posicaoAtual) {
        classe += ' current';
      }

      let conteudo = caractere;
      if (caractere === ' ') {
        conteudo = '&nbsp;';
      }

      return `<span class="${classe}">${conteudo}</span>`;
    })
    .join('');
}

function calcularEstatisticas() {
  let acertos = 0;
  let erros = 0;
  const textoDigitado = estado.textoDigitado;

  for (let i = 0; i < textoDigitado.length; i++) {
    if (i >= estado.textoAtual.length) {
      erros += 1;
      continue;
    }
    if (textoDigitado[i] === estado.textoAtual[i]) {
      acertos += 1;
    } else {
      erros += 1;
    }
  }

  estado.acertos = acertos;
  estado.erros = erros;
}

function atualizarPainel() {
  elementos.painelTempo.textContent = estado.tempoRestante;

  if (estado.textoDigitado.length === 0) {
    elementos.painelWpm.textContent = '0';
    elementos.painelPrecisao.textContent = '100%';
    return;
  }

  const segundosDecorridos = estado.tempoSelecionado - estado.tempoRestante;
  const minutosDecorridos = segundosDecorridos / 60;
  const wpm = minutosDecorridos > 0
    ? Math.round((estado.acertos / 5) / minutosDecorridos)
    : 0;
  const precisao = Math.round(
    (estado.acertos / Math.max(1, estado.textoDigitado.length)) * 100
  );

  elementos.painelWpm.textContent = wpm.toString();
  elementos.painelPrecisao.textContent = `${precisao}%`;
}

function iniciarTimer() {
  if (estado.rodando) return;
  estado.rodando = true;
  estado.inicio = Date.now();

  estado.timer = setInterval(() => {
    estado.tempoRestante -= 1;
    atualizarPainel();

    if (estado.tempoRestante <= 0) {
      finalizarJogo();
    }
  }, 1000);
}

function finalizarJogo() {
  clearInterval(estado.timer);
  estado.rodando = false;
  estado.concluido = true;

  const segundosDecorridos = estado.tempoSelecionado - Math.max(estado.tempoRestante, 0);
  const minutosDecorridos = segundosDecorridos / 60;
  const wpm = minutosDecorridos > 0
    ? Math.round((estado.acertos / 5) / minutosDecorridos)
    : 0;
  const precisao = estado.textoDigitado.length > 0
    ? Math.round((estado.acertos / estado.textoDigitado.length) * 100)
    : 100;

  elementos.painelResultados.classList.add('show');
  elementos.valorWpm.textContent = wpm;
  elementos.valorPrecisao.textContent = `${precisao}%`;

  const detalhes = elementos.detalhesResultados.querySelectorAll('b');
  detalhes[0].textContent = wpm;
  detalhes[1].textContent = estado.textoDigitado.length;
  detalhes[2].textContent = estado.erros;
  detalhes[3].textContent = `${segundosDecorridos}s`;

  elementos.campoDigitacao.disabled = true;
  elementos.dica.textContent = 'Jogo encerrado. Clique em Reiniciar para tentar outro texto.';
}

function reiniciarJogo() {
  clearInterval(estado.timer);
  estado.rodando = false;
  estado.concluido = false;
  estado.tempoRestante = estado.tempoSelecionado;
  estado.textoDigitado = '';
  estado.acertos = 0;
  estado.erros = 0;
  estado.inicio = null;
  estado.historicoTextos = [];
  estado.textoIndex = 0;
  estado.scrollPos = 0;

  elementos.campoDigitacao.value = '';
  elementos.campoDigitacao.disabled = false;
  elementos.painelResultados.classList.remove('show');
  elementos.dica.textContent = 'Digite o texto abaixo e tente atingir a melhor precisão.';

  adicionarNovoTexto();
  renderizarTexto();
  atualizarPainel();
  elementos.campoDigitacao.focus();
}

function selecionarTempo(segundos) {
  estado.tempoSelecionado = segundos;
  estado.tempoRestante = segundos;

  elementos.botoesTempo.forEach((botao) => {
    botao.classList.toggle('active', Number(botao.dataset.tempo) === segundos);
  });

  reiniciarJogo();
}

function iniciarDigito() {
  if (!estado.rodando && elementos.campoDigitacao.value.length > 0) {
    iniciarTimer();
  }

  const textoDigitado = elementos.campoDigitacao.value;
  estado.textoDigitado = textoDigitado;

  // SE TERMINOU O TEXTO, ADICIONA NOVO
  if (textoDigitado.length >= estado.textoAtual.length && !estado.concluido) {
    adicionarNovoTexto();
    estado.textoDigitado = '';
    elementos.campoDigitacao.value = '';
  }

  calcularEstatisticas();
  renderizarTexto();
  atualizarPainel();
}

function configurarEventos() {
  elementos.botoesTempo.forEach((botao) => {
    botao.addEventListener('click', () => {
      selecionarTempo(Number(botao.dataset.tempo));
    });
  });

  elementos.campoDigitacao.addEventListener('input', iniciarDigito);
  elementos.botaoReiniciar.addEventListener('click', reiniciarJogo);

  document.querySelector('.campo-digitacao').addEventListener('click', () => {
    elementos.campoDigitacao.focus();
  });
}

function inicializar() {
  adicionarNovoTexto();
  renderizarTexto();
  atualizarPainel();
  configurarEventos();
  elementos.campoDigitacao.focus();
}

inicializar();