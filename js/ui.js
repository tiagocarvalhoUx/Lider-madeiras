// Funções de interface do usuário

// Renderizar fornecedores
function renderizarFornecedores() {
    const tbody = document.getElementById('fornecedoresBody');

    if (fornecedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6c757d;">Nenhum fornecedor cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = fornecedores.map(f => `
        <tr>
            <td data-label="ID">${f.id}</td>
            <td data-label="Nome">
                <span class="fornecedor-nome-link" onclick="abrirModalFornecedor(${f.id})">${f.nome}</span>
            </td>
            <td data-label="Estado"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'estado', this.textContent)">${f.estado}</span></td>
            <td data-label="Cidade"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'cidade', this.textContent)">${f.cidade}</span></td>
            <td data-label="Email"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'email', this.textContent)">${f.email}</span></td>
            <td data-label="KM"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'km', this.textContent)">${f.km}</span></td>
        </tr>
    `).join('');
}

// Renderizar preços
function renderizarPrecos() {
    const tbody = document.getElementById('precosBody');

    if (precos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6c757d;">Nenhum preço cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = precos.map(p => {
        const fornecedor = fornecedores.find(f => f.id === p.fornecedorId);
        const nomeFornecedor = fornecedor ? fornecedor.nome : `ID ${p.fornecedorId}`;

        return `
        <tr>
            <td data-label="Fornecedor">${nomeFornecedor}</td>
            <td data-label="Espessura"><span class="editable-cell" contenteditable onblur="atualizarPrecoTabela(${p.id}, 'espessura', this.textContent)">${p.espessura}</span></td>
            <td data-label="Largura"><span class="editable-cell" contenteditable onblur="atualizarPrecoTabela(${p.id}, 'largura', this.textContent)">${p.largura}</span></td>
            <td data-label="Comprimento"><span class="editable-cell" contenteditable onblur="atualizarPrecoTabela(${p.id}, 'comprimento', this.textContent)">${p.comprimento}</span></td>
            <td data-label="Tipo"><span class="editable-cell" contenteditable onblur="atualizarPrecoTabela(${p.id}, 'tipo', this.textContent)">${p.tipo}</span></td>
            <td data-label="Preço"><span class="editable-cell" contenteditable onblur="atualizarPrecoTabela(${p.id}, 'preco', this.textContent)">${formatarNumero(p.preco)}</span></td>
        </tr>
        `;
    }).join('');
}

// Renderizar caminhões
function renderizarCaminhoes() {
    const tbody = document.getElementById('caminhoesBody');

    if (caminhoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6c757d;">Nenhum caminhão cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = caminhoes.map(c => `
        <tr>
            <td data-label="Tipo"><span class="editable-cell" contenteditable onblur="atualizarCaminhao(${c.id}, 'tipo', this.textContent)">${c.tipo}</span></td>
            <td data-label="Capacidade"><span class="editable-cell" contenteditable onblur="atualizarCaminhao(${c.id}, 'capacidade', this.textContent)">${c.capacidade}</span></td>
            <td data-label="Preço/KM"><span class="editable-cell" contenteditable onblur="atualizarCaminhao(${c.id}, 'precoPorKm', this.textContent)">${formatarNumero(c.precoPorKm)}</span></td>
            <td data-label="Preço P/ Tonelada"><span class="editable-cell" contenteditable onblur="atualizarCaminhao(${c.id}, 'precoPorTonelada', this.textContent)">${formatarNumero(c.precoPorTonelada || 0)}</span></td>
            <td data-label="KM do Cliente"><span class="editable-cell" contenteditable onblur="atualizarCaminhao(${c.id}, 'kmCliente', this.textContent)">${c.kmCliente || 0}</span></td>
            <td data-label="Frete Total"><span class="editable-cell" contenteditable onblur="atualizarCaminhao(${c.id}, 'freteTotal', this.textContent)">${formatarNumero(c.freteTotal || 0)}</span></td>
        </tr>
    `).join('');
}

// Renderizar distâncias
function renderizarDistancias() {
    const tbody = document.getElementById('distanciasBody');

    // Coletar todas as cidades únicas de destino
    const cidadesDestino = new Set();
    Object.values(distancias).forEach(dists => {
        Object.keys(dists).forEach(cidade => cidadesDestino.add(cidade));
    });

    // Atualizar cabeçalho da tabela
    const thead = document.querySelector('#tableDistancias thead tr');
    thead.innerHTML = '<th>Origem</th>' + Array.from(cidadesDestino).map(cidade => {
        const cidadeAbrev = cidade.split('/')[0].substring(0, 10);
        return `<th>${cidadeAbrev}</th>`;
    }).join('');

    // Renderizar linhas
    tbody.innerHTML = fornecedores.map(f => {
        const celulas = Array.from(cidadesDestino).map(cidadeDestino => {
            let distancia = 0;

            if (distancias[f.cidade] && distancias[f.cidade][cidadeDestino]) {
                distancia = distancias[f.cidade][cidadeDestino];
            } else if (f.distanciasClientes && f.distanciasClientes[cidadeDestino]) {
                distancia = f.distanciasClientes[cidadeDestino];
            }

            return `<td data-label="${cidadeDestino}"><span class="editable-cell" contenteditable onblur="atualizarDistanciaTabela('${f.cidade}', '${cidadeDestino}', this.textContent)">${distancia}</span></td>`;
        }).join('');

        return `<tr><td data-label="Origem"><strong>${f.cidade}</strong></td>${celulas}</tr>`;
    }).join('');
}

// Renderizar telefones
function renderizarTelefones() {
    const tbody = document.getElementById('telefonesBody');

    if (fornecedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6c757d;">Nenhum fornecedor cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = fornecedores.map(f => `
        <tr>
            <td data-label="ID">${f.id}</td>
            <td data-label="Fornecedor"><strong>${f.nome}</strong></td>
            <td data-label="Cidade">${f.cidade}</td>
            <td data-label="Telefone"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'telefone', this.textContent)">${f.telefone || '-'}</span></td>
            <td data-label="Celular"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'celular', this.textContent)">${f.celular || '-'}</span></td>
            <td data-label="WhatsApp"><span class="editable-cell" contenteditable onblur="atualizarFornecedor(${f.id}, 'whatsapp', this.textContent)">${f.whatsapp || '-'}</span></td>
        </tr>
    `).join('');
}

// Renderizar resultados
function renderizarResultados(resultados) {
    const container = document.getElementById('resultsContainer');
    const noResults = document.getElementById('noResults');

    if (resultados.length === 0) {
        container.classList.remove('active');
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    container.classList.add('active');

    container.innerHTML = resultados.map(r => `
        <div class="fornecedor-card ${r.ranking === 1 ? 'melhor' : ''}">
            <div class="fornecedor-header">
                <div class="fornecedor-nome">${r.fornecedor.nome}</div>
                <div class="ranking-badge ${r.ranking === 1 ? 'primeiro' : ''}">#${r.ranking}</div>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Custo Madeira</div>
                    <div class="info-value">${formatarMoeda(r.custoMadeira)}</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Peso Total</div>
                    <div class="info-value">${formatarNumero(r.pesoToneladas)} t</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Caminhão</div>
                    <div class="info-value">${r.caminhao.tipo}</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Distância</div>
                    <div class="info-value">${formatarNumero(r.distanciaKm, 0)} km</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Custo Frete</div>
                    <div class="info-value">${formatarMoeda(r.custoFrete)}</div>
                </div>

                <div class="info-item destaque">
                    <div class="info-label">Custo Total</div>
                    <div class="info-value">${formatarMoeda(r.custoTotal)}</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Receita</div>
                    <div class="info-value">${formatarMoeda(r.receitaTotal)}</div>
                </div>

                <div class="info-item ${r.lucro > 0 ? '' : 'destaque'}">
                    <div class="info-label">Lucro</div>
                    <div class="info-value" style="color: ${r.lucro > 0 ? '#28a745' : '#dc3545'}">${formatarMoeda(r.lucro)}</div>
                </div>

                <div class="info-item ${r.margemLucro > 0 ? '' : 'destaque'}">
                    <div class="info-label">Margem</div>
                    <div class="info-value" style="color: ${r.margemLucro > 0 ? '#28a745' : '#dc3545'}">${formatarNumero(r.margemLucro)}%</div>
                </div>
            </div>

            <div class="detalhes-produtos">
                <h4>📦 Detalhes dos Produtos</h4>
                ${r.detalheProdutos.map(p => `
                    <div class="produto-detail">
                        <div><strong>${p.descricao}</strong></div>
                        <div>${formatarNumero(p.m3)} m³</div>
                        <div>${formatarMoeda(p.precoUnitario)}/m³</div>
                        <div>${p.percentual}%</div>
                        <div><strong>${formatarMoeda(p.custoTotal)}</strong></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Atualizar fornecedor
function atualizarFornecedor(id, campo, valor) {
    const fornecedor = fornecedores.find(f => f.id === id);
    if (!fornecedor) return;

    if (campo === 'km') {
        fornecedor[campo] = parseFloat(valor) || 0;
    } else {
        fornecedor[campo] = valor;
    }

    salvarDados();
}

// Atualizar preço na tabela
function atualizarPrecoTabela(id, campo, valor) {
    const preco = precos.find(p => p.id === id);
    if (!preco) return;

    // Remover formatação
    valor = valor.replace(/\./g, '').replace(',', '.');

    if (['espessura', 'largura', 'comprimento', 'preco'].includes(campo)) {
        const numeroValor = parseFloat(valor);
        if (isNaN(numeroValor)) {
            alert('❌ Valor inválido!');
            renderizarPrecos();
            return;
        }
        preco[campo] = numeroValor;
    } else {
        preco[campo] = valor;
    }

    salvarDados();
    renderizarPrecos();
}

// Atualizar caminhão
function atualizarCaminhao(id, campo, valor) {
    const caminhao = caminhoes.find(c => c.id === id);
    if (!caminhao) return;

    // Remover formatação
    valor = valor.replace(/\./g, '').replace(',', '.');

    if (['capacidade', 'precoPorKm', 'precoPorTonelada', 'kmCliente', 'freteTotal'].includes(campo)) {
        const numeroValor = parseFloat(valor);
        if (isNaN(numeroValor)) {
            alert('❌ Valor inválido!');
            renderizarCaminhoes();
            return;
        }
        caminhao[campo] = numeroValor;
    } else {
        caminhao[campo] = valor;
    }

    salvarDados();
    renderizarCaminhoes();
}

// Atualizar distância na tabela
function atualizarDistanciaTabela(cidadeOrigem, cidadeDestino, valor) {
    const distancia = parseFloat(valor);

    if (isNaN(distancia) || distancia < 0) {
        alert('❌ Distância inválida!');
        renderizarDistancias();
        return;
    }

    if (!distancias[cidadeOrigem]) {
        distancias[cidadeOrigem] = {};
    }

    distancias[cidadeOrigem][cidadeDestino] = distancia;

    // Também atualizar no fornecedor
    const fornecedor = fornecedores.find(f => f.cidade === cidadeOrigem);
    if (fornecedor) {
        if (!fornecedor.distanciasClientes) {
            fornecedor.distanciasClientes = {};
        }
        fornecedor.distanciasClientes[cidadeDestino] = distancia;
    }

    salvarDados();
}

// Atualizar total de percentuais
function atualizarTotalPercentual() {
    const produtoRows = document.querySelectorAll('.produto-row');
    let total = 0;

    produtoRows.forEach((row, index) => {
        if (index === 0) return; // Pular header

        const percentual = parseFloat(row.querySelector('.percentual')?.value) || 0;
        total += percentual;
    });

    const totalElement = document.getElementById('totalPercentual');
    if (totalElement) {
        totalElement.textContent = formatarNumero(total, 0);
        totalElement.style.color = Math.abs(total - 100) < 0.01 ? '#28a745' : '#dc3545';
    }
}

// Event listeners para atualizar percentuais
document.addEventListener('DOMContentLoaded', () => {
    const percentualInputs = document.querySelectorAll('.percentual');
    percentualInputs.forEach(input => {
        input.addEventListener('input', atualizarTotalPercentual);
    });
});
