---
url: https://developers.google.com/search/docs/appearance/structured-data/speakable
title: "Dados estruturados de Speakable ( Article , WebPage ) (BETA)"
fetched_at: 2026-05-16T16:53:19.700Z
seed: false
---

# Dados estruturados de Speakable ( Article , WebPage ) (BETA)

Source: https://developers.google.com/search/docs/appearance/structured-data/speakable

- 
 
 
 
 
 
 
 
 Página inicial
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envie comentários
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Dados estruturados de Speakable ( Article , WebPage ) (BETA)

 
 Esse recurso está em versão Beta e sujeito a alterações. Ele ainda está em desenvolvimento,
 então os requisitos ou as diretrizes podem mudar.

 A propriedade speakable do schema.org (em inglês)
 identifica as seções de um artigo ou uma página da Web que são mais adequadas para transmissão de áudio por
 conversão de texto em voz (TTS, na sigla em inglês). O acréscimo de marcação permite que mecanismos de pesquisa e outros aplicativos identifiquem conteúdos
 para ler em voz alta nos dispositivos com Google Assistente que usam TTS. Páginas da Web com dados estruturados speakable 
 podem usar o Google Assistente para distribuir o conteúdo por meio de novos canais
 e alcançar uma base maior de usuários.

 O Google Assistente usa dados estruturados speakable para responder a consultas de notícias temáticas
 em alto-falantes inteligentes. Quando os usuários solicitam notícias sobre um assunto específico, o
 Google Assistente retorna até três artigos de toda a Web e é compatível com a transmissão de áudio usando
 TTS para as seções do artigo com dados estruturados speakable . Quando o
 Google Assistente lê em voz alta uma seção speakable , ele atribui a origem e envia
 o URL completo do artigo ao dispositivo móvel do usuário por meio do app Google Assistente.

# Exemplo

 Veja a seguir um exemplo de dados estruturados speakable que usa o código JSON-LD e o valor
 content-locator de xPath:

 
 <html>
 <head>
 <title>Speakable markup example</title>
 <meta name="description" content="This page is all about the quick brown fox" />
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "WebPage",
 "name": "Quick Brown Fox",
 "speakable":
 {
 "@type": "SpeakableSpecification",
 "xPath": [
 "/html/head/title",
 "/html/head/meta[@name='description']/@content"
 ]
 },
 "url": "https://www.example.com/quick-brown-fox"
 }
 </script>
 </head>
 <body>
 </body>
</html>
 

 

# Disponibilidade de país e idioma

 A propriedade speakable funciona para usuários nos EUA que têm dispositivos Google Home
 configurados para o inglês, assim como para editores que publicam conteúdo em inglês. Esperamos fazer o lançamento em outros
 países e idiomas assim que houver um número suficiente de editores que tenham implementado
 a propriedade speakable .
 

 

# Primeiros passos

 Para que o conteúdo apareça como resposta a consultas de notícias temáticas, siga estas etapas:

 
 
- Siga nossas diretrizes . 
 
- Adicione dados estruturados speakable 
 à página da Web. 
 

 

# Diretrizes

 Siga estas diretrizes para que o conteúdo speakable esteja qualificado para aparecer
 nos resultados de notícias.
 
 
 
- Diretrizes técnicas 
 
- Diretrizes de conteúdo 
 
- Fundamentos da Pesquisa 
 
- Diretrizes gerais de dados estruturados 
 

 

# Diretrizes técnicas

 Siga estas diretrizes ao implementar a marcação speakable para o Google Assistente.

 
 
- Não adicione dados estruturados speakable a conteúdos que possam soar confusos em
 situações que contenham somente voz ou encaminhamento de voz, como linhas de data (local onde a história foi relatada),
 legendas de fotos ou atribuições de fonte. 
 
- Em vez de destacar um artigo inteiro com dados estruturados speakable ,
 concentre-se nos pontos principais. Isso permite que os ouvintes tenham uma ideia da matéria e que a leitura de TTS
 não corte detalhes importantes. 
 

 

# Diretrizes de conteúdo

 Siga estas diretrizes ao escrever conteúdo que você pretende marcar com
 dados estruturados speakable .

 
 
- O conteúdo indicado pelos dados estruturados speakable precisa ter títulos
 e/ou resumos concisos que forneçam aos usuários informações compreensíveis e úteis. 
 
- Se você incluir o início da matéria nos dados estruturados speakable , sugerimos
 que o reescreva dividindo as informações em frases individuais
 para que elas sejam lidas pelo TTS de maneira mais clara. 
 
- Para otimizar as experiências do usuário com áudio, recomendamos cerca de 20 a 30 segundos de conteúdo por
 seção de dados estruturados speakable , ou aproximadamente duas a três frases. 
 

 

# Definições de tipos de dados estruturados

 Speakable é usado pelo objeto
 Article ou
 Webpage (links em inglês).
 A definição completa de speakable está disponível em
 schema.org/speakable (em inglês). Você precisa
 incluir as propriedades obrigatórias para que o conteúdo seja qualificado para esse recurso.

 A propriedade speakable pode ser repetida qualquer número de vezes, com dois
 tipos de valores possíveis de content-locator : seletores CSS e xPaths. Use uma das
 seguintes propriedades:

 
 
 
 Propriedades obrigatórias 

 
 
 
 cssSelector 
 
 Text 

 Lida com conteúdo nas páginas anotadas (como atributo de classe). Use
 cssSelector ou xPath , mas não ambos. Exemplo:

 
 "speakable" : 
 { 
 "@type" : "SpeakableSpecification" , 
 "cssSelector" : [ 
 ".headline" , 
 ".summary" 
 ] 
 } 
 
 
 

 
 xPath 
 Text 
 
 Lida com conteúdo usando xPaths (presumindo uma visualização em XML do conteúdo). Use
 cssSelector ou xPath , mas não ambos. Exemplo:

 
 "speakable" : 
 { 
 "@type" : "SpeakableSpecification" , 
 "xPath" : [ 
 "/html/head/title" , 
 "/html/head/meta[@name='description']/@content" 
 ] 
 } 
 
 
 

 
 

 
 
 

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
 

 
 
 

# Não é possível acionar o conteúdo

 error Problema : não é possível acionar seu conteúdo
 pelo Google Assistente usando áudio TTS.

 done Corrigir o problema 

 
 
- Teste os seguintes comandos de voz:
 
 
- "Quais são as notícias mais recentes sobre $topic?" 
 
- "Quais são as novidades sobre $topic?" 
 
- "Tocar notícias sobre $topic." 
 

 
 
- Se os problemas persistirem, isso pode estar acontecendo porque a classificação é determinada por algoritmos.
 O Google Assistente fornece até três artigos de diferentes publicações de notícias usando
 a transmissão de áudio com TTS. Para ver mais informações sobre como o Google classifica os artigos, consulte
 Como funciona a Pesquisa .
 
 

 

# Mais soluções de áudio

 Além dos dados estruturados speakable , você pode usar outras soluções de áudio do Google Assistente
 no conteúdo de notícias, como a integração avançada
 com seus aplicativos personalizados. Por exemplo, você pode permitir que os usuários interajam com o app usando o
 Google Assistente. Para ver mais informações, consulte o guia do
 desenvolvedor do Actions on Google .

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Envie comentários
