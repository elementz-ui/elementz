import React, { useRef, useEffect, useState } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutside(ref,callback) {
	useEffect(() => {
        function handleClickOutside(event) {
			if(ref.current && !ref.current.contains(event.target)) {
				if(typeof callback === "function") {
					return callback(event);
				}
			}
			return false;
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
	}, [ref]);

	return true;
}

export default useOutside;