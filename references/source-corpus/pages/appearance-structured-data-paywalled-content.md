---
url: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content
title: "Structured Data สําหรับการสมัครใช้บริการและเนื้อหาเพย์วอลล์ ( CreativeWork )"
fetched_at: 2026-05-16T16:53:12.533Z
seed: false
---

# Structured Data สําหรับการสมัครใช้บริการและเนื้อหาเพย์วอลล์ ( CreativeWork )

Source: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content

- 
 
 
 
 
 
 
 
 หน้าแรก
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 ส่งความคิดเห็น
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Structured Data สําหรับการสมัครใช้บริการและเนื้อหาเพย์วอลล์ ( CreativeWork )

 
 
 หน้านี้จะอธิบายวิธีใช้ JSON-LD ของ schema.org เพื่อระบุเนื้อหาเพย์วอลล์ในเว็บไซต์โดยใช้พร็อพเพอร์ตี้ CreativeWork Structured Data นี้ช่วยให้ Google ทราบว่านี่คือเนื้อหาเพย์วอลล์ ไม่ใช่ การปิดบังหน้าเว็บจริง ซึ่งเป็นแนวทางปฏิบัติที่ละเมิด นโยบายสแปม 
 ดูข้อมูลเพิ่มเติมเกี่ยวกับ การสมัครรับข้อมูลและเนื้อหาเพย์วอลล์ 

 
 คำแนะนำนี้ใช้เฉพาะกับเนื้อหาที่ต้องการให้ทำการ Crawl และจัดทําดัชนีเท่านั้น คุณข้ามคำแนะนำนี้ไปได้เลยหากไม่ต้องการให้มีการจัดทําดัชนีเนื้อหาเพย์วอลล์

# ตัวอย่าง

 ด้านล่างนี้เป็นตัวอย่างของ Structured Data NewsArticle ที่มีเนื้อหาเพย์วอลล์
 

 <html>
 <head>
 <title>Article headline</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "NewsArticle",
 "headline": "Article headline",
 "image": "https://example.org/thumbnail1.jpg",
 "datePublished": "2025-02-05T08:00:00+08:00",
 "dateModified": "2025-02-05T09:20:00+08:00",
 "author": {
 "@type": "Person",
 "name": "John Doe",
 "url": "https://example.com/profile/johndoe123"
 },
 "description": "A most wonderful article",
 "isAccessibleForFree": false,
 "hasPart":
 {
 "@type": "WebPageElement",
 "isAccessibleForFree": false,
 "cssSelector" : ".paywall"
 }
 }
 </script>
 </head>
 <body>
 <div class="non-paywall">
 Non-Paywalled Content
 </div>
 <div class="paywall">
 Paywalled Content
 </div>
 </body>
</html> 
 
 <html>
 <head>
 <title>Article headline</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "NewsArticle",
 "headline": "Article headline",
 "image": "https://example.org/thumbnail1.jpg",
 "datePublished": "2025-02-05T08:00:00+08:00",
 "dateModified": "2025-02-05T09:20:00+08:00",
 "author": {
 "@type": "Person",
 "name": "John Doe",
 "url": "https://example.com/profile/johndoe123"
 },
 "description": "A most wonderful article",
 "isAccessibleForFree": false,
 "hasPart":
 {
 "@type": "WebPageElement",
 "isAccessibleForFree": false,
 "cssSelector" : ".paywall"
 }
 }
 </script>
 </head>
 <body>
 <div class="non-paywall">
 Non-Paywalled Content
 </div>
 <div class="paywall">
 Paywalled Content
 </div>
 </body>
</html>
 

# หลักเกณฑ์

 
 คุณต้องทำตาม หลักเกณฑ์ทั่วไปเกี่ยวกับ Structured Data และ หลักเกณฑ์ทางเทคนิค เพื่อให้หน้าเว็บของคุณมีสิทธิ์แสดงในผลการค้นหา นอกจากนี้เนื้อหาเพย์วอลล์จะต้องเป็นไปตามหลักเกณฑ์ต่อไปนี้ด้วย

 หมายเหตุ : หากคุณละเมิดนโยบายเหล่านี้ หน้าเว็บอาจไม่มีสิทธิ์แสดงในผลการค้นหาของ Search อ่านข้อมูลเพิ่มเติมได้ใน Structured Markup ที่เป็นสแปม 

 
 
