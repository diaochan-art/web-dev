"""
Simple script to import existing static blog posts (from ../blog/posts)
into Eleventy `src/posts/` as Markdown files.

Usage (PowerShell):
  python tools\import_blog_posts.py ..\..\blog\posts

This script is intentionally simple: it extracts the <h2> as title and the
content inside <article> or the whole body if not present.
"""
import sys
import os
import re
from pathlib import Path
from datetime import datetime

from bs4 import BeautifulSoup


def slugify(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9-]+", '-', s)
    s = re.sub(r"-+", '-', s)
    return s.strip('-')


def convert_file(src_path, dst_dir):
    with open(src_path, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    title_tag = soup.find(['h1', 'h2'])
    title = title_tag.get_text().strip() if title_tag else Path(src_path).stem
    # Try to find article content
    article = soup.find('article')
    if article:
        content_html = ''.join(str(c) for c in article.contents)
    else:
        # fallback: use body contents
        body = soup.find('body')
        content_html = ''.join(str(c) for c in (body.contents if body else soup.contents))

    date = datetime.now().date()
    filename = f"{date.isoformat()}-{slugify(title)}.md"
    dst = Path(dst_dir) / filename
    md = f"---\ntitle: \"{title}\"\ndate: {date.isoformat()}\nlayout: _includes/layouts/base.njk\n---\n\n" + content_html
    dst.parent.mkdir(parents=True, exist_ok=True)
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(md)
    print('Converted', src_path, '→', dst)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python import_blog_posts.py PATH_TO_OLD_POSTS_DIR')
        sys.exit(1)
    src_dir = Path(sys.argv[1])
    dst_dir = Path(__file__).parents[1] / 'src' / 'posts'
    for p in src_dir.glob('*.html'):
        convert_file(p, dst_dir)
    print('Done.')
