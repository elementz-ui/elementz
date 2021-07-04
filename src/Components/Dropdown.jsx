
import React, { useRef, useEffect, useState } from 'react';
import { classNames, filterProps, refHandler } from '../Functions/Functions';
import "./../Style/Dropdown.scss";
import PropTypes, { element } from 'prop-types';
import { useMultiState } from '../Elementz';
import useController from '../Hooks/useController';

const Dropdown = React.forwardRef((props, ref) => {
	
	const [position, setPosition] = useMultiState({
		top: props.top,
		right: null
	});

	const [active, setActive, isControlled] = useController(
		props,
		"active",
		props.defaultActive,
		"onChange"
	);

	const lastTop = useRef(false),
		body = useRef(false),
		main = useRef(false);

	const checkOffset = (e) => {
		if(!body.current) {
			return false;
		}

		var elementSize = body.current.getBoundingClientRect();
		var viewportHeight = window.document.documentElement.clientHeight;

		var offset = {
			top: elementSize.top,
			bottom: viewportHeight - elementSize.bottom,
		};

		setPosition({
			right: props.right || body.current.scrollWidth > body.current.clientWidth,
			top: props.top || (offset.bottom < 25 && offset.top > offset.bottom)
		});
	}

	const handleResize = (e) => (
		checkOffset()
	);

	const handleClickOutside = (e) => {
		if(main.current && !main.current.contains(e.target)) {
			if(typeof props.onOutsideClick === "function") {
				return props.onOutsideClick(e);
			}
			setActive(false);	
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('resize', handleResize);
		}
	}, []);

	const className = classNames(
		'dropdown',
		{
			'open': active,
			'hover': props.hover,
			'left': props.left,
			'right': props.right || position.right,
			'top': (props.top || position.top || lastTop.current) && props.top !== false,
			'fullLeft': props.fullLeft,
			'noMobile': props.noMobile,
			'mobileLeft': props.mobileLeft,
			'mobileLarge': props.mobileLarge,
			'md': props.medium || props.md,
			'lg': props.large || props.lg,
			'xl': props.xl,
			'full': props.full,
		},
		props.className
	);
	

	const bodyClassName = classNames(
		'd-body',
		{
			'open': (active || props.hover),
		}
	);
	
	const passProps = filterProps(props,
		[
			'handle', 'className', 'hover', 'onOutsideClick', 'closeOnClick', 'ref',
			"md", "lg", "xl", "medium", "large", 'left', 'defaultActive', 'setActive', 'active'
		]
	);

	lastTop.current = position.top;

	return (
		<div {...passProps} ref={main} className={className}>
			<div
				className={classNames('d-handle',
					{
						'ez-dropdown-arrow': props.arrow && !position.top,
						'border': props.arrowBorder
					}
				)}
				onClick={(e) => {
					if(!props.disabled && !props.hover) {
						setTimeout(() => (checkOffset()), 70);
						setActive(!active)
					}
				}}
						
			>
				{props.handle || props.handler || props.action || props.button}
			</div>
			<div ref={refHandler(body, ref)} className={bodyClassName}>
				{props.children}
			</div>
		</div>
	);
});

Dropdown.propTypes = {
	/** state | Controlled is active */
	active: PropTypes.bool,

	/** Call setActive onChange */
	setActive: PropTypes.func,

	/** Uncontrolled Initial Value */
	defaultActive: PropTypes.bool,

	/** onChange Handler `(active,e) => ()` | return `false` to prevent default*/
	onChange: PropTypes.func,

	/** The trigger for dropdown */
	handle: PropTypes.node,

	/** The dropdown body */
	children: PropTypes.node,

	/** Show dropdown on hover (Uncontrolled) */
	hover: PropTypes.bool,

	/** Open dropdown from Top, this is automatically set when there is no space */
	top: PropTypes.bool,

	/** Position dropdown on Bottom Left or Top Left */
	left: PropTypes.bool,

	/** Position dropdown on Bottom Right or Top Right */
	right: PropTypes.bool,

	/** Show dropdown on left when on mobile */
	mobileLeft: PropTypes.bool,

	/** Show arrow */
	arrow: PropTypes.bool,

	/** Show arrow border */
	arrowBorder: PropTypes.bool,

	/** onOutsideClick Listener */
	onOutsideClick: PropTypes.func,

	/**Add className to dropdown body container */
	bodyClassName: PropTypes.string,

	/** Small Size */
	sm: PropTypes.bool,

	/** Medium Size */
	md: PropTypes.bool,

	/** Large Size */
	lg: PropTypes.bool,

	/** Extra Large Size */
	xl: PropTypes.bool,

	/** Full Width Trigger */
	full: PropTypes.bool

}
export default Dropdown;