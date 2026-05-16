---
url: https://developers.google.com/search/docs/appearance/structured-data/dataset
title: "Структурированные данные для наборов данных ( Dataset , DataCatalog , DataDownload )"
fetched_at: 2026-05-16T16:53:03.810Z
seed: false
---

# Структурированные данные для наборов данных ( Dataset , DataCatalog , DataDownload )

Source: https://developers.google.com/search/docs/appearance/structured-data/dataset

- 
 
 
 
 
 
 
 
 Главная
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Отправить отзыв
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Структурированные данные для наборов данных ( Dataset , DataCatalog , DataDownload )

 
 В поиске будет легче найти набор данных, если добавить о нем информацию в виде структурированных данных, таких как название, описание, имя автора и обозначение формата. Google стремится упростить поиск наборов данных из самых разных областей, включая медицину и биологию, социальные науки, машинное обучение и многое другое. Поэтому мы рекомендуем использовать стандартизированные метаданные, в частности описанные на сайте schema.org.
 

 
 
 
 Примечание. Ваш контент может выглядеть в результатах поиска по-другому. Вы можете протестировать разметку в инструменте проверки расширенных результатов .
 

 
 
 Примеры наборов данных:

 
 
- таблица или CSV-файл с определенной информацией; 
 
- систематизированная группа таблиц; 
 
- файл в проприетарном формате, содержащий определенные данные; 
 
- группа файлов, которые в совокупности представляют полезный набор данных; 
 
- структурированный объект с данными в другом формате, который можно загрузить в специальный инструмент для обработки; 
 
- данные, полученные с помощью съемки изображений; 
 
- файлы машинного обучения, например определения структур нейронной сети или параметры обучения. 
 

 
 
 

# 
 Как добавить структурированные данные
 

 
 Структурированные данные – стандартизированный формат, который позволяет предоставлять поисковым системам информацию о странице и классифицировать ее контент. Подробнее о принципах работы структурированных данных …
 

 
 Ниже в общих чертах описано, как создать, проверить и добавить на сайт структурированные данные.

 
 
- Добавьте обязательные свойства . Узнайте, в каких частях страницы нужно размещать структурированные данные выбранного вами формата.
 
 Если вы работаете с системой управления контентом , вам может быть удобнее использовать встроенный в нее плагин.
 

 Если вы используете язык JavaScript , узнайте, как создавать структурированные данные с помощью JavaScript .

 
 
- Следуйте рекомендациям . 
 
- Протестируйте свой код с помощью инструмента проверки расширенных результатов . Если будут обнаружены критические ошибки, устраните их. Мы также рекомендуем устранить некритические ошибки, отмеченные в инструменте. Это может привести к повышению качества структурированных данных, хотя страницы будут подходить для создания расширенных результатов и без этого. 
 
- Опубликуйте страницу и с помощью инструмента проверки URL выясните, как она выглядит для робота Googlebot. Убедитесь, что доступ Google к странице не заблокирован файлом robots.txt или метатегом noindex и авторизация на ней не требуется. Если все в порядке, то запросите повторное сканирование ваших URL . Примечание. На их сканирование и индексирование потребуется некоторое время. С момента публикации страницы может пройти несколько дней, пока Google не обнаружит ее и не обработает.

 
 
- Отправляйте нам файл Sitemap , чтобы информировать нас об изменениях на сайте. Отправку такого файла можно автоматизировать с помощью Search Console Sitemap API . 
 

 
 

 

# Как удалить набор данных из результатов поиска наборов данных

 
 Если вы не хотите, чтобы набор данных показывался в результатах поиска Google, укажите с помощью тега robots meta , как его следует индексировать. Напоминаем, что прежде чем внесенные вами изменения отразятся в Поиске наборов данных, может пройти несколько дней или даже недель (в зависимости от расписания сканирования).
 

 

# Наш подход к разметке наборов данных

 
 Google распознает разметку schema.org Dataset или аналогичные элементы разметки для веб-страниц в формате DCAT , разработанные организацией W3C . Также мы проводим эксперимент по поддержке структурированных данных в формате CSVW от W3C и по мере выхода новых рекомендаций в отношении этой разметки планируем менять принципы ее обработки в соответствии с ними. Более подробная информация доступна в этой статье .
 

 

