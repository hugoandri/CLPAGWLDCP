// Configuración central del sitio. Cambia SITE_URL por tu dominio real
// antes de publicar (afecta a metadatos, sitemap, robots y Open Graph).

export const siteConfig = {
  name: "DataGoal Lab",
  shortName: "DataGoal Lab",
  url: "https://www.datagoallab.xyz",
  locale: "es_ES",
  description:
    "Análisis estadístico del Mundial 2026: partidos de hoy, tabla por grupos, predicciones, calculadora de clasificación y datos de selecciones. Sitio independiente, no es de apuestas.",
  slogan: "El Mundial 2026, explicado con datos.",
  author: "Redacción DataGoal",
  twitter: "@datagoal2026",
  // ID de cliente de Google AdSense (ca-pub-XXXXXXXXXXXXXXXX).
  // Déjalo vacío hasta tener la cuenta aprobada (ver components/AdSlot.tsx).
  adsenseClientId: "ca-pub-6698900918719015",
} as const;

export const mainNav = [
  { href: "/", label: "Inicio" },
  { href: "/partidos", label: "Partidos" },
  { href: "/tabla", label: "Tablas" },
  { href: "/predicciones", label: "Predicciones" },
  { href: "/selecciones", label: "Selecciones" },
  { href: "/tendencias", label: "Tendencias" },
  { href: "/calculadora", label: "Calculadora" },
] as const;

export const footerNav = [
  {
    title: "Explorar",
    links: [
      { href: "/partidos", label: "Calendario de partidos" },
      { href: "/tabla", label: "Tabla por grupos" },
      { href: "/predicciones", label: "Predicciones" },
      { href: "/selecciones", label: "Selecciones" },
    ],
  },
  {
    title: "Herramientas",
    links: [
      { href: "/calculadora", label: "Calculadora de clasificación" },
      { href: "/tendencias", label: "Tendencias del Mundial" },
      { href: "/metodologia", label: "Metodología" },
    ],
  },
  {
    title: "Información",
    links: [
      { href: "/contacto", label: "Contacto" },
      { href: "/privacidad", label: "Política de privacidad" },
      { href: "/metodologia", label: "Sobre los datos" },
    ],
  },
] as const;

export const DISCLAIMER_SHORT =
  "DataGoal Lab es un sitio independiente de análisis estadístico. No está afiliado a FIFA ni a ninguna federación.";

export const DISCLAIMER_BETTING =
  "Este análisis es informativo y estadístico. No constituye consejo de apuestas.";
