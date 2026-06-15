import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de DataGoal Lab: cómo tratamos los datos, uso de cookies, publicidad de Google AdSense y herramientas de analítica.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="container-page pb-12">
      <PageHeader
        eyebrow="Legal"
        title="Política de privacidad"
        description="Última actualización: junio de 2026."
      />

      <div className="prose-datagoal mx-auto max-w-3xl space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="section-title mb-3 text-2xl">1. Introducción</h2>
          <p>
            En {siteConfig.name} (&laquo;el Sitio&raquo;) respetamos tu
            privacidad. Esta política explica qué información se recopila, cómo
            se usa y qué opciones tienes. Al usar el Sitio aceptas las prácticas
            aquí descritas.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">2. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos recogidos a través de
            este Sitio es el titular de {siteConfig.name}, contactable a través
            de la <a href="/contacto" className="data-link">página de contacto</a>.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">3. Información que recopilamos</h2>
          <p>
            El Sitio es principalmente informativo y no requiere registro.
            Podemos recopilar:
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Datos de uso anónimos (páginas visitadas, dispositivo, navegador,
              país de origen) mediante herramientas de analítica.
            </li>
            <li>
              Información que nos envíes voluntariamente a través del formulario
              de contacto (nombre, dirección de correo, mensaje).
            </li>
            <li>
              Datos recogidos mediante cookies y tecnologías similares (ver
              sección 4).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">4. Cookies</h2>
          <p>
            Utilizamos cookies para recordar preferencias (como el modo claro u
            oscuro), para medir el uso del Sitio y para mostrar publicidad. Al
            hacer clic en &laquo;Aceptar&raquo; en el banner de cookies consientes
            el uso de todas las cookies descritas en esta sección.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-white/[0.04]">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-navy dark:text-slate-100">Cookie</th>
                  <th className="px-4 py-2 text-left font-semibold text-navy dark:text-slate-100">Finalidad</th>
                  <th className="px-4 py-2 text-left font-semibold text-navy dark:text-slate-100">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">theme</td>
                  <td className="px-4 py-2">Preferencia de tema claro/oscuro</td>
                  <td className="px-4 py-2">Permanente (localStorage)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">cookie_consent</td>
                  <td className="px-4 py-2">Recuerda tu elección de cookies</td>
                  <td className="px-4 py-2">Permanente (localStorage)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">__gads, __gpi</td>
                  <td className="px-4 py-2">Publicidad de Google AdSense</td>
                  <td className="px-4 py-2">Hasta 13 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">
            Puedes gestionar o eliminar las cookies desde la configuración de tu
            navegador. Ten en cuenta que rechazar las cookies puede afectar a
            algunas funcionalidades del Sitio.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">5. Publicidad — Google AdSense</h2>
          <p>
            Este Sitio muestra anuncios a través de Google AdSense (editor:{" "}
            <span className="font-mono text-sm">{siteConfig.adsenseClientId}</span>).
            Google, como proveedor externo, utiliza cookies para mostrar anuncios
            basados en tus visitas a este y otros sitios web.
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Google y sus socios pueden usar cookies para publicar anuncios
              personalizados según tu historial de navegación.
            </li>
            <li>
              Puedes desactivar la publicidad personalizada en{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="data-link"
              >
                adssettings.google.com
              </a>
              .
            </li>
            <li>
              Más información:{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="data-link"
              >
                policies.google.com/technologies/partner-sites
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">6. Base legal del tratamiento</h2>
          <p>
            El tratamiento de los datos se basa en tu consentimiento (art. 6.1.a
            RGPD), otorgado al aceptar las cookies, y en el interés legítimo
            (art. 6.1.f RGPD) para el funcionamiento técnico del Sitio.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">7. Tus derechos</h2>
          <p>
            Conforme al Reglamento General de Protección de Datos (RGPD) tienes
            derecho a:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Acceder a tus datos personales.</li>
            <li>Rectificarlos si son inexactos.</li>
            <li>Solicitar su supresión.</li>
            <li>Oponerte al tratamiento o solicitar su limitación.</li>
            <li>Presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).</li>
          </ul>
          <p className="mt-2">
            Para ejercer tus derechos, contáctanos a través de la{" "}
            <a href="/contacto" className="data-link">página de contacto</a>.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">8. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. Publicaremos la
            versión revisada en esta misma página con su fecha de actualización.
            Te recomendamos revisarla periódicamente.
          </p>
        </section>
      </div>
    </div>
  );
}
