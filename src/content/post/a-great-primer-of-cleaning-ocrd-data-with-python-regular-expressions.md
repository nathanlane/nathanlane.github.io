---
title: A great primer on cleaning OCRd data with Python &...
description: >-
  [](http://programminghistorian.org/lessons/cleaning-ocrd-text-with-regular-expressions
  "Cleaning OCR’d text with Regular Expressions")
publishDate: '2014-09-02'
tags:
  - links
  - programming
  - python
  - regex
  - tutorials
  - ocr-for-economists
draft: true
---

<a href="http://programminghistorian.org/lessons/cleaning-ocrd-text-with-regular-expressions" title="Cleaning OCR’d text with Regular Expressions" target="_blank"><br />

#### Link: Cleaning OCR’d text with Regular Expressions

</a></ br>

Often the pain of <a href="http://en.wikipedia.org/wiki/Optical_character_recognition" target="_blank">optical character recognition</a> isn't the OCRing procedure itself, it is cleaning the tiny, little inconsistencies that plague OCRd content. This is especially true when we OCR historical material: even high quality scans can have a speckle or two that get recognized as gibberish.

</ br>

Adept use of <a href="http://nikic.github.io/2012/06/15/The-true-power-of-regular-expressions.html" target="_blank">Regular Expressions</a> (regex) coupled with simple Python (or Ruby scripts--or heck, even Notepad++) can be a powerful means of removing nasty errors from OCRd text/CSV files.

</ br>

<a href="http://programminghistorian.org/lessons/cleaning-ocrd-text-with-regular-expressions" target="_blank">Here's an awesome little primer</a> from Laura O'hare at <a href="http://programminghistorian.org/" title="The Programming Historian blog" target="_blank">The Programming Historian</a> on using Python to clean nasty OCRd content using regexs. Great sample (verbose) code for helping turning mush into data. Importantly, they break down a lot of the regex components, which is helpful for those getting started with this brand of data cleaning.

</ br>

Of course, regex+Python won't be perfect. While there are <a href="http://en.wikipedia.org/wiki/Grep" target="_blank">preferred ways</a> of using regex to wrangle text, Python gives most of us quick, programmatic means of cleaning nasty OCRd spreadsheets and the like. Most importantly, however, errors in our OCRd content are seldom systematic, which makes completely automating OCRd data cleaning tricky. There will be hand polishing involved. But as the primer notes, the point is isn't perfection; it's to let regex+Python "**do the heavy lifting**."

