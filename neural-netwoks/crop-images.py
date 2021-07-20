import cv2
import numpy as np

img = cv2.imread('images/placa.jpg')
img = cv2.resize(img,None,fx=0.5,fy=0.5)

rows, cols,_ = img.shape
print('rows',rows) 
print('cols', cols) 

#retangule 
rectangle = cv2.rectangle(img,(500,100),(50,500),(0,255,0),3)

#cut images
cut_img= img[100:500, 50:500]

cv2.imshow('cut_img',cut_img)
cv2.imshow('img',img)
cv2.waitKey(0)