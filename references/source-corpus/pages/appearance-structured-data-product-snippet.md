---
url: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
title: "Dados estruturados do snippet de produto ( Product , Review , Offer )"
fetched_at: 2026-05-16T16:53:13.092Z
seed: false
---

# Dados estruturados do snippet de produto ( Product , Review , Offer )

Source: https://developers.google.com/search/docs/appearance/structured-data/product-snippet

- 
 
 
 
 
 
 
 
 Página inicial
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envie comentários
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Dados estruturados do snippet de produto ( Product , Review , Offer )

 

 
 
 Quando você adiciona a marcação Product à sua página, ela pode se qualificar para exibição como um snippet
 de produto, que é um resultado de texto 
 que inclui outras informações do produto, como classificações, informações de avaliação, preço
 e disponibilidade.

 
 Este guia se concentra nos requisitos de dados estruturados de Product para
 snippets de produtos. Se você não souber qual marcação usar, leia nossa
 introdução à marcação Product .

 Os clientes podem comprar produtos seus? Adicione a
 marcação de produtos do comerciante .

 
 

# 
 Como adicionar dados estruturados
 

 
 Os dados estruturados são um formato padronizado para fornecer informações sobre uma página e classificar o
 conteúdo dela. Caso você não saiba muito sobre o assunto, veja
 como os dados estruturados funcionam .
 

 
 Esta é uma visão geral de como criar, testar e lançar dados estruturados.

 
 
- Adicione as propriedades obrigatórias . Com base no
 formato que você está usando, saiba onde inserir dados estruturados na página .
 
 Usando um CMS? Talvez seja mais fácil usar um plug-in integrado ao CMS.
 

 Usando JavaScript? Saiba como
 gerar dados estruturados com JavaScript .

 
 
- Siga as diretrizes . 
 
- Valide o código com o
 Teste de pesquisa aprimorada 
 e corrija os erros críticos. Corrija também os problemas não críticos que possam ser sinalizados
 na ferramenta, porque eles podem melhorar a qualidade dos dados estruturados, mas isso não é necessário para se qualificar para pesquisas aprimoradas. 
 
- Implante algumas páginas que incluam os dados estruturados e use a Ferramenta de inspeção de URL para testar como o Google vê a página. Verifique se a página está
 acessível ao Google e se não está bloqueada por um arquivo robots.txt, pela tag noindex ou
 por requisitos de login. Se estiver tudo certo,
 peça ao Google para rastrear novamente seus URLs .
 Observação : aguarde a conclusão do novo rastreamento e da reindexação. Pode
 levar vários dias depois da publicação de uma página para que o Google a localize e rastreie.

 
 
- Para informar o Google sobre mudanças futuras, recomendamos que você
 envie um sitemap . É possível automatizar isso com a API Search Console Sitemap . 
 

 
 

# Exemplos

 
 Os exemplos a seguir ilustram como incluir dados estruturados nas suas páginas da Web para diferentes situações.

# Página de avaliação do produto

 Veja um exemplo de dados estruturados em uma página de avaliação do produto para tratamento de snippets de produto nos resultados da pesquisa.

 
 
 

# JSON-LD

 <html>
 <head>
 <title>Executive Anvil</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "Product",
 "name": "Executive Anvil",
 "image": [
 "https://example.com/photos/1x1/photo.jpg",
 "https://example.com/photos/4x3/photo.jpg",
 "https://example.com/photos/16x9/photo.jpg"
 ],
 "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
 "sku": "0446310786",
 "mpn": "925872",
 "brand": {
 "@type": "Brand",
 "name": "ACME"
 },
 "review": {
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 4,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "Fred Benson"
 }
 },
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": 4.4,
 "reviewCount": 89
 },
 "offers": {
 "@type": "Offer",
 "url": "https://example.com/anvil",
 "priceCurrency": "USD",
 "price": 119.99,
 "priceValidUntil": "2024-11-20",
 "itemCondition": "https://schema.org/UsedCondition",
 "availability": "https://schema.org/InStock"
 }
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Executive Anvil</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "Product",
 "name": "Executive Anvil",
 "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
 "review": {
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 4,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "Fred Benson"
 }
 },
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": 4.4,
 "reviewCount": 89
 }
 }
 </script>
 </head>
 <body>
 </body>
</html>
 
 

 
 

