// Canvas and Images 
var canvas1 = document.getElementById("canvas_1");
var canvas2 = document.getElementById("canvas_2");

// Load Road image 
var imageRoad = new MarvinImage();
imageRoad.load("https://i.imgur.com/NOAqlBx.jpg", imageRoadLoaded);

// Load Passport image 
var imagePassport = new MarvinImage();
imagePassport.load("https://i.imgur.com/WuS6M6a.png", imagePassportLoaded);

// Find Text regions in the road image 
function imageRoadLoaded() {
    var segments = Marvin.findTextRegions(imageRoad, 10, 20, 70, 200);
    drawSegments(segments, imageRoad);
    imageRoad.draw(canvas1);
}

// Find Text regions in the passport image 
function imagePassportLoaded() {
    var segments = Marvin.findTextRegions(imagePassport, 15, 8, 30, 150);
    drawSegments(segments, imagePassport);
    imagePassport.draw(canvas2);
}

function drawSegments(segments, image) {
    for (var i in segments) {
        var seg = segments[i];
        // Skip segments that are too small
        if (seg.height >= 5) {
            image.drawRect(seg.x1, seg.y1 - 5, seg.width, seg.height + 10, 0xFFFF0000);
            image.drawRect(seg.x1 + 1, seg.y1 - 4, seg.width - 2, seg.height + 8, 0xFFFF0000);
        }
    }
} // Canvas and Images 
var canvas1 = document.getElementById("canvas_1");
var canvas2 = document.getElementById("canvas_2");

// Load Road image 
var imageRoad = new MarvinImage();
imageRoad.load("https://i.imgur.com/NOAqlBx.jpg", imageRoadLoaded);

// Load Passport image 
var imagePassport = new MarvinImage();
imagePassport.load("https://i.imgur.com/WuS6M6a.png", imagePassportLoaded);

// Find Text regions in the road image 
function imageRoadLoaded() {
    var segments = Marvin.findTextRegions(imageRoad, 10, 20, 70, 200);
    drawSegments(segments, imageRoad);
    imageRoad.draw(canvas1);
}

// Find Text regions in the passport image 
function imagePassportLoaded() {
    var segments = Marvin.findTextRegions(imagePassport, 15, 8, 30, 150);
    drawSegments(segments, imagePassport);
    imagePassport.draw(canvas2);
}

function drawSegments(segments, image) {
    for (var i in segments) {
        var seg = segments[i];
        // Skip segments that are too small
        if (seg.height >= 5) {
            image.drawRect(seg.x1, seg.y1 - 5, seg.width, seg.height + 10, 0xFFFF0000);
            image.drawRect(seg.x1 + 1, seg.y1 - 4, seg.width - 2, seg.height + 8, 0xFFFF0000);
        }
    }
}