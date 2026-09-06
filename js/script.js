
/* ============================================================
   ABERTURA DO CONVITE
   ============================================================ */
const openingScreen = document.getElementById("openingScreen");
const openInvitation = document.getElementById("openInvitation");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

document.body.classList.add("invitation-locked");

function prepararMusica(){
  if(!bgMusic || !musicToggle) return;

  const source = bgMusic.querySelector("source");
  if(!source || !source.getAttribute("src")) return;

  // Mostra o controlo. Se o ficheiro não existir, o browser continuará
  // sem áudio e o botão não é forçado ao utilizador.
  musicToggle.classList.remove("is-hidden");

  bgMusic.addEventListener("error", () => {
    musicToggle.classList.add("is-hidden");
  }, { once:true });
}

function abrirConvite(){
  if(!openingScreen || !openInvitation) return;

  openInvitation.disabled = true;
  openInvitation.classList.add("opening");

  // A carta sobe primeiro; depois a tela desaparece e a landing page entra.
  setTimeout(() => {
    document.body.classList.remove("invitation-locked");
    document.body.classList.add("invitation-opened");

    // A música só começa por ação explícita do utilizador.
    iniciarMusicaSeDisponivel();

    setTimeout(() => {
      openingScreen.setAttribute("aria-hidden","true");
      document.getElementById("inicio")?.scrollIntoView({behavior:"smooth",block:"start"});
    }, 180);
  }, 700);
}

function iniciarMusicaSeDisponivel(){
  if(!bgMusic || !musicToggle) return;
  bgMusic.volume = 0.32;
  bgMusic.play().then(() => {
    musicToggle.classList.add("playing");
    musicToggle.setAttribute("aria-pressed","true");
    musicToggle.innerHTML = "♫ <span>Som ligado</span>";
  }).catch(() => {
    // Autoplay pode ser bloqueado; o botão continua disponível.
  });
}

function alternarMusica(){
  if(!bgMusic || !musicToggle) return;

  if(bgMusic.paused){
    bgMusic.play().then(() => {
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-pressed","true");
      musicToggle.innerHTML = "♫ <span>Som ligado</span>";
    }).catch(() => mostrarToast("Adicione assets/musica.mp3 ao projeto."));
  }else{
    bgMusic.pause();
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-pressed","false");
    musicToggle.innerHTML = "♫ <span>Música</span>";
  }
}

openInvitation?.addEventListener("click", abrirConvite);
musicToggle?.addEventListener("click", alternarMusica);
prepararMusica();

/* ============================================================
   WAYELA RSVP — CONFIGURAÇÃO
   Número do responsável onde cairá as mensagens do whatsApp.
   Formato: 244 + número, sem espaços, + ou parênteses.
   ============================================================ */
const WHATSAPP_RESPONSAVEL = "244941532477";

/* Data do aniversário: 26/09/2026 às 14h */
const DATA_EVENTO = new Date(2026, 8, 26, 14, 0, 0);

const prefixosValidos = [
  "923","924","925","926","927","928","929",
  "931","932","933","940","941","942","943","944","945","946","947","948","949",
  "950","951","952","953","954","955","956","957","958","959"
];

const $ = id => document.getElementById(id);

window.addEventListener("DOMContentLoaded", () => {
  iniciarContador();
  $("rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    enviarRSVP(true);
  });
  $("btnDecline").addEventListener("click", () => enviarRSVP(false));
  $("copyAddress").addEventListener("click", copiarMorada);
  $("shareBtn").addEventListener("click", partilhar);
  $("calendarBtn").addEventListener("click", adicionarCalendario);
});

/* ---------------- CONTADOR ---------------- */
function iniciarContador(){
  atualizarContador();
  setInterval(atualizarContador, 1000);
}

