import React,{useEffect, useRef} from 'react';

function usePrevious(value) {
	var ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
export default usePrevious;