- 
 รูปแบบ JSON-LD และ Microdata เป็นวิธีที่ยอมรับในการใช้ระบุ Structured Data สำหรับเนื้อหาเพย์วอลล์
 
 
- 
 อย่าฝังส่วนต่างๆ ของเนื้อหา
 
 
- 
 ใช้เครื่องมือเลือก .class สำหรับพร็อพเพอร์ตี้ cssSelector เท่านั้น
 
 
- 
 หากไม่ต้องการให้เบราว์เซอร์เข้าถึงเนื้อหาได้ในขณะที่แสดงเนื้อหา ให้เลือกใช้เพย์วอลล์ที่ไม่แสดงเนื้อหาเพย์วอลล์ต่อเบราว์เซอร์ หากคุณใช้โซลูชัน JavaScript ฝั่งไคลเอ็นต์ โปรดดู คำแนะนำเกี่ยวกับการใช้ JavaScript เพื่อติดตั้งใช้งานเนื้อหาที่ต้องชำระเงิน 

# เพิ่มมาร์กอัปไปยังเนื้อหาเพย์วอลล์

 
 หากต้องมี การสมัครรับข้อมูลเพื่อเข้าถึง เนื้อหาในเว็บไซต์ หรือผู้ใช้ต้องลงทะเบียนเพื่อเข้าถึงเนื้อหาที่คุณต้องการให้จัดทำดัชนี โปรดทำตามขั้นตอนเหล่านี้ ตัวอย่างต่อไปนี้ใช้กับ Structured Data NewsArticle ตรวจสอบว่าคุณได้ทำตามขั้นตอนเหล่านี้กับหน้าเว็บทุกเวอร์ชัน (รวมถึง AMP และที่ไม่ใช่ AMP)

 
 
- 
 เพิ่มชื่อคลาสคร่อมส่วนเนื้อหาเพย์วอลล์แต่ละส่วนของหน้า เช่น
 
 < body >
< p>This content is outside a paywall and is visible to all . < / p >
< div class = "paywall" > This content is inside a paywall , and requires a subscription or registration . < / div >
< / body >
 
 
 
- 
 เพิ่ม Structured Data NewsArticle 
 
 
- 
 เพิ่ม Structured Data JSON-LD ที่ไฮไลต์ไว้ไปยัง Structured Data NewsArticle 
 หมายเหตุ : cssSelector จะอ้างอิงชื่อคลาสที่คุณเพิ่มในขั้นตอนที่ 1
 

 
 { 
 "@context" : "https://schema.org" , 
 "@type" : "NewsArticle" , 
 "mainEntityOfPage" : { 
 "@type" : "WebPage" , 
 "@id" : "https://example.org/article" 
 }, 
 ( ... ) 
 "isAccessibleForFree" : false , 
 "hasPart" : { 
 "@type" : "WebPageElement" , 
 "isAccessibleForFree" : false , 
 "cssSelector" : ".paywall" 
 } 
 } 
 
 
 
- ตรวจสอบความถูกต้องของโค้ดโดยใช้ การทดสอบผลการค้นหาที่เป็นริชมีเดีย และแก้ไขข้อผิดพลาดที่สําคัญทั้งหมด
 

# ส่วนเพย์วอลล์หลายส่วน

 หากคุณมีเพย์วอลล์หลายส่วนในหน้าหนึ่งๆ ให้เพิ่มชื่อคลาสเป็นอาร์เรย์

 นี่คือตัวอย่างของส่วนเพย์วอลล์ใน 1 หน้า

 
 < body >
 < div class = "section1" > This content is inside a paywall , and requires a subscription or registration . < / div >
 < p>This content is outside a paywall and is visible to all . < / p >
 < div class = "section2" > This is another section that ' s inside a paywall , or requires a subscription or registration . < / div >
< / body >
 
 
 นี่คือตัวอย่างของ Structured Data NewsArticle ที่มีส่วนเพย์วอลล์หลายส่วน

 
 { 
 "@context" : "https://schema.org" , 
 "@type" : "NewsArticle" , 
 "mainEntityOfPage" : { 
 "@type" : "WebPage" , 
 "@id" : "https://example.org/article" 
 }, 
 ( ... ) 
 "isAccessibleForFree" : false , 
 "hasPart" : [ 
 { 
 "@type" : "WebPageElement" , 
 "isAccessibleForFree" : false , 
 "cssSelector" : ".section1" 
 }, { 
 "@type" : "WebPageElement" , 
 "isAccessibleForFree" : false , 
 "cssSelector" : ".section2" 
 } 
 ] 
 } 
 

