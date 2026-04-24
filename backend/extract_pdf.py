#!/usr/bin/env python3
"""
Standalone PDF text extractor — called as subprocess by Node.js.
Usage: python3 extract_pdf.py <pdf_path>
Outputs clean text to stdout.
"""
import sys
import os

def extract(pdf_path):
    # Method 1: pdfplumber (best quality)
    try:
        import pdfplumber
        text_parts = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t and t.strip():
                    text_parts.append(t.strip())
        result = '\n'.join(text_parts)
        if len(result) > 100:
            return result
    except Exception as e:
        sys.stderr.write(f"pdfplumber failed: {e}\n")

    # Method 2: pypdf fallback
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        text_parts = []
        for page in reader.pages:
            t = page.extract_text()
            if t and t.strip():
                text_parts.append(t.strip())
        result = '\n'.join(text_parts)
        if len(result) > 100:
            return result
    except Exception as e:
        sys.stderr.write(f"pypdf failed: {e}\n")

    return ""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        sys.stderr.write(f"File not found: {pdf_path}\n")
        sys.exit(1)
    
    text = extract(pdf_path)
    # Clean up (cid:xxx) artifacts from bullet points
    import re
    text = re.sub(r'\(cid:\d+\)', '•', text)
    text = re.sub(r'\s{3,}', '\n', text)
    print(text)