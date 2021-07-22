import numpy as np
import argparse
import imutils
import cv2
import pytesseract
from imutils import paths


rectKernel = cv2.getStructuringElement(cv2.MORPH_RECT,(13,5))
sqKernel = cv2.getStructuringElement(cv2.MORPH_RECT,(21,21))

ap = argparse.ArgumentParser()
ap.add_argument('-i','--image',required=True)
args = vars(ap.parse_args())

def mask(image, debug = False):