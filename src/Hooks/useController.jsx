import React, { useState, useEffect, useRef } from 'react';

//Controlled & Uncotrolled state hook for components
function useController(props, getter="active", defaultState, onChange=false) {

	const isFirstRender = useRef(true);
	const getterUpper = getter.substr(0, 1).toUpperCase() + getter.substr(1);
	const hasDefaultValue = props.hasOwnProperty('default' + getterUpper);
	
	const [active, setActive] = useState((hasDefaultValue ? props['default' + getterUpper] : defaultState));

	const isControlled = props.hasOwnProperty(getter);

	const [controller, setController] = (isControlled ?
		[props[getter],
			typeof props['set' + getterUpper] === "function" ?
				props['set' + getterUpper] :
				() => (null)
		] :
		[active, setActive]);
	
	useEffect(() => {
		if(isFirstRender.current) {
			isFirstRender.current = false;
			return undefined;
		}

		if(!isControlled && onChange && typeof props.onChange === "function") {
			props.onChange(typeof onChange === "function" ? onChange(active) : active);
		}
	}, [active]);

	return [controller, setController, isControlled];
}


export default useController;