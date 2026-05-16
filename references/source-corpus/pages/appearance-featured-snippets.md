---
url: https://developers.google.com/search/docs/appearance/featured-snippets
title: "Hervorgehobene Snippets und deine Website"
fetched_at: 2026-05-16T16:52:49.595Z
seed: false
---

# Hervorgehobene Snippets und deine Website

Source: https://developers.google.com/search/docs/appearance/featured-snippets

- 
 
 
 
 
 
 
 
 Startseite
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Feedback geben
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Hervorgehobene Snippets und deine Website

 
 Hervorgehobene Snippets sind Sonderfelder, bei denen das Format regulärer Suchergebnisse umgekehrt wird, d. h., das beschreibende Snippet wird zuerst angezeigt. Sie können auch in Gruppen mit ähnlichen Fragen angezeigt werden (auch bekannt als „Ähnliche Fragen“).
 Weitere Informationen zur Funktionsweise hervorgehobener Snippets 

 
 Abbildung eines hervorgehobenen Snippets in Suchergebnissen 
 
 
 7–10 Minuten

 
 
 Wie macht man ein hartgekochtes Ei? 

 
 

# Wie kann ich hervorgehobene Snippets deaktivieren?

 Es gibt zwei Möglichkeiten, um hervorgehobene Snippets zu deaktivieren: 

 
 
- Sowohl hervorgehobene als auch reguläre Such-Snippets blockieren 
 
- Nur hervorgehobene Snippets blockieren 

# Alle Snippets blockieren

 Wenn du verhindern möchtest, dass Snippets (einschließlich hervorgehobener Snippets und regulärer Snippets) auf einer bestimmten Seite angezeigt werden, musst du der Seite die nosnippet -Regel hinzufügen.

 
 
- Text, der durch das HTML-Attribut data-nosnippet gekennzeichnet ist, erscheint weder in hervorgehobenen Snippets noch in regulären Snippets. 
 
- Wenn sowohl nosnippet - als auch data-nosnippet -Regeln auf einer Seite vorkommen, hat nosnippet Priorität und es werden keine Snippets für die Seite angezeigt. 

# Nur hervorgehobene Snippets blockieren

 Wenn du möchtest, dass Snippets weiterhin in regulär formatierten Suchergebnissen, jedoch nicht in hervorgehobenen Snippets erscheinen, kannst du versuchen, die max-snippet -Regel auf kleinere Werte festzulegen. Hervorgehobene Snippets werden nur dann angezeigt, wenn genug Text zur Verfügung steht, um ein hilfreiches hervorgehobenes Snippet zu erzeugen.

 Senke den Wert immer etwas weiter, wenn die Seiten weiterhin für hervorgehobene Snippets angezeigt werden. Je kleiner der Wert der max-snippet -Regel ist, desto geringer ist die Wahrscheinlichkeit, dass die Seite als hervorgehobenes Snippet erscheint.

 Google gibt keinen genauen Mindestwert vor, ab dem Seiten für hervorgehobene Snippets berücksichtigt werden.
 Der Grund dafür ist, dass die Mindestlänge auf einer Reihe von Faktoren basiert. Zu diesen gehören unter anderem die Informationen im Snippet, die Sprache und die Plattform (mobiler Browser, App oder Desktop-Browser).

 
 Ein niedriger Wert für max-snippet ist keine Garantie dafür, dass Google keine hervorgehobenen Snippets mehr für deine Seite anzeigt. Wenn du also sichergehen möchtest, verwende die nosnippet -Regel.

# Wie kann ich meine Seite als hervorgehobenes Snippet kennzeichnen?

 Das ist nicht möglich. Die Google-Systeme legen fest, ob eine Seite als hervorgehobenes Snippet für die Suchanfrage eines Nutzers geeignet ist, und platzieren es gegebenenfalls weiter oben in den Suchergebnissen.

# Was passiert, wenn ein Nutzer auf ein hervorgehobenes Snippet klickt?

 Durch Klicken auf ein hervorgehobenes Snippet gelangt der Nutzer direkt zum Abschnitt der Seite
 in diesem Snippet. Es wird automatisch zur Position des Snippets gescrollt,
 ohne dass die Website weitere Anmerkungen enthält. Wenn ein Browser
 die zugrundeliegende Technologie nicht unterstützt oder unsere Systeme nicht zweifelsfrei bestimmen können,
 wohin ein Klick auf einer Seite weitergeleitet werden soll, landet der Nutzer nach dem Anklicken eines hervorgehobenes Snippets ganz oben auf der
 Quellwebseite.

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Feedback geben