# RDFa

 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div typeof="schema:Product">
 <div rel="schema:review">
 <div typeof="schema:Review">
 <div rel="schema:reviewRating">
 <div typeof="schema:Rating">
 <div property="schema:ratingValue" content="4"></div>
 <div property="schema:bestRating" content="5"></div>
 </div>
 </div>
 <div rel="schema:author">
 <div typeof="schema:Person">
 <div property="schema:name" content="Fred Benson"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:image" resource="https://example.com/photos/4x3/photo.jpg"></div>
 <div property="schema:mpn" content="925872"></div>
 <div property="schema:name" content="Executive Anvil"></div>
 <div property="schema:description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."></div>
 <div rel="schema:image" resource="https://example.com/photos/1x1/photo.jpg"></div>
 <div rel="schema:brand">
 <div typeof="schema:Brand">
 <div property="schema:name" content="ACME"></div>
 </div>
 </div>
 <div rel="schema:aggregateRating">
 <div typeof="schema:AggregateRating">
 <div property="schema:reviewCount" content="89"></div>
 <div property="schema:ratingValue" content="4.4"></div>
 </div>
 </div>
 <div rel="schema:offers">
 <div typeof="schema:Offer">
 <div property="schema:price" content="119.99"></div>
 <div property="schema:availability" content="https://schema.org/InStock"></div>
 <div property="schema:priceCurrency" content="USD"></div>
 <div property="schema:priceValidUntil" datatype="xsd:date" content="2024-11-20"></div>
 <div rel="schema:url" resource="https://example.com/anvil"></div>
 <div property="schema:itemCondition" content="https://schema.org/UsedCondition"></div>
 </div>
 </div>
 <div rel="schema:image" resource="https://example.com/photos/16x9/photo.jpg"></div>
 <div property="schema:sku" content="0446310786"></div>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div typeof="schema:Product">
 <div rel="schema:review">
 <div typeof="schema:Review">
 <div rel="schema:reviewRating">
 <div typeof="schema:Rating">
 <div property="schema:ratingValue" content="4"></div>
 <div property="schema:bestRating" content="5"></div>
 </div>
 </div>
 <div rel="schema:author">
 <div typeof="schema:Person">
 <div property="schema:name" content="Fred Benson"></div>
 </div>
 </div>
 </div>
 </div>
 <div property="schema:name" content="Executive Anvil"></div>
 <div property="schema:description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."></div>
 <div rel="schema:aggregateRating">
 <div typeof="schema:AggregateRating">
 <div property="schema:reviewCount" content="89"></div>
 <div property="schema:ratingValue" content="4.4"></div>
 </div>
 </div>
 </div>
 </body>
</html>
 
 

 
 

# Microdados

 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div>
 <div itemtype="https://schema.org/Product" itemscope>
 <meta itemprop="mpn" content="925872" />
 <meta itemprop="name" content="Executive Anvil" />
 <link itemprop="image" href="https://example.com/photos/16x9/photo.jpg" />
 <link itemprop="image" href="https://example.com/photos/4x3/photo.jpg" />
 <link itemprop="image" href="https://example.com/photos/1x1/photo.jpg" />
 <meta itemprop="description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height." />
 <div itemprop="offers" itemtype="https://schema.org/Offer" itemscope>
 <link itemprop="url" href="https://example.com/anvil" />
 <meta itemprop="availability" content="https://schema.org/InStock" />
 <meta itemprop="priceCurrency" content="USD" />
 <meta itemprop="itemCondition" content="https://schema.org/UsedCondition" />
 <meta itemprop="price" content="119.99" />
 <meta itemprop="priceValidUntil" content="2024-11-20" />
 </div>
 <div itemprop="aggregateRating" itemtype="https://schema.org/AggregateRating" itemscope>
 <meta itemprop="reviewCount" content="89" />
 <meta itemprop="ratingValue" content="4.4" />
 </div>
 <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
 <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Fred Benson" />
 </div>
 <div itemprop="reviewRating" itemtype="https://schema.org/Rating" itemscope>
 <meta itemprop="ratingValue" content="4" />
 <meta itemprop="bestRating" content="5" />
 </div>
 </div>
 <meta itemprop="sku" content="0446310786" />
 <div itemprop="brand" itemtype="https://schema.org/Brand" itemscope>
 <meta itemprop="name" content="ACME" />
 </div>
 </div>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div>
 <div itemtype="https://schema.org/Product" itemscope>
 <meta itemprop="name" content="Executive Anvil" />
 <meta itemprop="description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height." />
 <div itemprop="aggregateRating" itemtype="https://schema.org/AggregateRating" itemscope>
 <meta itemprop="reviewCount" content="89" />
 <meta itemprop="ratingValue" content="4.4" />
 </div>
 <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
 <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Fred Benson" />
 </div>
 <div itemprop="reviewRating" itemtype="https://schema.org/Rating" itemscope>
 <meta itemprop="ratingValue" content="4" />
 <meta itemprop="bestRating" content="5" />
 </div>
 </div>
 </div>
 </div>
 </body>
</html>
 
 

# Prós e contras

 Veja um exemplo de página de avaliação editorial de produtos com prós e contras para tratamento de snippets do produto
 nos resultados da pesquisa.

 
 
 
 

# JSON-LD

 <html>
 <head>
 <title>Cheese Knife Pro review</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "Product",
 "name": "Cheese Grater Pro",
 "review": {
 "@type": "Review",
 "name": "Cheese Knife Pro review",
 "author": {
 "@type": "Person",
 "name": "Pascal Van Cleeff"
 },
 "positiveNotes": {
 "@type": "ItemList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "Consistent results"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "Still sharp after many uses"
 }
 ]
 },
 "negativeNotes": {
 "@type": "ItemList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "No child protection"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "Lacking advanced features"
 }
 ]
 }
 }
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Cheese Knife Pro review</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "Product",
 "name": "Cheese Grater Pro",
 "review": {
 "@type": "Review",
 "name": "Cheese Knife Pro review",
 "author": {
 "@type": "Person",
 "name": "Pascal Van Cleeff"
 },
 "positiveNotes": {
 "@type": "ItemList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "Consistent results"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "Still sharp after many uses"
 }
 ]
 },
 "negativeNotes": {
 "@type": "ItemList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "No child protection"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "Lacking advanced features"
 }
 ]
 }
 }
 }
 </script>
 </head>
 <body>
 </body>
