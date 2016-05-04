///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////Sliders/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
sliderIDs = ["#slider1", "#slider2", "#slider3", "#slider4", "#slider5", 
             "#slider6", "#slider7", "#slider8", "#slider9", "#slider10"];


// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider1").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider2").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider3").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider4").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider5").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider6").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider7").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider8").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider9").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

// http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
$(function() {
    var trueValues = [0, 1, 10, 250];
    var values =     [0, 10, 50, 100];
    var slider = $("#slider10").slider({
        orientation: 'horizontal',
        min: 0,
        max: 100,
        value: 10,
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var value = findNearest(includeLeft, ui.value);
            if (ui.value == ui.value) {
                slider.slider('value', value);
            }
            else {
                slider.slider('value', value);
            }
            $("#price-amount").html('$' + getRealValue(slider.slider('values', 0)) + ' - $' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            update();
        }
    });
    function findNearest(includeLeft, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if (includeLeft && values[i] <= value) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }
    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }
});

