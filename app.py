from flask import Flask, jsonify, render_template, request
import random
from calc_compatibility import calc_compatibility_loc, aggregate_profile_data

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

    try:
        importances = list(map(int, request.args.get('importances').split(',')))
    except:
        importances = [250, 10, 1, 0, 10, 250, 10, 10, 1, 1]

    print(importances)
    print(type(importances))

    user_answers = ['Arrogance', 'Rarely/Never', 'Witty/tongue in cheek', 'Yes', 'Average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']
    user_preferences = ['Immaturity', 'Sometimes', 'Sarcastic', 'No', 'Below average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']

    compatibility_threshold = 0

    compatibility_json, people_frame = calc_compatibility_loc.get_compatibility_json(user_answers,
                                                                                 user_preferences,
                                                                                 importances)

    aggregate_json = aggregate_profile_data.get_aggregate_json(compatibility_threshold, people_frame)

    #return aggregate_json
    return "["+compatibility_json+",["+aggregate_json+"]]"

@app.route('/ajax_test')
def ajax_test():
    return render_template('ajax_test.html')


@app.route('/andrea')
def andrea():
    return render_template('index_andreasbarcharts_v5.3.0140.html')

@app.route('/ajax_test2')
def ajax_test2():
    return render_template('ajax_test2.html')


if __name__ == '__main__':
    app.debug = True
    app.run()