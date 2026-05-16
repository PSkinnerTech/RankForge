---
url: https://developers.google.com/search/docs/appearance/structured-data/vacation-rental
title: "Vacation rental ( VacationRental ) structured data"
fetched_at: 2026-05-16T16:53:20.196Z
seed: false
---

# Vacation rental ( VacationRental ) structured data

Source: https://developers.google.com/search/docs/appearance/structured-data/vacation-rental

- 
 
 
 
 
 
 
 
 Home
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Send feedback
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 

# Vacation rental ( VacationRental ) structured data

 
 
 
 When you add structured data to your vacation rental listing pages, Google Search can show
 your listing in richer ways. Users can see listing information, such as the name, description,
 images, location, rating, reviews and more right in search results.

# 
 Before You Begin

 
 These instructions are intended for sites that have already connected with a Google Technical
 Account Manager and have access to the Hotel Center .
 If you're interested in integrating your vacation rental listings, you can fill out the
 vacation rental interest form .
 Filling out the form is an expression of interest and doesn't guarantee an invitation into the
 Early Adopters Program.

 
This feature is limited to sites that meet certain eligibility criteria and additional
 steps are required 
to complete the integration. To learn more about how to list your vacation rentals on Google,
visit the integration starter guide .

 

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
 

 

# 
 Example

 Here's an example of a simple vacation rental listing using JSON-LD.

 <html>
 <head>
 <title>My Beautiful Vacation Rental</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "VacationRental",
 "additionalType": "HolidayVillageRental",
 "brand": {
 "@type": "Brand",
 "name": "brandIdName"
 },
 "containsPlace": {
 "@type": "Accommodation",
 "additionalType": "EntirePlace",
 "bed": [{
 "@type": "BedDetails",
 "numberOfBeds" : 1,
 "typeOfBed": "Queen"
 },
 {
 "@type": "BedDetails",
 "numberOfBeds" : 2,
 "typeOfBed": "Single"
 }],
 "occupancy": {
 "@type": "QuantitativeValue",
 "value" : 2
 },
 "amenityFeature": [
 {
 "@type": "LocationFeatureSpecification",
 "name": "ac",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "airportShuttle",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "balcony",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "beachAccess",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "childFriendly",
 "value": true
 }
 ],
 "floorSize": {
 "@type": "QuantitativeValue",
 "value" : 75,
 "unitCode": "MTK"
 },
 "numberOfBathroomsTotal": 1,
 "numberOfBedrooms": 3,
 "numberOfRooms": 5
 },
 "identifier": "abc123",
 "latitude": "42.12345",
 "longitude": "101.12345",
 "name": "My Beautiful Vacation Rental",
 "address": {
 "addressCountry": "US",
 "addressLocality": "Mountain View",
 "addressRegion": "California",
 "postalCode": "94043",
 "streetAddress": "1600 Amphitheatre Pkwy, Unit 6E"
 },
 "aggregateRating": {
 "ratingValue": 4.5,
 "ratingCount": 10,
 "reviewCount": 3,
 "bestRating": 5
 },
 "image": [
 "https://example.com/mylisting/unit_image1.png",
 "https://example.com/mylisting/unit_image2.png",
 "https://example.com/mylisting/unit_image3.png",
 "https://example.com/mylisting/unit_image4.png",
 "https://example.com/mylisting/unit_image5.png",
 "https://example.com/mylisting/unit_image6.png",
 "https://example.com/mylisting/unit_image7.png",
 "https://example.com/mylisting/unit_image8.png"
 ],
 "checkinTime": "18:00:00+08:00",
 "checkoutTime": "11:00:00+08:00",
 "description": "A great Vacation Rental in the perfect neighborhood.",
 "knowsLanguage": ["en-US", "fr-FR"],
 "review": [{
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 4,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "Lillian Ruiz"
 },
 "datePublished": "2024-12-01",
 "contentReferenceTime": "2024-11-17"
 },
 {
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 5,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "John S."
 },
 "datePublished": "2024-10-01",
 "contentReferenceTime": "2024-09-28"
 }
 ]
 }
 </script>
 </head>
 <body></body>
 </html> 

 
 <html>
 <head>
 <title>My Beautiful Vacation Rental</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "VacationRental",
 "additionalType": "HolidayVillageRental",
 "brand": {
 "@type": "Brand",
 "name": "brandIdName"
 },
 "containsPlace": {
 "@type": "Accommodation",
 "additionalType": "EntirePlace",
 "bed": [{
 "@type": "BedDetails",
 "numberOfBeds" : 1,
 "typeOfBed": "Queen"
 },
 {
 "@type": "BedDetails",
 "numberOfBeds" : 2,
 "typeOfBed": "Single"
 }],
 "occupancy": {
 "@type": "QuantitativeValue",
 "value" : 2
 },
 "amenityFeature": [
 {
 "@type": "LocationFeatureSpecification",
 "name": "ac",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "airportShuttle",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "balcony",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "beachAccess",
 "value": true
 },
 {
 "@type": "LocationFeatureSpecification",
 "name": "childFriendly",
 "value": true
 }
 ],
 "floorSize": {
 "@type": "QuantitativeValue",
 "value" : 75,
 "unitCode": "MTK"
 },
 "numberOfBathroomsTotal": 1,
 "numberOfBedrooms": 3,
 "numberOfRooms": 5
 },
 "identifier": "abc123",
 "latitude": "42.12345",
 "longitude": "101.12345",
 "name": "My Beautiful Vacation Rental",
 "address": {
 "addressCountry": "US",
 "addressLocality": "Mountain View",
 "addressRegion": "California",
 "postalCode": "94043",
 "streetAddress": "1600 Amphitheatre Pkwy, Unit 6E"
 },
 "aggregateRating": {
 "ratingValue": 4.5,
 "ratingCount": 10,
 "reviewCount": 3,
 "bestRating": 5
 },
 "image": [
 "https://example.com/mylisting/unit_image1.png",
 "https://example.com/mylisting/unit_image2.png",
 "https://example.com/mylisting/unit_image3.png",
 "https://example.com/mylisting/unit_image4.png",
 "https://example.com/mylisting/unit_image5.png",
 "https://example.com/mylisting/unit_image6.png",
 "https://example.com/mylisting/unit_image7.png",
 "https://example.com/mylisting/unit_image8.png"
 ],
 "checkinTime": "18:00:00+08:00",
 "checkoutTime": "11:00:00+08:00",
 "description": "A great Vacation Rental in the perfect neighborhood.",
 "knowsLanguage": ["en-US", "fr-FR"],
 "review": [{
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 4,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "Lillian Ruiz"
 },
 "datePublished": "2024-12-01",
 "contentReferenceTime": "2024-11-17"
 },
 {
 "@type": "Review",
 "reviewRating": {
 "@type": "Rating",
 "ratingValue": 5,
 "bestRating": 5
 },
 "author": {
 "@type": "Person",
 "name": "John S."
 },
 "datePublished": "2024-10-01",
 "contentReferenceTime": "2024-09-28"
 }
 ]
 }
 </script>
 </head>
 <body></body>
 </html>
 

