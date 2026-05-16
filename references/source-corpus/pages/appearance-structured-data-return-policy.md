---
url: https://developers.google.com/search/docs/appearance/structured-data/return-policy
title: "البيانات المنظَّمة لسياسات الإرجاع الخاصة بالتجّار ( MerchantReturnPolicy )"
fetched_at: 2026-05-16T16:53:16.550Z
seed: false
---

# البيانات المنظَّمة لسياسات الإرجاع الخاصة بالتجّار ( MerchantReturnPolicy )

Source: https://developers.google.com/search/docs/appearance/structured-data/return-policy

- 
 
 
 
 
 
 
 
 الصفحة الرئيسية
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 إرسال ملاحظات
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# البيانات المنظَّمة لسياسات الإرجاع الخاصة بالتجّار ( MerchantReturnPolicy )

 

 
 
 يوفّر العديد من التجار سياسات إرجاع توضّح للمستخدمين بالتفصيل عملية إرجاع المنتجات التي اشتروها.
 عندما تضيف بيانات MerchantReturnPolicy المنظَّمة إلى موقعك الإلكتروني، قد يستخدم محرّك بحث Google هذه المعلومات لعرض سياسات الإرجاع بجانب منتجاتك وضمن بطاقات المعلومات في نتائج البحث من Google.
 تتيح لك السمة MerchantReturnPolicy تحديد رابط لصفحة سياسات الإرجاع، أو تفاصيل مثل الشروط التي يمكن للعملاء بموجبها إرجاع المنتجات، وطُرق الإرجاع، ورسوم الإرجاع، وخيارات استرداد الأموال، والمزيد.

 
 يمكنك تحديد سياسة إرجاع موحَّدة لمؤسستك تنطبق على معظم أو جميع المنتجات التي تبيعها، وذلك باستخدام نوع البيانات المنظّمة MerchantReturnPolicy الذي يُدرج ضمن النوع Organization باستخدام السمة hasMerchantReturnPolicy .

 
 إذا كنت بحاجة إلى إلغاء سياسة الإرجاع الموحَّدة لمنتج معيّن، يمكنك تحديد مثيل واحد أو أكثر من MerchantReturnPolicy ضمن النوع Offer . لمزيد من المعلومات حول سياسات الإرجاع الخاصة بالمنتجات الفردية، راجِع مستند بطاقة بيانات التاجر .
 يُرجى العِلم أنّ سياسات الإرجاع الخاصة بالمنتجات الفردية المُحدّدة ضمن Offer تتيح استخدام عدد محدود أكثر من السمات مقارنةً بالسياسات الموضّحة هنا.

 
 

# 
 كيفية إضافة البيانات المنظَّمة
 

 
 البيانات المنظَّمة هي تنسيق موحّد لتقديم معلومات عن صفحة محدّدة وتصنيف محتواها. إذا كنت لا تزال مبتدئًا في مجال البيانات المنظَّمة، يمكنك الاطّلاع على المزيد من المعلومات حول
 آلية عمل البيانات المنظَّمة .
 

 
 إليك نظرة عامة حول كيفية إنشاء بيانات منظَّمة واختبارها وإصدارها.

 
 
- أضِف السمات المطلوبة . استنادًا إلى
 التنسيق الذي تستخدمه، يمكنك معرفة مكان إدراج البيانات المنظَّمة في الصفحة .
 
 هل تستخدم نظامًا لإدارة المحتوى (CMS)؟ قد يكون من الأسهل استخدام مكوّن إضافي مضمَّن في نظام إدارة المحتوى الذي تستخدمه.
 

 هل تستخدم JavaScript؟ اطّلِع على كيفية
 إنشاء بيانات منظَّمة باستخدام JavaScript .

 
 
- اتّبِع الإرشادات . 
 
