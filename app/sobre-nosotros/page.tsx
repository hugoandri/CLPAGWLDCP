import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SeoJsonLd from "@/components/SeoJsonLd";
import { collectionPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre DataGoal Lab — el equipo detrás del análisis",
  description:
    "DataGoal Lab es un proyecto independiente de análisis estadístico del Mundial 2026. Conoce al equipo editorial, nuestra visión y por qué creamos este sitio.",
  alternates: { canonical: "/sobre-nosotros" },
};

const team = [
  {
    name: "Redacción DataGoal",
    role: "Edición y análisis",
    bio: "DataGoal Lab nace de la idea de que los datos pueden hacer el fútbol más interesante sin necesidad de promover apuestas. Somos un equipo pequeño de analistas y desarrolladores que creemos en el análisis informativo, transparente y accesible para cualquier aficionado al Mundial 2026."
  },
  {
    name: "Colaboradores",
    role: "Datos y tecnología",
    bio: "El sitio está construido con datos públicos de la FIFA y fuentes abiertas. Las visualizaciones, la calculadora de clasificación y los rankings internos son desarrollos propios, documentados en nuestra página de metodología."
  }
];

const valores = [
  {
    titulo: "Independencia",
    desc: "No estamos afiliados a FIFA, casas de apuestas ni ninguna federación. No vendemos pronósticos ni predicciones de pago."
  },
  {
    titulo: "Transparencia",
    desc: "Explicamos cómo funciona nuestro modelo, qué variables usa y cuáles son sus limitaciones. No maquillamos la incertidumbre."
  },
  {
    titulo: "Contenido original",
    desc: "Cada artículo, análisis y herramienta está escrito y desarrollado por nuestro equipo editorial. No publicamos contenido generado automáticamente sin revisión."
  }
];

export default function SobreNosotrosPage() {
  const jsonLd = collectionPageJsonLd({
    name: "Sobre DataGoal Lab",
    description: "Conoce al equipo y la visión de DataGoal Lab",
    path: "/sobre-nosotros",
  });

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="DataGoal Lab"
        title="Sobre nosotros"
        description="Un proyecto independiente de análisis estadístico del Mundial 2026. Sin apuestas, sin predicciones de pago: solo datos y contexto."
      />

      <div className="mx-auto max-w-3xl space-y-10">
        <section className="card p-6">
          <h2 className="section-title mb-3 text-xl">Nuestra visión</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            DataGoal Lab nació en 2026 con un objetivo claro: ofrecer una forma
            diferente de seguir el Mundial. Donde otros sitios empujan pronósticos
            de apuestas o contenido genérico, nosotros apostamos por el análisis
            estadístico transparente, las herramientas interactivas y el contenido
            editorial pensado para el aficionado que quiere entender el torneo
            más allá del marcador.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Creemos que los datos bien explicados hacen el fútbol más interesante.
            Por eso cada probabilidad, cada ranking y cada artículo incluyen un
            enlace a nuestra metodología y una explicación de lo que significan
            —y lo que no— los números.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-4 text-xl">Valores editoriales</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {valores.map((v) => (
              <div key={v.titulo} className="card p-5">
                <h3 className="font-display text-lg font-bold text-navy dark:text-slate-100">
                  {v.titulo}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-4 text-xl">Equipo</h2>
          <div className="space-y-4">
            {team.map((m) => (
              <div key={m.name} className="card p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pitch to-navy-900 text-xl font-bold text-white">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy dark:text-slate-100">
                      {m.name}
                    </h3>
                    <p className="text-sm text-pitch-600 dark:text-pitch-400">
                      {m.role}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="card bg-gradient-to-br from-navy-950 to-navy-900 p-6 text-white">
          <h2 className="font-display text-xl font-bold">¿Quieres saber más?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Lee nuestra metodología para entender cómo funcionan los datos, o
            escríbenos si tienes alguna pregunta.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/metodologia" className="btn-primary !bg-white !text-navy-900 hover:!bg-slate-200">
              Ver metodología
            </Link>
            <Link href="/contacto" className="btn-ghost !border-white/20 !text-white hover:!border-white/40">
              Contacto
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