# Eligibility guidelines

 You must follow these guidelines for your vacation rental structured data to be eligible
 for use in Google Search.

 
 
- 
 Vacation Rental Policies 
 
 
- 
 Search Essentials 
 
 
- 
 General structured data guidelines 
 

 
 Warning: 
 If your site violates one or more of these guidelines, then Google may take
 manual action 
 against it. Once you have remedied the problem, you can submit your site for
 reconsideration .

# 
 Structured data type definitions

 
 The following tables list properties and usage for marking up vacation rental listings using
 schema.org/VacationRental .
 You must include the required properties for your structured data to be eligible for display. You
 can also include the recommended properties to add more information about your content,
 which will provide a better user experience.

# 
 VacationRental 

 
 The full definition of VacationRental is available at
 schema.org/VacationRental .

 
 
 
 
 
 
 Required properties 
 

 
 
 
 
 containsPlace 
 
 
 
 
 Accommodation 
 
 

 
 A vacation rental listing must contain one
 Accommodation 
 to markup additional details such as beds, occupancy, number of rooms, and
 amenityFeature properties.
 

 
 

 
 
 containsPlace.occupancy 
 
 
 
 
 QuantitativeValue 
 
 

 Information about the maximum number of guests allowed to stay at the vacation rental listing.

 
 "occupancy" : { 
 "@type" : "QuantitativeValue" , 
 "value" : 5 
 } 
 
 
 

 
 
 containsPlace.occupancy.value 
 
 
 
 
 Integer 
 
 

 The numerical value of guests allowed to stay at the vacation rental listing.

 
 

 
 
 identifier 
 
 
 
 
 Text 
 
 

 A unique identifier for the property.

 
 Additional guidelines:
 

 
 
