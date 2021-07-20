import cv2
import numpy as np

IMG_DIR = 'images/'
#certidao.jpg
img = cv2.imread(IMG_DIR+'certidao_1000.jpg')
#tamanho da imagem - dimensoes
print(img.shape)

#cutting image
height, width, _ = img.shape
roi = img[0:height,0:width]

#abre imagem
cv2.imshow("roi",roi)
cv2.imshow('Img',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
