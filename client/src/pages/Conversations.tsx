import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Conversations() {
  const { user, loading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "information" | "catalog" | "order">("all");
  
  const { data: conversations, isLoading } = trpc.conversations.list.useQuery();
  const { data: messages } = trpc.conversations.getById.useQuery(
    { id: selectedConversation! },
    { enabled: selectedConversation !== null }
  );

  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredConversations = conversations?.filter((conv) => {
    if (filter === "all") return true;
    return conv.category === filter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Conversas</h1>
            <p className="text-muted-foreground mt-2">
              Visualize todas as interações com clientes
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              Todas
            </Button>
            <Button
              variant={filter === "information" ? "default" : "outline"}
              onClick={() => setFilter("information")}
              size="sm"
            >
              Informações
            </Button>
            <Button
              variant={filter === "catalog" ? "default" : "outline"}
              onClick={() => setFilter("catalog")}
              size="sm"
            >
              Catálogos
            </Button>
            <Button
              variant={filter === "order" ? "default" : "outline"}
              onClick={() => setFilter("order")}
              size="sm"
            >
              Pedidos
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {filteredConversations && filteredConversations.length > 0 ? (
              <div className="space-y-3">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {conv.customerName || "Cliente Anônimo"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {conv.customerPhone || "Sem telefone"} • ID: {conv.sessionId.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(conv.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma conversa encontrada</p>
                <p className="text-sm mt-2">
                  {filter !== "all"
                    ? "Tente ajustar os filtros"
                    : "Inicie uma conversa no chat para ver os dados aqui"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para visualizar mensagens */}
      <Dialog open={selectedConversation !== null} onOpenChange={() => setSelectedConversation(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Conversa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sender === "customer"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Nenhuma mensagem encontrada</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
