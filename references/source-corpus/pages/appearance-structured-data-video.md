---
url: https://developers.google.com/search/docs/appearance/structured-data/video
title: "Datos estructurados de video ( VideoObject , Clip , BroadcastEvent )"
fetched_at: 2026-05-16T16:53:20.954Z
seed: false
---

# Datos estructurados de video ( VideoObject , Clip , BroadcastEvent )

Source: https://developers.google.com/search/docs/appearance/structured-data/video

- 
 
 
 
 
 
 
 
 Página principal
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Enviar comentarios
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Datos estructurados de video ( VideoObject , Clip , BroadcastEvent )

 
 Si bien Google intenta entender automáticamente los detalles de tu video, puedes influir en la
 información que se muestra en los resultados de video, como la descripción, la URL de la miniatura, la fecha de carga y la duración, si marcas
 tu video con VideoObject . Agregar datos estructurados de video
 a tus páginas de reproducción también puede facilitar
 que Google encuentre tu video. Los videos pueden aparecer en diferentes ubicaciones en Google, como
 la página principal de resultados de búsqueda, los resultados de búsqueda de videos, Google Imágenes y
 Google Descubre :

 
 
 Según el lenguaje de marcado que uses en tu página de reproducción, los videos también podrían obtener las siguientes
 funciones específicas:

 
 Funciones de video 
 
 
 
 Insignia de transmisión EN VIVO : Agrega lenguaje de marcado de BroadcastEvent en tu video para obtener una insignia de transmisión EN VIVO. Esta insignia puede aplicarse a todos los videos públicos de cualquier duración que se transmitan en vivo. Estos son algunos ejemplos:

 
 
- Eventos deportivos 
 
- Ceremonias de premios 
 
- Videos de influencers 
 
- Transmisión en vivo de videojuegos 
 

 
 Asegúrate de seguir los Lineamientos para las insignias de transmisión EN VIVO y usar
 la API de Indexing para garantizar
 que Google rastree tus páginas en el momento indicado.
 

 
 
 
 
 

 
 
 
 Momentos clave 
 

 
 
 
 Con la función de momentos clave, los usuarios pueden navegar por segmentos de video como si fueran capítulos de un libro,
 lo que ayuda a que interactúen más con tu contenido. La Búsqueda de Google intenta detectar automáticamente
 los segmentos de tu video y mostrar a los usuarios los momentos clave, sin ningún esfuerzo de tu
 parte. Como alternativa, puedes indicarle a Google los momentos importantes de tu video. Priorizaremos
 los momentos clave que hayas definido, ya sea mediante datos estructurados o la descripción de YouTube.
 

 
 
- Si tu video está incorporado en tu página web o ejecutas una plataforma de video , tienes dos maneras de habilitar los momentos clave:
 
 
- Datos estructurados de Clip :
 Especifica el punto exacto de inicio y de finalización en cada segmento, además de indicar la etiqueta que debe mostrarse para cada
 uno de ellos. Se encuentra disponible en todos los idiomas en los que se admite la Búsqueda de Google. 
 
- Datos estructurados de SeekToAction :
 Indícale a Google dónde suelen ir las marcas de tiempo de la estructura de tu URL, de modo que Google pueda
 identificar automáticamente los momentos clave y vincular a los usuarios con esos puntos dentro del video Se
 encuentra disponible para los siguientes idiomas: inglés, español, portugués, italiano, chino,
 francés, japonés, alemán, turco, coreano, holandés y ruso.
 
 

 
 
- Si tu video se aloja en YouTube , puedes especificar las marcas de tiempo y etiquetas
 exactas en la descripción. Consulta las
 prácticas recomendadas para incluir marcas de tiempo en las descripciones de YouTube .
 Se encuentra disponible en todos los idiomas en los que se admite la Búsqueda de Google. Si deseas habilitar
 los capítulos de videos en YouTube, sigue estos
 lineamientos adicionales .
 
 

 Si quieres inhabilitar por completo la función de momentos clave (incluida la opción para que Google muestre
 momentos clave de tu video automáticamente), usa
 la etiqueta nosnippet meta .
 

 
 
 
 
 
 

 

 
 

# 
 Cómo agregar datos estructurados
 

 
 Los datos estructurados son un formato estandarizado para proporcionar información sobre una página y clasificar su contenido. Si aún no estás familiarizado con los datos estructurados, obtén más información sobre su funcionamiento .
 

 
 A continuación, presentamos una descripción general para aprender a compilar, probar y actualizar datos estructurados.

 
 
