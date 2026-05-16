---
url: https://developers.google.com/search/docs/appearance/structured-data/faqpage
title: "FAQ ( FAQPage , Question , Answer ) structured data"
fetched_at: 2026-05-16T16:52:40.722Z
seed: false
---

# FAQ ( FAQPage , Question , Answer ) structured data

Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage

- 
 
 
 
 
 
 
 
 Home
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Send feedback
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 

# FAQ ( FAQPage , Question , Answer ) structured data

 
 
 Upcoming deprecation: As of May 7, 2026, FAQ rich results are no longer appearing in Google
 Search. We will be dropping the FAQ search appearance, rich result report, and support in the Rich
 results test in June 2026. To allow time for adjusting your API calls, support for the FAQ rich
 result in the Search Console API will be removed in August 2026.

 
 
 If your government-focused or health-focused site has a list of questions and answers, you can use
 FAQPage structured data to help people find that information on Google. Properly
 marked up FAQ pages may be eligible to have a rich result on Search and an
 Action on the Google Assistant , which
 can help your site reach the right users.

 
 Does your site allow users to submit answers to a single question? Use
 QAPage structured data instead.

# Feature availability

 
 FAQ rich results are only available for well-known, authoritative websites that are government-focused
 or health-focused. The feature is available on desktop and mobile devices in all
 countries and languages where Google Search is available.

 

# 
 How to add structured data
 

 
 Structured data is a standardized format for providing information about a page and classifying the page
 content. If you're new to structured data, you can learn more about
 how structured data works .
 

 
 Here's an overview of how to build, test, and release structured data.

 
 
- Add the required properties . Based on the
 format you're using, learn where to insert structured data on the page .
 
 Using a CMS? It may be easier to use a plugin that's integrated into your CMS.
 

 Using JavaScript? Learn how to
 generate structured data with JavaScript .

 
 
- Follow the guidelines . 
 
- Validate your code using the
 Rich Results Test 
 and fix any critical errors. Consider also fixing any non-critical issues that may be flagged
 in the tool, as they can help improve the quality of your structured data (however, this isn't necessary to be eligible for rich results). 
 
- Deploy a few pages that include your structured data and use the URL Inspection tool to test how Google sees the page. Be sure that your page is
 accessible to Google and not blocked by a robots.txt file, the noindex tag, or
 login requirements. If the page looks okay, you can
 ask Google to recrawl your URLs .
 Note : Allow time for re-crawling and re-indexing. Remember that it
 may take several days after publishing a page for Google to find and crawl it.

 
 
- To keep Google informed of future changes, we recommend that you
 submit a sitemap . You can automate this with the
 Search Console Sitemap API . 
 

 

# Examples

 
 
 JSON-LD 
 Here's an example of FAQPage in JSON-LD:

 <html>
 <head>
 <title>Finding an apprenticeship - Frequently Asked Questions(FAQ)</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 "mainEntity": [{
 "@type": "Question",
 "name": "How to find an apprenticeship?",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "<p>We provide an official service to search through available apprenticeships. To get started, create an account here, specify the desired region, and your preferences. You will be able to search through all officially registered open apprenticeships.</p>"
 }
 }, {
 "@type": "Question",
 "name": "Whom to contact?",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "You can contact the apprenticeship office through our official phone hotline above, or with the web-form below. We generally respond to written requests within 7-10 days."
 }
 }]
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Finding an apprenticeship - Frequently Asked Questions(FAQ)</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 "mainEntity": [{
 "@type": "Question",
 "name": "How to find an apprenticeship?",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "<p>We provide an official service to search through available apprenticeships. To get started, create an account here, specify the desired region, and your preferences. You will be able to search through all officially registered open apprenticeships.</p>"
 }
 }, {
 "@type": "Question",
 "name": "Whom to contact?",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "You can contact the apprenticeship office through our official phone hotline above, or with the web-form below. We generally respond to written requests within 7-10 days."
 }
 }]
 }
 </script>
 </head>
 <body>
 </body>
</html>
