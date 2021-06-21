import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import useComponentWillMount from './useComponentWillMount';
import getHistory from './getHistory';

/**
 * A simple, robust React router hook with middleware capabilites.
 * Accepts a JSON-like schema of routes, returns the current route state key
 * Usage: 
 * {
 * 		"login": {
 * 			"path": "/login",
 * 			"middleware": function(route, state){  //Can also be an Array of middlewares
 * 				if(isAlreadyLogged){
 * 					return "dashboard";  //Can also specify redirection options such as method & state, i.e ["dashboard","push",{myState: "value"}]
 * 				}
 * 				return false; //Returning nothing will do nothing
 * 			}
 * 		},
 * 		
 * 		"dashboard": {
 * 			"path": "/dashboard",
 * 			"exact": true
 * 		}
 * }
 * @param {Object} routes 
 * @param {string} defaultRoute 
 * @returns [activeRoute, setActiveRoute, Page]
 */


const RouterContext = React.createContext(null);

function RouterProvider(props) {
	const history = getHistory();

	return (
		<RouterContext.Provider value={
			{
				history
			}
		}>
			{props.children}
		</RouterContext.Provider>
	);
}

function useHistory() {
	const { history } = useContext(RouterContext);
	return history;
}

function useRouter(routes: Map<String,{
		path: String;
		exact?: Boolean;
		component?: Function | null;
		middleware?: Function | Array<[Function]>;
	}>, defaultRoute?: String | Boolean): Array<[String, Function, Function]> {
	
	const { history } = useContext(RouterContext);

	if (!history) {
		throw new Error("You should add the RouterProvider at the root of your application");
	}

	const historyChange= useRef(null);

	const lastRoute = useRef(null);

	const routeMiddleware = function (name, route, state = null) {
		if(!route || !route.middleware) {
			return [false];
		}
		var middlewares = Array.isArray(route.middleware) ? route.middleware : [route.middleware];
		state = state || history.location.state;
		for(var mware of middlewares) {
			var middlewarePage = mware(name, state);
			if(middlewarePage) {
				return Array.isArray(middlewarePage) ? middlewarePage : [middlewarePage];
			}
		}
		return [false];
	}

	const runRouteMiddleware = function (name, route, historyMethod, historyState) {
		var [nextPage, getHistoryMethod, getHistoryState] = routeMiddleware(name, route, routes);
			
		var isValidHistoryMethod = ["push", "replace"].includes(getHistoryMethod);
		historyState = getHistoryState === undefined && getHistoryMethod && !isValidHistoryMethod ? getHistoryMethod : (getHistoryState || historyState);
		historyMethod = getHistoryMethod !== undefined && isValidHistoryMethod ? getHistoryMethod : historyMethod;

		return [nextPage, historyMethod, historyState];
	}

	const matchRoute = function (route, path?) {
		//var path = history.location.pathname;
		//var namedParameters = path.replace(/\{[a-zA-Z0-9]\}/g,)
		//return route.exact === route.path) : (history.location.pathname.indexOf(route.path) === 0)
		var path = path || history.location.pathname;
		return route.exact ? (path === route.path) : (path.indexOf(route.path) === 0)
	}

	const routeRedirect = function (name, route, historyMethod = "push", historyState = null) {
		var nextPage;
		
		if(!route) {
			return undefined;
		}

		var isMatch = matchRoute(route);

		if(route.middleware) {
			[nextPage, historyMethod, historyState] = runRouteMiddleware(name, route, historyMethod, historyState);
		}

		if(!nextPage && !isMatch) {
			return history[historyMethod](route.path, historyState);
		}

		if(routes[nextPage] && nextPage !== activePage) {
			setActivePage([nextPage, historyMethod, historyState]);
		}
	}
	
	const [currentRoute, isDefaultRoute]: Array<any> = useMemo(() => {
		var path = history.location.pathname;
		for (var key in routes) {
			var route = routes[key];
			var isMatch = route.exact ? (path === route.path) : (path.indexOf(route.path) === 0)
			if (isMatch) {
				return [key, false];
			}
		}

		var defaultMatch = (defaultRoute === true ? Object.keys(routes)[0] : defaultRoute);

		return [defaultMatch, true];
	}, [history.location.pathname]);

	const [activePage, setActivePage] = useState<String | any[]>(currentRoute);

	//Run Once Before Render
	useComponentWillMount(() => (
		routeRedirect(currentRoute, routes[currentRoute])
	));
	
	
	//Update state on location change
	useEffect(() => {
		if (isDefaultRoute) {
			return undefined;
		}
		
		if (history.location.pathname !== routes[currentRoute].path) {
			return undefined;
		} 

		const [hasRedirection, redirectionMethod, redirectionState] = runRouteMiddleware(currentRoute, routes[currentRoute], 'push', {
			lastRoute: lastRoute.current
		});


		if (!hasRedirection) {
			//console.log("Changing route state", history.location.pathname, currentRoute, routes);
			setActivePage([currentRoute, 'push', false]);
			historyChange.current = true;
		}
		
		if (hasRedirection && routes[hasRedirection]) {
			//console.log("Setting history", routes[hasRedirection].path)
			history[redirectionMethod](routes[hasRedirection].path, redirectionState);
		}
		
	}, [currentRoute, isDefaultRoute]);

	//Update location on state change
	useEffect(() => {
		if (historyChange.current) {
			//console.log("History changed");
			historyChange.current = false;
		} else {
			var [name, historyMethod, historyState] = Array.isArray(activePage) ? [activePage[0], activePage[1], activePage[2]] : [activePage];
			//console.log(activePage, [name, historyMethod, historyState])
			routeRedirect(name, routes[name], historyMethod, historyState);
		}

		lastRoute.current = name;
	}, [activePage, routes]);

	

	const activeRoute = Array.isArray(activePage) ? activePage[0] : activePage;
	const activeComponent = routes[activeRoute] && routes[activeRoute].component ? routes[activeRoute].component : null;
	const previusRoute = lastRoute.current;

	return [activeRoute, setActivePage, activeComponent, previusRoute];
}

export {
	RouterProvider,
	useHistory,
	useRouter
}