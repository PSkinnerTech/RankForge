---
url: https://developers.google.com/search/docs/appearance/signed-exchange
title: "Get started with signed exchanges on Google Search"
fetched_at: 2026-05-16T16:52:56.947Z
seed: false
---

# Get started with signed exchanges on Google Search

Source: https://developers.google.com/search/docs/appearance/signed-exchange

- 
 
 
 
 
 
 
 
 Home
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Send feedback
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 

# Get started with signed exchanges on Google Search

 
 
 Signed exchanges (SXG) allow
 Google Search to prefetch your content while preserving the user's privacy. In practice, this
 means that both AMP and non-AMP results shown on Google Search may prefetch a few key
 resources (such as HTML, JavaScript, CSS, images, or fonts) in a privacy-preserving manner,
 if the associated website supports SXG.

 
 When the user ultimately clicks the result, the web page starts rendering much sooner since
 key resources are already available, leading to a better user experience. This could mean a
 lower Largest Contentful Paint (LCP) score
 for your content, which can improve
 page experience overall.

# Implement SXG

 
 To implement SXG, follow web.dev's
 in-depth guide . After implementing, follow
 Chrome's guide to optimizing LCP using Signed Exchanges .

 
 For AMP pages, follow amp.dev's in-depth guide .

# Additional requirements for Google Search

 
 Google uses a cache of SXG to prefetch your content. Google may serve these cached SXG
 multiple times.

 
 To make sure that up-to-date content displays in Google Search, set the SXG expiration values
 appropriately. As a rule of thumb, make sure that the expiration date is less than both of these dates:

 
 
- The cache expiration determined by your HTTP headers 
 
- 1 day in the future if the content is JavaScript or inlines JavaScript; otherwise 7 days in the future 

 
 To make sure that content displays properly when served on multiple devices, do the following:

 
 
- Move personalized content, such as shopping carts, into lazy-loaded elements that are
 outside of the SXG. Alternatively, add the Vary: Cookie signed header;
 SXGs with this header will be shown only to visitors without a cookie for your site. 
 
- Build the pages with
 responsive web design .
 Alternatively, serve desktop and mobile pages on
 separate URLs , or annotate the
 pages to state that they aren't responsive, using the
 supported-media meta tag .
 For example, in the page's <head> element, add the following tag:
 
 <meta name=supported-media content="only screen and (max-width: 640px)">
 
 

# Monitor and debug SXG

 
 For a list of tools that you can use to debug SXG, check out web.dev's guide to SXG tools .

 
 In the event that Googlebot can't parse an SXG, it may recrawl the URL without application/signed-exchange;v=b3 
 in the Accept header, in order to retrieve the text/html variant. In
 the event of any SXG indexing error, Google Search will link to the original URL, without SXG.

 
 For AMP pages, use the AMP
 status report in Search Console to monitor SXG errors .

# Debug the Google SXG cache

 
 To determine whether SXG meets the cache requirements, use the
 SXG Validator Chrome extension .

 
 Alternatively, query the Google SXG cache directly.
 For example, if the SXG URL is https://signed-exchange-testing.dev/sxgs/valid.html , formulate
 the corresponding cache URL:

 
 https://signed--exchange--testing-dev.webpkgcache.com/doc/-/s/signed-exchange-testing.dev/sxgs/valid.html 

 
 The algorithm for computing the subdomain and the URL path suffix is the
 same as for the AMP Cache ,
 while the infix string /doc/-/ is different.

 
 If the response is a SXG, then this means the response from the origin server meets the
 Google SXG cache requirements .
 Otherwise, it will include an HTTP header that indicates the reason.

 
 
- If there is a Warning header, then it indicates an error that prevented the SXG from
 meeting the cache requirements. 
 
- If there is a Location header, then it has not yet been fetched by the cache. This is not
 an error in your SXG. 

 
 Regardless of the response, the cache enqueues a request to the original URL for an updated
 copy. There are several factors for when and if this request happens, including how fast
 Googlebot can crawl your site.

 
 Google doesn't cache SXGs for longer than the expires value of the SXG signature
 or the
 freshness
 lifetime of the unsigned headers of the SXG response.

 
 For AMP pages, you can use the
 URL Inspection Tool 
 to debug caching errors.

# Stay informed

 
 Subscribe to the webpackaging-announce 
 mailing list to stay up-to-date with the following changes:

 
 
- Changes to the Google SXG cache that enable new capabilities or deprecate other capabilities. 
 
- Major changes to the SXG tools Web Packager, NGINX SXG module, and libsxg. 

 
 If you have questions about SXG on Google Search, visit the
 Search Central Help Community .

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Send feedback
