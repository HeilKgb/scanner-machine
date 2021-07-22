import cv2
import numpy as np

# load images
vertical = cv2.imread('images/vertical.png', cv2.IMREAD_GRAYSCALE)
horizontal = cv2.imread('images/horizontal.png', cv2.IMREAD_GRAYSCALE)

# 1 -image preparation
vertical = vertical/255
horizontal = horizontal/255

vertical_flattened = vertical.flatten()
horizontal_flattened = horizontal.flatten()

# 2 create image recognition
filter = [1, -1, 1, -1, 1, -1, 1, -1, 1]
filter = filter * 10000
print(sum(filter*horizontal_flattened))
print(sum(filter*vertical_flattened))


horizontal_sum = sum(horizontal_flattened)
print(horizontal_sum)
vertical_sum = sum(vertical_flattened)
print(vertical_sum)
print("vertical: ", vertical_flattened)
print("horizontal: ", horizontal_flattened)


cv2.imshow('Vertical Image', cv2.resize(vertical, (500, 500), interpolation=0))
cv2.imshow("Vertical Flattened", cv2.resize(vertical_flattened, (500, 500), interpolation=0))

cv2.imshow('Horizontal Image', cv2.resize(horizontal, (500, 500), interpolation=0))
cv2.imshow("horizontal Flattened", cv2.resize(horizontal_flattened, (300, 500), interpolation=0))
cv2.waitKey(0)
