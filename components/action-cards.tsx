"use client"

import { ShoppingCart, PackagePlus, Package2, BarChart3 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function ActionCards() {
  const router = useRouter()

  const actions = [
    {
      title: "Nova Venda",
      description: "Registrar uma nova venda",
      icon: ShoppingCart,
      color: "bg-primary",
      textColor: "text-primary-foreground",
      onClick: () => router.push("/vendas"),
    },
    {
      title: "Entrada de Estoque",
      description: "Adicionar produtos ao estoque",
      icon: PackagePlus,
      color: "bg-accent",
      textColor: "text-accent-foreground",
      onClick: () => router.push("/entrada-estoque"),
    },
    {
      title: "Adicionar Produto",
      description: "Cadastrar novo produto",
      icon: Package2,
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
      onClick: () => router.push("/adicionar-produto"),
    },
    {
      title: "Relatórios",
      description: "Ver relatórios e análises",
      icon: BarChart3,
      color: "bg-muted",
      textColor: "text-muted-foreground",
      onClick: () => router.push("/relatorios"),
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.title}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={action.onClick}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${action.color}`}>
                    <Icon className={`h-7 w-7 ${action.textColor}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
