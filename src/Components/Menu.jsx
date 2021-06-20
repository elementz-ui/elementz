
import React, { useState, useCallback, useEffect, useRef,useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { filterProps, classNames } from '../Functions/Functions';
import Icon from './Icon';
import "./../Style/Menu.scss";

function Menu(props) {
	const className = classNames('ez-menu', props.className, {
		'no-shadow': props.noShadow,
		'no-border': props.noBorder,
		'sm': props.sm || props.small,
		'md': props.md || props.medium,
		'lg': props.lg || props.large,
		'xl': props.xl || props.xlarge,
		'auto': props.auto,
	});

	const passProps = filterProps(props, ['className']);
	
	return (
		<div {...passProps} className={className}>
			<ul>
				
				{props.children}
			</ul>
		</div>
	)
}
//eslint-disable-next-line
Menu.Item = function (props) {
	const passProps = filterProps(props, ['text']);
	const className = classNames('ez-menu-item', props.className);
	return (
		<li  {...passProps} className={className}>
			{
					(props.icon ?	<Icon name={props.icon}></Icon> : '')
			}
			{props.text}
			{props.children}
			
			
			
		</li>
	)
}

//eslint-disable-next-line
Menu.Divider = function(props) {
	return (
		<li className='divider'></li>
	)
}

export default Menu;