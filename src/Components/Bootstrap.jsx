import { func } from 'prop-types';
import React, { useState } from 'react';
import { classNames, filterProps } from '../Functions/Functions';

function Row(props) {
	
	const passProps = filterProps(props);
	const className = classNames('row', props.className, {
		'center': props.center,
		'vertical': props.vertical,
		'start': props.start,
		'end': props.end,
		'nm': props.nm || props.noMargin,
		'nw': props.nw || props.noWrap,
	});

	return (
		<div {...passProps} className={className}>
			{props.children}
		</div>
	);
}

function Col(props) {
	const passProps = filterProps(props);

	const sizes = [...Array(12).keys()].reduce((o, v, i) => ({
		...o,
		['col-' + v]: props['c' + i],
		['col-sm-' + v]: props['sm' + i],
		['col-md-' + v]: props['md' + i],
		['col-lg-' + v]: props['lg' + i],
		['col-xl-' + v]: props['xl' + i]
	}), {});

	const className = classNames('col', sizes, props.className);

	return (
		<div className={className} style={props.style} onClick={props.onClick}>
			{props.children}
		</div>
	);
}

export { Row, Col };