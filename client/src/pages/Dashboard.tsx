import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MessageCircle, FileText, ShoppingCart, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { data: conversations, isLoading } = trpc.conversations.list.useQuery();

  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = {
    total: conversations?.length || 0,
    information: conversations?.filter((c) => c.category === "information").length || 0,
    catalog: conversations?.filter((c) => c.category === "catalog").length || 0,
    order: conversations?.filter((c) => c.category === "order").length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral do sistema de atendimento automatizado
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Todas as conversas registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Informações</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.information}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Solicitações de informações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catálogos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.catalog}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Catálogos enviados automaticamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.order}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Transferidos para atendente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conversas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Conversas Recentes</CardTitle>
            <CardDescription>
              Últimas interações com o chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            {conversations && conversations.length > 0 ? (
              <div className="space-y-4">
                {conversations.slice(0, 5).map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {conv.customerName || "Cliente Anônimo"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {conv.customerPhone || "Sem telefone"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          conv.category === "order"
                            ? "bg-primary/10 text-primary"
                            : conv.category === "catalog"
                            ? "bg-blue-100 text-blue-800"
                            : conv.category === "information"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {conv.category === "order"
                          ? "Pedido"
                          : conv.category === "catalog"
                          ? "Catálogo"
                          : conv.category === "information"
                          ? "Informação"
                          : "Desconhecido"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conv.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa registrada ainda</p>
                <p className="text-sm mt-2">
                  Inicie uma conversa no chat para ver os dados aqui
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
