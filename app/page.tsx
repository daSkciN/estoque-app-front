import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { ActionCards } from "@/components/action-cards"
import { Package, ShoppingCart, PackagePlus, TrendingUp } from "lucide-react"

export default function HomePage() {
  const menuItems = [
    {
      title: "Vendas",
      description: "Registrar nova venda",
      icon: ShoppingCart,
      href: "/vendas",
      color: "bg-chart-1",
    },
    {
      title: "Entrada de Estoque",
      description: "Adicionar produtos ao estoque",
      icon: PackagePlus,
      href: "/entrada-estoque",
      color: "bg-accent",
    },
    {
      title: "Adicionar Produto",
      description: "Cadastrar novo produto",
      icon: Package,
      href: "/adicionar-produto",
      color: "bg-chart-3",
    },
    {
      title: "Relatórios",
      description: "Ver estatísticas e relatórios",
      icon: TrendingUp,
      href: "/relatorios",
      color: "bg-chart-4",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Menu Principal" />

      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sistema de Controle de Estoque</h2>
          <p className="text-muted-foreground">Gerencie seu estoque de forma simples e eficiente</p>
        </div>

        <div className="mb-8">
          <StatsCards />
        </div>

        <ActionCards />
      </main>
    </div>
  )
}
