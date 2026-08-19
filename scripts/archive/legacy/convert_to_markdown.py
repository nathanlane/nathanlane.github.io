#!/usr/bin/env python3
"""
Convert web page to markdown using markdownify.
Usage: python convert_to_markdown.py
"""

import requests
from markdownify import markdownify as md
from urllib.parse import urljoin, urlparse
import os

def convert_url_to_markdown(url, output_file=None):
    """Convert a web page to markdown format."""
    
    # Set headers to mimic a real browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        # Fetch the webpage
        print(f"Fetching: {url}")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Convert to markdown
        print("Converting to markdown...")
        markdown_content = md(
            response.text,
            heading_style="ATX",  # Use # for headings
            bullets="-",          # Use - for bullet points
            strip=['script', 'style', 'nav', 'header', 'footer', 'aside']  # Remove these tags
        )
        
        # Clean up the markdown
        lines = markdown_content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            if line and not line.isspace():
                cleaned_lines.append(line)
        
        final_markdown = '\n\n'.join(cleaned_lines)
        
        # Save to file if specified
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(final_markdown)
            print(f"Saved to: {output_file}")
        
        return final_markdown
        
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None
    except Exception as e:
        print(f"Error converting to markdown: {e}")
        return None

if __name__ == "__main__":
    url = "https://www.bostonreview.net/forum/industrial-policys-comeback/a-flight-plan-that-fails/"
    output_file = "boston_review_article.md"
    
    # Install required packages first
    print("Make sure you have installed: pip install markdownify requests")
    
    markdown_content = convert_url_to_markdown(url, output_file)
    
    if markdown_content:
        print("\n" + "="*50)
        print("PREVIEW (first 500 characters):")
        print("="*50)
        print(markdown_content[:500] + "..." if len(markdown_content) > 500 else markdown_content)
