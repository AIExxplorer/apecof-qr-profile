// ========================================================
// APECOF MACRO INJECTOR - Universal Script Loader
// ========================================================
// Este script injeta a macro de automação na página APECOF
// Funciona em qualquer navegador (Desktop e Mobile)
// Não requer Tampermonkey ou nenhuma outra extensão
// ========================================================

(function() {
  'use strict';
  
  console.log('[APECOF-INJECTOR] Iniciando injetor de macro...');
  
  // Detectar se está na página correta do APECOF
  if (!window.location.href.includes('sistema.apecof.org.br/mapa')) {
    console.warn('[APECOF-INJECTOR] Não está na página APECOF mapa');
    return;
  }
  
  // Verificar parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const state = params.get('state') || 'MG';
  const auto = params.get('auto');
  
  console.log('[APECOF-INJECTOR] Parâmetros detectados:', { name, state, auto });
  
  // Se não estiver em modo auto, verifica localStorage
  let shouldExecute = auto === '1';
  
  if (!shouldExecute) {
    try {
      const storedData = JSON.parse(localStorage.getItem('apecof_bot_data'));
      shouldExecute = storedData && storedData.macro_enabled === true;
    } catch (e) {}
  }
  
  if (!shouldExecute || !name) {
    console.log('[APECOF-INJECTOR] Automação não ativada ou nome vazio');
    return;
  }
  
  console.log('[APECOF-INJECTOR] ✅ Ativando macro de automação');
  
  // ========================================================
  // MACRO: Funções de Automação
  // ========================================================
  
  function waitForElement(selector, maxWait = 5000, interval = 100) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el && el.offsetParent !== null) {
          clearInterval(checkInterval);
          console.log('[APECOF-MACRO] Elemento encontrado:', selector);
          resolve(el);
        } else if (Date.now() - startTime > maxWait) {
          clearInterval(checkInterval);
          console.warn('[APECOF-MACRO] Elemento não encontrado (timeout):', selector);
          resolve(null);
        }
      }, interval);
    });
  }
  
  function simulateEvent(element, eventType, options = {}) {
    if (!element) return false;
    try {
      const event = new Event(eventType, { bubbles: true, cancelable: true, ...options });
      element.dispatchEvent(event);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function setInputValue(input, value) {
    if (!input) return false;
    try {
      input.focus();
      input.value = '';
      input.value = value;
      simulateEvent(input, 'input');
      simulateEvent(input, 'change');
      simulateEvent(input, 'blur');
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function clickElement(element) {
    if (!element) return false;
    try {
      element.focus();
      element.click();
      simulateEvent(element, 'click');
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // ========================================================
  // EXECUÇÃO: Macro Principal
  // ========================================================
  
  async function executeMacro() {
    try {
      console.log('[APECOF-MACRO] Início da execução...');
      
      // Etapa 1: Aguardar página
      console.log('[APECOF-MACRO] [1/4] Aguardando página carregar...');
      await new Promise(r => setTimeout(r, 1000));
      
      // Etapa 2: Preencher Estado
      console.log('[APECOF-MACRO] [2/4] Preenchendo Estado: MG');
      const stateSelect = await waitForElement('select', 3000);
      if (stateSelect) {
        stateSelect.value = 'MG';
        simulateEvent(stateSelect, 'change');
        simulateEvent(stateSelect, 'input');
        console.log('[APECOF-MACRO] ✅ Estado preenchido');
      } else {
        console.warn('[APECOF-MACRO] ⚠️ Estado não encontrado');
      }
      
      await new Promise(r => setTimeout(r, 300));
      
      // Etapa 3: Preencher Nome
      console.log('[APECOF-MACRO] [3/4] Preenchendo Nome: ' + name);
      const nameInput = await waitForElement(
        'input[placeholder*="nome"], input[placeholder*="Nome"], input[placeholder*="associado"], input[type="text"]',
        3000
      );
      if (nameInput) {
        setInputValue(nameInput, name);
        console.log('[APECOF-MACRO] ✅ Nome preenchido');
      } else {
        console.warn('[APECOF-MACRO] ⚠️ Input de nome não encontrado');
      }
      
      await new Promise(r => setTimeout(r, 500));
      
      // Etapa 4: Clicar Buscar
      console.log('[APECOF-MACRO] [4/4] Procurando botão Buscar...');
      const buttons = document.querySelectorAll('button');
      let searchButton = null;
      
      for (let btn of buttons) {
        if (btn.textContent && btn.textContent.toLowerCase().includes('buscar')) {
          searchButton = btn;
          break;
        }
      }
      
      if (searchButton) {
        console.log('[APECOF-MACRO] ✅ Botão Buscar encontrado, clicando...');
        clickElement(searchButton);
        console.log('[APECOF-MACRO] ✅ AUTOMAÇÃO CONCLUÍDA COM SUCESSO!');
      } else {
        console.error('[APECOF-MACRO] ✗ Botão de busca não encontrado');
      }
      
    } catch (error) {
      console.error('[APECOF-MACRO] Erro durante execução:', error);
    }
  }
  
  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeMacro);
  } else {
    executeMacro();
  }
  
  // Retry: Tentar novamente se falhar
  setTimeout(() => executeMacro(), 1500);
  setTimeout(() => executeMacro(), 3000);
  
})();

console.log('[APECOF-INJECTOR] Script injetor carregado e ativado!');
