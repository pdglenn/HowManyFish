var barContainer = d3.select('#bars_container');
// var containers = ['age_chart', 'education_chart', 'ethnicity_chart', 'height_chart', 'bodytype_chart']

// for (var i=0; i < containers.length; i++){
//   barContainer.append("div")
//     .attr("class", "container")
//     .attr("id", containers[i])
//     .attr("width", 160)
//     .attr("height", 650)
//     .attr("style", "float:left;");
// }

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([40, 85])
  .html(function(d, i) {
    return d.category + ": <span style='color:white'>" + Math.round(d.y*100).toFixed(0) + "%";
  });

// var w = 160,
// h = 500,
legend_h = 150;

var w = $("#bars_container").width() / 5,
  h = $("#bars_container").height();

// create canvas
var svg_age = d3.select("#age_chart").append("svg:svg")
  .attr("class", "chart")
  .attr("width", w)
  .attr("height", h+legend_h)
  .append("svg:g")
  //.attr("transform", "translate(10,470)")
  .on("click", function() {
    var brushing = 'age';
    console.log(brushing);
  });

svg_age.call(tip);

var svg_education = d3.select("#education_chart").append("svg:svg")
  .attr("class", "chart")
  .attr("width", w)
  .attr("height", h+legend_h)
  .append("svg:g")
  .attr("transform", "translate(10,470)")
  .on("click", function() {
    var brushing = 'education';
    console.log(brushing);
  });

svg_education.call(tip);

var svg_ethnicity = d3.select("#ethnicity_chart").append("svg:svg")
  .attr("class", "chart")
  .attr("width", w)
  .attr("height", h+legend_h)
  .append("svg:g")
  .attr("transform", "translate(10,470)")
  .on("click", function() {
    var brushing = 'ethnicity';
    console.log(brushing);
  });

svg_ethnicity.call(tip);

var svg_height = d3.select("#height_chart").append("svg:svg")
  .attr("class", "chart")
  .attr("width", w)
  .attr("height", h+legend_h)
  .append("svg:g")
  .attr("transform", "translate(10,470)")
  .on("click", function() {
    var brushing = 'height';
    console.log(brushing);
  });

svg_height.call(tip);

var svg_bodytype = d3.select("#bodytype_chart").append("svg:svg")
  .attr("class", "chart")
  .attr("width", w)
  .attr("height", h+legend_h)
  .append("svg:g")
  .attr("transform", "translate(10,470)")
  .on("click", function() {
    var brushing = 'bodytype';
    console.log(brushing);
  });

svg_bodytype.call(tip);

barOuterPad = 0;
barPad = .5;

x = d3.scale.ordinal().rangeRoundBands([0, w-50], barPad, barOuterPad);
y = d3.scale.linear().range([0, h-75]);
// z = d3.scale.ordinal().range(["#0A3C78", "#2660A4", "#246EB9", "#20BF55", "#ECEBE4"])

z_green = d3.scale.linear().domain([0, 4]).range(["#ECEBE4", "#20BF55"]);
z_blue = d3.scale.linear().domain([0, 4]).range(["#ECEBE4", "#246EB9"]);
z_purple = d3.scale.linear().domain([0, 6]).range(["#ECEBE4", "#D30C7B"]);
z_pink = d3.scale.linear().domain([0, 4]).range(["#ECEBE4", "#0A3C78"]);
z_red = d3.scale.linear().domain([0, 4]).range(["#ECEBE4", "#1B998B"]);

var legend_age = d3.legend.color()
// .classPrefix("legend_age")
  .shapeWidth(15)
  .shapeHeight(15)
  .shapePadding(10)
  .orient('vertical')
  .labels(['no response', 'over 45', '36 to 45', '26 to 35', '18 to 25'])
  .scale(z_green)
  .ascending(true);
  // .title('Age');

var legend_education = d3.legend.color()
  .shapeWidth(15)
  .shapeHeight(15)
  .shapePadding(10)
  .orient('vertical')
  .labels(['no response', 'adv. degree', 'bach. degree', 
           'some college', 'high school'])
  .scale(z_blue)
  .ascending(true);

