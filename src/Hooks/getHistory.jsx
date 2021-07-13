import React, { useState, useEffect, useMemo } from 'react';
import useComponentWillMount from './useComponentWillMount';
import { createBrowserHistory as createHistory } from "history";


function getHistory() { // eslint-disable-line
	const history = useMemo(() => (createHistory()), []); // eslint-disable-line
	const [location, setLocation] = useState(typeof window !== undefined ? window.location : null); // eslint-disable-line

	// eslint-disable-next-line
	useEffect(() => {
		const unlisten = history.listen((location) => (
			setLocation(location)
		));

		return () => (unlisten());
	}, []);

	return history;
}

export default getHistory;