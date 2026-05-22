# RankForge Audit Framework

Use this framework to convert page evidence into prioritized findings and redesign recommendations. Cite the source URLs shown here in the audit.

## 1. Technical Eligibility

Search visibility starts with technically accessible pages. Verify that important pages return successful HTTP status codes, are reachable through crawlable links, render meaningful content, work on mobile, and do not depend on fragile client-side behavior for essential content.

Sources:
- Search Essentials: https://developers.google.com/search/docs/essentials
- Technical requirements: https://developers.google.com/search/docs/essentials/technical
- How Search works: https://developers.google.com/search/docs/fundamentals/how-search-works
- JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Fix JavaScript search issues: https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript
- Crawlable links: https://developers.google.com/search/docs/crawling-indexing/links-crawlable

Audit prompts:
- Can Googlebot fetch the URL and linked resources?
- Is the primary content present in rendered HTML?
- Are internal links normal anchor links with crawlable href values?
- Does the page work as a mobile page, not only as a desktop experience?

## 2. Crawl and Index Controls

Robots.txt controls crawling, not indexing. noindex controls indexing but must be crawlable to be seen. Canonicals consolidate duplicate URL signals but are hints. Sitemaps help discovery and should list canonical, indexable URLs.

Sources:
- Crawling and indexing overview: https://developers.google.com/search/docs/crawling-indexing
- Robots.txt introduction: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Robots meta tag and X-Robots-Tag: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Block Search indexing: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Canonicalization: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Consolidate duplicate URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Sitemaps overview: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Audit prompts:
- Are important pages indexable and canonical to themselves or a correct primary URL?
- Are low-value/private/duplicate pages intentionally excluded?
- Are robots rules blocking resources or pages that need to be crawled?
- Does the sitemap reflect the intended canonical index?

## 3. People-First Helpful Content

Content should be made for people first, demonstrate first-hand value or expertise, satisfy the intended audience, and avoid search-engine-first tactics. AI-generated content is not inherently against policy; abuse and low-value scaled content are the risks.

Sources:
- Creating helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Using generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

Audit prompts:
- Does each page have a clear audience, purpose, and original value?
- Is the content complete enough for the visitor's task?
- Are claims, recommendations, authorship, and dates clear where they matter?
- Is AI-assisted content reviewed, useful, and non-scaled/spammy?

## 4. Generative AI Visibility

Google's AI optimization guidance emphasizes durable fundamentals: make pages crawlable, indexable, useful, clear, consistent, and eligible for search features. Structure content so answerable sections, entity relationships, and supporting facts are easy to identify.

Sources:
- AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- How Search works: https://developers.google.com/search/docs/fundamentals/how-search-works
- Helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Audit prompts:
- Are key answers expressed directly on indexable pages?
- Do pages expose concise summaries, definitions, comparisons, steps, FAQs, or evidence where useful?
- Is the rendered page consistent with source HTML and structured data?
- Are important entities and relationships named plainly?

## 5. Entity Clarity and Trust Signals

Search systems need to understand who is responsible for the site, what the organization offers, and how pages relate to topics, products, people, and locations. Redesigns should make entity facts easy for both users and crawlers.

Sources:
- Establish business details: https://developers.google.com/search/docs/appearance/establish-business-details
- Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- Local business structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Site names: https://developers.google.com/search/docs/appearance/site-names

Audit prompts:
- Is the organization identity explicit and consistent?
- Are products/services/locations connected to relevant proof, pages, and CTAs?
- Are author, reviewer, date, and business details visible where they affect trust?

## 6. Structured Data

Structured data can help Google understand eligible pages and enable rich results, but it must match visible content and follow Google policies. Prefer JSON-LD where practical and validate eligibility by page type.

Sources:
- Structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Search gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- FAQPage structured data: https://developers.google.com/search/docs/appearance/structured-data/faqpage

Audit prompts:
- Is schema present only where the page type is eligible?
- Does structured data match visible user-facing content?
- Are required and recommended properties included?
- Could breadcrumbs, organization, article, product, local business, or FAQ schema improve clarity?

## 7. Search Appearance

Search appearance depends on clear titles, snippets, images, favicons, site names, breadcrumbs, and preview controls. Redesigns should provide unique titles, descriptive meta descriptions, crawlable images, and page sections that can produce useful snippets.

Sources:
- Control title links: https://developers.google.com/search/docs/appearance/title-link
- Control snippets: https://developers.google.com/search/docs/appearance/snippet
- Google Images best practices: https://developers.google.com/search/docs/appearance/google-images
- Favicon in Search: https://developers.google.com/search/docs/appearance/favicon-in-search
- Site names: https://developers.google.com/search/docs/appearance/site-names
- Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

Audit prompts:
- Are titles unique, descriptive, and aligned with page content?
- Do pages include useful snippet-worthy text?
- Are images meaningful, accessible, and crawlable?
- Are site name, favicon, and breadcrumbs configured?

## 8. Redesign Opportunities

Translate findings into design and implementation changes. Prioritize template-level fixes before one-off copy edits when the same issue appears across many pages.

Common opportunities:
- Simplify IA around user intents and entity relationships.
- Add indexable answer sections to important pages.
- Create comparison, FAQ, proof, pricing, implementation, and troubleshooting sections where users need them.
- Improve internal linking from high-level pages to supporting detail pages.
- Consolidate thin or duplicative pages into stronger canonical resources.
- Add structured data only after visible content and policy alignment are correct.

## 9. Spam and Policy Risk

Flag risks clearly and separate confirmed violations from potential exposure. Search Essentials and spam policies should guide the risk language.

Sources:
- Spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Search Essentials: https://developers.google.com/search/docs/essentials
- Structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies

Risk prompts:
- Scaled low-value content
- Cloaking or sneaky redirects
- Doorway pages
- Hidden text or links
- Scraped or automatically generated low-value content
- Link spam or manipulative outbound links
- Structured data that marks up invisible or misleading content