- 
 The identifier must be independent of the listing content; for example, it won't
 change when the property owner updates the listing name or number of bedrooms.
 
 
- The same identifier must be used for the same listing in different languages. 
 

 
 

 
 
 image 
 
 
 
 Repeated URL 
 

 One or more images of the listing. The listing must have a minimum of 8 photos (at
 least 1 image of each of the following: bedroom, bathroom, and common area).

 
 Additionally, follow the
 Property listing image requirements .
 

 
 

 
 
 latitude (or geo.latitude )
 
 
 
 
 Number 
 
 

 
 The latitude of the listing's location. Precision must be at least 5 decimal places.
 

 
 

 
 
 longitude (or geo.longitude )
 
 
 
 
 Number 
 
 

 
 The longitude of the listing's location. Precision must be at least 5 decimal places.
 

 
 

 
 
 name 
 
 
 
 
 Text 
 
 

 The name of the vacation rental listing.

 
 

 

 
 
 
 
 
 
 Recommended properties 
 

 
 
 
 
 additionalType 
 
 
 
 
 Text 
 
 

 
 The type of vacation rental listing. Here are some suggested values:
 

 
 
- Apartment 
 
- Bungalow 
 
- Cabin 
 
- Chalet 
 
- Cottage 
 
- Gite 
 
- HolidayVillageRental 
 
- House 
 
- Villa 
 
- VacationRental 
 

 
 The full definitions of these values are in
 Categories for lodging businesses .
 

 
 

 
 
 address 
 
 
 
 
 PostalAddress 
 
 

 The full, physical location of the vacation rental.

 Provide the street address, city, state or region,
 and postal code for the vacation rental. If applicable, provide the unit or apartment number.

 Note that P.O. boxes or other mailing-only addresses are not
 considered full, physical addresses.

 
 "address" : { 
 "addressCountry" : "US" , 
 "addressLocality" : "Mountain View" , 
 "addressRegion" : "California" , 
 "postalCode" : "94043" , 
 "streetAddress" : "1600 Amphitheatre Pkwy, Apartment 4E" 
 } 
 
 
 

 
 
 address.addressCountry 
 
 
 
 
 Text 
 
 

 The country of your vacation listing, using the two-letter
 ISO 3166-1 alpha-2 country code .

 

 
 
 address.addressLocality 
 
 
 
 
 Text 
 
 

 The city of your vacation listing.

 
 

 
 
 address.addressRegion 
 
 
 
 
 Text 
 
 

 The name of the listings's state, region, or province.

 

 
 
 address.postalCode 
 
 
 
 
 Text 
 
 

 The postal code for your vacation listing.

 

 
 
 address.streetAddress 
 
 
 
 
 Text 
 
 

 The full street address of your vacation listing, including the unit or apartment
 number if applicable.

 
 

 
 
 aggregateRating 
 
 
 
 
 AggregateRating 
 
 

 
 The average vacation rental rating is based on multiple ratings or reviews. Follow the
 review snippet guidelines 
 and the list of required and recommended
 aggregate rating properties .
 

 
 

 
 
 brand 
 
 
 
 
 Brand 
 
 

 
 The brand ID associated with this property. Read more about how to to associate your
 properties to brands and how link your brand icons and display names to respective
 brand IDs in the Hotel Center documentation .
 

 
 "brand" : { 
 "@type" : "Brand" , 
 "name" : " brandIdName " 
 } 
 
 
 

 
 
 checkinTime 
 
 
 
 
 Time 
 
 

 
 The earliest time someone may check into a lodging establishment in
 ISO 8601 format .
 

 Example: 14:30:00+08:00 

 
 

 
 
 checkoutTime 
 
 
 
 
 Time 
 
 

 The latest time someone may check into a lodging establishment in ISO 8601 format .

 Example: 14:30:00+08:00 

 
 

 
 
 containsPlace.additionalType 
 
 
 
 
 Text 
 
 

 
 The type of room for this accommodation. Use one of the following values:
 

 
 
