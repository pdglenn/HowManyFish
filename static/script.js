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


var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on("drag", dragmove)
  .on("dragend", dragend);

var gr = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data(r.ticks(1))
  .enter().append("g");

gr.append("circle")
  .attr("r", r)
  .attr("stroke-width", 2)

var dr = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data([r(.5)])
  .enter().append("g");

dr.append("circle")
  .attr('id', 'threshold')
  .attr("r", r(.5))
  .attr("stroke-width", 5)
  .call(drag);

// http://bl.ocks.org/mbostock/1557377
// http://stackoverflow.com/questions/18571563/d3s-mouse-coordinates-relative-to-parent-element
function dragmove(d){
  m = d3.mouse(d3.select('#scatter_plot').node());
  var radius = Math.min(r(0), Math.max(Math.sqrt(Math.pow(cX - m[0], 2) + Math.pow(cY - m[1], 2)), r(1)));

  d3.select(this)
    .attr("r", radius);
  console.log(radius);
  //console.log(r.invert($('#threshold').attr("r")));
}

function dragend(d){
  circleUpdate();
}

var color = d3.scale.category20();

function tooltipText(d){
  return "Username: " + d.username + "<br/>" + 
         "Ethnicity: " + d.ethnicity_norm + "<br/>" + 
         "Body type: " + d.body_type_norm + "<br/>" +
         "Height: " + d.height_norm + "<br/>" + 
         "Age: " + d.age_norm + "<br/>" + 
         "Education: " + d.education_norm
}
var gData;

function initialUpdate(){
  console.log("initial updating");
  trueValues = {0: 0, 10: 1, 50: 10, 100: 250};
  importances = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  //d3.json($SCRIPT_ROOT + '/_add_numbers?num='+num, function(error, data) {
  d3.json("" + '/_compatibility_calc?importances='+importances, function(error, data) {
    gData = data;
    circleUpdateWithData(data[0]);
    initialUpdateBars();
    barsUpdateWithData(data[1][0]);
    console.log('initial update done')
  });
}

function circleUpdate(){
  console.log("circles updating");
  var trueValues = {1: 0, 2: 1, 3: 10, 4: 250};
  var importances = [];

  for (var i = 1; i < 11; i++){
    importances.push(trueValues[$("#slider"+i).slider("option", "value")])
  }
  console.log(importances);
  var compatibility = r.invert($('#threshold').attr("r"));

  d3.json("" + '/_compatibility_calc?compatibility='+compatibility+'&importances='+importances, function(error, data) {
    gData = data;
    circleUpdateWithData(data[0]);
    console.log('circles update done')
    barsUpdateWithData(data[1][0]);
    console.log('bars update done')

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
    .attr("r", 2) 
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

}

$(function() {
  for (var i = 1; i<11; i++){
    $( "#slider"+i ).slider({
      min: 1,
      max: 4,
      value: 2,
      step: 1,
      change: function( event, ui ){
        circleUpdate();
      }
    });
  }
});




//----------------------------
// var w = $("#bars_container").width() / 5,
//   h = $("#bars_container").height();
var w = 160,
h = 500;
var legend_h = 250;

var barContainer = d3.select('#bars_container');
var tip;
var svg_age, svg_education, svg_ethnicity, svg_height, svg_bodytype;
var legend_age, legend_education, legend_ethnicity, 
  legend_height, legend_bodytype;
var barOuterPad = 0, barPad = .5;

var x = d3.scale.ordinal().rangeRoundBands([0, w-50], barPad, barOuterPad);
var y = d3.scale.linear().range([0, h-75]);

var z_green = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#20BF55"]);

var z_blue = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#246EB9"]);

var z_purple = d3.scale.linear()
  .domain([0, 6])
  .range(["#ECEBE4", "#D30C7B"]);

var z_pink = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#0A3C78"]);

var z_red = d3.scale.linear()
  .domain([0, 4])
  .range(["#ECEBE4", "#1B998B"]);

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
      console.log(id);
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
    .attr("x", 50)
    .attr("y", -440)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", color)
    .text(text);
}
function initialUpdateBars(){
  tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([40, 85])
    .html(function(d, i) {
        return d.category + ": <span style='color:white'>" + Math.round(d.y*100).toFixed(0) + "%";
    });

  svg_age = initCanvas('#age_chart');
  svg_age.call(tip);
  legend_age = initLegend(responses.age, z_green);
  appendText(svg_age, "Age", "#20BF55");
  svg_age.append("g")
    .attr("class", "legend_age")
    .attr("transform", "translate(0, 10)");

  svg_education = initCanvas('#education_chart');
  svg_education.call(tip);
  legend_education = initLegend(responses.education, z_blue);
  appendText(svg_education, "Education", "#246EB9");
  svg_education.append("g")
    .attr("class", "legend_education")
    .attr("transform", "translate(0, 10)");

  svg_ethnicity = initCanvas('#ethnicity_chart');
  svg_ethnicity.call(tip);
  legend_ethnicity = initLegend(responses.ethnicity, z_purple);
  appendText(svg_ethnicity, "Ethnicity", "#D30C7B");
  svg_ethnicity.append("g")
    .attr("class", "legend_ethnicity")
    .attr("transform", "translate(0, 10)");

  svg_height = initCanvas('#height_chart');
  svg_height.call(tip);
  legend_height = initLegend(responses.height, z_pink);
  appendText(svg_height, "Height", "#0A3C78");
  svg_height.append("g")
    .attr("class", "legend_height")
    .attr("transform", "translate(0, 10)");

  svg_bodytype = initCanvas('#bodytype_chart');
  svg_bodytype.call(tip);
  legend_bodytype = initLegend(responses.bodytype, z_red);
  appendText(svg_bodytype, "Body Type", "#1B998B");
  svg_bodytype.append("g")
    .attr("class", "legend_bodytype")
    .attr("transform", "translate(0, 10)");
}
var gStack;
function barsUpdateWithData(data){
  var stacked = stackData(data);
  gStack = stacked;
  var chartList = {'age': [svg_age, legend_age, z_green],
    'education': [svg_education, legend_education, z_blue],
    'ethnicity': [svg_ethnicity, legend_ethnicity, z_purple],
    'height': [svg_height, legend_height, z_pink],
    'bodytype': [svg_bodytype, legend_bodytype, z_red]};

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
    console.log(".legend_"+chart);
    svg.select(".legend_"+chart).call(legend);
  }


  // var age_rect = svg_age.selectAll('rect')
  //   .data(stacked.age)
  //   .enter()
  //   .append('rect')
  //   .attr('x', function(d) { return x(d.x) })
  //   .attr('y', function(d) { return -y(d.y0) - y(d.y) })
  //   .attr('height', function(d) { return y(d.y) })
  //   .attr('width', -x.rangeBand())
  //   .attr('class', 'valgroup')
  //   .style('fill', function(d, i){ return z_green(i) })
  //   .style('stroke', function(d, i) {
  //     return d3.rgb(z_green(i)).darker();
  //   });

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