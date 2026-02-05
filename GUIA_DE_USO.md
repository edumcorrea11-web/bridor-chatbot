# Guia de Uso - Bridor Chatbot

Sistema de atendimento automatizado inteligente para qualificação de clientes e envio de catálogos.

## 📋 Visão Geral

O Bridor Chatbot é um sistema completo que simula conversas do WhatsApp para recepcionar clientes, qualificar suas demandas e fornecer informações automaticamente. O sistema categoriza as interações em três tipos principais:

- **Informações**: Perguntas sobre produtos, empresa e serviços
- **Catálogo**: Solicitações de catálogos (enviados automaticamente)
- **Pedidos**: Intenções de compra (redirecionadas para atendente)

## 🚀 Como Usar

### 1. Página Inicial

Ao acessar o sistema, você verá dois cards principais:

- **Chat de Atendimento**: Para simular conversas com clientes
- **Dashboard Admin**: Para gerenciar o sistema e visualizar estatísticas

### 2. Chat de Atendimento

**Acesso**: Clique em "Iniciar Conversa" na página inicial ou acesse `/chat`

**Funcionalidades**:
- Interface elegante simulando WhatsApp
- Saudação automática ao iniciar conversa
- Menu de opções interativo
- Envio automático de catálogos quando solicitado
- Redirecionamento para atendente Maria Luiza em casos de pedidos
- Indicador de digitação do bot
- Timestamps em todas as mensagens

**Como testar**:
1. Acesse a página de chat
2. Digite sua mensagem ou escolha uma opção do menu
3. O bot responderá automaticamente baseado na base de conhecimento
4. Experimente solicitar o catálogo digitando "2" ou "catálogo"
5. Experimente fazer um pedido digitando "3" ou "pedido"

### 3. Dashboard Administrativo

**Acesso**: Clique em "Acessar Dashboard" na página inicial ou acesse `/dashboard`

**Requer autenticação**: Faça login com sua conta Manus

**Visão Geral**:
- Estatísticas em tempo real (total de conversas, por categoria)
- Lista das conversas mais recentes
- Navegação lateral para acessar outras funcionalidades

### 4. Histórico de Conversas

**Acesso**: Menu lateral > "Conversas" ou acesse `/conversations`

**Funcionalidades**:
- Visualizar todas as conversas registradas
- Filtrar por categoria (Todas, Informações, Catálogos, Pedidos)
- Clicar em uma conversa para ver detalhes completos
- Visualizar histórico completo de mensagens

**Como usar**:
1. Use os botões de filtro no topo para filtrar por categoria
2. Clique em qualquer conversa para abrir o diálogo com detalhes
3. Veja o histórico completo de mensagens trocadas

### 5. Base de Conhecimento

**Acesso**: Menu lateral > "Base de Conhecimento" ou acesse `/knowledge`

**Funcionalidades**:
- Visualizar todos os itens da base de conhecimento
- Adicionar novos itens (categoria, pergunta, resposta, palavras-chave)
- Editar itens existentes
- Remover itens

**Como gerenciar**:
1. Clique em "Adicionar Item" para criar novo conteúdo
2. Preencha os campos obrigatórios (categoria, pergunta, resposta)
3. Adicione palavras-chave para melhorar a busca do bot
4. Use os ícones de editar/excluir em cada item para gerenciar

**Itens pré-cadastrados**:
- Informações sobre a empresa Bridor
- Produtos oferecidos
- Como fazer pedidos
- Informações sobre atendimento

### 6. Gerenciar Catálogos

**Acesso**: Menu lateral > "Catálogos" ou acesse `/catalogs`

**Funcionalidades**:
- Visualizar todos os catálogos cadastrados
- Adicionar novos catálogos
- Editar catálogos existentes
- Visualizar catálogos em nova aba
- Remover catálogos

**Como gerenciar**:
1. Clique em "Adicionar Catálogo" para cadastrar novo
2. Preencha nome, descrição, URL do arquivo e categoria
3. O catálogo será enviado automaticamente quando clientes solicitarem
4. Use "Visualizar Catálogo" para abrir o PDF em nova aba

**Catálogo pré-cadastrado**:
- Catálogo Completo Bridor 2025 (já configurado e pronto para uso)

## 🤖 Como o Bot Funciona

### Fluxo de Qualificação

1. **Recepção**: Cliente inicia conversa e recebe saudação automática
2. **Menu**: Bot apresenta três opções principais
3. **Qualificação**: Bot faz perguntas para entender a necessidade
4. **Categorização**: Sistema identifica automaticamente o tipo de demanda
5. **Ação**:
   - **Informações**: Bot responde usando a base de conhecimento
   - **Catálogo**: Bot envia automaticamente o catálogo cadastrado
   - **Pedido**: Bot coleta informações e informa que vai transferir para Maria Luiza

### Comandos Especiais

O bot reconhece automaticamente:
- Números do menu (1, 2, 3)
- Palavras-chave como "catálogo", "catalogo", "pedido", "comprar", "informação"
- Perguntas sobre produtos, empresa e atendimento

### Integração com LLM

O bot utiliza inteligência artificial (LLM) para:
- Entender mensagens em linguagem natural
- Gerar respostas contextualizadas
- Identificar intenções do cliente
- Manter contexto da conversa

## 📊 Estatísticas e Relatórios

O dashboard fornece:
- **Total de Conversas**: Quantidade total de interações
- **Por Categoria**: Distribuição entre informações, catálogos e pedidos
- **Conversas Recentes**: Lista das últimas 5 interações
- **Detalhes**: Data, hora, categoria e informações do cliente

## 🔧 Configuração Inicial

### Dados Pré-Configurados

O sistema já vem com:
- ✅ Catálogo Completo Bridor 2025 cadastrado
- ✅ Base de conhecimento inicial sobre a empresa
- ✅ Configuração de redirecionamento para Maria Luiza
- ✅ Fluxo de qualificação configurado

### Personalização

Você pode personalizar:
1. **Base de Conhecimento**: Adicione mais informações sobre produtos
2. **Catálogos**: Adicione catálogos específicos por categoria
3. **Respostas**: Edite as respostas padrão na base de conhecimento

## 💡 Dicas de Uso

1. **Mantenha a base de conhecimento atualizada** com informações relevantes
2. **Use palavras-chave** nos itens de conhecimento para melhorar a busca
3. **Revise o histórico** regularmente para identificar perguntas frequentes
4. **Adicione novos itens** na base de conhecimento baseado nas conversas
5. **Teste o chat** regularmente para garantir que as respostas estão adequadas

## 🎯 Casos de Uso

### Cliente busca informações
- Cliente: "Quais produtos vocês oferecem?"
- Bot: Responde com base na base de conhecimento
- Categoria: Informação

### Cliente solicita catálogo
- Cliente: "Gostaria de ver o catálogo"
- Bot: Envia automaticamente o catálogo em PDF
- Categoria: Catálogo

### Cliente quer fazer pedido
- Cliente: "Quero fazer um pedido"
- Bot: Coleta informações e informa transferência para Maria Luiza
- Categoria: Pedido

## 🔐 Autenticação

- **Chat**: Acesso público (não requer login)
- **Dashboard**: Requer autenticação via Manus OAuth
- **Gerenciamento**: Apenas usuários autenticados podem gerenciar conteúdo

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Smartphone

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique se a base de conhecimento está atualizada
2. Revise o histórico de conversas para identificar padrões
3. Teste o fluxo completo no chat antes de disponibilizar para clientes

---

**Desenvolvido para Bridor** - Sistema de Atendimento Automatizado Inteligente