</html>
 
 

 
 

# RDFa

 <html>
 <head>
 <title>Cheese Knife Pro review</title>
 </head>
 <body>
 <div typeof="schema:Product">
 <div property="schema:name" content="Cheese Knife Pro review"></div>
 <div rel="schema:review">
 <div typeof="schema:Review">
 <div rel="schema:positiveNotes">
 <div typeof="schema:ItemList">
 <div rel="schema:itemListElement">
 <div typeof="schema:ListItem">
 <div property="schema:position" content="1"></div>
 <div property="schema:name" content="Consistent results"></div>
 </div>
 <div typeof="schema:ListItem">
 <div property="schema:position" content="2"></div>
 <div property="schema:name" content="Still sharp after many uses"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:negativeNotes">
 <div typeof="schema:ItemList">
 <div rel="schema:itemListElement">
 <div typeof="schema:ListItem">
 <div property="schema:position" content="1"></div>
 <div property="schema:name" content="No child protection"></div>
 </div>
 <div typeof="schema:ListItem">
 <div property="schema:position" content="2"></div>
 <div property="schema:name" content="Lacking advanced features"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:author">
 <div typeof="schema:Person">
 <div property="schema:name" content="Pascal Van Cleeff"></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Cheese Knife Pro review</title>
 </head>
 <body>
 <div typeof="schema:Product">
 <div property="schema:name" content="Cheese Knife Pro review"></div>
 <div rel="schema:review">
 <div typeof="schema:Review">
 <div rel="schema:positiveNotes">
 <div typeof="schema:ItemList">
 <div rel="schema:itemListElement">
 <div typeof="schema:ListItem">
 <div property="schema:position" content="1"></div>
 <div property="schema:name" content="Consistent results"></div>
 </div>
 <div typeof="schema:ListItem">
 <div property="schema:position" content="2"></div>
 <div property="schema:name" content="Still sharp after many uses"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:negativeNotes">
 <div typeof="schema:ItemList">
 <div rel="schema:itemListElement">
 <div typeof="schema:ListItem">
 <div property="schema:position" content="1"></div>
 <div property="schema:name" content="No child protection"></div>
 </div>
 <div typeof="schema:ListItem">
 <div property="schema:position" content="2"></div>
 <div property="schema:name" content="Lacking advanced features"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:author">
 <div typeof="schema:Person">
 <div property="schema:name" content="Pascal Van Cleeff"></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </body>
</html>
 
 

 
 

# Microdados

 <html>
 <head>
 <title>Cheese Knife Pro review</title>
 </head>
 <body>
 <div itemtype="https://schema.org/Product" itemscope>
 <meta itemprop="name" content="Cheese Knife Pro" />
 <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
 <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Pascal Van Cleeff" />
 </div>
 <div itemprop="positiveNotes" itemtype="https://schema.org/ItemList" itemscope>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="1" />
 <meta itemprop="name" content="Consistent results" />
 </div>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="2" />
 <meta itemprop="name" content="Still sharp after many uses" />
 </div>
 </div>
 <div itemprop="negativeNotes" itemtype="https://schema.org/ItemList" itemscope>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="1" />
 <meta itemprop="name" content="No child protection" />
 </div>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="2" />
 <meta itemprop="name" content="Lacking advanced features" />
 </div>
 </div>
 </div>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Cheese Knife Pro review</title>
 </head>
 <body>
 <div itemtype="https://schema.org/Product" itemscope>
 <meta itemprop="name" content="Cheese Knife Pro" />
 <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
 <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Pascal Van Cleeff" />
 </div>
 <div itemprop="positiveNotes" itemtype="https://schema.org/ItemList" itemscope>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="1" />
 <meta itemprop="name" content="Consistent results" />
 </div>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="2" />
 <meta itemprop="name" content="Still sharp after many uses" />
 </div>
 </div>
 <div itemprop="negativeNotes" itemtype="https://schema.org/ItemList" itemscope>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="1" />
 <meta itemprop="name" content="No child protection" />
 </div>
 <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
 <meta itemprop="position" content="2" />
 <meta itemprop="name" content="Lacking advanced features" />
 </div>
 </div>
 </div>
 </div>
 </body>
</html>
 
 

# Página agregadora de compras

 Veja um exemplo de página agregadora de compras para tratamento de snippets de produto nos resultados da pesquisa.

 
 
 

# JSON-LD

 <html>
 <head>
 <title>Executive Anvil</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "Product",
 "name": "Executive Anvil",
 "image": [
 "https://example.com/photos/1x1/photo.jpg",
 "https://example.com/photos/4x3/photo.jpg",
 "https://example.com/photos/16x9/photo.jpg"
 ],
 "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
 "sku": "0446310786",
 "mpn": "925872",
 "brand": {
 "@type": "Brand",
 "name": "ACME"
 },
 "review": {
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 4,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "Fred Benson"
 }
 },
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": 4.4,
 "reviewCount": 89
 },
 "offers": {
 "@type": "AggregateOffer",
 "offerCount": 5,
 "lowPrice": 119.99,
 "highPrice": 199.99,
 "priceCurrency": "USD"
 }
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Executive Anvil</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "Product",
 "name": "Executive Anvil",
 "image": [
 "https://example.com/photos/1x1/photo.jpg",
 "https://example.com/photos/4x3/photo.jpg",
 "https://example.com/photos/16x9/photo.jpg"
 ],
 "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
 "sku": "0446310786",
 "mpn": "925872",
 "brand": {
 "@type": "Brand",
 "name": "ACME"
 },
 "review": {
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 4,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "Fred Benson"
 }
 },
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": 4.4,
 "reviewCount": 89
 },
 "offers": {
 "@type": "AggregateOffer",
 "offerCount": 5,
 "lowPrice": 119.99,
 "highPrice": 199.99,
 "priceCurrency": "USD"
 }
 }
 </script>
 </head>
 <body>
 </body>
