---
url: https://developers.google.com/search/docs/crawling-indexing/robots/intro
title: "Introducción a robots.txt"
fetched_at: 2026-05-16T16:52:32.290Z
seed: false
---

# Introducción a robots.txt

Source: https://developers.google.com/search/docs/crawling-indexing/robots/intro

- 
 
 
 
 
 
 
 
 Página principal
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Enviar comentarios
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Introducción a robots.txt

 
 
 
 

 
 El archivo robots.txt les indica a los rastreadores de motores de búsqueda a qué URL pueden acceder en tu sitio.
 Su principal propósito es evitar la sobrecarga de solicitudes para tu sitio; no se trata de un mecanismo para mantener una página web fuera de Google . Si deseas mantener una página web fuera de Google, bloquea la indexación con noindex o protege la página con una contraseña.

 
 
 Es posible que, si usas un CMS, como Wix o Blogger , no necesites editar directamente el archivo robots.txt (ni puedas hacerlo). En su lugar, tu CMS podría exponer una página de parámetros de configuración de búsqueda o algún otro mecanismo para indicarles a los motores de búsqueda si deben rastrear tu página o no.
 

 Si quieres ocultar o mostrar una de tus páginas para los motores de búsqueda, consulta las instrucciones para modificar la visibilidad de esta página en los motores de búsqueda en tu CMS (por ejemplo, busca "ocultar página de los motores de búsqueda para Wix").

# ¿Para qué se usa el archivo robots.txt?

 
 Un archivo robots.txt se usa principalmente para administrar el tráfico del rastreador a tu sitio y, normalmente , para mantener un archivo fuera de Google, según el tipo de archivo:

 
 
 
 Efecto de robots.txt en diferentes tipos de archivo 
 

 
 
 
 Página web 
 
 
 En el caso de páginas web (HTML, PDF y otros
 formatos no multimedia que Google puede leer ),
 puedes usar un archivo robots.txt para administrar el tráfico de rastreo si crees que tu servidor se verá saturado de solicitudes
 del rastreador de Google, o bien para evitar el rastreo de páginas irrelevantes o similares de tu sitio.
 

 
 
 Advertencia : No uses un archivo robots.txt para ocultar tus páginas web
 (incluidos el formato PDF y otros formatos basados en texto compatibles con Google) de los resultados
de la Búsqueda de Google.
 

 
 Si otras páginas dirigen a la tuya con texto descriptivo, Google podría indexar la URL de todas formas sin visitar la página. Para bloquear tu página de los resultados
de la Búsqueda, usa otro método, como la protección por contraseña o el parámetro
 noindex .
 

 

 
 La URL puede aparecer en los resultados de la Búsqueda incluso si tu página web está bloqueada por un archivo robots.txt . Sin embargo,
 el resultado correspondiente
 no tendrá una descripción .
 También se excluirán del rastreo los archivos de imagen, de video, los PDF y otros archivos que no sean HTML incorporados en la página bloqueada,
 a menos que se haga referencia a ellos en otras páginas que permitan
 el rastreo. Si ves este resultado de la búsqueda para tu página y quieres corregirlo, quita la entrada robots.txt que bloquea la página. Si quieres ocultar por completo la página de la Búsqueda, usa otro método .
 

 
 

 
 Archivo multimedia 
 
 
 Usa un archivo robots.txt para administrar el tráfico de rastreo e impedir que aparezcan archivos de imagen, video y
 audio en los resultados de la Búsqueda de Google. Esta acción no impedirá que otras páginas o
 usuarios creen vínculos a tu archivo de imagen, audio o video.
 

 
 
- 
 Obtén más información para impedir que aparezcan imágenes en Google. 
 
 
- 
 Obtén más información para quitar o restringir la publicación de archivos de video en Google .
 
 

 
 

 
 Archivo de recurso 
 
 Puedes usar un archivo robots.txt para bloquear archivos de recursos, como los de imágenes, estilo
 o secuencias de comandos irrelevantes, si crees que
 no se verán perjudicadas las páginas que se carguen sin esos recursos . Sin embargo, si el rastreador de Google
 tiene dificultades para comprender la página debido a la ausencia de estos recursos, no los bloquees,
 ya que Google no analizará correctamente las páginas que dependan
 de ellos.
 
 

 

# Comprende las limitaciones de un archivo robots.txt

 
 Para poder crear o editar un archivo robots.txt, debes conocer los límites de este método de bloqueo de URL. Según tus objetivos y situación, puedes usar otros mecanismos para asegurarte de que no se puedan encontrar tus URLs en la Web.

 
 
- 
 Es posible que las reglas de robots.txt no sean compatibles con todos los motores de búsqueda. 

Las instrucciones de los archivos robots.txt no pueden forzar comportamientos del rastreador en relación con tu sitio; le corresponde al rastreador determinar si obedecerlas o no. Si bien Googlebot y otros rastreadores web confiables obedecen las instrucciones de los archivos robots.txt, otros podrían no hacerlo. Por lo tanto, para ocultarles información a los rastreadores web, te recomendamos que uses otros métodos de bloqueo, como proteger archivos privados con una contraseña en tu servidor .
 
 
- 
 Los distintos rastreadores interpretan la sintaxis de manera diferente. 

Aunque los rastreadores web confiables siguen las reglas de los archivos robots.txt, cada rastreador puede interpretarlas de manera diferente. Debes conocer la sintaxis indicada para comunicarte con los diferentes rastreadores web, ya que algunos podrían no comprender determinadas instrucciones.
 
 
- 
 Una página no permitida en robots.txt puede indexarse igualmente si hay vínculos a ella desde otros sitios. 

 Aunque Google no rastrea ni indexa el contenido bloqueado por robots.txt,
 puede encontrar y también indexar una URL inhabilitada si está vinculada desde otros sitios en la Web. Como resultado,
 la dirección de la URL y, potencialmente, otra información disponible de modo público (como texto de anclaje
 en vínculos a la página) aún podrían aparecer en los resultados de la Búsqueda de Google. Para impedir que tu URL
 aparezca en los resultados de la Búsqueda de Google,
 protege los archivos de tu servidor con una contraseña ,
 usa la etiqueta noindex meta o un encabezado de respuesta ,
 o bien quita por completo la página.
 

 
 Precaución : Combinar varias reglas de indexación y rastreo podría generar
 conflictos entre ellas. Aprende a combinar el rastreo con reglas de indexación y publicación .

# Crea o actualiza un archivo robots.txt

 
 Si decidiste que lo necesitas, obtén información para crear un archivo robots.txt . O bien, si ya tienes uno, obtén información para actualizarlo .

 
 
 ¿Quieres obtener más información? Consulta los siguientes recursos:
 

 
 
- 
 Cómo escribir y enviar un archivo robots.txt 
 
 
- 
 Cómo actualizar el archivo robots.txt 
 
 
- 
 Interpretación de Google de la especificación de robots.txt 
 
 

 

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Enviar comentarios
