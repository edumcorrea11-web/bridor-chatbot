import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Building2,
  Download,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const establishmentTypeLabels: Record<string, string> = {
  supermercado: "Supermercado",
  cafeteria: "Cafeteria",
  padaria_confeitaria: "Padaria/Confeitaria",
  buffet: "Buffet",
  catering: "Catering",
  distribuidor: "Distribuidor",
  representante: "Representante",
};

export default function Leads() {
  const { user, loading } = useAuth();
  const [filterType, setFilterType] = useState<string>("all");
  
  const { data: prospects, isLoading: loadingProspects } = trpc.leads.listProspects.useQuery();
  const { data: existingCustomers, isLoading: loadingCustomers } = trpc.leads.listExistingCustomers.useQuery();
  const { data: stats, isLoading: loadingStats } = trpc.leads.getStats.useQuery();

  if (loading || loadingProspects || loadingCustomers || loadingStats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredProspects = filterType === "all" 
    ? prospects 
    : prospects?.filter(p => p.establishmentType === filterType);

  const exportToCSV = () => {
    if (!prospects || prospects.length === 0) return;

    const headers = ["Nome", "Cidade", "Estado", "Tipo de Estabelecimento", "Data"];
    const rows = prospects.map(p => [
      p.leadName || "",
      p.leadCity || "",
      p.leadState || "",
      establishmentTypeLabels[p.establishmentType || ""] || "",
      new Date(p.createdAt).toLocaleDateString("pt-BR"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_bridor_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads & Prospects</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie e acompanhe novos contatos qualificados
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Prospects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProspects || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Novos contatos qualificados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Existentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalExistingCustomers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Já compram da Bridor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Principais Estados</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.byState && Object.keys(stats.byState).length > 0
                  ? Object.entries(stats.byState).sort((a, b) => b[1] - a[1])[0][0]
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estado com mais prospects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipo Predominante</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {stats?.byEstablishmentType && Object.keys(stats.byEstablishmentType).length > 0
                  ? establishmentTypeLabels[Object.entries(stats.byEstablishmentType).sort((a, b) => b[1] - a[1])[0][0]] || "-"
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tipo mais comum
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Lista de Prospects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Prospects</CardTitle>
                <CardDescription>
                  Novos contatos que ainda não são clientes
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="supermercado">Supermercado</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="padaria_confeitaria">Padaria/Confeitaria</SelectItem>
                    <SelectItem value="buffet">Buffet</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="distribuidor">Distribuidor</SelectItem>
                    <SelectItem value="representante">Representante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProspects && filteredProspects.length > 0 ? (
              <div className="space-y-3">
                {filteredProspects.map((prospect) => (
                  <div
                    key={prospect.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {prospect.leadName || "Nome não informado"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {prospect.leadCity || "?"}, {prospect.leadState || "?"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {establishmentTypeLabels[prospect.establishmentType || ""] || "Não informado"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(prospect.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(prospect.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhum prospect encontrado</p>
                <p className="text-sm mt-2">
                  {filterType !== "all"
                    ? "Tente ajustar os filtros"
                    : "Novos prospects aparecerão aqui quando identificados pelo chatbot"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribuição por Tipo */}
        {stats?.byEstablishmentType && Object.keys(stats.byEstablishmentType).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo de Estabelecimento</CardTitle>
              <CardDescription>
                Análise dos prospects por segmento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byEstablishmentType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => {
                    const total = stats.totalProspects || 1;
                    const percentage = ((count / total) * 100).toFixed(1);
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {establishmentTypeLabels[type] || type}
                          </span>
                          <span className="text-muted-foreground">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
