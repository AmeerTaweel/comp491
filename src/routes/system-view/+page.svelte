<script lang="ts">
	import { Radio } from 'flowbite-svelte';

	import Graph from "$lib/Graph.svelte";
	import Heatmap from "$lib/Heatmap.svelte";

	import { browser } from "$app/environment"

	/** @type {import("./$types").PageData} */
	export let data;

	let bytes = false
	$: if (browser && "bytes" in localStorage) {
		bytes = JSON.parse(localStorage.bytes)
	}

	function change_comm_unit(event) {
		bytes = event.currentTarget.value === "true";
		localStorage.bytes = JSON.stringify(bytes)
	}

	const graph = data.communication_graph;

	// Some nodes might only receive data without sending any data
	const node_ids_dup = Object.entries(graph)
		.flatMap(([src, targets]) => [src, ...Object.keys(targets)])
		.map((id) => parseInt(id))
		.toSorted();
	const node_ids = [...new Set(node_ids_dup)];

	const N = node_ids.length;

	const d3_nodes = node_ids.map((id) => ({ id, label: `GPU${id}` }));
	const d3_links = node_ids
		.map((src) =>
			Object.entries(graph[src]).map(([target, comm]) => ({
				source: parseInt(src),
				target: parseInt(target),
				transfers: parseInt(comm.transfers),
				bytes: parseInt(comm.bytes)
			}))
		)
		.flat();

	const d3_graph = { nodes: d3_nodes, links: d3_links };

	const heatmap_data = []
	const heatmap_N = Math.max(...node_ids) + 1
	for (let i = 0; i < heatmap_N; i++) {
		for (let j = 0; j < heatmap_N; j++) {
			const communication = graph?.[i]?.[j] ?? {transfers: 0, bytes: 0}
			heatmap_data.push({row: i, col: j, ...communication})
		}
	}
</script>

<div>
	<h1>System View</h1>

	<div>
		<p class="font-bold mb-4">Communication Units</p>
		<div class="flex gap-x-4">
			<Radio name="comm-unit" value={false} on:change={change_comm_unit} group={bytes}>Data Transfers</Radio>
			<Radio name="comm-unit" value={true}  on:change={change_comm_unit} group={bytes}>Bytes</Radio>
		</div>
	</div>

	<div class="grid grid-cols-2 grid-rows-1 gap-x-4">
		<Graph graph={d3_graph} bytes={bytes}/>
		<Heatmap data={heatmap_data} N={heatmap_N} M={heatmap_N} bytes={bytes}/>
	</div>
</div>