- EntirePlace 
 
- PrivateRoom 
 
- SharedRoom 
 

 
 

 
 
 containsPlace.amenityFeature 
 
 
 
 Repeated
 amenityFeature 
 

 Whether the property has a certain feature or amenity. Boolean examples follow this pattern:

 
 "amenityFeature" : { 
 "@type" : "LocationFeatureSpecification" , 
 "name" : " featureName " , 
 "value" : true 
 } 
 
 Boolean values 
 Use one of the following values for the amenityFeature.name property. The
 values must be in English, even for non-English listings.

 
 
 
 
 
 
 ac 
 
 
 Whether the property has air conditioning.

 
 

 
 
 airportShuttle 
 
 
 Whether the host provides transportation to and from airport or other terminals.

 
 

 
 
 balcony 
 
 
 Whether the property has a balcony.

 
 

 
 
 beachAccess 
 
 
 Whether the property has access to a public beach close to the property.

 
 

 
 
 childFriendly 
 
 
 Whether the property is suitable for children.

 
 

 
 
 crib 
 
 
 Whether the property provides a crib.

 
 

 
 
 elevator 
 
 
 Whether the property has an elevator.

 
 

 
 
 fireplace 
 
 
 Whether the property has a fireplace.

 
 

 
 
 freeBreakfast 
 
 
 Whether the property has breakfast included.

 
 

 
 
 gymFitnessEquipment 
 
 
 Whether the property has a gym or fitness equipment.

 
 

 
 
 heating 
 
 
 Whether the property has heating.

 
 

 
 
 hotTub 
 
 
 Whether the property has a hot tub.

 
 

 
 
 instantBookable 
 
 
 
 Whether the property is instantly bookable through the checkout process. The alternative is waiting for approval.
 

 
 

 
 
 ironingBoard 
 
 
 Whether the property has ironing boards available.

 
 

 
 
 kitchen 
 
 
 Whether the property has a kitchen.

 
 

 
 
 microwave 
 
 
 Whether the property has a microwave available.

 
 

 
 
 outdoorGrill 
 
 
 Whether the property has a grill.

 
 

 
 
 ovenStove 
 
 
 Whether the property has an oven or a stove.

 
 

 
 
 patio 
 
 
 Whether the property has a patio.

 
 

 
 
 petsAllowed 
 
 
 Whether the guest is allowed to bring a pet to the property.

 You can use the containsPlace.petsAllowed property
 instead of this field.
 

 
 

 
 
 pool 
 
 
 Whether the property has a pool.

 
 

 
 
 privateBeachAccess 
 
 
 Whether the property has dedicated access to a non-public beach.

 
 

 
 
 selfCheckinCheckout 
 
 
 Whether the property supports self checkin and checkout.

 
 

 
 
 smokingAllowed 
 
 
 Whether smoking is allowed in the unit.

 You can use the containsPlace.smokingAllowed property
 instead of this field.
 

 
 

 
 
 
 tv 
 
 
 Whether the property has a TV.

 
 

 
 
 washerDryer 
 
 
 Whether the property has laundry appliances.

 
 

 
 
 wheelchairAccessible 
 
 
 Whether the property is wheelchair accessible.

 
 

 
 
 wifi 
 
 
 Whether the property has wifi.

 
 

 

 Non-boolean values 

 We also support the following non-boolean name and value pairs for
 amenityFeature . Both values must be in English, even for non-English listings.
 

 Non-boolean values follow this pattern:

 
 "amenityFeature" : { 
 "@type" : "LocationFeatureSpecification" , 
 "name" : " featureName " , 
 "value" : " detail " 
 } 
 
 
 
 
 
 
 
 
 
 internetType
 
 

 
 
 
 The type of internet available on the property. Here are some suggested values:
 

 
 
