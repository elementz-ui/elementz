
import React from 'react';
import { filterProps, classNames } from '../Functions/Functions';
import "./../Style/Box.scss";




function Box(props) {
	
	const head = props.head || props.header;
	const body = props.body || props.children;
	const footer = props.footer;

	const className = classNames(
		"ez-box",
		{
			"ez-outside-header": props.title,
			"ez-box-full": !(props.auto || props.noFull),
			"center": props.center,
			"circle": props.circle,
			'sm': props.sm || props.small,
			'md': props.md || props.medium,
			'lg': props.lg || props.large,
			'xl': props.xl || props.xlarge,
			'auto': props.auto,
			'no-shadow': props.noShadow,
			'no-border': props.noBorder
		},
		props.className
	);

	const bodyClassName = classNames(
		"ez-box-body",
		props.bodyClassName,
		{
			"p-0": props.noBodyPad || props.noPad || props.noPadding
		}
	)

	const headerClassName = classNames(
		"ez-box-head",
		props.headerClassName || props.headClassName,
		{
			"p-0": props.noHeadPad || props.noPad
		}
	)

	return (
		<div className={className}>
			{head ?
				<div className={headerClassName}>{head}</div>
				: null
			}
			<div className={bodyClassName}>{body}</div>
			{footer ?
				<div className="ez-box-footer">{footer}</div>
				: null
			}
		</div>

	);
}

export default Box;