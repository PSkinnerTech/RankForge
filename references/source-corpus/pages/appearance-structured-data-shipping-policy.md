---
url: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy
title: "Datos estructurados de política de envío de comerciantes ( ShippingService )"
fetched_at: 2026-05-16T16:53:18.193Z
seed: false
---

# Datos estructurados de política de envío de comerciantes ( ShippingService )

Source: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy

- 
 
 
 
 
 
 
 
 Página principal
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Enviar comentarios
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Datos estructurados de política de envío de comerciantes ( ShippingService )

 

 
 
 Muchos comerciantes tienen políticas de envío que describen el proceso de envío de los productos comprados por los clientes.
 Si añades datos estructurados de ShippingService a tu sitio, la Búsqueda de Google podrá usar esta información para mostrar información de envío junto a tus productos y en los paneles de información de los resultados de búsqueda.
 ShippingService te permite especificar detalles como los gastos de envío y los plazos de entrega en función de las características del producto, como su peso, sus dimensiones o la ubicación de entrega.

 
 Puedes especificar una política de envío estándar para tu empresa, que se aplique a la mayoría o a todos los productos que vendas, mediante el tipo de datos estructurados ShippingService anidado en el tipo de datos estructurados Organization con la propiedad hasShippingService .

 
 Si necesitas anular tu política de envíos estándar para un producto concreto, especifica una o varias instancias del tipo OfferShippingDetails , que está anidado en el tipo Offer mediante la propiedad shippingDetails . Para obtener más información sobre las políticas de envío de productos concretos, consulta la documentación sobre la ficha de tienda . Las políticas de envío de productos concretos especificadas en Offer admiten un conjunto de propiedades más limitado que las que se describen aquí para las políticas de envío especificadas en Organization .

 
 

# 
 Cómo añadir datos estructurados
 

 
 Los datos estructurados son un formato estandarizado con el que se puede proporcionar información sobre una página y clasificar su contenido. Consulta cómo funcionan los datos estructurados si aún no te has familiarizado con ellos.
 

 
 A continuación se explica a grandes rasgos cómo crear, probar y publicar datos estructurados.

 
 
- Añade las propiedades obligatorias . Consulta más información sobre dónde insertar datos estructurados en una página en función del formato que estés utilizando.
 
 ¿Usas un CMS? Quizá sea más fácil que uses un complemento que esté integrado en tu CMS.
 

 ¿Usas JavaScript? Consulta cómo generar datos estructurados con JavaScript .

 
 
- Sigue las directrices . 
 
- Valida tu código con la prueba de resultados enriquecidos y corrige los errores críticos. Te recomendamos que también corrijas los problemas no críticos que puedan marcarse en la herramienta, ya que pueden ayudar a mejorar la calidad de los datos estructurados (sin embargo, esto no es necesario para que se muestren los resultados enriquecidos). 
 
- Crea varias páginas que incluyan tus datos estructurados y comprueba cómo las ve Google con la herramienta de inspección de URLs . Asegúrate de que Google pueda acceder a tu página y de que no esté bloqueada por un archivo robots.txt, por la etiqueta noindex ni por requisitos de inicio de sesión. Si la página se ve bien, puedes solicitar que Google vuelva a rastrear tus URLs . Nota: Da cierto margen de tiempo a Google para que vuelva a rastrear e indexar tus páginas. Recuerda que Google puede tardar varios días en encontrar y rastrear una página después de publicarse.

 
 
- Para que Google siempre tenga la versión actualizada de tus páginas, te recomendamos que envíes un sitemap . Puedes automatizar este envío con la API Sitemap de Search Console . 
 

 
 

