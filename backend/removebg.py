import os
import sys
import cv2
from PIL import Image
from transparent_background import Remover

currentDir = os.path.dirname(__file__)
remover = Remover(fast=True, jit=True)

def removeBg(imagePath):
	unique_filename = sys.argv[2]
	extension = imagePath.rsplit('.', 1)[1].lower()
	try:
		discord_dir = os.path.join(currentDir, 'public/discord/Danylo#5399')
		inputs_dir = os.path.join(currentDir, 'public/inputs/')
		results_dir = os.path.join(currentDir, 'public/results/')
		masks_dir = os.path.join(currentDir, 'public/masks/')
		img = Image.open(imagePath).convert('RGB')
		img.save(inputs_dir+unique_filename+'.'+extension)
		out = remover.process(img, type='map') # mask
		Image.fromarray(out).save(masks_dir + unique_filename + '.png')
		out = remover.process(img) # remove background
		Image.fromarray(out).save(results_dir + unique_filename + '.png')

		return "---Success---"
	except:
		return "---Empty image---"


imgPath = sys.argv[1]
print(removeBg(imgPath))

