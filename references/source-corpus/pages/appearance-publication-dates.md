---
url: https://developers.google.com/search/docs/appearance/publication-dates
title: "Influencer vos dates de publication dans la recherche Google"
fetched_at: 2026-05-16T16:52:54.871Z
seed: false
---

# Influencer vos dates de publication dans la recherche Google

Source: https://developers.google.com/search/docs/appearance/publication-dates

- 
 
 
 
 
 
 
 
 Accueil
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Envoyer des commentaires
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Influencer vos dates de publication dans la recherche Google

 
 La date de publication correspond à la date à laquelle Google estime que la page Web a été mise à jour ou publiée.
 Lorsque Google est en mesure de déterminer la date de publication de votre page ou de votre vidéo, ces informations peuvent être affichées dans les résultats de recherche si elles sont jugées utiles pour les internautes. Vous pouvez fournir des informations pour aider Google à déterminer la date de publication.

 
 
 Illustration représentant un résultat textuel dans la recherche Google, avec un cadre en surbrillance autour de la date de publication 
 
 
 Panda curieux

 
 
 Pourquoi les paresseux sont-ils si lents ? 

 
 
 25 août 2023

 
 
 
 Le choix de la date par Google ne dépend pas que d'un facteur, car chaque facteur peut présenter des problèmes. Nos systèmes combinent donc plusieurs facteurs pour estimer la date la plus juste à laquelle une page a été publiée ou a subi des modifications majeures.

 

# Comment fournir des informations sur la date à Google

 Pour fournir à Google des informations sur la date, procédez comme suit :

 
 
- Suivez les bonnes pratiques pour influencer les dates de publication . 
 
- Ajoutez une date visible par l'utilisateur sur la page et mettez-la en valeur. Ajoutez des libellés tels que "Publication" ou "Dernière mise à jour" à vos dates. Voici quelques exemples de mise en évidence de la date sur une page Web :
 
 
- Publié le 4 février 2019 
 
- Date de publication : 4 février 2019 
 
- Dernière mise à jour : 14 février 2018 
 
- Mise à jour le 14 février 2019 à 20h GMT 
 

 Vous pouvez indiquer la date de publication, la dernière date de mise à jour ou les deux.

 
 <html>
 <head>
 <title>Analyzing Google Search traffic drops</title>
 </head>
 <body>
 <p>
 Posted Tuesday, July 20, 2021
 </p> 
 <p>
 Suppose you open Search Console and find out that your Google Search traffic dropped. What should you do?
 </p>
 </body>
</html>
 
 
 
- Spécifiez les dates à l'aide de données structurées .
 Nous vous recommandons d'ajouter un sous-type de CreativeWork (comme Article , BlogPosting ou VideoObject ), et de spécifier les champs datePublished et/ou dateModified .
 Veillez à respecter les consignes Google sur les données structurées afin d'aider nos robots d'exploration à identifier les dates de vos articles.
 
 < html >
 < head >
 < title>Analyzing Google Search traffic drops < / title >
 < script type = "application/ld+json" >
 { 
 "@context" : "https://schema.org" , 
 "@type" : "NewsArticle" , 
 "headline" : "Analyzing Google Search traffic drops" , 
 "datePublished" : "2021-07-20T08:00:00+08:00" , 
 "dateModified" : "2021-07-20T09:20:00+08:00" 
 } 
 < / script >
 < / head >
 < body >
 < p >
 Posted Tuesday , July 20 , 2021 
 < / p >
 < p >
 Suppose you open Search Console and find out that your Google Search traffic dropped . What should you do ? 
 < / p >
 < / body >
< / html >
 
 
 

 

# 
 Bonnes pratiques pour influencer les dates de publication
 

 Que la date de publication soit visible par l'utilisateur ou indiquée dans les données structurées, Google ne peut garantir qu'elle apparaîtra dans les résultats de recherche. Toutefois, en respectant ces instructions, vous aidez nos algorithmes à identifier et à traiter cette information.

 
 
- La date est obligatoire. l'heure ne l'est pas. Nous vous recommandons cependant d'indiquer une heure et un fuseau horaire dans le balisage, pour plus de précision. 
 
- Si vous choisissez de spécifier le fuseau horaire , indiquez le fuseau horaire approprié , en tenant compte de l' heure d'été , le cas échéant. 
 
- Veillez à la cohérence de toutes les dates et heures. Assurez-vous que la date, ainsi que l'heure et le fuseau horaire éventuels, sont les mêmes dans le contenu visible par l'utilisateur que dans les données structurées correspondantes. L'heure et le fuseau horaire sont facultatifs dans les données visibles par l'utilisateur, même s'ils sont fournis dans les données structurées. 
 
- Ne spécifiez pas une date future ni la date de l'action décrite sur la page. 
 Les dates doivent correspondre à la date de publication ou de mise à jour de la page, et non aux récits ou événements qui y sont décrits. Au besoin, vous pouvez ajouter un balisage d'événement à la page afin de décrire les activités qu'elle répertorie. 
 
- Minimisez la présence des autres dates sur la page  : si vous avez suivi les bonnes pratiques et que Google a sélectionné une date incorrecte, vérifiez si vous pouvez supprimer, en partie ou intégralement, les autres dates figurant sur la page. 
 
- Si votre page est censée apparaître dans la recherche Google Actualités , suivez ces consignes supplémentaires . 
 

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Envoyer des commentaires
