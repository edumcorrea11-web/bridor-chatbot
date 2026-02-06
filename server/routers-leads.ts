import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { updateConversation, getAllConversations } from "./db";

export const leadsRouter = router({
  // Atualizar dados de qualificação de um prospect
  updateQualification: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      isExistingCustomer: z.boolean(),
      leadName: z.string().optional(),
      leadLocation: z.string().optional(), // Formato: "Cidade - Estado"
      establishmentType: z.enum([
        "supermercado",
        "cafeteria",
        "padaria_confeitaria",
        "buffet",
        "catering",
        "distribuidor",
        "representante"
      ]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { sessionId, ...data } = input;
      
      // Buscar conversa pelo sessionId
      const conversations = await getAllConversations();
      const conversation = conversations.find(c => c.sessionId === sessionId);
      
      if (!conversation) {
        throw new Error("Conversa não encontrada");
      }
      
      await updateConversation(conversation.id, data);
      
      return { success: true };
    }),

  // Listar todos os prospects (não-clientes)
  listProspects: protectedProcedure.query(async () => {
    const conversations = await getAllConversations();
    return conversations.filter(c => c.isExistingCustomer === false);
  }),

  // Listar todos os clientes existentes
  listExistingCustomers: protectedProcedure.query(async () => {
    const conversations = await getAllConversations();
    return conversations.filter(c => c.isExistingCustomer === true);
  }),

  // Estatísticas de leads
  getStats: protectedProcedure.query(async () => {
    const conversations = await getAllConversations();
    
    const prospects = conversations.filter(c => c.isExistingCustomer === false);
    const existingCustomers = conversations.filter(c => c.isExistingCustomer === true);
    
    // Agrupar prospects por tipo de estabelecimento
    const byEstablishmentType = prospects.reduce((acc, conv) => {
      const type = conv.establishmentType || "não_informado";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Agrupar por localização (estado extraído de leadLocation)
    const byState = prospects.reduce((acc, conv) => {
      // Extrair estado de "Cidade - Estado" (pega a parte depois do "-")
      const location = conv.leadLocation || "";
      const state = location.includes("-") ? location.split("-")[1].trim() : "não_informado";
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProspects: prospects.length,
      totalExistingCustomers: existingCustomers.length,
      byEstablishmentType,
      byState,
    };
  }),
});
