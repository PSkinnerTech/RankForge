---
url: https://developers.google.com/search/docs/appearance/structured-data/discussion-forum
title: "Strukturierte Daten für Diskussionsforen ( DiscussionForumPosting )"
fetched_at: 2026-05-16T16:53:04.317Z
seed: false
---

# Strukturierte Daten für Diskussionsforen ( DiscussionForumPosting )

Source: https://developers.google.com/search/docs/appearance/structured-data/discussion-forum

- 
 
 
 
 
 
 
 
 Startseite
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Feedback geben
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Strukturierte Daten für Diskussionsforen ( DiscussionForumPosting )

 
 
 Das Markup für Diskussionsforen ist für alle Websites in Form eines Forums gedacht, auf denen Menschen ihre persönlichen Perspektiven teilen. Wenn Forenwebsites dieses Markup haben, kann die Google Suche Onlinediskussionen im Web besser erkennen und dieses Markup in Funktionen wie Diskussionen und Foren verwenden.

 Hat dein Forum ein Frage-Antwort-Format? 
 Verwende stattdessen Markup für Fragen und Antworten .

# DiscussionForumPosting in einem Forum verwenden

 Im Allgemeinen empfehlen wir, Kommentare unter dem Beitrag zu verschachteln, auf den sie sich beziehen.
 Verfügt das Forum über eine eigene Thread-Struktur, dann verwende eine Baumstruktur mit Kommentaren, um die Struktur darzustellen:

 
 { 
 "@context" : "https://schema.org" , 
 "@type" : "DiscussionForumPosting" , 
 "headline" : "Very Popular Thread" , 
 ... 
 "comment" : [{ 
 "@type" : "Comment" , 
 "text" : "This should not be this popular" , 
 ... 
 "comment" : [{ 
 "@type" : "Comment" , 
 "text" : "Yes it should" , 
 ... 
 }] 
 }] 
 } 
 
 Wenn er eher linear ist (z. B. ein ursprünglicher Beitrag gefolgt von einer Reihe von Antworten), kannst du sie alle als Kommentare unter dem ursprünglichen Beitrag verschachteln. Idealerweise enthalten spätere Inhaltsseiten in mehrseitigen Foren den ursprünglichen Beitrag mit der URL der Hauptseite:

 
 { 
 // JSON-LD on non-threaded forum at https://example.com/post/very-popular-thread/14 
 "@context" : "https://schema.org" , 
 "@type" : "DiscussionForumPosting" , 
 "headline" : "Very Popular Thread" , // Only the headline/topic is explicitly present 
 "url" : "https://example.com/post/very-popular-thread" , 
 ... 
 "comment" : [{ 
 "@type" : "Comment" , 
 "text" : "First Post on this Page" , 
 ... 
 },{ 
 "@type" : "Comment" , 
 "text" : "Second Post on this Page" , 
 ... 
 }] 
 } 
 
 Wenn sich die URL hauptsächlich auf einen einzelnen Beitrag bezieht, verwende mainEntity (oder mainEntityOfPage ), um das primäre DiscussionForumPosting anzugeben:

 
 { 
 "@context" : "https://schema.org" , 
 "@type" : "WebPage" , 
 "url" : "https://example.com/post/very-popular-thread" , 
 "mainEntity" : { 
 "@type" : "DiscussionForumPosting" 
 ... 
 } 
 } 
 
 Bei Webseiten mit einer Liste von Beiträgen (z. B. auf einer Profil-, Themen- oder Kategorieseite) sind oft nicht alle Informationen auf einer einzigen Seite verfügbar und der Nutzer muss klicken, um zusätzliche Informationen (z. B. Antworten) zu erhalten. Es liegt bei dir, ob du nur die Informationen einschließen möchtest, die auf der Seite vorhanden sind (und ob du auch die URL zum diskussionsspezifischen Beitrag angeben möchtest).

 Markiere keinen einzelnen Beitrag auf der Seite als Hauptelement, wenn es sich nicht um eine Diskussionsseite für den Beitrag handelt. Um zu zeigen, dass es sich bei Seiten um zusammengehörige Beiträge handelt, empfiehlt es sich, sie alle an eine Collection oder ItemList anzuhängen.

 
 

# 
 So fügst du strukturierte Daten hinzu
 

 
 Strukturierte Daten sind ein standardisiertes Format, mit dem du Informationen zu einer Seite angeben und die Seiteninhalte klassifizieren kannst. Falls strukturierte Daten für dich ein neues Thema sind, findest du hier Informationen dazu, wie sie funktionieren .
 

 
 In der folgenden Übersicht haben wir zusammengefasst, wie du strukturierte Daten erstellst, testest und veröffentlichst.

 
 
- Füge die erforderlichen Properties hinzu. Hier erfährst du, wie du strukturierte Daten je nach verwendetem Format auf der Seite einfügst. 
 
 Verwendest du ein CMS? Möglicherweise ist es einfacher, ein Plug-in zu verwenden, das in dein CMS eingebunden ist.
 

 Verwendest du JavaScript? Hier erfährst du, wie du strukturierte Daten mit JavaScript generierst. 

 
 
- Folge den Richtlinien . 
 