</html>
 
 

 
 

# RDFa

 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div typeof="schema:Product">
 <div rel="schema:review">
 <div typeof="schema:Review">
 <div rel="schema:reviewRating">
 <div typeof="schema:Rating">
 <div property="schema:ratingValue" content="4"></div>
 <div property="schema:bestRating" content="5"></div>
 </div>
 </div>
 <div rel="schema:author">
 <div typeof="schema:Person">
 <div property="schema:name" content="Fred Benson"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:aggregateRating">
 <div typeof="schema:AggregateRating">
 <div property="schema:reviewCount" content="89"></div>
 <div property="schema:ratingValue" content="4.4"></div>
 </div>
 </div>
 <div rel="schema:image" resource="https://example.com/photos/4x3/photo.jpg"></div>
 <div property="schema:mpn" content="925872"></div>
 <div property="schema:name" content="Executive Anvil"></div>
 <div property="schema:description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."></div>
 <div rel="schema:image" resource="https://example.com/photos/1x1/photo.jpg">
 </div>
 <div rel="schema:brand">
 <div typeof="schema:Brand">
 <div property="schema:name" content="ACME"></div>
 </div>
 </div>
 <div rel="schema:offers">
 <div typeof="schema:AggregateOffer">
 <div property="schema:offerCount" content="5"></div>
 <div property="schema:lowPrice" content="119.99"></div>
 <div property="schema:highPrice" content="199.99"></div>
 <div property="schema:priceCurrency" content="USD"></div>
 <div rel="schema:url" resource="https://example.com/anvil"></div>
 </div>
 </div>
 <div rel="schema:image" resource="https://example.com/photos/16x9/photo.jpg"></div>
 <div property="schema:sku" content="0446310786"></div>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div typeof="schema:Product">
 <div rel="schema:review">
 <div typeof="schema:Review">
 <div rel="schema:reviewRating">
 <div typeof="schema:Rating">
 <div property="schema:ratingValue" content="4"></div>
 <div property="schema:bestRating" content="5"></div>
 </div>
 </div>
 <div rel="schema:author">
 <div typeof="schema:Person">
 <div property="schema:name" content="Fred Benson"></div>
 </div>
 </div>
 </div>
 </div>
 <div rel="schema:aggregateRating">
 <div typeof="schema:AggregateRating">
 <div property="schema:reviewCount" content="89"></div>
 <div property="schema:ratingValue" content="4.4"></div>
 </div>
 </div>
 <div rel="schema:image" resource="https://example.com/photos/4x3/photo.jpg"></div>
 <div property="schema:mpn" content="925872"></div>
 <div property="schema:name" content="Executive Anvil"></div>
 <div property="schema:description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."></div>
 <div rel="schema:image" resource="https://example.com/photos/1x1/photo.jpg">
 </div>
 <div rel="schema:brand">
 <div typeof="schema:Brand">
 <div property="schema:name" content="ACME"></div>
 </div>
 </div>
 <div rel="schema:offers">
 <div typeof="schema:AggregateOffer">
 <div property="schema:offerCount" content="5"></div>
 <div property="schema:lowPrice" content="119.99"></div>
 <div property="schema:highPrice" content="199.99"></div>
 <div property="schema:priceCurrency" content="USD"></div>
 <div rel="schema:url" resource="https://example.com/anvil"></div>
 </div>
 </div>
 <div rel="schema:image" resource="https://example.com/photos/16x9/photo.jpg"></div>
 <div property="schema:sku" content="0446310786"></div>
 </div>
 </body>
</html>
 
 

 
 

