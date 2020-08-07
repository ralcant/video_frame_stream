from flask import Flask, request, Response, stream_with_context
#from flask_cors import CORS, cross_origin

import cv2
import base64
# import requests
###########3 Importing from reconet ########
from reconet_torch_copy.model_creator import get_all_models
import torch

############################################
app = Flask(__name__)
#CORS(app)
color = True
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
models, originals = get_all_models(device)
curr_model = models[0]
model_index = 0

@app.route("/test", methods=['GET', 'POST'])
def getTest():
    result = request.get_json()
    return {"result": result['num']+1}

@app.route("/changeModel")
def update_model():
    global model_index
    global curr_model
    model_index = (model_index+1) % len(models)
    curr_model = models[model_index]
    return {"status": 200, "message": "Changed model!"}


@app.route("/changeColor")
def changeColor():
    global color
    color = not color
    return {"status": 200, "message": "Everything good here bruh"}
@app.route('/image')
def getImage():
    path = "reconet_torch_copy/videos/daily.mp4"
    # path = 0
    return Response(get_stream(path), mimetype="text")
# @stream_with_context
def get_stream(path):
    # for i in range(100):
    #     yield str(i)
    # return
    cap = cv2.VideoCapture(path)
    # i = 0
    w  = 320 #int(vid_obj.get(cv2.CAP_PROP_FRAME_WIDTH) /3 ) # dividing because we will be resizing!
    h = 180 #int(vid_obj.get(cv2.CAP_PROP_FRAME_HEIGHT) /3 )# float
    while True:
        ret, frame = cap.read()
        # ret, frame = cap.read()
        # ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, dsize=(w, h))#,fx=1/3, fy=1/3)
        # frame = cv2.color(frame, cv2.CV2)
        #if not color:
        #    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame = style_frame(frame)

        encoded_frame = get_encode(frame) # { "frame", }
        # print(frame.shape)
        # print("encoded frame:")
        # print(encoded_frame)
        # print("\n")
        # i+=1
        # print("sedning frame #"+str(i))
        yield "data:image/png;base64," + encoded_frame + "#"
        # yield "#"
        # break
        

    cap.release()
def get_encode(frame):
    
    retval, buffer = cv2.imencode('.jpg', frame)
    jpg_as_text = base64.b64encode(buffer)
    # print(jpg_as_text)
    x = jpg_as_text.decode("utf-8") #delete the b'' elements
    return x #f"data:image/png;base64,{x}"

def style_frame(frame):
    if curr_model is not None:
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        img = torch.from_numpy(frame.astype('float32') / 255.0).permute(2, 0, 1)
        img = img.to(device)
        _, output = curr_model(img.unsqueeze(0))
        concat_img = output.squeeze(0).permute(1, 2, 0)
        # if concat:
        #     concat_img = torch.cat([img, output.squeeze(0)], dim=1).permute(1, 2, 0)
        concat_cv2 = concat_img.detach().cpu().numpy()

        frame = concat_cv2 * 255
        frame = frame.astype('uint8')
        frame=cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, dsize=(640, 360))
    return frame


