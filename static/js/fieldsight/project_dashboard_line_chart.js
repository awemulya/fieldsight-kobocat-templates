var margin = {
    top: 30,
    right: 0,
    bottom: 30,
    left: 5
};
var width = 500 - margin.left - margin.right;
var height = 300;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(6);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline = d3.svg.line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.close);
    });

var svg = d3.select("#submission-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data

line_chart_data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
});

// Scale the range of the data
x.domain(d3.extent(line_chart_data, function (d) {
    return d.date;
    }));
y.domain([0, d3.max(line_chart_data, function (d) {
    return d.close;
    })]);

svg.append("path") // Add the valueline path.
.attr("d", valueline(line_chart_data));

svg.append("g") // Add the X Axis
.attr("class", "x axis")
    .attr("transform", "translate(15," + height + ")")
    .call(xAxis);

svg.append("g") // Add the Y Axis
.attr("class", "y axis")
    .call(yAxis);
