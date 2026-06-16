# NZ Architectural Drafting / Residential Design Studio — Competitor Site Audit

Research for The Drawing Office (thedrawingoffice.com), Hobsonville, Auckland. Goal:
identify page/content patterns that comparable small NZ studios use, to inform the
SvelteKit rebuild.

## Section 1 — Studios sampled (12)

| # | Studio | URL | Location / region | Focus | Pages in main nav |
|---|---|---|---|---|---|
| 1 | Measure & Draw | https://measureanddraw.co.nz/ | Auckland | Residential renos, extensions, new builds; light commercial; consents | Home, About, Portfolio, Our Processes, Contact |
| 2 | CBA Design | https://www.cba-design.co.nz/ | Onehunga, Auckland | Residential, multi-unit, subdivisions, alterations | Home, Services (6 sub), Projects (4 sub), Blog, FAQ, Contact |
| 3 | Gubb Design | https://www.gubbdesign.co.nz/ | West Auckland (founded 2000) | New homes, additions, recladding, terraced housing, aged-care alts | Home, About, Services (7 sub), Projects, Blog, Contact |
| 4 | B+A Ltd | https://www.burrett.co.nz/ | Great South Rd, Auckland | Residential + small commercial; engineering in-house | Home, Services (6 sub), Portfolio, About, Contact |
| 5 | Architech Designs | https://www.architechdesigns.co.nz/ | Blockhouse Bay, Auckland | "Affordable" LBD residential drafting | Home, Services, Portfolio, About, Contact (per search) |
| 6 | Sonder Architecture | https://sonderarchitecture.co.nz/ | Wairau Valley, Nth Shore Akl | Renos, subdivisions, custom homes, granny flats, Healthy Homes | Services, Studio (4 sub), Projects, News & Insights, Contact |
| 7 | Box Studio | https://box.co.nz/ | Auckland | Design + build new homes & renos | (403 — search: Home, About, Process, Projects, Services, Contact) |
| 8 | Arcline Architecture | https://arcline.co.nz/ | Nationwide NZ | Residential design w/ 350-pt QA checklist | Plans, Work, Tools, About, Blog, Contact |
| 9 | Modal Architecture | https://www.modal.archi/ | Wellington + Auckland offices, nationwide | High-performance / sustainable homes | Home, About, Services, Projects, Process, Articles, FAQ, Careers, Contact |
| 10 | First Light Studio | https://firstlightstudio.co.nz/ | Wellington + Nelson, nationwide | Sustainable residential, NZIA award-winning | Projects, Interiors, Process (Approach + Renos), News, Studio, BUILD, Contact |
| 11 | Carolin Friese Architecture | https://www.cf-architecture.co.nz/ | Queenstown, nationwide | Passive House / sustainable residential | Home, About, Services, Projects, Passive House, Recognition, News, Contact |
| 12 | Sills van Bohemen | https://svb.co.nz/ | (search) Wellington/NZ | Residential | Has dedicated "The Architectural Process" page |
| 13 | Waller Projects | https://www.wallerprojects.co.nz/ | Whenuapai, Auckland (neighbour to Hobsonville) | Design-build bespoke residential; 20+ yrs | Home, Projects, 3D Designs, About, Contact, Help (Support, FAQs) |

(Also surfaced and worth quick visit: Daniel Marshall Architects on Hobsonville Rd —
direct geographic neighbour; LTD Architectural ltdarch.co.nz; Nala Studio nala.co.nz;
Chaney & Norman chaneynorman.nz; Day Architects dayarchitects.co.nz; Turner Road
turnerroad.co.nz; Holmes Architecture holmesarchitecture.co.nz.)

## Section 2 — Common patterns (showed up on nearly every site)

**Universal nav pages (10–12 of 12):**
- Home
- About / Studio / Our Story (founder bio + values)
- Services (almost always sub-categorised: new build, renovations/alterations,
  subdivisions, consents)
- Projects / Portfolio / Work (filterable grid w/ project detail pages)
- Contact (form + phone + email + physical address)

**Very common (7–9 of 12):**
- Process / Our Approach page — laid out as numbered stages. Stage count
  clusters around 5–7. Common labels: Brief / Concept / Developed design /
  Detailed design & consent / Tender / Construction observation. Arcline
  goes hardest (7 stages + 350-point checklist as marketing).
- Blog / News / Journal / Articles — used for SEO on consent + zoning topics
  and project reveals.
- Project detail pages with hero photo, brief, photo gallery, sometimes
  floor plan.
