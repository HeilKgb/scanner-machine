import cv2
import numpy as np

IMG_DIR = 'scans/'
#certidao.jpg
img = cv2.imread(IMG_DIR+'cnh_5.jpg')


cv2.imshow('Img',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
