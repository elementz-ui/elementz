import React,{useEffect, useRef} from 'react';


function useScript(src, is_async = true) {
	const scriptRef = useRef(null);

	useEffect(()=>{
	
		const script = document.createElement('script');
		script.src = src;
		script.async = is_async;
		document.body.appendChild(script);
		scriptRef.current = script;
		return () => {
			try{
				document.body.removeChild(script);
			}
			catch(err){}
		}
	},[src]);

	return scriptRef;
}

export default useScript;