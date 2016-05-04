//$SCRIPT_ROOT = {{ request.script_root|tojson|safe }};
var width = 1000,
  height = 1000,
  radius = Math.min(width, height) / 2 - 30;

var r = d3.scale.linear()
  .domain([0, 100])
  .range([radius, radius*.07]);

var line = d3.svg.line.radial()
  .radius(function(d) {
    return r(d[1]);
  })
  .angle(function(d) {
    return -d[0] + Math.PI / 2;
  });

var svg = d3.select("#scatter_plot").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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

function update(num){
  //d3.json($SCRIPT_ROOT + '/_add_numbers?num='+num, function(error, data) {
  d3.json("" + '/_add_numbers?num='+num, function(error, data) {
    updateWithData(data.data);
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
        var coors = line([[i, d]]).slice(1).slice(0, -1);
        return "translate(" + coors + ")"
      })


   circles.transition()
    .duration(1500)
    .attr("transform", function(d, i) {
      var coors = line([[i, d]]).slice(1).slice(0, -1);
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

update(500);

        $(function() {
    $( "#slider" ).slider({
      orientation: "vertical",
      min: 100,
      max: 5000,
      value: 500,
      change: function( event, ui ){
        update(ui.value);
      }
    });
  });

