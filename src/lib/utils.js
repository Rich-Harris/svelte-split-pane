/**
 * @param {HTMLElement} element
 * @param {number} size
 * @param {import('./types').Length} min
 * @param {import('./types').Length} max
 * @param {import('./types').Length} pos
 * @param {'min' | 'max'} priority
 * @returns {import('./types').Length}
 */
export function constrain(element, size, min, max, pos, priority) {
	let min_px = normalize(min, element, size);
	let max_px = normalize(max, element, size);
	let pos_px = normalize(pos, element, size);

	if (min_px < 0) min_px += size;
	if (max_px < 0) max_px += size;

	pos_px =
		priority === 'min'
			? Math.max(min_px, Math.min(max_px, pos_px))
			: Math.min(max_px, Math.max(min_px, pos_px));

	/** @type {import('./types').Length} */
	const position = pos.endsWith('%') ? (size ? `${(100 * pos_px) / size}%` : '0%') : `${pos_px}px`;

	return position;
}

/**
 * @param {string} str
 * @param {HTMLElement} element
 * @param {number} size
 */
function normalize(str, element, size) {
	const num = parseFloat(str);

	if (str.endsWith('px')) {
		return num;
	}

	if (str.endsWith('%')) {
		return (size * num) / 100;
	}

	if (str.endsWith('rem')) {
		return num * parseFloat(getComputedStyle(document.documentElement).fontSize);
	}

	if (str.endsWith('em')) {
		return num * parseFloat(getComputedStyle(element).fontSize);
	}

	throw new Error(`Invalid length: ${str}`);
}
