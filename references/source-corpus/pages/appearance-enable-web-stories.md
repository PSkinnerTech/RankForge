---
url: https://developers.google.com/search/docs/appearance/enable-web-stories
title: "Enable Web Stories on Google"
fetched_at: 2026-05-16T16:52:46.220Z
seed: false
---

# Enable Web Stories on Google

Source: https://developers.google.com/search/docs/appearance/enable-web-stories

- 
 
 
 
 
 
 
 
 Home
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Send feedback
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 

# Enable Web Stories on Google

 
 
 
 Web Stories are a web-based version of the popular "Stories" format that blend video, audio,
 images, animation and text to create a dynamic consumption experience. This visual format
 lets you explore content at your own pace by tapping through it, or swiping from one piece of
 content to the next.

 
 This guide explains how to make your Web Stories eligible to appear on Google Search (including
 Discover ).

 If you're a creator, check out
 these resources on creating stories ,
 without any coding involved.

 
 Here's an overview of how to enable Web Stories on Google:

 
 
- Create the Web Story . 
 
- Make sure the Web Story is valid AMP . 
 
- Verify the metadata . 
 
- Check if the Web Story is indexed . 
 
- Follow the Web Story Content Policies . 

# 
 Feature availability

 
 Web Stories can appear as a single result on Google Search, which is available in all
 regions and languages where Google Search is available.

 
 In the Discover feed, Web Stories can appear as a single card where you can tap through the
 story. While this appearance is available in all regions and languages where Google Discover is
 available, it's most likely to appear in the United States, India, and Brazil.

# Create the Web Story

 
 Web Stories are web pages under the hood and must follow the same guidelines and best practices
 that apply to publishing regular web pages. There are two ways to get started:

 
 
- Pick one of several Story editor tools to start creating stories without any coding involved. 
 
- If you have engineering resources, you can
 get started with AMP . To ensure
 your Web Story renders appropriately, we suggest using
 Chrome Developer Tools 
 to simulate different device sizes and formats. 

 
 To ensure a smooth process, review the Best practices for creating Web Stories .

 
 
 

# Make sure the Web Story is valid AMP

 
 After you've developed the story, make sure the Web Story is valid AMP. A valid AMP story is
 one that adheres to various AMP specifications . This allows the Story to be served via the AMP cache and ensures performance and the best experience for your users. You can use the following tools ensure that your Web Story is valid AMP:

 
 
- Web Stories Google Test
 Tool : Check that the Web Story is valid. 
 
- URL Inspection Tool : Check
 that the Web Story is valid AMP and the Google indexing status of a URL. 
 
- AMP Linter :
 Validate Web Stories during development via command line. 

# Verify metadata 

 
 For your Web Stories to be eligible to appear on Google Search or Google Discover experiences,
 supply the necessary metadata to surface the Web Story in the preview.

 
 
- Refer to the full
 list of metadata .
 
- Verify that your Web Story preview appears correctly in the Web Stories Google Test Tool . 

 
 Remember that the following fields are required on every Web Story: publisher-logo-src ,
 poster-portrait-src , title , and publisher .

 

# Check if the Web Story is indexed 

 
 Check to see if Google Search has indexed your Web Story. Use the
 URL Inspection Tool 
 to submit individual URLs or review status using
 Page Indexing report 
 or
 Sitemaps report .
 If your Web Story isn't indexed:

 
 
- To make it easier for Google to discover your Web Story, link to your Web Stories from
 your site or add your Web Story URL to your sitemap. 
 
- All Web Stories must be canonical. Make sure that each Web Story has a
 link rel="canonical" 
 to itself. For example: <link rel="canonical" href="https://www.example.com/url/to/webstory.html"> 
 If there are multiple versions of the same story in different
 languages, make sure to tell Google about localized versions .
 

 
 
- Check to make sure the Web Story URL isn't
 blocked to Googlebot via robot.txt or the
 noindex tag. 

 
 
 
 

 
 
 

 
 
 
 
 
 
 Next

 
 Best practices for creating Web Stories
 
 
 arrow_forward
 
 
 

 

 

 
 
 
 
 
 
 
 
 

 
 
 
 Send feedback
