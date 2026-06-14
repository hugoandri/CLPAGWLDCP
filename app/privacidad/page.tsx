import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de DataGoal 2026: cómo tratamos los datos, uso de cookies, publicidad de Google AdSense y herramientas de analítica.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="container-page pb-12">
      <PageHeader
        eyebrow="Legal"
        title="Política de privacidad"
        description="Última actualización: junio de 2026. Esta es una plantilla base; revísala y adáptala a tu jurisdicción antes de publicar."
      />

      <div className="prose-datagoal mx-auto max-w-3xl space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="section-title mb-3 text-2xl">1. Introducción</h2>
          <p>
            En {siteConfig.name} (&laquo;el Sitio&raquo;) respetamos tu
            privacidad. Esta política explica qué información se recopila, cómo se
            usa y qué opciones tienes. Al usar el Sitio aceptas las prácticas aquí
            descritas.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">2. Información que recopilamos</h2>
          <p>
            El Sitio es principalmente informativo y no requiere registro. Podemos
            recopilar:
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Datos de uso anónimos (páginas visitadas, dispositivo, navegador).</li>
            <li>Información que nos envíes voluntariamente a través del formulario de contacto.</li>
            <li>Datos recogidos mediante cookies y tecnologías similares (ver más abajo).</li>
          </ul>
          <p className="mt-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/[0.03]">
            [Espacio para personalizar: detalla aquí los datos concretos que
            recojas si añades formularios funcionales, newsletter, etc.]
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">3. Cookies</h2>
          <p>
            Utilizamos cookies para recordar preferencias (como el modo claro u
            oscuro) y para medir el uso del Sitio. Puedes configurar tu navegador
            para rechazar las cookies, aunque algunas funciones podrían no
            comportarse correctamente.
          </p>
          <p className="mt-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/[0.03]">
            [Espacio para cookies: integra aquí tu banner de consentimiento de
            cookies (CMP) y la lista detallada de cookies utilizadas.]
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">4. Publicidad — Google AdSense</h2>
          <p>
            Este Sitio puede mostrar anuncios a través de Google AdSense. Google,
            como proveedor externo, utiliza cookies para mostrar anuncios basados
            en tus visitas a este y otros sitios web.
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Google y sus socios pueden usar cookies (como la cookie de DoubleClick)
              para publicar anuncios personalizados.
            </li>
            <li>
              Puedes desactivar la publicidad personalizada visitando la
              Configuración de anuncios de Google
              (<span className="break-all">google.com/settings/ads</span>).
            </li>
            <li>
              Más información sobre cómo Google usa los datos en
              <span className="break-all"> policies.google.com/technologies/partner-sites</span>.
            </li>
          </ul>
          <p className="mt-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/[0.03]">
            [Espacio para Google AdSense: cuando tu cuenta esté aprobada, añade
            aquí tu identificador de editor (ca-pub-XXXX) y cualquier requisito
            adicional de la cuenta.]
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">5. Analítica</h2>
          <p>
            Podemos utilizar herramientas de analítica web para entender de forma
            agregada cómo se usa el Sitio y mejorar el contenido.
          </p>
          <p className="mt-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/[0.03]">
            [Espacio para analytics: integra aquí tu proveedor (p. ej. Google
            Analytics 4 o una alternativa que respete la privacidad) y describe
            qué datos recoge.]
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">6. Tus derechos</h2>
          <p>
            Según tu país, puedes tener derecho a acceder, rectificar o eliminar
            tus datos personales, así como a oponerte a su tratamiento. Para
            ejercerlos, contáctanos a través de la página de contacto.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">7. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. Publicaremos la
            versión revisada en esta misma página con su fecha de actualización.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">8. Contacto</h2>
          <p>
            Para cualquier consulta sobre privacidad, escríbenos desde la{" "}
            <a href="/contacto" className="data-link">página de contacto</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
