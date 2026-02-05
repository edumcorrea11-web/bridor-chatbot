import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  conversations, InsertConversation, Conversation,
  messages, InsertMessage, Message,
  knowledgeBase, InsertKnowledgeBase, KnowledgeBase,
  catalogs, InsertCatalog, Catalog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ User Management ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Conversations ============

export async function createConversation(data: InsertConversation): Promise<Conversation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(conversations).values(data);
  const insertedId = Number(result[0].insertId);
  
  const created = await db.select().from(conversations).where(eq(conversations.id, insertedId)).limit(1);
  return created[0]!;
}

export async function getConversationBySessionId(sessionId: string): Promise<Conversation | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(conversations).where(eq(conversations.sessionId, sessionId)).limit(1);
  return result[0];
}

export async function updateConversation(id: number, data: Partial<InsertConversation>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(conversations).set(data).where(eq(conversations.id, id));
}

export async function getAllConversations(): Promise<Conversation[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(conversations).orderBy(desc(conversations.createdAt));
}

export async function getConversationsByCategory(category: Conversation["category"]): Promise<Conversation[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(conversations)
    .where(eq(conversations.category, category))
    .orderBy(desc(conversations.createdAt));
}

// ============ Messages ============

export async function createMessage(data: InsertMessage): Promise<Message> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values(data);
  const insertedId = Number(result[0].insertId);
  
  const created = await db.select().from(messages).where(eq(messages.id, insertedId)).limit(1);
  return created[0]!;
}

export async function getMessagesByConversationId(conversationId: number): Promise<Message[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

// ============ Knowledge Base ============

export async function getAllActiveKnowledge(): Promise<KnowledgeBase[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(knowledgeBase)
    .where(eq(knowledgeBase.isActive, true))
    .orderBy(knowledgeBase.category);
}

export async function createKnowledge(data: InsertKnowledgeBase): Promise<KnowledgeBase> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(knowledgeBase).values(data);
  const insertedId = Number(result[0].insertId);
  
  const created = await db.select().from(knowledgeBase).where(eq(knowledgeBase.id, insertedId)).limit(1);
  return created[0]!;
}

export async function updateKnowledge(id: number, data: Partial<InsertKnowledgeBase>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(knowledgeBase).set(data).where(eq(knowledgeBase.id, id));
}

export async function deleteKnowledge(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
}

// ============ Catalogs ============

export async function getAllActiveCatalogs(): Promise<Catalog[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(catalogs)
    .where(eq(catalogs.isActive, true))
    .orderBy(catalogs.name);
}

export async function createCatalog(data: InsertCatalog): Promise<Catalog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(catalogs).values(data);
  const insertedId = Number(result[0].insertId);
  
  const created = await db.select().from(catalogs).where(eq(catalogs.id, insertedId)).limit(1);
  return created[0]!;
}

export async function updateCatalog(id: number, data: Partial<InsertCatalog>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(catalogs).set(data).where(eq(catalogs.id, id));
}

export async function deleteCatalog(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(catalogs).where(eq(catalogs.id, id));
}
