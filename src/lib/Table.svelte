<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	export let items;
	export let keys;
	export let sort_key;
	export let sort_dir;

	let sortKey = writable(sort_key); // default sort key
	let sortDirection = writable(sort_dir); // default sort direction (desc)
	let sortItems = writable(items.slice()); // make a copy of the items array

	// Define a function to sort the items
	const sortTable = (key) => {
		// If the same key is clicked, reverse the sort direction
		if ($sortKey === key) {
			sortDirection.update((val) => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};

	$: {
		const key = $sortKey;
		const direction = $sortDirection;
		const sorted = [...$sortItems].sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];
			if (aVal < bVal) {
				return -direction;
			} else if (aVal > bVal) {
				return direction;
			}
			return 0;
		});
		sortItems.set(sorted);
	}
</script>

<Table striped={true}>
	<TableHead>
		{#each Object.keys(keys) as k}
			<TableHeadCell class="cursor-pointer" on:click={() => sortTable(k)}>
				{$sortKey === k ? ($sortDirection === 1 ? "↑" : "↓") : ""} {keys[k]}
			</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each $sortItems as item}
			<TableBodyRow>
				{#each Object.keys(keys) as k}
					<TableBodyCell>{item[k]}</TableBodyCell>
				{/each}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
