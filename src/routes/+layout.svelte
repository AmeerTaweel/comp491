<script lang="ts">
	import '../app.css';

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import {
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterBrand,
		FooterLink
	} from 'flowbite-svelte';

	import { page } from '$app/stores';

	$: activeUrl = $page.url.pathname;
</script>

<svelte:head>
	<title>Snoopie</title>

	<link rel="icon" href="/favicon.png" />

	<!-- Set Theme -->
	<!-- Added in head to avoid FOUC -->
	<script>
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

<div
	class="h-screen w-screen bg-white text-slate-900 antialiased dark:bg-slate-900 dark:text-white flex flex-col"
>
	<Navbar fluid={true} class="border-b">
		<NavBrand href="/">
			<img src="/logo.webp" class="me-3 h-6 sm:h-9" alt="Snoopie Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold">Snoopie</span>
		</NavBrand>

		<NavHamburger />
		<NavUl {activeUrl}>
			<NavLi href="/system-view">System View</NavLi>
			<NavLi href="/code-view"  >Code View</NavLi>
			<NavLi href="/object-view">Object View</NavLi>
			<NavLi href="/device-view">Device View</NavLi>
		</NavUl>

		<DarkMode class="border dark:border-gray-800" />
	</Navbar>

	<div class="m-8 flex-grow">
		<slot></slot>
	</div>

	<Footer footerType="default" class="text-gray-600">
		<p>
			This project has received funding from the European Research Council (ERC) under the European
			Union’s Horizon 2020 research and innovation programme (grant agreement No 949587).
		</p>
	</Footer>
</div>

<style></style>
