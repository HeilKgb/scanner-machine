from pyimagesearch.alignment import align_Images 
from collections import namedtuple
import pytesseract
import argparse
import imutils
import cv2


def cleanup_text(text):
    return "".join([c if ord(c) < 255 else "" for c in text]).strip()


ap = argparse.ArgumentParser()
ap.add_argument('-i', '--image', required=True,
                help="path to input image that we'll align to template")
ap.add_argument('-t', '--template', required=True,
                help="path to input template image")
args = vars(ap.parse_args())


OCRLocation = namedtuple("OCRLocation", ["id", "bbox","filter_keywords"])

OCR_LOCATIONS = [
    OCRLocation("NOME", (85,71,395,29),
                ["meio", "inicial", "primeiro", "nome"]),
    # doc identidade/org emissor / uf
    OCRLocation("DOC.IDENTIDADE", (250, 107, 227, 28),
                ["uf","emissor","rg"]),
    OCRLocation("CPF", (251,138,134,33),
                ["CPF"]),
    OCRLocation("DATA NASCIMENTO", (382,138,99,33),
                ["data"]),
    OCRLocation("FILIACAO", (251,171,229,89),
                ["pai","mae"]),
    OCRLocation("REGISTRO", (82,296,165,32), ["registro"]),
    OCRLocation("primeira_habilitacao", (362,297,119,34), ["habilitacao"]),
    OCRLocation("DATA EMISSAO", (364,530,115,37), ["data","emissao"]),
    OCRLocation("ASSINATURA", (86,483,280,48), ["assinatura"]),
    
]



print("[info] loading image")
image = cv2.imread(args['image'])
template = cv2.imread(args['template'])
print("[info] aligning image")
aligned = align_Images.align_images(image, template,debug=True)

print("[info] OCR document")
parsingResults = []


for loc in OCR_LOCATIONS:
    (x, y, w, h) = loc.bbox
    roi = aligned[y:y+h, x:x+w]
    rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
    text = pytesseract.image_to_string(rgb)
for i in range(5):
    for line in text.split("\n"):
        if len(line) == 0:
            continue
        lower = line.lower()
        count = sum([lower.count(x) for x in loc.filter_keywords])

        if count == 0:
            parsingResults.append((loc, line))

results = {}

for (loc, line) in parsingResults:
    r = results.get(loc.id, None)

    if r is None:
        results[loc.id] = (line, loc._asdict())
    else:
        (existingText, loc) = r
        text = "{}\n{}".format(existingText, line)
        results[loc["id"]] = (text, loc)

for (locID, result) in results.items():
    (text, loc) = result
    print(loc["id"])
    print("="*len(loc["id"]))
    print("{}\n\n".format(text))
    (x, y, w, h) = loc["bbox"]
    clean = cleanup_text(text)
    cv2.rectangle(aligned, (x, y), (x + w, y + h), (0, 255, 0), 2)

    for (i, line) in enumerate(text.split("\n")):
        startY = y + (i*70)+40
        cv2.putText(aligned, line, (x, startY),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0, 0, 255), 5)



cv2.imshow('Input', imutils.resize(image, width=550))
cv2.imshow('Output', imutils.resize(aligned, width=550))
cv2.waitKey(100)
