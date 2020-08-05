from flask import Flask
app = Flask(__app__)

@app.route("/test")
def getTest():
    return {"result": 2 + 2}