- Free 
 
- Paid 
 
- None 
 

 
 "amenityFeature" : { 
 "@type" : "LocationFeatureSpecification" , 
 "name" : "internetType" , 
 "value" : "Free" 
 } 
 
 
 

 
 
 
 parkingType

 
 
 
 
 The type of parking available on the property. Here are some suggested values:
 
 
- Free 
 
- Paid 
 
- None 
 

 

 
 "amenityFeature" : { 
 "@type" : "LocationFeatureSpecification" , 
 "name" : "parkingType" , 
 "value" : "Free" 
 } 
 
 
 

 
 
 
 poolType
 
 
 
 
 The type of pool available on the property. Here are some suggested values:
 
 
- Indoor 
 
- Outdoor 
 
- None 
 

 Only English strings are supported.

 

 
 "amenityFeature" : { 
 "@type" : "LocationFeatureSpecification" , 
 "name" : "poolType" , 
 "value" : "Outdoor" 
 } 
 
 
 

 
 
 
 licenseNum

 
 
 
 
 The license number (tourist or business) required to be shown for properties in certain
 regions of the world. It could be repeated and, if multiple licenses exist, we suggest
 adding the authority of the license as context (for example: Paris: 123456ABC ).
 

 
 "amenityFeature" : { 
 "@type" : "LocationFeatureSpecification" , 
 "name" : "licenseNum" , 
 "value" : "Paris: 123456ABC" 
 } 
 
 
 

 

 
 

 
 
 containsPlace.bed 
 
 
 
 Repeated BedDetails 
 

 
 Information about the type and number of beds in the listing.
 

 
 "bed" : [{ 
 "@type" : "BedDetails" , 
 "numberOfBeds" : 1 , 
 "typeOfBed" : "Queen" 
 }, 
 { 
 "@type" : "BedDetails" , 
 "numberOfBeds" : 2 , 
 "typeOfBed" : "Single" 
 }] 
 
 
 

 
 
 containsPlace.bed.numberOfBeds 
 
 
 
 Integer 
 

 
 The number of beds in the listing.
 

 
 

 
 
 containsPlace.bed.typeOfBed 
 
 
 
 Text 
 

 
 The type of beds in the listing. Here are some suggested values:
 
 
- CaliforniaKing 
 
- King 
 
- Queen 
 
- Full 
 
- Double 
 
- SemiDouble 
 
- Single 
 

 

 
 

 
 
 containsPlace.floorSize 
 
 
 
 
 QuantitativeValue 
 
 

 Size of the accommodation. It must be specified using unitCode property values:
 

 
 
- For square feet: FTK or SQFT 
 
