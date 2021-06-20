import React, { useRef,useEffect } from 'react';


const useComponentWillMount = (func) => {
    const willMount = useRef(true)
    var cleanup;

    if(willMount.current) {
        cleanup = func();
    }

    useEffect(() => {
        return cleanup;
    }, []);

    willMount.current = false
}

export default useComponentWillMount;