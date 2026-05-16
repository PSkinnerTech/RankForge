---
url: https://developers.google.com/search/docs/appearance/structured-data/organization
title: "Strukturierte Daten für Organisationen ( Organization )"
fetched_at: 2026-05-16T16:52:39.042Z
seed: false
---

# Strukturierte Daten für Organisationen ( Organization )

Source: https://developers.google.com/search/docs/appearance/structured-data/organization

- 
 
 
 
 
 
 
 
 Startseite
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Feedback geben
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Strukturierte Daten für Organisationen ( Organization )

 
 
 
 Knowledge Panel für Händler in den Google-Suchergebnissen 
 
 
 Wenn du deiner Startseite strukturierte Daten für Organisationen hinzufügst, kann Google die Verwaltungsdetails deiner Organisation besser verstehen und deine Organisation in den Suchergebnissen eindeutig identifizieren. Einige Properties werden im Hintergrund verwendet, um deine Organisation von anderen Organisationen zu unterscheiden (wie iso6523 und naics ), während andere die visuellen Elemente in Suchergebnissen beeinflussen können (z. B. das logo , das in den Suchergebnissen und in deinem Knowledge Panel angezeigt wird).
 Als Händler kannst du weitere Details in deinem Knowledge Panel für Händler und deinem Markenprofil beeinflussen, z. B. Rückgabebedingungen, Adresse und Kontaktdaten. Es gibt keine erforderlichen Properties. Wir empfehlen stattdessen, so viele Properties wie möglich hinzuzufügen, die für deine Organisation relevant sind.

 
 

# 
 So fügst du strukturierte Daten hinzu
 

 
 Strukturierte Daten sind ein standardisiertes Format, mit dem du Informationen zu einer Seite angeben und die Seiteninhalte klassifizieren kannst. Falls strukturierte Daten für dich ein neues Thema sind, findest du hier Informationen dazu, wie sie funktionieren .
 

 
 In der folgenden Übersicht haben wir zusammengefasst, wie du strukturierte Daten erstellst, testest und veröffentlichst.

 
 
- Füge beliebig viele empfohlene Eigenschaften für deine Webseite hinzu. Es gibt keine erforderlichen Properties. Füge stattdessen die Properties hinzu, die auf deine Inhalte zutreffen. Hier erfährst du, wie du strukturierte Daten je nach verwendetem Format auf der Seite einfügst. 
 
 Verwendest du ein CMS? Möglicherweise ist es einfacher, ein Plug-in zu verwenden, das in dein CMS eingebunden ist.
 

 Verwendest du JavaScript? Hier erfährst du, wie du strukturierte Daten mit JavaScript generierst. 

 
 
- Folge den Richtlinien . 
 
- Prüfe deinen Code mit dem Test für Rich-Suchergebnisse und behebe alle kritischen Fehler. Zusätzlich solltest du alle nicht kritischen Probleme beheben, die im Tool möglicherweise gemeldet werden. Das kann dabei helfen, die Qualität deiner strukturierten Daten zu verbessern. Das ist jedoch nicht nötig, um für Rich-Suchergebnisse geeignet zu sein. 
 
- Stelle ein paar Seiten mit deinen strukturierten Daten bereit und teste mit dem URL-Prüftool , wie Google die Seiten sieht. Achte darauf, dass die Seiten für Google zugänglich sind und nicht durch eine robots.txt-Datei, das noindex -Tag oder Anmeldeanforderungen blockiert werden. Wenn die Seiten in Ordnung sind, kannst du Google bitten, deine URLs noch einmal zu crawlen .
 Hinweis : Gib Google etwas Zeit, die Seiten neu zu crawlen und zu indexieren. Nachdem eine Seite veröffentlicht wurde, kann es einige Tage dauern, bis sie von Google gefunden und gecrawlt wurde.

 
 
- Damit Google über künftige Änderungen auf dem Laufenden bleibt, empfehlen wir dir, eine Sitemap einzureichen . Mit der Search Console Sitemap API lässt sich dieser Vorgang automatisieren. 
 

 
 

# Beispiele

