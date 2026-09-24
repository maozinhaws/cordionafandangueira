# Cordiona Fandangueira

Portal institucional estático em HTML, CSS e JavaScript puro, pronto para hospedagem estática. A página abre com uma introdução audiovisual sem rolagem; o visitante avança por toque, teclado ou menu rápido em **“Conheça detalhes da banda”**. A experiência completa passa a oferecer Música, Agenda, Estrada, Banda e Estrutura.

## Estrutura

- `index.html` — metadados, conteúdo semântico e player de palco silencioso durante a abertura.
- `site.css` — design system responsivo em vermelho, bordô, amarelo e branco; regras mobile-first, `100dvh`, safe areas, foco visível e `prefers-reduced-motion`.
- `site.js` — estado de entrada, menu mobile, virada mensal, carrossel de registros rodoviários e navegação por teclado/toque.
- `media/` — logotipo e fotografia de palco recebidos pelo projeto, silhuetas ilustrativas para a agenda e miniaturas WebP para os cards de estrada.
- `admindabanda/` e `calendar-proxy.js` — serviços legados preservados, fora do escopo desta página estática.

## Agenda e interações

A folha da agenda inicia no mês corrente. Os botões anterior/próximo, setas do teclado e gesto horizontal avançam ou recuam o mês; avançar entra da direita e voltar da esquerda. A página usa animação curta só de `transform`/`opacity` e elimina-a em `prefers-reduced-motion`. Não há eventos publicados até este momento, então a folha informa que as datas ainda precisam de confirmação e encaminha para contato, sem inventar local, horário ou evento. Para apresentar uma agenda real, a banda deverá aprovar e fornecer as datas e definir a integração pública que as alimentará.

As silhuetas da seção são **ilustração conceitual gerada por IA**, não retratos nem posições verificadas dos instrumentistas reais. A formação apresentada como guia visual cita guitarra, contrabaixo, sanfona, afuxé, tamborim e caixa/prato; confirmar os instrumentos e sua disposição com a banda antes de afirmar isso como lineup oficial.

## Registros rodoviários

Os dois cartões são links para títulos públicos do YouTube: “GRUPO CORDIONA O GRUPO DO PORCA VÉIA NO RESUMÃO SLIDES DE BUS TOP SHOW” (publicado em 2020; vídeo atualmente indisponível na inspeção) e “Ônibus Comil HD do Grupo Cordiona”. As miniaturas locais foram reduzidas para WebP e mantêm o crédito por texto, título e link para a origem. **O projeto não afirma que nenhum desses veículos seja o atual**; confirme com a banda o ônibus atualmente em uso antes de alterar a legenda.

## Conteúdo e canais

A página preserva a fotografia do palco e o logotipo já existentes no repositório, além dos links de artista no Spotify, Deezer e do vídeo informado pela página antiga. A página oficial de vídeos foi vinculada em `https://www.grupocordiona.com.br/videos`. Mensagens comerciais continuam apontando para `contato@cordionafandangueira.com`; confirmar se esse endereço ainda é o contato correto.

## Pré-visualização local

Sem etapa de build. Sirva a raiz com qualquer servidor HTTP estático, por exemplo:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`. A conexão é necessária para o vídeo de fundo, para as fontes externas e para os links de música. Em conexões sem autoplay, o poster da fotografia do palco continua visível e os links oferecem acesso manual ao clipe. A página não inicia reprodução audível.

## Conteúdo que falta confirmar antes da publicação

Fotos aprovadas do ônibus antigo e do ônibus atual; datas/locais/horários da agenda; nomes, fotografias e ordem real dos integrantes/instrumentos; e confirmação do endereço de contato para shows.
