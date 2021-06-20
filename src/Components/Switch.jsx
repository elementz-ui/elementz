
import React, { useState, useEffect} from 'react';
import { classNames, filterProps, forwardClick, mainClasses } from '../Functions/Functions';
import useController from '../Hooks/useController';
import "../Style/Switch.scss";
import PropTypes from 'prop-types';

function Switch(props) {
	
	const [controller, setController, isControlled] = useController(props, 'checked', false);
	
	const forwardChange = (e) => (
		typeof props.onChange === "function" ? (props.onChange(e) !== false) : true
	);

	const handleClick =(e) => {
		if(props.disabled) {
			return false;
		}
		if(typeof props.onClick === "function") {
			var res = props.onClick(e, controller);
			if(res === false) {
				return false;
			}
		}

		if(forwardChange(!controller)) {
			setController(!controller);
		}
	}

	const className = classNames(
		"ez-switch",
		props.className,
		{
			...mainClasses(props),
			'active': controller
		}
	);

	const passProps = filterProps(props,["defaultChecked", "setChecked","on","off", "name", 'onChange']);

	return (
		<div {...passProps}
			onClick={handleClick}
			className={className} >
			<div className='ez-switch-text'>{
				(controller ? props.on : props.off) || null
			}</div>
			<div className='ez-switch-track'></div>
			<input className='invisible' type="checkbox" readOnly name={props.name} value={props.value} checked={controller} />
		</div>
	);
		
}


Switch.propTypes = {
	/** Input `name` to pass on the native checkbox, useful for Form Submits */
	name: PropTypes.string,

	/** Input `value` to pass on the native checkbox */
	value: PropTypes.string,

	/** state | Controlled get checked */
	checked: PropTypes.bool,

	/** setState | Controlled set checked */
	setChecked: PropTypes.func,

	/** Uncontrolled Initial State */
	defaultChecked: PropTypes.bool,

	/**  onChange Handler `(checked, e) => ()` | return `false` to prevent default */
	onChange: PropTypes.func,

	/** onClick listener => (e, isChecked) */
	onClick: PropTypes.func,
	
	/** Text to show when checked */
	on: PropTypes.string,

	/** Text to show when unchecked */
	off: PropTypes.string,

	/** Use primary theme colors */
	primary: PropTypes.bool,

	/** Use secondary theme colors */
	secondary: PropTypes.bool,

	/** Use warning theme colors */
	warning: PropTypes.bool,

	/** Use danger theme colors */
	danger: PropTypes.bool,

	/** Use info theme colors */
	info: PropTypes.bool,

	/** Use success theme colors */
	success: PropTypes.bool,

	/** Loading */
	loading: PropTypes.bool,

	/** Disabled */
	disabled: PropTypes.bool,

	/** Small Size */
	sm: PropTypes.bool,

	/** Medium Size */
	md: PropTypes.bool,

	/** Large Size */
	lg: PropTypes.bool,

	/** Extra Large Size */
	xl: PropTypes.bool,

	/** Flexible 100% Width */
	full: PropTypes.bool,
}

export default Switch;