# Organization 

 Hier siehst du ein Beispiel für Organisationsinformationen im JSON-LD-Code.

 <html>
 <head>
 <title>About Us</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "Organization",
 "url": "https://www.example.com",
 "sameAs": ["https://example.net/profile/example1234", "https://example.org/example1234"],
 "logo": "https://www.example.com/images/logo.png",
 "name": "Example Corporation",
 "description": "The example corporation is well-known for producing high-quality widgets",
 "email": "contact@example.com",
 "telephone": "+47-99-999-9999",
 "address": {
 "@type": "PostalAddress",
 "streetAddress": "Rue Improbable 99",
 "addressLocality": "Paris",
 "addressCountry": "FR",
 "addressRegion": "Ile-de-France",
 "postalCode": "75001"
 },
 "vatID": "FR12345678901",
 "iso6523Code": "0199:724500PMK2A2M1SQQ228"
 }
 </script>
 </head>
 <body>
 </body>
</html> 

 
 <html>
 <head>
 <title>About Us</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "Organization",
 "url": "https://www.example.com",
 "sameAs": ["https://example.net/profile/example1234", "https://example.org/example1234"],
 "logo": "https://www.example.com/images/logo.png",
 "name": "Example Corporation",
 "description": "The example corporation is well-known for producing high-quality widgets",
 "email": "contact@example.com",
 "telephone": "+47-99-999-9999",
 "address": {
 "@type": "PostalAddress",
 "streetAddress": "Rue Improbable 99",
 "addressLocality": "Paris",
 "addressCountry": "FR",
 "addressRegion": "Ile-de-France",
 "postalCode": "75001"
 },
 "vatID": "FR12345678901",
 "iso6523Code": "0199:724500PMK2A2M1SQQ228"
 }
 </script>
 </head>
 <body>
 </body>
</html>
 

# OnlineStore (Untertyp von Organization ) mit Versand- und Rückgabebedingungen

 Hier siehst du ein Beispiel für einen Onlineshop mit Versand- und Rückgabebedingungen in JSON-LD-Code.

 Weitere Beispiele und detaillierte Informationen zu standardmäßigen Rückgabebedingungen auf Händlerebene findest du in der separaten Dokumentation zum Markup für Rückgabebedingungen von Händlern .

 <html>
 <head>
 <title>About Us</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "OnlineStore",
 "name": "Example Online Store",
 "url": "https://www.example.com",
 "sameAs": [
 "https://example.net/profile/example12",
 "https://example.org/@example34"
 ],
 "logo": "https://www.example.com/assets/images/logo.png",
 "contactPoint": {
 "contactType": "Customer Service",
 "email": "support@example.com",
 "telephone": "+47-99-999-9900"
 },
 "vatID": "FR12345678901",
 "iso6523Code": "0199:724500PMK2A2M1SQQ228",
 "hasShippingService": [
 {
 "@type": "ShippingService",
 "name": "shipping to CH and FR",
 "description": "Shipping to CH 5% of order value, shipping to FR always free",
 "fulfillmentType": "FulfillmentTypeDelivery",
 "shippingConditions": [
 {
 "@type": "ShippingConditions",
 "shippingOrigin": {
 "@type": "DefinedRegion",
 "addressCountry": "FR"
 },
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "CH"
 },
 "shippingRate": {
 "@type": "ShippingRateSettings",
 "orderPercentage": "0.05"
 }
 },
 {
 "@type": "ShippingConditions",
 "shippingOrigin": {
 "@type": "DefinedRegion",
 "addressCountry": "FR"
 },
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "FR"
 },
 "shippingRate": {
 "@type": "MonetaryAmount",
 "value": "0",
 "currency": "EUR"
 }
 }
 ]
 }
 ],
 "hasMerchantReturnPolicy": {
 "@type": "MerchantReturnPolicy",
 "applicableCountry": [
 "FR",
 "CH"
 ],
 "returnPolicyCountry": "FR",
 "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
 "merchantReturnDays": 60,
 "returnMethod": "https://schema.org/ReturnByMail",
 "returnFees": "https://schema.org/FreeReturn",
 "refundType": "https://schema.org/FullRefund"
 }
 // Other Organization-level properties
 // ...
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 
 <html>
 <head>
 <title>About Us</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "OnlineStore",
 "name": "Example Online Store",
 "url": "https://www.example.com",
 "sameAs": [
 "https://example.net/profile/example12",
 "https://example.org/@example34"
 ],
 "logo": "https://www.example.com/assets/images/logo.png",
 "contactPoint": {
 "contactType": "Customer Service",
 "email": "support@example.com",
 "telephone": "+47-99-999-9900"
 },
 "vatID": "FR12345678901",
 "iso6523Code": "0199:724500PMK2A2M1SQQ228",
 "hasShippingService": [
 {
 "@type": "ShippingService",
 "name": "shipping to CH and FR",
 "description": "Shipping to CH 5% of order value, shipping to FR always free",
 "fulfillmentType": "FulfillmentTypeDelivery",
 "shippingConditions": [
 {
 "@type": "ShippingConditions",
 "shippingOrigin": {
 "@type": "DefinedRegion",
 "addressCountry": "FR"
 },
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "CH"
 },
 "shippingRate": {
 "@type": "ShippingRateSettings",
 "orderPercentage": "0.05"
 }
 },
 {
 "@type": "ShippingConditions",
 "shippingOrigin": {
 "@type": "DefinedRegion",
 "addressCountry": "FR"
 },
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "FR"
 },
 "shippingRate": {
 "@type": "MonetaryAmount",
 "value": "0",
 "currency": "EUR"
 }
 }
 ]
 }
 ],
 "hasMerchantReturnPolicy": {
 "@type": "MerchantReturnPolicy",
 "applicableCountry": [
 "FR",
 "CH"
 ],
 "returnPolicyCountry": "FR",
 "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
 "merchantReturnDays": 60,
 "returnMethod": "https://schema.org/ReturnByMail",
 "returnFees": "https://schema.org/FreeReturn",
 "refundType": "https://schema.org/FullRefund"
 }
 // Other Organization-level properties
 // ...
 }
 </script>
 </head>
 <body>
 </body>
