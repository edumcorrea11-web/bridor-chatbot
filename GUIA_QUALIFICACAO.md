# Guia de Qualificação de Leads - Bridor Chatbot

## 🎯 Visão Geral do Novo Fluxo

O sistema foi refinado para diferenciar **clientes existentes** de **prospects** (não-clientes), capturando dados estratégicos para qualificação de leads e construção de pipeline de vendas.

## 📊 Fluxo de Qualificação

### 1. Pergunta Inicial

Ao iniciar uma conversa, o chatbot faz a pergunta de qualificação:

> **"Você já é cliente da Bridor?"**
> 
> 1️⃣ Sim, já compro da Bridor  
> 2️⃣ Não, ainda não sou cliente

Esta pergunta permite segmentar imediatamente o atendimento.

---

### 2. Fluxo para Clientes Existentes

**Quando o cliente responde "Sim" (opção 1):**

O chatbot oferece um menu específico para clientes:

- **Opção 1: Fazer Pedido** → Coleta informações do pedido e transfere para Maria Luiza
- **Opção 2: Falar com Assistente de Vendas** → Transfere diretamente para Maria Luiza

**Vantagens:**
- Atendimento ágil para clientes ativos
- Reduz fricção no processo de pedido
- Canal direto com assistente de vendas

---

### 3. Fluxo para Prospects (Não-Clientes)

**Quando o prospect responde "Não" (opção 2):**

O chatbot inicia a **coleta de dados de qualificação**, fazendo UMA pergunta por vez:

#### Dados Coletados:

1. **Nome Completo**
   - Exemplo: "João Silva"

2. **Cidade**
   - Exemplo: "São Paulo"

3. **Estado** (sigla com 2 letras)
   - Exemplo: "SP"

4. **Tipo de Estabelecimento**
   - Supermercado
   - Cafeteria
   - Padaria/Confeitaria
   - Buffet
   - Catering
   - Distribuidor
   - Representante

#### Após Qualificação Completa:

- Sistema confirma os dados coletados
- Oferece envio automático do catálogo
- Prospect fica registrado no dashboard de Leads

**Vantagens:**
- Captura dados estruturados para prospecção
- Segmentação por tipo de estabelecimento
- Análise geográfica (cidade/estado)
- Pipeline qualificado para o time de vendas

---

## 📈 Dashboard de Leads & Prospects

**Acesso:** Menu lateral > "Leads & Prospects" ou `/leads`

### Estatísticas Principais

O dashboard exibe cards com:

1. **Total de Prospects** - Novos contatos qualificados
2. **Clientes Existentes** - Quantidade de clientes ativos
3. **Principais Estados** - Estado com mais prospects
4. **Tipo Predominante** - Tipo de estabelecimento mais comum

### Lista de Prospects

Visualize todos os prospects com:
- Nome completo
- Localização (cidade e estado)
- Tipo de estabelecimento
- Data e hora do contato

### Filtros Disponíveis

Filtre prospects por tipo de estabelecimento:
- Todos os tipos
- Supermercado
- Cafeteria
- Padaria/Confeitaria
- Buffet
- Catering
- Distribuidor
- Representante

### Exportação de Dados

**Botão "Exportar CSV"** - Gera arquivo CSV com todos os prospects contendo:
- Nome
- Cidade
- Estado
- Tipo de Estabelecimento
- Data do contato

**Uso:** Ideal para importar em CRM, planilhas ou ferramentas de prospecção.

### Distribuição por Tipo

Gráfico de barras mostrando:
- Quantidade de prospects por tipo de estabelecimento
- Percentual de cada segmento
- Análise visual da distribuição

---

## 💼 Casos de Uso Estratégicos

### Para Clientes Existentes

**Cenário 1: Cliente quer fazer pedido**
- Cliente: "Sim, já sou cliente"
- Bot: Oferece menu (Fazer Pedido / Falar com Assistente)
- Cliente: Escolhe "Fazer Pedido"
- Bot: Coleta informações e transfere para Maria Luiza
- **Resultado:** Pedido processado rapidamente