- تحقَّق من صحة الرمز باستخدام
 اختبار النتائج الغنية بصريًا ،
 وأصلِح أي أخطاء ملحّة. ننصحك أيضًا بحلّ أي مشاكل غير ملحّة قد
 ترصدها الأداة لأنّ ذلك قد يساعدك على تحسين جودة بياناتك المنظَّمة (ولكن هذا الإجراء ليس ضروريًا لتكون بياناتك مؤهّلة للظهور ضمن النتائج الغنية بصريًا). 
 
- انشر بعض الصفحات التي تتضمّن بياناتك المنظَّمة واستخدِم أداة فحص عنوان URL لاختبار الطريقة التي يرى بها محرّك بحث Google الصفحة. تأكَّد من إمكانية وصول محرّك بحث Google
 إلى صفحتك ومن عدم حظرها باستخدام ملف robots.txt أو علامة noindex أو متطلبات تسجيل الدخول. إذا بدت الصفحة جيدة، يمكنك
 أن تطلب من محرّك بحث Google إعادة الزحف إلى عناوين URL الخاصة بك .
 ملاحظة : تحتاج عملية إعادة الزحف والفهرسة إلى بعض الوقت. وتذكَّر أنّ محرّك بحث Google قد يستغرق عدّة أيام من تاريخ نشر الصفحة للعثور عليها والزحف إليها.

 
 
- لإعلام محرّك بحث Google بأي تغييرات لاحقة، ننصحك
 بإرسال خريطة الموقع . يمكنك برمجة هذا الإجراء باستخدام
 Search Console Sitemap API . 
 

 
 