# Ejemplos

 En este ejemplo se muestra que, en Estados Unidos y Canadá, el envío en dos días es gratuito para los pedidos superiores a 29,99 USD. De lo contrario, el envío en tres días cuesta 3,49 USD. En México, no se envían pedidos de menos de 50 USD. De lo contrario, el envío tarda 4 días y tiene un coste del 10 %.

 <html>
 <head>
 <title>Our shipping policy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "https://schema.org/Organization",
 "hasShippingService": {
 "@type": "ShippingService",
 "@id": "#us_ca_mx_standard_shipping",
 "name": "Standard shipping policies for US, Canada and Mexico",
 "description": "US and Canada: Free 2-day shipping for orders over $29.99,
 otherwise 3-day shipping for $3.49.
 Mexico: No shipping to Mexico for orders under $50,
 otherwise 10% shipping cost and 4-day shipping.",
 "fulfillmentType": "FulfillmentTypeDelivery",
 "handlingTime": {
 "@type": "ServicePeriod",
 "cutoffTime": "14:30:00-07:00",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 0,
 "maxValue": 1,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday"
 ]
 },
 "shippingConditions": [
 {
 "@type": "ShippingConditions",
 "shippingDestination": [
 {
 "@type": "DefinedRegion",
 "addressCountry": "US"
 },
 {
 "@type": "DefinedRegion",
 "addressCountry": "CA"
 }
 ],
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 0,
 "maxValue": 29.99,
 "currency": "USD"
 },
 "shippingRate": {
 "@type": "MonetaryAmount",
 "value": 3.49,
 "currency": "USD"
 },
 "transitTime": {
 "@type": "ServicePeriod",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 1,
 "maxValue": 2,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
 ]
 }
 },
 {
 "@type": "ShippingConditions",
 "shippingDestination": [
 {
 "@type": "DefinedRegion",
 "addressCountry": "US"
 },
 {
 "@type": "DefinedRegion",
 "addressCountry": "CA"
 }
 ],
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 30,
 "currency": "USD"
 },
 "shippingRate": {
 "@type": "MonetaryAmount",
 "value": 0,
 "currency": "USD"
 },
 "transitTime": {
 "@type": "ServicePeriod",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 1,
 "maxValue": 1,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
 ]
 }
 },
 {
 "@type": "ShippingConditions",
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "MX"
 },
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 0,
 "maxValue": 49.99,
 "currency": "USD"
 },
 "doesNotShip": true
 },
 {
 "@type": "ShippingConditions",
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "MX"
 },
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 50,
 "currency": "USD"
 },
 "shippingRate": {
 "@type": "ShippingRateSettings",
 "orderPercentage": 0.10
 },
 "transitTime": {
 "@type": "ServicePeriod",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 2,
 "maxValue": 3,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
 ]
 }
 }
 ]
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
 <title>Our shipping policy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "https://schema.org/Organization",
 "hasShippingService": {
 "@type": "ShippingService",
 "@id": "#us_ca_mx_standard_shipping",
 "name": "Standard shipping policies for US, Canada and Mexico",
 "description": "US and Canada: Free 2-day shipping for orders over $29.99,
 otherwise 3-day shipping for $3.49.
 Mexico: No shipping to Mexico for orders under $50,
 otherwise 10% shipping cost and 4-day shipping.",
 "fulfillmentType": "FulfillmentTypeDelivery",
 "handlingTime": {
 "@type": "ServicePeriod",
 "cutoffTime": "14:30:00-07:00",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 0,
 "maxValue": 1,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday"
 ]
 },
 "shippingConditions": [
 {
 "@type": "ShippingConditions",
 "shippingDestination": [
 {
 "@type": "DefinedRegion",
 "addressCountry": "US"
 },
 {
 "@type": "DefinedRegion",
 "addressCountry": "CA"
 }
 ],
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 0,
 "maxValue": 29.99,
 "currency": "USD"
 },
 "shippingRate": {
 "@type": "MonetaryAmount",
 "value": 3.49,
 "currency": "USD"
 },
 "transitTime": {
 "@type": "ServicePeriod",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 1,
 "maxValue": 2,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
 ]
 }
 },
 {
 "@type": "ShippingConditions",
 "shippingDestination": [
 {
 "@type": "DefinedRegion",
 "addressCountry": "US"
 },
 {
 "@type": "DefinedRegion",
 "addressCountry": "CA"
 }
 ],
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 30,
 "currency": "USD"
 },
 "shippingRate": {
 "@type": "MonetaryAmount",
 "value": 0,
 "currency": "USD"
 },
 "transitTime": {
 "@type": "ServicePeriod",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 1,
 "maxValue": 1,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
 ]
 }
 },
 {
 "@type": "ShippingConditions",
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "MX"
 },
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 0,
 "maxValue": 49.99,
 "currency": "USD"
 },
 "doesNotShip": true
 },
 {
 "@type": "ShippingConditions",
 "shippingDestination": {
 "@type": "DefinedRegion",
 "addressCountry": "MX"
 },
 "orderValue": {
 "@type": "MonetaryAmount",
 "minValue": 50,
 "currency": "USD"
 },
 "shippingRate": {
 "@type": "ShippingRateSettings",
 "orderPercentage": 0.10
 },
 "transitTime": {
 "@type": "ServicePeriod",
 "duration": {
 "@type": "QuantitativeValue",
 "minValue": 2,
 "maxValue": 3,
 "unitCode": "DAY"
 },
 "businessDays": [
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
 ]
 }
 }
 ]
 }
 // Other Organization-level properties
 // ...
 }
 </script>
 </head>
 <body>
 </body>
