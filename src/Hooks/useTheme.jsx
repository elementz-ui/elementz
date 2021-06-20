import { func } from 'prop-types';
import React, { useState } from 'react';


function useThemeDarkMode() {
	if(typeof window === "undefined" || !window.EzTheme) {
		throw new Error("EzTheme not loaded. Include the EzTheme script tag on your static HTML template after <body> tag.")
	}

	const [isDarkMode, setDarkMode] = useState(window.EzTheme.isDarkMode);

	const toggleDarkMode = () => {
		setDarkMode(!isDarkMode);
		window.EzTheme.toggleDarkMode();
	};

	return [isDarkMode, toggleDarkMode];
};


function useThemeSize() {
	if(typeof window === "undefined" || !window.EzTheme) {
		throw new Error("EzTheme not loaded. Include the EzTheme script tag on your static HTML template after <body> tag.")
	}

	const [size, setSize] = useState(window.EzTheme.size);

	const _setSize = (size) => {
		var sizes = ['sm', 'md', 'lg', 'xl'];
		if(!sizes.includes(size)) {
			throw new Error("Invalid theme size, allowed: ", sizes);
		}

		setSize(size);
		window.EzTheme.setSize(size);
	};

	return [size, _setSize];
};


export {
	useThemeDarkMode,
	useThemeSize
};
	

