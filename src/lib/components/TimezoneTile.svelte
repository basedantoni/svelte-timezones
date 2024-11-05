<script lang="ts">
	import { Trash2, SquarePen, BellMinus } from 'lucide-svelte';
	import type { Timezone } from '$lib';
	import { selectedTimezone, timezoneStore } from '$lib';
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';

	let tzs = get(timezoneStore);

	const { tz } = $props<{ tz: Timezone }>();
	const { country_name, timezone, gmt_offset } = tz;

	let formattedHour = $state('');
	let formattedMinutes = $state('');
	let ampm = $state('');

	const city = timezone.split('/')[1];
	let interval: number;
	let timeout: number;

	const today = new Date().toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		timeZone: timezone
	});

	const updateTime = () => {
		const now = new Date();
		const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
		const hours = tzTime.getHours();
		const minutes = tzTime.getMinutes();
		ampm = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours % 12 || 12; // Convert 24h to 12h format
		formattedHour = displayHours.toString().padStart(2, '0');
		formattedMinutes = minutes.toString().padStart(2, '0');
	};

	const startClock = () => {
		updateTime(); // Initial call to set the time immediately

		// Calculate the delay until the next minute
		const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
		const delay = (60 - now.getSeconds()) * 1000;

		// Set a timeout to align the first update with the next minute
		timeout = setTimeout(() => {
			updateTime();
			// Set an interval to update every minute thereafter
			interval = setInterval(updateTime, 60000);
		}, delay);
	};

	startClock();

	// Clear the timeout and interval on component destroy
	onDestroy(() => {
		clearTimeout(timeout);
		clearInterval(interval);
	});

	const handleTileClick = (tz: Timezone) => {
		selectedTimezone.set(tz);
	};

	const handleDelete = (deletedTz: Timezone) => {
		timezoneStore.update((existingTimezones) => {
			const newTimezones = existingTimezones.filter(
				(tz: Timezone) => tz.timezone !== deletedTz.timezone
			);
			localStorage.setItem('tz', JSON.stringify(newTimezones));
			return newTimezones;
		});
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	onclick={() => handleTileClick(tz)}
	role="button"
	class="flex flex-col gap-12 rounded-lg border-2 {$selectedTimezone?.timezone === timezone
		? 'border-orange-500'
		: 'border-zinc-800'} bg-zinc-900 px-6 py-5"
>
	<div class="flex w-full flex-col gap-2">
		<div class="flex items-center justify-between text-zinc-500">
			<h2>{city}, {country_name}</h2>
			<div class="flex items-center gap-2">
				<!-- <SquarePen class="h-4 w-4" /> -->
				{#if tzs.length > 1}
					<Trash2 onclick={() => handleDelete(tz)} class="h-4 w-4" />
				{/if}
			</div>
		</div>

		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<p class="font-mono text-3xl">
					{formattedHour}<span class="animate-ping">:</span>{formattedMinutes}<span
						class="text-zinc-500">{ampm}</span
					>
				</p>
				<!-- <div class="rounded-full bg-zinc-800 px-2.5 py-1 text-sm text-green-500">+15h</div> -->
			</div>
			<!-- <BellMinus class="h-4 w-4 text-zinc-400" /> -->
		</div>

		<div class="flex items-center gap-2 text-sm text-zinc-500">
			<p>{gmt_offset}</p>
			<div class="h-0.5 w-0.5 rounded-full bg-zinc-400"></div>
			<p>{today}</p>
		</div>
	</div>
	<!-- <div>Slider</div> -->
</div>
