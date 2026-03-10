let imgWindows;
let imgIniciais = [];
let introIndex = 0;


let roteiro = [
  { texto: "DIA 14/03", qtdImagens: 2},
  { texto: "20h00", qtdImagens: 1},
  { texto: "BAIÚCA DO MERCADO", qtdImagens: 2},
  { texto: "VOCÊ", qtdImagens: 1},
  { texto: "ESTÁ CONVIDADO", qtdImagens: 2},
  { texto: "PARA O MEU ANIVERSÁRIO", qtdImagens: 3},
  { texto: "DE 22 ANOS", qtdImagens: 4},
  { texto: "AFTER SPACE CLUB 22h00", qtdImagens: 1},
  { texto: "FESTA SPAM!!!!!", qtdImagens: 1 }
];

let indiceCiclo = 0;
let imagensDesenhadasNoCiclo = 0;
let estadoIntro = "TEXTO";
let timerIntro = 0;

let timerCaos = 0;
let faseCaos = false;
let botaoRevelado = false;

let somTexto, somImagem, somSpam;
let iniciou = false;

function preload() {
  imgWindows = loadImage('assets/wallpaper.png');
  imgIniciais.push(loadImage('assets/data2.png'));
  imgIniciais.push(loadImage('assets/data3.png'));
  imgIniciais.push(loadImage('assets/hora2.png'));
  imgIniciais.push(loadImage('assets/local2.png'));
  imgIniciais.push(loadImage('assets/local3.png'));
  imgIniciais.push(loadImage('assets/voce2.png'));
  imgIniciais.push(loadImage('assets/convite2.png'));
  imgIniciais.push(loadImage('assets/convite3.png'));
  imgIniciais.push(loadImage('assets/aniversario1.png'));
  imgIniciais.push(loadImage('assets/aniversario2.jpg'));
  imgIniciais.push(loadImage('assets/aniversario3.png'));
  imgIniciais.push(loadImage('assets/anos1.png'));
  imgIniciais.push(loadImage('assets/anos2.png'));
  imgIniciais.push(loadImage('assets/anos3.jpg'));
  imgIniciais.push(loadImage('assets/anos4.jpg'));
  imgIniciais.push(loadImage('assets/after2.png'));
  imgIniciais.push(loadImage('assets/spam1.jpeg'));

  somTexto = loadSound('assets/somTexto.wav');
  somImagem = loadSound('assets/somImagem.wav');
  somSpam = loadSound('assets/somSpam.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  image(imgWindows, 0, 0, width, height);

  somSpam.setVolume(0.05);
}

function draw() {
  if (!iniciou) {
    // Desenha o wallpaper de fundo
    image(imgWindows, 0, 0, width, height); 
    
    // Desenha o pop-up de email bem no centro
    criarPopupEmailInicial();
    
    // O comando "return" faz o p5.js ignorar todo o resto do código abaixo dele.
    // Ele fica preso desenhando só esse email até a variável "iniciou" virar true.
    return; 
  }


  if (!faseCaos) {
    if (indiceCiclo < roteiro.length) {
      let cicloAtual = roteiro[indiceCiclo];

      if (estadoIntro === "TEXTO") {
        // 1. Desenha a janela de texto
        criarPopupTexto(cicloAtual.texto);
        estadoIntro = "ESPERA_TEXTO";
        timerIntro = frameCount; // Salva o frame exato em que o texto apareceu
      } else if (estadoIntro === "ESPERA_TEXTO") {
        // 2. Pausa dramática para leitura (120 frames = aprox. 2 segundos)
        if (frameCount - timerIntro > 60) {
          estadoIntro = "IMAGENS";
          timerIntro = frameCount; // Reseta o cronômetro para as imagens
        }
      } else if (estadoIntro === "IMAGENS") {
          // 3. Dispara as imagens uma a uma
          if (frameCount - timerIntro > 15) {
            let img = imgIniciais[introIndex % imgIniciais.length]; 
            
            criarPopupIntro(img);
            introIndex++;
            imagensDesenhadasNoCiclo++;
            timerIntro = frameCount;

            // Se já desenhou todas as imagens deste ciclo, vai para a pausa (NÃO para o texto)
            if (imagensDesenhadasNoCiclo >= cicloAtual.qtdImagens) {
              imagensDesenhadasNoCiclo = 0;
              estadoIntro = "ESPERA_PROXIMO_CICLO"; // <--- Novo estado aqui
              timerIntro = frameCount; // Começa a contar o tempo da pausa
            }
          }
        }
        
        else if (estadoIntro === "ESPERA_PROXIMO_CICLO") {
          // 4. Pausa dramática ANTES do próximo ciclo ou do caos final
          if (frameCount - timerIntro > 60) { // 60 frames = aprox. 1 segundo de respiro
            indiceCiclo++; // Agora sim avançamos de ciclo
            estadoIntro = "TEXTO";
          }
        }
    } else {
      faseCaos = true;
    }
  } else {
      // --- FASE 2: O CAOS DE JANELAS (Fábrica de SPAM) ---
      
      if (timerCaos === 0) {
        timerCaos = frameCount;
      }

      // Desenha de 1 a 3 janelas por frame (ajuste para mais ou menos caos)
 
        criarPopupSpam();
      

      // --- O GRAN FINALE: Revelar o botão ---
      // Depois de 180 frames (cerca de 3 segundos), o botão surge no meio do caos
      if (frameCount - timerCaos > 180 && !botaoRevelado) {
        
        document.getElementById('popup-final').style.display = 'block';
        
        document.getElementById('btn-aceitar').onclick = function() {
          window.open('https://chat.whatsapp.com/EuGBb4IZXQTIlgkwF3nsAu', '_blank'); // <-- SEU LINK
        };
        
        botaoRevelado = true;
      }
    }
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
  fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER); text("ANEXO:", posX + 10, posY + 15);
  fill(192); rect(posX + larguraTotal - 25, posY + 5, 20, 20);
  fill(0); textAlign(CENTER, CENTER); text("X", posX + larguraTotal - 15, posY + 15);

  // Desenha a imagem de introdução esticada para caber no pop-up
  image(imgParaMostrar, posX + margemX, posY + margemY_topo, larguraTotal - (margemX * 2), alturaTotal - (margemY_topo + margemY_base));

  somImagem.play();
}

