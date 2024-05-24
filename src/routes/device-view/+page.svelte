<script lang="ts">
	/** @type {import("./$types").PageData} */
	export let data;

	import Table from "$lib/Table.svelte";

	import { Label, Select } from 'flowbite-svelte';
	let devices = data.devices.map(d => ({value: d, name: `GPU${d}`}))
	let selected = devices[0].value;
</script>

<div>
	<h1>Device View</h1>

	<Label>
		<span class="font-bold">Device</span>
		<Select class="mt-4 mb-4 w-30" items={devices} bind:value={selected} />
	</Label>

	<div class="grid grid-cols-2 grid-rows-2 gap-4">
		<div>
			<h2 class="font-bold">Objects</h2>
			<div style="max-height: 50vh; overflow-y: auto;">
				{#key selected}
					<Table items={data.objects[selected]} keys={({id: "Object", count: "Count", target: "Destination"})} sort_key={"count"} sort_dir={-1}/>
				{/key}
			</div>
		</div>
		<div>
			<h2 class="font-bold">Code Lines</h2>
			<div style="max-height: 50vh; overflow-y: auto;">
				{#key selected}
					<Table items={data.code_lines[selected]} keys={({id: "Code Line", count: "Count", target: "Destination"})} sort_key={"count"} sort_dir={-1}/>
				{/key}
			</div>
		</div>
		<div>
			<h2 class="font-bold">Instructions</h2>
			<div style="max-height: 50vh; overflow-y: auto;">
				{#key selected}
					<Table items={data.instructions[selected]} keys={({id: "Instruction", count: "Count", target: "Destination"})} sort_key={"count"} sort_dir={-1}/>
				{/key}
			</div>
		</div>
	</div>
</div>
