import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Leads Router", () => {
  it("should update qualification data for a prospect", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const sessionId = "test-session-" + Date.now() + "-" + Math.random().toString(36).substring(7);
    
    // Criar conversa
    await caller.chat.startConversation({
      sessionId,
      customerName: "Test Prospect",
    });

    // Atualizar qualificação
    const result = await caller.leads.updateQualification({
      sessionId,
      isExistingCustomer: false,
      leadName: "João Silva",
      leadCity: "São Paulo",
      leadState: "SP",
      establishmentType: "padaria_confeitaria",
    });

    expect(result.success).toBe(true);
  });

  it("should list prospects only", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.listProspects();

    expect(Array.isArray(result)).toBe(true);
    // Todos devem ter isExistingCustomer = false
    result.forEach(prospect => {
      expect(prospect.isExistingCustomer).toBe(false);
    });
  });

  it("should list existing customers only", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.listExistingCustomers();

    expect(Array.isArray(result)).toBe(true);
    // Todos devem ter isExistingCustomer = true
    result.forEach(customer => {
      expect(customer.isExistingCustomer).toBe(true);
    });
  });

  it("should get leads statistics", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.getStats();

    expect(result).toBeDefined();
    expect(typeof result.totalProspects).toBe("number");
    expect(typeof result.totalExistingCustomers).toBe("number");
    expect(result.byEstablishmentType).toBeDefined();
    expect(result.byState).toBeDefined();
  });
});

describe("Chat Flow - Qualification", () => {
  it("should start conversation with qualification question", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const sessionId = "test-session-" + Date.now() + "-" + Math.random().toString(36).substring(7);
    
    const result = await caller.chat.startConversation({
      sessionId,
      customerName: "Test User",
    });

    expect(result.welcomeMessage.content).toContain("já é cliente da Bridor");
    expect(result.welcomeMessage.content).toContain("sim");
    expect(result.welcomeMessage.content).toContain("não");
  });

  it("should handle existing customer response", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const sessionId = "test-session-" + Date.now() + "-" + Math.random().toString(36).substring(7);
    
    // Iniciar conversa
    await caller.chat.startConversation({
      sessionId,
      customerName: "Existing Customer",
    });

    // Responder que é cliente existente
    const result = await caller.chat.sendMessage({
      sessionId,
      content: "Sim, já sou cliente",
    });

    expect(result.message).toBeDefined();
    expect(result.message.sender).toBe("bot");
    // Bot deve responder (LLM pode variar a resposta)
    expect(result.message.content.length).toBeGreaterThan(0);
  });

  it("should handle prospect response and collect data", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const sessionId = "test-session-" + Date.now() + "-" + Math.random().toString(36).substring(7);
    
    // Iniciar conversa
    await caller.chat.startConversation({
      sessionId,
      customerName: "New Prospect",
    });

    // Responder que NÃO é cliente
    const result = await caller.chat.sendMessage({
      sessionId,
      content: "Não, ainda não sou cliente",
    });

    expect(result.message).toBeDefined();
    expect(result.message.sender).toBe("bot");
    // Bot deve responder (LLM pode variar a resposta)
    expect(result.message.content.length).toBeGreaterThan(0);
  });
});
