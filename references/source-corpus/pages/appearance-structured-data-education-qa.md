---
url: https://developers.google.com/search/docs/appearance/structured-data/education-qa
title: "Dados estruturados de Perguntas e respostas educacionais ( Quiz , Question e Answer )"
fetched_at: 2026-05-16T16:53:05.010Z
seed: false
---

# Dados estruturados de Perguntas e respostas educacionais ( Quiz , Question e Answer )

Source: https://developers.google.com/search/docs/appearance/structured-data/education-qa

- 
 
 
 
 
 
 
 
 Página inicial
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envie comentários
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Dados estruturados de Perguntas e respostas educacionais ( Quiz , Question e Answer )

 
 
 Se você tem páginas de cartões didáticos, pode ajudar os alunos a encontrar respostas para perguntas educacionais. Para isso, adicione dados estruturados de Quiz às páginas dos cartões. A adição de dados estruturados qualifica seu conteúdo para exibição no carrossel de Perguntas e respostas nos resultados da Pesquisa Google, do Google Assistente e do Google Lens.
 

 
 
 Os seguintes tipos de página estão qualificados para o carrossel de Perguntas e respostas:
 

 
 
- Página de cartões didáticos : é uma página com cartões didáticos que normalmente têm uma pergunta em um lado e a resposta no outro. Para fazer a marcação dessas páginas, continue lendo este guia e saiba como adicionar o esquema de Perguntas e respostas . 
 
- Página única de Perguntas e respostas : é uma página com apenas uma pergunta e as respostas enviadas pelo usuário. Use a marcação
 QAPage para essas páginas. 
 

 

# 
 Disponibilidade do recurso
 

 
 O carrossel de Perguntas e respostas educacionais só está disponível para pesquisas relacionadas a temas educacionais em computadores e celulares. Por exemplo, tente pesquisar consultas como "the measure of
 three angles of a quadrilateral are 80 90 and 103 degrees" ou "the
 ratio of surface energy to surface area is" .
 

 
 O carrossel de Perguntas e respostas educacionais está disponível nos seguintes idiomas e regiões:
 

 
 
 Idioma 
 Regiões disponíveis 
 

 
 
 Inglês
 
 
 Todas as regiões em que a Pesquisa Google está disponível
 
 

 
 Português 
 
 Todas as regiões em que a Pesquisa Google está disponível
 
 

 
 
 Espanhol
 
 
 México
 
 

 
 
 Vietnamita
 
 
 Todas as regiões em que a Pesquisa Google está disponível
 
 

 

 
 
 

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
 

 
 
 

# 
 Exemplos
 

 
 Veja um exemplo de página de cartões didáticos com dados estruturados de Perguntas e respostas.
 

 
 
 <html>
 <head>
 <title>Cell Transport</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "Quiz",
 "about": {
 "@type": "Thing",
 "name": "Cell Transport"
 },
 "educationalAlignment": [
 {
 "@type": "AlignmentObject",
 "alignmentType": "educationalSubject",
 "targetName": "Biology"
 }
 ],
 "hasPart": [
 {
 "@context": "https://schema.org/",
 "@type": "Question",
 "eduQuestionType": "Flashcard",
 "text": "This is some fact about receptor molecules.",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "receptor molecules"
 }
 },
 {
 "@context": "https://schema.org/",
 "@type": "Question",
 "eduQuestionType": "Flashcard",
 "text": "This is some fact about the cell membrane.",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "cell membrane"
 }
 }
 ]
 }
 </script>
 </head>
</html> 
 
 

 
 <html>
 <head>
 <title>Cell Transport</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "Quiz",
 "about": {
 "@type": "Thing",
 "name": "Cell Transport"
 },
 "educationalAlignment": [
 {
 "@type": "AlignmentObject",
 "alignmentType": "educationalSubject",
 "targetName": "Biology"
 }
 ],
 "hasPart": [
 {
 "@context": "https://schema.org/",
 "@type": "Question",
 "eduQuestionType": "Flashcard",
 "text": "This is some fact about receptor molecules.",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "receptor molecules"
 }
 },
 {
 "@context": "https://schema.org/",
 "@type": "Question",
 "eduQuestionType": "Flashcard",
 "text": "This is some fact about the cell membrane.",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "cell membrane"
 }
 }
 ]
 }
 </script>
 </head>
