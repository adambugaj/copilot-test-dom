# Astro Portal (SEO-ready) — instrukcja

Ten projekt to starter portalu na Astro zoptymalizowany pod SEO i Cloudflare Pages.

Quick start:
1. Zainstaluj zależności:
   - npm install
2. Uruchom w trybie deweloperskim:
   - npm run dev
3. Zbuduj produkcyjnie (w tym generowanie sitemap.xml):
   - npm run build

Deploy na Cloudflare Pages:
- Repozytorium: wybierz repo z tym projektem.
- Build command: `npm run build`
- Build output directory: `dist`
- Ustaw zmienną środowiskową `SITE_URL` na adres Twojej strony (np. `https://mojastrona.pl`) w ustawieniach Pages — wykorzystana jest przy generowaniu sitemap, canonical itp.

Dodawanie nowych stron:
- Statyczna strona: dodaj plik `.astro` lub `.md` do `src/pages/`. Np. `src/pages/o-nas.astro` -> dostęp: `/o-nas`.
- Wpis/artykuł: dodaj plik Markdown do `src/content/posts/` z frontmatter (title, description, pubDate, tags). System automatycznie udostępni wpis pod `/posts/<slug>` oraz doda do listy wpisów.

SEO i indeksacja:
- Każda strona używa komponentu `SEO.astro` (meta tags, OpenGraph, Twitter, JSON-LD).
- Generowane: `sitemap.xml` (skrypt: `scripts/generate-sitemap.js`) i `public/robots.txt`.
- Zalecane: ustaw `SITE_URL` w Cloudflare Pages, aby canonical i sitemap wskazywały produkcyjny URL.

Pliki ważne:
- `src/components/SEO.astro` — centralny komponent SEO
- `src/content/config.ts` — konfiguracja kolekcji (posts)
- `scripts/generate-sitemap.js` — skrypt generujący sitemap.xml po buildzie

Jeśli chcesz, mogę rozszerzyć ten starter o:
- paginację, tagi i kategorie,
- obsługę obrazków z `@astrojs/image`,
- automatyczne generowanie RSS,
- integrację z komentarzami (Disqus/Utterances) i formularz kontaktowy.