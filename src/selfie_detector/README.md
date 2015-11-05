SELFIE_DETECTOR
---------------------

Selfie Detector listens to the channel that Vigilant Listener publishes on, 
and runs potential selfies through OCR (to try to eliminate memes, screenshots, etc.),
as well as multiple OpenCV cascades,
and pushes tweets that contain images that match certain criteria onto a redis queue.

