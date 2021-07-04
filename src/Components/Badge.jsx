
import React, { useContext} from 'react';
import { classNames, filterProps } from '../Functions/Functions';
import '../Style/Badge.scss';
import Group from './Group';
import Icon from './Icon';
import PropTypes from 'prop-types';


const Badge = React.forwardRef((props, ref) => {
	const passProps = filterProps(props);

	const className = classNames("ez-badge", props.className, {
		'primary': props.primary,
		'secondary': props.secondary,
		'danger': props.danger,
		'success': props.success,
		'info': props.info,
		'warning': props.warning,
		'rounded': props.rounded,
		'ez-circle': props.circle,
		'sm': props.sm || props.small,
		'md': props.md || props.medium,
		'lg': props.lg || props.large,
		'xl': props.xl || props.xlarge,
		'auto': props.auto || props.full,
		'active': props.active,
		'disabled': props.disabled,
		'noValue': !props.children
	});

	return (
		<span
			{...passProps}
			className={className}
			ref={ref}
		
		>
			{props.children}
			{props.icon ? <Icon name={props.icon} /> : null}
		</span>
	);
});

Badge.propTypes = {
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
	
		/** Circle badge, only icons look best */
		circle: PropTypes.bool,
	
		/** Extra rounded badge */
		rounded: PropTypes.bool,
	
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
Badge.Group = Group;


export default Badge;