import { drizzle } from "drizzle-orm/mysql2";
import { catalogs, knowledgeBase } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seedInitialData() {
  console.log("🌱 Iniciando seed da base de dados...");

  try {
    // Inserir catálogo principal
    console.log("📋 Inserindo catálogo...");
    await db.insert(catalogs).values({
      name: "Catálogo Completo Bridor 2025",
      description: "Catálogo completo com toda a linha de produtos Bridor para panificação, confeitaria e food service",
      fileUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242486253/VAAcVwQToNKXtaJa.pdf",
      category: "Geral",
      isActive: true,
    });

    // Inserir base de conhecimento inicial
    console.log("📚 Inserindo base de conhecimento...");
    
    await db.insert(knowledgeBase).values([
      {
        category: "Empresa",
        question: "O que é a Bridor?",
        answer: "A Bridor é uma empresa especializada em panificação, confeitaria e food service, oferecendo produtos de alta qualidade para profissionais do setor.",
        keywords: "bridor, empresa, sobre, quem somos",
        isActive: true,
      },
      {
        category: "Produtos",
        question: "Quais produtos a Bridor oferece?",
        answer: "A Bridor oferece uma linha completa de produtos para panificação, confeitaria e food service, incluindo pães, massas, bolos, tortas e muito mais. Consulte nosso catálogo completo para ver todos os produtos disponíveis.",
        keywords: "produtos, linha, o que vendem, catálogo",
        isActive: true,
      },
      {
        category: "Atendimento",
        question: "Como faço um pedido?",
        answer: "Para fazer um pedido, você pode falar diretamente com nossa atendente Maria Luiza, que vai te ajudar com todas as informações sobre disponibilidade, preços e condições de entrega.",
        keywords: "pedido, comprar, como comprar, encomendar",
        isActive: true,
      },
      {
        category: "Atendimento",
        question: "Quem é a atendente?",
        answer: "Nossa atendente responsável é a Maria Luiza, que está pronta para te ajudar com pedidos, dúvidas sobre produtos e informações comerciais.",
        keywords: "atendente, maria luiza, contato, quem atende",
        isActive: true,
      },
      {
        category: "Produtos",
        question: "Vocês têm catálogo de produtos?",
        answer: "Sim! Temos um catálogo completo com todos os nossos produtos. Posso enviar para você agora mesmo!",
        keywords: "catálogo, catalogo, lista de produtos, produtos disponíveis",
        isActive: true,
      },
    ]);

    console.log("✅ Seed concluído com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seedInitialData();
