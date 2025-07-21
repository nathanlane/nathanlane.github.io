#!/usr/bin/env python3
"""
Manual HTML to Markdown converter.
Use when websites block automated scraping.

Usage:
1. Open the article in your browser
2. Right-click -> "View Page Source" (or Cmd+Option+U on Mac)
3. Copy the HTML and save it as "article.html" in this directory
4. Run: python manual_html_to_md.py

Or use the interactive mode to paste HTML directly.
"""

from markdownify import markdownify as md
from bs4 import BeautifulSoup
import os
import sys

def clean_html_content(soup):
    """Clean HTML content by removing navigation, ads, etc."""
    
    # Remove unwanted elements
    unwanted_selectors = [
        'script', 'style', 'nav', 'header', 'footer', 
        'aside', '.sidebar', '#sidebar', '.advertisement', 
        '.ads', '.social-share', '.related-posts',
        '.comments', '#comments', '.comment-form',
        '.navigation', '.nav', '.menu', '.breadcrumb',
        '.social-media', '.newsletter-signup',
        '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]'
    ]
    
    for selector in unwanted_selectors:
        for element in soup.select(selector):
            element.decompose()
    
    return soup

def extract_article_content(soup):
    """Try to find the main article content."""
    
    # Selectors to try in order of preference
    content_selectors = [
        'article',
        '[role="main"]',
        'main',
        '.entry-content',
        '.post-content',
        '.article-content',
        '.content',
        '#content',
        '.single-post',
        '.post-body',
        '.article-body'
    ]
    
    for selector in content_selectors:
        elements = soup.select(selector)
        if elements:
            print(f"Found article content using selector: {selector}")
            return elements[0]
    
    print("No specific article selector found, using full body")
    return soup.find('body') or soup

def html_to_markdown(html_content, title=None, url=None):
    """Convert HTML content to clean markdown."""
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extract title if not provided
    if not title:
        title_elem = soup.find('title')
        if title_elem:
            title = title_elem.get_text().strip()
        
        # Try to get a better title from h1
        h1_elem = soup.find('h1')
        if h1_elem:
            h1_text = h1_elem.get_text().strip()
            if h1_text and len(h1_text) < 200:  # Reasonable title length
                title = h1_text
    
    # Clean the HTML
    clean_soup = clean_html_content(soup)
    article_content = extract_article_content(clean_soup)
    
    # Convert to markdown
    markdown_content = md(
        str(article_content),
        heading_style="ATX",
        bullets="-",
        wrap=False,
        escape_misc=False,
        strip=['script', 'style']
    )
    
    # Clean up the markdown
    lines = markdown_content.split('\n')
    cleaned_lines = []
    prev_empty = False
    
    for line in lines:
        line = line.strip()
        
        # Handle empty lines
        if not line:
            if not prev_empty:
                cleaned_lines.append('')
                prev_empty = True
            continue
        
        prev_empty = False
        
        # Skip very short lines that are likely junk
        if len(line) < 3 and not line.startswith('#'):
            continue
            
        cleaned_lines.append(line)
    
    # Build final markdown
    final_parts = []
    
    if title:
        final_parts.append(f"# {title}")
        final_parts.append("")
    
    if url:
        final_parts.append(f"**Source:** [{url}]({url})")
        final_parts.append("")
    
    final_parts.append("---")
    final_parts.append("")
    final_parts.extend(cleaned_lines)
    
    return '\n'.join(final_parts)

def process_file(filename, output_filename=None):
    """Process HTML file and convert to markdown."""
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        print(f"Processing {filename}...")
        
        # Convert to markdown
        markdown = html_to_markdown(
            html_content, 
            url="https://www.bostonreview.net/forum/industrial-policys-comeback/a-flight-plan-that-fails/"
        )
        
        # Save output
        if not output_filename:
            base_name = os.path.splitext(filename)[0]
            output_filename = f"{base_name}.md"
        
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        print(f"Converted to markdown: {output_filename}")
        
        # Show preview
        print("\n" + "="*60)
        print("PREVIEW:")
        print("="*60)
        preview = markdown[:800] + "..." if len(markdown) > 800 else markdown
        print(preview)
        
        return True
        
    except FileNotFoundError:
        print(f"File {filename} not found!")
        return False
    except Exception as e:
        print(f"Error processing file: {e}")
        return False

def interactive_mode():
    """Interactive mode for pasting HTML directly."""
    
    print("Interactive mode - paste your HTML content.")
    print("When done, press Ctrl+D (Mac/Linux) or Ctrl+Z then Enter (Windows)")
    print("=" * 60)
    
    try:
        html_lines = []
        while True:
            try:
                line = input()
                html_lines.append(line)
            except EOFError:
                break
        
        html_content = '\n'.join(html_lines)
        
        if not html_content.strip():
            print("No content provided!")
            return False
        
        markdown = html_to_markdown(
            html_content,
            url="https://www.bostonreview.net/forum/industrial-policys-comeback/a-flight-plan-that-fails/"
        )
        
        output_file = "pasted_article.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        print(f"\nSaved to: {output_file}")
        print("\nPreview:")
        print("="*60)
        preview = markdown[:500] + "..." if len(markdown) > 500 else markdown
        print(preview)
        
        return True
        
    except KeyboardInterrupt:
        print("\nCancelled by user.")
        return False

if __name__ == "__main__":
    print("HTML to Markdown Converter")
    print("="*50)
    
    # Check if HTML file exists
    if os.path.exists("article.html"):
        print("Found article.html file")
        if process_file("article.html", "boston_review_article.md"):
            sys.exit(0)
    
    # Check command line arguments
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        if process_file(input_file, output_file):
            sys.exit(0)
        else:
            sys.exit(1)
    
    # Interactive mode
    print("\nNo HTML file found. Starting interactive mode.")
    print("\nInstructions:")
    print("1. Go to the article URL in your browser")
    print("2. Right-click and select 'View Page Source' (or press Cmd+Option+U)")
    print("3. Copy the entire HTML content")
    print("4. Paste it below and press Ctrl+D when done")
    print()
    
    if interactive_mode():
        print("\nConversion completed successfully!")
    else:
        print("\nConversion failed.")