</html>
 

# Richtlinien

 Damit strukturierte Daten in die Google-Suchergebnisse aufgenommen werden können, musst du die folgenden Richtlinien beachten.

 Warnung : Wenn auf deiner Website eine oder mehrere dieser Richtlinien verletzt werden, ergreift Google möglicherweise manuelle Maßnahmen . Sobald du das Problem behoben hast, kannst du einen Antrag auf erneute Überprüfung der Website stellen .

 
 
- Technische Richtlinien 
 
- Grundlagen der Google Suche 
 
- Allgemeine Richtlinien für strukturierte Daten 

# 
 Technische Richtlinien

 
 Wir empfehlen, diese Informationen auf deiner Startseite oder auf einer einzelnen Seite zu platzieren, auf der deine Organisation beschrieben wird, beispielsweise auf der Seite Über uns . Du musst sie nicht auf jeder Seite deiner Website einfügen.

 
 Wir empfehlen die Verwendung des Schema.org-Untertyps von Organization , der zu deiner Organisation passt. Wenn du beispielsweise eine E-Commerce-Website hast, empfehlen wir die Verwendung des Untertyps OnlineStore anstelle von OnlineBusiness .
 Wenn es auf deiner Website um ein lokales Unternehmen geht, z. B. ein Restaurant oder ein Ladengeschäft, solltest du die administrativen Details angeben. Verwende dabei die spezifischsten Untertypen von LocalBusiness und die Pflichtfelder und empfohlenen Felder für Lokales Unternehmen zusätzlich zu den in diesem Leitfaden empfohlenen Feldern.

