"use client";

import { TrendingUp, Package, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface StatsCardsProps {
  onLoadingComplete?: () => void;
}

export function StatsCards({ onLoadingComplete }: StatsCardsProps) {
  const [totalProdutos, setTotalProdutos] = useState<number | null>(null);
  const [totalVendas, setTotalVendas] = useState<number | null>(null);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(true);
  const [isLoadingVendas, setIsLoadingVendas] = useState(true);
  const hasCalledCallback = useRef(false);

  useEffect(() => {
    setIsLoadingProdutos(true);
    api
      .get("/produto")
      .then((res) => {
        setTotalProdutos(res.data.length);
      })
      .catch(() => {
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível obter o total de produtos.",
        });
      })
      .finally(() => {
        setIsLoadingProdutos(false);
      });
  }, []);

  useEffect(() => {
    setIsLoadingVendas(true);
    api
      .get("/venda")
      .then((res) => {
        setTotalVendas(res.data.length);
      })
      .catch(() => {
        toast({
          title: "Erro ao carregar vendas",
          description: "Não foi possível obter o total de vendas.",
        });
      })
      .finally(() => {
        setIsLoadingVendas(false);
      });
  }, []);

  useEffect(() => {
    if (
      !isLoadingProdutos &&
      !isLoadingVendas &&
      onLoadingComplete &&
      !hasCalledCallback.current
    ) {
      hasCalledCallback.current = true;
      onLoadingComplete();
    }
  }, [isLoadingProdutos, isLoadingVendas]);

  const stats = [
    {
      label: "Total de Produtos",
      value: totalProdutos !== null ? totalProdutos.toString() : "...",
      icon: Package,
      isLoading: isLoadingProdutos,
    },
    {
      label: "Total de vendas",
      value: totalVendas !== null ? totalVendas.toString() : "...",
      icon: TrendingUp,
      isLoading: isLoadingVendas,
    },
    {
      label: "Estoque Baixo",
      value: "...",
      icon: AlertCircle,
      trend: "-2",
      trendUp: false,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                {stat.isLoading ? (
                  <div className="h-9 w-16 animate-pulse rounded-md bg-muted" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  stat.trendUp ? "text-accent" : "text-destructive"
                }`}
              >
                {stat.trend}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
