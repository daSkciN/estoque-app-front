"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PackagePlus, Check, Loader2 } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export default function EntradaEstoquePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: "",
  });
  const [produtos, setProdutos] = useState<
    { idProduto: number; nome: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const produtosFiltrados = useMemo(
    () =>
      produtos.filter((p) =>
        p.nome.toLowerCase().includes(search.toLowerCase())
      ),
    [produtos, search]
  );

  useEffect(() => {
    api
      .get("/produto")
      .then((res) => setProdutos(res.data))
      .catch(() => toast({ title: "Erro ao carregar produtos" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.produto || isNaN(Number(formData.produto))) {
      toast({
        title: "Selecione um produto",
        description: "É necessário escolher um produto da lista.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        idProduto: Number(formData.produto),
        quantidade: Number(formData.quantidade),
      };

      const response = await api.post("/entradaEstoque", payload);
      console.log("Entrada registrada:", response.data);

      toast({
        title: "Entrada registrada ✅",
        description: `${formData.quantidade} unidades adicionadas ao estoque.`,
      });

      setFormData({
        produto: "",
        quantidade: "",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao registrar entrada",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Entrada de Estoque" showBack />

      <main className="container mx-auto px-4 py-8 max-w-2xl px-16">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <PackagePlus className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Registrar Entrada
              </h2>
              <p className="text-sm text-muted-foreground">
                Adicione produtos ao seu estoque
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger className="w-full border rounded px-3 py-2 text-left">
                  {formData.produto
                    ? produtos.find(
                        (p) => p.idProduto === Number(formData.produto)
                      )?.nome
                    : "Selecione um produto"}
                </PopoverTrigger>

                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Pesquisar produto..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup>
                      {produtosFiltrados.map((produto) => (
                        <CommandItem
                          key={produto.idProduto}
                          onSelect={() => {
                            setFormData({
                              ...formData,
                              produto: String(produto.idProduto),
                            });
                            setOpen(false);
                            setSearch("");
                          }}
                        >
                          {produto.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={formData.quantidade}
                  onChange={(e) =>
                    setFormData({ ...formData, quantidade: e.target.value })
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
                    Confirmar Entrada
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Dica:</strong> Certifique-se de verificar a quantidade antes
            de confirmar a entrada no estoque.
          </p>
        </div>
      </main>
    </div>
  );
}
