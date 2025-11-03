"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

interface Categoria {
  idCategoria: number;
  nome: string;
}

export default function AdicionarProdutoPage() {
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    nomeCategoria: "",
    precoCusto: "",
    precoVenda: "",
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categoria");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar a lista de categorias.",
        });
      }
    };

    fetchCategorias();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.nomeCategoria ||
      !formData.precoCusto ||
      !formData.precoVenda
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de cadastrar.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        nomeCategoria: formData.nomeCategoria,
        precoCusto: Number.parseFloat(formData.precoCusto),
        precoVenda: Number.parseFloat(formData.precoVenda),
      };

      const response = await api.post("/produto", payload);
      console.log("Produto cadastrado:", response.data);

      toast({
        title: "Produto cadastrado ✅",
        description: `${formData.nome} foi adicionado ao sistema.`,
      });

      setFormData({
        nome: "",
        nomeCategoria: "",
        precoCusto: "",
        precoVenda: "",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao cadastrar produto",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Adicionar Produto" showBack />

      <main className="container mx-auto px-4 py-8 max-w-2xl px-16">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Cadastrar Produto
              </h2>
              <p className="text-sm text-muted-foreground">
                Adicione um novo produto ao sistema
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Ex: Notebook Dell Inspiron"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.nomeCategoria}
                onValueChange={(value) =>
                  setFormData({ ...formData, nomeCategoria: value })
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
                  ) : (
                    categorias.map((categoria) => (
                      <SelectItem
                        key={categoria.idCategoria}
                        value={categoria.nome}
                      >
                        {categoria.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="precoCusto">Preço de Custo (R$) *</Label>
                <Input
                  id="precoCusto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.precoCusto}
                  onChange={(e) =>
                    setFormData({ ...formData, precoCusto: e.target.value })
                  }
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
                <Input
                  id="precoVenda"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.precoVenda}
                  onChange={(e) =>
                    setFormData({ ...formData, precoVenda: e.target.value })
                  }
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Cadastrar Produto
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Dica:</strong> Certifique-se de que o preço de venda seja
            maior que o preço de custo para garantir margem de lucro.
          </p>
        </div>
      </main>
    </div>
  );
}
