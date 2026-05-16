---
url: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
title: "Dados estruturados de navegação estrutural ( BreadcrumbList )"
fetched_at: 2026-05-16T16:53:00.794Z
seed: false
---

# Dados estruturados de navegação estrutural ( BreadcrumbList )

Source: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

- 
 
 
 
 
 
 
 
 Página inicial
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envie comentários
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Dados estruturados de navegação estrutural ( BreadcrumbList )

 
 
 A trilha da navegação estrutural de uma página indica a posição dela na hierarquia do site e pode
 ajudar os usuários a entender e analisar o conteúdo on-line de maneira eficaz. O usuário pode percorrer todo o caminho na hierarquia, um nível por
 vez, a partir da última navegação na trilha atual.

# Disponibilidade do recurso

 Esse recurso está disponível em computadores em todas as regiões e idiomas em que a Pesquisa Google está disponível.

 
 

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

 A Pesquisa Google usa a marcação de navegação estrutural no corpo de uma página da Web para categorizar
as informações da página nos resultados da pesquisa. Geralmente, conforme ilustrado nos
casos de uso a seguir, os usuários podem chegar a uma página a partir de tipos muito diferentes de
consultas de pesquisa. Embora cada pesquisa possa retornar a mesma página da Web, a navegação estrutural
categoriza o conteúdo dentro do contexto da consulta da Pesquisa Google. A página
dos vencedores de um prêmio de livro fictício pode usar as seguintes trilhas de navegação estrutural:

# Trilha de navegação estrutural única

 Se houver apenas uma trilha de navegação estrutural que leve à página, ela poderá especificar a
 seguinte trilha de navegação estrutural:

 Livros › 
 Ficção científica › 
 Vencedores de prêmios

 
 
 

# JSON-LD

 Veja um exemplo em JSON-LD compatível com essa navegação estrutural:

 <html>
 <head>
 <title>Award Winners</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [{
 "@type": "ListItem",
 "position": 1,
 "name": "Books",
 "item": "https://example.com/books"
 },{
 "@type": "ListItem",
 "position": 2,
 "name": "Science Fiction",
 "item": "https://example.com/books/sciencefiction"
 },{
 "@type": "ListItem",
 "position": 3,
 "name": "Award Winners"
 }]
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Award Winners</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [{
 "@type": "ListItem",
 "position": 1,
 "name": "Books",
 "item": "https://example.com/books"
 },{
 "@type": "ListItem",
 "position": 2,
 "name": "Science Fiction",
 "item": "https://example.com/books/sciencefiction"
 },{
 "@type": "ListItem",
 "position": 3,
 "name": "Award Winners"
 }]
 }
 </script>
 </head>
 <body>
 </body>
</html>
 
 

 
 

# RDFa

 Veja um exemplo de RDFa compatível com essa navegação estrutural:

 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol vocab="https://schema.org/" typeof="BreadcrumbList">
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books">
 <span property="name">Books</span></a>
 <meta property="position" content="1">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books/sciencefiction">
 <span property="name">Science Fiction</span></a>
 <meta property="position" content="2">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <span property="name">Award Winners</span>
 <meta property="position" content="3">
 </li>
 </ol>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol vocab="https://schema.org/" typeof="BreadcrumbList">
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books">
 <span property="name">Books</span></a>
 <meta property="position" content="1">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books/sciencefiction">
 <span property="name">Science Fiction</span></a>
 <meta property="position" content="2">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <span property="name">Award Winners</span>
 <meta property="position" content="3">
 </li>
 </ol>
 </body>
</html>
 
 

 
 

# Microdados

 Veja um exemplo em microdados compatível com essa navegação estrutural:

 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/books">
 <span itemprop="name">Books</span></a>
 <meta itemprop="position" content="1" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemscope itemtype="https://schema.org/WebPage"
 itemprop="item" itemid="https://example.com/books/sciencefiction"
 href="https://example.com/books/sciencefiction">
 <span itemprop="name">Science Fiction</span></a>
 <meta itemprop="position" content="2" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <span itemprop="name">Award winners</span>
 <meta itemprop="position" content="3" />
 </li>
 </ol>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/books">
 <span itemprop="name">Books</span></a>
 <meta itemprop="position" content="1" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemscope itemtype="https://schema.org/WebPage"
 itemprop="item" itemid="https://example.com/books/sciencefiction"
 href="https://example.com/books/sciencefiction">
 <span itemprop="name">Science Fiction</span></a>
 <meta itemprop="position" content="2" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <span itemprop="name">Award winners</span>
 <meta itemprop="position" content="3" />
 </li>
 </ol>
 </body>
</html>
 
 

 
 

# 
 HTML
 

 Veja um exemplo de um bloco de navegação estrutural em HTML na página como parte do design visual.

 
 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol>
 <li>
 <a href="https://www.example.com/books">Books</a>
 </li>
 <li>
 <a href="https://www.example.com/sciencefiction">Science Fiction</a>
 </li>
 <li>
 Award Winners
 </li>
 </ol>
 </body>
