// Lista de textos
const textos = [
  "Programar é como construir pontes entre ideias e máquinas, passo a passo com precisão.",
  "Cada palavra digitada com calma ajuda a ganhar foco, ritmo e confiança durante a prática.",
  "A tecnologia transforma sonhos em ferramentas, e a prática torna cada habilidade mais forte.",
  "As mulheres e os homens estavam espalhados pela terra. Uns estavam maravilhados, outros tinham-se cansado. Os que estavam maravilhados abriam a boca, os que se tinham cansado também abriam a boca. Ambos abriam a boca.⏎Houve um homem sozinho que se pôs a espreitar esta diferença: havia pessoas maravilhadas e outras que estavam cansadas.⏎Depois ainda espreitou melhor: todas as pessoas estavam maravilhadas, depois não sabiam aguentar-se maravilhadas e ficavam cansadas.⏎As pessoas estavam tristes ou alegres conforme a luz: para cada um, mais luz - alegres; menos luz - tristes.⏎O homem sozinho ficou a pensar nesta diferença. Para não esquecer, fez uns sinais numa pedra.⏎Este homem sozinho era da minha raça, era um Egípcio! Os sinais que ele gravou na pedra para medir a luz por dentro das pessoas chamaram-se hieróglifos.⏎Mais tarde veio outro homem sozinho que tornou estes sinais ainda mais fáceis. Fez vinte e dois sinais que bastavam para todas as combinações que há ao sol.⏎Este homem sozinho era da minha raça, era um Fenício! Cada um dos vinte e dois sinais era uma letra. Cada combinação de letras, uma palavra."
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

// Guarda o status da rodada: tempo, texto, erros e progresso
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

// Escolhe um texto aleatório para o usuário digitar
function escolherTexto() {
  estado.textoAlvo = textos[Math.floor(Math.random() * textos.length)];
}

// Mostra o texto na tela
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

      const conteudo = caractere === ' ' ? '&nbsp;' : caractere;
      return `<span class="${classe}">${conteudo}</span>`;
    })
    .join('');
}

// Contador de acertos e erros com base na digitação
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

// Atualiza os números mostrados no painel
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

// Inicia o cronômetro da rodada
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

// Encerra a rodada e exibe o resultado final
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

// Reinicia a rodada com um novo texto e tempo limpo
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

// Define o tempo da rodada escolhida pelo usuário
function selecionarTempo(segundos) {
  estado.tempoSelecionado = segundos;
  estado.tempoRestante = segundos;
  elementos.botoesTempo.forEach((botao) => {
    botao.classList.toggle('active', Number(botao.dataset.tempo) === segundos);
  });

  reiniciarJogo();
}

// Responde ao evento de digitação do usuário
function iniciarDigito() {
  if (!estado.rodando) {
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

// Liga os eventos dos botões e do campo de digitação
function configurarEventos() {
  elementos.botoesTempo.forEach((botao) => {
    botao.addEventListener('click', () => selecionarTempo(Number(botao.dataset.tempo)));
  });

  elementos.campoDigitacao.addEventListener('input', iniciarDigito);
  elementos.campoDigitacao.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
    }
  });

  elementos.botaoReiniciar.addEventListener('click', reiniciarJogo);

  document.querySelector('.campo-digitacao').addEventListener('click', () => {
    elementos.campoDigitacao.focus();
  });
}

// Inicializa o jogo de digitação 
function inicializar() {
  escolherTexto();
  renderizarTexto();
  atualizarPainel();
  configurarEventos();
  selecionarTempo(30);
}

inicializar();
