"use client";

import { TrendingUp, Package, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { api } from "@/services/api"
import { toast } from "@/hooks/use-toast"

export function StatsCards() {
  const [totalProdutos, setTotalProdutos] = useState<number | null>(null)

  useEffect(() => {
    api
      .get("/produto")
      .then((res) => {
        setTotalProdutos(res.data.length)
      })
      .catch(() => {
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível obter o total de produtos.",
        })
      })
  }, [])
  const stats = [
    {
      label: "Total de Produtos",
      value: totalProdutos !== null ? totalProdutos.toString() : "...",
      icon: Package,
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Vendas Hoje",
      value: "32",
      icon: TrendingUp,
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Estoque Baixo",
      value: "5",
      icon: AlertCircle,
      trend: "-2",
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className={`text-sm font-medium ${stat.trendUp ? "text-accent" : "text-destructive"}`}>
                {stat.trend}
              </span>
              <span className="text-sm text-muted-foreground">vs. ontem</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
