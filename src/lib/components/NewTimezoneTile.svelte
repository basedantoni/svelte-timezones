<script lang="ts">
	import { Plus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import timezones from '$lib/data/timezones.json'; // Adjust the path as necessary
	import type { Timezone } from '$lib';
	import { timezoneStore } from '$lib/store/timezones';

	let isActive = false;
	let searchQuery = '';
	let filteredTimezones = [];

	let inputElement: HTMLInputElement;

	function focusOnMount(node: HTMLInputElement) {
		node.focus();
	}

	onMount(() => {
		if (inputElement) {
			inputElement.focus();
		}
	});

	// Reactive statement to filter timezones based on searchQuery
	$: filteredTimezones = timezones.filter(({ country_name, timezone }) => {
		const query = searchQuery.toLowerCase();
		return country_name.toLowerCase().includes(query) || timezone.toLowerCase().includes(query);
	});

	const handleTimezoneClick = (timezone: string) => {
		const selectedTimezone = timezones.find((tz) => tz.timezone === timezone);

		if (selectedTimezone) {
			timezoneStore.update((existingTimezones) => {
				if (!existingTimezones.find((tz: Timezone) => tz.timezone === timezone)) {
					existingTimezones.push(selectedTimezone);
					localStorage.setItem('tz', JSON.stringify(existingTimezones));
				}
				return existingTimezones;
			});
		}

		searchQuery = '';
		isActive = false;
	};
</script>

{#if !isActive}
	<button
		onclick={() => (isActive = !isActive)}
		class="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg bg-zinc-900/70 px-6 py-5 text-zinc-400 hover:cursor-pointer hover:bg-zinc-900"
	>
		<Plus class="h-6 w-6" />
		<p>Add new timezone</p>
	</button>
{:else}
	<div
		class="flex min-h-[140px] flex-shrink flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-3"
	>
		<div class="flex items-center justify-between text-zinc-400">
			<input
				class="w-full bg-transparent px-3 py-1.5 placeholder-zinc-500 focus:border-0 focus:shadow-none focus:outline-none"
				type="text"
				placeholder="Timezone, city, or country"
				bind:value={searchQuery}
				bind:this={inputElement}
				use:focusOnMount
			/>
			<X
				onclick={() => (isActive = !isActive)}
				class="h-6 w-6 text-zinc-500 hover:cursor-pointer hover:text-zinc-400"
			/>
		</div>
		{#if filteredTimezones.length === 0}
			<p class="text-center text-zinc-500">No timezones found</p>
		{:else if searchQuery === ''}
			<div></div>
		{:else}
			<div class="relative max-h-[108px] overflow-y-scroll sm:max-h-[140px]">
				<div class="flex flex-col gap-0">
					{#each filteredTimezones as { country_name, timezone, gmt_offset }}
						<button
							type="button"
							onclick={() => handleTimezoneClick(timezone)}
							class="grid grid-cols-[auto_1fr] items-center justify-start rounded-md bg-zinc-900 px-1 py-1 text-sm text-zinc-400 hover:bg-zinc-800 focus:outline-none"
						>
							<span
								class="mr-2 block rounded-md bg-black p-0.5 px-1.5 text-xs text-zinc-600 group-hover:text-zinc-400"
								style="font-feature-settings: &quot;tnum&quot;, &quot;lnum&quot;;"
							>
								{gmt_offset}
							</span>
							<span class="truncate text-left">
								{country_name} — {timezone.split('/')[1]}
							</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