# Microdados

 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div>
 <div itemtype="https://schema.org/Product" itemscope>
 <meta itemprop="mpn" content="925872" />
 <meta itemprop="name" content="Executive Anvil" />
 <link itemprop="image" href="https://example.com/photos/16x9/photo.jpg" />
 <link itemprop="image" href="https://example.com/photos/4x3/photo.jpg" />
 <link itemprop="image" href="https://example.com/photos/1x1/photo.jpg" />
 <meta itemprop="description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height." />
 <div itemprop="offers" itemtype="https://schema.org/AggregateOffer" itemscope>
 <meta itemprop="lowPrice" content="119.99" />
 <meta itemprop="highPrice" content="199.99" />
 <meta itemprop="offerCount" content="6" />
 <meta itemprop="priceCurrency" content="USD" />
 </div>
 <div itemprop="aggregateRating" itemtype="https://schema.org/AggregateRating" itemscope>
 <meta itemprop="reviewCount" content="89" />
 <meta itemprop="ratingValue" content="4.4" />
 </div>
 <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
 <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Fred Benson" />
 </div>
 <div itemprop="reviewRating" itemtype="https://schema.org/Rating" itemscope>
 <meta itemprop="ratingValue" content="4" />
 <meta itemprop="bestRating" content="5" />
 </div>
 </div>
 <meta itemprop="sku" content="0446310786" />
 <div itemprop="brand" itemtype="https://schema.org/Brand" itemscope>
 <meta itemprop="name" content="ACME" />
 </div>
 </div>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Executive Anvil</title>
 </head>
 <body>
 <div>
 <div itemtype="https://schema.org/Product" itemscope>
 <meta itemprop="mpn" content="925872" />
 <meta itemprop="name" content="Executive Anvil" />
 <link itemprop="image" href="https://example.com/photos/16x9/photo.jpg" />
 <link itemprop="image" href="https://example.com/photos/4x3/photo.jpg" />
 <link itemprop="image" href="https://example.com/photos/1x1/photo.jpg" />
 <meta itemprop="description" content="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height." />
 <div itemprop="offers" itemtype="https://schema.org/AggregateOffer" itemscope>
 <meta itemprop="lowPrice" content="119.99" />
 <meta itemprop="highPrice" content="199.99" />
 <meta itemprop="offerCount" content="6" />
 <meta itemprop="priceCurrency" content="USD" />
 </div>
 <div itemprop="aggregateRating" itemtype="https://schema.org/AggregateRating" itemscope>
 <meta itemprop="reviewCount" content="89" />
 <meta itemprop="ratingValue" content="4.4" />
 </div>
 <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
 <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Fred Benson" />
 </div>
 <div itemprop="reviewRating" itemtype="https://schema.org/Rating" itemscope>
 <meta itemprop="ratingValue" content="4" />
 <meta itemprop="bestRating" content="5" />
 </div>
 </div>
 <meta itemprop="sku" content="0446310786" />
 <div itemprop="brand" itemtype="https://schema.org/Brand" itemscope>
 <meta itemprop="name" content="ACME" />
 </div>
 </div>
 </div>
 </body>
</html>
 
 

# Diretrizes

 Para que a marcação Product se qualifique para snippets de produtos, siga estas diretrizes:

 
 
- Diretrizes gerais de dados estruturados 
 
- Fundamentos da Pesquisa 
 
- Diretrizes técnicas 
 
- Diretrizes de conteúdo 

# Diretrizes técnicas

 
 
- No momento, a pesquisa aprimorada de produtos
 é compatível apenas com páginas que se concentram em um único produto (ou várias variantes dele). Por exemplo, "sapatos da nossa loja" não é um produto específico.
 Isso inclui variantes do produto em que cada uma tem um URL diferente .
 Recomendamos que você priorize adicionar marcações às páginas de produtos em vez de páginas que os listem ou listem uma categoria deles.
 
 
- Para ver detalhes sobre como fazer a marcação de variantes do produto, consulte a documentação de dados estruturados das variantes do produto . 
 
- Ao oferecer produtos à venda em várias moedas, tenha um URL distinto para cada uma.
 Por exemplo, se um produto estiver disponível para venda em dólares canadenses e dos EUA, use dois
 URLs distintos, um para cada moeda.
 
 
- Car 
 não é automaticamente compatível como subtipo de Product . Por enquanto, inclua
 os tipos Car e
 Product , caso queira
 anexar classificações a ele e se qualificar para o recurso de pesquisa. Por exemplo, em JSON-LD:
 
 { 
 "@context" : "https://schema.org" , 
 "@type" : [ "Product" , "Car" ], 
 ... 
 } 
 
 
 
- Para dados estruturados de prós e contras :
 somente páginas com avaliações editoriais de produtos estão qualificadas para mostrar os prós e contras na
 Pesquisa, e não as páginas de produtos do comerciante ou avaliações de produtos dos clientes. 
 
- Se você é um comerciante que otimiza para todos os tipos de resultados do Shopping, recomendamos colocar
 dados estruturados de Product no HTML inicial para ter os melhores resultados. 
 
- Para marcação Product gerada por JavaScript : as marcações geradas dinamicamente 
 podem diminuir a quantidade e a qualidade dos rastreamentos do Shopping. Isso pode ser um problema
 em conteúdos que mudam rapidamente, como disponibilidade e preço do produto. Se você usa JavaScript para
 gerar marcação Product , verifique se o servidor tem recursos de computação suficientes para
 lidar com o aumento de tráfego do Google. 

# Diretrizes de conteúdo

 
 
- Não é permitido conteúdo que promova produtos amplamente regulamentados ou proibidos, nem informações que possam causar danos graves, imediatos ou de longo prazo às pessoas. Isso inclui conteúdo relacionado a armas de fogo ou de outros tipos, drogas recreativas, tabaco e cigarro eletrônico, além de produtos relacionados a jogos de azar. 

# Definições de tipos de dados estruturados

 É necessário incluir as propriedades obrigatórias para que seu conteúdo seja qualificado para exibição na pesquisa aprimorada. Também é possível incluir as propriedades recomendadas para adicionar mais informações aos seus dados estruturados, o que pode proporcionar uma melhor experiência do usuário.

# Product 

 A definição completa de Product está disponível em
 schema.org/Product (todos os links de schema.org estão em inglês). Ao fazer a marcação
 do seu conteúdo de informações do produto, use as seguintes propriedades do
 tipo Product :

 
 
 
 Propriedades obrigatórias 

 
 
 
 name 
 
 Text 

 É o nome do produto.

 
 

 
 Os snippets de produto precisam de review , aggregateRating ou offers 
 
 Inclua uma das seguintes propriedades:

 
 
