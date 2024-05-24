<script lang="ts">
	export let data;
	export let N;
	export let M;
	export let bytes = false;
	export let prefix = "GPU";
	export let reverse_y = false;

	const WIDTH  = 500;
	const HEIGHT = Math.min(Math.max(WIDTH / (M / N), 400), 600);

	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let type   = ( ) => bytes ? "Bytes" : "Data Transfers";
	let weight = (l) => bytes ? l.bytes : l.transfers;

	let min_weight = Math.min(...data.map(weight));
	let max_weight = Math.max(...data.map(weight));

	let color = d3.scaleSequential().interpolator(d3.interpolateInferno)
		.domain([0, max_weight])

	let rects = undefined

	onMount(() => {
		// set the dimensions and margins of the graph
		const margin = {top: 30, right: 40, bottom: 30, left: 40}
		const width  = WIDTH - margin.left - margin.right;
		const height = HEIGHT - margin.top - margin.bottom;

		const svg = d3.select("#heatmap-view")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Labels of row and columns
		const n_domain = Array.from(Array(N).keys()).map(i => `${prefix}${i}`)
		const m_domain = Array.from(Array(M).keys()).map(i => `${prefix}${i}`)

		// Build X scales and axis:
		const x = d3.scaleBand()
			.range([0, width])
			.domain(m_domain)
			.padding(0.01);
		
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))

		// Build Y scales and axis:
		const y = d3.scaleBand()
			.range(reverse_y ? [0, height]: [height, 0])
			.domain(n_domain)
			.padding(0.01);

		svg.append("g")
			.call(d3.axisLeft(y))
			.selectAll(".tick text")
			.attr("x", "-25");

		// Create a tooltip
		const tooltip = d3.select("#heatmap-tooltip")
			.style("opacity", 0)
			.attr("class", "tooltip absolute bg-primary-600 border rounded-lg p-3")

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function(d) {
			tooltip.style("opacity", 1)
		}
		const mousemove = function(event, d) {
			tooltip.html(`${bytes ? "Bytes Transferred" : "Data Transfers"}: ${weight(d)}`)
				.style("left", (d3.pointer(event)[0] - 75) + "px")
				.style("top",  (d3.pointer(event)[1] - 75) + "px")
		}
		const mouseleave = function(d) {
			tooltip.style("opacity", 0)
		}

		rects = svg.selectAll()
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d) => x(`${prefix}${d.col}`))
			.attr("y", (d) => y(`${prefix}${d.row}`))
			.attr("width",  x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", (d) => color(weight(d)))
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
	})

	$: if (rects != undefined) {
		type   = ( ) => bytes ? "Bytes" : "Data Transfers";
		weight = (l) => bytes ? l.bytes : l.transfers;

		min_weight = Math.min(...data.map(weight));
		max_weight = Math.max(...data.map(weight));

		color = d3.scaleSequential().interpolator(d3.interpolateInferno)
			.domain([0, max_weight])
		rects.style("fill", (d) => color(weight(d)))
	}
</script>

<div class="overflow-hidden flex justify-center items-center">
	<div class="relative">
		<svg id="heatmap-view" preserveAspectRatio="xMidYMid meet">
		</svg>
		<div id="heatmap-tooltip"></div>
	</div>
</div>