</html>
 
 

# Diretrizes

 Para qualificar sua página para a pesquisa aprimorada de Perguntas e respostas, siga estas diretrizes:

 
 
- Diretrizes gerais de dados estruturados 
 
- Fundamentos da Pesquisa 
 
- Diretrizes técnicas 
 
- Diretrizes de conteúdo 
 

 

# Diretrizes técnicas

 
 
- Coloque os dados estruturados na página de detalhes da forma mais descritiva possível. Não adicione dados estruturados às páginas sem perguntas. 
 
- Todas as perguntas precisam usar o valor Flashcard para a propriedade eduQuestionType .
 As páginas com outros tipos de pergunta não estão qualificadas para o carrossel de Perguntas e respostas.
 
 
- 
 Confira se o Googlebot pode
 rastrear seu site de modo eficiente .
 
 
- As perguntas no seu site precisam estar imediatamente visíveis para os usuários na página, ou seja, elas não podem estar apenas em um arquivo de dados ou PDF. 
 
- Se a página tiver somente uma pergunta e várias respostas enviadas pelos usuários, use a marcação QAPage . 
 

 

# Diretrizes de conteúdo

 
 Criamos estas diretrizes de conteúdo de Perguntas e respostas para garantir que nossos usuários encontrem
 recursos de aprendizado relevantes. Se encontrarmos conteúdo que viole essas diretrizes, responderemos
 adequadamente, o que pode incluir ações manuais 
 e a não exibição do seu conteúdo na pesquisa aprimorada de Perguntas e respostas educacionais no Google.
 

 
 
- As páginas de Perguntas e respostas educacionais precisam seguir as diretrizes de conteúdo para páginas de perguntas e respostas . 
 
- Sua página precisa conter perguntas e respostas relacionadas à educação. É necessário que haja pelo menos uma
 combinação de pergunta e resposta na sua página, e a resposta precisa estar relacionada e responder à pergunta do
 usuário. 
 
- Você é responsável pela precisão e qualidade das páginas de perguntas e respostas educacionais nesse recurso. Se uma determinada quantidade de conteúdo for considerada imprecisa com base na qualidade
 e nos processos de revisão pedagógica, talvez todas as páginas de perguntas e respostas ou um subconjunto delas não estejam
 qualificadas para esse recurso até que os problemas sejam resolvidos. 
 

 

# 
 Marcar padrões educacionais
 

 
 Os padrões de aprendizagem são as metas de aprendizagem que os alunos precisam conhecer e saber fazer
 em cada série. Os padrões de aprendizado têm vários usos, como vincular conteúdo ou
 fazer parte de uma progressão de aprendizagem. Marcar os padrões (encontrados nos campos
 educationalAlignment ) associados ao material de aprendizado on-line
 ajuda o Google a organizar e exibir informações de maneira mais útil para as pessoas
 que pesquisam conteúdo com base nesses padrões. Confira uma visão geral de alto nível do esquema:
 

 
 Veja alguns exemplos de padrões:
 

 
 
- Common Core State Standards 
 
- Texas Essential Knowledge and Skills (TEKS) 
 
- Virginia Standards of Learning (SOL) 
 
- BC Performance Standards 
 
- Alberta Programs of Studies 
 
- The Australian Curriculum (ACARA) 
 
- The Victorian Curriculum (F-10) 
 
- UK National Curriculum 
 

 

# 
 Definições de tipos de dados estruturados
 

 
 É necessário incluir as propriedades obrigatórias para que seu conteúdo seja qualificado para exibição na pesquisa aprimorada. Você também pode incluir as propriedades recomendadas para dar mais informações sobre o conteúdo, o que pode proporcionar uma melhor experiência do usuário.
 

 