</html>
 

# Directrices

 Para que el marcado de tu política de envío se pueda usar en la Búsqueda de Google, debes seguir estas directrices:

 
 
- Directrices generales sobre datos estructurados 
 
- Directrices básicas de la Búsqueda 
 
- Directrices técnicas 

# Directrices técnicas

 

- 
 Te recomendamos que coloques la información sobre la política de envíos en una única página de tu sitio que describa la política de envíos de tu empresa. No hace falta que la incluyas en todas las páginas de tu sitio. Incluye el tipo de datos estructurados ShippingService en el tipo de datos estructurados Organization . Para obtener más información, consulta el artículo sobre las etiquetas de organizaciones .
 

- 
 Si tienes una política de envío no estándar para un producto concreto, especifica el tipo de datos estructurados OfferShippingDetails en el tipo de datos estructurados Offer . Ten en cuenta que las propiedades admitidas en las políticas de envío a nivel de producto son un subconjunto de las propiedades admitidas en las políticas de envío a nivel de organización.
 Consulta el marcado de fichas de tienda para ver el subconjunto de propiedades que admiten políticas de envío a nivel de producto.
 

# Definiciones de tipos de datos estructurados

 Debes incluir las propiedades obligatorias para que tus datos estructurados se puedan usar en la Búsqueda de Google. También puedes incluir las propiedades recomendadas para añadir más información sobre tus políticas de envío, lo que puede ayudar a mejorar la experiencia de usuario.

 

# ShippingService (anidada en Organization mediante la propiedad hasShippingService )

 Utiliza las siguientes propiedades para describir los servicios de envío estándar de tu empresa.
 
 
 Propiedades obligatorias 
 
 
 
 shippingConditions 
 
 ShippingConditions 

 
 Especifica los gastos de envío o los plazos de entrega que se aplican a un conjunto de condiciones concreto, como el intervalo de peso de un producto, las dimensiones del producto, el valor del pedido o la ubicación de entrega. Un elemento ShippingService puede tener varios shippingConditions . Si se aplica más de un ShippingConditions a un producto, usaremos los gastos de envío más bajos para el producto en una situación determinada y mostraremos esa tarifa y el tiempo de envío correspondiente a los clientes. Si los gastos de envío son los mismos, utilizaremos la información de envío con el tiempo de envío más rápido.
 

 
 

 
 

 
 
 Propiedades recomendadas 
 
 
 
 name 
 
 
 Text 
 

 Un nombre único para tu servicio de envío, si procede. Por ejemplo, "Envío estándar".

 
 

 
 description 
 
 
 Text 
 

 Una descripción de tu servicio de envío, si procede. Normalmente, es más completo que el nombre.

 
 

 
 fulfillmentType 
 
 FulfillmentTypeEnumeration 

 Cómo se entrega el producto al cliente para este servicio de envío, si procede.

 
 
- https://schema.org/FulfillmentTypeDelivery : este servicio envía el producto a la dirección del cliente (es el valor predeterminado si no se especifica esta propiedad). 
 
