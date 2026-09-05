# Wayela — Convite Digital RSVP

Landing page de aniversário.

## Estrutura
- `index.html` — página completa
- `css/estilos.css` — design responsivo, animações e componentes
- `js/script.js` — contador, validação Angola, WhatsApp, partilha e calendário
- `assets/wayela.png` — recorte da fotografia da aniversariante fornecida

## Antes de publicar
Abra `js/script.js` e altere:
`const WHATSAPP_RESPONSAVEL = "244000000000";`

Use o número do responsável pelo aniversário no formato internacional, sem `+` e sem espaços.
Exemplo: `2449XXXXXXXXX`.

## Publicação no GitHub Pages
1. Crie um repositório.
2. Coloque todos os arquivos mantendo a estrutura das pastas.
3. Faça push para a branch principal.
4. Em Settings > Pages, selecione Deploy from a branch.
5. Escolha a branch principal e a pasta `/root`.
6. Abra o endereço gerado pelo GitHub Pages.

## Observação
O RSVP funciona sem backend: a confirmação abre o WhatsApp com uma mensagem pronta.

## Música opcional
Para colocar música de fundo:
1. Adicione um ficheiro MP3 em `assets/musica.mp3`.
2. Não precisa alterar o HTML.
3. Depois de o visitante tocar em “Toque para abrir o convite”, a página tentará iniciar a música.
4. O botão “♫ Música” permite ligar/desligar o som.

Se não existir `assets/musica.mp3`, a página continua a funcionar normalmente, sem erro visível.