- review 
 
- aggregateRating 
 
- offers 

 Você só precisa fornecer review ,
 aggregateRating e offers , mas a seção de snippets
 de produto do teste de pesquisa aprimorada pode relatar um aviso se você fornecer
 offers sem as propriedades review ou
 aggregateRating .
 
 

 

 
 
 
 Propriedades recomendadas 

 
 
 
 aggregateRating 
 
 AggregateRating 

 É o aggregateRating aninhado do produto. Siga as
 diretrizes de
 snippets de avaliação e a lista de propriedades
 AggregateRating 
 obrigatórias e recomendadas.

 
 

 
 offers 
 
 Offer ou AggregateOffer 

 É um Offer ou
 AggregateOffer aninhado para vender o produto. Inclua as propriedades obrigatórias e
 recomendadas para Offer 
 ou AggregateOffer , o que for relevante
 para o conteúdo em questão.

 
 Para se qualificar para o aprimoramento de redução no preço , use o atributo Offer ,
 e não AggregateOffer .
 

 
 

 
 review 
 
 Review 

 É o Review aninhado do produto. Siga as
 diretrizes de snippet de
 avaliação e a lista de
 propriedades
 de avaliação obrigatórias e recomendadas.

 Se você adicionar uma avaliação do produto, o nome do avaliador precisará ser válido para Person 
 ou Team .
 

 Não recomendado : "50% de desconto na Black Friday"

 Recomendado : "João da Silva" ou "Avaliadores do CNET"

 Para informar manualmente o Google sobre os prós e contras de uma página de avaliação editorial de produtos, adicione as propriedades positiveNotes e/ou negativeNotes à avaliação aninhada.

 
 

 

# Avaliações de produtos

# Review 

 
 Como as avaliações são compartilhadas por vários tipos de dados estruturados (como
 Recipe e
 Movie ), o
 tipo Review é descrito separadamente na
 documentação de snippet de avaliação .

 
 As propriedades a seguir são outras propriedades do tipo avaliação para ajudar as pessoas
 a ver um resumo detalhado dos prós e contras de uma avaliação editorial de produtos.
 A experiência dos prós e contras está disponível em alemão, espanhol, francês,
 holandês, inglês, italiano, japonês, polonês, português e turco em todos os países
 em que é possível acessar a Pesquisa Google.

 
 Embora o Google tente entender os prós e contras de uma avaliação editorial de produtos automaticamente, é possível enviar essas informações explicitamente adicionando as propriedades
 positiveNotes e/ou negativeNotes à sua avaliação de produto aninhada. Siga as diretrizes de prós e contras .

 
 
 Propriedades obrigatórias 
 
 
 
 Duas declarações sobre o produto 
 Forneça pelo menos duas declarações sobre o produto em qualquer combinação de
 declarações positivas ou negativas (por exemplo, a marcação ItemList com duas
 declarações positivas é válida):
 
- negativeNotes 
 
- positiveNotes 
 

 
 

 

 
 
 Propriedades recomendadas 
 
 
 
 negativeNotes 
 
 ItemList 
 (consulte ItemList para ver observações positivas e negativas 
 sobre o uso de ItemList neste contexto)
 

 
 Uma lista aninhada opcional de declarações negativas sobre o produto (contras).
 

 
 Para listar várias declarações negativas, especifique várias propriedades ListItem 
 em uma matriz itemListElement . Exemplo:
 

 
 "review" : { 
 "@type" : "Review" , 
 "negativeNotes" : { 
 "@type" : "ItemList" , 
 "itemListElement" : [ 
 { 
 "@type" : "ListItem" , 
 "position" : 1 , 
 "name" : "No child protection" 
 }, 
 { 
 "@type" : "ListItem" , 
 "position" : 2 , 
 "name" : "Lacking advanced features" 
 } 
 ] 
 } 
 } 
 
 
 

 
 positiveNotes 
 
 ItemList 
 (consulte ItemList para ver observações positivas e negativas 
 sobre o uso de ItemList neste contexto)
 

 
 Uma lista aninhada opcional de declarações positivas sobre o produto (prós).
 

 
 Para listar várias declarações positivas, especifique várias propriedades ListItem 
 em uma matriz itemListElement . Exemplo:
 

 
 "review" : { 
 "@type" : "Review" , 
 "positiveNotes" : { 
 "@type" : "ItemList" , 
 "itemListElement" : [ 
 { 
 "@type" : "ListItem" , 
 "position" : 1 , 
 "name" : "Consistent results" 
 }, 
 { 
 "@type" : "ListItem" , 
 "position" : 2 , 
 "name" : "Still sharp after many uses" 
 } 
 ] 
 } 
 } 
 
 
 

 

# ItemList para observações positivas e negativas

 
 As observações positivas e negativas (vantagens e desvantagens) dentro do tipo Review usam
 os tipos genéricos ItemList e ListItem .
 Nesta seção, descrevemos como usar esses tipos para observações positivas e negativas.

 
 Veja a seguir as propriedades usadas para identificar os prós e contras em uma avaliação.

 
 
 Propriedades obrigatórias 
 
 
 
 itemListElement 
 
 ListItem 

 
 São declarações sobre o produto, listadas em uma ordem específica.
 Especifique cada instrução com um ListItem .
 

 
 

 
 itemListElement.name 
 
 Text 

 
 É a principal declaração da avaliação.
 

 
 

 

 
 
 Propriedades recomendadas 
 
 
 
 itemListElement.position 
 
 Integer 

 
 É a posição da avaliação. A posição 1 significa a primeira declaração da lista.
 

 
 

 

