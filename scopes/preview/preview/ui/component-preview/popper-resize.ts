import { Modifier } from '@popperjs/core';

export type ResizeToMatchReferenceOptions = {
	offset: [number, number];
};

/**
 * A [Popper.js](https://popper.js.org/) plugin.
 *
 * Scales popper to be the same size as the reference element
 * @name resizeToMatchReference
 */

export const resizeToMatchReference: Modifier<string, ResizeToMatchReferenceOptions> = {
	name: 'resizeToMatchReference',
	enabled: true,
	phase: 'main',
	fn({ state, options }) {
		const { offset: [offsetX, offsetY] = [0, 0] } = options;
		const { width, height } = state.rects.reference;

		state.styles.popper = {
			...state.styles.popper,
			width: `${width + offsetX}px`,
			height: `${height + offsetY}px`,
		};
	},
};