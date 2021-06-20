import { func } from 'prop-types';
import React from 'react';
import { classNames, filterProps, isValidEffect } from '../Functions/Functions';
import "./../Style/Group.scss";
import PropTypes from 'prop-types';

function Group(props) {
	const className = classNames('ez-input-group', props.className, {
		'space': props.space,
		'vertical': props.vertical,
		'flex-end': props.end,
		'flex-start': props.start,
		'full': props.full,
		'nw': props.nw || props.noWrap,
		'ns': props.ns || props.noStretch
	});

	const passProps = filterProps(props, ['sapce', 'vertical','end','start','full']);
	return (
		<div {...passProps} className={className}>
			{props.children}
		</div>
	)
}

//eslint-disable-next-line
Group.Item = function(props){
	const className = classNames('ez-group-item', props.className, {
		'flex': props.flex,
		'center': props.center,
		'vertical': props.vertical,
		'start': props.start,
		'end': props.end,
		'full': props.full,
		'between': props.between,
		'nw': props.nw || props.noWrap,
	});
	const passProps = filterProps(props, ['center', 'flex', 'between', 'vertical', 'end', 'start', 'full', 'nw']);
	
	return (
		<div {...passProps} className={className}>
			{props.children}
		</div>
	)
}

Group.propTypes = {
	/** 
	 * Spaced items
	 */
	space: PropTypes.bool,

	/** 
	 * Vertical items 
	 */
	vertical: PropTypes.bool,

	/**
	 * Align content on left/flex-start
	 */
	start: PropTypes.bool,

	/**
	 * Align content on right/flex-end
	 */
	end: PropTypes.bool,

	/**
	 * Flexible 100% Width group
	 */
	full: PropTypes.bool,

	/**
	 * Don't stretch items to match same height
	 */
	noStretch: PropTypes.bool,

	/**
	 * Don't wrap items
	 */
	noWrap: PropTypes.bool
}

export default Group;