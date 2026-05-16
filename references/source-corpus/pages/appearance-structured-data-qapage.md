---
url: https://developers.google.com/search/docs/appearance/structured-data/qapage
title: "सवाल और जवाब ( QAPage ) का स्ट्रक्चर्ड डेटा"
fetched_at: 2026-05-16T16:53:15.552Z
seed: false
---

# सवाल और जवाब ( QAPage ) का स्ट्रक्चर्ड डेटा

Source: https://developers.google.com/search/docs/appearance/structured-data/qapage

- 
 
 
 
 
 
 
 
 होम पेज
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 सुझाव भेजें
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# सवाल और जवाब ( QAPage ) का स्ट्रक्चर्ड डेटा

 
 
 सवाल-जवाब वाले पेज, वे वेब पेज होते हैं जिनका डेटा सवाल और जवाब के फ़ॉर्मैट में होता है. इस फ़ॉर्मैट
 में किसी सवाल के बाद उसके जवाब लिखे जाते हैं. किसी सवाल और
 उसके जवाबों को दिखाने वाले कॉन्टेंट के लिए, आपके पास अपने डेटा को 
 schema.org QAPage , Question , और Answer तरीकों से मार्कअप करने का विकल्प है.

 सही तरीके से मार्कअप किए गए पेजों के ज़्यादा बेहतर नतीजे (रिच रिज़ल्ट), खोज नतीजों वाले
 पेज पर दिखाए जाते हैं. इन रिच रिज़ल्ट की वजह से आपकी साइट, Search में सही उपयोगकर्ताओं तक पहुंच पाती है.
 उदाहरण के लिए, आपको उपयोगकर्ता क्वेरी के लिए एक ज़्यादा बेहतर नतीजा (रिच रिज़ल्ट) दिख सकता है,
 "मैं यूएसबी पोर्ट में फंसी केबल को कैसे हटाऊं?" अगर पेज को उस सवाल के जवाब के साथ मार्कअप किया गया है.

 
 अपने कॉन्टेंट को ज़्यादा बेहतर नतीजे (रिच रिज़ल्ट) के तौर पर दिखाने लायक बनाने के साथ-साथ, अपने सवाल-जवाब वाले पेज को मार्कअप करें. इससे, Google आपके पेज का बेहतर स्निपेट बना पाता है.
 अगर कॉन्टेंट को ज़्यादा बेहतर नतीजे (रिच रिज़ल्ट) के तौर पर नहीं दिखाया जाता है, तो हो सकता है कि जिस कॉन्टेंट के लिए जवाब दिए गए हैं वह मूल नतीजे में दिखे.

 
 

# 
 स्ट्रक्चर्ड डेटा को जोड़ने का तरीका
 

 
 स्ट्रक्चर्ड डेटा, किसी पेज के बारे में जानकारी देने और पेज के
 कॉन्टेंट को कैटगरी में बांटने का एक स्टैंडर्ड फ़ॉर्मैट है. अगर आपको स्ट्रक्चर्ड डेटा के बारे में ज़्यादा जानकारी नहीं है, तो
 स्ट्रक्चर्ड डेटा के काम करने का तरीका देखें.
 

 
 स्ट्रक्चर्ड डेटा बनाने, उसकी जांच करने, और उसे रिलीज़ करने के बारे में खास जानकारी यहां दी गई है.

 
 
- ज़रूरी प्रॉपर्टी जोड़ें. जिस फ़ॉर्मैट का इस्तेमाल हो रहा है उसके हिसाब से जानें कि पेज पर स्ट्रक्चर्ड डेटा कहां डालना है .
 
 क्या कॉन्टेंट मैनेजमेंट सिस्टम का इस्तेमाल किया जा रहा है? कॉन्टेंट मैनेजमेंट सिस्टम के साथ जुड़े किसी प्लग इन का इस्तेमाल करना ज़्यादा आसान होगा.
 

 क्या JavaScript का इस्तेमाल किया जा रहा है? JavaScript का इस्तेमाल करके स्ट्रक्चर्ड डेटा जनरेट करने का तरीका जानें.

 
 
- दिशा-निर्देशों का पालन करें. 
 
- ज़्यादा बेहतर नतीजों (रिच रिज़ल्ट) की जांच का इस्तेमाल करके, अपने कोड की पुष्टि करें. साथ ही, सभी ज़रूरी गड़बड़ियों को ठीक करें. ऐसी अन्य समस्याओं को भी ठीक करें जो टूल में फ़्लैग की जा सकती हैं. ऐसा इसलिए, क्योंकि इससे आपके स्ट्रक्चर्ड डेटा की क्वालिटी को बेहतर बनाने में मदद मिल सकती है. हालांकि, ज़्यादा बेहतर नतीजों (रिच रिज़ल्ट) में शामिल होने के लिए, यह ज़रूरी नहीं है. 
 
- स्ट्रक्चर्ड डेटा वाले कुछ पेजों को डिप्लॉय करें. इसके बाद, यूआरएल जांचने वाला टूल इस्तेमाल करके देखें कि Google को पेज कैसा दिखेगा. पक्का करें कि Google आपका पेज ऐक्सेस कर सकता हो. साथ ही, देखें कि उस पेज को robots.txt फ़ाइल और noindex टैग से ब्लॉक न किया गया हो या लॉग इन करना ज़रूरी न हो. अगर पेज ठीक लगता है, तो Google को अपने यूआरएल फिर से क्रॉल करने के लिए कहा जा सकता है. ध्यान दें : फिर से क्रॉल और इंडेक्स करने में कुछ समय लग सकत है. पेज को पब्लिश करने के बाद, Google को उसे ढूंढकर क्रॉल करने में कई दिन लग सकते हैं.

 
 
