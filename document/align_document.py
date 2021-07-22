import cv2
from pyimagesearch.alignment import align_Images
import numpy as np
import argparse
import imutils

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True,
                help="path to input image that we'll align to template")
ap.add_argument("-t", "--template", required=True,
                help="path to input template image")
args = vars(ap.parse_args())

print("[INFO] loading images...")
image = cv2.imread(args["image"])
template = cv2.imread(args["template"])
print("[INFO] aligning images...")

aligned = align_Images.align_images(image, template, debug=True)
aligned = imutils.resize(aligned, width=700)
template = imutils.resize(template, width=700)
stacked = np.hstack([aligned, template])

overlay = template.copy()
output = aligned.copy()
cv2.addWeighted(overlay, 0.5, output, 0.5, 0, output)

cv2.imshow("Image Alignment Stacked", stacked)
cv2.imshow("Image Alignment Overlay", output)
cv2.waitKey(0)