# ประเภทที่รองรับ

 
 มาร์กอัปนี้ใช้ได้สำหรับประเภท CreativeWork หรือประเภท CreativeWork ที่เจาะจงมากขึ้นอย่างใดอย่างหนึ่งดังต่อไปนี้

 
 
- 
 Article 
 
 
- 
 NewsArticle 
 
 
- 
 Blog 
 
 
- 
 Comment 
 
 
- 
 Course 
 
 
- 
 HowTo 
 
 
- 
 Message 
 
 
- 
 Review 
 
 
- 
 WebPage 
 

 คุณใช้ schema.org ได้หลายประเภท ดังตัวอย่างต่อไปนี้

 "@type": ["Article", "LearningResource"] 

 คุณต้องใส่พร็อพเพอร์ตี้ที่จำเป็นเพื่อให้ Google รู้ว่าบทความมีเนื้อหาเพย์วอลล์ คุณอาจใส่พร็อพเพอร์ตี้ที่แนะนำเพื่อให้มีความละเอียดยิ่งขึ้นว่าส่วนใดของหน้าที่อยู่หลังเพย์วอลล์ (หรือต้องมีการสมัครใช้บริการหรือการลงทะเบียน)

 
 
 
 พร็อพเพอร์ตี้ที่จำเป็น 

 
 
 
 
 isAccessibleForFree 
 
 Boolean 

 ทุกคนเข้าถึงบทความได้หรือไม่ หรือบทความอยู่หลังเพย์วอลล์ (หรือต้องมีการสมัครใช้บริการหรือการลงทะเบียน) ตั้งค่าพร็อพเพอร์ตี้ isAccessibleForFree เป็น false เพื่อระบุว่าส่วนนี้อยู่หลังเพย์วอลล์

 
 

 

 
 
 
 พร็อพเพอร์ตี้ที่แนะนำ 

 
 
 
 
 hasPart.cssSelector 
 
 
 CssSelectorType 

 ตัวเลือก CSS ที่อ้างอิงชื่อคลาสที่คุณ ตั้งค่าใน HTML เพื่อระบุส่วนเพย์วอลล์

 
 

 
 
 hasPart.@type 
 
 
 Text 

 ตั้งค่า @type เป็น WebPageElement 

 
 

 
 
 hasPart.isAccessibleForFree 
 
 
 Boolean 

 บทความส่วนนี้อยู่หลังเพย์วอลล์ (หรือต้องมีการสมัครใช้บริการหรือการลงทะเบียน) หรือไม่ ตั้งค่าพร็อพเพอร์ตี้ isAccessibleForFree เป็น False เพื่อระบุว่าส่วนนี้อยู่หลังเพย์วอลล์

 
 

 

# ข้อควรพิจารณาเกี่ยวกับ AMP

 ต่อไปนี้เป็นข้อควรพิจารณาหากคุณใช้หน้า AMP

 
 
- 
 หากคุณมีหน้า AMP ที่มีเนื้อหาเพย์วอลล์ ให้ใช้ amp-subscriptions ตามความเหมาะสม
 
 
- 
 ตรวจสอบว่าปลายทางของการให้สิทธิ์ได้อนุญาตการเข้าถึงเนื้อหาแก่บ็อตที่ถูกต้องจาก Google และบ็อตของเครื่องมือค้นหาอื่นๆ ซึ่งจะแตกต่างกันไปตามผู้เผยแพร่เนื้อหาแต่ละราย
 
 
- 
 ตรวจสอบว่านโยบายการเข้าถึงของบ็อตที่คุณใช้กับหน้า AMP และหน้าที่ไม่ใช่ AMP เหมือนกัน มิเช่นนั้นจะทำให้ข้อผิดพลาดเกี่ยวกับเนื้อหาที่ไม่ตรงกันปรากฏใน Search Console ได้
 

# ข้อควรพิจารณาเกี่ยวกับ Generative AI ใน Search

 
 ข้อมูลภาพรวมโดย AI และโหมด AI จะแสดงตัวอย่างหัวข้อหรือการค้นหาโดยอิงตามแหล่งที่มาต่างๆ รวมถึงแหล่งที่มาของเว็บ
 เนื้อหาดังกล่าวจึงขึ้นอยู่กับ การควบคุมการแสดงตัวอย่าง ของ Search

