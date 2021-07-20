import cv2
import numpy as np

# load images    
vertical = cv2.imread('images/vertical.png',cv2.IMREAD_GRAYSCALE)
horizontal = cv2.imread('images/horizontal.png',cv2.IMREAD_GRAYSCALE)

#1 -image preparation 
vertical = vertical/255
horizontal = horizontal/255

vertical_flattened = vertical.flatten()
horizontal_flattened = horizontal.flatten()




cv2.imshow('Vertical Image',cv2.resize(vertical,(500,500),interpolation = 0))
cv2.imshow('Horizontal Image',cv2.resize(horizontal,(500,500),interpolation = 0))
print('Vertical Image',vertical)
cv2.waitKey(0)