function draw_communication_graph(communications) {   
    
    var graph = {nodes: [], links: []}
    var used = []
    for (let i = 0; i < communications.length; i++) {
        var data = communications[i].split(":")
        if(!used.includes(data[0])){
            graph.nodes.push({"label": "gpu"+ data[0]})
            used.push(data[0])
        }
        graph.links.push({source: parseInt(data[0]), target: parseInt(data[1]), coms: parseInt(data[2])})
    }
    console.log(graph)

    var canvas = null
    // var width = document.getElementById("leftside1").getBoundingClientRect().width, height = document.getElementById("leftside1").getBoundingClientRect().height;
    var width = 1200, height = 1200;
    
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
        force.force("link").links(graph.links).distance(500);
        
        var detachedContainer = document.createElement("custom");
            dataContainer = d3.select(detachedContainer);
        
        link = dataContainer.selectAll(".link").data(graph.links)
              .enter().append("line").attr("class", "link")
              .style("stroke-width", 2)
        
        node = dataContainer.selectAll(".node").data(graph.nodes)
              .enter().append("g");
        
          var circles = node.append("circle")
              .classed("circle-class", true)
              .attr("class", function (d){ return "node node_" + d.index;})
              .attr("r", 60)
              .attr("fill", 'orange')
              .attr("strokeStyle", 'black');
        
        d3.timer(function(){
            context.clearRect(0, 0, width, height);
        
            var data = d3.select(this).data();
            // draw links
            link.each(function(d) {
              context.strokeStyle = "#ccc";
              /***** Elliptical arcs *****/
              context.stroke(new Path2D(linkArc(d)));
              /***** Elliptical arcs *****/
                // context.fillText("hi")
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
                var data = d3.select(this).data();
                context.stroke();
                context.fill();
                context.font = "20px Arial";
                context.fillStyle = "black";
                context.strokeStyle = "black";
                context.fillText(data[0].label,d.x, d.y);
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
    // window.addEventListener("resize", draw_graph)
}