- https://schema.org/FulfillmentTypeCollectionPoint : el producto se envía a un punto de recogida para que el cliente lo recoja. 
 

 
 

 
 handlingTime 
 
 ServicePeriod 

 Información opcional sobre los tiempos de gestión (por ejemplo, en un almacén) después de recibir un pedido, si procede.

 Consulta también la lista de propiedades ServicePeriod del tipo ShippingService admitidas por Google. 

 
 

 
 validForMemberTier 
 
 
 MemberProgramTier 
 

 
 El programa de fidelización y el nivel para los que es válido este servicio de envío, si procede.
 Puedes especificar varios niveles de miembros si los ajustes de envío son los mismos para todos ellos.
 

 
 Si utilizas la propiedad validForMemberTier para indicar las ventajas de envío para miembros, también debes proporcionar al menos un servicio de envío normal (para usuarios que no sean miembros).
 

 
 Los programas y niveles de fidelización que ofrezcas para tu empresa pueden definirse en tu cuenta de Merchant Center o mediante el tipo de datos estructurados MemberProgram anidado en los datos estructurados Organization de una página independiente que defina los detalles administrativos y las políticas de tu organización. Consulta el marcado de programas de fidelización para obtener información sobre cómo definir los programas y los niveles de miembros de tu organización.
 

 A continuación, se muestra un ejemplo de la propiedad validForMemberTier que hace referencia a un programa ( member-plus ) y un nivel ( silver ) de miembro definidos en Merchant Center:
 

 
 "validForMemberTier" : { 
 "@type" : "MemberProgramTier" , 
 "name" : "silver" , 
 "isTierOf" : { 
 "@type" : "MemberProgram" , 
 "name" : "member-plus" 
 } 
 } 
 
 A continuación se muestra un ejemplo de la propiedad validForMemberTier que hace referencia a datos estructurados MemberProgramTier anidados en datos estructurados MemberProgram , que a su vez están anidados en un tipo de datos estructurados Organization en una página independiente. La instancia MemberProgramTier se identifica mediante la propiedad @id , que especifica el identificador de recurso único (URI) de su definición:
 https://www.example.com/com/member-plus#tier_silver :
 

 
 "validForMemberTier" : { 
 "@id" : "https://www.example.com/com/member-plus#tier_silver" 
 } 
 
 
 Esta propiedad aún está en versión beta. Es posible que los datos estructurados MemberProgramTier externos no aparezcan en la Búsqueda de Google de inmediato.
 

 
 

 
 

 

# ServicePeriod (para tiempos de preparación)

 
 El tipo ServicePeriod también se usa para especificar los tiempos de transporte. Cuando especifiques los tiempos de transporte, no utilices la propiedad cutoffTime . Para obtener más información, consulta ServicePeriod para los tiempos de tránsito .
 

 
 Para especificar los tiempos de preparación del envío, utiliza el tipo ServicePeriod .
 

 A continuación, se muestra un ejemplo de un tipo ServicePeriod en el que los pedidos se procesan de lunes a viernes, con una hora límite de las 22:30 (hora estándar del este). La duración del tiempo de preparación es de entre 0 y 2 días. Si el tiempo de preparación es 0, significa que los pedidos se procesan el mismo día si se reciben antes de la hora límite.
 

 
 "handlingTime" : { 
 "@type" : "ServicePeriod" , 
 "businessDays" : [ 
 "https://schema.org/Monday" , 
 "https://schema.org/Tuesday" , 
 "https://schema.org/Wednesday" , 
 "https://schema.org/Thursday" , 
 "https://schema.org/Friday" 
 ], 
 "cutoffTime" : "22:30:00-05:00" , 
 "duration" : { 
 "@type" : "QuantitativeValue" , 
 "minValue" : 0 , 
 "maxValue" : 2 , 
 "unitCode" : "DAY" 
 } 
 } 
 
 
 
 Propiedades recomendadas 
 
 
 
 businessDays 
 
 DayOfWeek 

 Los días de la semana en los que se tramitan los pedidos recibidos, si procede.

 
 

 
 cutoffTime 
 
 Time 

 La hora a partir de la cual no se procesan los pedidos recibidos en un día, si procede.
 En el caso de los pedidos procesados después de la hora tope, se añade un día al tiempo de entrega estimado.
 La hora se indica con el formato de hora ISO 8601. Por ejemplo, "23:30:00-05:00" representa las 18:30 (EST), que es 5 horas menos que el tiempo universal coordinado (UTC).

 
 

 
 duration 
 
 QuantitativeValue 

 El tiempo que transcurre entre la recepción de un pedido y el momento en que los productos salen del almacén, si procede.

 
 

 
 

 