# Definitionen strukturierter Datentypen

 Google erkennt die folgenden Properties für eine Organization .
 Damit Google deine Seite besser versteht, füge möglichst viele empfohlene Properties hinzu, die auf deine Webseite zutreffen. Es gibt keine erforderlichen Properties. Füge stattdessen die Properties hinzu, die auf deine Organisation zutreffen.

 
 Wir empfehlen dir, dich auf Properties zu konzentrieren, die für deine Nutzer hilfreich sind, z. B. name oder alternateName für den Namen deines Unternehmens sowie Hinweise auf die Präsenz in der realen Welt (z. B. address oder telephone ) und eine Onlinepräsenz (z. B. url oder logo ).

 
 
 
 Empfohlene Properties 

 
 
 
 address 
 PostalAddress 

 Die Adresse deiner Organisation (physische Adresse oder Postanschrift), falls zutreffend. Gib alle Properties an, die für dein Land gelten. Je mehr Properties du angibst, desto informativer ist das Ergebnis für Nutzer.
 Du kannst mehrere Adressen angeben, wenn du einen Standort in mehreren Städten, Bundesländern oder Ländern hast.
 Beispiel:

 
 "address" : [{ 
 "@type" : "PostalAddress" , 
 "streetAddress" : "999 W Example St Suite 99 Unit 9" , 
 "addressLocality" : "New York" , 
 "addressRegion" : "NY" , 
 "postalCode" : "10019" , 
 "addressCountry" : "US" 
 },{ 
 "streetAddress" : "999 Rue due exemple" , 
 "addressLocality" : "Paris" , 
 "postalCode" : "75001" , 
 "addressCountry" : "FR" 
 }] 
 
 
 

 
 address.addressCountry 
 Text 

 Das Land deiner Postanschrift anhand des aus zwei Buchstaben bestehenden ISO 3166-1-Alpha-2-Ländercodes .

 
 

 
 address.addressLocality 
 Text 

 Der Ort deiner Postanschrift.

 
 

 
 address.addressRegion 
 Text 

 Die Region deiner Postanschrift, falls zutreffend. Zum Beispiel ein Bundesland.

 
 

 
 address.postalCode 
 Text 

 Die Postleitzahl deiner Adresse.

 
 

 
 address.streetAddress 
 Text 

 Die vollständige Straßenadresse deiner Postanschrift.

 
 

 
 alternateName 
 Text 

 Ein anderer gebräuchlicher Name, den deine Organisation verwendet, falls zutreffend.
 
 

 
 contactPoint 
 ContactPoint 

 Die beste Möglichkeit für Nutzer, Ihr Unternehmen zu kontaktieren (falls zutreffend). Gib alle für deine Nutzer verfügbaren Supportmethoden gemäß den von Google empfohlenen Best Practices an. Beispiel:

 
 "contactPoint" : { 
 "@type" : "ContactPoint" , 
 "telephone" : "+9-999-999-9999" , 
 "email" : "contact@example.com" 
 } 
 
 
 

 
 contactPoint.email 
 Text 

 Die E-Mail-Adresse, unter der dein Unternehmen kontaktiert werden kann, falls zutreffend.
 Wenn du den Typ LocalBusiness verwendest, gib eine primäre E-Mail-Adresse auf LocalBusiness -Ebene an, bevor du contactPoint verwendest, um mehrere Möglichkeiten anzugeben, wie deine Organisation erreicht werden kann.
 

 
 

 
 contactPoint.telephone 
 Text 

 Die Telefonnummer, unter der dein Unternehmen kontaktiert werden kann, falls zutreffend.
 Gib in jedem Fall auch die Landes- und Ortsvorwahl an.
 Wenn du den Typ LocalBusiness verwendest, gib eine primäre Telefonnummer auf LocalBusiness -Ebene an, bevor du contactPoint verwendest, um mehrere Möglichkeiten anzugeben, wie deine Organisation zu erreichen ist.
 

 
 

 
 description 
 Text 

 Eine detaillierte Beschreibung deiner Organisation, falls zutreffend.
 
 

 
 duns 
 Text 

 Die Dun & Bradstreet-D-U-N-S-Nummer zur Identifizierung deiner Organization , falls zutreffend. Wir empfehlen, stattdessen das Feld iso6523Code mit dem Präfix 0060: zu verwenden.
 
 

 
 
 email 
 
 
 Text 

 Die E-Mail-Adresse, unter der dein Unternehmen kontaktiert werden kann, falls zutreffend.

 
 

 
 foundingDate 
 Date 

 Das Gründungsdatum deiner Organization . Die Angabe erfolgt im ISO 8601-Datumsformat , sofern zutreffend.
 
 

 
 globalLocationNumber 
 Text 

 Die GS1 Global Location Number zur Angabe des Standorts deiner Organization , falls zutreffend.
 
 

 
 
 hasMerchantReturnPolicy 
 
 Wiederholte MerchantReturnPolicy 

 
 Die Rückgabebedingungen deiner Organization , falls zutreffend. Im Markup für Rückgabebedingungen von Händlern findest du detaillierte Informationen zu den erforderlichen und optionalen Properties für MerchantReturnPolicy .
 

 
 Wenn du für deine Organization keine Rückgabebedingungen angibst oder einige deiner Produkte bestimmte Rückgabebedingungen haben, für die du die für deine Organization definierten Rückgabebedingungen überschreiben musst, verwende diese Property auch im Markup für Händlereinträge .
 

 
 

 
 
 hasMemberProgram 
 
 Wiederholte MemberProgram 

 
 Ein von dir angebotenes (Treuepunkte-)Mitgliedschaftsprogramm, falls zutreffend.
 Unter Markup für Mitgliedschaftsprogramme findest du ausführliche Informationen zu den erforderlichen und optionalen Properties für MemberProgram .
 

 
 

 
 
 hasShippingService 
 
 Wiederholte ShippingService 

 
 Die Versandbedingungen deiner Organization , falls zutreffend. Im Markup für Versandbedingungen von Händlern findest du detaillierte Informationen zu den erforderlichen und optionalen Properties für ShippingService .
 
 
 Wenn du für deine Organization keine Versandbedingungen angibst oder einige deiner Produkte bestimmte Versandbedingungen haben, für die du die für deine Organization definierten Versandbedingungen überschreiben musst, verwende diese Property auch im Markup für Händlereinträge .
 
 

 
 
 iso6523Code 
 
 Text 

 Die ISO 6523-Kennung deiner Organisation, falls zutreffend.
 Der erste Teil einer ISO 6523-Kennzeichnung ist ein ICD (International Code Designator) , der angibt, welches Identifikationsschema verwendet wird.
 Der zweite Teil ist die eigentliche Kennung. Wir empfehlen, den ICD und die Kennung durch einen Doppelpunkt ( U+003A ) zu trennen. Gängige ICD-Werte sind:

 
 
