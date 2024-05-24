<script lang="ts">
	// Cosntants
	const WIDTH = 100;
	const HEIGHT = 100;
	const RADIUS = 5;
	const MIN_WEIGHT = 0.1;
	const MAX_WEIGHT = 1;

	export let graph;
	export let bytes = false;

	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	function clamp(x, lo, hi) {
		return x < lo ? lo : x > hi ? hi : x;
	}

	const color = d3.scaleOrdinal(d3.schemeCategory10);

	let weight = (l) => bytes ? l.bytes : l.transfers;

	let max_weight = Math.max(...graph.links.map(weight));

	let link = undefined;
	let edge_labels = undefined;

	onMount(() => {
		const svg = d3.select('#graph-view').attr('viewBox', [0, 0, WIDTH, HEIGHT]);

		function zoomed(event) {
			svg.attr(
				'transform',
				'translate(' +
					event.transform.x +
					',' +
					event.transform.y +
					')' +
					' scale(' +
					event.transform.k +
					')'
			);
		}

		svg.call(d3.zoom().on('zoom', zoomed));

		link = svg
			.selectAll('.link')
			.data(graph.links)
			.join('path')
			.attr('id', (d) => `link-${d.source}-${d.target}`)
			.attr('fill', 'none')
			.attr('stroke', (d) => color(d.source))
			.attr('stroke-width', (d) => ((MAX_WEIGHT - MIN_WEIGHT) * (weight(d) / max_weight) + MIN_WEIGHT))
			.attr('marker-end', (d) => `url(#arrowhead-${d.source})`);

		// Edge labels
		edge_labels = svg.selectAll('.link-text')
			.data(graph.links)
			.enter()
			.append('text')
			.style('font-family', 'monospace')
			.style('font-size', '2.5px')
			.attr('dy', -1.5)
			.append('textPath')
			.text((d) => weight(d))
			.attr('xlink:href', (d) => `#link-${d.source}-${d.target}`)
			.attr('startOffset', '60%')
			.style('text-anchor', 'end')
			.classed('fill-black', true)
			.classed('dark:fill-white', true);

		const node = svg.selectAll('.node').data(graph.nodes).join('g');
		node
			.append('circle')
			.attr('r', RADIUS)
			.attr('fill', (d) => color(d.id))
			.classed('fixed', (d) => d.fx !== undefined)
			.classed('stroke-black', true)
			.classed('dark:stroke-white', true);
		node
			.append('text')
			.text((d) => d.label)
			.attr('font-size', 2)
			.classed('fill-black', true)
			.classed('dark:fill-white', true);

		// Arrows Heads
		svg
			.append('defs')
			.selectAll('marker')
			.data(graph.links)
			.enter()
			.append('marker')
			.attr('id', (d) => `arrowhead-${d.source}`)
			.attr('viewBox', '-0 -5 10 10')
			.attr('refX', 8)
			.attr('refY', 0)
			.attr('orient', 'auto')
			.attr('markerWidth', '4')
			.attr('markerHeight', '4')
			// makes the stroke width irrelevant and only uses markerWidth and markerHeight
			.attr('markerUnits', 'userSpaceOnUse')
			.append('path')
			.attr('d', 'M 0,-5 L 10,0 L 0,5')
			.attr('fill', (d) => color(d.source));

		const simulation = d3
			.forceSimulation()
			.nodes(graph.nodes)
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
			.force('link', d3.forceLink(graph.links))
			.force(
				'collide',
				d3.forceCollide((d) => d.r)
			)
			.on('tick', tick);

		function dragstart() {
			d3.select(this).classed('fixed', true);
		}

		function dragged(event, d) {
			d.fx = clamp(event.x, 0, WIDTH);
			d.fy = clamp(event.y, 0, HEIGHT);
			simulation.alpha(1).restart();
		}

		const drag = d3.drag().on('start', dragstart).on('drag', dragged);

		node.call(drag).on('click', click);

		function tick() {
			const target_node_border = (link) => {
				const vec_center_x = link.target.x - link.source.x;
				const vec_center_y = link.target.y - link.source.y;

				const vec_center_len = Math.sqrt(vec_center_x * vec_center_x + vec_center_y * vec_center_y);

				const v_src_border_x = link.source.x + (vec_center_x * RADIUS) / vec_center_len;
				const v_src_border_y = link.source.y + (vec_center_y * RADIUS) / vec_center_len;

				const v_tgt_border_x = link.source.x + vec_center_x * (1 - (RADIUS + 0.5) / vec_center_len);
				const v_tgt_border_y = link.source.y + vec_center_y * (1 - (RADIUS + 0.5) / vec_center_len);

				return {
					x1: v_src_border_x,
					y1: v_src_border_y,
					x2: v_tgt_border_x,
					y2: v_tgt_border_y
				};
			};

			link.attr('d', function (d) {
				const { x1: sx, y1: sy, x2: tx, y2: ty } = target_node_border(d);
				const dx = tx - sx;
				const dy = ty - sy;
				const dr = Math.sqrt(dx * dx + dy * dy);

				return `M${sx},${sy}A${dr},${dr} 0 0,1 ${tx},${ty}`;
			});

			node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
		}

		function click(event, d) {
			delete d.fx;
			delete d.fy;
			d3.select(this).classed('fixed', false);
			simulation.alpha(1).restart();
		}
	});

	$: if (edge_labels != undefined && link != undefined) {
		weight = (l) => bytes ? l.bytes : l.transfers;
		max_weight = Math.max(...graph.links.map(weight));
		edge_labels.text((d) => weight(d))
		link.attr('stroke-width', (d) => ((MAX_WEIGHT - MIN_WEIGHT) * (weight(d) / max_weight) + MIN_WEIGHT))
	}
</script>

<div class="overflow-hidden">
	<svg id="graph-view" preserveAspectRatio="xMidYMid meet" width="100%">
		<style>
		text {
			dominant-baseline: middle;
			text-anchor: middle;
			cursor: move;
		}

		circle {
			cursor: move;
			stroke-width: 0.25;
		}
		</style>
	</svg>
</div>
