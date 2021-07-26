import cv2
import numpy as np

img = cv2.imread('images/vertical.png', cv2.IMREAD_GRAYSCALE)


def classify_image(img):
    # 1 - simplify image by 255
    img = img/255
    print(img)
    # 2 - flatten image
    img_flatten = img.flatten()
    # 3 filter
    filter = [1, -1, 1, -1, 1, -1, 1, -1, 1] * 10000
    # 4 multiply filter * flatten image
    convolution = img_flatten * filter
    print(convolution)
    # 5 sum
    sum_convolution = sum(convolution)
    print(sum_convolution)
    # 6 condition
    if sum == 1:
        return "horizontal"
    else:
        return "vertical"


result = classify_image(img)
print(result)

img2 = cv2.imread('images/horizontal.png', cv2.IMREAD_GRAYSCALE)
result = classify_image(img)
print(result)