var legend_ethnicity = d3.legend.color()
  .shapeWidth(15)
  .shapeHeight(15)
  .shapePadding(10)
  .orient('vertical')
  .labels(['no response', 'other', '2+ ethnicities', 
           'white', 'hispanic/latin', 'black', 'asian'])
  .scale(z_purple)
  .cells(7)
  .ascending(true);

var legend_height = d3.legend.color()
  .shapeWidth(15)
  .shapeHeight(15)
  .shapePadding(10)
  .orient('vertical')
  .labels(['no response', "over 6'", "5'6 to 5'11", 
           "5' to 5'5", "under 5'"])
  .scale(z_pink)
  .ascending(true);
  // For some reason all 7 categories aren't showing up in the legend...

var legend_bodytype = d3.legend.color()
  .shapeWidth(15)
  .shapeHeight(15)
  .shapePadding(10)
  .orient('vertical')
  .labels(['no response', 'a little extra', 'ripped', 
           'average', 'thin'])
  .scale(z_red)
  .ascending(true);

console.log("RAW JSON----------------------------");

var globaldata;
var matrix_age;
var remapped;
var stacked;
var valgroup;
var rect;

function get_aggregate_data(svg_name, create_matrix_function, z_color, remap_funct){
  d3.json("/static/profile_stats.json", function(error, data) {
    if (error) return console.warn(error);
    globaldata = data;
    z = z_color;
    matrix = create_matrix_function();
    svg = svg_name;

    remap_funct(matrix);
    layout(stacked);
    add_group_for_col(valgroup);
    add_rect_for_group(rect);
  });
}
function create_matrix_age() {
  return [[Object.keys(globaldata)[0], {'no response':globaldata.age['not answered']}, 
        {'over 45':globaldata.age['over 45']}, {'36 to 45':globaldata.age['36 to 45']}, 
        {'26 to 35':globaldata.age['26 to 35']}, {'18 to 25':globaldata.age['18 to 25']}] 
         ];
}
function create_matrix_education() {
  return [[Object.keys(globaldata)[1], {'no response':globaldata.education['not answered']}, 
           {'adv. degree':globaldata.education['advanced degree']}, 
           {'bach. degree':globaldata.education['bachelors degree']}, 
           {'some college':globaldata.education['some college']}, 
           {'high school':globaldata.education['high school']}] 
          ];
}
function create_matrix_ethnicity() {
  return [[Object.keys(globaldata)[2], 
          {'no response':globaldata.ethnicity['not answered']}, 
          {'other':globaldata.ethnicity['other']}, 
          {'2+ ethnicities':globaldata.ethnicity['Indicated 2 or more ethnicities']}, 
          {'white':globaldata.ethnicity['white']}, {'hispanic/latin':globaldata.ethnicity['hispanic / latin']}, 
          {'black':globaldata.ethnicity['black']}, {'asian':globaldata.ethnicity['asian']}] 
         ];
}
function create_matrix_height() {
  return [[Object.keys(globaldata)[3], 
          {'no response':globaldata.height['not answered']},
          {"over 6'":globaldata.height["over 6'"]}, 
          {"5'6 to 5'11":globaldata.height["5'6 to 5'11"]}, 
          {"5' to 5'5":globaldata.height["5' to 5'5"]}, 
          {"under 5'":globaldata.height["under 5'"]}]
         ];
}
function create_matrix_bodytype() {
  return [[Object.keys(globaldata)[4], 
          {'no response':globaldata.bodytype['not answered']}, 
          {'a little extra':globaldata.bodytype['a little extra']}, 
          {'ripped':globaldata.bodytype['ripped']}, 
          {'average':globaldata.bodytype['average']}, 
          {'thin':globaldata.bodytype['thin']}] 
        ];
}
function remap() {
  console.log("REMAP---------------------------");
  remapped =["c1","c2","c3", "c4", "c5"].map(function(dat,i){
    return matrix.map(function(d,ii){
      return {x: ii, y: d3.values(d[i+1])[0], 
              category: Object.keys(matrix[0][i+1])[0]};
      })
    });
  // console.log(remapped)
}
function remap_ethnicity() {
  console.log("REMAP---------------------------");
  remapped =["c1","c2","c3", "c4", "c5", "c6", "c7"].map(function(dat,i){
    return matrix.map(function(d,ii){
      return {x: ii, y: d3.values(d[i+1])[0], 
              category: Object.keys(matrix[0][i+1])[0]};
      })
    });
  console.log(remapped)
}
function layout() {
  console.log("LAYOUT---------------------------");
  stacked = d3.layout.stack()(remapped);

  x.domain(stacked[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y; })]);

  // show the domains of the scales              
  console.log("x.domain(): " + x.domain());
  console.log("y.domain(): " + y.domain());
  console.log("------------------------------------------------------------------");
}
function add_group_for_col(){
  // Add a group for each column.
  valgroup = svg.selectAll("g.valgroup")
                .data(stacked)
                .enter().append("svg:g")
                .attr("class", "valgroup")
                .style("fill", function(d, i) {return z(i)})
                .style("stroke", function(d, i) { 
                  return d3.rgb(z(i)).darker(); 
                });
          // might want to add an .on("click", function()) {} to the variable: http://www.d3noob.org/2014/07/d3js-multi-line-graph-with-automatic.html
}
function add_rect_for_group() {
  // Add a rect for each date.
  rect = valgroup.selectAll("rect")
                .data(function(d){return d;})
                .enter().append("svg:rect")
                .attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return -y(d.y0) - y(d.y); })
                .attr("height", function(d) { return y(d.y); })
                .attr("width", x.rangeBand())
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide)
}
get_aggregate_data(svg_age, create_matrix_age, z_green, remap);
get_aggregate_data(svg_education, create_matrix_education, z_blue, remap);
get_aggregate_data(svg_ethnicity, create_matrix_ethnicity, z_purple, remap_ethnicity);
get_aggregate_data(svg_height, create_matrix_height, z_pink, remap);
get_aggregate_data(svg_bodytype, create_matrix_bodytype, z_red, remap);

