from flask import Flask, render_template, request, redirect, send_from_directory
import os
from flask_cors import CORS
import cv2
import sys
from PIL import Image
from transparent_background import Remover

app = Flask(__name__)
CORS(app)

currentDir = os.path.dirname(__file__)
remover = Remover(fast=True, jit=True)

@app.route('/removeBackground', methods=['GET'])
def get_video_file():
	imagePath = request.args.get('imagePath')
	unique_filename = request.args.get('unique_filename')
	extension = imagePath.rsplit('.', 1)[1].lower()
	try:
		inputs_dir = os.path.join(currentDir, 'public/inputs/')
		results_dir = os.path.join(currentDir, 'public/results/')
		masks_dir = os.path.join(currentDir, 'public/masks/')
		img = Image.open(imagePath).convert('RGB')
		img.save(inputs_dir+unique_filename+'.'+extension)
		out = remover.process(img) # remove background
		Image.fromarray(out).save(results_dir + unique_filename + '.png')
		out = remover.process(img, type='map') # mask
		Image.fromarray(out).save(masks_dir + unique_filename + '.png')

		return "---Success---"	
	except:
		return "---Empty image---"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)