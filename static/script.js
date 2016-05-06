//$SCRIPT_ROOT = {{ request.script_root|tojson|safe }};
var circleWidth = $("#scatter_plot").width(),
  circleHeight = $("#scatter_plot").height();

var cX = circleWidth / 2;
var cY = circleHeight / 2;

radius = Math.min(circleWidth, circleHeight) / 2 - 10;

var svg = d3.select("#scatter_plot").append("svg")
  .attr("width", circleWidth)
  .attr("height", circleHeight)
  .attr("id", "circle_svg")
  .append("g")
    .attr("class", "circle_g")
    .attr("transform", "translate(" + circleWidth / 2 + "," + circleHeight / 2 + ")");

// http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
var tooltip = d3.select("#scatter_plot").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var bartip = d3.select("#bars_container").append("div")
  .attr("class", "bartip")
  .style("opacity", 0);


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

// http://stackoverflow.com/questions/19202450/adding-an-image-within-a-circle-object-in-d3-javascript
var mdef = d3.select("body").append("svg")
  .attr("id", "pint")
  .attr("width", 0)
  .attr("height", 0)
  .append("defs")
  .attr("id", "mdef");

mdef.append("pattern")
  .attr("id", "emily")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", radius*.04)
  .attr("width", radius*.04)
  .append("image")
  .attr("x", -40)
  .attr("y", -20)
  .attr("width", 2*radius*.14)
  .attr("height", 2*radius*.14)
  .attr("xlink:href", "/static/emily.jpeg");

mdef.append("pattern")
  .attr("id", "paul")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", radius*.04)
  .attr("width", radius*.04)
  .append("image")
  .attr("x", -35)
  .attr("y", -10)
  .attr("width", 2*radius*.14)
  .attr("height", 2*radius*.14)
  .attr("xlink:href", "/static/paul.jpg");


var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on("drag", dragmove)
  .on("dragend", dragend);

var gr = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data([r(0)])
  .enter().append("g");

gr.append("circle")
  .attr("r", r(0))
  .attr("stroke-width", 2);

var dr = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data([r(.5)])
  .enter().append("g");

dr.append("circle")
  .attr('id', 'threshold')
  .attr("r", r(.5))
  .attr("stroke-width", 5)
  .attr("cursor", "move")
  .call(drag);

var ir = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data([r(1)])
  .enter().append("g");

ir.append("circle")
  .attr("r", r(1))
  .attr("stroke-width", 2)
  .style("fill", "url(#emily)")

  .on("mouseover", function(){
    d3.select(this)
      .style("fill", "url(#paul)");
  })
  .on("mouseout", function(){
    d3.select(this)
      .style("fill", "url(#emily)");
  });

var compat_text = d3.select("#circle_svg").append("text")
  .attr("id", "compat_text")
  .attr("x", 25)
  .attr("y", 75)
  .style("fill", "white")
  .style('font-family', "Open Sans")
  .text("Compatibility Threshold: 50%");

d3.select("#circle_svg").append("text")
  .attr("id", "compat_text")
  .attr("x", 25)
  .attr("y", 55)
  .style("fill", "white")
  .style('font-family', "Open Sans")
  .text("Drag the bold circle to change your threshold");

// http://bl.ocks.org/mbostock/1557377
// http://stackoverflow.com/questions/18571563/d3s-mouse-coordinates-relative-to-parent-element
function dragmove(d){
  m = d3.mouse(d3.select('#scatter_plot').node());
  var radius = Math.min(r(0), Math.max(Math.sqrt(Math.pow(cX - m[0], 2) + Math.pow(cY - m[1], 2)), r(1)));

  d3.select(this)
    .attr("r", radius);
  threshold = Math.round(r.invert($('#threshold').attr("r")) * 100);
  compat_text.text("Compatibility Threshold: " + threshold + "%");
}

function dragend(d){
  circleUpdate();
}

var color = d3.scale.category20();

