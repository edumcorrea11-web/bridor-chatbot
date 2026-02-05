import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, LayoutDashboard, BookOpen, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <MessageCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Bridor Chatbot
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema de atendimento automatizado inteligente para qualificação de clientes e envio de catálogos
          </p>
        </div>

        {/* Cards de Acesso */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Chat */}
          <Link href="/chat">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Chat de Atendimento</CardTitle>
                <CardDescription className="text-base">
                  Simule conversas com o chatbot e teste o fluxo de qualificação de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Iniciar Conversa
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Card Dashboard */}
          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50 h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Dashboard Admin</CardTitle>
                <CardDescription className="text-base">
                  Visualize histórico de conversas, estatísticas e gerencie configurações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" size="lg">
                  Acessar Dashboard
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recursos */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos do Sistema</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Qualificação Inteligente</h3>
              <p className="text-sm text-muted-foreground">
                Identifica automaticamente se o cliente busca informações, catálogo ou deseja fazer pedido
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Envio Automático</h3>
              <p className="text-sm text-muted-foreground">
                Catálogos são enviados automaticamente quando solicitados, sem intervenção humana
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Base de Conhecimento</h3>
              <p className="text-sm text-muted-foreground">
                Responde perguntas usando informações configuráveis sobre produtos e serviços
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
