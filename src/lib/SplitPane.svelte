<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Length } from './types';

	interface Props {
		type: 'columns' | 'rows';
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
	let current = $derived(pos);

	function normalize(length: string) {
		if (length[0] === '-') {
			return `calc(100% - ${length.slice(1)})`;
		}

		return length;
	}

	function update(x: number, y: number) {
		if (disabled) return;

		const { top, left, width, height } = container.getBoundingClientRect();

		let p = type === 'columns' ? (x - left) / width : (y - top) / height;

		if (p < 0) p = 0;
		if (p > 1) p = 1;

		current = `${100 * p}%`;
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
	style="--pos: {normalize(current)}; --min: {normalize(min)}; --max: {normalize(max)}"
>
	<svelte-split-pane-section
		bind:contentRect={null,
		(rect: DOMRect) => {
			if (!dragging) return;

			const parent = container.getBoundingClientRect();
			const is_negative = pos.startsWith('-');

			const size = type === 'columns' ? rect.width : rect.height;
			const parent_size = type === 'columns' ? parent.width : parent.height;

			if (pos.endsWith('%')) {
				const percent = (100 * size) / parent_size;
				pos = `${is_negative ? percent - 100 : percent}%`;
			} else {
				const px = is_negative ? size - parent_size : size;

				if (pos.endsWith('px')) {
					pos = `${px}px`;
				} else if (pos.endsWith('em')) {
					const is_rem = pos.endsWith('rem');

					const font_size = parseFloat(
						getComputedStyle(is_rem ? document.documentElement : container).fontSize
					);

					const em = px / font_size;

					pos = `${em}${is_rem ? 'rem' : 'em'}`;
				}
			}
		}}
	>
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
		--sp-clamped: clamp(var(--min), var(--pos), var(--max));
		display: grid;
		position: relative;
		width: 100%;
		height: 100%;
	}

	svelte-split-pane[data-orientation='rows'] {
		grid-template-rows: var(--sp-clamped) 1fr;
	}

	svelte-split-pane[data-orientation='columns'] {
		grid-template-columns: var(--sp-clamped) 1fr;
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

	[data-orientation='columns'] > svelte-split-pane-divider {
		padding: 0 calc(0.5 * var(--sp-thickness));
		width: 0;
		height: 100%;
		cursor: ew-resize;
		left: var(--sp-clamped);
		transform: translate(calc(-0.5 * var(--sp-thickness)), 0);
	}

	[data-orientation='columns'] > svelte-split-pane-divider.disabled {
		cursor: default;
	}

	[data-orientation='columns'] > svelte-split-pane-divider::after {
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
	}

	[data-orientation='rows'] > svelte-split-pane-divider {
		padding: calc(0.5 * var(--sp-thickness)) 0;
		width: 100%;
		height: 0;
		cursor: ns-resize;
		top: var(--sp-clamped);
		transform: translate(0, calc(-0.5 * var(--sp-thickness)));
	}

	[data-orientation='rows'] > svelte-split-pane-divider.disabled {
		cursor: default;
	}

	[data-orientation='rows'] > svelte-split-pane-divider::after {
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
	}
</style>
