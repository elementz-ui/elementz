import React, {useContext} from 'react';
import { filterProps, classNames } from '../Functions/Functions';
import "./../Style/Loading.scss";
import PropTypes from 'prop-types';

const LoadingContext = React.createContext(null);

const Loading = React.forwardRef((props, ref) => {
	var isLoading = (props.isLoading || props.loading || props.isFetching || props.fetching);
	isLoading =
		(!props.hasOwnProperty('isLoading') &&
			!props.hasOwnProperty('loading') &&
			!props.hasOwnProperty('isFetching') &&
			!props.hasOwnProperty('fetching'))
			? true : isLoading;

	const className = classNames('loading-elementz',
		'le-circle',
		props.className,
		props.size,
		{
			'absolute': props.absolute || props.center,
			'sm': props.sm || props.small,
			'md': props.md || props.medium,
			'lg': props.lg || props.large,
			'xl': props.xl || props.xlarge,
			'primary': props.primary,
			'secondary': props.secondary,
			'danger': props.danger,
			'warning': props.warning,
			'success': props.success,
			'info': props.info
		}
	);

	return isLoading ?
		<div className={className} ref={ref}></div>
		: props.children || null;
});

//eslint-disable-next-line
Loading.Skeleton = function (props) {
	const isLoading = props.isLoading || props.loading || props.isFetching || props.fetching;
	const className = classNames('loading-elementz', 'le-content', props.className);

	return isLoading ? (
		<LoadingContext.Provider value={isLoading}>
			<div className={className}>
				{props.children}
			</div>
		</LoadingContext.Provider>
	) : props.children;
}

//eslint-disable-next-line
Loading.Skeleton.Custom = Loading.Skeleton.Skelet = function (props) {
	//eslint-disable-next-line
	const isLoading = useContext(LoadingContext);
	const className = classNames('ez-skelet', {
		'circle': props.circle,
		'rounded': props.rounded,

	}, props.className);

	return isLoading ? (
		<div className={className}>
			{props.children}
		</div>
	) : props.children;
}

Loading.propTypes = {

	/**
	 * Loading State
	 */
	isLoading: PropTypes.bool,

	/**
	 * Show children if not loading
	 */
	children: PropTypes.any,

	/** Position on absolute center */
	center: PropTypes.bool,

	/** Small Size */
	sm: PropTypes.bool,

	/** Medium Size */
	md: PropTypes.bool,

	/** Large Size */
	lg: PropTypes.bool,

	/** Extra Large Size */
	xl: PropTypes.bool,

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

}

export default Loading;