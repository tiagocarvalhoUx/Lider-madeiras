# 📊 Sistema Comparador Editável - Grupo Lider Madeiras

Sistema completo para comparação de fornecedores de madeira com cálculo automático de custos, fretes e margens de lucro.

## 🚀 Funcionalidades

### ✅ Principais Recursos

- **Gestão de Fornecedores/Clientes**: Cadastro completo com dados, contatos e localização
- **Tabela de Preços**: Controle de preços por produto (espessura, largura, comprimento)
- **Cálculo de Fretes**: Sistema inteligente com múltiplos métodos de cálculo de distâncias
- **Simulação de Vendas**: Compare todos os fornecedores em uma única simulação
- **Ranking Automático**: Identifica automaticamente a melhor opção de fornecedor
- **100% Editável**: Todos os campos podem ser editados diretamente nas tabelas

### 🔧 Recursos Técnicos

- **OSRM (Padrão)**: Cálculo de rotas 100% GRATUITO por estradas reais
- **Haversine (Fallback)**: Cálculo aproximado quando OSRM não disponível
- **LocalStorage**: Todos os dados são salvos automaticamente no navegador
- **Responsivo**: Interface adaptada para desktop, tablet e mobile
- **Sem Configuração**: Funciona imediatamente, sem necessidade de API Keys

## 📁 Estrutura do Projeto

```
Lider-Calculadora/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos do sistema
├── js/
│   ├── config.js          # Configurações globais
│   ├── data.js            # Estruturas de dados e persistência
│   ├── api.js             # Integração com APIs de distância
│   ├── calculations.js    # Lógica de cálculos
│   ├── ui.js              # Renderização de interface
│   ├── tabs.js            # Gerenciamento de abas
│   ├── modal.js           # Gerenciamento de modais
│   └── main.js            # Inicialização do sistema
└── README.md              # Este arquivo
```

## 🎯 Como Usar

### 1. Instalação

Não precisa instalar nada! Basta abrir o arquivo `index.html` no navegador.

### 2. Configuração Inicial

#### Aba 1: Fornecedores/Clientes
- Adicione seus fornecedores e clientes
- Clique no nome para configurar detalhes, preços e distâncias
- Todos os campos são editáveis

#### Aba 2: Preços
- Configure os preços da madeira por produto
- Organize por fornecedor, espessura, largura e tipo (verde/seca)

#### Aba 3: Caminhões
- Configure os tipos de caminhão disponíveis
- Defina capacidade e preço por KM

#### Aba 4: Distâncias
- Visualize e edite distâncias entre fornecedores e clientes
- Use o modal do fornecedor para gerenciar cidades

### 3. Usando o Sistema

#### Simular uma Venda
1. Vá para **Aba 5: Simulação**
2. Configure:
   - Cidade de destino
   - M³ total
   - Valor de venda
   - Tipo de madeira
   - Composição da carga (percentuais)
3. Clique em **"🔍 Analisar Fornecedores/Clientes"**
4. Veja os resultados na **Aba 6: Resultados**

#### Calcular Distâncias Automaticamente
1. Abra o modal de um fornecedor (clique no nome)
2. Vá até "📍 Distâncias para Clientes"
3. Clique em "➕ Adicionar" para adicionar cidades
4. Marque "🔄 Calcular automaticamente"
5. Ou clique em "🔄 Calcular" para recalcular todas

## 🔑 Atalhos de Teclado

- **Ctrl+Shift+E**: Exportar dados
- **Ctrl+Shift+I**: Importar dados
- **Ctrl+Shift+D**: Informações do sistema
- **ESC**: Fechar modais

## 💾 Backup e Restauração

### Exportar Dados
```javascript
// No console do navegador ou use Ctrl+Shift+E
exportarDados();
```

### Importar Dados
```javascript
// No console do navegador ou use Ctrl+Shift+I
importarDados();
```

## 🧮 Fórmulas de Cálculo

### Custo Total
```
Custo Total = Custo Madeira + Custo Frete
```

### Custo da Madeira
```
Custo Madeira = Σ (M³ produto × Preço produto)
```

### Peso Total
```
Peso (toneladas) = M³ × Densidade
- Madeira Verde: 1000 kg/m³
- Madeira Seca: 500 kg/m³
```

### Custo do Frete
```
Custo Frete = Distância (km) × Preço/KM do caminhão
```

### Margem de Lucro
```
Margem (%) = (Receita - Custo Total) / Custo Total × 100
```

## 🌐 Métodos de Cálculo de Distância

### 🥇 OSRM - Open Source Routing Machine (PADRÃO)
- **Precisão**: ★★★★★ (Alta - Rota Real)
- **Custo**: 100% GRATUITO
- **Vantagens**:
  - Calcula rotas reais por estradas
  - Sem necessidade de API Key
  - Sem limites de requisições
  - Sempre ativo por padrão
- **Serviço**: `router.project-osrm.org`

### 🥈 Haversine (FALLBACK Automático)
- **Precisão**: ★★★☆☆ (Aproximada)
- **Custo**: 100% GRATUITO
- **Vantagens**:
  - Funciona sempre, mesmo offline
  - Cálculo matemático instantâneo
  - Não depende de internet
- **Observação**: Multiplica distância linha reta por 1.4 para aproximar estrada
- **Uso**: Ativado automaticamente se OSRM falhar

## 📱 Compatibilidade

- ✅ Google Chrome (recomendado)
- ✅ Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Opera
- ✅ Mobile (iOS/Android)

## 🔒 Privacidade e Segurança

- ✅ Todos os dados são armazenados **localmente** no navegador
- ✅ Nenhuma informação sensível é enviada para servidores externos
- ✅ OSRM apenas calcula distâncias entre coordenadas geográficas públicas
- ✅ Sem necessidade de cadastro ou login
- ✅ Para compartilhar dados entre computadores, use a função Exportar/Importar

## 🐛 Solução de Problemas

### Os dados não estão sendo salvos
- Verifique se o navegador permite LocalStorage
- Não use modo anônimo/privado
- Limpe o cache apenas se necessário (perderá os dados)

### Distâncias não são calculadas automaticamente
1. Verifique sua conexão com internet (OSRM precisa de conexão)
2. Aguarde alguns segundos - o OSRM pode demorar em horários de pico
3. Se OSRM falhar, o sistema usa automaticamente o cálculo Haversine
4. Você sempre pode editar as distâncias manualmente

### Percentuais não somam 100%
- Ajuste os valores até a soma ser exatamente 100%
- O sistema indica em vermelho quando está incorreto

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Este README
2. Console do navegador (F12) para mensagens de erro
3. Use Ctrl+Shift+D para informações do sistema

## 📄 Licença

Este sistema foi desenvolvido para uso interno do Grupo Lider Madeiras.

---

**Versão**: 1.0.0
**Última atualização**: 2025
