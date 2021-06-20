
import React from 'react';
import { classNames, filterProps } from '../Functions/Functions';
import "./../Style/Dropdown.scss";
import PropTypes, { element } from 'prop-types';

class Dropdown extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			right: this.props.right,
			top: this.props.top,
			active: (this.props.hasOwnProperty('defaultActive') ? this.props.defaultActive : false),
			right: null
		}
		this.lastTop = React.createRef(false);

		this.isControlled = this.props.hasOwnProperty('active');

		this.forwardChange = ((active, e) => {
			if(typeof this.props.onChange === "function") {
				return this.props.onChange(active, e) !== false;
			}
			return true;
		}).bind(this);

		this.setMain = ((e) => {
			this.main = e;
		}).bind(this);

		this.setBody = ((e) => {
			this.body = e;
		}).bind(this);

		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.checkOffset = this.checkOffset.bind(this);
		this.setActive = (function (active) {
			return this.isControlled ?
				typeof this.props.setActive === "function" ? this.props.setActive(active) : () => (null) : this.setState({
					active: active
				});
		}).bind(this);
	}

	get active() {
		return this.isControlled ?
			this.props.active : this.state.active;
	}

	

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
		document.addEventListener('resize', this.handleResize);
		if(this.state.right === null) {
			this.handleResize();
		}
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		document.removeEventListener('resize', this.handleResize);
	}

	checkOffset(e) {
		if(!this.body) {
			return false;
		}

		var elementSize = this.body.getBoundingClientRect();
		var viewportHeight = window.document.documentElement.clientHeight;

		var offset = {
			top: elementSize.top,
			bottom: viewportHeight - elementSize.bottom,
		};

		this.setState({
			right: this.props.right || (this.body.scrollWidth > this.body.clientWidth),
			top: this.props.top || (offset.bottom < 25 && offset.top > offset.bottom)
		});
	}

	handleResize(e) {
		this.checkOffset()
	}

	handleClickOutside(e) {
		if(this.main && !this.main.contains(e.target)) {
			if(typeof this.props.onOutsideClick === "function") {
				return this.props.onOutsideClick(e);
			}
			if(this.forwardChange(false)) {
				this.setActive(false);
			}
			
		}
	}

	render() {
		var className = classNames(
			'dropdown',
			{
				'open': this.active,
				'hover': this.props.hover,
				'left': this.props.left,
				'right': this.props.right || this.state.right,
				'top': (this.props.top || this.state.top || this.lastTop.current) && this.props.top !== false,
				'fullLeft': this.props.fullLeft,
				'noMobile': this.props.noMobile,
				'mobileLeft': this.props.mobileLeft,
				'mobileLarge': this.props.mobileLarge,
				'md': this.props.medium || this.props.md,
				'lg': this.props.large || this.props.lg,
				'xl': this.props.xl,
				'full': this.props.full,
			},
			this.props.className
		);
		

		var bodyClassName = classNames(
			'd-body',
			{
				'open': (this.active || this.props.hover),
			}
		);
		
		var passProps = filterProps(this.props,
			[
				'handle', 'className', 'hover', 'onOutsideClick', 'closeOnClick', 'ref',
				"md", "lg", "xl", "medium", "large",'left', 'defaultActive', 'setActive', 'active'
			]
		);

		this.lastTop.current = this.state.top;

		return (
			<div {...passProps}  ref={this.setMain} className={className}>
					<div
					className={classNames('d-handle',
						{
							'ez-dropdown-arrow': this.props.arrow && !this.state.top,
							'border': this.props.arrowBorder
						}
					)}
					onClick={((e) => {
						if(!this.props.disabled && !this.props.hover && this.forwardChange(!this.active)) {
							setTimeout((() => (this.checkOffset())).bind(this), 70);
							this.setActive(!this.active)
						}
					}).bind(this)}
							
					>
					{this.props.handle}
				</div>
				<div ref={this.setBody} className={bodyClassName}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

Dropdown.propTypes = {
	/** state | Controlled is active */
	active: PropTypes.bool,

	/** Call setActive onChange */
	setActive: PropTypes.func,

	/** Uncontrolled Initial Value */
	defaultActive: PropTypes.bool,

	/** onChange Handler `(active,e) => ()` | return `false` to prevent default*/
	onChange: PropTypes.func,

	/** The trigger for dropdown */
	handle: PropTypes.node,

	/** The dropdown body */
	children: PropTypes.node,

	/** Show dropdown on hover (Uncontrolled) */
	hover: PropTypes.bool,

	/** Open dropdown from Top, this is automatically set when there is no space */
	top: PropTypes.bool,

	/** Position dropdown on Bottom Left or Top Left */
	left: PropTypes.bool,

	/** Position dropdown on Bottom Right or Top Right */
	right: PropTypes.bool,

	/** Show dropdown on left when on mobile */
	mobileLeft: PropTypes.bool,

	/** Show arrow */
	arrow: PropTypes.bool,

	/** Show arrow border */
	arrowBorder: PropTypes.bool,

	/** onOutsideClick Listener */
	onOutsideClick: PropTypes.func,

	/**Add className to dropdown body container */
	bodyClassName: PropTypes.string,

	/** Small Size */
	sm: PropTypes.bool,

	/** Medium Size */
	md: PropTypes.bool,

	/** Large Size */
	lg: PropTypes.bool,

	/** Extra Large Size */
	xl: PropTypes.bool,

	/** Full Width Trigger */
	full: PropTypes.bool

}
export default Dropdown;