import { COOKIE_NAME } from "@shared/const";
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

        // Criar mensagem de boas-vindas
        const welcomeMessage = await createMessage({
          conversationId: conversation.id,
          sender: "bot",
          content: "Olá! Bem-vindo à Bridor! 👋\n\nSou seu assistente virtual e estou aqui para ajudar. Como posso te atender hoje?\n\n1️⃣ Informações sobre produtos\n2️⃣ Solicitar catálogo\n3️⃣ Fazer um pedido\n\nDigite o número da opção ou descreva o que você precisa!",
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

Sua função é:
1. Recepcionar clientes de forma cordial e profissional
2. Identificar a intenção do cliente (informações, catálogo ou pedido)
3. Responder perguntas usando a base de conhecimento
4. Quando o cliente solicitar catálogo, responda: "ENVIAR_CATALOGO"
5. Quando identificar que é um pedido, colete informações básicas (nome, telefone, produto desejado) e responda: "TRANSFERIR_ATENDENTE"

Base de Conhecimento:
${knowledgeContext || "Ainda não há informações cadastradas na base de conhecimento."}

Diretrizes:
- Seja cordial, profissional e objetivo
- Use emojis moderadamente para humanizar
- Faça perguntas para qualificar a necessidade do cliente
- Se não souber algo, seja honesto e ofereça transferir para um atendente humano`;

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
        if (botResponse.includes("ENVIAR_CATALOGO")) {
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
        } else if (botResponse.includes("TRANSFERIR_ATENDENTE")) {
          botResponse = "Perfeito! Vou transferir você para um de nossos atendentes que vai finalizar seu pedido. Aguarde um momento... 👨‍💼";
          messageType = "system";
          newCategory = "order";
          shouldUpdateCategory = true;
          
          await updateConversation(conversation.id, {
            status: "transferred",
            transferredToAgent: true,
            category: newCategory,
          });
        } else if (conversation.category === "unknown") {
          // Tentar identificar categoria baseado no conteúdo
          const lowerContent = input.content.toLowerCase();
          if (lowerContent.includes("catálogo") || lowerContent.includes("catalogo") || lowerContent.includes("2")) {
            newCategory = "catalog";
            shouldUpdateCategory = true;
          } else if (lowerContent.includes("pedido") || lowerContent.includes("comprar") || lowerContent.includes("3")) {
            newCategory = "order";
            shouldUpdateCategory = true;
          } else if (lowerContent.includes("informação") || lowerContent.includes("informacao") || lowerContent.includes("1")) {
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