# أمثلة

 في ما يلي مثال على ترميز كامل لـ OnlineStore مع سياسة إرجاع للمنتجات التي يتم بيعها للعملاء في ألمانيا والنمسا وسويسرا تنص على أنّه يجب إرجاع أي منتجات بالبريد إلى أيرلندا.
 يمكن إرجاع المنتجات بدون أي تكلفة وضمن مهلة 60 يومًا، واسترداد الأموال بالكامل. ويُسمح بإرجاع المنتجات الجديدة فقط.

 
 { 
 "@context" : "https://schema.org" , 
 "@type" : "OnlineStore" , 
 "name" : "Example Online Store" , 
 "url" : "https://www.example.com" , 
 "sameAs" : [ "https://example.net/profile/example12" , "https://example.org/@example34" ], 
 "logo" : "https://www.example.com/assets/images/logo.png" , 
 "contactPoint" : { 
 "contactType" : "Customer Service" , 
 "email" : "support@example.com" , 
 "telephone" : "+47-99-999-9900" 
 }, 
 "vatID" : "FR12345678901" , 
 "iso6523Code" : "0199:724500PMK2A2M1SQQ228" , 
 
 "hasMerchantReturnPolicy" : { 
 "@type" : "MerchantReturnPolicy" , 
 "applicableCountry" : [ "DE" , "AT" , "CH" ], 
 "returnPolicyCountry" : "IE" , 
 "returnPolicyCategory" : "https://schema.org/MerchantReturnFiniteReturnWindow" , 
 "merchantReturnDays" : 60 , 
 "itemCondition" : "https://schema.org/NewCondition" , 
 "returnMethod" : "https://schema.org/ReturnByMail" , 
 "returnFees" : "https://schema.org/FreeReturn" , 
 "refundType" : "https://schema.org/FullRefund" , 
 "returnLabelSource" : "https://schema.org/ReturnLabelCustomerResponsibility" 
 } 
 
 } 
 

 في ما يلي مثال على ترميز كامل لبيانات MerchantReturnPolicy المنظَّمة مع خيارَين للإرجاع، وهما إرجاع المنتجات بسبب شعور المشتري بالندم أو بسبب خلل فيها، بالإضافة إلى استثناء موسمي يحدّد مهلة الإرجاع بـ 30 يومًا.

 <html>
 <head>
 <title>Our return policy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "OnlineStore",
 "hasMerchantReturnPolicy": {
 "@type": "MerchantReturnPolicy",
 "applicableCountry": [ "DE", "AT", "CH"],
 "returnPolicyCountry": "IE",
 "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
 "merchantReturnDays": 60,
 "itemCondition": [ "https://schema.org/NewCondition", "https://schema.org/DamagedCondition" ],
 "returnMethod": "https://schema.org/ReturnByMail",
 "returnFees": "https://schema.org/ReturnShippingFees",
 "refundType": "https://schema.org/FullRefund",
 "returnShippingFeesAmount": {
 "@type": "MonetaryAmount",
 "value": 2.99,
 "currency": "EUR"
 },
 "returnLabelSource": "https://schema.org/ReturnLabelInBox",
 "customerRemorseReturnFees": "https://schema.org/ReturnShippingFees",
 "customerRemorseReturnShippingFeesAmount": {
 "@type": "MonetaryAmount",
 "value": 5.99,
 "currency": "EUR"
 },
 "customerRemorseReturnLabelSource": "https://schema.org/ReturnLabelDownloadAndPrint",
 "itemDefectReturnFees": "https://schema.org/FreeReturn",
 "itemDefectReturnLabelSource": "https://schema.org/ReturnLabelInBox",
 "returnPolicySeasonalOverride": {
 "@type": "MerchantReturnPolicySeasonalOverride",
 "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
 "startDate": "2025-12-01",
 "endDate": "2025-01-05",
 "merchantReturnDays": 30
 }
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
 <title>Our return policy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "OnlineStore",
 "hasMerchantReturnPolicy": {
 "@type": "MerchantReturnPolicy",
 "applicableCountry": [ "DE", "AT", "CH"],
 "returnPolicyCountry": "IE",
 "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
 "merchantReturnDays": 60,
 "itemCondition": [ "https://schema.org/NewCondition", "https://schema.org/DamagedCondition" ],
 "returnMethod": "https://schema.org/ReturnByMail",
 "returnFees": "https://schema.org/ReturnShippingFees",
 "refundType": "https://schema.org/FullRefund",
 "returnShippingFeesAmount": {
 "@type": "MonetaryAmount",
 "value": 2.99,
 "currency": "EUR"
 },
 "returnLabelSource": "https://schema.org/ReturnLabelInBox",
 "customerRemorseReturnFees": "https://schema.org/ReturnShippingFees",
 "customerRemorseReturnShippingFeesAmount": {
 "@type": "MonetaryAmount",
 "value": 5.99,
 "currency": "EUR"
 },
 "customerRemorseReturnLabelSource": "https://schema.org/ReturnLabelDownloadAndPrint",
 "itemDefectReturnFees": "https://schema.org/FreeReturn",
 "itemDefectReturnLabelSource": "https://schema.org/ReturnLabelInBox",
 "returnPolicySeasonalOverride": {
 "@type": "MerchantReturnPolicySeasonalOverride",
 "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
 "startDate": "2025-12-01",
 "endDate": "2025-01-05",
 "merchantReturnDays": 30
 }
 }
 // Other Organization-level properties
 // ...
 }
 </script>
 </head>
 <body>
 </body>
</html>
 

# الإرشادات

 ليصبح ترميز سياسة الإرجاع مؤهلاً للاستخدام في "بحث Google"، عليك اتّباع الإرشادات التالية:

 
 
- الإرشادات العامة حول البيانات المنظَّمة 
 
- أساسيات "بحث Google" 
 
- الإرشادات الفنية 

# الإرشادات الفنية

 

- 
 ننصحك بتضمين معلومات الإرجاع الخاصة بمؤسستك في صفحة واحدة توضّح سياسة الإرجاع على موقعك الإلكتروني. لست بحاجة إلى تضمين المعلومات في كل صفحة على موقعك. ضمِّن نوع البيانات المنظَّمة MerchantReturnPolicy في النوع Organization . لمزيد من المعلومات، راجِع أيضًا الترميز على مستوى المؤسسة .
 

