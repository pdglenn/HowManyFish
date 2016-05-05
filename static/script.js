//$SCRIPT_ROOT = {{ request.script_root|tojson|safe }};
var circleWidth = $("#scatter_plot").width(),
  circleHeight = $("#scatter_plot").height();

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

var gr = svg.append("g")
  .attr("class", "r axis")
  .selectAll("g")
  .data(r.ticks(3))
  .enter().append("g");

gr.append("circle")
  .attr("r", r);

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
  console.log("updating");
  trueValues = {0: 0, 10: 1, 50: 10, 100: 250};
  importances = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  console.log(importances);
  //d3.json($SCRIPT_ROOT + '/_add_numbers?num='+num, function(error, data) {
  d3.json("" + '/_compatibility_calc?importances='+importances, function(error, data) {
    gData = data;
    circleUpdateWithData(data[0]);
    initialUpdateBars();
    barsUpdateWithData(data[1][0]);
  });
}

function circleUpdate(){
  console.log("updating");
  var trueValues = {1: 0, 2: 1, 3: 10, 4: 250};
  var importances = [];

  for (var i = 1; i < 11; i++){
    importances.push(trueValues[$("#slider"+i).slider("option", "value")])
  }
  console.log(importances);

  d3.json("" + '/_compatibility_calc?importances='+importances, function(error, data) {
    gData = data;
    circleUpdateWithData(data[0]);
    barsUpdateWithData(data[1][0]);
  });
}

function circleUpdateWithData(data){
  console.log('updating circles');
  //console.log(data);
  var circles = svg.selectAll("circle.point").data(data);
  console.log(data.length);

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
var legend_h = 150;

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
  'age': ['no response', 'over 45', '36 to 45',
    '26 to 35', '18 to 25'],
  'education': ['no response', 'adv. degree', 'bach. degree',
    'some college', 'high school'],
  'ethnicity': ['no response', 'other', '2+ ethnicities',
    'white', 'hispanic/latin', 'black', 'asian'],
  'height': ['no response', "over 6'", "5'6 to 5'11",
    "5' to 5'5", "under 5'"],
  'bodytype': ['no response', 'a little extra', 'ripped',
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

  svg_education = initCanvas('#education_chart');
  svg_education.call(tip);
  legend_education = initLegend(responses.education, z_blue);

  svg_ethnicity = initCanvas('#ethnicity_chart');
  svg_ethnicity.call(tip);
  legend_ethnicity = initLegend(responses.ethnicity, z_purple);

  svg_height = initCanvas('#height_chart');
  svg_height.call(tip);
  legend_height = initLegend(responses.height, z_pink);

  svg_bodytype = initCanvas('#bodytype_chart');
  svg_bodytype.call(tip);
  legend_bodytype = initLegend(responses.bodytype, z_red);
}

function barsUpdateWithData(data){
  var stacked = stackData(data);

  var age_rect = svg_age.selectAll('rect')
    .data(stacked.age)
    .enter()
    .append('rect')
    .attr('x', function(d) { return x(d.x) })
    .attr('y', function(d) { return -y(d.y0) - y(d.y) })
    .attr('height', function(d) { return y(d.y) })
    .attr('width', -x.rangeBand())
    .attr('class', 'valgroup')
    .style('fill', function(d, i){ return z_green(i) })
    .style('stroke', function(d, i) {
      return d3.rgb(z_green(i)).darker();
    });

}


function stackData(data, category) {
  var stacked = {};
  for (var cat in responses) {
    if (responses.hasOwnProperty(cat)) {
      var f = [];
      var y0 = 0;
      for (var i in responses[cat]) {
        console.log(data[cat]);
        console.log(responses[cat][i]);
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