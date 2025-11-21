import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ValuePropStrip } from "@/components/value-prop-strip"

const steps = [
  {
    title: "Conecta tu Stellar wallet",
    description: "Sin extensiones raras ni pasos ocultos. Todo está listo para que un juez o usuario pueda entrar y probar.",
    icon: "link",
  },
  {
    title: "Explora, paga y descarga",
    description: "Elige una pieza, págala con pruebas en cadena y obtén acceso inmediato a la descarga, sin fricción.",
    icon: "shopping_bag",
  },
  {
    title: "Demuestra propiedad y privacidad",
    description: "Cada compra queda registrada. El creador cobra, tú conservas el control y no se filtra tu identidad.",
    icon: "security",
  },
]

const checklist = [
  "Copy en español e inglés corto, directo a valor.",
  "UX sencilla: CTA claros, pasos numerados, enlaces rápidos.",
  "Pruebas visibles: wallet, pagos y descargas verificables.",
  "Narrativa alineada: misma promesa en todo el producto.",
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 pb-16">
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#13162b] via-[#0b0c12] to-black px-6 py-12 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.85)] md:px-10 md:py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-secondary/20 blur-[120px]" />
            <div className="absolute right-0 -bottom-10 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
          </div>

          <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                Stellar ready
                <span className="material-symbols-outlined text-secondary">auto_awesome</span>
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Vende y compra sin dejar rastro, con una vitrina lista para convencer a cualquier jurado.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                Black Big Box es una sala de exhibición privada: onboarding simple, pagos blindados sobre Stellar y entregas
                verificables. La narrativa es consistente en todas las pantallas para que cualquiera entienda el valor en
                segundos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Link to="/discover">Explorar contenido</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5">
                  <Link to="/connect">Conectar wallet</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Link to="/library">Ver mi biblioteca</Link>
                </Button>
              </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <span className="material-symbols-outlined text-secondary">lock</span>
                    Pagos privados
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <span className="material-symbols-outlined text-secondary">verified</span>
                    Propiedad demostrable
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <span className="material-symbols-outlined text-secondary">speed</span>
                  Flujo listo para pitch
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Producto</p>
                    <p className="text-lg font-semibold">Black Big Box</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-3xl">widgets</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  La experiencia completa vive en este entorno: home, descubrimiento, checkout y librería comparten el mismo
                  mensaje de seguridad, propiedad y velocidad.
                </p>
                <div className="mt-4 grid gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">payments</span>
                      <p className="text-sm font-semibold">Pagos en XLM</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Instantáneo</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">key</span>
                      <p className="text-sm font-semibold">Pruebas listas</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Listas para demo</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">download_done</span>
                      <p className="text-sm font-semibold">Descarga segura</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Entrega privada</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-secondary/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">Checklist para jueces</p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground">
                    {checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary">task_alt</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ValuePropStrip />

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_-32px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-secondary/20 text-base font-semibold text-secondary-foreground">
                  {index + 1}
                </span>
                <span className="material-symbols-outlined text-secondary text-2xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">Narrativa coherente</p>
              <h3 className="text-2xl font-semibold md:text-3xl">La misma promesa en cada endpoint</h3>
              <p className="text-sm text-muted-foreground">
                Home, Discover, Checkout y Library repiten el mensaje: privacidad, propiedad verificable y velocidad. Los
                CTAs guían al usuario a probar el producto y a demostrar valor sin perder tiempo.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Copy listo para demo</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">UI coherente</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Flujo sin fricción</span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-muted-foreground">Tiempo estimado de demo</p>
                <p className="text-2xl font-semibold">3 minutos</p>
                <p className="mt-2 text-xs text-muted-foreground">Conecta, compra, descarga y prueba en vivo.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-muted-foreground">Mensajes clave</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">shield</span>
                    Privacidad cuidada
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">fingerprint</span>
                    Propiedad trazable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">track_changes</span>
                    Rápido de evaluar
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
