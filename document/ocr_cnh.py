from pyimagesearch.alignment import align_Images 
from collections import namedtuple
import pytesseract
import argparse
import imutils
import cv2
from pytesseract import Output


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
    OCRLocation("NOME", (168,142,752,50),
                ["meio", "inicial", "primeiro", "nome"]),
    # doc identidade/org emissor / uf
    OCRLocation("DOC.IDENTIDADE", (496,208,424,50),
                ["uf","emissor","rg"]),
    OCRLocation("CPF", (490,278,242,50),
                ["CPF"]),
    OCRLocation("DATA NASCIMENTO", (736,278,184,50),
                ["data"]),
    OCRLocation("FILIACAO", (488,342,432,158),
                ["pai","mae"]),
    OCRLocation("REGISTRO", (174,576,296,50), ["registro"]),
    OCRLocation("primeira_habilitacao", (689,582,220,50), ["habilitacao"]),
    OCRLocation("LOCAL", (174,1030,526,50), ["local"]),
    OCRLocation("DATA EMISSAO", (700,1034,220,50), ["data","emissao"]),   
]



print("[info] loading image")
image = cv2.imread(args['image'])
template = cv2.imread(args['template'])
#mudar isso para um modulo 
d = pytesseract.image_to_data(image,output_type=Output.DICT)
n_boxes = len(d['level'])
for i in range(n_boxes):
    (x, y,w,h) = (d['left'][i],d['top'][i],d['width'][i],d['height'][i])
    cv2.rectangle(image,(x, y), (x + w, y + h), (0, 255, 0), 2)

print("[info] aligning image")
aligned = align_Images.align_images(image, template,debug=True)

print("[info] OCR document")
parsingResults = []


for loc in OCR_LOCATIONS:
    (x, y, w, h) = loc.bbox
    roi = aligned[y:y+h, x:x+w]
    rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
    text = pytesseract.image_to_string(rgb)
    print("aqui : ",text)
#tirar esse for i in range(5), tentar colocar um else
for i in range(5):
    for line in text.split("\n"):
        if len(line) != 0:
            continue
        lower = line
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
cv2.waitKey(10000)
