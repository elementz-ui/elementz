
import React, { useContext, useState, useMemo, useEffect} from 'react';
import { classNames, filterProps, mainClasses } from '../Functions/Functions';
import useOutside from '../Hooks/useOutside';
import NiceSelect from 'react-select-me';
import Icon from './Icon';
import Loading from './Loading';
import useController from '../Hooks/useController';
import Label from './Label';


const Select = React.forwardRef((props, ref) => {
	const passProps = filterProps(props);

	const hasLabel = (props.label || props.description);

	const className = classNames(
		"ez-input",
		props.className,
		mainClasses(props),
	);

	const select = (
		<select {...passProps} className={className} ref={ref} >
			{props.children}
		</select>
	);

	const labelContainer = hasLabel ? (
		<Label {...props} className={props.containerClassName}>
			{select}
		</Label>
	) : select;

	return labelContainer;

});

//eslint-disable-next-line
Select.Nice = function (props) {
	
	const [searching, setSearching] = useState(false);

	const [addedOptions, setAddedOptions] = useState([]);
	
	const placeholder = props.placeholder || "Choose an option";

	const { options, selected, disabled, hidden, unfiltered } = useMemo(() => {
		
		const disabled = [],
			selected = [],
			hidden = [];
		
		let options = [
			...(props.options && Array.isArray(props.options) ? props.options : []),
			...(
				props.children ?
					React.Children.map(
						(Array.isArray(props.children) ? props.children : [props.children]),
						(child) => {
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
			),
			...addedOptions
		];
	
		const hasSearch = searching && (props.custom || props.searchable);

		let filtered = options.filter(
			(v) => {
				var option = v.label && v.value ? v : {
					label: v,
					value: v
				};

				var notMatchesSearch = hasSearch &&
					!~option.label.toLowerCase().indexOf(searching);

				var isHidden = option.hidden || ~hidden.indexOf(option.value);

				return !notMatchesSearch && !isHidden;
			}
		);
		
		filtered = hasSearch && filtered.length && props.custom && !options.find(v => v.value === searching) ? [
			{
				label: `Add '${searching}'`,
				value: `$add.____.${searching}`
			},
			...filtered
		] : filtered;

		return {
			options: filtered,
			selected,
			disabled,
			hidden,
			unfiltered: options
		};

	}, [addedOptions,
		props.children,
		props.options,
		props.searchable,
		props.custom,
		searching]);

	const [value, setValue, isControlled] = useController(props, "selected",
		!props.multiple && Array.isArray(selected) ?
			(selected.length ? selected[selected.length - 1] : undefined) :
		selected);
	

	const forwardChange = (params, event="onChange") => (
		typeof props[event] === "function" ? (props[event](...params) !== false) : true
	);

	const formatChange = (e) => {
		return (Array.isArray(e) ? (e.map((v) => (
			v.value
		))) : (e ? (e.value || e) : e));
	};

	const unFormatValue = (values) => {
		return (Array.isArray(values) ?
			values.map((v) => (
				v.label && v.value ? v : options.find((option) => (
					option.value === v
				)) || v
			)) : values);
	};
	
	const handleAdd = (item) => {
		if(!forwardChange([
			item, options, formatChange(value)
		], "onAdd")) {
			return false;
		}

		if(props.multiple && Array.isArray(value) && ~value.indexOf(item)) {
			return false;
		}

		var updateValue = props.multiple ? [
			...(Array.isArray(value) ? value : []),
			item
		] : item;

		if(forwardChange([updateValue])) {
			setAddedOptions([
				...addedOptions,
				{
					label: item,
					value: item
				}
			]);
			setValue(updateValue);
		}
	};

	const handleRemove = (item) => {
		if(!forwardChange([
			item, options, formatChange(value)
		], "onRemove")) {
			return false;
		}

		var updateValue = value.filter((v) => ((v.hasOwnProperty('value') ? v.value : v) !== item.value));
		
		if(forwardChange([updateValue])) {
			setValue(updateValue);
		}
	}

	const handleChange = (e) => {
		var updatedValue = formatChange(e);

		var lastValue = Array.isArray(updatedValue) ? updatedValue[updatedValue.length - 1] : updatedValue;

		if(props.custom && lastValue && typeof lastValue === "string" && lastValue.startsWith('$add.____.')) {
			var toAddValue = lastValue.split('$add.____.')[1];
			return handleAdd(toAddValue);
		}
		
		if(forwardChange([updatedValue])) {
			setValue(updatedValue)
		}
	};

	const handleOptionsRenderer = (option, selectedOptions) => {
		option = option && typeof option === "object" ? option : {
			label: option,
			value: option
		};

		return (~hidden.indexOf(option.value) || option.hidden) ? null : (
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
		);
	};

	const handleSearch = (searchString) => {
		if(typeof props.onSearch === "function") {
			var values = unFormatValue(value);
			values = [
				...(Array.isArray(values) ? values : [values]),
				...addedOptions
			];

			return props.onSearch(
				searchString,
				values.map((v) => ({
					value: v.value || v,
					label: v.label || v,
					hidden: true
				}))
			);
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
	
	const handleSelectedRender = (item) => {
		
		let option = unfiltered.find((o) => (
			o.value === item.value
		)) || item;
		
    	return (
    	  <div className={'ez-ns-item'} key={option.value}>
    	    <div>{option.label}</div>
    	    {props.multiple && (
					<div className={'ez-ns-cross'} onClick={() => (
						handleRemove(option)
					)} >
    	        ×
    	      </div>
    	    )}
    	  </div>
    	);
	}

	const className = classNames(
		'ez-nice-select',
		props.className,
		mainClasses(props)
	);

	const hasLabel = (props.label || props.description);
	
	const select = (
		<NiceSelect
			{...props}
			options={options}
			value={unFormatValue(value)}
			selectedValueRenderer={handleSelectedRender}
			onChange={handleChange}
			onSearch={handleSearch}
			optionRenderer={optionRenderer}
			addNewItem={props.custom}
			searchable={props.searchable || props.custom}
			onAddNewItem={handleAdd}
			placeholder={placeholder}
			noItemsFound={props.empty}
			
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

	const labelContainer = hasLabel ? (
		<Label {...props} className={props.containerClassName}>
			{select}
		</Label>
	) : select;

	return labelContainer;
}

//eslint-disable-next-line
Select.Item = Select.Option = function (props) {
	return (
		<option value={props.value}>{props.children}</option>
	);
}

Select.Item._isSelectOption = Select.Option._isSelectOption = true;




export default Select;