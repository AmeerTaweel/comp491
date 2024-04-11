<!DOCTYPE html>
<html>
<head>

    <title>Object View</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/static/ahmad-style.css">

    <script src="https://d3js.org/d3.v4.min.js"></script>

</head>

<body>
    <div>
        <text>
            Communication units
        </text>
    </div>
    <div>
        <input type="radio" name="units" id="r1" value="dt" checked>
        <label for="r1">Data transfers</label>
        
        <input type="radio" name="units" id="r2" value="bytes">
        <label for="r2">Bytes</label>
    </div>
    <div class="row no-gutters leftside" id="leftside1">
        <script>
            % import json
            % import numpy as np

            let comms = {{json.dumps(comms.tolist())}}
            let rows = {{np.shape(comms)[0]}}
            let cols = {{np.shape(comms)[1]}}

            let graph = {nodes: [], links: []}
            let used = []
            for (let row = 0; row < rows; row++) {
                graph.nodes.push({id: row, label: `gpu${row}`})
                for (let col = 0; col < cols; col++) {
                    if (col == row) continue;
                    graph.links.push({source: row, target: col, coms: comms[row][col]})
                }
            }

        </script>

        <div class="col no-gutters" id ="canvas1">
            <script type = "text/javascript" src = "/static/ahmad-draw.js"></script>
            
            <script>
                draw_g(graph);
            </script>

        </div>

        <div class="col no-gutters rightside">

            <div id="heatmap_canvas">
                <script type = "text/javascript" src = "/static/ahmad-heatmap.js"></script>
            </div>
            <script>
                draw_heatmap(graph);
            </script>

        </div>

    </div>

</body>
</html>
