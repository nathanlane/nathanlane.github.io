#!/usr/bin/env python3
"""
Enhanced web scraper for converting articles to markdown.
Handles anti-bot protection better.
"""

import requests
from markdownify import markdownify as md
from bs4 import BeautifulSoup
import time
import random
from urllib.parse import urljoin

def fetch_with_retry(url, max_retries=3):
    """Fetch URL with better headers and retry logic."""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
    }
    
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1} to fetch: {url}")
            
            # Add random delay to seem more human
            if attempt > 0:
                delay = random.uniform(1, 3)
                print(f"Waiting {delay:.1f} seconds...")
                time.sleep(delay)
            
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return response
            elif response.status_code == 403:
                print(f"403 Forbidden - trying different User-Agent")
                # Try different user agent
                headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            else:
                print(f"HTTP {response.status_code}: {response.reason}")
                
        except requests.RequestException as e:
            print(f"Request failed: {e}")
            if attempt == max_retries - 1:
                raise
    
    return None

def clean_article_content(soup):
    """Extract and clean the main article content."""
    
    # Common article selectors to try
    article_selectors = [
        'article',
        '[role="main"]',
        '.entry-content',
        '.post-content',
        '.article-content',
        '.content',
        'main',
        '#content',
        '.single-post',
        '.post-body'
    ]
    
    article_content = None
    
    # Try each selector
    for selector in article_selectors:
        elements = soup.select(selector)
        if elements:
            article_content = elements[0]
            print(f"Found content using selector: {selector}")
            break
    
    if not article_content:
        print("No specific article container found, using body")
        article_content = soup.find('body')
    
    if not article_content:
        return soup
    
    # Remove unwanted elements
    unwanted_selectors = [
        'script', 'style', 'nav', 'header', 'footer', 
        'aside', '.sidebar', '#sidebar', '.advertisement', 
        '.ads', '.social-share', '.related-posts',
        '.comments', '#comments', '.comment-form'
    ]
    
    for selector in unwanted_selectors:
        for element in article_content.select(selector):
            element.decompose()
    
    return article_content

def convert_to_markdown_advanced(url, output_file=None):
    """Advanced markdown conversion with content cleaning."""
    
    try:
        response = fetch_with_retry(url)
        if not response:
            return None
        
        print("Parsing HTML content...")
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title_elem = soup.find('title')
        title = title_elem.get_text().strip() if title_elem else "Untitled"
        
        # Try to find better title from h1 or article title
        h1_elem = soup.find('h1')
        if h1_elem:
            article_title = h1_elem.get_text().strip()
            if len(article_title) > 10 and len(article_title) < len(title):
                title = article_title
        
        print(f"Article title: {title}")
        
        # Clean the content
        clean_content = clean_article_content(soup)
        
        # Convert to markdown
        print("Converting to markdown...")
        markdown_content = md(
            str(clean_content),
            heading_style="ATX",
            bullets="-",
            code_language="",
            wrap=False,
            escape_misc=False
        )
        
        # Clean up the markdown
        lines = markdown_content.split('\\n')
        cleaned_lines = []
        
        prev_line_empty = False
        for line in lines:
            line = line.strip()
            
            # Skip empty lines but keep one empty line between sections
            if not line:
                if not prev_line_empty:
                    cleaned_lines.append('')
                prev_line_empty = True
                continue
            
            prev_line_empty = False
            
            # Skip very short lines that are likely navigation or junk
            if len(line) < 5 and not line.startswith('#'):
                continue
            
            cleaned_lines.append(line)
        
        # Create final markdown with metadata
        final_lines = []
        final_lines.append(f"# {title}")
        final_lines.append("")
        final_lines.append(f"**Source:** [{url}]({url})")
        final_lines.append("")
        final_lines.append("---")
        final_lines.append("")
        final_lines.extend(cleaned_lines)
        
        final_markdown = '\\n'.join(final_lines)
        
        # Final cleanup
        final_markdown = final_markdown.replace('\\n\\n\\n', '\\n\\n')
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(final_markdown)
            print(f"Saved to: {output_file}")
        
        return final_markdown
        
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    url = "https://www.bostonreview.net/forum/industrial-policys-comeback/a-flight-plan-that-fails/"
    output_file = "boston_review_nathan_lane.md"
    
    print("Enhanced web scraper starting...")
    result = convert_to_markdown_advanced(url, output_file)
    
    if result:
        print("\\n" + "="*60)
        print("SUCCESS! Preview of converted content:")
        print("="*60)
        preview = result[:1000] + "..." if len(result) > 1000 else result
        print(preview)
    else:
        print("\\nFailed to convert the article.")
        print("\\nAlternative approaches:")
        print("1. Use browser developer tools to copy the article HTML")
        print("2. Use a browser extension to save as markdown")
        print("3. Try a different scraping service like Readability API")