- 
 إذا كنت تطبّق سياسة إرجاع غير موحّدة لمنتج معيّن، حدِّد نوع البيانات المنظّمة MerchantReturnPolicy ضمن النوع Offer . تجدر الإشارة إلى أنّ السمات المتوافقة مع سياسات الإرجاع على مستوى العرض ليست إلا مجموعة فرعية من تلك المتوافقة مع سياسات الإرجاع على مستوى المؤسسة.
 راجِع ترميز بيانات التاجر للاطّلاع على المجموعة الفرعية من السمات المتوافقة مع سياسات الإرجاع على مستوى المنتج.
 

# تعريفات أنواع البيانات المنظّمة

 يجب تضمين السمات المطلوبة لكي تصبح البيانات المنظَّمة مؤهَّلة للاستخدام في "بحث Google". ويمكنك أيضًا تضمين السمات التي يُنصح بها لإضافة المزيد من المعلومات المتعلّقة بسياسات الإرجاع، ما يؤدي إلى تحسين تجربة المستخدم.

 

# ‫ MerchantReturnPolicy (المُدرج ضمن النوع Organization باستخدام السمة hasMerchantReturnPolicy )

 يمكنك استخدام السمات التالية لوصف سياسات الإرجاع الموحَّدة المُتّبعة في مؤسستك.
 
 
 السمات المطلوبة (حدِّد الخيار الأكثر ملاءمةً لحالة الاستخدام الخاصة بك) 
 
 
 الخيار (أ) 

 
 applicableCountry 
 
 Text 

 تمثّل هذه السمة رمز البلد الذي تنطبق عليه سياسة الإرجاع (وهو البلد الذي يتم بيع المنتج فيه وسيتم إرجاعه منه).
 استخدِم تنسيق رمز البلد ISO 3166-1 alpha-2 المكوّن من حرفَين. يمكنك تحديد 50 بلدًا كحد أقصى.

 
 

 
 returnPolicyCategory 
 
 MerchantReturnEnumeration 

 تمثّل هذه السمة نوع سياسة الإرجاع. استخدِم إحدى القيم التالية:

 
 
- ‫ https://schema.org/MerchantReturnFiniteReturnWindow : يجب إرجاع المنتج خلال عدد محدّد من الأيام. 
 
- ‫ https://schema.org/MerchantReturnNotPermitted : المرتجعات غير مسموح بها. 
 
- ‫ https://schema.org/MerchantReturnUnlimitedWindow : مهلة إرجاع المنتج غير محدودة. 
 

 
 في حال استخدام السمة MerchantReturnFiniteReturnWindow ، يجب إدخال السمة
 merchantReturnDays .
 

 
 

 الخيار (ب) 

 
 merchantReturnLink 
 
 URL 

 
 حدِّد عنوان URL لصفحة ويب توضّح لعملائك سياسة الإرجاع. ويمكن أن تكون عبارة عن سياسة إرجاع خاصة بك أو سياسة إرجاع خاصة بخدمة تابعة لجهة خارجية تعالج عمليات الإرجاع.
 

 
 

 
 

 

# المهل المحدودة أو غير المحدودة لإرجاع المشتريات

 يُنصح باستخدام السمات التالية عند ضبط returnPolicyCategory على MerchantReturnFiniteReturnWindow أو MerchantReturnUnlimitedWindow .

 
 
 السمات المقترَحة 
 
 
 
 merchantReturnDays 
 
 
 Integer 
 

 تمثّل هذه السمة عدد الأيام التي يمكن خلالها إرجاع المنتج بدءًا من تاريخ التسليم. يجب استخدام هذه السمة فقط في حال كانت قيمة returnPolicyCategory تساوي MerchantReturnFiniteReturnWindow .

 
 

 
 returnFees 
 
 ReturnFeesEnumeration 

 تمثّل هذه السمة النوع التلقائي لرسوم الإرجاع. استخدِم إحدى القيم التالية المتوافقة:

 
 