# QuantitativeValue (para tiempos de preparación del envío)

 
 Use el tipo QuantitativeValue para representar los tiempos de preparación de pedidos mínimos y máximos.
 Debes proporcionar value (para indicar un tiempo de preparación fijo) o maxValue (para indicar un límite superior del tiempo de preparación) junto con unitCode . minValue se puede proporcionar de forma opcional para especificar un límite inferior del tiempo de preparación.
 

 
 
 Propiedades recomendadas 
 
 
 
 maxValue 
 
 Number 

 El número máximo de días. El valor debe ser un número entero no negativo.

 
 

 
 minValue 
 
 Number 

 El número mínimo de días, si procede. El valor debe ser un número entero no negativo.

 
 

 
 unitCode 
 
 Text 

 Unidades de los valores mínimo y máximo. El valor debe ser DAY o d .

 
 

 
 value 
 
 Number 

 El número exacto de días de preparación, si se conoce. El valor debe ser un número entero no negativo.
 Si se proporciona, no se deben especificar minValue ni maxValue .
 

 
 

 
 

 

# ShippingConditions (anidada en ShippingService mediante la propiedad shippingConditions )

 Utiliza las siguientes propiedades para describir las condiciones, los costes y los tiempos de transporte asociados a un servicio de envío.

 Si no se especifica ningún destino de envío, las condiciones de envío se aplican a todos los destinos de envío del mundo.

 
 
 Propiedades recomendadas 
 
 
 
 doesNotShip 
 
 Boolean 

 Si procede, asigna el valor true si el envío desde una ubicación del shippingOrigin especificado a una ubicación del shippingDestination especificado no está disponible para los pedidos con la combinación especificada de condiciones weight , numItems y orderValue .

 
 

 
 numItems 
 
 QuantitativeValue 

 El intervalo del número de productos del pedido de este objeto ShippingConditions, si procede.
 Consulta también la lista de propiedades QuantitativeValue relacionadas con el tipo ShippingConditions admitidas por Google.

 
 

 
 orderValue 
 
 MonetaryAmount 

 El intervalo del coste del pedido de este objeto ShippingConditions, si procede.
 Consulta también la lista de propiedades MonetaryAmount relacionadas con el tipo ShippingConditions admitidas por Google.

 
 

 
 shippingDestination 
 
 
 DefinedRegion 
 

 Indica el destino de envío, si procede. Consulta la lista de propiedades DefinedRegion de shippingDestination admitidas por Google.

 
 

 
 shippingOrigin 
 
 
 DefinedRegion 
 

 Indica el origen del envío, si procede. Consulta la lista de propiedades DefinedRegion de shippingOrigin admitidas por Google.

 
 

 
 seasonalOverride 
 
 OpeningHoursSpecification 

 Si procede, utiliza esta propiedad para especificar un periodo limitado durante el cual sea válido este objeto de condiciones de envío.
 Consulta también la lista de propiedades OpeningHoursSpecification admitidas para el tipo ShippingConditions por Google.

 

 
 

 
 shippingRate 
 
 ShippingRateSettings o MonetaryAmount 
 

 Si procede, utiliza esta propiedad para especificar los gastos de envío de los envíos desde una ubicación del shippingOrigin especificado hasta una ubicación del shippingDestination especificado en los pedidos que cumplan la combinación especificada de condiciones weight , numItems y orderValue .
 Consulta también la lista de propiedades ShippingRateSettings y MonetaryAmount admitidas para el tipo ShippingConditions por Google. Esta propiedad solo se debe especificar si doesNotShip no está presente o se le asigna el valor false .

 

 
 

 
 transitTime 
 
 ServicePeriod 

 Si procede, úsalo para especificar el tiempo de transporte previsto entre la salida del origen del envío (normalmente, un almacén) y la llegada al destino del envío (normalmente, el cliente). Se aplica a los envíos desde una ubicación de la propiedad shippingOrigin especificada hasta una ubicación de la propiedad shippingDestination especificada en pedidos con la combinación especificada de condiciones weight , numItems y orderValue .
 Consulta también la lista de propiedades ServicePeriod admitidas por Google. Esta propiedad solo se debe especificar si la propiedad doesNotShip no está presente o se le asigna el valor false .

 

 
 

 
 weight 
 
 QuantitativeValue 

 El intervalo de peso del paquete de este objeto ShippingConditions, si procede.
 Consulta también la lista de propiedades QuantitativeValue relacionadas con el tipo ShippingConditions admitidas por Google.

 
 

 
 