- 0060 : Dun & Bradstreet Data Universal Numbering System (D-U-N-S) 
 
- 0088 : GS1 Global Location Number (GLN) 
 
- 0199 : Legal Entity Identifier (LEI) 
 

 
 

 
 legalName 
 Text 

 Der registrierte, rechtsgültige Name deiner Organization , falls zutreffend und von der name -Property verschieden.
 
 

 
 leiCode 
 Text 

 Die Kennung für deine Organization gemäß ISO 17442, falls zutreffend.
 Wir empfehlen, stattdessen das Feld iso6523Code mit dem Präfix 0199: zu verwenden.
 
 

 
 logo 
 URL oder ImageObject 

 Gegebenenfalls ein Logo, das Ihre Organisation repräsentiert. Wenn du diese Property hinzufügst, kann Google besser verstehen, welches Logo du anzeigen lassen möchtest, beispielsweise in den Suchergebnissen und in Knowledge Panels.

 Richtlinien für Bilder:

 
 
- Das Bild muss mindestens 112 × 112 Pixel groß sein. 
 
- Die Bild-URL muss crawlbar und indexierbar sein. 
 
- Das Bilddateiformat muss von Google Bilder unterstützt werden. 
 
- Achte darauf, dass das Bild auch so aussieht, wie es auf einem rein weißen Hintergrund aussehen soll. Wenn das Logo beispielsweise größtenteils weiß oder grau ist, sieht es eventuell nicht so aus, wie es auf einem weißen Hintergrund aussehen soll. 
 

 Wenn du den ImageObject -Typ verwendest, muss dieser eine gültige contentUrl - oder url -Property haben, die denselben Richtlinien wie ein URL -Typ entspricht.
 

 
 

 
 naics 
 Text 

 Der NAICS-Code (North American Industry Classification System) für deine Organization , falls zutreffend.
 
 

 
 name 
 Text 

 
 Der Name deiner Organisation. Verwende denselben name und alternateName wie für deinen Websitenamen .
 

 
 

 
 numberOfEmployees 
 QuantitativeValue 

 Die Anzahl der Mitarbeiter in deiner Organization , falls zutreffend.

 Beispiel mit einer bestimmten Anzahl von Mitarbeitern:

 
 "numberOfEmployees" : { 
 "@type" : "QuantitativeValue" , 
 "value" : 2056 
 } 
 
 Beispiel mit der Anzahl der Mitarbeiter in einem Bereich:

 
 "numberOfEmployees" : { 
 "@type" : "QuantitativeValue" , 
 "minValue" : 100 , 
 "maxValue" : 999 
 } 
 
 
 

 
 
 sameAs 
 
 
 URL 

 Die URL einer Seite auf einer anderen Website mit zusätzlichen Informationen zu deiner Organisation, falls zutreffend. Das kann beispielsweise eine URL zur Profilseite deiner Organisation in einem sozialen Netzwerk oder auf einer Rezensionswebsite sein. Du kannst mehrere sameAs -URLs angeben.
 

 
 

 
 
 taxID 
 
 Text 

 Die Steuernummer, die mit deiner Organization verknüpft ist, sofern zutreffend. Achte darauf, dass taxID mit dem Land übereinstimmt, das du im Feld address angegeben hast.
 
 

 
 
 telephone 
 
 
 Text 

 Gegebenenfalls eine geschäftliche Telefonnummer, die als primäre Kontaktmethode für Kunden vorgesehen ist.
 Gib in jedem Fall auch die Landes- und Ortsvorwahl an.

 
 

 
 
 url 
 
 URL 

 Die URL der Website deiner Organisation, falls zutreffend. Dies hilft Google, deine Organisation eindeutig zu identifizieren.

 
 

 
 
 vatID 
 
 Text 

 Der Umsatzsteuercode für deine Organization , sofern für dein Land und Unternehmen zutreffend. Dies ist ein wichtiges Vertrauenssignal für Nutzer (z. B. können Nutzer dein Unternehmen in öffentlichen Umsatzsteuerregistern nachschlagen).
 
 

 

 
 

