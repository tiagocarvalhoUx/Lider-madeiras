// Configurações globais do sistema
// Sistema usa OSRM (Open Source Routing Machine) - 100% GRATUITO!

// Atualizar status da API no header
function atualizarStatusAPI() {
    const apiStatus = document.getElementById('apiStatus');
    if (apiStatus) {
        apiStatus.textContent = '🌐 OSRM - Cálculo Gratuito de Distâncias';
    }

    const alertAPIStatus = document.getElementById('alertAPIStatus');
    if (alertAPIStatus) {
        alertAPIStatus.innerHTML =
            '<strong>✅ OSRM Ativo - 100% Gratuito!</strong>' +
            '<br>• Distâncias calculadas automaticamente por rotas reais' +
            '<br>• Sem necessidade de API Key' +
            '<br>• Use "➕ Adicionar" para novas cidades' +
            '<br>• Use "🔄 Calcular" para recalcular todas';
    }
}

// Configurações de pesos da madeira
const PESO_MADEIRA = {
    verde: 1000, // kg/m³
    seca: 500    // kg/m³
};