# DefinedRegion 

 
 Use el tipo DefinedRegion para crear zonas personalizadas, de forma que puedas determinar los gastos de envío y los tiempos de transporte precisos con varios servicios de envío.
 

 
 
 Propiedades obligatorias 
 
 
 
 addressCountry 
 
 Text 

 Indica el código de país de 2 letras en formato ISO 3166-1 alfa-2 .

 
 

 
 

 
 
 Propiedades recomendadas 
 
 
 
 addressRegion 
 
 Text 

 El código de región específico del país, si procede. La región debe ser un código de subdivisión ISO 3166-2 de dos o tres caracteres, sin el prefijo de país. La Búsqueda de Google solo admite Australia, Estados Unidos y Japón. Ejemplos: NY (para el estado de Nueva York en EE. UU.), NSW (para el estado de Nueva Gales del Sur en Australia) o 03 (para la prefectura de Iwate en Japón).

 Incluye solo el código de región o el código postal.

 
 

 
 postalCode 
 
 Text 

 El código postal específico del país, si procede. Por ejemplo, 94043 . Los códigos postales solo están disponibles en Australia, Canadá y Estados Unidos.

 
 

 
 

 

# ServicePeriod (para plazos de transporte)

 
 Usa el tipo ServicePeriod para representar los intervalos de tiempo de transporte de un pedido.
 
 También puedes usar el tipo ServicePeriod para especificar los tiempos de preparación. Para obtener más información sobre los tiempos de preparación, consulta ServicePeriod .
 

 Ejemplo:
 
 "transitTime" : { 
 "@type" : "ServicePeriod" , 
 "businessDays" : [ 
 "https://schema.org/Monday" , 
 "https://schema.org/Tuesday" , 
 "https://schema.org/Wednesday" , 
 "https://schema.org/Thursday" , 
 "https://schema.org/Friday" 
 ], 
 "duration" : { 
 "@type" : "QuantitativeValue" , 
 "minValue" : 0 , 
 "maxValue" : 2 , 
 "unitCode" : "DAY" 
 } 
 } 
 
 

 
 
 Propiedades recomendadas 
 
 
 
 businessDays 
 
 DayOfWeek 

 Los días de la semana en los que un pedido está en tránsito activo, si procede. Si los días hábiles de su organización son de lunes a sábado, no es necesario que añada esta propiedad.
 
 
 

 
 duration 
 
 QuantitativeValue 

 El número de días hábiles de transporte, si procede.
 Consulta también la lista de propiedades QuantitativeValue de tiempos de tránsito admitidas por Google.

 
 

 
 

 

# QuantitativeValue (para tiempos de transporte del envío)

 
 Use el tipo QuantitativeValue para representar los tiempos de transporte mínimo y máximo de los pedidos.
 Debes proporcionar value (para un tiempo de transporte fijo) o maxValue (para un límite superior del tiempo de transporte) junto con unitCode . minValue se puede proporcionar de forma opcional para especificar un límite inferior del tiempo de transporte.
 

 
 
 Propiedades recomendadas 
 
 
 
 maxValue 
 
 Number 

 El número máximo de días. El valor debe ser un número entero no negativo.

 
 

 
 minValue 
 
 Number 

 El número mínimo de días, si procede. El valor debe ser un número entero no negativo.

 
 

 
 unitCode 
 
 Text 

 Unidad de tiempo de transporte. El valor debe ser DAY o d .

 
 

 
 value 
 
 Number 

 El número exacto de días de transporte, si se conoce. El valor debe ser un número entero no negativo.
 Si se proporciona, no se deben especificar minValue ni maxValue .
 

 
 

 
 

 

