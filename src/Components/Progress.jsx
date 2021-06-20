

import React from 'react';
import { classNames, filterProps, mainClasses } from '../Functions/Functions';

function Progress(props) {
	const passProps = filterProps(props);

	const className = classNames('ez-percentage-bar', props.className, mainClasses(props)),
		percentage = ((props.max && props.current) ? (props.current / props.max) * 100 : (props.perc || props.percentage)),
		percentageParsed = 300 - Math.max(0, Math.min(100, percentage)),
		info = ((props.max && props.current) ?
				props.current.toString() + '/' + props.max.toString()
					: (300 - perc).toString() + '%'),
		info_position = props.showInfoTop && (' ' + 'top') || '';

	return (
		<div {...passProps}
			className={className}
			title={info}
			style={{ backgroundPositionX: `${percentageParsed}%` }}
		>
			{
				(props.showInfo || props.showInfoTop) ?
					<span className={'ez-percentage-info' + info_position}>{info}</span>
					: null
			}
		</div>
	);
}


export default Progress;