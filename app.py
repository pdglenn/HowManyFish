from flask import Flask, jsonify, render_template, request
import random
from calc_compatibility import calc_compatibility

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/sunburst')
def sunburst():
    return render_template('sunburst.html')


@app.route('/mult_sliders')
def mult_sliders():
    return render_template('mult_sliders.html')


@app.route('/polar')
def polar():
    return render_template('polar.html')


@app.route('/polar_sample_1000')
def polar_sample():
    return render_template('polar_sample_1000.html')


@app.route('/polar_sample_10000')
def polar_sample_10000():
    return render_template('polar_sample_10000.html')


@app.route('/slider')
def slider():
    return render_template('slider.html')


@app.route('/_add_numbers')
def add_numbers():
    num = request.args.get('num', 100, type=int)
    return jsonify(data=[random.random() * 100 for x in range(num)])


@app.route('/_compatibility_calc')
def compatibility_calc():
    answers = request.args.get('answers')
    importances = request.args.get('importances')

    compatibility_json = calc_compatibility.calc_compatability(answers, importances)
    return compatibility_json


@app.route('/ajax_test')
def ajax_test():
    return render_template('ajax_test.html')


@app.route('/ajax_test2')
def ajax_test2():
    return render_template('ajax_test2.html')


if __name__ == '__main__':
    app.debug = True
    app.run()