import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * Hook for supporting Controlled and Uncontrolled states for components
 * @param {*} props - The component props 
 * @param {string} getter - The state getter (i.e "value")
 * @param {*} defaultState - (optional) The initial state
 * @param {string} onChange - (optional) Fire an onChange event on custom function (i.e "onChange" or "onSelecChange")
 * @returns {Array} - [state, setState, isControlled] Return
 */
function useController(props, getter="active", defaultState, onChange) {
	const getterUpper = getter.substr(0, 1).toUpperCase() + getter.substr(1);
	const hasDefaultValue = props.hasOwnProperty('default' + getterUpper);
	
	const [active, setActive] = useState((hasDefaultValue ? props['default' + getterUpper] : defaultState));

	const isControlled = props.hasOwnProperty(getter);

	const [controller, setController] = isControlled ?
		[props[getter],
		typeof props['set' + getterUpper] === "function" ?
			props['set' + getterUpper] :
			() => (null)
		] :
		[active, setActive];

	const wrappedSetter = useCallback(((onChange &&
		typeof onChange === "string" &&
		typeof props[onChange] === "function") ?
		(newValue, onChangeParams, preventChangeOnFalse = true) => {
		
			var onChangeParams = Array.isArray(onChangeParams) ? onChangeParams : [newValue];
			
			if(props[onChange](...onChangeParams) === false && preventChangeOnFalse) {
				return false;
			}

			return setController(newValue);
		}
		: setController),[isControlled, setController, props, getter, onChange]);

	return [controller, wrappedSetter, isControlled];
}


export default useController;