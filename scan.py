from numpy.core.fromnumeric import reshape
from pyimagesearch import transform
from pyimagesearch import imutils 
from scipy.spatial import distance as dist 
from matplotlib.patches import Polygon
import polygon_interacter as poly_i
import numpy as np
import matplotlib.pyplot as plt 
import itertools 
import math 
import cv2
from pylsd.lsd import lsd 

import argparse  
import os

class DocScanner(object):
    """An image scanner"""

    def __init__(self,interactive=False, MIN_QUAD_AREA_RATIO=0.25,MAX_QUAD_ANGLE_RANGE=40):
        """
        Args: interactive (boolean): If True, user can adjust screen contour before transformation occurs in interactive pyplot windon.
        MIN_QUAD_AREA_RATIO(float): A contour will be rejected if its corners do not form a quadrilateral that covers at least MIN_QUAD_AREA_RAT of the original image.Defaults to 0.25.
        MAX_QUAD_ANGLE_RANGE(int): A contour will also be rejected if the range of its interior angles exceeds MAX_QUAD_ANGLE_RANGE. Defaults to 40.
        """

        self.interactive = interactive 
        self.MIN_QUAD_AREA_RATIO = MIN_QUAD_AREA_RATIO
        self.MAX_QUAD_ANGLE_RANGE = MAX_QUAD_ANGLE_RANGE

    def filter_corners(self,corners,min_dist= 20):
        """Filters corners that are within min_dist of others"""
        def predicate(representatives,corner):
            return all(dist.euclidean(representatives, corner) >= min_dist
            for representatives in representatives)

        filtered_corners = []
        for c in corners:
            if predicate(filtered_corners,c):
                filtered_corners.append(c)
        return filtered_corners

    def angle_between_vectors_degrees(self,u,v):
        """Return the angle between two vectores in degrees"""
        return np.degrees(
            math.acos(np.dot(u,v)/(np.linalg.norm(u) * np.linalg.norm(v)))
        )

    def get_angle(self,p1,p2,p3):
        """Returns the angle between the line segment from p2 to p1
            and the line segment from p2 to p3 in degrees"""

        a = np.radians(np.array(p1))
        b = np.radians(np.array(p2))
        c = np.radians(np.array(p3))

        avec = a - b
        cvec = c - b 

        return self.angle_between_vectors_degrees(avec, cvec)

    def angle_range(self,quad):
        """Returns the range between max and min interior angles of quadrilateral.
        The input quadrilateral must be a numpy array with vertices ordered clockwise starting with the top left vertex."""

        tl,tr,br,bl = quad
        ura = self.get_angle(tl[0],tr[0],br[0])
        ula = self.get_angle(bl[0],tl[0],tr[0])
        lra = self.get_angle(tr[0],br[0],bl[0])
        lla = self.get_angle(br[0],bl[0],tl[0])

        angles = [ura,ula,lra,lla]
        return np.ptp(angles)

    def get_corners(self,img):
        """Returns a list of corners ((x, y) tuples) found in the input image. With proper
        pre-processing and filtering, it should output at most 10 potential corners.
        This is a utility function used by get_contours. The input image is expected 
        to be rescaled and Canny filtered prior to be passed in."""

        lines = lsd(img)

        lines = [] 
        
        if lines is not None:
            lines = lines.squeeze().astype(np.int32)
            horizontal_lines_canvas = np.zeros(img.shape,dtype=np.uint8)
            vertical_lines_canvas = np.zeros(img.shape,dtype=np.uint8)
            for line in lines:
                x1,y1,x2,y2, _ = line