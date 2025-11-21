import { Link } from "react-router-dom"

interface ValuePropStripProps {
  variant?: "regular" | "compact"
}

const highlights = [
  {
    icon: "verified_user",
    title: "Pagos blindados en Stellar",
    description: "Cada transacción queda anclada con pruebas, sin exponer tus datos ni los del creador.",
  },
  {
    icon: "photo_library",
    title: "Biblioteca privada y verificable",
    description: "Tu compra vive en tu wallet: acceso inmediato, trazabilidad pública y control absoluto.",
  },
  {
    icon: "bolt",
    title: "Experiencia rápida y elegante",
    description: "Onboarding directo, compra en segundos y entrega optimizada para jurados y usuarios exigentes.",
  },
]

export function ValuePropStrip({ variant = "regular" }: ValuePropStripProps) {
  const isCompact = variant === "compact"
  const containerClasses = [
    isCompact ? "mt-6" : "mt-10",
    "rounded-2xl border border-white/5 bg-gradient-to-r from-[#0b0b14] via-[#0d0d1b] to-[#0b0c12] p-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.75)]",
  ].join(" ")

  return (
    <section className={containerClasses}>
      <div className={`flex flex-col gap-4 ${isCompact ? "md:flex-row md:items-center md:justify-between" : ""}`}>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Black Big Box</p>
          <h2 className={`font-semibold text-foreground ${isCompact ? "text-xl" : "text-2xl md:text-3xl"}`}>
            Diseño listo para convencer: compra privada, propiedad clara y entrega impecable.
          </h2>
          {!isCompact && (
            <p className="text-sm text-muted-foreground md:max-w-2xl">
              Presentamos una vitrina enfocada en confianza: copy directo, pasos simples y un flujo que grita
              profesionalismo para cualquier comité evaluador.
            </p>
          )}
        </div>

        <div className="flex flex-none items-center gap-3">
          <Link
            to="/discover"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-[1px] hover:border-secondary hover:text-secondary"
          >
            Ver catálogo
          </Link>
          <Link
            to="/connect"
            className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:-translate-y-[1px] hover:shadow-[0_10px_40px_-16px_rgba(255,204,0,0.9)]"
          >
            Conectar wallet
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
            <span className="material-symbols-outlined text-secondary">{item.icon}</span>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
