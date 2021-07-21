import cv2
import numpy as np

IMG_DIR = 'images/'
#certidao.jpg
img = cv2.imread(IMG_DIR+'certidao_testere.jpg')
#tamanho da imagem - dimensoes
print(img.shape)

#cutting image

cv2.imshow('Img',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
