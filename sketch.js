let imgFundo;
let imgWindows;
let imgIniciais = [];
let introIndex = 0;
let faseCaos = false;
let totalPopups = 0;
const LIMITE_POPUPS = 1600;
let imgImpacto;
let impactoDesenhado = false;

function preload() {
  imgWindows = loadImage('assets/wallpaper.png');
  imgFundo = loadImage('assets/SPAM.jpeg');
  imgImpacto = loadImage('assets/SPAM_2.jpeg');
  imgIniciais.push(loadImage('assets/data1.png'));
  imgIniciais.push(loadImage('assets/data2.png'));
  imgIniciais.push(loadImage('assets/data3.png'));
  imgIniciais.push(loadImage('assets/hora1.png'));
  imgIniciais.push(loadImage('assets/hora2.png'));
  imgIniciais.push(loadImage('assets/local1.png'));
  imgIniciais.push(loadImage('assets/local2.png'));
  imgIniciais.push(loadImage('assets/local3.png'));
  imgIniciais.push(loadImage('assets/convite1.png'));
  imgIniciais.push(loadImage('assets/convite2.png'));
  imgIniciais.push(loadImage('assets/aniversario1.png'));
  imgIniciais.push(loadImage('assets/aniversario2.png'));
  imgIniciais.push(loadImage('assets/aniversario3.png'));
  imgIniciais.push(loadImage('assets/aniversario4.png'));
  imgIniciais.push(loadImage('assets/after1.png'));
  imgIniciais.push(loadImage('assets/after2.png'));
  imgIniciais.push(loadImage('assets/after3.png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  imgFundo.resize(width, height);
  
  image(imgWindows, 0, 0, width, height);
}

function draw() {
  if (!faseCaos) {
    if (frameCount % 60 === 0) {
      if (introIndex < imgIniciais.length) {
        criarPopupIntro(imgIniciais[introIndex]);
        introIndex++;
      } else {
        faseCaos = true;
      }
    }
  } else {
    // FASE 2: O Caos compondo a imagem de fundo (agora com aceleração progressiva)
    if (totalPopups < LIMITE_POPUPS) {
      
      let velocidade_frames = 1; // Quantos popups desenhar de uma vez
      let intervalo_frames = 1;  // A cada quantos frames desenhar

      // Criamos "marchas" de aceleração baseadas em quantos pop-ups já existem
      if (totalPopups < 10) {
        intervalo_frames = 20; // Marcha 1: Lento (3 por segundo)
      } else if (totalPopups < 30) {
        intervalo_frames = 8;  // Marcha 2: Médio 
      } else if (totalPopups < 50) {
        intervalo_frames = 2;  // Marcha 3: Rápido (quase 1 por frame)
      } else {
        // Marcha 4: O Caos absoluto! Começa a desenhar VÁRIOS por frame.
        velocidade_frames = map(totalPopups, 120, LIMITE_POPUPS, 2, 15);
      }

      // Executa a criação baseada no intervalo e velocidade definidos acima
      if (frameCount % intervalo_frames === 0) {
        for(let i = 0; i < velocidade_frames; i++) {
          if (totalPopups < LIMITE_POPUPS) {
            criarPopupCarimbo();
            totalPopups++;
          }
        }
      }
    } else if (!impactoDesenhado) {
      // FASE 3: O Impacto Final
      image(imgImpacto, 0, 0, width, height); 
      impactoDesenhado = true;
      noLoop(); // Trava a animação do p5.js
      
      // Espera 2000 milissegundos (2 segundos) para o "Gran Finale"
      setTimeout(() => {
        // Mostra a div do pop-up
        document.getElementById('popup-final').style.display = 'block';
        
        // Define para onde o botão vai levar ao ser clicado
        document.getElementById('btn-aceitar').onclick = function() {
          window.open('https://shotgun.live/pt-br/events/spamspamspam-091', '_blank');
        };
      }, 2000);
      
      console.log("Impacto gerado. Aguardando pop-up misterioso...");
    }
  }
}

// Função que desenha UM pop-up e o "carimba" na tela
function criarPopupCarimbo() {
  
  // 1. Definir tamanhos e posições aleatórias
  let larguraTotal = random(150, 350);
  let alturaTotal = random(150, 250);
  let posX = random(-50, width - 100); // Permite que saia um pouco da tela nas bordas
  let posY = random(-50, height - 100);

  // Margens internas da "janela" do Windows
  let margemX = 10;
  let margemY_topo = 35; // Espaço da barra azul
  let margemY_base = 10;
  
  // Calcula o tamanho exato da imagem dentro do pop-up
  let larguraConteudo = larguraTotal - (margemX * 2);
  let alturaConteudo = alturaTotal - (margemY_topo + margemY_base);

  // --- O PULO DO GATO: O RECORTE ---
  
  // A função get(x, y, w, h) pega um pedaço da imagem mestra.
  // Precisamos pegar o pedaço EXATO onde a imagem vai aparecer DENTRO da janelinha.
  // Por isso somamos a posX com a margem interna.
  let recorte = imgFundo.get(posX + margemX, posY + margemY_topo, larguraConteudo, alturaConteudo);
  
  // --- DESENHANDO A JANELA (O "Carimbo") ---

  // Sombra
  noStroke();
  fill(0, 0, 0, 80);
  rect(posX + 5, posY + 5, larguraTotal, alturaTotal);

  // Estrutura Cinza da Janela
  fill(192); // Cinza clássico
  // Bordas 3D falsas
  stroke(255); line(posX, posY, posX + larguraTotal, posY); line(posX, posY, posX, posY + alturaTotal);
  stroke(128); line(posX + larguraTotal, posY, posX + larguraTotal, posY + alturaTotal); line(posX, posY + alturaTotal, posX + larguraTotal, posY + alturaTotal);
  noStroke();
  rect(posX+2, posY+2, larguraTotal-4, alturaTotal-4);

  // Barra de Título Azul
  fill(0, 0, 128);
  rect(posX + 3, posY + 3, larguraTotal - 6, 25);

  // Texto e Botões Falsos
  fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER);
  text("SPAM!!!!", posX + 10, posY + 15);
  
  fill(192); rect(posX + larguraTotal - 25, posY + 5, 20, 20); // Botão X fundo
  fill(0); textAlign(CENTER, CENTER); text("X", posX + larguraTotal - 15, posY + 15); // X

  // --- COLANDO O RECORTE DA IMAGEM FINAL ---
  // Desenhamos o recorte que pegamos lá em cima, dentro da moldura
  image(recorte, posX + margemX, posY + margemY_topo);
}

// Função para desenhar os pop-ups iniciais (mostra a imagem inteira)
function criarPopupIntro(imgParaMostrar) {
  let larguraTotal = random(250, 400); // Ligeiramente maiores para focar a atenção
  let alturaTotal = random(250, 400);
  
  // Mantém os primeiros pop-ups mais centralizados
  let posX = random(50, width - larguraTotal - 50); 
  let posY = random(50, height - alturaTotal - 50);

  let margemX = 10;
  let margemY_topo = 35;
  let margemY_base = 10;

  // Sombra e Base da Janela
  noStroke(); fill(0, 0, 0, 80); rect(posX + 5, posY + 5, larguraTotal, alturaTotal);
  fill(192); stroke(255); line(posX, posY, posX + larguraTotal, posY); line(posX, posY, posX, posY + alturaTotal);
  stroke(128); line(posX + larguraTotal, posY, posX + larguraTotal, posY + alturaTotal); line(posX, posY + alturaTotal, posX + larguraTotal, posY + alturaTotal);
  noStroke(); rect(posX+2, posY+2, larguraTotal-4, alturaTotal-4);

  // Barra de Título e Botão
  fill(0, 0, 128); rect(posX + 3, posY + 3, larguraTotal - 6, 25);
  fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER); text("VOCÊ TEM UMA NOVA MENSAGEM", posX + 10, posY + 15);
  fill(192); rect(posX + larguraTotal - 25, posY + 5, 20, 20);
  fill(0); textAlign(CENTER, CENTER); text("X", posX + larguraTotal - 15, posY + 15);

  // Desenha a imagem de introdução esticada para caber no pop-up
  image(imgParaMostrar, posX + margemX, posY + margemY_topo, larguraTotal - (margemX * 2), alturaTotal - (margemY_topo + margemY_base));
}

// Se redimensionar a janela, reinicia a arte para não quebrar o mapeamento
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  imgFundo.resize(width, height);
  image(imgWindows, 0, 0, width, height);
  totalPopups = 0;
}