# 
 Quiz
 

 
 Um Quiz é um conjunto de um ou mais cartões didáticos, geralmente sobre o mesmo conceito ou assunto.
 

 
 Veja a definição completa de Quiz no site schema.org.
 Veja as propriedades aceitas pelo Google:
 

 
 
 
 Propriedades obrigatórias 

 
 
 
 hasPart 
 Question 

 São informações aninhadas sobre a pergunta no cartão didático específica do teste. Use uma propriedade hasPart para representar um único cartão didático.

 
 Para incluir vários cartões didáticos, repita essa propriedade.
 

 
 { 
 "@type" : "Quiz" , 
 "hasPart" : { 
 "@type" : "Question" 
 } 
 } 
 
 
 

 
 

 
 
 
 Propriedades recomendadas 

 
 
 
 about 
 Thing 

 São informações aninhadas sobre o conceito fundamental de Quiz . 

 
 { 
 "@type" : "Quiz" , 
 "about" : { 
 "@type" : "Thing" 
 } 
 } 
 
 
 

 
 about.name 
 Text 

 São informações aninhadas sobre o conceito fundamental de Quiz . São permitidas várias entradas dessa propriedade.

 
 { 
 "@type" : "Quiz" , 
 "about" : { 
 "@type" : "Thing" , 
 "name" : "Cell transport" 
 } 
 } 
 
 
 

 
 educationalAlignment 
 AlignmentObject 

 É o alinhamento do teste com um framework educacional estabelecido. A propriedade pode ser repetida para alinhar o teste a uma área ou um domínio de estudo e à série ou ao padrão educacional indicado.

 
 { 
 "@type" : "Quiz" , 
 "educationalAlignment" : [] 
 } 
 
 
 

 
 educationalAlignment.alignmentType 
 Text 

 É uma categoria de alinhamento entre o recurso de aprendizado e o nó do framework do teste.
 A Pesquisa Google usa o padrão LRMI .

 Repita a propriedade alignmentType para especificar a área de estudo e a série ou o padrão educacional indicado.

 
 
- Para especificar a área ou o domínio de estudo do teste, defina a propriedade alignmentType com o valor educationalSubject . 
 
- Para especificar a série ou o padrão educacional indicado do teste, defina a propriedade alignmentType com o valor educationalLevel . 
 

 Veja como especificar as propriedades educationalSubject e educationalLevel .

 
 { 
 "@type" : "Quiz" , 
 "educationalAlignment" : [ 
 { 
 "@type" : "AlignmentObject" , 
 "alignmentType" : "educationalSubject" , 
 "targetName" : "Biology" 
 }, 
 { 
 "@type" : "AlignmentObject" , 
 "alignmentType" : "educationalLevel" , 
 "targetName" : "Fifth grade" 
 } 

 ] 
 } 
 
 
 

 
 educationalAlignment.targetName 
 Text 

 É o nome de um nó de um framework educacional estabelecido. Por exemplo: "7º ano: Estrutura celular". 

 
 { 
 "@type" : "Quiz" , 
 "educationalAlignment" : [ 
 { 
 "@type" : "AlignmentObject" , 
 "targetName" : "Grade 7: Cell Structure" 
 } 
 ] 
 } 
 
 
 

 
 

 

# 
 Pergunta
 

 
 Cada pergunta corresponde a um cartão didático, aninhado na propriedade hasPart de Quiz . Esses requisitos de Question são diferentes dos requisitos de pergunta para QAPage .
 
 
 Confira a definição completa de Question no site schema.org. Veja as propriedades aceitas pelo Google:
 

 
 
 
 Propriedades obrigatórias 

 
 
 
 acceptedAnswer 
 Answer 

 É o texto completo da resposta de um cartão didático. Só pode haver uma propriedade acceptedAnswer por tipo de Question .

 
 { 
 "@type" : "Question" , 
 "acceptedAnswer" : { 
 "@type" : "Answer" , 
 "text" : "cell membranes" 
 } 
 } 
 
 
 

 
 eduQuestionType 
 Text 

 É o tipo de pergunta. É preciso usar este valor fixo: Flashcard .

 
 { 
 "@type" : "Question" , 
 "eduQuestionType" : " Flashcard ” 
 } 
 
 
 

 
 text 
 Text 

 É o texto completo da pergunta do cartão didático.

 
 { 
 "@type" : "Question" , 
 "text" : "A protein on the surface of HIV can attach to proteins on the surface of healthy human cells. What are the attachment sites on the surface of the cells known as?" 
 } 
 
 
 

 
 

 
 

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
