var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>No of Sites </strong> <span style='color:red'>" + d.frequency + "</span>";
  })

var svg = d3.select("#progress-bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// The new data variable.
var data = [
  {letter: "10-20", frequency: 10},
  {letter: "B", frequency: 20},
  {letter: "C", frequency: 30},
  {letter: "D", frequency: 30},
  {letter: "E", frequency: 30},
  {letter: "F", frequency: 30},
  {letter: "G", frequency: 30},
  {letter: "H", frequency: 30},
  {letter: "I", frequency: 30},
  {letter: "J", frequency: 30},
  {letter: "K", frequency: 30},
  {letter: "L", frequency: 100},
  {letter: "M", frequency: .02517},
  {letter: "N", frequency: .06749},
  {letter: "O", frequency: .07507},
  {letter: "P", frequency: .01929},
  {letter: "Q", frequency: .00098},
  {letter: "R", frequency: .05987},
  {letter: "S", frequency: .06333},
  {letter: "T", frequency: .09056},
  {letter: "U", frequency: .02758},
  {letter: "V", frequency: .01037},
  {letter: "W", frequency: .02465},
  {letter: "X", frequency: .00150},
  {letter: "Y", frequency: .01971},
  {letter: "Z", frequency: .00074}
];

// The following code was contained in the callback function.
x.domain(data.map(function(d) { return d.letter; }));
y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("text-anchor", "end")
    .attr("y", 30)
    .attr("x", 920)
    .text("Progress");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr("dx", ".71em")
    .style("text-anchor", "end")
    .text("No Of Sites");

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.frequency); })
    .attr("height", function(d) { return height - y(d.frequency); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

function type(d) {
  d.frequency = +d.frequency;
  return d;
}