# Detalhes da oferta

# Offer 

 A definição completa de Offer está disponível em
 schema.org/Offer . Ao fazer a marcação de ofertas em um produto, use as seguintes propriedades do tipo
 Offer schema.org .

 
 
 Propriedades obrigatórias 
 
 
 
 price ou priceSpecification.price 
 
 Number 

 É o preço da oferta de um produto. Siga as
 diretrizes de uso do schema.org .

 
 Veja um exemplo da propriedade price (o valor pode ser um número ou
 uma string JSON):
 

 
 "offers" : { 
 "@type" : "Offer" , 
 "price" : 39.99 , 
 "priceCurrency" : "USD" 
 } 
 
 
 Veja um exemplo de como especificar que um produto está disponível sem pagamento:
 

 
 "offers" : { 
 "@type" : "Offer" , 
 "price" : 0 , 
 "priceCurrency" : "EUR" 
 } 
 
 
 Como alternativa, o preço da oferta pode ser aninhado em uma propriedade priceSpecification ,
 em vez de ser fornecido no nível da Offer .
 

 
 "offers" : { 
 "@type" : "Offer" , 
 "priceSpecification" : { 
 "@type" : "PriceSpecification" , 
 "price" : 9.99 , 
 "priceCurrency" : "AUD" 
 } 
 } 
 
 
 
 If you use both the offers.price and offers.priceSpecification 
 properties to encode an active price, Google will use the price provided through
 the offers.price property and ignore the offers.priceSpecification 
 property.
 

 Se você tiver preços complexos, confira os exemplos de preços e
 as propriedades de precificação compatíveis na documentação das informações de produtos do comerciante.
 

 
 

 

 
 
 Propriedades recomendadas 
 
 
 
 availability 
 
 ItemAvailability 

 Use a opção de disponibilidade de produto mais adequada da lista a seguir.

 
 
- https://schema.org/BackOrder : o item está em espera. 
 
- https://schema.org/Discontinued : o item foi descontinuado. 
 
- https://schema.org/InStock : o item está em estoque. 
 
- https://schema.org/InStoreOnly : o item só está disponível para compra na loja. 
 
- https://schema.org/LimitedAvailability : o item tem disponibilidade limitada. 
 
- https://schema.org/OnlineOnly : o item está disponível apenas on-line. 
 
- https://schema.org/OutOfStock : o item está esgotado no momento. 
 
- https://schema.org/PreOrder : o item está disponível para compra na pré-venda. 
 
- https://schema.org/PreSale : o item está disponível para pedidos e entregas antes da disponibilidade geral. 
 
- https://schema.org/SoldOut : o item está esgotado. 
 

 Os nomes curtos sem o prefixo de URL também são compatíveis (por exemplo, BackOrder ).

 
 

 
 priceCurrency ou priceSpecification.priceCurrency 
 
 Text 

 É a moeda usada para descrever o preço do produto, no formato
 ISO 4217 de três letras.

 No momento, essa propriedade é recomendada para que os snippets de produto ajudem o Google
 a determinar a moeda com mais precisão, mas são necessários para experiências de informações do comerciante.
 Portanto, é melhor sempre fornecer essa propriedade.

 
 

 
 priceValidUntil 
 
 Date 

 É a data final (no formato ISO 8601 ) de disponibilidade do preço, se aplicável. É possível que o snippet de produto
 não seja exibido caso a propriedade priceValidUntil indique uma data passada.

 
 

 

# UnitPriceSpecification 

 
 A definição completa de
 UnitPriceSpecification está disponível em
 schema.org/UnitPriceSpecification .
 Use as propriedades a seguir para capturar esquemas de preços mais complexos.

 
 
 Propriedades obrigatórias 
 
 
 
 price 
 
 Number 

 
 É o preço da oferta de um produto. Consulte também a propriedade price de Offer .
 

 
 

 

 
 
 Propriedades recomendadas 
 
 
 
 priceCurrency 
 
 Text 

 É a moeda usada para descrever o preço do produto, no formato
 ISO 4217 de três letras.
 Consulte também a propriedade priceCurrency de Offer .

 Embora essa propriedade seja opcional para snippets de produto, ela é altamente recomendada porque evita ambiguidades de preços e é obrigatória para experiências com produto do comerciante.

 
 

 

# AggregateOffer 

 
 A definição completa de
 AggregateOffer está disponível em
 schema.org/AggregateOffer .
 Uma AggregateOffer é um tipo de Offer que representa uma agregação de outras ofertas. Por exemplo, ele pode ser usado para um produto vendido por vários comerciantes.
 Não use AggregateOffer para descrever um conjunto de variantes do produto.
 Ao fazer a marcação de ofertas agregadas em um produto, use as seguintes propriedades do tipo schema.org 
 AggregateOffer :

 
 
 Propriedades obrigatórias 
 
 
 
 lowPrice 
 
 Number 

 
 É o preço mais baixo de todas as ofertas disponíveis. Use um separador decimal ( . ) ao expressar frações de uma unidade monetária, como 1,23 para US$ 1,23.
 

 
 

 
 priceCurrency 
 
 Text 

 É a moeda usada para descrever o preço do produto, no formato
 ISO 4217 de três letras.

 
 

 

 
 
 Propriedades recomendadas 
 
 
 
 highPrice 
 
 Number 

 É o preço mais alto de todas as ofertas disponíveis. Use um número com ponto flutuante, se necessário.

 
 

 
 offerCount 
 
 Number 

 É o número de ofertas para o produto.

 
 

 

 

