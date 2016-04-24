from flask import Flask, jsonify, render_template, request
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/mult_sliders')
def mult_sliders():
    return render_template('mult_sliders.html')


@app.route('/polar')
def polar():
    return render_template('polar.html')


@app.route('/polar_sample_1000')
def polar_sample():
    return render_template('polar_sample_1000.html')


@app.route('/slider')
def slider():
    return render_template('slider.html')


@app.route('/_calc_similarity')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)


@app.route('/ajax_test')
def ajax_test():
    return render_template('ajax_test.html')


if __name__ == '__main__':
    app.debug = True
    app.run()