
import React, {useState, useEffect} from 'react';
import { filterProps, classNames, isValidEffect, debounce } from '../Functions/Functions';
import Icon from './Icon';
import "./../Style/Button.scss";
import Group from './Group';
import PropTypes from 'prop-types';

function Button(props) {
	
	const [active, setActive] = useState(null);

	const effect = isValidEffect(props.effect);

	const icon = (props.icon || props.iconRight);

	const setEffect = () => {
		setActive(false);
		setTimeout(() => (setActive(true)), 100);
	}



	const classes = {
		'hasIcon': icon && (props.children || props.value),
		'noValue': !props.children && !props.value,
		'primary': props.primary,
		'secondary': props.secondary,
		'danger': props.danger,
		'info': props.info,
		'success': props.success,
		'warning': props.warning,
		'transparent': props.transparent,
		'reverse': props.reverse || props.cancel,
		'gradient': props.gradient,
		'rainbow': props.rainbow,
		'rounded': props.rounded,
		'simple': props.simple,
		'iconRight': props.iconRight,
		'ez-circle': props.circle,
		'loading': props.loading,
		'sm': props.sm || props.small,
		'md': props.md || props.medium,
		'lg': props.lg || props.large,
		'xl': props.xl || props.xlarge,
		'noMobile': props.noMobile,
		'animate': active,
		'active': props.active,
		'auto': props.auto || props.full,
		'box-shadow': props.boxShadow
	};

	

	const className = classNames("ez-button", classes, props.size, props.className, effect);


	const passProps = filterProps(props, [
		...Object.keys(classes),
	]);

	return (
		<button {...passProps} type={props.type || 'button'} className={className} onClick={(e) => {
			if(props.disabled || props.loading) {
				e.preventDefault();
				return false;
			}
			setEffect();
			if(typeof props.onClick === "function") {
				return props.onClick(e);
			}
		}}>
			{
				(icon ?	<Icon className={props.iconClassName} name={icon}></Icon> : '')
			}
			{props.value || props.children} 
			{
				(props.count ? <span className='count'>{props.count}</span> : '')
			}
		</button>
	);
}


Button.propTypes = {
	/** Left icon name */
	icon: PropTypes.string,

	/** Right icon name */
	iconRight: PropTypes.string,
	
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

	/** Use reverse theme style, can be combined with theme colors */
	reverse: PropTypes.bool,

	/** Use gradient theme style, can be combined with theme colors */
	gradient: PropTypes.bool,
	
	/** Rainbow theme style */
	rainbow: PropTypes.bool,

	/** Simple button without borders and colors */
	simple: PropTypes.bool,

	/** Circle button, only icons look best */
	circle: PropTypes.bool,

	/** Extra rounded button */
	rounded: PropTypes.bool,

	/** Loading */
	loading: PropTypes.bool,

	/** Disabled */
	disabled: PropTypes.bool,

	/** Hover effects */
	effect: PropTypes.oneOf([
		'grow',
		'grow-rotate',
		'shrink',
		'pulse',
		'bounce',
		'float',
		'hang',
		'buzz',
		'icon-backward',
		'icon-forward',
		'icon-down',
		'icon-up',
		'icon-rotate',
		'icon-buzz',
		'icon-float'
	]),

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

	/** Show box shadow */
	boxShadow: PropTypes.bool,

	/**
	 * By default, buttons are resized to smaller on mobile. You can disable this behavior.
	 */
	noMobile: PropTypes.bool,

}

Button.Group = Group;



export default Button;