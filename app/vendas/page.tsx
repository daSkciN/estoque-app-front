"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

interface ItemVenda {
  id: number;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export default function VendasPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);
  const [formData, setFormData] = useState({
    produtoId: "",
    produto: "",
    quantidade: "",
    precoUnitario: "",
  });
  const [produtos, setProdutos] = useState<
    {
      idProduto: number;
      nome: string;
      precoVenda: number;
      quantidadeEstoque: number;
    }[]
  >([]);

  const totalVenda = itensVenda.reduce((acc, item) => acc + item.subtotal, 0);

  useEffect(() => {
    api
      .get("/produto")
      .then((res) => setProdutos(res.data))
      .catch(() => toast({ title: "Erro ao carregar produtos" }));
  }, []);

  const handleAdicionarItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.produto || !formData.quantidade || !formData.precoUnitario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos antes de adicionar.",
      });
      return;
    }

    const novoItem: ItemVenda = {
      id: Number(formData.produtoId),
      produto: formData.produto,
      quantidade: Number.parseInt(formData.quantidade),
      precoUnitario: Number.parseFloat(formData.precoUnitario),
      subtotal:
        Number.parseInt(formData.quantidade) *
        Number.parseFloat(formData.precoUnitario),
    };

    setItensVenda([...itensVenda, novoItem]);

    toast({
      title: "Item adicionado!",
      description: `${formData.quantidade}x ${formData.produto} adicionado ao carrinho.`,
    });

    // Reset form
    setFormData({
      produtoId: "",
      produto: "",
      quantidade: "",
      precoUnitario: "",
    });
  };

  const handleRemoverItem = (id: number) => {
    setItensVenda(itensVenda.filter((item) => item.id !== id));
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho.",
    });
  };

  const handleFinalizarVenda = async () => {
    if (itensVenda.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos antes de finalizar a venda.",
      });
      return;
    }
    for (const item of itensVenda) {
      const produto = produtos.find((p) => p.idProduto === item.id);
      if (!produto) continue;

      if (item.quantidade > produto.quantidadeEstoque) {
        toast({
          title: "Estoque insuficiente",
          description: `O produto ${item.produto} possui apenas ${produto.quantidadeEstoque} unidade(s) disponível(is).`,
        });
        return; // interrompe o envio
      }
    }

    try {
      const payload = {
        itens: itensVenda.map((item) => ({
          idProduto: item.id,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        })),
      };

      await api.post("/venda", payload);

      toast({
        title: "Venda finalizada com sucesso!",
        description: `Total: R$ ${totalVenda.toFixed(2)}`,
      });

      setItensVenda([]);
    } catch (error) {
      toast({
        title: "Erro ao finalizar venda",
        description: "Ocorreu um erro ao registrar a venda no servidor.",
      });
    }
  };

  const handleSelecionarProduto = (nomeProduto: string) => {
    const produto = produtos.find((p) => p.nome === nomeProduto);
    if (!produto) return;

    setFormData({
      ...formData,
      produtoId: produto.idProduto.toString(),
      produto: produto.nome,
      precoUnitario: produto.precoVenda.toString(),
    });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Nova Venda" showBack />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulário de Adição */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Adicionar Produtos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione os produtos da venda
                </p>
              </div>
            </div>

            <form onSubmit={handleAdicionarItem} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto *</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full h-11 justify-between font-normal bg-transparent"
                    >
                      {formData.produto || "Selecione o produto..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Buscar produto..." />
                      <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                          {produtos.map((produto) => (
                            <CommandItem
                              key={produto.nome}
                              value={produto.nome}
                              onSelect={handleSelecionarProduto}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.produto === produto.nome
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{produto.nome}</span>
                                <span className="text-xs text-muted-foreground">
                                  R$ {produto.precoVenda}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
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

                <div className="space-y-2">
                  <Label htmlFor="precoUnitario">Preço Unitário (R$) *</Label>
                  <Input
                    id="precoUnitario"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.precoUnitario}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        precoUnitario: e.target.value,
                      })
                    }
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </form>
          </Card>

          {/* Carrinho de Vendas */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Carrinho</h2>
                <p className="text-sm text-muted-foreground">
                  {itensVenda.length} item(ns)
                </p>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <DollarSign className="h-6 w-6" />
                R$ {totalVenda.toFixed(2)}
              </div>
            </div>

            {itensVenda.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Nenhum produto adicionado
                </p>
                <p className="text-sm text-muted-foreground">
                  Adicione produtos para iniciar a venda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {itensVenda.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {item.produto}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-foreground">
                          R$ {item.subtotal.toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoverItem(item.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={handleFinalizarVenda}
                    className="w-full h-11"
                    size="lg"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Finalizar Venda - R$ {totalVenda.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
