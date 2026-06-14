/**
 * Inyecta datos estructurados Schema.org (JSON-LD) en la página.
 * Acepta un objeto o un array de objetos.
 */
export default function SeoJsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // El contenido es generado por nosotros a partir de datos propios.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
