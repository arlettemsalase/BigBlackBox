import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { mockContents } from "@/lib/mock-data"
import { ValuePropStrip } from "@/components/value-prop-strip"

export default function DiscoverPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Galería privada</p>
          <h1 className="text-3xl font-bold md:text-4xl">Explora imágenes listas para compra confidencial</h1>
          <p className="text-muted-foreground">
            Selecciona, paga en Stellar y recibe tu descarga al instante. La misma promesa de privacidad y propiedad verificable
            que presentamos en el home vive aquí para que cualquier jurado vea la coherencia del producto.
          </p>
        </div>

        <ValuePropStrip variant="compact" />

        {/* Pinterest-style masonry layout */}
        <div className="columns-2 gap-2 md:columns-4 md:gap-3">
          {mockContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </main>
    </div>
  )
}
