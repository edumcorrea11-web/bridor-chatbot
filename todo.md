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

## Bugs Identificados na Conversa + Nova Funcionalidade

### Bugs para Corrigir
- [x] Bot não reconhece texto livre "Pedido" quando cliente digita ao invés de número "1"
- [x] Resumo do pedido mostra formato incorreto ("Croissant g 2 cx" ao invés de estruturado)
- [x] Data de entrega aparece duplicada ("13/02/2613/02/26")
- [x] Melhorar parser de extração de dados do pedido

### Nova Funcionalidade - Identificação do Estabelecimento
- [x] Adicionar campo `customerEstablishment` no schema de conversations
- [x] Adicionar campo `customerCNPJ` no schema de conversations
- [x] Implementar coleta de nome do estabelecimento ou CNPJ logo após escolher "Fazer Pedido"
- [x] Incluir identificação no resumo para Maria Luiza
- [x] Atualizar prompt do LLM com nova etapa de identificação

## Bug Crítico - Reconhecimento de "1"

- [x] Bot não reconhece "1" sozinho como resposta válida no menu
- [x] Usuário precisa digitar "Pedido" por extenso para funcionar
- [x] LLM está interpretando "1" como mal-entendido ao invés de escolha válida
- [x] Ajustar prompt para ser mais permissivo com respostas numéricas curtas no contexto de menu

## Bugs Críticos Urgentes

### Bug 1 - "1" AINDA não reconhecido (correção anterior falhou)
- [x] Bot continua pedindo para digitar "1 ou 2" mesmo quando usuário digita "1"
- [x] Correção anterior no prompt não surtiu efeito
- [x] Investigar se há outro lugar no código que valida a resposta
- [x] Considerar abordagem diferente (detecção programática ao invés de prompt)
- [x] Implementada detecção programática que intercepta "1" e "2" antes do LLM

### Bug 2 - Resumo sem produtos
- [x] Cliente listou: "1 croissant g, 3 croissant mini, 4 caracol de canela"
- [x] Resumo mostrou apenas: "Estabelecimento: Zezé lanches / Dia 15 após as 10:00"
- [x] Parser não está extraindo os produtos da mensagem do cliente
- [x] Resumo incompleto impede Maria Luiza de processar o pedido
- [x] Implementado parser de formato livre que detecta listas de produtos


## Mudança de Design - Sistema Baseado em Palavras

### Decisão do Usuário
- [x] Remover TODAS as opções numéricas (1, 2) do sistema
- [x] Implementar sistema baseado apenas em palavras naturais
- [x] Primeira pergunta: aceitar "sim" ou "não" (ao invés de 1/2)
- [x] Menu de cliente: aceitar "pedido" ou "assistente" (ao invés de 1/2)
- [x] Remover detecção programática de números
- [x] Atualizar todos os prompts do LLM para não mencionar números
- [x] Tornar conversa mais natural e humana


## Revisão Completa e Testes Sistemáticos

### Fluxo 1: Cliente Existente → Pedido
- [ ] Testar resposta "sim" na primeira pergunta
- [ ] Testar resposta "pedido" no menu
- [ ] Testar coleta de estabelecimento/CNPJ
- [ ] Testar coleta de produtos em formato livre
- [ ] Testar coleta de data de entrega
- [ ] Validar resumo completo com todos os dados
- [ ] Verificar mensagem de transferência para Maria Luiza

### Fluxo 2: Cliente Existente → Assistente
- [ ] Testar resposta "sim" na primeira pergunta
- [ ] Testar resposta "assistente" no menu
- [ ] Verificar mensagem de transferência imediata
- [ ] Validar contexto passado para Maria Luiza

### Fluxo 3: Prospect (Não-Cliente)
- [ ] Testar resposta "não" na primeira pergunta
- [ ] Testar coleta de nome do prospect
- [ ] Testar coleta de cidade
- [ ] Testar coleta de estado
- [ ] Testar coleta de tipo de estabelecimento
- [ ] Validar salvamento de dados no banco
- [ ] Verificar categorização correta no dashboard

### Bugs a Identificar e Corrigir
- [ ] Bot não entende variações de respostas
- [ ] Resumo incompleto ou incorreto
- [ ] Fluxos que travam ou não avançam
- [ ] Mensagens confusas ou repetitivas
- [ ] Problemas de formatação
- [ ] Erros de salvamento no banco de dados


## Bug Reportado - Parser de Data Simples

- [x] Parser de data não reconhece formato simples "13/02" - precisa aceitar datas sem palavras adicionais como "dia", "às", etc.


## Melhoria Solicitada - Fluxo de Qualificação de Prospects

- [x] Simplificar coleta de localização: pedir "Cidade - Estado" em uma única pergunta ao invés de separar em Cidade e Estado (siglas não estão sendo reconhecidas corretamente)


## Personalização Francesa do Chatbot

- [x] Adicionar "Bonjour!" na mensagem de boas-vindas
- [x] Substituir "Que ótimo!" por "Magnifique!" para clientes existentes
- [x] Substituir "Entendido!" por "Enchanté!" no início de qualificação
- [x] Substituir "Obrigado" por "Merci!" na confirmação de cadastro
- [x] Adicionar "Voilà!" antes de "Aqui está nosso catálogo"
- [x] Substituir "Pedido recebido com sucesso!" por "Parfait! Pedido recebido com sucesso!"
- [x] Adicionar "À bientôt!" na despedida/transferência
- [x] Adicionar emoji 🇫🇷 em mensagens estratégicas
