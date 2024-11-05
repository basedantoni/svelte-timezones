import { writable } from 'svelte/store';
import timezones from '$lib/data/timezones.json';
import type { Timezone } from '$lib';

const initialTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const initialTzData: Timezone = timezones.find((tz) => tz.timezone === initialTz) ?? timezones[0];

const isLocalStorageAvailable = typeof localStorage !== 'undefined';

const storedTimezones = isLocalStorageAvailable
	? JSON.parse(localStorage.getItem('tz') || '[]')
	: [];

if (!storedTimezones.find((tz: Timezone) => tz.timezone === initialTz)) {
	storedTimezones.unshift(initialTzData);
}

export const timezoneStore = writable<Timezone[]>(storedTimezones);

if (isLocalStorageAvailable) {
	timezoneStore.subscribe((value) => {
		if (!localStorage.getItem('tz')) {
			localStorage.setItem('tz', JSON.stringify(value));
		}
	});
}

export const selectedTimezone = writable<Timezone | null>(storedTimezones[0]);
