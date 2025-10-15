# 🧪 Como Testar o Sistema - Passo a Passo

## ✅ SOLUÇÃO DO PROBLEMA: Cards não aparecem

O problema era que os fornecedores antigos salvos no `localStorage` não tinham as cidades padrão.

### 🔧 Correção Implementada:

Agora o sistema tem uma **função de migração automática** que:
- ✅ Detecta fornecedores sem cidades padrão
- ✅ Adiciona automaticamente as 5 cidades (Campo Grande, São Paulo, Curitiba, Porto Alegre, Belo Horizonte)
- ✅ Salva os dados atualizados
- ✅ Mostra no console: "✅ Dados migrados!"

---

## 🚀 TESTE AGORA - Opção 1 (Recomendada)

### 1. Abra o index.html

### 2. Pressione F12 para abrir o Console

### 3. Cole e execute este comando:
```javascript
// Limpar dados antigos e recarregar
localStorage.clear();
location.reload();
```

### 4. Após recarregar:
- Clique em **"Fornecedor A"** (Cuiabá/MT)
- Role até **"📍 Distâncias para Clientes"**
- **VOCÊ DEVE VER 5 CARDS:**
  ```
  📍 Campo Grande/MS → 0 km
  📍 São Paulo/SP → 0 km
  📍 Curitiba/PR → 0 km
  📍 Porto Alegre/RS → 0 km
  📍 Belo Horizonte/MG → 0 km
  ```

### 5. Clique no botão **"🔄 Calcular"**
- Aguarde 10-15 segundos
- Veja os valores sendo atualizados em tempo real!
- Exemplo de resultado esperado:
  ```
  📍 Campo Grande/MS → 700 km
  📍 São Paulo/SP → 1650 km
  📍 Curitiba/PR → 1950 km
  📍 Porto Alegre/RS → 2400 km
  📍 Belo Horizonte/MG → 1450 km
  ```

---

## 🔄 TESTE - Opção 2 (Sem limpar dados)

Se NÃO quiser limpar os dados existentes:

### 1. Abra o index.html

### 2. Pressione F12

### 3. Execute este comando:
```javascript
// Forçar migração das cidades padrão
migrarCidadesPadrao();
location.reload();
```

### 4. Agora siga os passos 4 e 5 da Opção 1

---

## 🧪 TESTE - Arquivo de Demonstração

Também criamos um arquivo de teste isolado:

### 1. Abra: `teste-calculo-automatico.html`

### 2. Configure:
- Digite a cidade origem (ex: "Cuiabá/MT")

### 3. Clique em: **"🔄 Calcular Distâncias"**

### 4. Veja:
- ✅ Cards sendo preenchidos em tempo real
- ✅ Barra de progresso
- ✅ Console com logs detalhados
- ✅ JSON final com todas as distâncias

---

## ❓ Problemas Comuns

### Cards ainda não aparecem?

**Solução:** Limpe COMPLETAMENTE o localStorage:

1. Pressione F12
2. Vá na aba **Application** (Chrome) ou **Storage** (Firefox)
3. Clique em **Local Storage** → seu domínio
4. Clique com botão direito → **Clear**
5. Recarregue a página (F5)

### Erro "CIDADES_CLIENTES_PADRAO is not defined"?

**Solução:** Certifique-se que todos os arquivos JS estão carregando:

1. Pressione F12
2. Vá na aba **Network**
3. Recarregue a página
4. Verifique se todos os arquivos `.js` carregaram (status 200)

### Cálculo não funciona?

**Solução:** Verifique conexão com internet:

1. OSRM precisa de internet para funcionar
2. Teste se consegue acessar: https://router.project-osrm.org
3. Se OSRM falhar, o sistema usa Haversine automaticamente (offline)

---

## 📊 Verificar se Migração Funcionou

No console (F12), execute:

```javascript
// Ver dados dos fornecedores
console.table(fornecedores.map(f => ({
  id: f.id,
  nome: f.nome,
  cidade: f.cidade,
  cidades_cadastradas: Object.keys(f.distanciasClientes || {}).length
})));
```

**Resultado esperado:**
```
┌─────┬────┬───────────────┬──────────────┬────────────────────┐
│ idx │ id │ nome          │ cidade       │ cidades_cadastradas│
├─────┼────┼───────────────┼──────────────┼────────────────────┤
│  0  │ 1  │ Fornecedor A  │ Cuiabá/MT    │        5           │
│  1  │ 2  │ Fornecedor B  │ São Paulo/SP │        5           │
│  2  │ 3  │ Fornecedor C  │ Curitiba/PR  │        5           │
└─────┴────┴───────────────┴──────────────┴────────────────────┘
```

Se a coluna `cidades_cadastradas` mostrar **5** para todos, está funcionando! ✅

---

## 🎉 Sucesso!

Se você vê os 5 cards com as cidades, o sistema está funcionando perfeitamente!

Agora pode:
- ✅ Calcular distâncias automaticamente
- ✅ Editar distâncias manualmente (clique no número)
- ✅ Adicionar novas cidades (botão "➕ Adicionar")
- ✅ Remover cidades (botão "×" no hover)
- ✅ Usar em qualquer fornecedor!

---

**📝 Nota:** Se ainda tiver problemas, abra o console (F12) e copie TODAS as mensagens de erro. Isso ajudará a diagnosticar o problema!
