// Estruturas de dados do sistema
let fornecedores = [];
let precos = [];
let caminhoes = [];
let distancias = {};

// Cidades clientes padrão
const CIDADES_CLIENTES_PADRAO = [
    'Campo Grande/MS',
    'São Paulo/SP',
    'Curitiba/PR',
    'Porto Alegre/RS',
    'Belo Horizonte/MG'
];

// Dados iniciais de exemplo
function inicializarDados() {
    // Fornecedores de exemplo com cidades padrão
    fornecedores = [
        {
            id: 1,
            nome: 'Fornecedor A',
            estado: 'MT',
            cidade: 'Cuiabá/MT',
            email: 'fornecedora@email.com',
            km: 100,
            distanciasClientes: {
                'Campo Grande/MS': 0,
                'São Paulo/SP': 0,
                'Curitiba/PR': 0,
                'Porto Alegre/RS': 0,
                'Belo Horizonte/MG': 0
            }
        },
        {
            id: 2,
            nome: 'Fornecedor B',
            estado: 'SP',
            cidade: 'São Paulo/SP',
            email: 'fornecedorb@email.com',
            km: 150,
            distanciasClientes: {
                'Campo Grande/MS': 0,
                'São Paulo/SP': 0,
                'Curitiba/PR': 0,
                'Porto Alegre/RS': 0,
                'Belo Horizonte/MG': 0
            }
        },
        {
            id: 3,
            nome: 'Fornecedor C',
            estado: 'PR',
            cidade: 'Curitiba/PR',
            email: 'fornecedorc@email.com',
            km: 120,
            distanciasClientes: {
                'Campo Grande/MS': 0,
                'São Paulo/SP': 0,
                'Curitiba/PR': 0,
                'Porto Alegre/RS': 0,
                'Belo Horizonte/MG': 0
            }
        }
    ];

    // Preços de exemplo
    precos = [
        { id: 1, fornecedorId: 1, espessura: 2.0, largura: 30, comprimento: 6.0, tipo: 'Verde', preco: 1100 },
        { id: 2, fornecedorId: 1, espessura: 2.0, largura: 25, comprimento: 6.0, tipo: 'Verde', preco: 1080 },
        { id: 3, fornecedorId: 1, espessura: 2.0, largura: 20, comprimento: 6.0, tipo: 'Verde', preco: 1050 },
        { id: 4, fornecedorId: 2, espessura: 2.0, largura: 30, comprimento: 6.0, tipo: 'Verde', preco: 1150 },
        { id: 5, fornecedorId: 2, espessura: 2.0, largura: 25, comprimento: 6.0, tipo: 'Verde', preco: 1120 },
        { id: 6, fornecedorId: 2, espessura: 2.0, largura: 20, comprimento: 6.0, tipo: 'Verde', preco: 1090 }
    ];

    // Caminhões de exemplo
    caminhoes = [
        { id: 1, tipo: 'Truck', capacidade: 14, precoPorKm: 3.50, observacao: 'Até 14 toneladas' },
        { id: 2, tipo: 'Carreta', capacidade: 28, precoPorKm: 4.50, observacao: 'Até 28 toneladas' },
        { id: 3, tipo: 'Bitrem', capacidade: 45, precoPorKm: 6.00, observacao: 'Até 45 toneladas' }
    ];

    // Distâncias de exemplo
    distancias = {
        'Cuiabá/MT': { 'Campo Grande/MS': 700, 'São Paulo/SP': 1650, 'Curitiba/PR': 1950, 'Porto Alegre/RS': 2400, 'Belo Horizonte/MG': 1450 },
        'São Paulo/SP': { 'Campo Grande/MS': 1000, 'São Paulo/SP': 0, 'Curitiba/PR': 410, 'Porto Alegre/RS': 1120, 'Belo Horizonte/MG': 586 },
        'Curitiba/PR': { 'Campo Grande/MS': 1010, 'São Paulo/SP': 410, 'Curitiba/PR': 0, 'Porto Alegre/RS': 710, 'Belo Horizonte/MG': 1000 }
    };

    carregarDados();
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    localStorage.setItem('precos', JSON.stringify(precos));
    localStorage.setItem('caminhoes', JSON.stringify(caminhoes));
    localStorage.setItem('distancias', JSON.stringify(distancias));
}

// Carregar dados do localStorage
function carregarDados() {
    const fornecedoresSalvos = localStorage.getItem('fornecedores');
    const precosSalvos = localStorage.getItem('precos');
    const caminhoesSalvos = localStorage.getItem('caminhoes');
    const distanciasSalvas = localStorage.getItem('distancias');

    if (fornecedoresSalvos) fornecedores = JSON.parse(fornecedoresSalvos);
    if (precosSalvos) precos = JSON.parse(precosSalvos);
    if (caminhoesSalvos) caminhoes = JSON.parse(caminhoesSalvos);
    if (distanciasSalvas) distancias = JSON.parse(distanciasSalvas);

    // Migrar dados antigos: adicionar cidades padrão aos fornecedores que não têm
    migrarCidadesPadrao();
}

// Adicionar cidades padrão aos fornecedores existentes
function migrarCidadesPadrao() {
    let migrado = false;

    fornecedores.forEach(fornecedor => {
        // Se o fornecedor não tem distanciasClientes, criar objeto vazio
        if (!fornecedor.distanciasClientes) {
            fornecedor.distanciasClientes = {};
            migrado = true;
        }

        // Adicionar cidades padrão que estão faltando (com distância 0)
        CIDADES_CLIENTES_PADRAO.forEach(cidade => {
            if (!(cidade in fornecedor.distanciasClientes)) {
                fornecedor.distanciasClientes[cidade] = 0;
                migrado = true;
            }
        });
    });

    // Se houve migração, salvar os dados
    if (migrado) {
        console.log('✅ Dados migrados! Cidades padrão adicionadas aos fornecedores.');
        salvarDados();
    }
}

// Obter próximo ID disponível
function obterProximoId(array) {
    if (array.length === 0) return 1;
    return Math.max(...array.map(item => item.id)) + 1;
}

// Adicionar fornecedor
function adicionarFornecedor() {
    // Criar objeto com cidades padrão zeradas
    const distanciasClientes = {};
    CIDADES_CLIENTES_PADRAO.forEach(cidade => {
        distanciasClientes[cidade] = 0;
    });

    const novoFornecedor = {
        id: obterProximoId(fornecedores),
        nome: 'Novo Fornecedor',
        estado: 'MT',
        cidade: 'Cidade/UF',
        email: 'email@exemplo.com',
        km: 0,
        distanciasClientes: distanciasClientes
    };

    fornecedores.push(novoFornecedor);
    salvarDados();
    renderizarFornecedores();
}

// Adicionar preço
function adicionarPreco() {
    const novoPreco = {
        id: obterProximoId(precos),
        fornecedorId: fornecedores.length > 0 ? fornecedores[0].id : 1,
        espessura: 2.0,
        largura: 30,
        comprimento: 6.0,
        tipo: 'Verde',
        preco: 1000
    };

    precos.push(novoPreco);
    salvarDados();
    renderizarPrecos();
}

// Adicionar caminhão
function adicionarCaminhao() {
    const novoCaminhao = {
        id: obterProximoId(caminhoes),
        tipo: 'Novo Tipo',
        capacidade: 10,
        precoPorKm: 3.00,
        observacao: 'Observação'
    };

    caminhoes.push(novoCaminhao);
    salvarDados();
    renderizarCaminhoes();
}
