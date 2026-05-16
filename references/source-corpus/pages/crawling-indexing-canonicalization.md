---
url: https://developers.google.com/search/docs/crawling-indexing/canonicalization
title: "O que é canonização?"
fetched_at: 2026-05-16T16:52:33.276Z
seed: false
---

# O que é canonização?

Source: https://developers.google.com/search/docs/crawling-indexing/canonicalization

- 
 
 
 
 
 
 
 
 Página inicial
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envie comentários
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# O que é canonização?

 
 
 A canonização é o processo de selecionar o URL representativo ( canônico ) de um conteúdo. Consequentemente, um URL canônico é o URL de uma página que o Google escolheu como o mais representativo de um conjunto de páginas duplicadas. Muitas vezes chamado de eliminação de duplicação, esse processo ajuda o Google a mostrar apenas uma versão do conteúdo duplicado nos resultados da pesquisa.

 Um site pode ter conteúdo duplicado por vários motivos:

 
 
- 
 Variantes da região : por exemplo, uma parte do conteúdo para os EUA e o Reino Unido, que pode ser acessada em diferentes URLs, mas basicamente o mesmo conteúdo no mesmo idioma.
 
 
- 
 Variantes do dispositivo : por exemplo, uma página com uma versão para dispositivos móveis e para computadores.
 
 
- Variantes de protocolo : por exemplo, as versões HTTP e HTTPS de um site 
 
- Funções do site : por exemplo, os resultados da classificação e filtragem de funções de uma página de categoria 
 
- Variantes acidentais : por exemplo, a versão de demonstração do site é aberta acidentalmente para rastreadores 

 
 É normal o site ter um pouco de conteúdo duplicado, e isso não caracteriza uma violação das políticas de spam do Google . No entanto, ter o mesmo conteúdo acessível por meio de URLs diferentes pode resultar em uma experiência do usuário ruim. Por exemplo, as pessoas podem se perguntar qual é a página certa e se há uma diferença entre as duas e isso pode dificultar o acompanhamento do desempenho do seu conteúdo nos resultados da pesquisa.

# Como o Google indexa e escolhe o URL canônico

 
 

 
 Quando o Google indexa uma página , ele determina o conteúdo principal (ou item de referência ) de cada página. Se o Google encontrar várias páginas que parecem ser iguais ou ter conteúdo principal muito semelhante, ele vai escolher a página mais completa e útil para os usuários da pesquisa com base nos fatores (ou indicadores ) coletados pelo processo de indexação e a marcar como canônica. A página canônica vai ser rastreada com mais frequência, e as cópias, com menos, para reduzir a carga de rastreamento do Google nos sites.

 
 Há vários fatores considerados na canonização: se a página é veiculada por HTTP ou HTTPS, redirecionamentos, a presença do URL em um sitemap e as anotações rel="canonical" link . É possível indicar sua preferência usando essas técnicas. No entanto, o Google pode escolher outra página como canônica por vários motivos. Isso significa que indicar a preferência de página canônica funciona como uma dica, e não como uma regra.

 
 As versões de uma única página em idiomas diferentes só vão ser consideradas cópias se o conteúdo principal estiver na mesma língua. Ou seja, se apenas o cabeçalho, o rodapé e outro texto não essencial estiverem traduzidos, mas o corpo permanecer o mesmo, as páginas vão ser consideradas duplicadas. Para saber mais sobre a configuração de sites localizados, consulte nossa documentação sobre como gerenciar sites multilíngues e multirregionais .

 
 O Google usa a página canônica como a principal fonte para avaliar o conteúdo e a qualidade do site. Em geral, um resultado da pesquisa do Google vai direcionar a busca para a página canônica, a menos que uma das cópias seja claramente mais adequada para o usuário da pesquisa. Por exemplo, o resultado da pesquisa provavelmente vá levar a uma página para dispositivos móveis se a pessoa estiver usando esse tipo de dispositivo, mesmo que a versão para computadores seja a canônica.

 
 Leia mais sobre como indicar sua preferência pelo URL canônico e se você precisa fazer isso .

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Envie comentários
