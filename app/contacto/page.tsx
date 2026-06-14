import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Tienes una sugerencia, una corrección de datos o una propuesta editorial? Escribe al equipo de DataGoal 2026.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="container-page pb-12">
      <PageHeader
        eyebrow="Hablemos"
        title="Contacto"
        description="Sugerencias, correcciones de datos, colaboraciones editoriales o consultas sobre el proyecto."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-navy dark:text-slate-100">
              Contacto editorial
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              DataGoal 2026 es un proyecto independiente de análisis estadístico.
              Si detectas un dato incorrecto o quieres proponer un tema de
              análisis, nos encantará leerte. Respondemos a sugerencias de
              contenido, colaboraciones y consultas de prensa.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-navy dark:text-slate-100">
              ¿Buscas datos o herramientas?
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li><a href="/predicciones" className="data-link">Predicciones del torneo</a></li>
              <li><a href="/calculadora" className="data-link">Calculadora de clasificación</a></li>
              <li><a href="/metodologia" className="data-link">Metodología y fuentes</a></li>
            </ul>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
