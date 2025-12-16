# apecof-qr-profile
QR Code redirect to APECOF associate profile with auto-search

## Descrição

Este projeto automatiza o processo de busca de associados no mapa do APECOF através de QR codes. Quando um QR code é escaneado, o usuário é redirecionado para a página de mapa já com os parâmetros necessários para preencher automaticamente o formulário de busca.

## Componentes

### 1. Landing Page (Vercel)
- **URL:** https://apecof-profile-redirect.vercel.app/
- **Arquivo:** `index.html`
- **Função:** Recebe o QR code e redireciona para o mapa do APECOF com parâmetros de busca

### 2. Userscript Tampermonkey
- **Arquivo:** `apecof-auto-fill.user.js`
- **Função:** Preenche automaticamente o formulário de busca quando a página do APECOF é carregada

## Como Usar

### Pré-requisitos
1. Instalar extensão **Tampermonkey** ou **Greasemonkey**:
   - [Tampermonkey para Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobela)
   - [Tampermonkey para Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### Instalação do Userscript
1. Acesse o arquivo do userscript: https://raw.githubusercontent.com/AIExxplorer/apecof-qr-profile/main/apecof-auto-fill.user.js
2. O Tampermonkey reconhecerá o arquivo e mostrará um botão "Instalar este script"
3. Clique em "Instalar" e confirme

### Uso
1. Escaneie um QR code que aponta para: `https://apecof-profile-redirect.vercel.app/`
2. Você será redirecionado para o mapa do APECOF
3. O formulário será preenchido automaticamente com:
   - **Estado:** Minas Gerais (MG)
   - **Nome:** Wagner Rafael Assunção Pereira
4. O botão "Buscar" será clicado automaticamente
5. Os resultados aparecem na página

## Fluxo de Funcionamento

```
1. Scan QR Code
   ↓
2. Redireciona para Vercel (apecof-profile-redirect.vercel.app)
   ↓
3. Vercel redireciona para APECOF com parâmetro: ?name=Wagner%20Rafael%20Assun%C3%A7%C3%A3o%20Pereira
   ↓
4. Userscript Tampermonkey lê o parâmetro da URL
   ↓
5. Preenche o formulário automaticamente
   ↓
6. Clica em "Buscar"
   ↓
7. Exibe o perfil do associado
```

## Arquivos

- `index.html` - Landing page com redirect automático
- `apecof-auto-fill.user.js` - Script Tampermonkey para automação
- `README.md` - Este arquivo
- `vercel.json` - Configuração Vercel

## Gerar QR Code

Use a ferramenta online para gerar um QR code apontando para:
```
https://apecof-profile-redirect.vercel.app/
```

## Suporte

Para issues ou dúvidas, abra uma issue neste repositório.

## Licença

MIT