function pickColor(d, id) {
  var colorList = {'age': z_green,
    'education': z_blue,
    'ethnicity': z_purple,
    'height': z_pink,
    'body_type': z_red};

  category = id.split('#')[1].split('_')[0];
  choices = responses[category];

  if (category == 'bodytype'){
    category = 'body_type';
  }

  index = $.inArray(d[category + '_norm'], choices);

  if (index == -1) {
    return '#FFFFFF'
  }

  colorScale = colorList[category];
  return colorScale(index);
}

function updateColors(category) {
  var circles = svg.selectAll("circle.point").data(gData[0]);
  circles.transition()
    .attr("fill", function(d){ return pickColor(d, category)});
}

function tooltipText(d){
  return "Username: " + d.username + "<br/>" + 
         "Compatibility: " + Math.round(d.compatibility*100) + "%<br/>" +
         "Ethnicity: " + d.ethnicity_norm + "<br/>" + 
         "Body type: " + d.body_type_norm + "<br/>" +
         "Height: " + d.height_norm + "<br/>" + 
         "Age: " + d.age_norm + "<br/>" + 
         "Education: " + d.education_norm
}

//http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function bartipText(d){
  return toTitleCase(d.category) + "<br/>" + Math.round(d.y*100)+"%";
}

var gData;

function initialUpdate(){
  trueValues = {0: 0, 10: 1, 50: 10, 100: 250};
  importances = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  //d3.json($SCRIPT_ROOT + '/_add_numbers?num='+num, function(error, data) {
  d3.json("" + '/_compatibility_calc?importances='+importances, function(error, data) {
    gData = data;
    circleUpdateWithData(data[0]);
    initialUpdateBars();
    barsUpdateWithData(data[1][0]);
  });
}

function circleUpdate(){
  var trueValues = {1: 0, 2: 1, 3: 10, 4: 250};
  var importances = [];

  for (var i = 1; i < 11; i++){
    importances.push(trueValues[$("#slider"+i).slider("option", "value")])
  }
  var compatibility = r.invert($('#threshold').attr("r"));

  d3.json("" + '/_compatibility_calc?compatibility='+compatibility+'&importances='+importances, function(error, data) {
    gData = data;
    circleUpdateWithData(data[0]);
    barsUpdateWithData(data[1][0]);
  });
}

function circleUpdateWithData(data){

  var circles = svg.selectAll("circle.point").data(data);

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
    .on("mouseover", function(d) {    
    tooltip.transition()    
        .duration(200)    
        .style("opacity", .9);
    tooltip.html(tooltipText(d))  
        .style("left", (d3.event.pageX) + "px")   
        .style("top", (d3.event.pageY) - 210 + "px");  
    })          
  .on("mouseout", function(d) {   
    tooltip.transition()    
        .duration(500)    
        .style("opacity", 0); 
  })
  .transition()
    .duration(1500)
    .attr("r", 3.5)
    .style("fill-opacity", 0)
    .attr("transform", function(d, i) {
      var coors = line([[i, d.compatibility]]).slice(1).slice(0, -1);
      return "translate(" + coors + ")"
    });


   circles.transition()
    .duration(1500)
    .attr("transform", function(d, i) {
      var coors = line([[i, d.compatibility]]).slice(1).slice(0, -1);
      return "translate(" + coors + ")"
    })
    .attr("r", 3.5)
     .style("opacity", 1);

    circles.exit()
      .transition()
      .duration(1500)
      .attr("transform", function(d, i) {
        var coors = line([[i, 0]]).slice(1).slice(0, -1);
        return "translate(" + coors + ")"
      })
      .attr("r", 0)
      .remove();

}

// http://simeydotme.github.io/jQuery-ui-Slider-Pips/
var options = ['Irrelevant: 0', 'A Little Important: 1', 'Somewhat Important: 10', 'Very Important: 250'];
$(function() {
  for (var i = 1; i<11; i++){
    var slider = $( "#slider"+i ).slider({
      min: 1,
      max: 4,
      value: 2,
      step: 1,
      change: function( event, ui ){
        circleUpdate();
      }
    }).slider('float', {'labels': options});//, {
    //   rest: 'label',
    //   labels: options
    // });
  }
  //   var width = slider.width() / (options.length - 1);
  //  // $("#slider"+i).after('<div class="ui-slider-legend"><p style="width:' + width + 'px;">' + options.join('</p><p style="width:' + width + 'px;">') +'</p></div>');
  // }
});




