import React, { useContext, useState, useMemo, useEffect} from 'react';
import { classNames, filterProps, mainClasses } from '../Functions/Functions';
import '../Style/Textarea.scss';

function Textarea(props) {
	const passProps = filterProps(props);

	const className = classNames(
		"ez-textarea",
		props.className,
		mainClasses(props)
	);

	return (
		<textarea {...passProps} className={className} >
			{props.children}
		</textarea>
	);
		
}

export default Textarea;