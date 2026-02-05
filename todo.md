# Bridor Chatbot - Lista de Funcionalidades

## Backend e Banco de Dados
- [x] Criar schema do banco de dados (conversas, mensagens, demandas, base de conhecimento)
- [x] Implementar helpers de banco de dados para conversas e mensagens
- [x] Criar sistema de categorização automática de demandas (informações, catálogo, pedidos)
- [x] Implementar integração com LLM para processamento inteligente de mensagens
- [x] Criar base de conhecimento configurável sobre produtos Bridor
- [x] Desenvolver lógica de envio automático de catálogo
- [x] Implementar sistema de redirecionamento para atendente com contexto

## Interface de Chat (Simulação WhatsApp)
- [x] Criar interface de chat com visual elegante simulando WhatsApp
- [x] Implementar sistema de mensagens em tempo real
- [x] Desenvolver componente de saudação automática
- [x] Criar menu de opções interativo (Informações / Catálogo / Fazer Pedido)
- [x] Implementar indicador de digitação do bot
- [x] Adicionar timestamps nas mensagens
- [x] Criar visualização de status de mensagens

## Dashboard Administrativo
- [x] Criar layout do dashboard com navegação lateral
- [x] Implementar página de histórico de conversas
- [x] Desenvolver visualização detalhada de cada conversa
- [x] Criar sistema de filtros por categoria de demanda
- [x] Implementar estatísticas de atendimento (total de conversas, por categoria)
- [x] Adicionar painel de configuração da base de conhecimento
- [x] Criar interface para gerenciar catálogos

## Testes e Qualidade
- [x] Testar fluxo completo de qualificação de cliente
- [x] Validar envio automático de catálogo
- [x] Testar redirecionamento para atendente
- [x] Verificar categorização automática de demandas
- [x] Testar responsividade da interface
- [x] Validar persistência de dados no banco

## Documentação e Entrega
- [x] Criar checkpoint final
- [x] Documentar fluxos de uso do sistema
- [x] Preparar instruções para configuração inicial

## Refinamento do Fluxo de Qualificação

### Backend - Banco de Dados
- [x] Adicionar campo `isExistingCustomer` (boolean) na tabela conversations
- [x] Adicionar campos de qualificação de prospect: `leadName`, `leadCity`, `leadState`, `establishmentType`
- [x] Criar enum para tipos de estabelecimento (supermercado, cafeteria, padaria/confeitaria, buffet, catering, distribuidor, representante)
- [x] Migrar banco de dados com novos campos

### Backend - Lógica de Negócio
- [x] Implementar fluxo de qualificação inicial (cliente existente vs prospect)
- [x] Criar menu diferenciado para clientes existentes (Fazer Pedido / Falar com Assistente)
- [x] Implementar formulário de captura de dados para prospects
- [x] Adicionar validação de dados de qualificação
- [x] Criar router para gestão de leads/prospects

### Frontend - Interface de Chat
- [x] Atualizar fluxo de conversa com pergunta inicial sobre cliente existente
- [x] Implementar menu específico para clientes existentes
- [x] Criar formulário interativo de qualificação para prospects
- [x] Adicionar validação de campos no formulário de prospect

### Frontend - Dashboard
- [x] Criar página de Leads/Prospects no dashboard
- [x] Implementar filtros por tipo de estabelecimento
- [x] Adicionar estatísticas de conversão (prospects vs clientes)
- [x] Criar visualização de dados geográficos (por estado/cidade)
- [x] Adicionar exportação de leads para CSV

### Testes
- [x] Testar fluxo completo para cliente existente
- [x] Testar fluxo completo para prospect
- [x] Validar captura de todos os dados de qualificação
- [x] Testar dashboard de leads

## Bug Reportado - Correção Urgente

- [x] Investigar por que opção 1 (cliente existente) não funciona
- [x] Corrigir lógica do fluxo de cliente existente
- [x] Testar correção completa do fluxo
- [x] Validar que opção 2 (prospect) continua funcionando

## Enriquecimento do Fluxo de Pedidos

### Backend - Banco de Dados
- [x] Adicionar campos para armazenar dados do pedido: `orderProduct`, `orderQuantity`, `orderDeliveryDate`

### Backend - Lógica de Negócio
- [x] Implementar coleta estruturada de produto, quantidade e data de entrega
- [x] Criar formatação de resumo do pedido para transferência
- [x] Atualizar prompt do LLM com instruções de coleta de pedido

### Testes
- [x] Testar fluxo completo de pedido de cliente existente
- [x] Validar que todos os dados são coletados corretamente
- [x] Verificar formatação do resumo para Maria Luiza

## Bugs Reportados - Correção Urgente #2

- [x] Corrigir reconhecimento da resposta "1" quando cliente confirma que já é cliente (precisa repetir)
- [x] Melhorar extração de dados do pedido do histórico de mensagens
- [x] Corrigir formatação do resumo do pedido para exibição clara
- [x] Testar fluxo completo de cliente existente → pedido
