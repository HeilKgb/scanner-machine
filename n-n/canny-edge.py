import cv2
import numpy as np
import pytesseract
from matplotlib import pyplot as plt

img = cv2.imread('images/certidao_1000.jpg')
edges = cv2.Canny(img,100,200)
text = pytesseract.image_to_string(img)
print(text)
cv2.imshow("edges", edges)
cv2.waitKey(0)
