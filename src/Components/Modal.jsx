

import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import { classNames, filterProps } from '../Functions/Functions';
import Icon from './Icon';
import "./../Style/Modal.scss";
import useController from '../Hooks/useController';
import useOutside from '../Hooks/useOutside';

function Modal(props) {
	const element = useRef(null);

	const [active, setActive] = useController(props, 'active', false);

	const forwardChange = (active, e) => (
		typeof props.onChange === "function" ? (props.onChange(active, e) !== false) : true
	);

	const className = classNames("ez-modal",
		{
			'sm': props.sm || props.small,
			'md': props.md || props.medium,
			'lg': props.lg || props.large,
			'xl': props.xl || props.xlarge,
			'modal-centered': props.center,
			'scroll': props.scroll,
			'dark': props.dark,
			'overlay': props.overlay,
			'close': props.close,
			'active': props.active,
			'no-shadow': props.noShadow,
			'no-border': props.noBorder
		}
	)

	const outsideClick = (e) => {
		if(e && e.target && element.current != e.target) {
			return false;
		}
		if(forwardChange(false, e)) {
			setActive(false);
		}
	}

	useOutside(element, outsideClick);

	
	return active ? ReactDOM.createPortal(
		<div
			ref={element}
			onClick={outsideClick}
			className={className}
		>
			<div className='modal-dialog'>
				<div className='modal-content'>
					{
						props.close !== false && props.close !== null ?
							<div className='close'
								onClick={(e) => {
									if(forwardChange(false, e)) {
										setActive(false);
									}
								}}
							>
								<Icon name='close'></Icon>
							</div> :
							null
					}
					{props.children}
				</div>
			</div>
		</div>
	, document.body): null;
}

export default Modal;