// Função para desenhar as janelas exclusivas de texto
// Função para desenhar as janelas exclusivas de texto (com deformação estética)
function criarPopupTexto(mensagem) {
  // Tamanho base, mas que vai se deformar se a tela for menor
  let larguraTotal = 400; 
  let alturaTotal = 200;
  
  // O PULO DO GATO: Se a tela for pequena, a janela é esmagada!
  // O min() escolhe o menor valor. Garante que nunca vaze da tela.
  larguraTotal = min(larguraTotal, width - 20);
  alturaTotal = min(alturaTotal, height - 20);
  
  // Posição aleatória, mas presa dentro dos limites da tela
  let posX = random(10, width - larguraTotal - 10); 
  let posY = random(10, height - alturaTotal - 10);

  // Sombra e Base da Janela
  noStroke(); fill(0, 0, 0, 80); rect(posX + 5, posY + 5, larguraTotal, alturaTotal);
  fill(255); stroke(255); line(posX, posY, posX + larguraTotal, posY); line(posX, posY, posX, posY + alturaTotal);
  stroke(128); line(posX + larguraTotal, posY, posX + larguraTotal, posY + alturaTotal); line(posX, posY + alturaTotal, posX + larguraTotal, posY + alturaTotal);
  noStroke(); rect(posX+2, posY+2, larguraTotal-4, alturaTotal-4);

  // Barra de Título e Botão
  fill(0, 0, 128); rect(posX + 3, posY + 3, larguraTotal - 6, 25);
  fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER); text("NOVA MENSAGEM!", posX + 10, posY + 15);
  fill(192); rect(posX + larguraTotal - 25, posY + 5, 20, 20);
  fill(0); textAlign(CENTER, CENTER); text("X", posX + larguraTotal - 15, posY + 15);

  // O Texto Centralizado e Espremido (Deformado)
  fill(0); 
  textSize(50); 
  textAlign(CENTER, CENTER);
  
  // Ao passar a largura e altura aqui, o texto é forçado a quebrar e se espremer na caixa!
  // Deixamos uma margem interna de 10px nas laterais e compensamos a barra azul no topo
  text(mensagem, posX + 10, posY + 35, larguraTotal - 20, alturaTotal - 45); 

  somTexto.play();
}