- ‫ https://schema.org/FreeReturn : ليس على المستخدم دفع أي رسوم مقابل إرجاع المنتج. في حال استخدام هذه القيمة، لا تضمِّن السمة returnShippingFeesAmount . 
 
- ‫ https://schema.org/ReturnFeesCustomerResponsibility : على المستهلك معالجة عملية شحن المرتجعات ودفع تكلفتها بنفسه. في حال استخدام هذه القيمة، لا تضمِّن السمة returnShippingFeesAmount . 
 
- ‫ https://schema.org/ReturnShippingFees : يفرض التاجر رسوم شحن على المستهلك مقابل إرجاع المنتج. حدِّد تكلفة الشحن (على ألّا تكون صفرًا) باستخدام السمة returnShippingFeesAmount . 
 

 
 

 
 returnMethod 
 
 ReturnMethodEnumeration 

 تمثّل هذه السمة طريقة الإرجاع التي توفّرها. يمكنك استخدام قيمة أو أكثر من القيم التالية:

 
 
- ‫ https://schema.org/ReturnAtKiosk : يمكن إرجاع السلعة عبر كشك. 
 
- ‫ https://schema.org/ReturnByMail : يمكن إرجاع السلعة بالبريد. 
 
- ‫ https://schema.org/ReturnInStore : يمكن إرجاع السلعة في المتجر. 
 

 
 

 
 returnShippingFeesAmount 
 
 MonetaryAmount 

 تمثّل هذه السمة تكلفة الشحن مقابل إرجاع المنتج. يجب تحديد السمة فقط في حال كانت قيمة returnFees تساوي https://schema.org/ReturnShippingFees .
 

 
 

 
 

 

# المهل المحدودة أو غير المحدودة لإرجاع المشتريات

 يُنصح أيضًا باستخدام السمات التالية في حال تحديد returnPolicyCategory ضمن MerchantReturnFiniteReturnWindow أو MerchantReturnUnlimitedWindow .

 
 
 السمات المقترَحة 
 
 
 
 customerRemorseReturnFees 
 
 ReturnFeesEnumeration 

 تمثّل هذه السمة نوعًا محددًا من رسوم الإرجاع يتم تطبيقه عند إرجاع المنتج بسبب شعور المستهلك بالندم.
 راجِع returnFees للاطّلاع على القيم المحتمَلة.

 
 

 
 customerRemorseReturnLabelSource 
 
 ReturnLabelSourceEnumeration 

 
 تمثّل هذه السمة الطريقة التي سيحصل المستهلك من خلالها على ملصق شحن المرتجعات لأحد المنتجات.
 راجِع returnLabelSource للاطّلاع على القيم المحتمَلة.
 

 
 

 
 customerRemorseReturnShippingFeesAmount 
 
 MonetaryAmount 

 
 تمثّل هذه السمة تكلفة الشحن لإرجاع منتج بسبب شعور المشتري بالندم. يجب استخدام هذه السمة فقط إذا كان مطلوبًا من المستهلك دفع رسوم شحن لا تساوي صفرًا مقابل إرجاع المنتج.
 ولمزيد من التفاصيل، يمكنك الاطّلاع على returnShippingFeesAmount .
 

 
 

 
 itemCondition 
 
 OfferItemCondition 

 
 تمثّل هذه السمة الحالات المقبولة للسلع التي يمكن إرجاعها. ويمكنك تقديم حالات متعددة تكون مقبولة لديك.
 استخدِم القيم التالية:
 

 
 
- ‫ https://schema.org/DamagedCondition : يُقبل إرجاع السلع التالفة. 
 
- ‫ https://schema.org/NewCondition : يُقبل إرجاع السلع الجديدة. 
 
- ‫ https://schema.org/RefurbishedCondition : يُقبل إرجاع السلع المجدَّدة. 
 
