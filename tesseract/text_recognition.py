import cv2
import numpy as np
import pytesseract


IMG_DIR = 'images/'

img = cv2.imread(IMG_DIR +'teste3.jpg')
#img = cv2.imread(IMG_DIR+'certidao_1500.jpg')

#redimensionar img
#img = cv2.resize(img,None,fx = 0.5, fy=0.5)
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
adaptive_threshold = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,85,11)

config = "--psm 4"

text = pytesseract.image_to_string(img)
print(text)
cv2.imshow('Img', img)
cv2.imshow('gray', gray)
cv2.imshow('adaptive', adaptive_threshold)
cv2.waitKey(0)