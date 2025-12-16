// ==UserScript==
// @name         APECOF QR Profile Auto-Fill
// @namespace    https://github.com/AIExxplorer/apecof-qr-profile
// @version      1.0.0
// @description  Automatically fills APECOF map search form from URL parameters
// @author       AIExxplorer
// @match        https://sistema.apecof.org.br/mapa*
// @icon         https://sistema.apecof.org.br/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Get name parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    
    if (!nameParam) {
        console.log('[APECOF-QR] No name parameter found in URL');
        return;
    }
    
    console.log('[APECOF-QR] Found name parameter:', nameParam);
    
    // Function to fill the form
    function fillForm() {
        try {
            // Find state select element
            const stateSelect = document.querySelector('select');
            if (stateSelect) {
                // Try to set MG value
                stateSelect.value = 'MG';
                // Dispatch change event
                stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('[APECOF-QR] State set to MG');
            } else {
                console.warn('[APECOF-QR] State select not found');
            }
            
            // Find name input
            const nameInput = document.querySelector('input[placeholder*="nome"]') || 
                             document.querySelector('input[placeholder*="Nome"]') ||
                             Array.from(document.querySelectorAll('input')).find(el => 
                                 el.placeholder && el.placeholder.toLowerCase().includes('nome')
                             );
            
            if (nameInput) {
                nameInput.focus();
                nameInput.value = nameParam;
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                nameInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('[APECOF-QR] Name filled:', nameParam);
            } else {
                console.warn('[APECOF-QR] Name input not found');
            }
            
            // Find and click search button
            setTimeout(() => {
                const searchBtn = Array.from(document.querySelectorAll('button')).find(el =>
                    el.textContent && el.textContent.toLowerCase().includes('buscar')
                );
                
                if (searchBtn) {
                    searchBtn.click();
                    console.log('[APECOF-QR] Search button clicked');
                } else {
                    console.warn('[APECOF-QR] Search button not found');
                }
            }, 300);
            
        } catch (error) {
            console.error('[APECOF-QR] Error filling form:', error);
        }
    }
    
    // Wait for DOM to be ready and try to fill the form
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fillForm);
    } else {
        fillForm();
    }
    
    // Also try after a delay in case elements load later
    setTimeout(fillForm, 500);
    setTimeout(fillForm, 1500);
})();
