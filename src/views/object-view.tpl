<!DOCTYPE html>
<html>
<head>

    <title>Object View</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <link rel="stylesheet" type="text/css" href="/static/style.css">

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v4.js"></script>

</head>

<body>

    <!-- This is the whole screen -->
    <div class="row no-gutters">

        <!-- Left side of main screen (1D heatmap) -->
        <div class="col no-gutters">

            <!-- Dropdown Menu for GPU Selection -->
            <div class="gpu-dropdown-container">
                <button onclick="previousOption(), updateGPU()">&lt;&lt;</button>
                <select id="gpu_dropdown" onchange="updategpu()">
				% for gpu in gpus:
					<option value="{{gpu}}">GPU {{gpu}}</option>
				% end
                </select>
                <button onclick="nextOption(), updateGPU()">&gt;&gt;</button>
            </div>

            <hr />
            <h1 id="gpu_heading">Objects owned by GPU</h1>

            <!-- 1D Heatmap -->
            <div>
            </div>

            <p>Some text for the left side.</p>
        </div>


        <!-- Right side of the main screen (2D heatmap) -->
        <div class="col no-gutters">

            <!-- This is for the two menus you choose from -->
            <div class="row no-gutters">

                <!-- This is for the object select menu -->
                <div class="col no-gutters dropdown-container">
                    <label for="object_select" class="dropdown-label">Choose
                            an object to view in 2D</label>

                    <select id="object_select" onchange="updateObjectLabel()">
					% for obj_sel in object_selection:
						<option value="{{obj_sel}}">{{obj_sel}}</option>
					% end
                    </select>

                    <label id="object_label" class="dropdown-label">You selected: </label>
                </div>

                <!-- This is for the dimension select menu -->
                <div class="col no-gutters dropdown-container">
                    <label for="dimension_select" class="dropdown-label">X-dimension</label>

                    <select id="dimension_select"
                            onchange="updateDimensionLabels()
                            updateDimensionLabels()">
						% for dim_sel in dimension_selection:
							<option value="{{dim_sel}}">{{dim_sel}}</option>
						% end
                    </select>

                    <!-- This is for the two labels under the menu -->
                    <div class="row no-gutters">
                        <div class="col no-gutters">
                            <label id="x_dimension_label" class="dropdown-label">X-dimension is </label>
                        </div>

                        <div class="col no-gutters">
                            <label id="y_dimension_label" class="dropdown-label">Y-dimension is</label>
                        </div>
                    </div>
                </div>

                <!-- This is for the 2D show button -->
                <div class="col no-gutters dropdown-container">
                    <label for="dimension_select" class="dropdown-label">Fix
                            this</label>
                    <button id="myButton" onclick="draw2DHeatmap()">Show in 2D</button>
                </div>

            </div>

            <!-- 2D Heatmap -->
            <div id="my_dataviz"></div>

        </div>
    </div>

    <script src="/static/script.js"></script>

</body>
</html>

