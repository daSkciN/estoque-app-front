import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"

interface HeaderProps {
  title: string
  showBack?: boolean
}

export function Header({ title, showBack = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-center px-4">
        {showBack ? (
          <Link
            href="/"
            className="absolute left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="absolute left-4 flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Estoque Pro</span>
          </Link>
        )}

        <h1 className="text-lg font-semibold text-center">{title}</h1>
      </div>
    </header>
  );
}