# ตรวจสอบว่า Google รวบรวมข้อมูลและจัดทำดัชนีหน้าเว็บได้

 
 หากต้องการให้ Google ทำการ Crawl และจัดทำดัชนีเนื้อหา ซึ่งรวมถึงส่วนที่มีเพย์วอลล์ โปรดตรวจสอบว่า Googlebot และ Googlebot-News (หากมี) เข้าถึงหน้าเว็บได้

 
 ใช้ เครื่องมือตรวจสอบ URL เพื่อทดสอบว่า Google ทำการ Crawl และแสดงผล URL ในเว็บไซต์ได้

# ควบคุมข้อมูลที่จะแสดงในผลการค้นหา

 
 หากไม่ต้องการให้เนื้อหาบางส่วนแสดงรวมอยู่ในตัวอย่างผลการค้นหา ให้ใช้ แอตทริบิวต์ data-nosnippet ของ HTML 
 นอกจากนี้คุณยังจำกัดจำนวนอักขระของตัวอย่างผลการค้นหาได้โดยใช้ แท็ก meta max-snippet ของ robots 

 
 

# การแก้ปัญหา

 
 หากประสบปัญหาในการใช้หรือแก้ไขข้อบกพร่องของ Structured Data โปรดดูแหล่งข้อมูลต่อไปนี้ซึ่งอาจช่วยคุณได้
 

 
 
- หากคุณใช้ระบบจัดการเนื้อหา (CMS) หรือมีผู้อื่นดูแลเว็บไซต์ ให้ขอความช่วยเหลือจากฝ่ายสนับสนุนของระบบหรือผู้ดูแลเว็บดังกล่าว และอย่าลืมส่งต่อข้อความจาก Search Console ที่ระบุรายละเอียดปัญหาด้วย 
 
- Google ไม่รับประกันว่าฟีเจอร์ที่ใช้ Structured Data จะแสดงในผลการค้นหา
 ดูรายการสาเหตุทั่วไปที่ Google อาจไม่แสดงเนื้อหาของคุณเป็นผลการค้นหาที่เป็นริชมีเดียได้ใน หลักเกณฑ์ทั่วไปเกี่ยวกับ Structured Data 
 
- Structured Data ของคุณอาจมีข้อผิดพลาดอยู่ ตรวจสอบ รายการข้อผิดพลาดของ Structured Data และ รายงาน Structured Data ที่แยกวิเคราะห์ไม่ได้ 
 
- หากมีการดำเนินการกับ Structured Data โดยเจ้าหน้าที่ในหน้าของคุณ ระบบจะไม่สนใจ Structured Data ในหน้าดังกล่าว (แม้ว่าหน้าจะยังปรากฏในผลการค้นหาของ Google Search ก็ตาม) วิธีแก้ ปัญหาเกี่ยวกับ Structured Data คือใช้ รายงานการดำเนินการโดยเจ้าหน้าที่ 
 
 
- อ่าน หลักเกณฑ์ อีกครั้งเพื่อดูว่าเนื้อหาของคุณละเมิดหลักเกณฑ์หรือไม่ ปัญหาอาจเกิดจากเนื้อหาที่เป็นสแปมหรือการใช้มาร์กอัปที่เป็นสแปม
 อย่างไรก็ตาม ปัญหาอาจไม่ได้เป็นปัญหาด้านไวยากรณ์ ซึ่งทำให้การทดสอบผลการค้นหาที่เป็นริชมีเดียระบุปัญหาเหล่านั้นไม่ได้
 
 
- แก้ปัญหาเกี่ยวกับผลการค้นหาที่เป็นริชมีเดียขาดหายไป/จำนวนรวมของผลการค้นหาที่เป็นริชมีเดียลดลง 
 
- ขอให้อดทนรอระหว่างที่เราทำการ Crawl และจัดทำดัชนีอีกครั้ง และโปรดทราบว่าหลังจากที่คุณเผยแพร่หน้าหนึ่งๆ แล้ว อาจใช้เวลาหลายวันกว่า Google จะพบและทำการ Crawl หน้าดังกล่าว ดูคำถามทั่วไปเกี่ยวกับการรวบรวมข้อมูลและการจัดทำดัชนีได้ใน คำถามที่พบบ่อยเกี่ยวกับการรวบรวมข้อมูลและการจัดทำดัชนีของ Google Search 
 
 
- โพสต์คำถามใน ฟอรัม Google Search Central 
 

 
 

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 ส่งความคิดเห็น
