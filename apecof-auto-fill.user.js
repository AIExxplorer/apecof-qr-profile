// ==UserScript==
// @name APECOF QR Profile Auto-Fill
// @namespace https://github.com/AIExxplorer/apecof-qr-profile
// @version 2.0.0
// @description Automatically fills APECOF map search form from URL parameters and executes search
// @author AIExxplorer
// @match https://sistema.apecof.org.br/mapa*
// @icon https://sistema.apecof.org.br/favicon.ico
// @grant none
// ==/UserScript==

(function() {
  'use strict';

  console.log('[APECOF-QR] Script iniciado');

  // Get name parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const nameParam = urlParams.get('name');
  const stateParam = urlParams.get('state');

  if (!nameParam) {
    console.log('[APECOF-QR] Nenhum parâmetro de nome encontrado');
    return;
  }

  console.log('[APECOF-QR] Parâmetro encontrado:', nameParam);

  // Map state codes to full names
  const stateMap = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia',
    'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás',
    'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
    'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí',
    'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul',
    'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
    'SE': 'Sergipe', 'TO': 'Tocantins'
  };
  const stateName = stateParam ? (stateMap[stateParam.toUpperCase()] || 'Minas Gerais') : 'Minas Gerais';

  // Function to find and fill form elements
  function fillForm() {
    try {
      console.log('[APECOF-QR] Tentando preencher formulário...');

      // Find state select - try different selectors
      let stateSelect = document.querySelector('select');
      if (!stateSelect) {
        stateSelect = document.querySelector('[name="state"]');
      }
      if (!stateSelect) {
        stateSelect = document.querySelector('[id*="state"]');
      }

      if (stateSelect) {
        stateSelect.value = stateName;
        stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
        stateSelect.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('[APECOF-QR] Estado preenchido:', stateName);
      } else {
        console.warn('[APECOF-QR] Select de estado não encontrado');
      }

      // Find name input - try multiple selectors
      let nameInput = document.querySelector('input[placeholder*="nome"], input[placeholder*="Nome"]');
      if (!nameInput) {
        nameInput = Array.from(document.querySelectorAll('input')).find(el =>
          el.placeholder && el.placeholder.toLowerCase().includes('nome')
        );
      }
      if (!nameInput) {
        nameInput = document.querySelector('input[type="text"]');
      }

      if (nameInput) {
        nameInput.focus();
        nameInput.value = nameParam;
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        nameInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        console.log('[APECOF-QR] Nome preenchido:', nameParam);
      } else {
        console.warn('[APECOF-QR] Campo de nome não encontrado');
      }

      // Find and click search button
      setTimeout(() => {
        try {
          // Try multiple selectors for button
          let searchBtn = Array.from(document.querySelectorAll('button')).find(el =>
            el.textContent && el.textContent.toLowerCase().includes('buscar')
          );
          if (!searchBtn) {
            searchBtn = document.querySelector('button[id*="search"], button[id*="buscar"]');
          }
          if (!searchBtn) {
            searchBtn = document.querySelector('#button-addon2');
          }

          if (searchBtn) {
            console.log('[APECOF-QR] Botão encontrado, clicando...');
            searchBtn.click();
            console.log('[APECOF-QR] Botão de busca clicado!');
          } else {
            console.warn('[APECOF-QR] Botão de busca não encontrado');
            // Fallback: try pressing Enter in the input field
            const inputs = document.querySelectorAll('input');
            if (inputs.length > 0) {
              inputs[inputs.length - 1].focus();
              inputs[inputs.length - 1].dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true
              }));
              console.log('[APECOF-QR] Enter pressionado no input');
            }
          }
        } catch (error) {
          console.error('[APECOF-QR] Erro ao clicar botão:', error);
        }
      }, 500);

    } catch (error) {
      console.error('[APECOF-QR] Erro ao preencher formulário:', error);
    }
  }

  // Multiple execution strategies for maximum compatibility
  // 1. On DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[APECOF-QR] DOMContentLoaded - executando...');
      fillForm();
    });
  } else {
    console.log('[APECOF-QR] Documento já carregado - executando imediatamente...');
    fillForm();
  }

  // 2. With progressive delays
  setTimeout(() => fillForm(), 300);
  setTimeout(() => fillForm(), 1000);
  setTimeout(() => fillForm(), 2000);
  setTimeout(() => fillForm(), 3500);

  // 3. On window load
  window.addEventListener('load', () => {
    console.log('[APECOF-QR] Window load - última tentativa...');
    setTimeout(() => fillForm(), 500);
  });

  // 4. MutationObserver para detectar quando o DOM é modificado (para frameworks JS)
  const observer = new MutationObserver(() => {
    console.log('[APECOF-QR] DOM modificado, tentando preencher...');
    fillForm();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'value']
  });

  // Stop observer after 10 seconds to avoid performance issues
  setTimeout(() => {
    observer.disconnect();
    console.log('[APECOF-QR] MutationObserver desconectado');
  }, 10000);

  console.log('[APECOF-QR] Script finalizado - aguardando eventos...');

})();
