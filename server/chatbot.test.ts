import { describe, expect, it, beforeEach } from "vitest";
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

describe("Chat Router", () => {
  it("should start a new conversation", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.startConversation({
      sessionId: "test-session-" + Date.now(),
      customerName: "Test Customer",
    });

    expect(result.conversation).toBeDefined();
    expect(result.conversation.sessionId).toBeDefined();
    expect(result.welcomeMessage).toBeDefined();
    expect(result.welcomeMessage.content).toContain("Bem-vindo");
  });

  it("should send a message and receive bot response", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const sessionId = "test-session-" + Date.now();
    
    // Iniciar conversa
    await caller.chat.startConversation({
      sessionId,
      customerName: "Test Customer",
    });

    // Enviar mensagem
    const result = await caller.chat.sendMessage({
      sessionId,
      content: "Olá, gostaria de informações",
    });

    expect(result.message).toBeDefined();
    expect(result.message.sender).toBe("bot");
    expect(result.message.content).toBeDefined();
  });
});

describe("Knowledge Router", () => {
  it("should list knowledge base items", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.knowledge.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a new knowledge item", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.knowledge.create({
      category: "Test Category",
      question: "Test Question?",
      answer: "Test Answer",
      keywords: "test, keywords",
    });

    expect(result).toBeDefined();
    expect(result.category).toBe("Test Category");
    expect(result.question).toBe("Test Question?");
  });
});

describe("Catalogs Router", () => {
  it("should list catalogs", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.catalogs.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a new catalog", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.catalogs.create({
      name: "Test Catalog",
      description: "Test Description",
      fileUrl: "https://example.com/catalog.pdf",
      category: "Test",
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Test Catalog");
    expect(result.fileUrl).toBe("https://example.com/catalog.pdf");
  });
});

describe("Conversations Router", () => {
  it("should list all conversations", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.conversations.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter conversations by category", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.conversations.listByCategory({
      category: "catalog",
    });

    expect(Array.isArray(result)).toBe(true);
  });
});