# Fehlerbehebung

 
 Falls du Probleme bei der Implementierung oder Fehlerbehebung von strukturierten Daten hast, versuch es mit diesen Lösungsansätzen:
 

 
 
- Wenn du ein CMS (Content-Management-System) verwendest oder jemand anderes sich um deine Website kümmert, bitte diese Person oder den CMS-Support, dir zu helfen. Leite am besten alle Search Console-Nachrichten, in denen das Problem beschrieben ist, entsprechend weiter. 
 
- Google kann nicht garantieren, dass Funktionen, die strukturierte Daten nutzen, in den Suchergebnissen angezeigt werden.
 Eine Liste mit häufigen Gründen, aus denen Google deine Inhalte möglicherweise nicht in einem Rich-Suchergebnis anzeigt, findest du im Artikel Allgemeine Richtlinien für strukturierte Daten . 
 
- Möglicherweise sind deine strukturierten Daten fehlerhaft. Sehen Sie sich die Liste der Fehler bei strukturierten Daten und den Bericht zu strukturierten Daten, die nicht geparst werden können an. 
 
- Wenn auf deiner Seite eine manuelle Maßnahme gegen strukturierte Daten vorliegt, werden die strukturierten Daten auf der Seite ignoriert, obwohl die Seite weiter in den Ergebnissen der Google Suche erscheinen kann. Nutze den Bericht zu manuellen Maßnahmen , um Probleme mit strukturierten Daten zu beheben.
 
 
- Lies dir die Richtlinien noch einmal durch und prüfe, ob deine Inhalte den Richtlinien entsprechen. Das Problem kann durch Spaminhalte oder die Verwendung von Spam-Markup verursacht sein.
 Allerdings ist es auch möglich, dass das Problem kein Syntaxproblem ist und daher beim Test für Rich-Suchergebnisse nicht identifiziert werden kann.
 
 
- Lies dir den Abschnitt zur Fehlerbehebung bei fehlenden Rich-Suchergebnissen und bei Rückgang der Gesamtzahl der Rich-Suchergebnisse durch. 
 
- Räume genug Zeit für das erneute Crawling und die Neuindexierung ein. Nachdem eine Seite veröffentlicht wurde, kann es einige Tage dauern, bis sie von Google gefunden und gecrawlt wurde. Antworten auf allgemeine Fragen zum Crawlen und Indexieren erhältst du auf der Seite Häufig gestellte Fragen zum Crawling und zur Indexierung in der Google Suche .
 
 
- Oder du postest deine Frage im Forum von Google Search Central . 
 

 
 

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Feedback geben
