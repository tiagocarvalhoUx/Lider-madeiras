// Arquivo principal - Inicialização do sistema

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sistema Lider Calculadora iniciando...');

    // Inicializar dados
    inicializarDados();

    // Atualizar status da API
    atualizarStatusAPI();

    // Renderizar todas as tabelas
    renderizarFornecedores();
    renderizarPrecos();
    renderizarCaminhoes();
    renderizarDistancias();
    renderizarTelefones();

    // Configurar event listeners
    configurarEventListeners();

    console.log('✅ Sistema iniciado com sucesso!');
});

// Configurar event listeners
function configurarEventListeners() {
    // Event listeners para inputs de percentual
    const percentualInputs = document.querySelectorAll('.percentual');
    percentualInputs.forEach(input => {
        input.addEventListener('input', atualizarTotalPercentual);
        input.addEventListener('change', atualizarTotalPercentual);
    });

    // Atualizar total inicial
    atualizarTotalPercentual();

    // Event listener para tecla ESC fechar modais
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modalFornecedor = document.getElementById('modalFornecedor');
            const modalCidade = document.getElementById('modalAdicionarCidade');

            if (modalCidade.classList.contains('active')) {
                fecharModalCidade();
            } else if (modalFornecedor.classList.contains('active')) {
                fecharModal();
            }
        }
    });

    // Prevenir submit de formulários ao pressionar Enter
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            const modalCidade = document.getElementById('modalAdicionarCidade');
            if (modalCidade.classList.contains('active') && e.target.id === 'inputNovaCidade') {
                // Permitir Enter no input de cidade para confirmar
                return;
            }

            if (e.target.contentEditable === 'true' || e.target.tagName === 'INPUT') {
                e.preventDefault();
                e.target.blur();
            }
        }
    });
}

// Exportar dados (opcional)
function exportarDados() {
    const dados = {
        fornecedores: fornecedores,
        precos: precos,
        caminhoes: caminhoes,
        distancias: distancias,
        googleMapsApiKey: googleMapsApiKey ? '***CONFIGURADO***' : null
    };

    const json = JSON.stringify(dados, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lider-calculadora-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Dados exportados com sucesso!');
}

// Importar dados (opcional)
function importarDados() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dados = JSON.parse(event.target.result);

                if (dados.fornecedores) fornecedores = dados.fornecedores;
                if (dados.precos) precos = dados.precos;
                if (dados.caminhoes) caminhoes = dados.caminhoes;
                if (dados.distancias) distancias = dados.distancias;

                salvarDados();

                renderizarFornecedores();
                renderizarPrecos();
                renderizarCaminhoes();
                renderizarDistancias();
                renderizarTelefones();

                alert('✅ Dados importados com sucesso!');
            } catch (error) {
                alert('❌ Erro ao importar dados:\n' + error.message);
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// Limpar todos os dados (com confirmação)
function limparDados() {
    if (!confirm('⚠️ ATENÇÃO!\n\nIsso irá apagar TODOS os dados do sistema!\n\nTem certeza que deseja continuar?')) {
        return;
    }

    if (!confirm('⚠️ ÚLTIMA CONFIRMAÇÃO!\n\nTodos os fornecedores, preços, caminhões e distâncias serão perdidos!\n\nDeseja realmente continuar?')) {
        return;
    }

    localStorage.clear();
    fornecedores = [];
    precos = [];
    caminhoes = [];
    distancias = {};
    googleMapsApiKey = '';

    inicializarDados();
    atualizarStatusAPI();

    alert('✅ Todos os dados foram apagados e dados de exemplo foram carregados!');
}

// Log de informações do sistema (para debug)
function mostrarInfoSistema() {
    console.log('=== INFORMAÇÕES DO SISTEMA ===');
    console.log('Fornecedores:', fornecedores.length);
    console.log('Preços:', precos.length);
    console.log('Caminhões:', caminhoes.length);
    console.log('Distâncias:', Object.keys(distancias).length);
    console.log('API Google Maps:', googleMapsApiKey ? 'Configurada' : 'Não configurada');
    console.log('============================');

    alert(`📊 Informações do Sistema\n\n` +
          `• Fornecedores: ${fornecedores.length}\n` +
          `• Preços cadastrados: ${precos.length}\n` +
          `• Caminhões: ${caminhoes.length}\n` +
          `• Origens com distâncias: ${Object.keys(distancias).length}\n` +
          `• API Google Maps: ${googleMapsApiKey ? '✅ Configurada' : '❌ Não configurada'}`);
}

// Adicionar atalhos de teclado úteis
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+E = Exportar
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        exportarDados();
    }

    // Ctrl+Shift+I = Importar
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        importarDados();
    }

    // Ctrl+Shift+D = Info do Sistema
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        mostrarInfoSistema();
    }
});

console.log('💡 Dicas:');
console.log('  • Ctrl+Shift+E = Exportar dados');
console.log('  • Ctrl+Shift+I = Importar dados');
console.log('  • Ctrl+Shift+D = Informações do sistema');
