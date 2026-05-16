---
url: https://developers.google.com/search/docs/crawling-indexing/block-indexing
title: "Bloquear a indexação da Pesquisa com noindex"
fetched_at: 2026-05-16T16:52:29.862Z
seed: false
---

# Bloquear a indexação da Pesquisa com noindex

Source: https://developers.google.com/search/docs/crawling-indexing/block-indexing

- 
 
 
 
 
 
 
 
 Página inicial
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envie comentários
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Bloquear a indexação da Pesquisa com noindex 

 
 
 noindex é um conjunto de regras com uma tag <meta> 
 ou cabeçalho de resposta HTTP que é usado para evitar a indexação de conteúdo por mecanismos de pesquisa
 compatíveis com a regra noindex , como o Google. Quando o Googlebot rastreia a página e
 extrai a tag ou o cabeçalho e exclui totalmente a página dos resultados da pesquisa Google,
 mesmo que outros sites tenham links para ela.
 

 
 Importante : para que a regra noindex funcione, a página
 ou recurso não pode ser bloqueado por um arquivo robots.txt e precisa ser
 acessível pelo rastreador. Se a página estiver bloqueada por um
 arquivo robots.txt ou se o rastreador não puder acessar a página, ele nunca vai ver a regra
 noindex . A página ainda pode aparecer nos resultados da pesquisa, por exemplo,
 caso outras páginas tenham links para ela.
 

 
 O uso de noindex é útil se você não tem acesso à raiz do servidor, já que ele
 permite controlar o acesso página por página ao seu site.
 

 

# Implementação de noindex 

 
 Há duas maneiras de implementar noindex : como uma tag <meta> e
 como um cabeçalho de resposta HTTP. Elas têm o mesmo efeito. Escolha o método mais adequado ao tipo de conteúdo e
 conveniente para o site. O Google não permite especificar a
 regra noindex no arquivo robots.txt.
 

 
 Também é possível combinar a regra noindex com outras regras que controlam a indexação. Por exemplo, é possível mesclar uma dica nofollow com uma regra noindex : <meta name="robots" content=" noindex, nofollow " /> .
 

 

# Tag <meta> 

 
 Para impedir que todos os mecanismos de pesquisa compatíveis com a regra noindex indexem
 uma página no site, coloque a seguinte tag <meta> na
 seção <head> da sua página:
 

 
 
<meta name=" robots " content="noindex">
 

 Para impedir que somente os rastreadores da Web do Google indexem uma página:

 
 
<meta name=" googlebot " content="noindex">
 

 
 Talvez alguns mecanismos de pesquisa interpretem a regra
 noindex de maneira diferente. Consequentemente, é possível que a página continue sendo exibida nos resultados de outros mecanismos de pesquisa.
 

 
 Saiba mais sobre a tag noindex <meta> .
 

 
 
 
 
 Se você usar um CMS (sistema de gerenciamento de conteúdo), como o Wix, o WordPress ou o Blogger , talvez não consiga ou não queira editar o HTML diretamente. Nesse caso, talvez o CMS tenha uma página de configurações ou outro mecanismo para informar os mecanismos
 de pesquisa sobre tags meta .
 

 
 Se você quiser adicionar uma tag meta ao site, procure instruções
 sobre como modificar a <head> da sua página no CMS (por exemplo,
 pesquise "adicionar tags meta wix").
 

 

 
 
 

# Cabeçalho de resposta HTTP

 
 Em vez de uma tag <meta> , é possível retornar um cabeçalho HTTP X-Robots-Tag com um valor de noindex ou none na sua resposta.
 Um cabeçalho de resposta pode ser usado para recursos não HTML, como PDFs e arquivos de vídeo e de imagem. Veja um exemplo de resposta HTTP com um cabeçalho X-Robots-Tag instruindo os mecanismos de pesquisa a não indexar uma página:
 

 
 
HTTP/1.1 200 OK
(...)
 X-Robots-Tag: noindex 
(...)
 

 
 Leia mais sobre o cabeçalho de resposta noindex .
 

 

# Como depurar de problemas de noindex 

 
 É preciso rastrear sua página para ver as tags <meta> e os cabeçalhos HTTP. Se uma página ainda estiver aparecendo nos resultados, é provável que não tenhamos rastreado a página desde que você adicionou a regra noindex . Pode levar meses para que o Googlebot acesse a página novamente, dependendo da importância dela na Internet. É possível solicitar que o Google rastreie uma página novamente usando a Ferramenta de inspeção de URL .
 

 
 Se precisar remover uma página do seu site rapidamente dos resultados da pesquisa do Google, consulte a documentação sobre remoções .
 

 
 Isso também pode acontecer quando o arquivo robots.txt bloqueia o URL dos rastreadores da Web do Google. Por esse motivo, não é possível ver a tag. Para desbloquear sua página do Google, é necessário
 editar o arquivo robots.txt .
 

 
 Por fim, verifique se a regra noindex está visível para o Googlebot. Para testar se a implementação de noindex está correta, use a Ferramenta de inspeção de URL e confira o HTML recebido pelo Googlebot ao rastrear a página.
 Você também pode usar o Relatório de indexação de páginas no Search Console para monitorar as páginas do seu site que tiveram uma regra noindex extraída pelo Googlebot.
 

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Envie comentários
