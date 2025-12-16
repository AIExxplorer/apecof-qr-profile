(function() {
  'use strict';
  console.log('[APECOF-AUTO] Macro iniciado');
  
  // Verificar se está em modo automático
  const params = new URLSearchParams(window.location.search);
  const auto = params.get('auto');
  const name = params.get('name');
  const state = params.get('state') || 'MG';
  
  if (!auto || !name) {
    console.log('[APECOF-AUTO] Modo automático desativado ou sem parâmetros');
    return;
  }
  
  console.log('[APECOF-AUTO] Auto=', auto, 'Name=', name, 'State=', state);
  
  // Aguardar formulário carregar
  async function autoFill() {
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      const stateSelect = document.querySelector('select');
      const nameInput = document.querySelector('input[placeholder*="nome"], input[placeholder*="Nome"]') || 
                       Array.from(document.querySelectorAll('input')).find(el => 
                         el.placeholder && el.placeholder.toLowerCase().includes('nome'));
      const searchBtn = Array.from(document.querySelectorAll('button')).find(el => 
                        el.textContent && el.textContent.toLowerCase().includes('buscar'));
      
      if (stateSelect && nameInput && searchBtn) {
        console.log('[APECOF-AUTO] Formulário encontrado!');
        
        // Preencher estado
        stateSelect.value = state;
        stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[APECOF-AUTO] Estado preenchido:', state);
        
        // Aguardar um pouco
        await new Promise(r => setTimeout(r, 300));
        
        // Preencher nome
        nameInput.focus();
        nameInput.value = name;
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[APECOF-AUTO] Nome preenchido:', name);
        
        // Aguardar um pouco
        await new Promise(r => setTimeout(r, 300));
        
        // Clicar botão buscar
        searchBtn.click();
        console.log('[APECOF-AUTO] Botão buscar clicado - Sucesso!');
        return;
      }
      
      attempts++;
      await new Promise(r => setTimeout(r, 200));
    }
    
    console.warn('[APECOF-AUTO] Formulário não encontrado após tentativas');
  }
  
  // Iniciar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoFill);
  } else {
    autoFill();
  }
})();
