"use client"

import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { ActionCards } from "@/components/action-cards";
import { Package, ShoppingCart, PackagePlus, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      )}

      <Header title="Menu Principal" />

      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sistema de Controle de Estoque</h2>
          <p className="text-muted-foreground">Gerencie seu estoque de forma simples e eficiente</p>
        </div>

        <div className="mb-8">
          <StatsCards onLoadingComplete={handleLoadingComplete} />
        </div>

        <ActionCards />
      </main>
    </div>
  )
}