**Cenário 2: Cliente precisa de suporte**
- Cliente: "Sim, já sou cliente"
- Bot: Oferece menu
- Cliente: Escolhe "Falar com Assistente"
- Bot: Transfere para Maria Luiza
- **Resultado:** Atendimento personalizado

### Para Prospects

**Cenário 1: Padaria interessada em conhecer produtos**
- Prospect: "Não, ainda não sou cliente"
- Bot: Coleta dados (Nome: "Padaria Pão Quente", Cidade: "Goiânia", Estado: "GO", Tipo: "Padaria/Confeitaria")
- Bot: Oferece catálogo automaticamente
- **Resultado:** Lead qualificado + catálogo enviado

**Cenário 2: Distribuidor buscando parceria**
- Prospect: "Não, ainda não sou cliente"
- Bot: Coleta dados (Nome: "Distribuidora Central", Cidade: "Brasília", Estado: "DF", Tipo: "Distribuidor")
- Bot: Oferece catálogo
- **Resultado:** Lead estratégico identificado para follow-up

---

## 🎯 Benefícios para Vendas

### 1. Qualificação Automática
- Separa clientes de prospects automaticamente
- Coleta dados estruturados sem intervenção manual
- Reduz tempo de qualificação do time de vendas

### 2. Segmentação Inteligente
- Identifica tipo de estabelecimento
- Análise geográfica para planejamento de rotas
- Priorização de leads por segmento

### 3. Pipeline Estruturado
- Todos os prospects ficam registrados
- Dados exportáveis para CRM
- Histórico completo de interações

### 4. Análise de Mercado
- Identificação de segmentos com maior interesse
- Análise de distribuição geográfica
- Tendências de prospecção

### 5. Follow-up Eficiente
- Dados completos para contato
- Contexto da conversa registrado
- Segmentação para campanhas direcionadas

---

## 📊 Métricas de Acompanhamento

### KPIs Principais

1. **Taxa de Conversão**
   - Prospects → Clientes
   - Acompanhe no dashboard

2. **Distribuição Geográfica**
   - Estados com mais prospects
   - Oportunidades de expansão

3. **Segmentação por Tipo**
   - Quais segmentos mais procuram
   - Direcionar esforços de marketing

4. **Volume de Leads**
   - Total de prospects qualificados
   - Crescimento mês a mês

---

## 🔄 Integração com Processo de Vendas

### Fluxo Recomendado

1. **Captura** - Chatbot qualifica automaticamente
2. **Registro** - Dados salvos no dashboard
3. **Exportação** - CSV para CRM/planilha
4. **Segmentação** - Priorizar por tipo/região
5. **Follow-up** - Time de vendas entra em contato
6. **Conversão** - Prospect vira cliente

### Responsabilidades

**Chatbot:**
- Qualificação inicial
- Coleta de dados
- Envio de catálogo
- Registro no sistema

**Time de Vendas:**
- Análise dos leads
- Follow-up personalizado
- Negociação
- Fechamento

---

## 💡 Dicas de Uso

1. **Revise o dashboard diariamente** para identificar novos prospects
2. **Exporte os dados semanalmente** para atualizar seu CRM
3. **Analise a distribuição por tipo** para ajustar estratégias de marketing
4. **Priorize prospects de segmentos estratégicos** (ex: distribuidores)
5. **Use os dados geográficos** para planejar visitas e rotas de vendas
6. **Acompanhe a taxa de conversão** para medir eficácia do processo

---

## 🚀 Próximos Passos Sugeridos

1. **Integração com CRM** - Conectar diretamente com seu sistema de vendas
2. **Notificações automáticas** - Alertas por e-mail quando novos prospects são qualificados
3. **Scoring de leads** - Pontuação automática baseada em perfil e comportamento
4. **Campanhas segmentadas** - E-mail marketing direcionado por tipo de estabelecimento
5. **Relatórios automatizados** - Envio semanal de análise de leads

---

**Desenvolvido para Bridor** - Sistema de Qualificação Inteligente de Leads
