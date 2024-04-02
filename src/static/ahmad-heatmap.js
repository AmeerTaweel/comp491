var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 1200 - margin.left - margin.right,
  height = 1200 - margin.top - margin.bottom;

// for tooltips to apear on heatmap squares
var tooltip = d3.select("#heatmap_canvas")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

function draw_heatmap(graph) {

    // append the svg object to the body of the page
    var svg = d3.select("#heatmap_canvas")
        .append("div")
        .attr("class", "chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // Build X scales and axis:
    var nodes = []

    for (var i = 0; i <  graph.nodes.length; i++){
        nodes.push(graph.nodes[i].label)

    }
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(nodes)
      .padding(0.01)

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(nodes)
        .padding(0.01)
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("position", "fixed")
        .attr("dx", 25)
        .attr("dy", -5)
        .attr("transform", "rotate(-65)")

    // Build color scale
    var myColor = d3.scaleLinear()
      .range(["white", "#8000ff"])
      .domain([1, Math.max(...graph.links.map(o => o.coms))])

    svg.selectAll()
        .data(graph.links, function(d) {
            return d.source.label+':'+d.target.label;
        })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.source.label) })
        .attr("y", function(d) { return y(d.target.label) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.coms)} )
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
}
var mouseover = function(d) {
  tooltip.style("opacity", 1)
}
var mousemove = function(d) {
  tooltip
    .html("times data was transfered from " + d.source.label + " to " + d.target.label +": " + d.coms)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  tooltip.style("opacity", 0)
}
