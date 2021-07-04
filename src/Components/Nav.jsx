
import React, { useContext, useMemo } from 'react';
import { filterProps, classNames } from '../Functions/Functions';
import Icon from './Icon';
import Dropdown from './Dropdown';
import Menu from './Menu';
import "./../Style/Nav.scss";
import useController from '../Hooks/useController';

export const NavContext = React.createContext(null);

function Nav(props) {
	const [active, setActive] = useController(props, 'active', 0);
	
	const forwardChange = (active, e) => (
		typeof props.onChange === "function" ? (props.onChange(active, e) !== false) : true
	);

	const className = classNames(
		"ez-nav",
		{
			'horizontal': props.horizontal,
		},
		props.className
	);
	const horizontal = props.horizontal;

	

	return (
	 
		<div className={className}>
			<NavContext.Provider value={{ active, setActive, horizontal, forwardChange }}>
				{props.children}
			</NavContext.Provider>
		</div>
	
	);
	
}
//eslint-disable-next-line
Nav.Item = function (props) {
	//eslint-disable-next-line
	const {active, setActive, horizontal, forwardChange} = useContext(NavContext);

	const nestedItems = React.Children.map(props.children, currentChild => {
		if(currentChild.type._isNavItem && currentChild.props && currentChild.props['id']) {
			return currentChild.props['id'];
		}
		return null;
	});
	
	const className = classNames(
		"ez-nav-item",
		props.className,
		{
			"active": active === props.id || (Array.isArray(nestedItems) && nestedItems.includes(active))
		}
	);

	
	const handleClick = function (e) {
		if (typeof props.onClick === "function"){
			if(props.onClick(e, props.id) === false) {
				return false;
			}
		}
		if(forwardChange(props.id, e)) {
			setActive(props.id);
		}
		
		return true;
	}

	const item = (
		<div className={className} >
			<div title={props.title} onClick={handleClick} className='nave-t'>
				{props.before}
				<span>{props.title || props.value}</span>
				{ props.icon ?
						<Icon name={props.icon}></Icon>
					: ''
				}
			</div>
			{horizontal ? null : props.children}
		</div>
	);

	return horizontal && props.children && props.children.length ? <Dropdown handle={item} hover>
		<Menu>
		{props.children}
		</Menu>
	</Dropdown> : item;
}

Nav.Item._isNavItem = true;

export default Nav;