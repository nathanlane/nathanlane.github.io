#!/usr/bin/env python3
"""
Extract article content and convert to markdown using newspaper3k.
This approach is better for extracting just the article content.
Usage: python article_to_markdown.py
"""

from newspaper import Article
from markdownify import markdownify as md
import re
from datetime import datetime

def extract_article_to_markdown(url, output_file=None):
    """Extract article content and convert to markdown."""
    
    try:
        # Create article object
        print(f"Extracting article from: {url}")
        article = Article(url)
        
        # Download and parse
        article.download()
        article.parse()
        
        # Extract metadata
        title = article.title
        authors = article.authors
        publish_date = article.publish_date
        summary = article.summary
        text = article.text
        
        # Convert main text to markdown (it's usually clean text already)
        # But we'll add proper markdown formatting
        
        markdown_parts = []
        
        # Add title
        if title:
            markdown_parts.append(f"# {title}")
        
        # Add metadata
        metadata_parts = []
        if authors:
            metadata_parts.append(f"**Authors:** {', '.join(authors)}")
        
        if publish_date:
            metadata_parts.append(f"**Date:** {publish_date.strftime('%B %d, %Y')}")
        
        markdown_parts.append(f"**Source:** [{url}]({url})")
        
        if metadata_parts:
            markdown_parts.extend(metadata_parts)
        
        markdown_parts.append("---")  # Separator
        
        # Add summary if available
        if summary and summary != text[:100]:  # Don't duplicate if summary is just the beginning
            markdown_parts.append("## Summary")
            markdown_parts.append(summary)
            markdown_parts.append("---")
        
        # Add main content
        if text:
            # Split into paragraphs and clean up
            paragraphs = text.split('\n\n')
            cleaned_paragraphs = []
            
            for para in paragraphs:
                para = para.strip()
                if para and len(para) > 10:  # Skip very short lines
                    cleaned_paragraphs.append(para)
            
            markdown_parts.extend(cleaned_paragraphs)
        
        # Join all parts
        final_markdown = '\n\n'.join(markdown_parts)
        
        # Clean up extra whitespace
        final_markdown = re.sub(r'\n{3,}', '\n\n', final_markdown)
        
        # Save to file if specified
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(final_markdown)
            print(f"Article saved to: {output_file}")
        
        return final_markdown
        
    except Exception as e:
        print(f"Error extracting article: {e}")
        return None

def extract_with_fallback(url, output_file=None):
    """Try newspaper3k first, fallback to requests + markdownify."""
    
    # First try newspaper3k
    result = extract_article_to_markdown(url, output_file)
    
    if result and len(result.strip()) > 200:  # If we got substantial content
        return result
    
    # Fallback to the first method
    print("Newspaper3k didn't extract much content, trying fallback method...")
    
    import requests
    from markdownify import markdownify as md
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        markdown_content = md(
            response.text,
            heading_style="ATX",
            bullets="-",
            strip=['script', 'style', 'nav', 'header', 'footer']
        )
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
        
        return markdown_content
        
    except Exception as e:
        print(f"Fallback method also failed: {e}")
        return None

if __name__ == "__main__":
    url = "https://www.bostonreview.net/forum/industrial-policys-comeback/a-flight-plan-that-fails/"
    output_file = "nathan_lane_boston_review.md"
    
    print("Make sure you have installed: pip install newspaper3k markdownify requests")
    print("Note: newspaper3k might require additional dependencies like lxml")
    
    markdown_content = extract_with_fallback(url, output_file)
    
    if markdown_content:
        print("\n" + "="*60)
        print("PREVIEW:")
        print("="*60)
        preview = markdown_content[:800] + "..." if len(markdown_content) > 800 else markdown_content
        print(preview)
    else:
        print("Failed to extract article content.")
