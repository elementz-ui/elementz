
import React from 'react';
import { classNames, filterProps } from '../Functions/Functions';
import '../Assets/zwicon.min.css';

function Icon(props) {
	const passProps = filterProps(props, ['name', 'className','bold']);
	const className = classNames(`zwicon-${props.name}`, props.className, {
		'icon-bold': props.bold
	});

	return props.name ? (
		<i {...passProps} className={className}/>
	) : null;
}

export default Icon;