# QuantitativeValue (en el contexto de las dimensiones del embalaje de envío)

 
 En el contexto de ShippingConditions , usa el tipo QuantitativeValue para representar intervalos de valores de las dimensiones del paquete de envío ( weight y numItems ) a los que se aplican una tarifa de envío y un tiempo de transporte concretos.
 Se debe proporcionar la propiedad minValue o maxValue . Si no se proporcionan valores, la propiedad minValue tiene el valor predeterminado 0 y la propiedad maxValue tiene el valor predeterminado infinito.
 
 También puedes usar el tipo QuantitativeValue para especificar los tiempos de preparación en el tipo ShippingService , así como los tiempos de transporte en el tipo ShippingConditions .
 Para obtener más información, consulta QuantitativeValue para ver los tiempos de preparación y QuantitativeValue para ver los tiempos de transporte .
 

 

 
 
 Propiedades recomendadas 
 
 
 
 maxValue 
 
 Number 

 El número máximo de la dimensión ( weight o numItems ), si procede.
 Si no se proporciona ningún valor, el valor predeterminado es infinito.
 

 
 

 
 minValue 
 
 Number 

 El número mínimo de la dimensión ( weight o numItems ), si procede.
 Debe ser inferior a maxValue . El valor predeterminado es 0 si no se proporciona ninguno.

 
 

 
 unitCode 
 
 Text 

 Una unidad pertinente para la dimensión ( weight o numItems ), si procede, en formato de código común UN/CEFACT (tres caracteres):
 
 
 
- En el caso de las unidades de peso, el valor debe ser LBR (libras) o KGM (kilogramos). 
 
- En el caso del número de artículos, se puede omitir unitCode . También puedes usar el nombre del código común UN/CEFACT H87 . 
 

 
 

 
 

 

# MonetaryAmount (en el contexto de las condiciones de envío)

 
 En el contexto de las condiciones de envío, usa el tipo MonetaryAmount para representar intervalos de valores de pedido a los que se aplican una tarifa de envío y un tiempo de entrega concretos.
 Se debe proporcionar la propiedad minValue o maxValue . Si no se proporcionan valores, la propiedad minValue tiene el valor predeterminado 0 y la propiedad maxValue tiene el valor predeterminado infinito. Ten en cuenta que también puedes usar el tipo MonetaryAmount en otro formato para especificar los costes de envío .
 

 
 
 Propiedades obligatorias 
 
 
 
 currency 
 
 Text 

 Código de moneda del valor del pedido en formato ISO 4217 .

 
 

 
 maxValue 
 
 Number 

 El valor máximo del pedido. Si no se proporciona ningún valor, el valor predeterminado es infinito.

 
 

 
 minValue 
 
 Number 

 El valor mínimo del pedido. El valor predeterminado es 0 si no se proporciona ninguno.

 
 

 
 

 

# MonetaryAmount (en el contexto de la tarifa de envío)

 
 En el contexto de las tarifas de envío, use el tipo MonetaryAmount para especificar una tarifa de envío concreta o máxima para una condición de envío determinada. Puedes usar el tipo MonetaryAmount como alternativa más sencilla al atributo ShippingRateSettings , que es más complejo, y se puede usar cuando solo necesite especificar una tarifa de envío concreta o máxima. Se debe proporcionar la propiedad maxValue o value junto con la propiedad currency .
 

 
 
 Propiedades obligatorias 
 
 
 
 currency 
 
 Text 

 Código de moneda de los gastos de envío en formato ISO 4217 .

 
 

 
 maxValue 
 
 Number 

 El coste de envío máximo de la condición de envío indicada. Si especificas la propiedad maxValue , no especifiques la propiedad value .

 
 

 
 value 
 
 Number 

 Los gastos de envío fijos de la condición de envío indicada. Para indicar que es un envío gratuito, usa el valor 0 .

 
 

 
 

# ShippingRateSettings (en el contexto de la tarifa de envío)

 
 En el contexto de las tarifas de envío, usa el tipo ShippingRateSettings para especificar la tarifa de envío de una condición de envío determinada como porcentaje del valor del pedido o del peso de los productos pedidos. Se debe proporcionar la propiedad orderPercentage o weightPercentage al usar el tipo ShippingRateSettings .
 
 MonetaryAmount es una alternativa más sencilla a la opción más compleja ShippingRateSettings y se puede usar cuando solo necesites especificar una tarifa de envío fija.
 

 

 
 
 Propiedades recomendadas 
 
 
 
 orderPercentage 
 
 Number 

 Los gastos de envío de la condición de envío indicada como una fracción del valor del pedido.
 Utiliza un valor entre 0 y 1 .

 
 

 
 weightPercentage 
 
 Number 

 Los gastos de envío de la condición de envío indicada como una fracción del peso de los productos enviados.
 Utiliza un valor entre 0 y 1 .

 
 

 
 

 