- Google को आगे होने वाले बदलावों की जानकारी देने के लिए हमारा सुझाव है कि आप साइटमैप सबमिट करें . Search Console साइटमैप एपीआई की मदद से, इसे ऑटोमेट भी किया जा सकता है. 
 

 
 

# उदाहरण

 नीचे दिए गए मार्कअप के उदाहरण में, JSON-LD की QAPage , Question , और Answer टाइप की जानकारी शामिल है: 

 
 
 JSON-LD 
 <html>
 <head>
 <title>How many ounces are there in a pound?</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "QAPage",
 "mainEntity": {
 "@type": "Question",
 "name": "How many ounces are there in a pound?",
 "text": "I have taken up a new interest in baking and keep running across directions in ounces and pounds. I have to translate between them and was wondering how many ounces are in a pound?",
 "answerCount": 3,
 "upvoteCount": 26,
 "datePublished": "2024-02-14T15:34-05:00",
 "author": {
 "@type": "Person",
 "name": "Mary Stone",
 "url": "https://example.com/profiles/mary-stone"
 },
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "1 pound (lb) is equal to 16 ounces (oz).",
 "image": "https://example.com/images/conversion-chart.jpg",
 "upvoteCount": 1337,
 "url": "https://example.com/question1#acceptedAnswer",
 "datePublished": "2024-02-14T16:34-05:00",
 "author": {
 "@type": "Person",
 "name": "Julius Fernandez",
 "url": "https://example.com/profiles/julius-fernandez"
 }
 },
 "suggestedAnswer": [
 {
 "@type": "Answer",
 "text": "Are you looking for ounces or fluid ounces? If you are looking for fluid ounces there are 15.34 fluid ounces in a pound of water.",
 "upvoteCount": 42,
 "url": "https://example.com/question1#suggestedAnswer1",
 "datePublished": "2024-02-14T15:39-05:00",
 "author": {
 "@type": "Person",
 "name": "Kara Weber",
 "url": "https://example.com/profiles/kara-weber"
 },
 "comment": {
 "@type": "Comment",
 "text": "I'm looking for ounces, not fluid ounces.",
 "datePublished": "2024-02-14T15:40-05:00",
 "author": {
 "@type": "Person",
 "name": "Mary Stone",
 "url": "https://example.com/profiles/mary-stone"
 }
 }
 }, {
 "@type": "Answer",
 "text": " I can't remember exactly, but I think 18 ounces in a lb. You might want to double check that.",
 "upvoteCount": 0,
 "url": "https://example.com/question1#suggestedAnswer2",
 "datePublished": "2024-02-14T16:02-05:00",
 "author": {
 "@type": "Person",
 "name": "Joe Cobb",
 "url": "https://example.com/profiles/joe-cobb"
 }
 }
 ]
 }
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>How many ounces are there in a pound?</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "QAPage",
 "mainEntity": {
 "@type": "Question",
 "name": "How many ounces are there in a pound?",
 "text": "I have taken up a new interest in baking and keep running across directions in ounces and pounds. I have to translate between them and was wondering how many ounces are in a pound?",
 "answerCount": 3,
 "upvoteCount": 26,
 "datePublished": "2024-02-14T15:34-05:00",
 "author": {
 "@type": "Person",
 "name": "Mary Stone",
 "url": "https://example.com/profiles/mary-stone"
 },
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "1 pound (lb) is equal to 16 ounces (oz).",
 "image": "https://example.com/images/conversion-chart.jpg",
 "upvoteCount": 1337,
 "url": "https://example.com/question1#acceptedAnswer",
 "datePublished": "2024-02-14T16:34-05:00",
 "author": {
 "@type": "Person",
 "name": "Julius Fernandez",
 "url": "https://example.com/profiles/julius-fernandez"
 }
 },
 "suggestedAnswer": [
 {
 "@type": "Answer",
 "text": "Are you looking for ounces or fluid ounces? If you are looking for fluid ounces there are 15.34 fluid ounces in a pound of water.",
 "upvoteCount": 42,
 "url": "https://example.com/question1#suggestedAnswer1",
 "datePublished": "2024-02-14T15:39-05:00",
 "author": {
 "@type": "Person",
 "name": "Kara Weber",
 "url": "https://example.com/profiles/kara-weber"
 },
 "comment": {
 "@type": "Comment",
 "text": "I'm looking for ounces, not fluid ounces.",
 "datePublished": "2024-02-14T15:40-05:00",
 "author": {
 "@type": "Person",
 "name": "Mary Stone",
 "url": "https://example.com/profiles/mary-stone"
 }
 }
 }, {
 "@type": "Answer",
 "text": " I can't remember exactly, but I think 18 ounces in a lb. You might want to double check that.",
 "upvoteCount": 0,
 "url": "https://example.com/question1#suggestedAnswer2",
 "datePublished": "2024-02-14T16:02-05:00",
 "author": {
 "@type": "Person",
 "name": "Joe Cobb",
 "url": "https://example.com/profiles/joe-cobb"
 }
 }
 ]
 }
 }
 </script>
 </head>
 <body>
 </body>
</html>
