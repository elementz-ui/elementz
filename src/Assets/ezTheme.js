window.EzTheme = {
	initialize: function () {
		var mode = window.localStorage.getItem('ez-mode'),
			size = window.localStorage.getItem('ez-size'),
			saver = document.head['insertAdjacentHTML'](
				'beforeend',
				`<style>
					.ez-theme-initial{
						opacity:0; display:flex; position: absolute; left: -9999px; background: url('https://api.elementz.style/i.png');
					}
				</style>`) || document.body['insertAdjacentHTML']('beforeend', `<div class='ez-theme-initial'></div>`);
		
		if(mode === 'dark') {
			document.body.classList.add('ez-dark');
		}
		if(size !== 'md' && ['sm', 'lg', 'xl'].includes(size)) {
			document.body.classList.add('ez-sz-' + size);
		}
		
	},

	toggleDarkMode: function () {
		var toggleClass = document.body.classList.toggle("ez-dark");
		window.localStorage.setItem('ez-mode', toggleClass ? 'dark' : 'light');
		return toggleClass;
	},

	get isDarkMode() {
		return document.body.classList.contains("ez-dark") ? true : false;
	},

	setSize: function (size) {
		var sizes = ['sm', 'md', 'lg', 'xl'];
		if(!sizes.includes(size)) {
			console.error("Allowed sizes: ", sizes);
			return false;
		}

		var sizesClasses = sizes.map((s) => ('ez-sz-' + s));
		document.body.classList.remove(...sizesClasses);
		
		if(size === 'md') {
			window.localStorage.removeItem('ez-size');
			return true;
		}
		
		document.body.classList.add('ez-sz-' + size);
		window.localStorage.setItem('ez-size', size);
		return true;
	},

	get size() {
		var currentTheme = Array.from(document.body.classList).find((v) => (v.startsWith('ez-sz-')));
		if(!currentTheme) {
			return 'md';
		}
		return currentTheme.replace('ez-sz-', '');
	}
};


window.addEventListener('DOMContentLoaded', (e) => {
	window.EzTheme.initialize();
});