function atualizarContador(){
  const agora = new Date();
  const diff = DATA_EVENTO - agora;
  const contador = $("contadorTempo");
  const mensagem = $("contadorMensagem");

  if(diff > 0){
    const dias = Math.floor(diff / 86400000);
    const horas = Math.floor((diff / 3600000) % 24);
    const minutos = Math.floor((diff / 60000) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    contador.innerHTML = `
      ${caixaContador(dias,"Dias")}
      ${caixaContador(horas,"Horas")}
      ${caixaContador(minutos,"Min")}
      ${caixaContador(segundos,"Seg")}
    `;
    mensagem.textContent = "🎈 Está quase na hora da festa!";
  }else{
    contador.innerHTML = `
      ${caixaContador("♥","")}
      ${caixaContador("2","Anos")}
      ${caixaContador("♥","")}
    `;
    mensagem.textContent = "🎉 O grande dia chegou! Vamos festejar a Wayela!";
  }
}

function caixaContador(valor, texto){
  return `<div class="counter-box"><div class="counter-num">${valor}</div><div class="counter-label">${texto}</div></div>`;
}

/* ---------------- VALIDAÇÃO ---------------- */
function normalizarTelefone(valor){
  let n = String(valor).replace(/\D/g,"");
  if(n.startsWith("244")) n = n.slice(3);
  return n;
}

function validarTelefoneAngola(valor){
  const n = normalizarTelefone(valor);
  return n.length === 9 && prefixosValidos.includes(n.slice(0,3));
}

function validarCampos(){
  const nome = $("nome");
  const telefone = $("telefone");
  const origem = $("origem");
  let ok = true;

  limparErros();

  if(!nome.value.trim()){
    marcarErro(nome,"Informe o seu nome.");
    ok = false;
  }

  if(!validarTelefoneAngola(telefone.value)){
    marcarErro(telefone,"Digite um número válido de Angola (ex.: 923 456 789).");
    $("erroTelefone").textContent = "Digite um número válido de Angola (ex.: 923 456 789).";
    ok = false;
  }

  if(!origem.value.trim()){
    marcarErro(origem,"Informe de onde vem.");
    ok = false;
  }

  if(!ok){
    const first = document.querySelector(".input-error");
    first?.focus();
  }
  return ok;
}

function marcarErro(input){
  input.classList.add("input-error");
}
function limparErros(){
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
  $("erroTelefone").textContent = "";
}

/* ---------------- WHATSAPP ---------------- */
function enviarRSVP(vaiComparecer){
  if(!validarCampos()) return;

  if(!WHATSAPP_RESPONSAVEL || WHATSAPP_RESPONSAVEL.includes("000000")){
    mostrarToast("⚠️ Configure o número do WhatsApp em js/script.js");
    return;
  }

  const nome = $("nome").value.trim();
  const telefone = $("telefone").value.trim();
  const origem = $("origem").value.trim();
  const acompanhantes = Math.max(0, Number($("acompanhantes").value) || 0);

  // Montamos a mensagem com quebras de linha reais e só depois
  // fazemos a codificação UTF-8 da mensagem inteira. Isso evita
  // que emojis (📱 📍 🎉 👥 💜) sejam interpretados como "�".
  let mensagem = `Olá! Sou ${nome}.\n\n`;
  mensagem += `📱 Telefone: ${telefone}\n`;
  mensagem += `📍 Vindo de/do: ${origem}\n`;

  if(vaiComparecer){
    mensagem += `🎉 Confirmo a minha presença no aniversário da Wayela.\n`;
    mensagem += `👥 Acompanhantes: ${acompanhantes}.`;
  }else{
    mensagem += `💜 Infelizmente não poderei comparecer ao aniversário da Wayela.`;
  }

  // encodeURIComponent converte corretamente os caracteres Unicode
  // para percent-encoding UTF-8, incluindo emojis e acentos.
  const mensagemCodificada = encodeURIComponent(mensagem);

  mostrarToast("Abrindo WhatsApp…");
  setTimeout(() => {
    const url = `https://wa.me/${WHATSAPP_RESPONSAVEL}?text=${mensagemCodificada}`;
    window.open(url,"_blank","noopener,noreferrer");
  },350);
}

/* ---------------- EXTRAS ---------------- */
async function copiarMorada(){
  const texto = "Cantífilas, Rua da Sinha-Moça";
  try{
    await navigator.clipboard.writeText(texto);
    mostrarToast("📍 Morada copiada!");
  }catch{
    mostrarToast(texto);
  }
}

async function partilhar(){
  const dados = {
    title:"Aniversário da Wayela — 2 anos",
    text:"Vem celebrar os 2 anos da Wayela comigo! 🎈",
    url:location.href
  };
  if(navigator.share){
    try{ await navigator.share(dados); }catch{}
  }else{
    try{
      await navigator.clipboard.writeText(location.href);
      mostrarToast("🔗 Link do convite copiado!");
    }catch{
      mostrarToast("Copie o endereço desta página para partilhar.");
    }
  }
}

function adicionarCalendario(){
  const inicio = new Date(2026,8,26,14,0,0);
  const fim = new Date(2026,8,26,19,0,0);
  const fmt = d => d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wayela//Aniversario//PT",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(inicio)}`,
    `DTEND:${fmt(fim)}`,
    "SUMMARY:Aniversário da Wayela — 2 anos",
    "LOCATION:Cantífilas, Rua da Sinha-Moça",
    "DESCRIPTION:Venha celebrar os 2 anos da Wayela!",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics],{type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aniversario-wayela-2026.ics";
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast("📅 Evento preparado para o calendário!");
}

let toastTimer;
function mostrarToast(texto){
  const toast = $("toast");
  toast.textContent = texto;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"),3200);
}
