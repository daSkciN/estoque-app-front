import { Package } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Controle de Estoque</h1>
            <p className="text-sm text-muted-foreground">Gerencie seu inventário</p>
          </div>
        </div>
      </div>
    </header>
  )
}
