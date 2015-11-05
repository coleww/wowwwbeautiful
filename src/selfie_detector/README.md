SELFIE_DETECTOR
---------------------

Selfie Detector listens to the channel that Vigilant Listener publishes on, 
and runs potential selfies through OCR (to try to eliminate memes, screenshots, etc.),
as well as multiple OpenCV cascades,
and pushes tweets that contain images that match certain criteria onto a redis queue.

__________________________

### DEVELOPMENT

- make a /test_imgs folder in this directory
- add example images for the three cases, like so:

```
  - text1.jpg
  - text3.jpg
  - yep1.jpg
  - nope.jpg
  - nope7.png
```