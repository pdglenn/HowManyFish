//$SCRIPT_ROOT = {{ request.script_root|tojson|safe }};
var width = $("#scatter_plot").width(),
  height = $("#scatter_plot").height();

radius = Math.min(width, height) / 2 - 10;

var svg = d3.select("#scatter_plot").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("id", "circle_svg")
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



var r = d3.scale.linear()
  .domain([0, 1])
  .range([radius, radius*.07]);

var line = d3.svg.line.radial()
  .radius(function(d) {
    return r(d[1]);
  })
  .angle(function(d) {
    return -d[0] + Math.PI / 2;
  });

var gr = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data(r.ticks(3))
  .enter().append("g");

gr.append("circle")
  .attr("r", r);


/*
var ga = svg.append("g")
  .attr("class", "a axis")
  .selectAll("g")
  .data(d3.range(0, 360, 30))
  .enter().append("g")
  .attr("transform", function(d) {
    return "rotate(" + -d + ")";
  });

ga.append("line")
  .attr("x2", radius);
*/
var color = d3.scale.category20();

var line = d3.svg.line.radial()
  .radius(function(d) {
    return r(d[1]);
  })
  .angle(function(d) {
    return -d[0] + Math.PI / 2;
  });
  
// function getData(){
//   var data3 = [];
//   for (var i = 0; i < 1000; i++){
//     data3.push(Math.random() * 100);
//   }
//   return data3;
// };
var globalData;
function initialUpdate(num){
  console.log("updating");
  trueValues = {0: 0, 10: 1, 50: 10, 100: 250};
  importances = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  console.log(importances);
  //d3.json($SCRIPT_ROOT + '/_add_numbers?num='+num, function(error, data) {
  d3.json("" + '/_compatibility_calc?importances='+importances, function(error, data) {
    globalData = data;
    updateWithData(data);
  });
};

function update(num){
  console.log("updating");
  trueValues = {0: 0, 10: 1, 50: 10, 100: 250}
  importances = []

  for (var i = 1; i < 11; i++){
    importances.push(trueValues[$("#slider"+i).slider("option", "value")])
  }
  console.log(importances);
  //d3.json($SCRIPT_ROOT + '/_add_numbers?num='+num, function(error, data) {
  d3.json("" + '/_compatibility_calc?importances='+importances, function(error, data) {
    globalData = data;
    updateWithData(data);
  });
};

function updateWithData(data){
  console.log('updating');
  //console.log(data);
  var circles = svg.selectAll("circle.point").data(data);
  console.log(data.length)

  circles.enter()
    .append("circle")
    .attr("class", "point")
    .attr("r", 0)
    .attr("fill",function(d,i){
      return color(i);
    })
    .attr("transform", function(d, i) {
      var coors = line([[i, 0]]).slice(1).slice(0, -1);
      return "translate(" + coors + ")"
    })
    .transition()
      .duration(1500)
      .attr("r", 2) 
      .attr("transform", function(d, i) {
        var coors = line([[i, d.compatibility]]).slice(1).slice(0, -1);
        return "translate(" + coors + ")"
      })


   circles.transition()
    .duration(1500)
    .attr("transform", function(d, i) {
      var coors = line([[i, d.compatibility]]).slice(1).slice(0, -1);
      return "translate(" + coors + ")"
    })
    .attr("r", 2);



    circles.exit()
      .transition()
      .duration(1500)
      .attr("transform", function(d, i) {
        var coors = line([[i, 0]]).slice(1).slice(0, -1);
        return "translate(" + coors + ")"
      })
      .attr("r", 0)
      .remove();  
};


// $(function() {
//   $( "#slider1" ).slider({
//     min: 100,
//     max: 5000,
//     value: 500,
//     change: function( event, ui ){
//       update(ui.value);
//     }
//   });
// });

// $("#slider1").slider({
//     range: "min",
//     min: 0,
//     max: 100,
//     value: 60,
//     change: function( event, ui ){
//       update(ui.value);
//     }
// });

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

initialUpdate(500);



