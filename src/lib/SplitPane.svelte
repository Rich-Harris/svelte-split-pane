<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Length } from './types';

	interface Props {
		type: 'horizontal' | 'vertical';
		id?: string | undefined;
		pos?: Length;
		min?: Length;
		max?: Length;
		disabled?: boolean;
		a?: Snippet;
		b?: Snippet;
	}

	let {
		id = undefined,
		type,
		pos = $bindable('50%'),
		min = '0%',
		max = '100%',
		disabled = false,
		a,
		b
	}: Props = $props();

	let container: HTMLElement;

	let dragging = $state(false);

	function normalize(length: string) {
		if (length[0] === '-') {
			return `calc(100% - ${length.slice(1)})`;
		}

		return length;
	}

	function update(x: number, y: number) {
		if (disabled) return;

		const { top, left, width, height } = container.getBoundingClientRect();

		let p = type === 'horizontal' ? (x - left) / width : (y - top) / height;

		if (p < 0) p = 0;
		if (p > 1) p = 1;

		pos = `${100 * p}%`;
	}

	function drag(node: HTMLElement, callback: (event: PointerEvent) => void) {
		const pointerdown = (event: PointerEvent) => {
			if (
				(event.pointerType === 'mouse' && event.button === 2) ||
				(event.pointerType !== 'mouse' && !event.isPrimary)
			) {
				return;
			}

			node.setPointerCapture(event.pointerId);

			event.preventDefault();

			dragging = true;

			const onpointerup = () => {
				dragging = false;

				node.setPointerCapture(event.pointerId);

				window.removeEventListener('pointermove', callback, false);
				window.removeEventListener('pointerup', onpointerup, false);
			};

			window.addEventListener('pointermove', callback, false);
			window.addEventListener('pointerup', onpointerup, false);
		};

		$effect(() => {
			node.addEventListener('pointerdown', pointerdown, { capture: true, passive: false });

			return () => {
				node.removeEventListener('pointerdown', pointerdown);
			};
		});
	}
</script>

<svelte-split-pane
	bind:this={container}
	data-pane={id}
	data-orientation={type}
	style="--pos: {normalize(pos)}; --min: {normalize(min)}; --max: {normalize(max)}"
>
	<svelte-split-pane-section>
		{@render a?.()}
	</svelte-split-pane-section>

	<svelte-split-pane-section>
		{@render b?.()}
	</svelte-split-pane-section>

	<svelte-split-pane-divider class:disabled use:drag={(e) => update(e.clientX, e.clientY)}
	></svelte-split-pane-divider>
</svelte-split-pane>

{#if dragging}
	<svelte-split-pane-mousecatcher></svelte-split-pane-mousecatcher>
{/if}

<style>
	svelte-split-pane {
		--sp-thickness: var(--thickness, 8px);
		--sp-color: var(--color, transparent);
		display: grid;
		position: relative;
		width: 100%;
		height: 100%;
	}

	svelte-split-pane[data-orientation='vertical'] {
		grid-template-rows: clamp(var(--min), var(--pos), var(--max)) 1fr;
	}

	svelte-split-pane[data-orientation='horizontal'] {
		grid-template-columns: clamp(var(--min), var(--pos), var(--max)) 1fr;
	}

	svelte-split-pane-section {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	svelte-split-pane-section > :global(*) {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	svelte-split-pane-mousecatcher {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.0001);
	}

	svelte-split-pane-divider {
		position: absolute;
		touch-action: none !important;
	}

	svelte-split-pane-divider::after {
		content: '';
		position: absolute;
		background-color: var(--sp-color);
	}

	[data-orientation='horizontal'] > svelte-split-pane-divider {
		padding: 0 calc(0.5 * var(--sp-thickness));
		width: 0;
		height: 100%;
		cursor: ew-resize;
		left: clamp(var(--min), var(--pos), var(--max));
		transform: translate(calc(-0.5 * var(--sp-thickness)), 0);
	}

	[data-orientation='horizontal'] > svelte-split-pane-divider.disabled {
		cursor: default;
	}

	[data-orientation='horizontal'] > svelte-split-pane-divider::after {
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
	}

	[data-orientation='vertical'] > svelte-split-pane-divider {
		padding: calc(0.5 * var(--sp-thickness)) 0;
		width: 100%;
		height: 0;
		cursor: ns-resize;
		top: clamp(var(--min), var(--pos), var(--max));
		transform: translate(0, calc(-0.5 * var(--sp-thickness)));
	}

	[data-orientation='vertical'] > svelte-split-pane-divider.disabled {
		cursor: default;
	}

	[data-orientation='vertical'] > svelte-split-pane-divider::after {
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
	}
</style>
