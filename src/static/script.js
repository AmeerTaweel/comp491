// Increment Button Helper (GPU Menu)
function previousOption() {
    var dropdown = document.getElementById("gpu_dropdown");
    var currentIndex = dropdown.selectedIndex;
    var lastIndex = dropdown.options.length - 1;
    if (currentIndex === 0) {
        dropdown.selectedIndex = lastIndex;
    } else {
        dropdown.selectedIndex = currentIndex - 1;
    }
}

// Decrement Button Helper (GPU Menu)
function nextOption() {
    var dropdown = document.getElementById("gpu_dropdown");
    var currentIndex = dropdown.selectedIndex;
    var lastIndex = dropdown.options.length - 1;
    if (currentIndex === lastIndex) {
        dropdown.selectedIndex = 0;
    } else {
        dropdown.selectedIndex = currentIndex + 1;
    }
}

// Update the GPU label
function updateGPU() {
    var dropdown = document.getElementById("gpu_dropdown");
    var gpuNumber = dropdown.options[dropdown.selectedIndex].text;
    document.getElementById("gpu_heading").innerText = "Objects owned by " + gpuNumber;
}

// Update the object label
function updateObjectLabel() {
	var selectedObject = document.getElementById("object_select").value;
	document.getElementById("object_label").innerText = "You selected: " + selectedObject;
}

// Update the dimension labels
function updateDimensionLabels() {
	var xDimension = document.getElementById("dimension_select").value;
	document.getElementById("x_dimension_label").innerText = "X-dimension is " + xDimension;
	document.getElementById("y_dimension_label").innerText = "Y-dimension is " + xDimension;
}

document.addEventListener("DOMContentLoaded", function() {
        updateGPU();
});

function draw2DHeatmap() {
	var xDimension = document.getElementById("dimension_select").value;

	// set the dimensions and margins of the graph
	var margin = { top: 30, right: 30, bottom: 30, left: 30 },
		width = 850 - margin.left - margin.right,
		height = 850 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#my_dataviz")
		.html("") // Clear previous content
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Labels of row and columns
	var no_dimension = parseInt(xDimension);
	var myVars = [];
	for (var i = 0; i < no_dimension; i++) {
		myVars.push("v" + (i + 1));
	}

	var myGroups = [];
	for (i = 65; i < 65 + no_dimension; i++) {
		myGroups.push(String.fromCharCode(i));
	}

	// Build X scales and axis:
	var x = d3.scaleBand()
		.range([0, width])
		.domain(myGroups)
		.padding(0.01);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))

	// Build Y scales and axis:
	var y = d3.scaleBand()
		.range([height, 0])
		.domain(myVars)
		.padding(0.01);
	svg.append("g")
		.call(d3.axisLeft(y));

	// Build color scale
	var myColor = d3.scaleLinear()
		.range(["white", "#69b3a2"])
		.domain([1, 100])

	//Read the data
	d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function (data) {

		svg.selectAll()
			.data(data, function (d) { return d.group + ':' + d.variable; })
			.enter()
			.append("rect")
			.attr("x", function (d) { return x(d.group) })
			.attr("y", function (d) { return y(d.variable) })
			.attr("width", x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", function (d) { return myColor(d.value) })
	})
}
