
import React from 'react';
import { classNames, filterProps } from '../Functions/Functions';
import '../Assets/flag-icon.min.css';


const Flag = React.forwardRef((props, ref) => {
	const country = (props.name || props.iso || props.country || props.code);
	
	if(!country) {
		return null;
	}

	const className = classNames('flag-icon', `flag-icon-${country.toLowerCase()}`, props.className, {
		'flag-icon-squared': props.squared
	});

	const passProps = filterProps(props, ['name', 'className', 'country', 'iso', 'code']);
	
	return (
		<span {...passProps} className={className} ref={ref} />
	);
});


export default Flag;