- ‫ https://schema.org/UsedCondition : يُقبل إرجاع السلع المستعملة. 
 

 
 

 
 itemDefectReturnFees 
 
 ReturnFeesEnumeration 

 تمثّل هذه السمة نوعًا محددًا من رسوم الإرجاع ينطبق على المنتجات التي تتضمّن عيوبًا. راجِع returnFees للاطّلاع على القيم المحتمَلة.

 
 

 
 itemDefectReturnLabelSource 
 
 ReturnLabelSourceEnumeration 

 
 تمثّل هذه السمة الطريقة التي سيحصل المستهلك من خلالها على ملصق شحن المرتجعات لأحد المنتجات.
 راجِع returnLabelSource للاطّلاع على القيم المحتمَلة.
 

 
 

 
 itemDefectReturnShippingFeesAmount 
 
 MonetaryAmount 

 
 تمثّل هذه السمة تكلفة الشحن لإرجاع منتج يتضمّن عيوبًا. يجب استخدام هذه السمة فقط إذا كان مطلوبًا من المستهلك دفع رسوم شحن لا تساوي صفرًا مقابل إرجاع المنتج.
 ولمزيد من التفاصيل، يمكنك الاطّلاع على returnShippingFeesAmount .
 

 
 

 
 refundType 
 
 RefundType 

 تمثّل هذه السمة طُرق رد الأموال المتاحة للمستهلك عندما يُرجع منتجًا.

 
 
- ‫ https://schema.org/ExchangeRefund : يمكن استبدال السلعة بالمنتج نفسه. 
 
- ‫ https://schema.org/FullRefund : يمكن استرداد كامل المبلغ المدفوع. 
 
- ‫ https://schema.org/StoreCreditRefund : يمكن الحصول على رصيد في المتجر مقابل إرجاع السلعة. 
 

 
 

 
 restockingFee 
 
 السمة MonetaryAmount أو السمة Number 

 تمثّل هذه السمة رسوم إعادة التخزين التي يتم فرضها على المستخدم عند إرجاع منتج. حدِّد قيمة من النوع Number لفرض نسبة مئوية من السعر الذي دفعه المستهلك أو استخدِم MonetaryAmount لفرض مبلغ ثابت.

 
 

 
 returnLabelSource 
 
 ReturnLabelSourceEnumeration 

 
 تمثّل هذه السمة الطريقة التي سيحصل المستهلك من خلالها على ملصق شحن المرتجعات لأحد المنتجات. استخدِم إحدى القيم التالية:
 

 
 
- ‫ https://schema.org/ReturnLabelCustomerResponsibility :
 يكون المستهلك مسؤولاً عن إنشاء ملصق الإرجاع.
 
 
- ‫ https://schema.org/ReturnLabelDownloadAndPrint :
 على المستهلك تنزيل ملصق الإرجاع وطباعته.
 
 
- ‫ https://schema.org/ReturnLabelInBox :
 ملصق الإرجاع كان مضمَّنًا مع المنتج عند شحنه.
 
 

 
 

 
 returnPolicyCountry 
 
 Text 

 
 تمثّل هذه السمة البلد الذي يجب إرسال المرتجعات إليه. ويمكن أن يكون هذا البلد مختلفًا عن البلد الأصلي الذي تم شحن المنتج أو إرساله إليه.
 وتستخدم هذه السمة تنسيق رمز البلد وفق معيار ISO 3166-1 alpha-2 . يمكنك تحديد 50 بلدًا كحد أقصى.

 
 

 
 

 

