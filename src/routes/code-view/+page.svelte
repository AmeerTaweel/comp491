<svelte:head>
	<!-- <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet"> -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" integrity="sha256-GxX+KXGZigSK67YPJvbu12EiBx257zuZWr0AMiT1Kpg=" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.js" integrity="sha256-rFpGp14r3gomlXcrHLI16T0sGFOr2/WJ33hQ27wi3z0=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" integrity="sha256-AjM0J5XIbiB590BrznLEgZGLnOQWrt62s3BEq65Q/I0=" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css" integrity="sha256-4CROCOz16nRjanuxMghkzZzCOdmwLXxFqCMCW7XG/lA=" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js" integrity="sha256-9cmf7tcLdXpKsPi/2AWE93PbZpTp4M4tqzFk+lWomjU=" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/match-braces/prism-match-braces.min.css" integrity="sha256-ofzmpw1bhHX6o2yPsxm/qv2HF/pxkmWJhQiMnlQ+4Tw=" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/match-braces/prism-match-braces.min.js" integrity="sha256-+5ZWEZo03rdvJF2quCewrodzNhHu9aDLctMge3kzqYU=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js" integrity="sha256-ronWqXsvaeyrdiX7YJfdYj0S5NbeMA5ilQQTrK25Jno=" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-highlight/prism-line-highlight.min.css" integrity="sha256-bIhlX361i8fom5jO6z1cm0VvK4miOKRIus96h7VQzc0=" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-highlight/prism-line-highlight.min.js" integrity="sha256-Bj7OW9OtQdyyg0zpZoL8Dx8EJAcVN6j3FOxyKSXA+Po=" crossorigin="anonymous"></script>
</svelte:head>

<script lang="ts">
	/** @type {import("./$types").PageData} */
	export let data;

	import { Radio } from 'flowbite-svelte';
	import Heatmap from "$lib/Heatmap.svelte";
	import { browser } from "$app/environment"
	import { Label, Select } from 'flowbite-svelte';

	let files = Object.keys(data.files).map(k => ({value: k, name: k}))
	let selected = files[0].value;

	let lines = Object.keys(data.line_transfers).map(k => ({value: k, name: data.code_lines[k].num}))
	let line_idx = lines[0].value;

	let bytes = false
	$: if (browser && "bytes" in localStorage) {
		bytes = JSON.parse(localStorage.bytes)
	}

	function change_comm_unit(event) {
		bytes = event.currentTarget.value === "true";
		localStorage.bytes = JSON.stringify(bytes)
	}

	$: code = data.files[selected].trim()

	$: line = data.code_lines[line_idx].num

	$: multi_gpu = line_idx in data.line_transfers

	let heatmap_data = []
	let heatmap_N = 0
	$: {
		heatmap_data = []
		let node_ids_dup = Object.entries(data.line_transfers[line_idx] ?? {})
			.flatMap(([src, targets]) => [src, ...Object.keys(targets)])
			.map((id) => parseInt(id))
			.toSorted();
		let node_ids = [...new Set(node_ids_dup)];
		heatmap_N = Math.max(...node_ids) + 1
		for (let i = 0; i < heatmap_N; i++) {
			for (let j = 0; j < heatmap_N; j++) {
				const communication = data.line_transfers[line_idx]?.[i]?.[j] ?? {transfers: 0, bytes: 0}
				heatmap_data.push({row: i, col: j, ...communication})
			}
		}
	}

	$: total = heatmap_data.map(i => bytes ? i.bytes : i.transfers).reduce((a, b) => a + b, 0)

	function reload_syntax() {
		if (browser) {
			setTimeout(window.Prism.highlightAll, 0)
		}
	}

	$: line_idx, reload_syntax()
	$: selected, reload_syntax()
</script>

<h1>Code View</h1>

<div class="flex gap-x-4">
	<div>
		<p class="font-bold mb-4">Communication Units</p>
		<div class="flex gap-x-4">
			<Radio name="comm-unit" value={false} on:change={change_comm_unit} group={bytes}>Data Transfers</Radio>
			<Radio name="comm-unit" value={true}  on:change={change_comm_unit} group={bytes}>Bytes</Radio>
		</div>
	</div>

	<Label>
		<span class="font-bold">File</span>
		<Select class="mt-4 mb-4 w-30" items={files} bind:value={selected} />
	</Label>

	<Label>
		<span class="font-bold">Line</span>
		<Select class="mt-4 mb-4 w-30" items={lines} bind:value={line_idx} />
	</Label>
</div>

<div class="grid grid-cols-12 grid-rows-1 gap-x-4">
	<div class="col-span-6">
		<h1 class="mb-5">Code</h1>

		{#key selected}
			<pre data-line={Object.keys(data.line_transfers).map(i => data.code_lines[i].num).join(",")}>
				<code class="language-cpp line-numbers rainbow-braces match-braces">
					{code}
				</code>
			</pre>
		{/key}
	</div>
	<div class="col-span-6">
		<div class="sticky top-10">
			<h1 class="mb-5">Line Info</h1>

			<div class="mb-5">
				<h4 class="mb-4">Line {line}</h4>
				{#key line_idx}
					<pre><code class="language-cpp">{code.split("\n")[line - 1]}</code></pre>
				{/key}
			</div>

			<div class="mb-5">
				<h4 class="mb-4">Objects Affected: {data.line_objects_counts[line_idx] ?? 0}</h4>
			</div>


			<h4 class="mb-4 font-bold text-center">Data Transfers</h4>
			<h4 class="mb-4 text-center">Total {bytes ? "Bytes Transferred" : "Data Transfers"}: {total}</h4>
			{#if total > 0}
				<Heatmap data={heatmap_data} N={heatmap_N} M={heatmap_N} bytes={bytes}/>
			{/if}

		</div>
	</div>
</div>
