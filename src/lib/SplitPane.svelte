<script>
	import { createEventDispatcher } from 'svelte';
	import { constrain } from './utils.js';

	/** @type {ReturnType<typeof createEventDispatcher<{ change: undefined }>>} */
	const dispatch = createEventDispatcher();

	/** @type {string | undefined} */
	export let id = undefined;

	/** @type {'horizontal' | 'vertical'} */
	export let type;

	/** @type {import('./types').Length} */
	export let pos = '50%';

	/** @type {import('./types').Length} */
	export let min = '0%';

	/** @type {import('./types').Length} */
	export let max = '100%';

	export let disabled = false;

	/** @type {'min' | 'max'}*/
	export let priority = 'min';

	/** @type {HTMLElement} */
	let container;

	let dragging = false;
	let w = 0;
	let h = 0;

	$: position = pos;

	// constrain position
	$: if (container) {
		const size = type === 'horizontal' ? w : h;
		position = constrain(container, size, min, max, position, priority);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	function update(x, y) {
		if (disabled) return;

		const { top, left } = container.getBoundingClientRect();

		const pos_px = type === 'horizontal' ? x - left : y - top;
		const size = type === 'horizontal' ? w : h;

		position = pos.endsWith('%') ? `${(100 * pos_px) / size}%` : `${pos_px}px`;

		dispatch('change');
	}

	/**
	 * @param {HTMLElement} node
	 * @param {(event: PointerEvent) => void} callback
	 */
	function drag(node, callback) {
		/** @param {PointerEvent} event */
		const pointerdown = (event) => {
			if (
				(event.pointerType === 'mouse' && event.button === 2) ||
				(event.pointerType !== 'mouse' && !event.isPrimary)
			)
				return;

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

		node.addEventListener('pointerdown', pointerdown, { capture: true, passive: false });

		return {
			destroy() {
				node.removeEventListener('pointerdown', pointerdown);
			}
		};
	}
</script>

<div
	data-pane={id}
	class="split-pane-container split-pane-{type}"
	bind:this={container}
	bind:clientWidth={w}
	bind:clientHeight={h}
	style="--pos: {position}"
>
	<div class="split-pane">
		<slot name="a" />
	</div>

	<div class="split-pane">
		<slot name="b" />
	</div>

	{#if pos !== '0%' && pos !== '100%'}
		<div class="split-pane-{type} split-pane-divider" class:disabled use:drag={(e) => update(e.clientX, e.clientY)}></div>
	{/if}
</div>

{#if dragging}
	<div class="split-pane-mousecatcher"></div>
{/if}

<style>
	.split-pane-container {
		--sp-thickness: var(--thickness, 8px);
		--sp-color: var(--color, transparent);
		display: grid;
		position: relative;
		width: 100%;
		height: 100%;
	}

	.split-pane-container.split-pane-vertical {
		grid-template-rows: var(--pos) 1fr;
	}

	.split-pane-container.split-pane-horizontal {
		grid-template-columns: var(--pos) 1fr;
	}

	.split-pane {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.split-pane > :global(*) {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.split-pane-mousecatcher {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.0001);
	}

	.split-pane-divider {
		position: absolute;
		touch-action: none !important;
	}

	.split-pane-divider::after {
		content: '';
		position: absolute;
		background-color: var(--sp-color);
	}

	.split-pane-horizontal > .split-pane-divider {
		padding: 0 calc(0.5 * var(--sp-thickness));
		width: 0;
		height: 100%;
		cursor: ew-resize;
		left: var(--pos);
		transform: translate(calc(-0.5 * var(--sp-thickness)), 0);
	}

	.split-pane-horizontal > .split-pane-divider.disabled {
		cursor: default;
	}

	.split-pane-horizontal > .split-pane-divider::after {
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
	}

	.split-pane-vertical > .split-pane-divider {
		padding: calc(0.5 * var(--sp-thickness)) 0;
		width: 100%;
		height: 0;
		cursor: ns-resize;
		top: var(--pos);
		transform: translate(0, calc(-0.5 * var(--sp-thickness)));
	}

	.split-pane-vertical > .split-pane-divider.disabled {
		cursor: default;
	}

	.split-pane-vertical > .split-pane-divider::after {
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
	}
</style>
