

import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import { classNames, filterProps, refHandler } from '../Functions/Functions';
import Icon from './Icon';
import "./../Style/Modal.scss";
import useController from '../Hooks/useController';
import useOutside from '../Hooks/useOutside';
import PropTypes from 'prop-types';

const Modal = React.forwardRef((props, ref) => {
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
			'transparent': props.transparent,
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
			ref={refHandler(element, ref)}
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
	,document.body): null;
});


Modal.propTypes = {
	/**
	 * Center Vertically
	 */
	center: PropTypes.bool,

	/**
	 * No container for modal body
	 */
	transparent: PropTypes.bool,

	/**
	 * Zero background overlay transparency, looks like another Page
	 */
	overlay: PropTypes.bool,

	/**
	 * No box shadow
	 */

	noShadow: PropTypes.bool,

	/**
	 * No border
	 */

	noBorder: PropTypes.bool,

	/** Small Size */
	sm: PropTypes.bool,

	/** Medium Size */
	md: PropTypes.bool,

	/** Large Size */
	lg: PropTypes.bool,

	/** Extra Large Size */
	xl: PropTypes.bool,

	
}
export default Modal;