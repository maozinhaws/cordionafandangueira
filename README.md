# Cordiona Fandangueira

Site institucional estático da banda. A página pública é HTML, CSS e JavaScript sem framework ou build, pronta para publicação estática (por exemplo, GitHub Pages).

## Estrutura

- `index.html` — página inicial pública e metadados sociais.
- `site.css` — tokens e estilos responsivos: carvão, creme, verde-floresta e cobre; sem animações ou motion guiado por rolagem.
- `site.js` — menu mobile acessível e ano do rodapé.
- `media/` — logo, foto real do palco e textura editorial otimizada em WebP.
- `admindabanda/` — painel legado, preservado e não modificado neste redesign.
- `calendar-proxy.js` — integração legada do calendário; não é necessária para a página estática atual.

## Conteúdo e integrações

O vídeo do YouTube, o artista no Spotify e o link do Deezer foram mantidos a partir do site existente. A página não exibe eventos com datas inventadas: a agenda informa que as datas estão sob consulta e encaminha para o contato comercial. Antes de publicar, confirme se `contato@cordionafandangueira.com` é o endereço comercial correto e atualize textos, meios de contato e agenda conforme necessário.

A foto do palco e o logo são assets já existentes no repositório. A textura histórica é uma composição editorial decorativa, não uma fotografia documental. Nenhuma história, data ou ônibus real foi inventado.

## Pré-visualização local

Como não há build nem dependências, sirva a raiz com qualquer servidor HTTP estático. Por exemplo:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`. Os embeds de vídeo e música dependem de conexão à internet. A atualização de conteúdo não requer processo de compilação.
