<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 2em;
            margin: 0 0 10px 0;
            color: #2b6cb0;
          }
          .description {
            color: #666;
            font-size: 1.1em;
          }
          .rss-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
            border-left: 4px solid #2b6cb0;
          }
          .item {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .item-title {
            font-size: 1.3em;
            margin: 0 0 10px 0;
          }
          .item-title a {
            color: #2b6cb0;
            text-decoration: none;
          }
          .item-title a:hover {
            text-decoration: underline;
          }
          .item-date {
            color: #888;
            font-size: 0.9em;
            margin-bottom: 10px;
          }
          .item-description {
            color: #555;
          }
          .feed-url {
            font-family: monospace;
            background: #f1f1f1;
            padding: 2px 6px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title"><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
        </div>
        
        <div class="rss-info">
          <strong>📡 This is an RSS feed</strong><br/>
          Copy the URL from your address bar into your RSS reader. Visit <a href="https://aboutfeeds.com">About Feeds</a> to learn more and find RSS readers.
        </div>

        <div class="items">
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <h2 class="item-title">
                <a href="{link}" target="_blank">
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <div class="item-date">
                <xsl:value-of select="pubDate"/>
              </div>
              <div class="item-description">
                <xsl:value-of select="description" disable-output-escaping="yes"/>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet> 