# OpeningHoursSpecification (en el contexto de las excepciones de envío temporales)

 
 En el contexto de las condiciones de envío, usa el tipo OpeningHoursSpecification para representar cuándo es válida la condición, por ejemplo, debido a las vacaciones de temporada. Se debe proporcionar al menos una de las propiedades validFrom y validThrough cuando se use el tipo OpeningHoursSpecification .
 

 
 
 Propiedades recomendadas 
 
 
 
 validFrom 
 
 Date 

 La primera fecha en la que es válida la condición de envío, en formato ISO 8601 .

 
 

 
 validThrough 
 
 Date 

 La última fecha en la que es válida la condición de envío, en formato ISO 8601 .

 
 

 
 

 

# 
 Método alternativo para configurar opciones de envío con Google
 

 
 Las políticas de envío de los comercios pueden ser complejas y cambiar con frecuencia. Si te resulta difícil indicar y mantener actualizados tus datos de envío mediante etiquetas y tienes una cuenta de Google Merchant Center, puedes configurar tus ajustes de envío como se describe en el Centro de Ayuda de Google Merchant Center. También tienes la opción de configurar las políticas de envío en Search Console a nivel de cuenta que se añaden automáticamente a Merchant Center.
 

 

# Combinar varias configuraciones de envío

 
 Si vas a combinar varias configuraciones de envío, ten en cuenta cómo puedes anular la información de tus políticas según el orden de prioridad. Por ejemplo, si proporcionas tanto el marcado de política de envío en tu sitio y la configuración de políticas de envío en Search Console, Google solo usará la información proporcionada en Search Console.
 

 
 Google utiliza el siguiente orden de prioridad (de mayor a menor):
 

 
 
- API Content for Shopping ( configuración de envío a nivel de cuenta ) 
 
- Configuración de Merchant Center o Search Console 
 
- Etiquetas de fichas de comerciantes a nivel de producto 
 
- Etiquetas a nivel de organización 
 

 
 
 

# Solucionar problemas

 
 Si tienes problemas para implementar o depurar datos estructurados, a continuación se incluyen algunos recursos que pueden serte útiles.
 

 
 
- Si usas un sistema de gestión de contenido (CMS) o alguien se encarga de gestionar tu sitio, pídele ayuda. No olvides reenviarle cualquier mensaje de Search Console que incluya información sobre el problema en cuestión. 
 
- Google no garantiza que las funciones que utilizan datos estructurados aparezcan en los resultados de búsqueda.
 Para ver una lista con motivos habituales por los que Google no muestra tu contenido en resultados enriquecidos, consulta las directrices generales de datos estructurados . 
 
- Es posible que haya un error en tus datos estructurados. Consulta la lista de errores de datos estructurados y el informe de datos estructurados que no se pueden analizar . 
 
- Si se ha aplicado una acción manual de datos estructurados a tu página, se ignorarán sus datos estructurados, aunque la página puede seguir apareciendo en los resultados de la Búsqueda de Google. Para solucionar problemas de datos estructurados , usa el informe "Acciones manuales" .
 
 
- Revisa las directrices para comprobar si tu contenido no las cumple. El problema podría deberse a que la página incluye contenido engañoso o etiquetas con contenido fraudulento.
 No obstante, es posible que el problema no se deba a la sintaxis, por lo que la prueba de resultados enriquecidos no podrá ayudarte a identificarlo.
 
 
- Solucionar problemas si faltan resultados enriquecidos o si se ha reducido el número total de resultados enriquecidos . 
 
- Da cierto margen a Google para que vuelva a rastrear e indexar tu página. Recuerda que Google puede tardar varios días en encontrar y rastrear una página después de publicarse. Consulta las preguntas frecuentes sobre el rastreo y la indexación de la Búsqueda de Google .
 
 
- Publica una pregunta en el foro del Centro de la Búsqueda de Google . 
 

 
 
 
 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Enviar comentarios
