<script lang="ts">
	// Cosntants
	const WIDTH  = 600;
	const HEIGHT = 450;

	export let data;
	export let bytes = false;

	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let type   = ( ) => bytes ? "Bytes" : "Data Transfers";
	let weight = (l) => bytes ? l.bytes : l.transfers;

	let min_weight = Math.min(...Object.keys(data).map(k => data[k]).flat().map(weight));
	let max_weight = Math.max(...Object.keys(data).map(k => data[k]).flat().map(weight));

	let color = d3.scaleSequential().interpolator(d3.interpolateInferno)
		.domain([0, max_weight])

	let rects = undefined

	onMount(() => {
		// set the dimensions and margins of the graph
		const margin = {top: 30, right: 40, bottom: 30, left: 100}
		const width  = WIDTH - margin.left - margin.right;
		const height = HEIGHT - margin.top - margin.bottom;

		const svg = d3.select("#heatmap1d-view")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Labels of row and columns
		const n_domain = Object.keys(data)
		const m_domain = Array.from(Array(Math.max(...Object.keys(data).map(k => data[k].length))).keys()).map(i => `${i}`)

		// Build X scales and axis:
		const x = d3.scaleBand()
			.range([0, width])
			.domain(m_domain)
			.padding(0.01);
		
		let ticks = []
		for (let i = 0; i < m_domain.length; i += Math.floor(m_domain.length / 10)) {
			ticks.push(m_domain[i])
		}
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickValues(ticks))

		// Build Y scales and axis:
		const y = d3.scaleBand()
			.range([height, 0])
			.domain(n_domain)
			.padding(0.01);

		svg.append("g")
			.call(d3.axisLeft(y))
			.selectAll(".tick text")
			.attr("x", "-25");

		// Create a tooltip
		const tooltip = d3.select("#heatmap1d-tooltip")
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

		let processed = Object.keys(data).map(k => {
			let len = data[k].length
			return Array.from(Array(len).keys()).map(i => ({
				k, i, ...data[k][i]
			}))
		}).flat()

		rects = svg.selectAll()
			.data(processed)
			.enter()
			.append("rect")
			.attr("x", (d) => x(`${d.i}`))
			.attr("y", (d) => y(d.k) + 7)
			.attr("width",  x.bandwidth())
			.attr("height", y.bandwidth() - 14)
			.style("fill", (d) => color(weight(d)))
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
	})

	$: if (rects != undefined) {
		type   = ( ) => bytes ? "Bytes" : "Data Transfers";
		weight = (l) => bytes ? l.bytes : l.transfers;

		min_weight = Math.min(...Object.keys(data).map(k => data[k]).flat().map(weight));
		max_weight = Math.max(...Object.keys(data).map(k => data[k]).flat().map(weight));

		color = d3.scaleSequential().interpolator(d3.interpolateInferno)
			.domain([0, max_weight])
		rects.style("fill", (d) => color(weight(d)))
	}
</script>

<div class="overflow-hidden flex justify-center items-center">
	<div class="relative">
		<svg id="heatmap1d-view" preserveAspectRatio="xMidYMid meet">
		</svg>
		<div id="heatmap1d-tooltip"></div>
	</div>
</div>
