import React, { useContext, useState, useMemo, useEffect} from 'react';
import { classNames, filterProps, mainClasses } from '../Functions/Functions';
import '../Style/Textarea.scss';
import Label from './Label';

function Textarea(props) {
	const passProps = filterProps(props,['resize']);
	
	const hasLabel = (props.label || props.description);
	
	const className = classNames(
		"ez-textarea",
		props.className,
		mainClasses(props),
		{
			'no-resize': !props.resize,
			'vertical-resize': props.resize === 'vertical',
			'horizontal-resize': props.resize === 'horizontal'
		}
	);
	
	const textarea = (
		<textarea {...passProps} className={className} >
			{props.children}
		</textarea>
	);

	const labelContainer = hasLabel ? (
		<Label {...props} className={props.containerClassName}>
			{textarea}
		</Label>
	) : textarea;

	return labelContainer;
}

Textarea.defaultProps = {
	full: true,
	resize: true
};

export default Textarea;