</html>
 
 

# Trilha de navegação estrutural múltipla

 Se houver várias maneiras de navegar até uma página no site, especifique várias trilhas de navegação estrutural
 para uma única página. Veja um exemplo que leva a uma página
 de livros premiados:

 Livros › 
 Ficção científica › 
 Vencedores de prêmios

 
 Veja outra trilha de navegação estrutural que leva à mesma página:

 
 Literatura › 
 Vencedores de prêmios

 
 
 

# JSON-LD

 Veja um exemplo de JSON-LD compatível com várias trilhas de navegação estrutural:

 <html>
 <head>
 <title>Award Winners</title>
 <script type="application/ld+json">
 [{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [{
 "@type": "ListItem",
 "position": 1,
 "name": "Books",
 "item": "https://example.com/books"
 },{
 "@type": "ListItem",
 "position": 2,
 "name": "Science Fiction",
 "item": "https://example.com/books/sciencefiction"
 },{
 "@type": "ListItem",
 "position": 3,
 "name": "Award Winners"
 }]
 },
 {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [{
 "@type": "ListItem",
 "position": 1,
 "name": "Literature",
 "item": "https://example.com/literature"
 },{
 "@type": "ListItem",
 "position": 2,
 "name": "Award Winners"
 }]
 }]
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Award Winners</title>
 <script type="application/ld+json">
 [{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [{
 "@type": "ListItem",
 "position": 1,
 "name": "Books",
 "item": "https://example.com/books"
 },{
 "@type": "ListItem",
 "position": 2,
 "name": "Science Fiction",
 "item": "https://example.com/books/sciencefiction"
 },{
 "@type": "ListItem",
 "position": 3,
 "name": "Award Winners"
 }]
 },
 {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [{
 "@type": "ListItem",
 "position": 1,
 "name": "Literature",
 "item": "https://example.com/literature"
 },{
 "@type": "ListItem",
 "position": 2,
 "name": "Award Winners"
 }]
 }]
 </script>
 </head>
 <body>
 </body>
</html>
 
 

 
 

# RDFa

 Veja um exemplo de RDFa compatível com várias trilhas de navegação estrutural:

 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol vocab="https://schema.org/" typeof="BreadcrumbList">
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books">
 <span property="name">Books</span></a>
 <meta property="position" content="1">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books/sciencefiction">
 <span property="name">Science Fiction</span></a>
 <meta property="position" content="2">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books/sciencefiction/awardwinners">
 <span property="name">Award Winners</span></a>
 <meta property="position" content="3">
 </li>
 </ol>
 <ol vocab="https://schema.org/" typeof="BreadcrumbList">
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/literature">
 <span property="name">Literature</span></a>
 <meta property="position" content="1">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <span property="name">Award Winners</span>
 <meta property="position" content="2">
 </li>
 </ol>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol vocab="https://schema.org/" typeof="BreadcrumbList">
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books">
 <span property="name">Books</span></a>
 <meta property="position" content="1">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books/sciencefiction">
 <span property="name">Science Fiction</span></a>
 <meta property="position" content="2">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/books/sciencefiction/awardwinners">
 <span property="name">Award Winners</span></a>
 <meta property="position" content="3">
 </li>
 </ol>
 <ol vocab="https://schema.org/" typeof="BreadcrumbList">
 <li property="itemListElement" typeof="ListItem">
 <a property="item" typeof="WebPage"
 href="https://example.com/literature">
 <span property="name">Literature</span></a>
 <meta property="position" content="1">
 </li>
 ›
 <li property="itemListElement" typeof="ListItem">
 <span property="name">Award Winners</span>
 <meta property="position" content="2">
 </li>
 </ol>
 </body>
</html>
 
 

 
 

# Microdados

 Veja um exemplo de microdados compatíveis com trilhas de navegação estrutural múltiplas:

 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/books">
 <span itemprop="name">Books</span></a>
 <meta itemprop="position" content="1" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemscope itemtype="https://schema.org/WebPage"
 itemprop="item" itemid="https://example.com/books/sciencefiction"
 href="https://example.com/books/sciencefiction">
 <span itemprop="name">Science Fiction</span></a>
 <meta itemprop="position" content="2" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/books/sciencefiction/awardwinners">
 <span itemprop="name">Award Winners</span></a>
 <meta itemprop="position" content="3" />
 </li>
 </ol>
 <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/literature">
 <span itemprop="name">Literature</span></a>
 <meta itemprop="position" content="1" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <span itemprop="name">Award Winners</span>
 <meta itemprop="position" content="2" />
 </li>
 </ol>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/books">
 <span itemprop="name">Books</span></a>
 <meta itemprop="position" content="1" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemscope itemtype="https://schema.org/WebPage"
 itemprop="item" itemid="https://example.com/books/sciencefiction"
 href="https://example.com/books/sciencefiction">
 <span itemprop="name">Science Fiction</span></a>
 <meta itemprop="position" content="2" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/books/sciencefiction/awardwinners">
 <span itemprop="name">Award Winners</span></a>
 <meta itemprop="position" content="3" />
 </li>
 </ol>
 <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <a itemprop="item" href="https://example.com/literature">
 <span itemprop="name">Literature</span></a>
 <meta itemprop="position" content="1" />
 </li>
 ›
 <li itemprop="itemListElement" itemscope
 itemtype="https://schema.org/ListItem">
 <span itemprop="name">Award Winners</span>
 <meta itemprop="position" content="2" />
 </li>
 </ol>
 </body>
