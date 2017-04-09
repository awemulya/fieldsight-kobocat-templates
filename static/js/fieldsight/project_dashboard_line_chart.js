var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
};
var width = 600 - margin.left - margin.right;
var height = 270 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

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
var data = [{
    date: "1-May-12",
    close: "58.13"
}, {
    date: "30-Apr-12",
    close: "53.98"
}, {
    date: "27-Apr-12",
    close: "67.00"
}, {
    date: "26-Apr-12",
    close: "89.70"
}, {
    date: "25-Apr-12",
    close: "99.00"
}];

data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
});

// Scale the range of the data
x.domain(d3.extent(data, function (d) {
    return d.date;
    }));
y.domain([0, d3.max(data, function (d) {
    return d.close;
    })]);

svg.append("path") // Add the valueline path.
.attr("d", valueline(data));

svg.append("g") // Add the X Axis
.attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g") // Add the Y Axis
.attr("class", "y axis")
    .call(yAxis);