import { COOKIE_NAME } from "@shared/const";
import { leadsRouter } from "./routers-leads";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createConversation, 
  getConversationBySessionId, 
  updateConversation,
  createMessage,
  getMessagesByConversationId,
  getAllConversations,
  getConversationsByCategory,
  getAllActiveKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  getAllActiveCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog
} from "./db";
import { invokeLLM } from "./_core/llm";
import type { Message as LLMMessage } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    // Iniciar nova conversa
    startConversation: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        customerName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const conversation = await createConversation({
          sessionId: input.sessionId,
          customerName: input.customerName,
          category: "unknown",
          status: "active",
        });

        // Criar mensagem de boas-vindas com qualificação inicial
        const welcomeMessage = await createMessage({
          conversationId: conversation.id,
          sender: "bot",
          content: "Olá! Bem-vindo à Bridor! 👋\n\nSou seu assistente virtual e estou aqui para ajudar.\n\nPara começar, me conta: você já é cliente da Bridor?\n\n1️⃣ Sim, já compro da Bridor\n2️⃣ Não, ainda não sou cliente\n\nDigite 1 ou 2 para continuar!",
          messageType: "menu",
        });

        return { conversation, welcomeMessage };
      }),

    // Enviar mensagem e receber resposta do bot
    sendMessage: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        let conversation = await getConversationBySessionId(input.sessionId);
        
        if (!conversation) {
          conversation = await createConversation({
            sessionId: input.sessionId,
            category: "unknown",
            status: "active",
          });
        }

        // Salvar mensagem do cliente
        await createMessage({
          conversationId: conversation.id,
          sender: "customer",
          content: input.content,
        });

        // Buscar histórico de mensagens
        const history = await getMessagesByConversationId(conversation.id);
        
        // Buscar base de conhecimento
        const knowledge = await getAllActiveKnowledge();
        const knowledgeContext = knowledge.map(k => 
          `Categoria: ${k.category}\nPergunta: ${k.question}\nResposta: ${k.answer}`
        ).join("\n\n");

        // Preparar contexto para o LLM
        const systemPrompt = `Você é um assistente virtual da Bridor, empresa especializada em panificação, confeitaria e food service.

FLUXO DE QUALIFICAÇÃO:

1. PRIMEIRA PERGUNTA: "Você já é cliente da Bridor?"
   - Se SIM (resposta contendo "sim", "já sou", "1" ou similar): Cliente Existente → IMEDIATAMENTE oferecer menu:
     "Que ótimo! Como posso te ajudar hoje?
     1️⃣ Fazer um pedido
     2️⃣ Falar com assistente de vendas
     Digite 1 ou 2 para continuar!"
   - Se NÃO (resposta contendo "não", "ainda não", "2" ou similar): Prospect → Coletar dados: Nome, Cidade, Estado, Tipo de Estabelecimento

2. PARA CLIENTES EXISTENTES:
   - Opção 1 (Fazer Pedido): Coletar informações do pedido seguindo este fluxo:
     a) PRIMEIRO, perguntar: "Para localizar seu cadastro, por favor me informe o nome do seu estabelecimento ou CNPJ"
     b) Após receber a identificação, pedir o pedido no formato:
        "Perfeito! Agora envie seu pedido com as seguintes informações:
        📦 Produto:
        🔢 Quantidade:
        📅 Data de entrega desejada:
        
        Assim que receber, o espelho do pedido será enviado pelo WhatsApp!"
     c) Quando o cliente fornecer TODAS as informações (identificação, produto, quantidade e data), responder "PEDIDO_COMPLETO"
     d) Se faltar alguma informação, perguntar especificamente o que falta
     e) Aceitar tanto texto livre ("pedido", "fazer pedido") quanto número "1" para esta opção
   - Opção 2 (Falar com Assistente): Responder "TRANSFERIR_ATENDENTE"

3. PARA PROSPECTS (NÃO-CLIENTES):
   - Coletar Nome completo
   - Coletar Cidade
   - Coletar Estado (sigla com 2 letras)
   - Coletar Tipo de Estabelecimento: Supermercado, Cafeteria, Padaria/Confeitaria, Buffet, Catering, Distribuidor ou Representante
   - Após coletar todos os dados, responder: "QUALIFICACAO_COMPLETA" e oferecer enviar catálogo

4. COMANDOS ESPECIAIS:
   - Quando cliente/prospect solicitar catálogo: "ENVIAR_CATALOGO"
   - Quando cliente fornecer TODAS as informações do pedido (produto, quantidade, data): "PEDIDO_COMPLETO"
   - Quando identificar solicitação de contato direto com assistente: "TRANSFERIR_ATENDENTE"
   - Quando completar qualificação de prospect: "QUALIFICACAO_COMPLETA"

Base de Conhecimento:
${knowledgeContext || "Ainda não há informações cadastradas na base de conhecimento."}

Diretrizes:
- Seja cordial, profissional e objetivo
- Use emojis moderadamente para humanizar
- Faça UMA pergunta por vez para não sobrecarregar o cliente
- Sempre confirme os dados coletados antes de prosseguir
- Se não souber algo, seja honesto e ofereça transferir para um atendente humano`;;

        const conversationHistory: LLMMessage[] = history.slice(-10).map(msg => ({
          role: msg.sender === "bot" ? "assistant" as const : "user" as const,
          content: msg.content,
        }));

        const llmMessages: LLMMessage[] = [
          { role: "system" as const, content: systemPrompt },
          ...conversationHistory,
          { role: "user" as const, content: input.content },
        ];

        // Chamar LLM
        const response = await invokeLLM({
          messages: llmMessages,
        });

        const messageContent = response.choices[0]?.message?.content;
        let botResponse = typeof messageContent === 'string' ? messageContent : "Desculpe, não consegui processar sua mensagem.";
        let messageType: "text" | "catalog" | "system" = "text";
        let shouldUpdateCategory = false;
        let newCategory: "information" | "catalog" | "order" | "unknown" = conversation.category;

        // Processar comandos especiais
        if (botResponse.includes("QUALIFICACAO_COMPLETA")) {
          // Prospect completou qualificação - extrair dados da conversa
          botResponse = botResponse.replace("QUALIFICACAO_COMPLETA", "").trim();
          if (!botResponse) {
            botResponse = "✅ Obrigado pelas informações! Seu cadastro foi realizado com sucesso.\n\nGostaria de receber nosso catálogo completo de produtos? Digite 'sim' para receber!";
          }
          
          // Marcar como prospect qualificado
          await updateConversation(conversation.id, {
            isExistingCustomer: false,
            category: "information",
          });
        } else if (botResponse.includes("ENVIAR_CATALOGO")) {
          const catalogs = await getAllActiveCatalogs();
          if (catalogs.length > 0) {
            botResponse = `📋 Aqui está nosso catálogo de produtos:\n\n${catalogs.map((c, i) => 
              `${i + 1}. ${c.name}\n${c.description || ''}\n🔗 ${c.fileUrl}`
            ).join('\n\n')}\n\nPosso ajudar com mais alguma coisa?`;
            messageType = "catalog";
            newCategory = "catalog";
            shouldUpdateCategory = true;
          } else {
            botResponse = "No momento não temos catálogos disponíveis. Posso transferir você para um atendente que pode te enviar as informações. Gostaria?";
          }
        } else if (botResponse.includes("PEDIDO_COMPLETO")) {
          // Cliente forneceu todas as informações do pedido
          botResponse = botResponse.replace("PEDIDO_COMPLETO", "").trim();
          
          // Extrair informações do pedido do histórico recente
          const recentMessages = history.slice(-15);
          let orderInfo = "";
          let produto = "";
          let quantidade = "";
          let dataEntrega = "";
          let estabelecimento = "";
          let cnpj = "";
          
          // Coletar todas as mensagens do cliente para análise
          const customerMessages = recentMessages
            .filter(msg => msg.sender === "customer")
            .map(msg => msg.content);
          
          // Tentar extrair informações estruturadas
          for (const message of customerMessages) {
            const lines = message.split(/\n/);
            for (const line of lines) {
              const lowerLine = line.toLowerCase().trim();
              
              if (lowerLine.includes("produto:") || lowerLine.includes("📦")) {
                produto = line.replace(/produto:/gi, "").replace("📦", "").trim();
              } else if (lowerLine.includes("quantidade:") || lowerLine.includes("🔢")) {
                quantidade = line.replace(/quantidade:/gi, "").replace("🔢", "").trim();
              } else if (lowerLine.includes("data") && (lowerLine.includes("entrega") || lowerLine.includes("📅"))) {
                // Extrair apenas a data, removendo labels e emojis
                let tempData = line.replace(/data.*?:/gi, "").replace("📅", "").trim();
                // Limpar duplicações (ex: "13/02/2613/02/26" -> "13/02/26")
                const dateMatch = tempData.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
                if (dateMatch) {
                  dataEntrega = dateMatch[1];
                } else {
                  dataEntrega = tempData;
                }
              }
            }
          }
          
          // Extrair estabelecimento/CNPJ das primeiras mensagens após escolher pedido
          for (let i = 0; i < Math.min(5, customerMessages.length); i++) {
            const msg = customerMessages[i] || "";
            const lowerMsg = msg.toLowerCase();
            
            // Detectar CNPJ (formato: XX.XXX.XXX/XXXX-XX ou apenas números)
            const cnpjMatch = msg.match(/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/);
            if (cnpjMatch) {
              cnpj = cnpjMatch[0];
            } else if (/^\d{14}$/.test(msg.trim())) {
              cnpj = msg.trim();
            }
            
            // Se não tem CNPJ e a mensagem parece ser nome de estabelecimento
            if (!cnpj && msg.length > 3 && msg.length < 100 && 
                !lowerMsg.includes("pedido") && !lowerMsg.includes("produto") && 
                !lowerMsg.includes("quantidade") && !lowerMsg.includes("data")) {
              estabelecimento = msg.trim();
            }
          }
          
          // Montar resumo estruturado
          const identificacao = cnpj ? `🏢 CNPJ: ${cnpj}` : (estabelecimento ? `🏢 Estabelecimento: ${estabelecimento}` : "");
          
          if (produto || quantidade || dataEntrega) {
            orderInfo = `${identificacao ? identificacao + "\n" : ""}📦 Produto: ${produto || "Não informado"}\n🔢 Quantidade: ${quantidade || "Não informada"}\n📅 Data de Entrega: ${dataEntrega || "Não informada"}`;
          } else {
            // Fallback: usar última mensagem relevante
            for (const msg of customerMessages.reverse()) {
              if (msg.length > 10) {
                orderInfo = `${identificacao ? identificacao + "\n" : ""}${msg}`;
                break;
              }
            }
          }
          
          // Criar resumo formatado do pedido
          const orderSummary = `✅ Pedido recebido com sucesso!\n\n📝 RESUMO DO PEDIDO:\n${orderInfo}\n\nVou transferir você para Maria Luiza que vai confirmar seu pedido e enviar o espelho pelo WhatsApp. Aguarde um momento... 👩‍💼`;
          
          if (!botResponse) {
            botResponse = orderSummary;
          }
          
          messageType = "system";
          newCategory = "order";
          shouldUpdateCategory = true;
          
          // Salvar informações do pedido
          await updateConversation(conversation.id, {
            status: "transferred",
            transferredToAgent: true,
            category: newCategory,
            customerEstablishment: estabelecimento || null,
            customerCNPJ: cnpj || null,
            orderProduct: produto || null,
            orderQuantity: quantidade || null,
            orderDeliveryDate: dataEntrega || null,
          });
        } else if (botResponse.includes("TRANSFERIR_ATENDENTE")) {
          botResponse = "Perfeito! Vou transferir você para Maria Luiza, nossa assistente de vendas, que vai te atender. Aguarde um momento... 👩‍💼";
          messageType = "system";
          newCategory = "order";
          shouldUpdateCategory = true;
          
          await updateConversation(conversation.id, {
            status: "transferred",
            transferredToAgent: true,
            category: newCategory,
          });
        }
        
        // Detectar se é cliente existente ou prospect na primeira resposta
        const lowerContent = input.content.toLowerCase();
        const lowerBotResponse = botResponse.toLowerCase();
        
        // Se o usuário responde que é cliente existente
        if (conversation.isExistingCustomer === null) {
          const isPositiveResponse = lowerContent.includes("sim") || 
                                     lowerContent.includes("já sou") || 
                                     lowerContent.includes("ja sou") || 
                                     lowerContent.includes("sou sim") ||
                                     lowerContent.trim() === "1" ||
                                     lowerContent.includes("já compro") ||
                                     lowerContent.includes("ja compro");
          
          if (isPositiveResponse) {
            await updateConversation(conversation.id, {
              isExistingCustomer: true,
            });
          }
        }
        
        // Se o usuário responde que NÃO é cliente (prospect)
        if (conversation.isExistingCustomer === null) {
          const isNegativeResponse = lowerContent.includes("não") || 
                                     lowerContent.includes("nao") || 
                                     lowerContent.includes("ainda não") ||
                                     lowerContent.includes("ainda nao") ||
                                     lowerContent.trim() === "2" ||
                                     lowerContent.includes("não sou") ||
                                     lowerContent.includes("nao sou");
          
          if (isNegativeResponse) {
            await updateConversation(conversation.id, {
              isExistingCustomer: false,
            });
          }
        }
        
        if (conversation.category === "unknown") {
          // Tentar identificar categoria baseado no conteúdo
          if (lowerContent.includes("catálogo") || lowerContent.includes("catalogo")) {
            newCategory = "catalog";
            shouldUpdateCategory = true;
          } else if (lowerContent.includes("pedido") || lowerContent.includes("comprar")) {
            newCategory = "order";
            shouldUpdateCategory = true;
          } else if (lowerContent.includes("informação") || lowerContent.includes("informacao")) {
            newCategory = "information";
            shouldUpdateCategory = true;
          }
        }

        if (shouldUpdateCategory && conversation.category !== newCategory) {
          await updateConversation(conversation.id, { category: newCategory });
        }

        // Salvar resposta do bot
        const botMessage = await createMessage({
          conversationId: conversation.id,
          sender: "bot",
          content: botResponse,
          messageType,
        });

        return { message: botMessage, category: newCategory };
      }),

    // Obter histórico de mensagens
    getMessages: publicProcedure
      .input(z.object({
        sessionId: z.string(),
      }))
      .query(async ({ input }) => {
        const conversation = await getConversationBySessionId(input.sessionId);
        if (!conversation) return [];
        
        return await getMessagesByConversationId(conversation.id);
      }),
  }),

  conversations: router({
    // Listar todas as conversas
    list: protectedProcedure.query(async () => {
      return await getAllConversations();
    }),

    // Listar conversas por categoria
    listByCategory: protectedProcedure
      .input(z.object({
        category: z.enum(["information", "catalog", "order", "unknown"]),
      }))
      .query(async ({ input }) => {
        return await getConversationsByCategory(input.category);
      }),

    // Obter detalhes de uma conversa
    getById: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        const messages = await getMessagesByConversationId(input.id);
        return messages;
      }),
  }),

  knowledge: router({
    // Listar toda base de conhecimento
    list: protectedProcedure.query(async () => {
      return await getAllActiveKnowledge();
    }),

    // Criar novo item de conhecimento
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        question: z.string(),
        answer: z.string(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createKnowledge(input);
      }),

    // Atualizar item de conhecimento
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        category: z.string().optional(),
        question: z.string().optional(),
        answer: z.string().optional(),
        keywords: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateKnowledge(id, data);
        return { success: true };
      }),

    // Deletar item de conhecimento
    delete: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        await deleteKnowledge(input.id);
        return { success: true };
      }),
  }),

  leads: leadsRouter,

  catalogs: router({
    // Listar todos os catálogos
    list: protectedProcedure.query(async () => {
      return await getAllActiveCatalogs();
    }),

    // Criar novo catálogo
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        fileUrl: z.string(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createCatalog(input);
      }),

    // Atualizar catálogo
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        fileUrl: z.string().optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateCatalog(id, data);
        return { success: true };
      }),

    // Deletar catálogo
    delete: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        await deleteCatalog(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
