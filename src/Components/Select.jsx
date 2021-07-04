
import React, { useContext, useState, useMemo, useEffect} from 'react';
import { classNames, filterProps, mainClasses } from '../Functions/Functions';
import useOutside from '../Hooks/useOutside';
import NiceSelect from 'react-select-me';
import Icon from './Icon';
import Loading from './Loading';
import useController from '../Hooks/useController';


const Select = React.forwardRef((props, ref) => {
	const passProps = filterProps(props);

	const className = classNames(
		"ez-input",
		props.className,
		mainClasses(props)
	);

	return (
		<select {...passProps} className={className} ref={ref} >
			{props.children}
		</select>
	);
});

//eslint-disable-next-line
Select.Nice = function (props) {
	
	const [searching, setSearching] = useState(false);

	const placeholder = props.placeholder || "Choose an option";

	const { options, selected, disabled, hidden } = useMemo(() => {
		
		const disabled = [],
		selected = [],
		hidden = [];
		
		let options = [
			...(props.options && Array.isArray(props.options) ? props.options : []),
			...(
				props.children && Array.isArray(props.children) ?
					React.Children.map(props.children, (child) => {
						const isAllowedChild = (typeof child.type === "string" && child.type === "option") ||
							child.type._isSelectOption;

						if(!isAllowedChild) {
							return undefined;
						}

						const values = {
							value: child.props.hasOwnProperty('value') ? child.props.value : child.props.children,
							label: child.props.children
						};
				
						if(child.props.selected) {
							selected.push(values.value);
						}

						if(child.props.disabled) {
							disabled.push(values.value);
						}

						if(child.props.hidden) {
							hidden.push(values.value);
						}

						return values;
					
					}) : []
			)
		];

		if(searching && props.searchable) {
			options = options.filter(v => ~v.label.toLowerCase().indexOf(searching));
		}

		return {
			options,
			selected,
			disabled,
			hidden
		};

	},[props.children, props.options, props.searchable, searching]);

	const [value, setValue, isControlled] = useController(props, "selected",
		!props.multiple && Array.isArray(selected) ?
			(selected.length ? selected[selected.length - 1] : undefined) :
		selected);
	

	const forwardChange = (e) => (
		typeof props.onChange === "function" ? (props.onChange(e) !== false) : true
	);

	const formatChange = (e) => {
		return (Array.isArray(e) ? (e.map((v) => (
			v.value
		))) : (e ? (e.value || e) : e));
	}
	
	const handleChange = (e) => {
		var updatedValue = formatChange(e);
		if(forwardChange(updatedValue)) {
			setValue(updatedValue)
		}
	};

	const handleAdd = (item) => {
		if(typeof props.onAdd === "function") {
			return props.onAdd(item, options);
		}
		if(props.multiple && Array.isArray(value) && ~value.indexOf(item)) {
			return false;
		}

		var updateValue = props.multiple ? [
			...(Array.isArray(value) ? value : []),
			item
		] : item;

		if(forwardChange(updateValue)) {
			setValue(updateValue);
		}
	}

	
	const handleOptionsRenderer = (option, selectedOptions) => (
		~hidden.indexOf(option.value) ? null : (
			<div className={
				classNames('ez-ns-option',
					{
						'ez-ns-selected-option': ~formatChange(selectedOptions).indexOf(option.value),
						'disabled': ~disabled.indexOf(options.value)
					}
				)
			}
			>
				{option.label}
			</div>
		)
	);

	const handleSearch = (searchString) => {
		if(typeof props.onSearch === "function") {
			return props.onSearch(searchString, options);
		}
		
		setSearching(searchString ? searchString.toLowerCase() : false);
	}

	const handleIconRenderer = (isOpened) => typeof props.iconRenderer === "function" ? props.iconRenderer(isOpened) : (
		props.loading ?
			<Loading className={classNames(mainClasses(props))} /> :
			(
				<Icon
					name={isOpened ? 'chevron-up' : 'chevron-down'}
					className='ez-ns-expand-icon'
					bold
				/>
			)
	)

	const optionRenderer = (option, selectedOptions) => (
		typeof props.optionRenderer === "function" ? 
			props.optionRenderer(option, selectedOptions, hidden, disabled) :
			handleOptionsRenderer(option, selectedOptions)
		);

	const className = classNames(
		'ez-nice-select',
		props.className,
		mainClasses(props)
	);


	return (
		<NiceSelect
			{...props}
			options={options}
			value={value}
			onChange={handleChange}
			onSearch={handleSearch}
			optionRenderer={optionRenderer}
			addNewItem={props.custom}
			onAddNewItem={handleAdd}
			placeholder={placeholder}
			iconRenderer={handleIconRenderer}
			s={{
				dd__wrapper: className,
				dd__multi: "ez-ns-multi",
				dd__single: "ez-ns-single",
				dd__opened: "ez-ns-opened",	
				dd__error: "danger",		
				dd__disabled: "disabled",		
				dd__selectControl: "ez-ns-select-wrapper",		
				dd__selected: "ez-ns-selected",			
				dd__placeholder: "ez-ns-placeholder",			
				dd__selectedItem: "ez-ns-item",			
				dd__crossIcon: "ez-ns-cross",			
				dd__list: "ez-ns-dropdown",			
				dd__listVirtualized: "ez-ns-virtualized",		
				dd__openTobottom: "ez-ns-bottom",		
				dd__openTotop: "ez-ns-top",
				dd__search: "ez-ns-search",
				dd__option: "ez-ns-option",	
				dd__optionDisabled: "disabled",	
				dd__optionVirtualized: "virtualized",
				dd__selectedOption: "ez-ns-selected-option"
			}}
		/>
	);
}

//eslint-disable-next-line
Select.Item = Select.Option = function (props) {
	return (
		<option value={props.value}>{props.children}</option>
	);
}

Select.Item._isSelectOption = Select.Option._isSelectOption = true;




export default Select;