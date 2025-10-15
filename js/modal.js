// Gerenciamento de modais

let fornecedorAtual = null;

// Abrir modal de fornecedor
function abrirModalFornecedor(fornecedorId) {
    fornecedorAtual = fornecedores.find(f => f.id === fornecedorId);

    if (!fornecedorAtual) {
        alert('Fornecedor não encontrado!');
        return;
    }

    // Atualizar título
    document.getElementById('modalTitulo').textContent = `📋 ${fornecedorAtual.nome}`;

    // Renderizar dados cadastrais
    renderizarDadosCadastraisModal();

    // Renderizar preços
    renderizarPrecosModal();

    // Renderizar distâncias
    renderizarDistanciasModal();

    // Mostrar modal
    document.getElementById('modalFornecedor').classList.add('active');
}

// Fechar modal de fornecedor
function fecharModal() {
    document.getElementById('modalFornecedor').classList.remove('active');
    fornecedorAtual = null;

    // Atualizar tabelas principais
    renderizarFornecedores();
    renderizarDistancias();
}

// Renderizar dados cadastrais no modal
function renderizarDadosCadastraisModal() {
    const container = document.getElementById('modalDadosCadastrais');

    const campos = [
        { label: 'Nome', chave: 'nome', editavel: true },
        { label: 'Estado', chave: 'estado', editavel: true },
        { label: 'Cidade', chave: 'cidade', editavel: true },
        { label: 'Email', chave: 'email', editavel: true },
        { label: 'KM Base', chave: 'km', editavel: true }
    ];

    container.innerHTML = campos.map(campo => `
        <div class="data-item">
            <div class="data-label">${campo.label}</div>
            <div class="data-value ${campo.editavel ? 'modal-editable-cell' : ''}"
                 contenteditable="${campo.editavel}"
                 data-campo="${campo.chave}"
                 onblur="atualizarCampoFornecedor('${campo.chave}', this.textContent)">${fornecedorAtual[campo.chave]}</div>
        </div>
    `).join('');
}

// Renderizar distâncias no modal
function renderizarDistanciasModal() {
    const container = document.getElementById('modalDistanciasCadastrais');

    if (!fornecedorAtual.distanciasClientes) {
        fornecedorAtual.distanciasClientes = {};
    }

    const distanciasArray = Object.entries(fornecedorAtual.distanciasClientes);

    // FILTRAR: Mostrar APENAS cidades com distância > 0
    const distanciasCalculadas = distanciasArray.filter(([cidade, distancia]) => {
        const dist = typeof distancia === 'number' ? distancia : parseFloat(distancia) || 0;
        return dist > 0;
    });

    if (distanciasCalculadas.length === 0) {
        container.innerHTML = '<p style="color: #6c757d; text-align: center; grid-column: 1/-1; padding: 20px;">Clique em "🔄 Calcular" para adicionar cidades automaticamente.</p>';
        return;
    }

    container.innerHTML = distanciasCalculadas.map(([cidade, distancia]) => {
        // Garantir que distancia é um número válido
        const distanciaNumero = typeof distancia === 'number' ? distancia : parseFloat(distancia) || 0;
        const distanciaFormatada = Math.round(distanciaNumero);

        return `
        <div class="distancia-card" data-cidade="${cidade}">
            <button class="btn-remove-cidade" onclick="event.stopPropagation(); removerCidadeCliente('${cidade}')" title="Remover cidade">×</button>
            <div class="distancia-icone">📍</div>
            <div class="distancia-cidade modal-editable-cell"
                 contenteditable="true"
                 onblur="editarNomeCidadeCliente('${cidade}', this.textContent)">${cidade}</div>
            <div class="distancia-valor modal-editable-cell"
                 contenteditable="true"
                 data-cidade="${cidade}"
                 onblur="editarDistanciaCidade('${cidade}', this.textContent)">${distanciaFormatada}</div>
            <div class="distancia-km">km</div>
        </div>
        `;
    }).join('');
}

// Renderizar preços no modal
function renderizarPrecosModal() {
    const precosVerde = precos.filter(p => p.fornecedorId === fornecedorAtual.id && p.tipo === 'Verde');
    const precosSeca = precos.filter(p => p.fornecedorId === fornecedorAtual.id && p.tipo === 'Seca');

    renderizarTabelaPrecosModal('modalPrecosVerde', precosVerde);
    renderizarTabelaPrecosModal('modalPrecosSeca', precosSeca);
}