- Prüfe deinen Code mit dem Test für Rich-Suchergebnisse und behebe alle kritischen Fehler. Zusätzlich solltest du alle nicht kritischen Probleme beheben, die im Tool möglicherweise gemeldet werden. Das kann dabei helfen, die Qualität deiner strukturierten Daten zu verbessern. Das ist jedoch nicht nötig, um für Rich-Suchergebnisse geeignet zu sein. 
 
- Stelle ein paar Seiten mit deinen strukturierten Daten bereit und teste mit dem URL-Prüftool , wie Google die Seiten sieht. Achte darauf, dass die Seiten für Google zugänglich sind und nicht durch eine robots.txt-Datei, das noindex -Tag oder Anmeldeanforderungen blockiert werden. Wenn die Seiten in Ordnung sind, kannst du Google bitten, deine URLs noch einmal zu crawlen .
 Hinweis : Gib Google etwas Zeit, die Seiten neu zu crawlen und zu indexieren. Nachdem eine Seite veröffentlicht wurde, kann es einige Tage dauern, bis sie von Google gefunden und gecrawlt wurde.

 
 
- Damit Google über künftige Änderungen auf dem Laufenden bleibt, empfehlen wir dir, eine Sitemap einzureichen . Mit der Search Console Sitemap API lässt sich dieser Vorgang automatisieren. 
 

 
 

# Beispiele

 Das folgende Markup-Beispiel zeigt eine lineare Forumsseite ohne Thread:

 
 
 JSON-LD 
 <html>
 <head>
 <title>I went to the concert!</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "DiscussionForumPosting",
 "mainEntityOfPage": "https://example.com/post/very-popular-thread",
 "headline": "I went to the concert!",
 "text": "Look at how cool this concert was!",
 "video": {
 "@type": "VideoObject",
 "contentUrl": "https://example.com/media/super-cool-concert.mp4",
 "name": "Video of concert",
 "uploadDate": "2024-03-01T06:34:34+02:00",
 "thumbnailUrl": "https://example.com/media/super-cool-concert-snap.jpg"
 },
 "url": "https://example.com/post/very-popular-thread",
 "author": {
 "@type": "Person",
 "name": "Katie Pope",
 "url": "https://example.com/user/katie-pope",
 "agentInteractionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/WriteAction",
 "userInteractionCount": 8
 }
 },
 "datePublished": "2024-03-01T08:34:34+02:00",
 "interactionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/LikeAction",
 "userInteractionCount": 27
 },
 "comment": [{
 "@type": "Comment",
 "text": "Who's the person you're with?",
 "author": {
 "@type": "Person",
 "name": "Saul Douglas",
 "url": "https://example.com/user/saul-douglas",
 "agentInteractionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/WriteAction",
 "userInteractionCount": 167
 }
 },
 "datePublished": "2024-03-01T09:46:02+02:00"
 },{
 "@type": "Comment",
 "text": "That's my mom, isn't she cool?",
 "author": {
 "@type": "Person",
 "name": "Katie Pope",
 "url": "https://example.com/user/katie-pope",
 "agentInteractionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/WriteAction",
 "userInteractionCount": 8
 }
 },
 "datePublished": "2024-03-01T09:50:25+02:00",
 "interactionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/LikeAction",
 "userInteractionCount": 7
 }
 }]
 }
 </script>
</head>
<body>
</body>
</html> 
 

 
 <html>
 <head>
 <title>I went to the concert!</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "DiscussionForumPosting",
 "mainEntityOfPage": "https://example.com/post/very-popular-thread",
 "headline": "I went to the concert!",
 "text": "Look at how cool this concert was!",
 "video": {
 "@type": "VideoObject",
 "contentUrl": "https://example.com/media/super-cool-concert.mp4",
 "name": "Video of concert",
 "uploadDate": "2024-03-01T06:34:34+02:00",
 "thumbnailUrl": "https://example.com/media/super-cool-concert-snap.jpg"
 },
 "url": "https://example.com/post/very-popular-thread",
 "author": {
 "@type": "Person",
 "name": "Katie Pope",
 "url": "https://example.com/user/katie-pope",
 "agentInteractionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/WriteAction",
 "userInteractionCount": 8
 }
 },
 "datePublished": "2024-03-01T08:34:34+02:00",
 "interactionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/LikeAction",
 "userInteractionCount": 27
 },
 "comment": [{
 "@type": "Comment",
 "text": "Who's the person you're with?",
 "author": {
 "@type": "Person",
 "name": "Saul Douglas",
 "url": "https://example.com/user/saul-douglas",
 "agentInteractionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/WriteAction",
 "userInteractionCount": 167
 }
 },
 "datePublished": "2024-03-01T09:46:02+02:00"
 },{
 "@type": "Comment",
 "text": "That's my mom, isn't she cool?",
 "author": {
 "@type": "Person",
 "name": "Katie Pope",
 "url": "https://example.com/user/katie-pope",
 "agentInteractionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/WriteAction",
 "userInteractionCount": 8
 }
 },
 "datePublished": "2024-03-01T09:50:25+02:00",
 "interactionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": "https://schema.org/LikeAction",
 "userInteractionCount": 7
 }
 }]
 }
 </script>
</head>
<body>
</body>
</html>