- For square meters: MTK or SQM 
 

 
 "floorSize" : { 
 "@type" : "QuantitativeValue" , 
 "value" : 75 , 
 "unitCode" : "MTK" 
 } 
 
 

 
 
 containsPlace.numberOfBathroomsTotal 
 
 
 
 
 Integer 
 
 

 
 The total bathrooms in the listing. Follow real estate conventions as
 documented in RESO 
 and use the simple sum of the number of bathrooms. For example, for a property with two full
 bathrooms and one half bathroom, the total number of bathrooms is 2.5.
 

 

 
 
 containsPlace.numberOfBedrooms 
 
 
 
 
 Integer 
 
 

 The total number of bedrooms in the listing.

 

 
 
 containsPlace.numberOfRooms 
 
 
 
 
 Integer 
 
 

 The total number of rooms in the listing.

 
 

 
 
 description 
 
 
 
 
 Text 
 
 

 A description of the property.

 
 

 
 
 knowsLanguage 
 
 
 
 
 Repeated Text 
 
 

 
 The languages the host can speak. Use language codes from the IETF BCP 47 standard, such
 as en-US or fr-FR .
 

 
 

 
 
 review 
 
 
 
 
 Repeated Review 
 
 

 
 One or more user reviews of the listing. Follow the
 review snippet guidelines 
 and the list of required and recommended
 review properties .
 

 Note : For vacation rentals, the review.datePublished is a required field.

 
 "review" : { 
 "@type" : "Review" , 
 "reviewRating" : { 
 "@type" : "Rating" , 
 "ratingValue" : 4 , 
 "bestRating" : 5 
 }, 
 "datePublished" : "2023-02-09" 
 "author" : { 
 "@type" : "Person" , 
 "name" : "Lillian R" 
 } 
 } 
 
 
 

 
 
 review.contentReferenceTime 
 
 
 
 
 DateTime 
 
 

 This property is required for vacation listings located in France .

 The start date of the author's stay.

 
 

 

# Monitor rich results with Search Console

 
 Search Console is a tool that helps you monitor how your pages perform in Google Search.
 You don't have to sign up for Search Console to be included in Google Search results,
 but it can help you understand and improve how Google sees your site. We
 recommend checking Search Console in the following cases:
 
 
- After deploying structured data for the first time 
 
- After releasing new templates or updating your code 
 
- Analyzing traffic periodically 
 

 
 
 

 

# 
 After deploying structured data for the first time
 

 
 After Google has indexed your pages, look for issues using the relevant
 Rich result status report .
 Ideally, there will be an increase of valid items, and no increase in invalid items. If you find issues
 in your structured data:

 
 
- Fix the invalid items . 
 
- Inspect a live URL to check if the issue persists. 
 
- Request validation using the status report. 
 

 

# 
 After releasing new templates or updating your code
 

 When you make significant changes to your website, monitor for increases in structured data invalid items.
 
 
- If you see an increase in invalid items , perhaps you rolled out a new template that doesn't work, or your site interacts with the existing
 template in a new and bad way. 
 
- If you see a decrease in valid items (not matched by an increase in invalid items), perhaps you are
 no longer embedding structured data in your pages. Use the 
 URL Inspection tool to learn what is causing the issue. 
 

 

# 
 Analyzing traffic periodically
 

 Analyze your Google Search traffic using the Performance Report .
 The data will show you how often your page appears as a rich result in Search, how often users click on it and what is
 the average position you appear on search results. You can also automatically pull these
 results with the Search Console API .

 

# Troubleshooting

 
 If you're having trouble implementing or debugging structured data, here are some resources that
 may help you.
 

 
 
- If you're using a content management system (CMS) or someone else is taking care of your site,
 ask them to help you. Make sure to forward any Search Console message that details the issue to them. 
 
- Google does not guarantee that features that consume structured data will show up in search results.
 For a list of common reasons why Google may not show your content in a rich result, see the
 General Structured Data Guidelines . 
 
- You might have an error in your structured data. Check the
 list of structured data errors 
 and the Unparsable structured data report . 
 
- If you received a structured data manual action against your page, the structured data on
 the page will be ignored (although the page can still appear in Google Search results). To fix
 structured data issues , use the Manual Actions report .
 
 
- Review the guidelines again to identify if your content isn't compliant
 with the guidelines. The problem can be caused by either spammy content or spammy markup usage.
 However, the issue may not be a syntax issue, and so the Rich Results Test won't be able to
 identify these issues.
 
 
- Troubleshoot missing rich results / drop in total rich results . 
 
- Allow time for re-crawling and re-indexing. Remember that it may take several days after
 publishing a page for Google to find and crawl it. For general questions about crawling and indexing, check the
 Google Search crawling and indexing FAQ .
 
 
- Post a question in the Google Search Central forum . 
 

 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Send feedback
