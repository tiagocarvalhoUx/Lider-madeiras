// Funções de cálculos do sistema

// Calcular fornecedores e gerar resultados
function calcularFornecedores() {
    const cidadeDestino = document.getElementById('cidadeDestino').value;
    const m3Total = parseFloat(document.getElementById('m3Total').value);
    const valorVenda = parseFloat(document.getElementById('valorVenda').value);
    const tipoMadeira = document.getElementById('tipoMadeira').value;

    // Validações
    if (!m3Total || m3Total <= 0) {
        alert('❌ M³ total deve ser maior que zero!');
        return;
    }

    if (!valorVenda || valorVenda <= 0) {
        alert('❌ Valor de venda deve ser maior que zero!');
        return;
    }

    // Coletar composição da carga
    const produtoRows = document.querySelectorAll('.produto-row');
    const composicao = [];
    let totalPercentual = 0;

    produtoRows.forEach((row, index) => {
        if (index === 0) return; // Pular header

        const espessura = parseFloat(row.querySelector('.espessura').value) || 0;
        const largura = parseFloat(row.querySelector('.largura').value) || 0;
        const percentual = parseFloat(row.querySelector('.percentual').value) || 0;

        if (percentual > 0) {
            composicao.push({ espessura, largura, percentual });
            totalPercentual += percentual;
        }
    });

    // Validar percentual
    if (Math.abs(totalPercentual - 100) > 0.01) {
        alert(`❌ A soma dos percentuais deve ser 100%! (Atual: ${totalPercentual}%)`);
        return;
    }

    // Calcular para cada fornecedor
    const resultados = [];

    fornecedores.forEach(fornecedor => {
        const resultado = calcularFornecedor(fornecedor, cidadeDestino, m3Total, valorVenda, tipoMadeira, composicao);
        if (resultado) {
            resultados.push(resultado);
        }
    });

    // Ordenar por custo total (menor primeiro)
    resultados.sort((a, b) => a.custoTotal - b.custoTotal);

    // Adicionar ranking
    resultados.forEach((r, index) => {
        r.ranking = index + 1;
    });

    // Renderizar resultados
    renderizarResultados(resultados);

    // Mostrar aba de resultados
    showTab(5);
}

// Calcular um fornecedor específico
function calcularFornecedor(fornecedor, cidadeDestino, m3Total, valorVenda, tipoMadeira, composicao) {
    // Buscar preços do fornecedor
    const precosFornecedor = precos.filter(p => p.fornecedorId === fornecedor.id && p.tipo.toLowerCase() === tipoMadeira.toLowerCase());

    if (precosFornecedor.length === 0) {
        console.log(`Fornecedor ${fornecedor.nome} não tem preços para madeira ${tipoMadeira}`);
        return null;
    }

    // Calcular custo da madeira por composição
    let custoMadeira = 0;
    const detalheProdutos = [];

    composicao.forEach(item => {
        const preco = precosFornecedor.find(p =>
            Math.abs(p.espessura - item.espessura) < 0.01 &&
            Math.abs(p.largura - item.largura) < 0.01
        );

        if (!preco) {
            console.log(`Produto ${item.espessura}x${item.largura} não encontrado para ${fornecedor.nome}`);
            return;
        }

        const m3Produto = (m3Total * item.percentual) / 100;
        const custoProduto = m3Produto * preco.preco;

        custoMadeira += custoProduto;

        detalheProdutos.push({
            descricao: `${item.espessura}x${item.largura}cm`,
            m3: m3Produto,
            precoUnitario: preco.preco,
            custoTotal: custoProduto,
            percentual: item.percentual
        });
    });

    // Calcular peso total
    const pesoToneladas = (m3Total * PESO_MADEIRA[tipoMadeira]) / 1000;

    // Selecionar caminhão adequado
    const caminhaoSelecionado = caminhoes
        .filter(c => c.capacidade >= pesoToneladas)
        .sort((a, b) => a.capacidade - b.capacidade)[0];

    if (!caminhaoSelecionado) {
        console.log(`Nenhum caminhão disponível para ${pesoToneladas}t`);
        return null;
    }

    // Buscar distância
    const distanciaKm = obterDistancia(fornecedor.cidade, cidadeDestino);

    if (!distanciaKm || distanciaKm === 0) {
        console.log(`Distância não encontrada de ${fornecedor.cidade} para ${cidadeDestino}`);
        return null;
    }

    // Calcular frete
    const custoFrete = distanciaKm * caminhaoSelecionado.precoPorKm;

    // Calcular totais
    const custoTotal = custoMadeira + custoFrete;
    const receitaTotal = m3Total * valorVenda;
    const lucro = receitaTotal - custoTotal;
    const margemLucro = (lucro / custoTotal) * 100;

    return {
        fornecedor: fornecedor,
        custoMadeira: custoMadeira,
        pesoToneladas: pesoToneladas,
        caminhao: caminhaoSelecionado,
        distanciaKm: distanciaKm,
        custoFrete: custoFrete,
        custoTotal: custoTotal,
        receitaTotal: receitaTotal,
        lucro: lucro,
        margemLucro: margemLucro,
        detalheProdutos: detalheProdutos,
        cidadeDestino: cidadeDestino,
        m3Total: m3Total,
        tipoMadeira: tipoMadeira
    };
}

// Obter distância entre cidades
function obterDistancia(cidadeOrigem, cidadeDestino) {
    // Tentar buscar na estrutura de distâncias
    if (distancias[cidadeOrigem] && distancias[cidadeOrigem][cidadeDestino]) {
        return distancias[cidadeOrigem][cidadeDestino];
    }

    // Tentar buscar nas distâncias do fornecedor
    const fornecedor = fornecedores.find(f => f.cidade === cidadeOrigem);
    if (fornecedor && fornecedor.distanciasClientes && fornecedor.distanciasClientes[cidadeDestino]) {
        return fornecedor.distanciasClientes[cidadeDestino];
    }

    // Tentar buscar KM base do fornecedor
    if (fornecedor && fornecedor.km) {
        return fornecedor.km;
    }

    return 0;
}

// Formatar moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formatar número
function formatarNumero(valor, casasDecimais = 2) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: casasDecimais, maximumFractionDigits: casasDecimais });
}