// Função para desenhar as janelas caóticas da Fase 2
function criarPopupSpam() {
  // Tamanhos e posições aleatórias
  let larguraTotal = random(150, 350);
  let alturaTotal = random(100, 200);
  // Permite que elas saiam um pouco da tela para cobrir as bordas
  let posX = random(-50, width - 50); 
  let posY = random(-50, height - 50);

  // Sombra e Base da Janela (Estilo Windows clássico)
  noStroke(); fill(0, 0, 0, 80); rect(posX + 5, posY + 5, larguraTotal, alturaTotal);
  fill(192); stroke(255); line(posX, posY, posX + larguraTotal, posY); line(posX, posY, posX, posY + alturaTotal);
  stroke(128); line(posX + larguraTotal, posY, posX + larguraTotal, posY + alturaTotal); line(posX, posY + alturaTotal, posX + larguraTotal, posY + alturaTotal);
  noStroke(); rect(posX+2, posY+2, larguraTotal-4, alturaTotal-4);

  // Barra de Título (Fundo azul clássico ou pode colocar random() aqui também!)
  fill(0, 0, 128); rect(posX + 3, posY + 3, larguraTotal - 6, 25);
  fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER); text("ALERTA SPAM!!!", posX + 10, posY + 15);
  fill(192); rect(posX + larguraTotal - 25, posY + 5, 20, 20);
  fill(0); textAlign(CENTER, CENTER); text("X", posX + larguraTotal - 15, posY + 15);

  // Fundo branco da área de conteúdo
  fill(255);
  rect(posX + 5, posY + 32, larguraTotal - 10, alturaTotal - 37);

  // O Texto SPAM caótico no meio da janela
  fill(random(255), random(255), random(255)); // Sorteia uma cor RGB aleatória
  textSize(random(40, 80)); // Tamanho aleatório para dar agonia
  textAlign(CENTER, CENTER);
  
  // O +10 no Y compensa a barra azul para o texto ficar bem centralizado
  text("SPAM!!!!!!", posX + larguraTotal / 2, posY + alturaTotal / 2 + 10); 
}

// Função para desenhar o convite/email inicial
function criarPopupEmailInicial() {
  let larguraTotal = 350;
  let alturaTotal = 160;
  
  // Calcula o centro exato da tela
  let posX = (width - larguraTotal) / 2;
  let posY = (height - alturaTotal) / 2;

  // Sombra e Base da Janela
  noStroke(); fill(0, 0, 0, 100); rect(posX + 5, posY + 5, larguraTotal, alturaTotal);
  fill(192); stroke(255); line(posX, posY, posX + larguraTotal, posY); line(posX, posY, posX, posY + alturaTotal);
  stroke(128); line(posX + larguraTotal, posY, posX + larguraTotal, posY + alturaTotal); line(posX, posY + alturaTotal, posX + larguraTotal, posY + alturaTotal);
  noStroke(); rect(posX+2, posY+2, larguraTotal-4, alturaTotal-4);

  // Barra de Título
  fill(0, 0, 128); rect(posX + 3, posY + 3, larguraTotal - 6, 25);
  fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER); text("Novo E-mail Recebido ✉️", posX + 10, posY + 15);
  fill(192); rect(posX + larguraTotal - 25, posY + 5, 20, 20);
  fill(0); textAlign(CENTER, CENTER); text("X", posX + larguraTotal - 15, posY + 15);

  // Texto da Mensagem
  fill(0);
  textSize(16);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("Você tem (1) nova mensagem não lida.\nRemetente Desconhecido.", posX + larguraTotal / 2, posY + 70);

  // Falso Botão de Abrir
  let larguraBtn = 100;
  let posXBtn = posX + (larguraTotal - larguraBtn) / 2;
  
  fill(192); stroke(255); line(posXBtn, posY + 110, posXBtn + larguraBtn, posY + 110); line(posXBtn, posY + 110, posXBtn, posY + 140);
  stroke(128); line(posXBtn + larguraBtn, posY + 110, posXBtn + larguraBtn, posY + 140); line(posXBtn, posY + 140, posXBtn + larguraBtn, posY + 140);
  noStroke(); rect(posXBtn+1, posY+111, larguraBtn-2, 28);
  
  fill(0); textStyle(BOLD); text("Ler E-mail", posXBtn + larguraBtn / 2, posY + 125);
}

// Detecta o clique do mouse em qualquer lugar da tela
function mousePressed() {
  if (!iniciou) {
    // O PULO DO GATO: Esse comando avisa ao navegador que o usuário 
    // interagiu e pede permissão para liberar as caixas de som!
    userStartAudio(); 
    
    iniciou = true; // Libera a passagem do draw()
    
    // Sincroniza o cronômetro para a Fase 1 começar exatamente agora
    timerIntro = frameCount; 
  }
}

// Se redimensionar a janela, reinicia a arte para não quebrar o mapeamento
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  image(imgWindows, 0, 0, width, height);
  totalPopups = 0;
}