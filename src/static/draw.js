    
// document.write("init")
var graph = randomgraph.WattsStrogatz.beta(15, 4, 0.06);

// graph.nodes = [{"label":"x"}, {"label":"y"}, {"label":"z"}, {"label":"i"}];
// , {"label":"j"}];
// graph.edges = [ {source:0,target:1}, {source:0, target:3},
//                 {source:1,target:0}, {source:1, target:2},
//                 {source:2,target:1}, {source:2, target:3},
//                 {source:3,target:2}, {source:3, target:0},
//                 // {source:4,target:3},{source:4,target:0},
//                 // {source:5,target:4},{source:5,target:0}
// ]
var num_of_edges = 3;
graph.nodes = []
graph.edges = []

// console.log((-1)%num_of_edges)
for( let i = 0; i < num_of_edges; i++ )
{
    graph.nodes.push({"label" : "gpu" + i})
    graph.edges.push({source : i, target : (i + 1)%(num_of_edges )})
    graph.edges.push({source : i, target : i - 1 < 0 ? num_of_edges - 1: i - 1})
}

console.log(graph.edges)
var canvas = null
// var width = document.getElementById("leftside1").getBoundingClientRect().width, height = document.getElementById("leftside1").getBoundingClientRect().height;
var width = 800, height = 500;

// var width = window.innerWidth, height = window.innerHeight;

// console.log("width: " + width + "height: " + height)
canvas = d3.select("#canvas1").append("canvas").attr("width",width).attr("height",height);
 
function draw_graph() {
   
     
    // var width = document.getElementById("leftside1").getBoundingClientRect().width, height = document.getElementById("leftside1").getBoundingClientRect().height;
    // canvas.attr("width",width).attr("height",height)
    var context = canvas.node().getContext("2d");
    force = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { 
                 return d.index;
            })).force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));
    
    force.nodes(graph.nodes);
    force.force("link").links(graph.edges).distance(200);
    
    var detachedContainer = document.createElement("custom");
        dataContainer = d3.select(detachedContainer);
    
    link = dataContainer.selectAll(".link").data(graph.edges)
          .enter().append("line").attr("class", "link")
          .style("stroke-width", 2)
    
    node = dataContainer.selectAll(".node").data(graph.nodes)
          .enter().append("g");
    
      var circles = node.append("circle")
          .classed("circle-class", true)
          .attr("class", function (d){ return "node node_" + d.index;})
          .attr("r", 20)
          .attr("fill", 'red')
          .attr("strokeStyle", 'black');
    
    d3.timer(function(){
        context.clearRect(0, 0, width, height);
    
        // draw links
        link.each(function(d) {
          context.strokeStyle = "#ccc";
          /***** Elliptical arcs *****/
          context.stroke(new Path2D(linkArc(d)));
          /***** Elliptical arcs *****/
        });
    
        context.lineWidth = 2;
        node.each(function(d) {
    
          context.beginPath();
          context.moveTo(d.x, d.y);
          var r = d3.select(this).select("circle").node().getAttribute('r');   
    
          d.x = Math.max(30, Math.min(width - 30, d.x));
          d.y = Math.max(30, Math.min(height - 30, d.y));         
          context.closePath();
          context.arc(d.x, d.y, r, 0, 2 * Math.PI);
    
          context.fillStyle = d3.select(this).select("circle").node().getAttribute('fill');
          context.strokeStyle = d3.select(this).select("circle").node().getAttribute('strokeStyle');
          context.stroke();
          context.fill();
    
          context.beginPath();
          context.arc(d.x + 15, d.y-20, 5, 0, 2 * Math.PI);
          context.fillStyle = "orange";
          context.strokeStyle = "orange";
          var data = d3.select(this).data();
          context.stroke();
          context.fill();
          context.font = "10px Arial";
          context.fillStyle = "black";
          context.strokeStyle = "black";
          context.fillText(parseInt(data[0].index),d.x + 10, d.y-15);
        });
    
    });
    
    // circles.transition().duration(5000).attr('r', 20).attr('fill', 'orange');
    
    canvas.node().addEventListener('click',function( event ){
       console.log(event)
        // Its COMING ANY TIME INSIDE ON CLICK OF CANVAS
    });
    
    /***** Elliptical arcs *****/
    function linkArc(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }
}
draw_graph()
window.addEventListener("resize", draw_graph)
