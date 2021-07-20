/*const cannyEdgeDetector = require('cannyEdgeDetector')
const Image = require('image-js').Image

Image.load('certidao_1000').then((img) => {
    const gray = img.grey();
    const edge = cannyEdgeDetector(grey)
    return edge.save('edge.png')
})*/

const { Image } = require('image-js')
const cannyEdgeDetector = require('canny-edge-detector')

describe('canny-edge-detector test', () => {
    it('Main test', async () => {
        const promises = [Image.load('certidao_1000.jpg'), Image.load('test2.jpg')];
        const images = await Promise.all(promises);
        const params = {
            gaussianBlur: 1.1
        };
        const edges1 = cannyEdgeDetector(images[0].grey(), params);
        const edges2 = cannyEdgeDetector(images[1].grey(), params);
        const expectedOutput = images[1];
        expectedOutput.colorModel = 'GREY';

        expect(expectedOutput.getSimilarity(edges1)).toBeGreaterThan(0.7);
        expect(expectedOutput.getSimilarity(edges2)).toBeGreaterThan(0.7);
    });
});

console.log('teste aqui')