- Agrega las propiedades obligatorias . Según el formato que uses, obtén información sobre las ubicaciones donde puedes insertar datos estructurados en la página .
 
 ¿Usas un CMS? Es posible que sea más fácil usar un complemento integrado en el CMS.
 

 ¿Usas JavaScript? Descubre cómo generar datos estructurados con JavaScript .

 
 
- Sigue los lineamientos . 
 
- Valida tu código con la Prueba de resultados enriquecidos y corrige cualquier error crítico. Procura también corregir los problemas no críticos que puedan marcarse en la herramienta, ya que pueden ayudar a mejorar la calidad de los datos estructurados (sin embargo, esto no es necesario para que se muestren los resultados enriquecidos). 
 
- Implementa algunas páginas que incluyan tus datos estructurados y utiliza la Herramienta de inspección de URLs para probar el modo en el que Google ve la página. Asegúrate de que Google pueda acceder a la página y que no esté bloqueada por un archivo robots.txt, una etiqueta noindex ni requisitos de acceso. Si la página se ve bien, puedes pedirle a Google que vuelva a rastrear tus URLs . Nota : Espera el tiempo suficiente para que se vuelvan a realizar el rastreo y la indexación. No olvides que pueden transcurrir varios días después de publicar una página para que Google la encuentre y la rastree.

 
 
- Para mantener informado a Google sobre los cambios futuros, te recomendamos que envíes un mapa del sitio . Puedes automatizar este proceso con la API de Search Console Sitemap . 
 

 
 

# Ejemplos

# 
 Resultado de video estándar

 
 Este es un ejemplo de un VideoObject .

 
 
 JSON-LD 
 <html>
 <head>
 <title>Introducing the self-driving bicycle in the Netherlands</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "VideoObject",
 "name": "Introducing the self-driving bicycle in the Netherlands",
 "description": "This spring, Google is introducing the self-driving bicycle in Amsterdam, the world's premier cycling city. The Dutch cycle more than any other nation in the world, almost 900 kilometres per year per person, amounting to over 15 billion kilometres annually. The self-driving bicycle enables safe navigation through the city for Amsterdam residents, and furthers Google's ambition to improve urban mobility with technology. Google Netherlands takes enormous pride in the fact that a Dutch team worked on this innovation that will have great impact in their home country.",
 "thumbnailUrl": [
 "https://example.com/photos/1x1/photo.jpg",
 "https://example.com/photos/4x3/photo.jpg",
 "https://example.com/photos/16x9/photo.jpg"
 ],
 "uploadDate": "2024-03-31T08:00:00+08:00",
 "duration": "PT1M54S",
 "contentUrl": "https://www.example.com/video/123/file.mp4",
 "embedUrl": "https://www.example.com/embed/123",
 "interactionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": { "@type": "WatchAction" },
 "userInteractionCount": 5647018
 },
 "regionsAllowed": ["US", "NL"]
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Introducing the self-driving bicycle in the Netherlands</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "VideoObject",
 "name": "Introducing the self-driving bicycle in the Netherlands",
 "description": "This spring, Google is introducing the self-driving bicycle in Amsterdam, the world's premier cycling city. The Dutch cycle more than any other nation in the world, almost 900 kilometres per year per person, amounting to over 15 billion kilometres annually. The self-driving bicycle enables safe navigation through the city for Amsterdam residents, and furthers Google's ambition to improve urban mobility with technology. Google Netherlands takes enormous pride in the fact that a Dutch team worked on this innovation that will have great impact in their home country.",
 "thumbnailUrl": [
 "https://example.com/photos/1x1/photo.jpg",
 "https://example.com/photos/4x3/photo.jpg",
 "https://example.com/photos/16x9/photo.jpg"
 ],
 "uploadDate": "2024-03-31T08:00:00+08:00",
 "duration": "PT1M54S",
 "contentUrl": "https://www.example.com/video/123/file.mp4",
 "embedUrl": "https://www.example.com/embed/123",
 "interactionStatistic": {
 "@type": "InteractionCounter",
 "interactionType": { "@type": "WatchAction" },
 "userInteractionCount": 5647018
 },
 "regionsAllowed": ["US", "NL"]
 }
 </script>
 </head>
 <body>
 </body>
</html>
