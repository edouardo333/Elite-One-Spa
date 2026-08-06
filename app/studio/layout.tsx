// Minimal root layout for the /studio segment only — it lives outside the
// (site) route group, so it doesn't inherit app/(site)/layout.tsx (fonts,
// LanguageProvider, IntroFlow, audio player, etc. are all irrelevant here).
// Metadata for this route comes from the page's own `export { metadata }`.
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
