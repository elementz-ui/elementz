
import React, { useContext, useRef, useState} from 'react';
import { filterProps, classNames, forwardClick } from '../Functions/Functions';
import "./../Style/Radio.scss";
import useController from '../Hooks/useController';
import PropTypes from 'prop-types';

const RadioContext = React.createContext(null);


const Radio = React.forwardRef((props, ref) => {
	const { name } = props;
	const type = (props.type || "bar");
	const lastSelected = useRef(null);

	const defaultSelected = props.children && props.children.length ?
		(props.children[0].props.value || props.children[0].props.id || props.children[0].props.children) : void 0;

	const [active, setActive, isControlled] = useController(props, "selected", defaultSelected);

	const [direction, setDirection] = useState('');

	const forwardChange = (value, e) => (
		typeof props.onChange === "function" ? (props.onChange(value, e) !== false) : true
	);

	var className = classNames("ez-radio", `ez-radio-${type}`,
		props.className,
		direction,
		{
			'sm': props.sm || props.small,
			'md': props.md || props.medium,
			'lg': props.lg || props.large,
			'xl': props.xl || props.xlarge,
			'auto': props.auto || props.full,
			'primary': props.primary,
			'secondary': props.secondary,
			'danger': props.danger,
			'warning': props.warning,
			'success': props.success,
			'info': props.info,
			'space': props.space,
			'solid': props.solid
		}
	);

	var passProps = filterProps(props, ["name", "defaultSelected", "setSelected", "solid", "space", "type"]);
	
	return (
		<RadioContext.Provider value={[active, setActive, name, lastSelected, setDirection, forwardChange]}>
			<div {...passProps}
				className={className}
				ref={ref}
			>
				{props.children}
			</div>
		</RadioContext.Provider>
	)
});

//eslint-disable-next-line
Radio.Item = function (props) {
	//eslint-disable-next-line
	const [active, setActive, name, lastSelected, setDirection, forwardChange] = useContext(RadioContext);
	const value = (props.value || props.id || props.children);
	const isActive = (value == active);
	const currentElement = useRef(null);

	const className = classNames("radio-item", props.className, {
		'active': isActive,
		'disabled': props.disabled
	});

	const handleClick = (e) => {
		if(props.disabled) {
			return false;
		}
		if(typeof props.onClick === "function") {
			var res = props.onClick(e, active);
			if(res === false) {
				return false;
			}
		}

		if(!isActive && forwardChange(value)) {
			setActive(value);
			if(lastSelected.current && currentElement.current) {
				var direction = lastSelected.current.offsetLeft > currentElement.current ? 'left' : 'right';
				setDirection(direction);
			}
			lastSelected.current = currentElement;
		}
	}

	const passProps = filterProps(props, ['onClick', 'defaultSelected', 'onChange']);
	
	return (
		<div {...passProps}
			onClick={handleClick}
			ref={currentElement}
			className={className}
		>
			{!isActive && props.placeholder ? props.placeholder : (props.children || props.value)}
			{name ?
				(
					<input className='invisible' type="radio" readOnly name={name} value={value} checked={isActive} />
				)
				: null
			}
		</div>
	);
}

//eslint-disable-next-line
Radio.Bar = function (props) {
	return (
		<Radio {...props} type="bar">
			{props.children}
		</Radio>
	);
}
//eslint-disable-next-line
Radio.Box = function (props) {
	return (
		<Radio {...props} type="box">
			{props.children}
		</Radio>
	);
}


Radio.Item.propTypes = {
	/** Item text to display */
	children: PropTypes.string,

	/** Item text placeholder */
	placeholder: PropTypes.string,

	/** Input `value` to pass on the radio item, useful for Form Submits */
	value: PropTypes.string,

	/** onClick listener => (e, activeItem) */
	onClick: PropTypes.func,
}

Radio.propTypes = {
	/** Input `name` to pass on the radio, useful for Form Submits */
	name: PropTypes.string,

	/** state | Controlled get selected */
	selected: PropTypes.bool,

	/** setState | Controlled set selcted */
	setSelected: PropTypes.func,

	/** Uncontrolled Initial State */
	defaultSelected: PropTypes.any,

	/**  onChange Handler `(selected, e) => ()` | return `false` to prevent default */
	onChange: PropTypes.func,

	/** Radio Items */
	children: PropTypes.node,

	/** Solid style */
	solid: PropTypes.bool,

	/** Use spaced style */
	space: PropTypes.bool,

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
	
	/** `children[Radio.Item]`: Item text to display */
	'Radio.Item > children': PropTypes.string,

	/** `children[Radio.Item]`: Text placeholder */
	'Radio.Item > placeholder': PropTypes.string,

	/** `children[Radio.Item]`: Input `value` to pass on the radio item, useful for Form Submits */
	'Radio.Item > value': PropTypes.string,

	/** `children[Radio.Item]`: onClick listener => (e, activeItem) */
	'Radio.Item > onClick': PropTypes.func,

}

export default Radio;