//----------------------------

var w = 160,
h = 500;
var legend_h = 250;

w = a=$('.col-md-15').width()-10;

var barContainer = d3.select('#bars_container');
var tip;
var svg_age, svg_education, svg_ethnicity, svg_height, svg_bodytype;
var legend_age, legend_education, legend_ethnicity, 
  legend_height, legend_bodytype;
var barOuterPad = 0, barPad = .5;

var x = d3.scale.ordinal().rangeRoundBands([0, w-50], barPad, barOuterPad);
var y = d3.scale.linear().range([0, h-75]);

// Age
var z_green = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#20BF55"]);

// var z_green = d3.scale.ordinal()
//   .domain([0, 4])
//   .range(['#FFFFFF', '#20BF55','#EF946C','#D30C7B','#822E81']);

// Education
var z_blue = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#246EB9"]);
// var z_blue = d3.scale.ordinal()
//   .domain([0, 4])
//   .range(['#ffffff', '#DBFE87','#FF6B35','#D2FF28','#9e9ac8']);

// Ethnicity
var z_purple = d3.scale.linear()
  .domain([0, 6])
  .range(["#ECEBE4", "#D30C7B"]);
//
// var z_purple = d3.scale.ordinal()
//   .domain([0, 9])
//   .range( ['#FFFFFF', '#0E84A1', '#FF6700 ', '#0496FF', '#A8981B',
//     '#EAC435', '#1CC000 ', '#FE7C0D', '#5FC2F1', '#7CEA9C']);

// Height
var z_pink = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#FB8B24"]);

// var z_pink = d3.scale.ordinal()
//   .domain([0, 4])
//   .range(['#ffffff', '#A682FF','#61E294','#E3B505','#55C1FF']);

// Body Type
var z_red = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#1B998B"]);

// var z_red = d3.scale.ordinal()
//   .domain([0, 4])
//   .range(['#ffffff', '#20BF55','#FFE74C','#D30C7B','#FFB86F']);

var responses = {
  'age': ['not answered', 'over 45', '36 to 45',
    '26 to 35', '18 to 25'],
  'education': ['not answered', 'advanced degree', 'bachelors degree',
    'some college', 'high school'],
  'ethnicity': ['not answered', 'other', 'Indicated 2 or more ethnicities',
    'white', 'hispanic / latin', 'black', 'asian', 'pacific islander',
    'native american', 'indian'],
  'height': ['not answered', "over 6'", "5'6 to 5'11",
    "5' to 5'5", "under 5'"],
  'bodytype': ['not answered', 'a little extra', 'ripped',
    'average', 'thin']
};




function initCanvas(id){
  return d3.select(id).append("svg:svg")
    .attr("class", "chart")
    .attr("width", w)
    .attr("height", h+legend_h)
    .append("svg:g")
    .attr("transform", "translate(10,460)")
    .on("click", function() {
      updateColors(id);
    });
}

function initLegend(responses, colors){
  return d3.legend.color()
    // .classPrefix("legend_age")
    .shapeWidth(15)
    .shapeHeight(15)
    .shapePadding(10)
    .orient('vertical')
    .labels(responses)
    .scale(colors)
    .cells(responses.length)
    .ascending(true);
  // .title('Age');
}