# سمات الاستثناءات الموسمية

 يجب استخدام السمات التالية عندما تحتاج إلى تحديد استثناءات موسمية لتجاهُل سياسات الإرجاع على مستوى المؤسسة.

 
 
 السمات المطلوبة 
 
 
 
 returnPolicySeasonalOverride 
 
 MerchantReturnPolicySeasonalOverride 

 تمثّل هذه السمة استثناءً موسميًا لسياسة الإرجاع، وتُستخدم لتحديد سياسات الإرجاع المرتبطة بأحداث خاصة، مثل الأعياد.
 على سبيل المثال، إذا ضبطت فئة سياسة الإرجاع المعتادة على MerchantReturnPolicyUnlimitedWindow ولكنك أردت خفض مهلة إرجاع المشتريات خلال فترة الأعياد:
 

 
 "returnPolicySeasonalOverride" : { 
 "@type" : "MerchantReturnPolicySeasonalOverride" , 
 "startDate" : "2024-11-29" , 
 "endDate" : "2024-12-06" , 
 "merchantReturnDays" : 10 , 
 "returnPolicyCategory" : "https://schema.org/MerchantReturnFiniteReturnWindow" 
 } 
 
 
 في ما يلي طريقة تحديد استثناءات موسمية متعددة. في هذا المثال، نرى أنّ سياسة الإرجاع المعتادة
 غير محدودة، ولكنّها تكون محدودة خلال النطاقين الزمنيين التاليين:
 

 
 "returnPolicySeasonalOverride" : [{ 
 "@type" : "MerchantReturnPolicySeasonalOverride" , 
 "startDate" : "2024-11-29" , 
 "endDate" : "2024-12-06" , 
 "merchantReturnDays" : 10 , 
 "returnPolicyCategory" : "https://schema.org/MerchantReturnFiniteReturnWindow" 
 }, 
 { 
 "@type" : "MerchantReturnPolicySeasonalOverride" , 
 "startDate" : "2024-12-26" , 
 "endDate" : "2025-01-06" , 
 "merchantReturnDays" : 10 , 
 "returnPolicyCategory" : "https://schema.org/MerchantReturnFiniteReturnWindow" 
 }] 
 
 
 
 

 
 returnPolicySeasonalOverride.returnPolicyCategory 
 
 MerchantReturnEnumeration 

 تمثّل هذه السمة نوع سياسة الإرجاع. استخدِم إحدى القيم التالية:

 
 
- ‫ https://schema.org/MerchantReturnFiniteReturnWindow : يجب إرجاع المنتج خلال عدد محدّد من الأيام. 
 
- ‫ https://schema.org/MerchantReturnNotPermitted : المرتجعات غير مسموح بها. 
 
- ‫ https://schema.org/MerchantReturnUnlimitedWindow : مهلة إرجاع المنتج غير محدودة. 
 

 
 في حال استخدام السمة MerchantReturnFiniteReturnWindow ، يجب إدخال السمة
 merchantReturnDays .
 

 
 

 
 

 يُنصح باستخدام السمات التالية عندما تحتاج إلى تحديد استثناءات موسمية لتجاهُل سياسات الإرجاع على مستوى المؤسسة.

 
 
 السمات المقترَحة 
 
 
 
 returnPolicySeasonalOverride.endDate 
 
 
 ‫ Date أو DateTime 
 

 تمثّل هذه السمة تاريخ انتهاء الاستثناء الموسمي.

 
 

 
 returnPolicySeasonalOverride.merchantReturnDays 
 
 ‫ Integer أو
 Date أو
 DateTime 
 

 تمثّل هذه السمة عدد الأيام التي يمكن خلالها إرجاع المنتج بدءًا من تاريخ التسليم. يجب استخدام هذه السمة فقط في حال ضبط returnPolicyCategory على MerchantReturnFiniteReturnWindow .
 

 
 

 
 returnPolicySeasonalOverride.startDate 
 
 ‫ Date أو DateTime 
 

 تمثّل هذه السمة تاريخ بدء الاستثناء الموسمي.

 
 

 
 

 

# 
 أسلوب بديل لضبط إعدادات الإرجاع باستخدام Google
 

 
 يمكن أن تصبح سياسات الإرجاع لدى بائعي التجزئة معقّدة، وقد تتغير بشكل متكرر. إذا كنت تواجه
 مشكلة في الإشارة إلى تفاصيل الإرجاع وتحديثها باستخدام الترميز
 ولديك حساب على Google Merchant Center، ننصحك
 بضبط سياسات الإرجاع في Google Merchant Center. يمكنك بدلاً من ذلك ضبط
 سياسات الإرجاع في Search Console على مستوى الحساب،
 وستتم إضافتها تلقائيًا إلى Merchant Center.
 

 

