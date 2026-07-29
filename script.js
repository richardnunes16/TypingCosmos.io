
const textos = [
  "o futuro da tecnologia depende da capacidade das pessoas de utilizar o conhecimento cientifico e a criatividade para desenvolver solucoes que possam melhorar a qualidade de vida e resolver problemas importantes da sociedade",
  "a inteligencia artificial esta criando novas possibilidades para a tecnologia ao permitir que computadores analisem grandes quantidades de informacoes reconhecam padroes e auxiliem pessoas em diferentes atividades",
  "a tecnologia transforma a maneira como vivemos trabalhamos estudamos e nos comunicamos permitindo que tarefas complexas sejam realizadas com mais rapidez e criando novas possibilidades para o futuro"
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
  textoAlvo: '',
  textoDigitado: '',
  acertos: 0,
  erros: 0,
  concluido: false,
  inicio: null
};

function escolherTexto() {
  estado.textoAlvo = textos[Math.floor(Math.random() * textos.length)];
}

function renderizarTexto() {
  const chars = estado.textoAlvo.split('');

  elementos.textoDigitacao.innerHTML = chars
    .map((caractere, indice) => {
      let classe = 'char';

      if (indice < estado.textoDigitado.length) {
        classe += estado.textoDigitado[indice] === caractere ? ' correct' : ' wrong';
      } else if (!estado.concluido && indice === estado.textoDigitado.length) {
        classe += ' current';
      }

      let conteudo = caractere;
      if (caractere === ' ') conteudo = '&nbsp;';
      if (caractere === '⏎') conteudo = '<br/>';

      return `<span class="${classe}">${conteudo}</span>`;
    })
    .join('');
}

function calcularEstatisticas() {
  let acertos = 0;
  let erros = 0;

  Array.from(estado.textoDigitado).forEach((caractere, indice) => {
    if (indice >= estado.textoAlvo.length) {
      erros += 1;
      return;
    }

    if (caractere === estado.textoAlvo[indice]) {
      acertos += 1;
    } else {
      erros += 1;
    }
  });

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
  const wpm = minutosDecorridos > 0 ? Math.round((estado.acertos / 5) / minutosDecorridos) : 0;
  const precisao = Math.round((estado.acertos / Math.max(1, estado.textoDigitado.length)) * 100);

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
  const wpm = minutosDecorridos > 0 ? Math.round((estado.acertos / 5) / minutosDecorridos) : 0;
  const precisao = estado.textoDigitado.length > 0
    ? Math.round((estado.acertos / estado.textoDigitado.length) * 100)
    : 100;

  elementos.painelResultados.classList.add('show');
  elementos.valorWpm.textContent = wpm;
  elementos.valorPrecisao.textContent = `${precisao}%`;

  const detalhes = elementos.detalhesResultados.querySelectorAll('b');
  detalhes[0].textContent = wpm;
  detalhes[1].textContent = estado.textoAlvo.length;
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

  elementos.campoDigitacao.value = '';
  elementos.campoDigitacao.disabled = false;
  elementos.painelResultados.classList.remove('show');
  elementos.dica.textContent = 'Digite o texto abaixo e tente atingir a melhor precisão.';

  escolherTexto();
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

  estado.textoDigitado = elementos.campoDigitacao.value.slice(0, estado.textoAlvo.length);
  calcularEstatisticas();
  renderizarTexto();
  atualizarPainel();

  if (estado.textoDigitado.length >= estado.textoAlvo.length) {
    finalizarJogo();
  }
}

function configurarEventos() {
  elementos.botoesTempo.forEach((botao) => {
    botao.addEventListener('click', () => selecionarTempo(Number(botao.dataset.tempo)));
  });

  elementos.campoDigitacao.addEventListener('input', iniciarDigito);
  
  elementos.botaoReiniciar.addEventListener('click', reiniciarJogo);

  document.querySelector('.campo-digitacao').addEventListener('click', () => {
    elementos.campoDigitacao.focus();
  });
}

function inicializar() {
  escolherTexto();
  renderizarTexto();
  atualizarPainel();
  configurarEventos();
  elementos.campoDigitacao.focus();
}

inicializar();
