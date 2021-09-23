from flask import Flask, render_template, jsonify
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.db_moviestar

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/moviestar', methods=['GET'])
def get_moviestars():
    result = list(db.actors.find({},{'_id':0}).sort('like', -1))
    return jsonify({'result':'success', 'moviestars':result})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)