
import React from 'react';
import { classNames, filterProps } from '../Functions/Functions';
import '../Assets/zwicon.min.css';

const Icon = React.forwardRef((props, ref) => {
	const passProps = filterProps(props, ['name', 'className', 'bold']);
	const className = classNames(`zwicon-${props.name}`, props.className, {
		'icon-bold': props.bold
	});

	return props.name ? (
		<i {...passProps}
			className={className}
			ref={ref}
		/>
	) : null;
});

export default Icon;