# الجمع بين إعدادات متعددة للإرجاع

 
 في حال الجمع بين إعدادات متعددة للإرجاع، يُرجى الالتفات إلى أنّه قد يتم تجاهُل معلومات السياسات بناءً على ترتيب الأولوية. فمثلاً، إذا قدّمت
 ترميز سياسة الإرجاع على موقعك الإلكتروني وأضفت إعدادات سياسة الإرجاع في Search Console، سيستخدم محرّك بحث Google المعلومات المقدّمة في Search Console فقط.
 

 
 يستخدم محرّك بحث Google الترتيب التالي للأولوية (من الأهم إلى الأقل أهمية):
 

 
 
- ‫Content API for Shopping ( إعدادات الإرجاع ) 
 
- الإعدادات في Merchant Center أو Search Console 
 
- ترميز بطاقة بيانات التاجر على مستوى المنتج 
 
- الترميز على مستوى المؤسسة 
 

 
 
 

# تحديد المشاكل وحلّها

 
 إذا كنت تواجه مشكلة في تطبيق البيانات المنظَّمة أو تصحيح الأخطاء فيها، إليك بعض المراجع التي قد تساعدك.
 

 
 
- إذا كنت تستخدم نظام إدارة محتوى (CMS) أو تستعين بشخص لإدارة موقعك الإلكتروني،
 اطلب المساعدة من هذه الجهات. واحرص على إعادة توجيه أي رسائل في Search Console توضّح المشكلة. 
 
- لا يضمن محرك بحث Google ظهور الميزات التي تستخدم البيانات المنظَّمة ضمن نتائج البحث.
 للاطّلاع على قائمة بالأسباب الشائعة التي قد تؤدي إلى عدم عرض المحتوى في نتيجة غنية بصريًا على "بحث Google"، يمكنك مراجعة الإرشادات العامة للبيانات المنظَّمة . 
 
- قد يكون هناك خطأ في بياناتك المنظَّمة. اطّلِع على
 قائمة أخطاء البيانات المنظَّمة 
 و تقرير البيانات المنظَّمة غير القابلة للتحليل . 
 
- إذا تم اتخاذ إجراء يدوي بحق البيانات المنظَّمة على صفحتك، سيتم تجاهُل البيانات المنظَّمة المتاحة على الصفحة (مع إمكانية استمرار ظهور الصفحة في نتائج البحث من Google). لحلّ
 المشاكل المتعلقة بالبيانات المنظّمة ،
 استخدِم تقرير "الإجراءات اليدوية" .
 
 
- راجِع الإرشادات مرة أخرى لتحديد ما إذا كان المحتوى الخاص بك غير متوافق مع الإرشادات. قد يكون السبب في المشكلة هو تضمين محتوى غير مرغوب فيه أو استخدام ترميز غير مرغوب فيه.
 وقد لا تكون المشكلة مرتبطة بالبنية، ما قد يؤدي إلى عدم إمكانية
 تحديد هذه المشاكل من خلال "اختبار النتائج الغنية بصريًا".
 
 
- حاوِل تحديد وحل مشكلة عدم ظهور بعض النتائج الغنية بصريًا/الانخفاض في إجمالي النتائج الغنية بصريًا . 
 
- تحتاج عملية إعادة الزحف والفهرسة إلى بعض الوقت. وتذكَّر أنّ محرّك بحث Google قد يستغرق عدّة أيام من تاريخ نشر الصفحة للعثور عليها والزحف إليها. للاطّلاع على الأسئلة العامة حول الزحف والفهرسة، يمكنك مراجعة
 الأسئلة الشائعة حول الزحف والفهرسة في "بحث Google‏" .
 
 
- يمكنك نشر أي سؤال في منتدى "مجموعة خدمات بحث Google" . 
 

 
 
 
 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 إرسال ملاحظات