function appendText(svg, text, color){
  svg.append("text")
    .attr("x", '40%')
    .attr("y", -440)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", color)
    .text(text);
}
function initialUpdateBars(){
//   tip = d3.tip()
//     .attr('class', 'd3-tip')
//     .offset([40, 85])
//     .html(function(d, i) {
//         return d.category + ": <span style='color:white'>" + Math.round(d.y*100).toFixed(0) + "%";
//     });

  svg_age = initCanvas('#age_chart');
  // svg_age.call(tip);
  legend_age = initLegend(responses.age, z_green);
  appendText(svg_age, "Age", "#20BF55");
  svg_age.append("g")
    .attr("class", "legend_age")
    .attr("transform", "translate(0, 10)");

  svg_education = initCanvas('#education_chart');
  // svg_education.call(tip);
  legend_education = initLegend(responses.education, z_blue);
  appendText(svg_education, "Education", "#246EB9");
  svg_education.append("g")
    .attr("class", "legend_education")
    .attr("transform", "translate(0, 10)");

  svg_ethnicity = initCanvas('#ethnicity_chart');
  // svg_ethnicity.call(tip);
  legend_ethnicity = initLegend(responses.ethnicity, z_purple);
  appendText(svg_ethnicity, "Ethnicity", "#D30C7B");
  svg_ethnicity.append("g")
    .attr("class", "legend_ethnicity")
    .attr("transform", "translate(0, 10)");

  svg_height = initCanvas('#height_chart');
  // svg_height.call(tip);
  legend_height = initLegend(responses.height, z_pink);
  appendText(svg_height, "Height", "#FB8B24");
  svg_height.append("g")
    .attr("class", "legend_height")
    .attr("transform", "translate(0, 10)");

  svg_bodytype = initCanvas('#bodytype_chart');
  // svg_bodytype.call(tip);
  legend_bodytype = initLegend(responses.bodytype, z_red);
  appendText(svg_bodytype, "Body Type", "#1B998B");
  svg_bodytype.append("g")
    .attr("class", "legend_bodytype")
    .attr("transform", "translate(0, 10)");
}
var gStack;
var gChartList;

function barsUpdateWithData(data){
  var stacked = stackData(data);
  gStack = stacked;
  var chartList = {'age': [svg_age, legend_age, z_green],
    'education': [svg_education, legend_education, z_blue],
    'ethnicity': [svg_ethnicity, legend_ethnicity, z_purple],
    'height': [svg_height, legend_height, z_pink],
    'bodytype': [svg_bodytype, legend_bodytype, z_red]};
  gChartList = chartList;

  for (var chart in chartList){
    if (chartList.hasOwnProperty(chart)){
      var svg = chartList[chart][0];
      var legend = chartList[chart][1];
      var color = chartList[chart][2];

      var rects = svg.selectAll('rect.valgroup').data(stacked[chart]);

      rects.enter()
        .append('rect')
        .attr('x', function(d) { return x(d.x) })
        .attr('y', function(d) { return -y(d.y0) - y(d.y) })
        .attr('height', function(d) { return y(d.y) })
        .attr('width', w)
        .attr('class', 'valgroup')
        .style('fill', function(d, i){ return color(i) })
        .style('stroke', function(d, i) {
          return d3.rgb(color(i)).darker();
        })
        .on("mouseover", function(d) {
            bartip.transition()
              .duration(200)
              .style("opacity", .9);
            bartip.html(bartipText(d))
              .style("left", (d3.event.pageX)- $("#circle_svg").width() - 165 + "px")
              .style("top", (d3.event.pageY) -150+ "px");
          })
            .on("mouseout", function(d) {
              bartip.transition()
                .duration(500)
                .style("opacity", 0);
            });
        // .transition()
        // .duration(1500)
        // .attr('height', function(d) { return y(d.y) });

      rects.transition()
        .duration(1500)
        .attr('x', function(d) { return x(d.x) })
        .attr('y', function(d) { return -y(d.y0) - y(d.y) })
        .attr('height', function(d) { return y(d.y) })
        .attr('width', w);


    }
    svg.select(".legend_"+chart).call(legend);
  }
}


function stackData(data) {
  var stacked = {};
  for (var cat in responses) {
    if (responses.hasOwnProperty(cat)) {
      var f = [];
      var y0 = 0;
      for (var i in responses[cat]) {
        var height = data[cat][responses[cat][i]];
        if (height == null){
          height = 0;
        }
        g = {
          'category': responses[cat][i],
          'x': 0,
          'y': height,
          'y0': y0
        };
        y0 += g.y;
        f.push(g);
      }
      stacked[cat] = f;
    }
  }

  return stacked
}



initialUpdate();