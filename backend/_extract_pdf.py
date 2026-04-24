
import pdfplumber, sys
text = []
with pdfplumber.open(sys.argv[1]) as pdf:
    for page in pdf.pages:
        t = page.extract_text()
        if t:
            text.append(t)
print('\n'.join(text))