# Примеры

 В этом разделе приведены примеры кодов с использованием синтаксиса JSON-LD и schema.org (рекомендуемый вариант) для наборов данных в инструменте проверки расширенных результатов. Аналогичную терминологию schema.org можно применять для форматов RDFa 1.1 и Microdata.
 Для описания метаданных также можно использовать словарь DCAT от W3C. Примеры кода ниже основаны на реальном описании набора данных .

 
 
 JSON-LD 
 Нажмите кнопку ниже, чтобы увидеть пример кода JSON-LD для набора данных:

 <html>
 <head>
 <title>NCDC Storm Events Database</title>
 <script type="application/ld+json">
 {
 "@context":"https://schema.org/",
 "@type":"Dataset",
 "name":"NCDC Storm Events Database",
 "description":"Storm Data is provided by the National Weather Service (NWS) and contain statistics on...",
 "url":"https://catalog.data.gov/dataset/ncdc-storm-events-database",
 "sameAs":"https://gis.ncdc.noaa.gov/geoportal/catalog/search/resource/details.page?id=gov.noaa.ncdc:C00510",
 "identifier": ["https://doi.org/10.1000/182",
 "https://identifiers.org/ark:/12345/fk1234"],
 "keywords":[
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > CYCLONES",
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > DROUGHT",
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > FOG",
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > FREEZE"
 ],
 "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
 "isAccessibleForFree" : true,
 "hasPart" : [
 {
 "@type": "Dataset",
 "name": "Sub dataset 01",
 "description": "Informative description of the first subdataset...",
 "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
 "creator":{
 "@type":"Organization",
 "name": "Sub dataset 01 creator"
 }
 },
 {
 "@type": "Dataset",
 "name": "Sub dataset 02",
 "description": "Informative description of the second subdataset...",
 "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
 "creator":{
 "@type":"Organization",
 "name": "Sub dataset 02 creator"
 }
 }
 ],
 "creator":{
 "@type":"Organization",
 "url": "https://www.ncei.noaa.gov/",
 "name":"OC/NOAA/NESDIS/NCEI > National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce",
 "contactPoint":{
 "@type":"ContactPoint",
 "contactType": "customer service",
 "telephone":"+1-828-271-4800",
 "email":"ncei.orders@noaa.gov"
 }
 },
 "funder":{
 "@type": "Organization",
 "sameAs": "https://ror.org/00tgqzw13",
 "name": "National Weather Service"
 },
 "includedInDataCatalog":{
 "@type":"DataCatalog",
 "name":"data.gov"
 },
 "distribution":[
 {
 "@type":"DataDownload",
 "encodingFormat":"CSV",
 "contentUrl":"https://www.ncdc.noaa.gov/stormevents/ftp.jsp"
 },
 {
 "@type":"DataDownload",
 "encodingFormat":"XML",
 "contentUrl":"https://gis.ncdc.noaa.gov/all-records/catalog/search/resource/details.page?id=gov.noaa.ncdc:C00510"
 }
 ],
 "temporalCoverage":"1950-01-01/2013-12-18",
 "spatialCoverage":{
 "@type":"Place",
 "geo":{
 "@type":"GeoShape",
 "box":"18.0 -65.0 72.0 172.0"
 }
 }
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>NCDC Storm Events Database</title>
 <script type="application/ld+json">
 {
 "@context":"https://schema.org/",
 "@type":"Dataset",
 "name":"NCDC Storm Events Database",
 "description":"Storm Data is provided by the National Weather Service (NWS) and contain statistics on...",
 "url":"https://catalog.data.gov/dataset/ncdc-storm-events-database",
 "sameAs":"https://gis.ncdc.noaa.gov/geoportal/catalog/search/resource/details.page?id=gov.noaa.ncdc:C00510",
 "identifier": ["https://doi.org/10.1000/182",
 "https://identifiers.org/ark:/12345/fk1234"],
 "keywords":[
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > CYCLONES",
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > DROUGHT",
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > FOG",
 "ATMOSPHERE > ATMOSPHERIC PHENOMENA > FREEZE"
 ],
 "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
 "isAccessibleForFree" : true,
 "hasPart" : [
 {
 "@type": "Dataset",
 "name": "Sub dataset 01",
 "description": "Informative description of the first subdataset...",
 "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
 "creator":{
 "@type":"Organization",
 "name": "Sub dataset 01 creator"
 }
 },
 {
 "@type": "Dataset",
 "name": "Sub dataset 02",
 "description": "Informative description of the second subdataset...",
 "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
 "creator":{
 "@type":"Organization",
 "name": "Sub dataset 02 creator"
 }
 }
 ],
 "creator":{
 "@type":"Organization",
 "url": "https://www.ncei.noaa.gov/",
 "name":"OC/NOAA/NESDIS/NCEI > National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce",
 "contactPoint":{
 "@type":"ContactPoint",
 "contactType": "customer service",
 "telephone":"+1-828-271-4800",
 "email":"ncei.orders@noaa.gov"
 }
 },
 "funder":{
 "@type": "Organization",
 "sameAs": "https://ror.org/00tgqzw13",
 "name": "National Weather Service"
 },
 "includedInDataCatalog":{
 "@type":"DataCatalog",
 "name":"data.gov"
 },
 "distribution":[
 {
 "@type":"DataDownload",
 "encodingFormat":"CSV",
 "contentUrl":"https://www.ncdc.noaa.gov/stormevents/ftp.jsp"
 },
 {
 "@type":"DataDownload",
 "encodingFormat":"XML",
 "contentUrl":"https://gis.ncdc.noaa.gov/all-records/catalog/search/resource/details.page?id=gov.noaa.ncdc:C00510"
 }
 ],
 "temporalCoverage":"1950-01-01/2013-12-18",
 "spatialCoverage":{
 "@type":"Place",
 "geo":{
 "@type":"GeoShape",
 "box":"18.0 -65.0 72.0 172.0"
 }
 }
 }
 </script>
 </head>
 <body>
 </body>
</html>
