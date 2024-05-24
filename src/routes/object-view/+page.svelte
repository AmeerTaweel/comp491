<script lang="ts">
	import { Radio } from 'flowbite-svelte';

	import Heatmap from "$lib/Heatmap.svelte";
	import Heatmap1D from "$lib/Heatmap1D.svelte";

	import { Label, Input, Select } from 'flowbite-svelte';

	import { browser } from "$app/environment"

	/** @type {import("./$types").PageData} */
	export let data;

	let bytes = false
	$: if (browser && "bytes" in localStorage) {
		bytes = JSON.parse(localStorage.bytes)
	}

	function rand_int(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	let objects_names = [
		"v_adj_list",
		"v_adj_begin",
		"v_adj_length",
		"flags",
		"loc_in_queue",
		"loc_out_queue",
		"glob_queue",
		"queue_to_push",
		"result"
	]
	let objects = {}
	let obj_size = 256
	let max_transfers = 1024

	for (const name of objects_names) {
		let data_type_byte_size = rand_int(1, 8)
		let comm = []
		for (let i = 0; i < obj_size; i++) {
			let rand = rand_int(0, max_transfers)
			comm.push({
				transfers: rand,
				bytes: rand * data_type_byte_size
			})
		}
		objects[name] = comm
	}

	let obj = Object.keys(objects)[0]
	let obj_cols_str = `${Math.floor(Math.sqrt(objects[obj].length))}`
	$: obj_cols = obj_cols_str !== "" ? Math.min(objects[obj].length, parseInt(obj_cols_str)) : Math.floor(Math.sqrt(objects[obj].length))

	let obj_select = Object.keys(objects).map(k => ({value: k, name: k}))
	let selected = obj_select[0].value;

	$: obj_rows = Math.ceil(objects[selected].length / obj_cols)

	function change_comm_unit(event) {
		bytes = event.currentTarget.value === "true";
		localStorage.bytes = JSON.stringify(bytes)
	}

	let heatmap_data = []
	$: {
		heatmap_data = []
		for (let i = 0; i < obj_rows; i++) {
			for (let j = 0; j < obj_cols; j++) {
				const idx = i * obj_cols + j;
				const communication = objects?.[selected]?.[idx] ?? {transfers: 0, bytes: 0}
				heatmap_data.push({row: i, col: j, ...communication})
			}
		}
	}
</script>

<div>
	<h1>Object View</h1>

	<div class="flex gap-x-4">
		<Label>
			<span class="font-bold">Object</span>
			<Select class="mt-4 mb-4 w-30" items={obj_select} bind:value={selected} />
		</Label>

		<div class="mb-6">
			<Label for="large-input" class="block mb-4">Object Columns</Label>
			<Input id="large-input" bind:value={obj_cols_str}/>
		</div>

		<div class="mb-6">
			<Label class="block mb-4">Object Rows</Label>
			<Input disabled bind:value={obj_rows}/>
		</div>
		<div>
			<p class="font-bold mb-4">Communication Units</p>
			<div class="flex gap-x-4">
				<Radio name="comm-unit" value={false} on:change={change_comm_unit} group={bytes}>Data Transfers</Radio>
				<Radio name="comm-unit" value={true}  on:change={change_comm_unit} group={bytes}>Bytes</Radio>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 grid-rows-1 gap-x-4">
		{#key selected}
		{#key obj_rows}
			<Heatmap1D data={objects} bytes={bytes}/>
		{/key}
		{/key}

		{#key selected}
		{#key obj_rows}
			<Heatmap data={heatmap_data} N={obj_rows} M={obj_cols} prefix="" reverse_y={true}/>
		{/key}
		{/key}
	</div>
</div>