- Instagram link in footer (account exists even when feed isn't embedded).

**Common but not universal (4–6 of 12):**
- Testimonials — either a dedicated page or scattered quotes on Home /
  Services. Gubb has 7, CBA has 4. Photos rare.
- FAQ page (CBA, Modal). Strong SEO + trust signal.
- Services sub-pages per service type (every larger studio does this).
- Geographic regions served list in footer for SEO.

**Rare (1–3 of 12):**
- Fees / pricing page. Only Measure & Draw advertises "fixed-cost pricing
  from the start" on the homepage. Almost no one publishes numbers.
- Downloadable PDF brochure (Modal hosts one via ArchiPro).
- Careers page (Modal, Sonder).
- Embedded Instagram feed (most just link out).
- Sustainability / Healthy Homes dedicated page (Sonder, Modal,
  First Light, CF).

## Section 3 — Distinctive content ideas (a few do this, most don't)

- **Arcline's "350-point checklist"** — turns internal QA into a marketing
  trust signal. https://arcline.co.nz/architectural-design-process/
- **First Light "BUILD" external link** — separates design studio from a
  sister design-and-build offering; clean way to handle the design-vs-build
  question.
- **Modal's "Book a Meeting" CTA in main nav** — Calendly-style instead of
  a contact form, lower friction.
- **Sonder's "Free Feasibility Report" CTA** — lead magnet for early-stage
  clients (have a site, don't know what's possible).
- **CF Architecture "Recognition" page** — separates awards from news,
  high-signal trust page.
- **Gubb's specialisation pages** — "Recladding", "Aged Care/Assistance",
  "Bulk & Location Studies" are SEO long-tail wins very few competitors target.
- **CBA's FAQ + Blog combo** — covers consent timing, costs, zoning
  questions that every Auckland homeowner Googles.
- **Sonder's named team page** with each person's quals (LBP, BAS, MArch
  Prof, NZDipArchTech) — humanises the studio.
- **First Light's "Interiors" as its own nav item** — signals service
  breadth without burying it under Services.
- **Waller Projects' "3D Designs" nav item** — pre-build virtual
  walkthroughs surfaced as a headline service, not buried under Services.
  Their "Help → Support / FAQs" section is a clean way to host an FAQ.
  As a Whenuapai design-build studio it's the nearest geographic neighbour
  to Hobsonville sampled here; credentials shown: 20+ yrs, Master Builders
  awards, LBP.

## Section 4 — NZ-specific credentials commonly displayed

In rough order of frequency on the studios sampled:

1. **LBP — Licensed Building Practitioner** (Design 1/2/3). Most common
   single credential; shown by CBA, Gubb, Sonder, Modal. The bare-minimum
   trust marker for a drafting studio. Council building consent applications
   require an LBP-Design for restricted work.
2. **ADNZ — Architectural Designers New Zealand** (formerly NZIAD).
   The professional body for architectural designers (vs registered
   architects). Members display the ADNZ logo + member number. Shown by
   Gubb, B+A. The natural home for The Drawing Office.
3. **NZIA — New Zealand Institute of Architects.** Only registered
   architects (5+ years uni + registration). First Light prominently. Not
   applicable to a drafting studio unless a registered architect is on staff.
4. **NZGBC — New Zealand Green Building Council.** Sustainability signal.
   Gubb, B+A, Modal.
5. **Passive House (PHINZ / certified designer)** — Modal, CF, First Light.
   Premium positioning.
6. **Master Builders / NZCB (Certified Builders)** — appears on
   design-and-build studios (Box, Slate, Add Value). Not typically on a
   pure design studio.
7. **ArchiPro membership** — Modal. Lead-gen marketplace, more
   distribution than credential.
8. **AMOTAI** — Gubb. Supplier-diversity registration (Maori/Pasifika
   business). Notable but niche.

Council-side trust signals that occasionally show up: experience with
Auckland Council resource consent, Watercare, and specific Special Housing
Areas (relevant for Hobsonville Point).

## Recommendation snapshot for The Drawing Office

Minimum viable IA based on the above:

- Home (hero + 1-line positioning + 3 service tiles + 3 featured projects
  + 1 testimonial + ADNZ/LBP badges + CTA)
- About (founder + studio story + Hobsonville/West Auckland local angle)
- Services (sub-pages: New Homes, Renovations & Alterations, Subdivisions,
  Resource & Building Consents) — beats one flat list for SEO
- Process (5 stages, named in plain English)
- Projects (filterable grid + project detail pages)
- Blog / Journal (3–5 launch posts on Auckland consent process, zoning,
  Hobsonville Point design controls)
- Contact (form + phone + Hobsonville location + map)
- Footer: ADNZ + LBP badges, Instagram link, regions served list

Stretch wins from Section 3: a free 30-min consult or feasibility-call CTA
(Sonder pattern), an FAQ page (CBA pattern), a sustainability/Healthy
Homes blurb, and a named team page if/when staff grow.

## Sources

- https://measureanddraw.co.nz/
- https://www.cba-design.co.nz/
- https://www.gubbdesign.co.nz/
- https://www.burrett.co.nz/architectural-designer-auckland.html
- https://www.architechdesigns.co.nz/
- https://sonderarchitecture.co.nz/
- https://box.co.nz/
- https://arcline.co.nz/architectural-design-process/
- https://www.modal.archi/
- https://firstlightstudio.co.nz/
- https://www.cf-architecture.co.nz/
- https://svb.co.nz/the-architectural-process/
- https://www.wallerprojects.co.nz/
- https://adnz.org.nz/find-a-designer
