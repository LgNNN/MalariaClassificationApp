import os
import tensorflow as tf
from flask import Flask , request , jsonify , make_response
from tensorflow.keras.models import load_model

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

def load_image_bytes(bytes):
    img = tf.image.decode_image(bytes, channels=3)
    img = tf.image.resize(img, (130 , 130))
    img = img[tf.newaxis, :]
    return img

app = Flask(__name__)
CNN = load_model(os.path.join(os.getcwd(),'malariaNet-ep-10-fc-64-do-0.25-bs-32-test_acc-95.61.keras'))

@app.route('/',methods=['POST'])
def analyze():
    if request.method == 'POST':
        lst = []

        for file in request.files.getlist('files'):
            imgForModel= load_image_bytes(file.read())
            prediction = CNN.predict(imgForModel)      
            lst.append([ file.filename, float(prediction[0][0])])
        
        res = make_response(jsonify(results=lst))
        res.headers['Access-Control-Allow-Origin'] = '*'
    
        return res