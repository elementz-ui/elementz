import React, { useReducer } from 'react';

function useMultiState(initialState) {
	const [state, setState] = useReducer(
		(state, action) => {
			if(!action || typeof action !== "object" || action.__proto__.constructor.name !== "Object") {
				return state;
			}
			return {
				...state,
				...action
			}
		}, initialState);
	
	return [state, setState];
}

export default useMultiState;