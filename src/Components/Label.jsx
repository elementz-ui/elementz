import React from 'react';
import { classNames, filterProps } from '../Functions/Functions';
import "./../Style/Group.scss";
import PropTypes from 'prop-types';
import '../Style/Label.scss';

function Label(props) {

	const label = props.label && (
		<label>{props.label}</label>
	),
		description = props.description && (
			<small>{props.description}</small>
		);
	
	
	const className = classNames(
		'ez-input-labeled',
		props.className,
		{
			'full': props.full,
			'mb-15': props.mb,
			'mt-15': props.mt,
			'sm': props.sm,
			'md': props.md,
			'lg': props.lg,
			'xl': props.xl
		}
	);

	return (
		<div className={className}>
			{label}
			{props.children}
			{description}
		</div>
	);
}


export default Label;
