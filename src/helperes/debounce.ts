
export function debounce(cb: Function, wait: number, immediate: boolean = false) {
	var timeout: NodeJS.Timeout | null;
	return function() {
        // @ts-ignore
		const context = this
        const args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) cb.apply(context, args);
		};
		var callNow = immediate && !timeout;
		timeout && clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) cb.apply(context, args);
	};
};
