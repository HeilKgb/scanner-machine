import cv2
import numpy as np

img = ('images/vertical.png', cv2.IMREAD_GRAYSCALE)

cv2.imshow('Vertical Image', cv2.resize(img, (500, 500), interpolation=0))
cv2.waitKey(0)