// Renderizar tabela de preços no modal
function renderizarTabelaPrecosModal(elementId, precosLista) {
    const tbody = document.getElementById(elementId);

    if (precosLista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #6c757d;">Nenhum preço cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = precosLista.map(preco => `
        <tr>
            <td><span class="modal-editable-cell" contenteditable onblur="atualizarPreco(${preco.id}, 'espessura', this.textContent)">${preco.espessura}</span></td>
            <td><span class="modal-editable-cell" contenteditable onblur="atualizarPreco(${preco.id}, 'largura', this.textContent)">${preco.largura}</span></td>
            <td><span class="modal-editable-cell" contenteditable onblur="atualizarPreco(${preco.id}, 'comprimento', this.textContent)">${preco.comprimento}</span></td>
            <td><span class="modal-editable-cell" contenteditable onblur="atualizarPreco(${preco.id}, 'preco', this.textContent)">${formatarNumero(preco.preco)}</span></td>
            <td><button class="btn-remove" onclick="removerPreco(${preco.id})">🗑️</button></td>
        </tr>
    `).join('');
}

// Atualizar campo do fornecedor
function atualizarCampoFornecedor(campo, valor) {
    if (!fornecedorAtual) return;

    if (campo === 'km') {
        fornecedorAtual[campo] = parseFloat(valor) || 0;
    } else {
        fornecedorAtual[campo] = valor;
    }

    salvarDados();
}

// Adicionar cidade cliente
function adicionarCidadeCliente() {
    document.getElementById('modalAdicionarCidade').classList.add('active');
    document.getElementById('inputNovaCidade').value = '';
    document.getElementById('inputNovaCidade').focus();
}

// Fechar modal de adicionar cidade
function fecharModalCidade() {
    document.getElementById('modalAdicionarCidade').classList.remove('active');
}

// Confirmar adicionar cidade
async function confirmarAdicionarCidade() {
    const novaCidade = document.getElementById('inputNovaCidade').value.trim();
    const calcularAuto = document.getElementById('checkCalcularAuto').checked;

    if (!novaCidade) {
        alert('❌ Digite o nome da cidade!');
        return;
    }

    if (!fornecedorAtual.distanciasClientes) {
        fornecedorAtual.distanciasClientes = {};
    }

    // Verificar se já existe
    if (fornecedorAtual.distanciasClientes[novaCidade]) {
        alert('❌ Esta cidade já está cadastrada!');
        return;
    }

    let distancia = 0;
    let btn = null;

    if (calcularAuto) {
        // Encontrar o botão corretamente
        btn = document.querySelector('#modalAdicionarCidade .btn');

        if (!btn) {
            console.error('Botão Confirmar não encontrado!');
            return;
        }

        try {
            // Desabilitar botão e mostrar loading
            btn.disabled = true;
            btn.textContent = '⏳ Calculando...';

            console.log(`🔍 Calculando distância: ${fornecedorAtual.cidade} → ${novaCidade}`);

            const resultado = await calcularDistanciaInteligente(fornecedorAtual.cidade, novaCidade);
            distancia = resultado.distancia;

            console.log(`✅ Distância calculada: ${distancia} km (${resultado.metodo})`);

            alert(`✅ Distância calculada: ${distancia} km\nMétodo: ${resultado.metodo}`);
        } catch (error) {
            console.error('❌ Erro ao calcular:', error);
            alert(`⚠️ Não foi possível calcular automaticamente.\nErro: ${error.message}\n\nA cidade será adicionada com distância 0.\nVocê pode editar depois.`);
            distancia = 0;
        } finally {
            // SEMPRE resetar o botão
            if (btn) {
                btn.disabled = false;
                btn.textContent = '✓ Confirmar';
                console.log('✅ Botão resetado');
            }
        }
    }

    // Adicionar cidade (com distância calculada ou 0)
    fornecedorAtual.distanciasClientes[novaCidade] = distancia;
    salvarDados();

    console.log(`➕ Cidade adicionada: ${novaCidade} = ${distancia} km`);

    // Se calculou distância > 0, criar card dinamicamente
    if (distancia > 0) {
        atualizarCardDistancia(novaCidade, distancia);
    } else {
        // Se distância = 0, apenas fechar (não mostra card)
        renderizarDistanciasModal();
    }

    // Fechar modal e limpar input
    fecharModalCidade();
    document.getElementById('inputNovaCidade').value = '';

    console.log('✅ Modal fechado e pronto para nova adição');
}

// Remover cidade cliente
function removerCidadeCliente(cidade) {
    if (!confirm(`Tem certeza que deseja remover "${cidade}"?`)) return;

    delete fornecedorAtual.distanciasClientes[cidade];
    salvarDados();
    renderizarDistanciasModal();
}

// Editar nome da cidade cliente
function editarNomeCidadeCliente(cidadeAntiga, cidadeNova) {
    cidadeNova = cidadeNova.trim();

    if (cidadeNova === cidadeAntiga) return;

    if (!cidadeNova) {
        alert('❌ O nome da cidade não pode estar vazio!');
        renderizarDistanciasModal();
        return;
    }

    if (fornecedorAtual.distanciasClientes[cidadeNova]) {
        alert('❌ Já existe uma cidade com este nome!');
        renderizarDistanciasModal();
        return;
    }

    const distancia = fornecedorAtual.distanciasClientes[cidadeAntiga];
    delete fornecedorAtual.distanciasClientes[cidadeAntiga];
    fornecedorAtual.distanciasClientes[cidadeNova] = distancia;

    salvarDados();
    renderizarDistanciasModal();
}

// Editar distância da cidade
function editarDistanciaCidade(cidade, novaDistancia) {
    const distancia = parseFloat(novaDistancia);

    if (isNaN(distancia) || distancia < 0) {
        alert('❌ Distância inválida!');
        renderizarDistanciasModal();
        return;
    }

    fornecedorAtual.distanciasClientes[cidade] = distancia;
    salvarDados();
}

// Adicionar NOVO card dinamicamente quando distância é calculada
function atualizarCardDistancia(cidade, distancia) {
    const container = document.getElementById('modalDistanciasCadastrais');
    const distanciaFormatada = Math.round(distancia);

    // Verificar se o card já existe
    const cardExistente = container.querySelector(`[data-cidade="${cidade}"]`);

    if (cardExistente) {
        // Card já existe, apenas atualizar o valor
        const valorElement = cardExistente.querySelector('.distancia-valor');
        if (valorElement) {
            valorElement.textContent = distanciaFormatada;

            // Efeito visual de atualização
            cardExistente.style.transition = 'all 0.3s';
            cardExistente.style.borderColor = '#28a745';
            cardExistente.style.background = 'linear-gradient(to bottom, #d4edda 0%, white 30%)';

            setTimeout(() => {
                cardExistente.style.borderColor = '#e9ecef';
                cardExistente.style.background = 'white';
            }, 1000);

            console.log(`✨ Card atualizado: ${cidade} = ${distanciaFormatada} km`);
        }
    } else {
        // Card NÃO existe, CRIAR NOVO CARD
        console.log(`➕ Criando NOVO card para: ${cidade}`);

        // Remover mensagem de "Clique em Calcular" se existir
        const mensagemVazia = container.querySelector('p');
        if (mensagemVazia) {
            mensagemVazia.remove();
        }

        // Criar novo card HTML
        const novoCard = document.createElement('div');
        novoCard.className = 'distancia-card';
        novoCard.setAttribute('data-cidade', cidade);
        novoCard.innerHTML = `
            <button class="btn-remove-cidade" onclick="event.stopPropagation(); removerCidadeCliente('${cidade}')" title="Remover cidade">×</button>
            <div class="distancia-icone">📍</div>
            <div class="distancia-cidade modal-editable-cell"
                 contenteditable="true"
                 onblur="editarNomeCidadeCliente('${cidade}', this.textContent)">${cidade}</div>
            <div class="distancia-valor modal-editable-cell"
                 contenteditable="true"
                 data-cidade="${cidade}"
                 onblur="editarDistanciaCidade('${cidade}', this.textContent)">${distanciaFormatada}</div>
            <div class="distancia-km">km</div>
        `;

        // Adicionar ao container
        container.appendChild(novoCard);

        // Efeito de entrada com animação
        novoCard.style.opacity = '0';
        novoCard.style.transform = 'scale(0.8)';

        setTimeout(() => {
            novoCard.style.transition = 'all 0.4s ease-out';
            novoCard.style.opacity = '1';
            novoCard.style.transform = 'scale(1)';

            // Efeito verde após aparecer
            setTimeout(() => {
                novoCard.style.borderColor = '#28a745';
                novoCard.style.background = 'linear-gradient(to bottom, #d4edda 0%, white 30%)';

                setTimeout(() => {
                    novoCard.style.borderColor = '#e9ecef';
                    novoCard.style.background = 'white';
                }, 1000);
            }, 400);
        }, 50);

        console.log(`✨ NOVO card criado: ${cidade} = ${distanciaFormatada} km`);
    }
}

// Calcular distâncias via API
async function calcularDistanciasAPI() {
    if (!fornecedorAtual.distanciasClientes || Object.keys(fornecedorAtual.distanciasClientes).length === 0) {
        alert('❌ Nenhuma cidade cadastrada para calcular!\n\nClique em "➕ Adicionar" primeiro.');
        return;
    }

    const cidades = Object.keys(fornecedorAtual.distanciasClientes);
    let sucessos = 0;
    let falhas = 0;

    const btnCalcular = event.target;
    btnCalcular.disabled = true;
    btnCalcular.innerHTML = '<span class="loading-spinner">⏳</span> Calculando...';

    console.log(`🚀 Iniciando cálculo de ${cidades.length} cidades...`);

    for (let i = 0; i < cidades.length; i++) {
        const cidade = cidades[i];

        console.log(`📍 [${i + 1}/${cidades.length}] Calculando: ${fornecedorAtual.cidade} → ${cidade}`);

        // Atualizar botão com progresso
        btnCalcular.innerHTML = `<span class="loading-spinner">⏳</span> ${i + 1}/${cidades.length}...`;

        try {
            const resultado = await calcularDistanciaInteligente(fornecedorAtual.cidade, cidade);
            fornecedorAtual.distanciasClientes[cidade] = resultado.distancia;

            console.log(`✅ ${cidade}: ${resultado.distancia} km (${resultado.metodo})`);
            console.log(`📊 Objeto atualizado:`, fornecedorAtual.distanciasClientes);

            sucessos++;

            // Salvar dados
            salvarDados();

            // ATUALIZAR CARD DIRETAMENTE SEM RE-RENDERIZAR TUDO
            atualizarCardDistancia(cidade, resultado.distancia);

            console.log(`🔄 Card ${cidade} atualizado com ${resultado.distancia} km`);

            // Delay de 500ms entre requisições para não sobrecarregar a API
            if (i < cidades.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`❌ Erro ao calcular ${cidade}:`, error.message);
            falhas++;
        }
    }

    btnCalcular.disabled = false;
    btnCalcular.innerHTML = '🔄 Calcular';

    salvarDados();
    renderizarDistanciasModal();

    console.log(`🎉 Cálculo concluído! Sucessos: ${sucessos}, Falhas: ${falhas}`);

    alert(`✅ Cálculo concluído!\n\n• ${sucessos} distâncias calculadas\n• ${falhas} falhas\n\nVeja os detalhes no console (F12)`);
}

// Adicionar produto no modal
function adicionarProdutoModal(tipo) {
    const novoPreco = {
        id: obterProximoId(precos),
        fornecedorId: fornecedorAtual.id,
        espessura: 2.0,
        largura: 30,
        comprimento: 6.0,
        tipo: tipo,
        preco: 1000
    };

    precos.push(novoPreco);
    salvarDados();
    renderizarPrecosModal();
}

// Atualizar preço
function atualizarPreco(precoId, campo, valor) {
    const preco = precos.find(p => p.id === precoId);
    if (!preco) return;

    // Remover formatação de número
    valor = valor.replace(/\./g, '').replace(',', '.');

    const numeroValor = parseFloat(valor);

    if (isNaN(numeroValor)) {
        alert('❌ Valor inválido!');
        renderizarPrecosModal();
        return;
    }

    preco[campo] = numeroValor;
    salvarDados();
}

// Remover preço
function removerPreco(precoId) {
    if (!confirm('Tem certeza que deseja remover este preço?')) return;

    const index = precos.findIndex(p => p.id === precoId);
    if (index > -1) {
        precos.splice(index, 1);
        salvarDados();
        renderizarPrecosModal();
    }
}

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'modalFornecedor') {
            fecharModal();
        } else if (e.target.id === 'modalAdicionarCidade') {
            fecharModalCidade();
        }
    }
});
