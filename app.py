from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from gather_moviestar import gather_moviestar
client = MongoClient('localhost', 27017)
db = client.db_moviestar

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/list', methods=['GET'])
def get_moviestars():
    result = list(db.actors.find({},{'_id':0}).sort('like', -1))
    return jsonify({'result': 'success', 'moviestars': result})

@app.route('/api/like', methods=['POST'])
def like_moviestar():
    name = request.form['name_given']
    actor = db.actors.find_one({'name': name})
    like = actor['like']
    update_result = db.actors.update_one({'name': name}, {'$set':{'like': like + 1}})
    if update_result.modified_count:
        return jsonify({'result': 'success'})
    return jsonify({'result':'fail'})

@app.route('/api/hate', methods=['POST'])
def hate_moviestar():
    name = request.form['name_given']
    actor = db.actors.find_one({'name': name})
    like = actor['like']
    if like > 0:
        update_result = db.actors.update_one({'name': name}, {'$set':{'like': like - 1}})
        if update_result.modified_count:
            return jsonify({'result': 'success'})
    return jsonify({'result': 'fail'})

@app.route('/api/delete', methods=['DELETE'])
def remove_moviestar():
    name = request.form['name_given']
    result = db.actors.delete_one({'name': name})
    if result.deleted_count:
        return jsonify({'result': 'success'})
    return jsonify({'result': 'fail'})

@app.route('/api/hide', methods=['POST'])
def hide_moviestar():
    name = request.form['name_given']
    update_result = db.actors.update_one({'name': name}, {'$set':{'visible': False}})
    if update_result.modified_count:
        return jsonify({'result': 'success'})
    return jsonify({'result': 'fail'})

@app.route('/api/show', methods=['POST'])
def show_moviestar():
    name = request.form['name_given']
    update_result = db.actors.update_one({'name': name}, {'$set':{'visible': True}})
    if update_result.modified_count:
        return jsonify({'result': 'success'})
    return jsonify({'result': 'fail'})

    
@app.route('/api/reset', methods=['DELETE'])
def reset_database():
    db.actors.drop()
    gather_moviestar()
    return {'result':'success'}

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)