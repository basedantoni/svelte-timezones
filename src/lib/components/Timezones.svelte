<script lang="ts">
	import TimezoneTile from '$lib/components/TimezoneTile.svelte';
	import NewTimezoneTile from '$lib/components/NewTimezoneTile.svelte';
	import { timezoneStore } from '$lib';
	import { get } from 'svelte/store';

	let tzs = get(timezoneStore);

	$: {
		timezoneStore.subscribe((value) => {
			tzs = value;
		});
	}
</script>

<div class="sm:grid-cols-auto-fill-300 m-3 grid gap-3 overscroll-contain">
	{#each tzs as tz}
		<TimezoneTile {tz} />
	{/each}
	<NewTimezoneTile />
</div>