# Monitorar pesquisas aprimoradas com o Search Console

 
 O Search Console é uma ferramenta que ajuda você a monitorar o desempenho das suas páginas na Pesquisa Google.
 Não é preciso se inscrever na plataforma para ser incluído nos resultados da Pesquisa Google,
 mas isso pode ajudar você a entender e melhorar como vemos seu site. Recomendamos
 verificar o Search Console nos seguintes casos:
 
 
 
- Depois de implantar os dados estruturados pela primeira vez 
 
- Depois de lançar novos modelos ou atualizar o código 
 
- Análise periódica do tráfego 
 

 
 
 

 

# 
 Depois de implantar os dados estruturados pela primeira vez
 

 
 Depois que o Google indexar as páginas, procure problemas com o
 relatório de status da pesquisa aprimorada relevante.
 Em condições ideais, vai haver um aumento de itens válidos e nenhum aumento de itens inválidos. Se você encontrar problemas
 nos dados estruturados, faça o seguinte:

 
 
- Corrija os itens inválidos . 
 
- Inspecione um URL ativo para verificar se o problema persiste. 
 
- Solicite a validação com o relatório de status. 
 

 

# 
 Depois de lançar novos modelos ou atualizar o código
 

 Ao fazer mudanças significativas no site, monitore aumentos nos itens inválidos de dados estruturados.
 
 
- Caso você perceba um aumento nos itens inválidos , talvez tenha lançado um novo modelo que não funcione ou o site esteja interagindo com o modelo
 existente de uma maneira nova e incorreta. 
 
- Caso você veja uma diminuição nos itens válidos (não correspondidos por um aumento nos itens inválidos), talvez não esteja
 mais incorporando os dados estruturados às páginas. Use a 
 Ferramenta de inspeção de URL para saber o que está causando o problema. 
 

 

# 
 Análise periódica do tráfego
 

 Analise o tráfego da Pesquisa Google com o Relatório de desempenho .
 Os dados vão mostrar com que frequência sua página aparece como aprimorada na Pesquisa, com que frequência os usuários clicam nela e qual é
 a posição média dela nos resultados. Também é possível extrair automaticamente esses
 resultados com a API Search Console .

 

 
 
 Há dois relatórios do Search Console relacionados aos dados estruturados de Product :
 

 
 
- Relatório de informações de produtos do comerciante :
 para páginas em que os compradores podem comprar produtos. 
 
- Relatório de snippets de produto :
 para outras páginas relacionadas a produtos, como avaliações de produtos e sites agregadores. 
 

 
 Os dois relatórios fornecem avisos e erros relacionados aos dados estruturados de Product , mas são separados
 devido aos diferentes requisitos das experiências associadas. Por exemplo, o
 Relatório de informações do produto do comerciante 
 inclui verificações de snippets de produto que incluem
 dados estruturados de Offer , para que o relatório Snippets do produto 
 só precise ser consultado para páginas que não sejam de informações do produto do comerciante.
 

 
 

 
 

# Solução de problemas

 
 Se você tiver problemas para implementar ou depurar dados estruturados, veja alguns recursos que
 podem ajudar.
 

 
 
- Se você usa um sistema de gerenciamento de conteúdo (CMS) ou se alguém está cuidando do seu site,
 peça ajuda para o prestador de serviço. Não se esqueça de encaminhar todas as mensagens do Search Console com os detalhes do problema. 
 
- O Google não garante que os recursos que consomem dados estruturados vão ser exibidos nos resultados da pesquisa.
 Para ver uma lista de motivos comuns por que o Google pode não exibir seu conteúdo na pesquisa aprimorada, consulte as
 diretrizes gerais de dados estruturados . 
 
- Pode haver um erro nos dados estruturados. Confira a
 lista de erros de dados estruturados 
 e o Relatório de dados estruturados que não podem ser analisados . 
 
- Se você recebeu uma ação manual de dados estruturados relacionada à sua página, esses dados
 serão ignorados, embora a página ainda possa aparecer nos resultados da Pesquisa Google. Para corrigir
 problemas de dados estruturados , use o Relatório de ações manuais .
 
 
- Consulte as diretrizes novamente para identificar se o conteúdo não está em conformidade
 com elas. O problema pode ser causado por conteúdo com spam ou uso de marcação com spam.
 No entanto, talvez o problema não seja de sintaxe e, por isso, o teste de pesquisa aprimorada não poderá
 identificá-lo.
 
 
- Resolva problemas relacionados à ausência e à queda no total de pesquisas aprimoradas . 
 
- Aguarde algum tempo antes de voltar a rastrear e reindexar. Pode levar vários dias depois da publicação de uma página para que o Google a localize e rastreie. Para perguntas gerais sobre rastreamento e indexação, consulte as Perguntas frequentes sobre rastreamento e indexação da Pesquisa Google .
 
 
- Poste uma pergunta no fórum da Central da Pesquisa Google 
 

 
 

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Envie comentários