//Append age legend
svg_age.append("g")
  .attr("class", "legend_age")
  .attr("transform", "translate(0, 10)");

svg_age.append("text")
  .attr("x", 50)        
  .attr("y", -440)
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .style("font-weight", "bold") 
  .style("fill", "#20BF55")
  .text("Age");
  

svg_age.select(".legend_age")
  .call(legend_age);


//Append education legend
svg_education.append("g")
  .attr("class", "legend_education")
  .attr("transform", "translate(0, 10)");

svg_education.append("text")
  .attr("x", 55)        
  .attr("y", -440)
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .style("font-weight", "bold") 
  .style("fill", "#246EB9")
  .text("Education");
  

svg_education.select(".legend_education")
  .call(legend_education);

//Append ethnicity legend
svg_ethnicity.append("g")
  .attr("class", "legend_ethnicity")
  .attr("transform", "translate(0, 10)");

svg_ethnicity.append("text")
  .attr("x", 50)        
  .attr("y", -440)
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .style("font-weight", "bold") 
  .style("fill", "#D30C7B")
  .text("Ethnicity");
  

svg_ethnicity.select(".legend_ethnicity")
  .call(legend_ethnicity);

//Append height legend
svg_height.append("g")
  .attr("class", "legend_height")
  .attr("transform", "translate(0, 10)");

svg_height.append("text")
  .attr("x", 50)        
  .attr("y", -440)
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .style("font-weight", "bold") 
  .style("fill", "#0A3C78")
  .text("Height");
  

svg_height.select(".legend_height")
  .call(legend_height);

//Append bodytype legend
svg_bodytype.append("g")
  .attr("class", "legend_bodytype")
  .attr("transform", "translate(0, 10)");

svg_bodytype.append("text")
  .attr("x", 50)        
  .attr("y", -440)
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .style("font-weight", "bold") 
  .style("fill", "#1B998B")
  .text("Bodytype");
  

svg_bodytype.select(".legend_bodytype")
  .call(legend_bodytype);