</html>
 
 

 
 

# 
 HTML
 

 Veja um exemplo de um bloco de navegação estrutural em HTML na página como parte do design visual.

 
 <html>
 <head>
 <title>Award Winners</title>
 </head>
 <body>
 <ol>
 <li>
 <a href="https://www.example.com/books">Books</a>
 </li>
 <li>
 <a href="https://www.example.com/books/sciencefiction">Science Fiction</a>
 </li>
 <li>
 Award Winners
 </li>
 </ol>
 <ol>
 <li>
 <a href="https://www.example.com/literature">Literature</a>
 </li>
 <li>
 Award Winners
 </li>
 </ol>
 </body>
</html>
 
 

# Diretrizes

 
 Siga estas diretrizes e qualifique seu conteúdo para exibição com as navegações estruturais na Pesquisa Google.

 
 Aviso : se o Google detectar que algumas das marcações das páginas 
 usam técnicas não incluídas nas nossas diretrizes de dados estruturados, o site talvez receba uma
 ação manual .

 
 
- 
 Fundamentos da Pesquisa 
 
 
- 
 Diretrizes gerais de dados estruturados 
 

 
 Recomendamos oferecer navegação estrutural que represente um caminho típico do usuário até uma página em vez de
 simplesmente espelhar a estrutura do URL. Não é necessário incluir uma navegação estrutural ListItem 
 para o caminho de nível superior (nome do domínio ou do host do site) nem para a página em si.

# Definições de tipos de dados estruturados

 Para especificar a navegação estrutural, defina um BreadcrumbList que contenha pelo menos dois
 ListItems . É necessário incluir as propriedades obrigatórias para que seu conteúdo esteja qualificado
para exibição na navegação estrutural.

 A marcação data-vocabulary.org não está mais
 qualificada para os recursos de pesquisa aprimorada do Google. Saiba mais sobre a
 desativação do suporte para data-vocabulary .

# BreadcrumbList 

 BreadcrumbList é o item de contêiner que tem todos os elementos da lista. A
 definição completa de BreadcrumbList está disponível em
 schema.org/BreadcrumbList (em inglês).
 Veja as propriedades com suporte do Google:

 
 
 
 Propriedades obrigatórias 

 
 
 
 itemListElement 
 ListItem 

 É uma matriz de navegações estruturais listadas em uma ordem específica. Especifique cada navegação estrutural com um
 ListItem . Exemplo:

 
 { 
 "@context" : "https://schema.org" , 
 "@type" : "BreadcrumbList" , 
 "itemListElement" : [{ 
 "@type" : "ListItem" , 
 "position" : 1 , 
 "name" : "Books" , 
 "item" : "https://example.com/books" 
 },{ 
 "@type" : "ListItem" , 
 "position" : 2 , 
 "name" : "Authors" , 
 "item" : "https://example.com/books/authors" 
 },{ 
 "@type" : "ListItem" , 
 "position" : 3 , 
 "name" : "Ann Leckie" , 
 "item" : "https://example.com/books/authors/annleckie" 
 }] 
 } 
 
 

 

# ListItem 

 ListItem contém detalhes sobre um item individual na lista. A definição completa
 de ListItem está disponível em
 schema.org/ListItem (em inglês).
 Veja as propriedades com suporte do Google:
 

 
 
 
 Propriedades obrigatórias 

 
 
 
 item 
 URL ou um
 subtipo de Thing 

 É o URL da página da Web que representa a navegação estrutural. Há duas maneiras de especificar
 item :

 
 
- URL : especifique o URL da página. Exemplo:
 
 "item": "https://example.com/books"
 
 
 
- Thing : use um código para especificar o URL com base no formato de marcação usado:
 
 
- JSON-LD : use @id para especificar o URL. 
 
- Microdados : é possível usar href ou itemid 
 para especificar o URL. 
 
- RDFa : é possível usar about , href 
 ou resource para especificar o URL. 
 

 
 

 
 Se a navegação estrutural for o último item na trilha, item não será
 obrigatório. Se item não for incluído no último item, o Google usará o URL
 da página que o contém.
 

 
 

 
 name 
 Text 

 É o título da navegação estrutural que aparece para o usuário. Se você usar
 Thing com name em vez de URL para especificar item , então name não é obrigatório.
 
 

 
 position 
 Integer 

 É a posição da navegação estrutural na trilha. A posição 1
 é o começo da trilha.
 
 

 
 

 

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
