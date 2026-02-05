import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Teste completo do fluxo: Cliente Existente → Fazer Pedido
 * Simula uma conversa real do início ao fim
 */

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Fluxo Completo: Cliente Existente → Pedido", () => {
  it("deve completar fluxo de pedido com sucesso", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Gerar sessionId único para este teste
    const sessionId = `test-flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Passo 1: Iniciar conversa
    const step1 = await caller.chat.startConversation({ sessionId });
    expect(step1.welcomeMessage.content).toContain("Bem-vindo");
    expect(step1.welcomeMessage.content).toContain("você já é cliente da Bridor");
    
    // Passo 2: Responder "sim" (já é cliente)
    const step2 = await caller.chat.sendMessage({
      sessionId,
      content: "sim",
    });
    console.log("step2:", JSON.stringify(step2, null, 2));
    expect(typeof step2.message).toBe("string");
    expect(step2.message.toLowerCase()).toContain("pedido");
    expect(step2.message.toLowerCase()).toContain("assistente");
    
    // Passo 3: Escolher "pedido"
    const step3 = await caller.chat.sendMessage({
      sessionId,
      content: "pedido",
    });
    expect(step3.message.toLowerCase()).toContain("estabelecimento");
    expect(step3.message.toLowerCase()).toContain("cnpj");
    
    // Passo 4: Informar estabelecimento
    const step4 = await caller.chat.sendMessage({
      sessionId,
      content: "Padaria Teste LTDA",
    });
    expect(step4.message.toLowerCase()).toContain("produto");
    
    // Passo 5: Listar produtos
    const step5 = await caller.chat.sendMessage({
      sessionId,
      content: "2 croissant g, 3 pão de queijo, 5 baguete",
    });
    expect(step5.message.toLowerCase()).toContain("data");
    
    // Passo 6: Informar data de entrega
    const step6 = await caller.chat.sendMessage({
      sessionId,
      content: "dia 20/02 às 08:00",
    });
    
    // Verificar resumo completo
    expect(step6.message).toContain("RESUMO DO PEDIDO");
    expect(step6.message).toContain("Padaria Teste");
    expect(step6.message).toContain("croissant");
    expect(step6.message).toContain("pão de queijo");
    expect(step6.message).toContain("baguete");
    expect(step6.message).toContain("20/02");
    expect(step6.message).toContain("Maria Luiza");
  });

  it("deve aceitar variações de 'sim'", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `test-sim-var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await caller.chat.startConversation({ sessionId });
    
    // Testar variação "Sim, já sou cliente"
    const response = await caller.chat.sendMessage({
      sessionId,
      content: "Sim, já sou cliente",
    });
    
    expect(response.message.toLowerCase()).toContain("pedido");
    expect(response.message.toLowerCase()).toContain("assistente");
  });

  it("deve aceitar variações de 'pedido'", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `test-pedido-var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await caller.chat.startConversation({ sessionId });
    await caller.chat.sendMessage({ sessionId, content: "sim" });
    
    // Testar variação "quero fazer um pedido"
    const response = await caller.chat.sendMessage({
      sessionId,
      content: "quero fazer um pedido",
    });
    
    expect(response.message.toLowerCase()).toContain("estabelecimento");
  });
});
