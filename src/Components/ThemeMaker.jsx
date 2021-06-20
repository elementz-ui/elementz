import { func } from 'prop-types';
import React, { useState,useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useMultiState from '../Hooks/useMultiState';
import {useThemeSize, useThemeDarkMode} from '../Hooks/useTheme';
import { ChromePicker } from 'react-color';
import Dropdown from './Dropdown';
import Input from './Input';
import Badge from './Badge';
import Switch from './Switch';
import Radio from './Radio';
import { classNames, filterProps } from '../Functions/Functions';
import Icon from './Icon';
import tinycolor from 'tinycolor2';
import '../Style/ThemeMaker.scss';
import Button from './Button';
import Modal from './Modal';

const cssVariables = {
	'--primary': '#8239e2',
	'--primary-code': '130, 57, 226',
	'--primary-light': '#c69efa',
	'--primary-x-light': '#f4eefb',
	'--primary-dark': '#6300ca',

	'--secondary': '#2b2ee2',
	'--secondary-code': '11, 15, 201',
	'--secondary-light': '#858eff',
	'--secondary-x-light': '#e9e9fd',
	'--secondary-dark': '#000097',

	'--red': '#f5222d',
	'--red-code': '245, 34, 45',
	'--red-light': '#ff7875',
	'--red-x-light': '#faebeb',
	'--red-dark': '#a8071a',

	'--pink': '#ff00ff',
	'--pink-code': '255, 0, 255',
	'--pink-light': '#eabfff',
	'--pink-x-light': '#f8f0fc',
	'--pink-dark': '#7700b3',


	'--purple': '#8a2be2',
	'--purple-code': '138, 43, 226',
	'--purple-dark': '#4a1e9e',
	'--purple-light': '#ddcbff',
	'--purple-x-light': '#f2eefc',

	'--indigo': '#0000b3',
	'--indigo-code': '0, 0, 179',
	'--indigo-dark': '#001f7d',
	'--indigo-light': '#bfcfff',
	'--indigo-x-light': '#e5e9f5',

	'--blue': '#0064f9',
	'--blue-code': '0, 100, 249',
	'--blue-light': '#6ebbeb',
	'--blue-x-light': '#ecf6fc',
	'--blue-dark': '#006dae',

	'--cyan': '#20d8d8',
	'--cyan-code': '32, 216, 216',
	'--cyan-dark': '#169797',
	'--cyan-light': '#c9ffff',
	'--cyan-x-light': '#e2f7f7',

	'--orange': '#e06f1f',
	'--orange-code': '224, 111, 31',
	'--orange-dark': '#9d5716',
	'--orange-light': '#ffe3c8',
	'--orange-x-light': '#fbf1e8',

	'--yellow': '#f5d01b',
	'--yellow-code': '245, 208, 27',
	'--yellow-dark': '#ab9f13',
	'--yellow-light': '#fffac6',
	'--yellow-x-light': '#faf7e7',

	'--green': '#2baf2b',
	'--green-code': '43, 175, 43',
	'--green-dark': '#1e7b1e',
	'--green-light': '#cfffcf',
	'--green-x-light': '#eaf8ea',


	'--black': '#1a1a1a',
	'--black-light': '#383838',
	'--black-x-light': '#c9c9c9',
	'--grey': '#8c8c8c',
	'--grey-dark': '#626262',

	'--text-main-x-light': 'rgba(0,0,0,0.1)',
	'--text-main-light': 'rgba(93,93,93)',
	'--text-main': 'rgba(0,0,0,0.8)',
	'--text-main-code': '0,0,0',

	'--text-inverse-x-light': 'rgba(255,255,255,0.05)',
	'--text-inverse-light': 'rgba(255,255,255,0.3)',
	'--text-inverse': 'rgba(255,255,255,1)',
	'--text-inverse-code': '255,255,255',


	'--background-main': '#f5f4f7',
	'--background-main-light': '#fff',
	'--background-main-dark': '#d5dce0',
	'--background-main-code': '255,255,255',
	'--background-input-main': '#fff',

	'--background-inverse': '#151629',
	'--background-inverse-light': '#3a3d65',
	'--background-inverse-dark': '#232540',
	'--backgorund-inverse-code': '21, 22, 41',
	'--background-inverse-input': '#3a3d65',

	'--border-main': 'rgba(0, 0, 0, 0.1)',
	'--border-inverse': 'rgba(255, 255, 255, 0.1)',


	'--shadow-main': 'rgba(8,4,4,0.04)',
	'--shadow-input-main': 'rgba(0,0,0,0)',

	'--shadow-inverse': 'rgba(8,4,4,0.1)',
	'--shadow-input-inverse': 'rgba(0,0,0,0)',

	'--border-width': '1px',
	'--border-radius': '4px',
	'--shadow-size': '0 0 4px 1px',
	'--shadow-input-size': '0 0 0 0',
	'--box-spacing': '15px',
	'--box-padding': '30px',

	'--sz-sm-padding': '8.5px',
	'--sz-sm-circle': '32px',
	'--sz-sm-mini': '18px',
	'--sz-sm-font': '12px',
	'--sz-sm-icon-font': '21px',
	'--sz-sm-width': '300px',

	'--sz-md-padding': '16.5px',
	'--sz-md-circle': '44px',
	'--sz-md-mini': '22px',
	'--sz-md-font': '13.33px',
	'--sz-md-icon-font': '21px',
	'--sz-md-width': '500px',

	'--sz-lg-padding': '20px',
	'--sz-lg-circle': '54px',
	'--sz-lg-mini': '28px',
	'--sz-lg-font': '16px',
	'--sz-lg-icon-font': '25px',
	'--sz-lg-width': '700px',

	'--sz-xl-padding': '25px',
	'--sz-xl-circle': '74px',
	'--sz-xl-mini': '38px',
	'--sz-xl-font': '20px',
	'--sz-xl-icon-font': '26px',
	'--sz-xl-width': '900px'
};

const options = {
	mode: {
		title: 'Mode',
		description: 'Toggle dark mode or change default size'
	},
	colors: {
		title: 'Colors',
		description: 'Theme default colors',
		...(["primary", "secondary", "red",
			"green", "blue", "cyan", "orange",
			"yellow", "black", "grey"].reduce((o, v, i) => ({
				...o,
				[v]: {
					type: 'color_multiple'
				}
			}), {}))
	},
	main: {
		title: 'Light',
		description: 'The colors of Light Theme',
		append: 'main',
		text: {
			title: 'Text',
			type: 'color_multiple',
		},
		background: {
			title: 'Background',
			type: 'color_multiple',
		},
		'background-input': {
			title: 'Input Background',
			type: 'color',
		},
		border: {
			title: 'Border',
			type: 'color',
		},
		'shadow-input': {
			title: 'Input Shadow',
			type: 'color',
		},
		shadow: {
			title: 'Shadow',
			type: 'color',
		},
		
	},
	dark: {
		title: 'Dark',
		description: 'The colors of Dark Theme',
		append: 'inverse',
		text: {
			title: 'Text',
			type: 'color_multiple',
		},
		background: {
			title: 'Background',
			type: 'color_multiple',
		},
		'background-input': {
			title: 'Input Background',
			type: 'color',
		},
		border: {
			title: 'Border',
			type: 'color',
		},
		'shadow-input': {
			title: 'Input Shadow',
			type: 'color',
		},
		shadow: {
			title: 'Shadow',
			type: 'color',
		}
	},
	pixels: {
		title: 'Pixels',
		description: 'Borders, Box Padding, Margin and things like that',
		'border-width': {
			title: 'Border Width',
			type: 'pixel'
		},
		'border-radius': {
			title: 'Border Radius',
			type: 'pixel'
		},
		'box-padding': {
			title: 'Box Padding',
			type: 'pixel'
		},
		'box-spacing': {
			title: 'Column Spacing',
			type: 'pixel'
		},
		'shadow-input-size': {
			title: 'Input Shadow Options',
			type: 'pixel_multiple',
			props: {
				fields: [
					'X Offset',
					'Y Offset',
					'Blur',
					'Spread'
				]
			}
		},
		'shadow-size': {
			title: 'Box Shadow Options',
			type: 'pixel_multiple',
			props: {
				fields: [
					'X Offset',
					'Y Offset',
					'Blur',
					'Spread'
				]
			}
		},
	},
	sizes: {
		title: 'Sizes',
		description: 'The Default Options for each Element Size Type',
		prepend: 'sz',
		...(['sm', 'md', 'lg', 'xl'].reduce((o, v, i) => ({
			...o,
			[v]: {
				title: (['Small', 'Medium', 'Large', 'Extra Large'])[i],
				prepend: v,
				padding: {
					type: 'pixel'
				},
				circle: {
					type: 'pixel'
				},
				mini: {
					title: 'Smaller Circle',
					type: 'pixel'
				},
				font: {
					title: 'Text Font Size',
					type: 'pixel'
				},
				'icon-font': {
					title: 'Text Font Size',
					type: 'pixel'
				},
				width: {
					title: 'Box Width Size',
					type: 'pixel'
				}
			}
		}), {})),
	}
};

function ThemeMaker(props) {
	
	const categories = Object.keys(options || props.options);

	const [variables, setVariables] = useMultiState(cssVariables || props.variables);

	const [visible, setVisible] = useState(false);
	const [helperVisible, setHelperVisible] = useState(true);

	const [isDarkMode, toggleDarkMode] = useThemeDarkMode();
	const [size, setSize] = useThemeSize();
	const [catgoryActive, setCategoryActive] = useState(categories[0]);
	const [modalActive, setModalActive] = useState(false);
	const lastVariables = useRef(cssVariables);
	const changedKeys = useMemo(() => {
		var parseChanged= Object.keys(cssVariables).
			map((k, i) => (
				cssVariables[k] === variables[k] && lastVariables.current[k] === variables[k] ? null : k
			))
			.filter(x => x);
		
		lastVariables.current = variables;
		
		return parseChanged;

	}, [variables]);

	useEffect(() => {
		for(var k of changedKeys) {
			document.documentElement.style.setProperty(k, variables[k]);
		}
	}, [changedKeys]);

	
	
	const ParseOptions = function () {
		const categoryItems = {
			mode: [
				(
					<ThemeMaker.Item key={'001'} title='Dark Mode'>
						<Switch defaultChecked={isDarkMode} md onChange={() => (
							toggleDarkMode()
						)} />
					</ThemeMaker.Item>
				),
				(
					<ThemeMaker.Item key={'002'} title='Default Size'>
						<Radio.Box solid md defaultSelected={size} onChange={(sz) => (
							setSize(sz)
						)} >
							<Radio.Item id='sm'>Small</Radio.Item>
							<Radio.Item id='md'>Medium</Radio.Item>
							<Radio.Item id='lg'>Large</Radio.Item>
							<Radio.Item id='xl'>Extra Large</Radio.Item>
						</Radio.Box>
					</ThemeMaker.Item>
				)
			]
		};

		const itemTypes = {
			'color': ThemeMaker.SingleColorPicker,
			'color_multiple': ThemeMaker.MultipleColorPicker,
			'pixel': ThemeMaker.PixelPicker,
			'pixel_multiple': ThemeMaker.MultiplePixelPicker,
			'text': ThemeMaker.TextPicker, //Any other CSS type i.e URL, gradient, etc.
		};

		const parseSchema = function (schema, prepend = '', append = '') {

			var children = [],
				prepend = schema.prepend ? prepend + schema.prepend + '-' : prepend,
				append = schema.append ? append + '-' + schema.append : append;
			

			for(var item in schema) {
				var itemOptions = schema[item];
				if(!itemOptions || typeof itemOptions !== "object" || itemOptions.__proto__.constructor.name !== 'Object') {
					continue;
				}

				if(itemOptions.type) {
					var variable = `${prepend}${item}${append}`;
					var ItemPicker = itemTypes[itemOptions.type];
					
					if(!ItemPicker) {
						continue;
					}

					var itemProps = itemOptions.props || {};

					children.push(
						(
							<ThemeMaker.Item
								key={children.length}
								title={itemOptions.title || item.capitalize()}
								description={itemOptions.description}
								
							>
								
								<ItemPicker
									variable={variable}
									variables={variables}
									setVariables={setVariables}
									{...itemProps}
								/>

							</ThemeMaker.Item>
						)
					);
				}
				else {
					children.push(
						(
							<ThemeMaker.Subcategory
								key={children.length}
								title={itemOptions.title || item.capitalize()}
								description={itemOptions.description}
							>
								{
									parseSchema(itemOptions, prepend, append)
								}
							</ThemeMaker.Subcategory>
						)
					);
				}
			}

			return children;
		}

		for(var category of categories) {
			if(category === 'mode') {
				continue;
			}
			categoryItems[category] = parseSchema(options[category]);
		}

		return categoryItems;
	}();

	const className = classNames('ez-theme-maker', {
		'active': visible
	});

	return ReactDOM.createPortal((
		<div className={className}>
			
			<div className='ez-tm-launcher'>
				<Button
					className='icon-bold'
					icon={visible ? 'chevron-right' : 'magic-wand'}
					md
					onClick={() => {
						setVisible(!visible);
						if(helperVisible) {
							setHelperVisible(false);
						}
					}
					}
				/>
				{helperVisible ?
					<div className='ez-tm-launcher-helper' onClick={()=>(setHelperVisible(false))}>
						Customize Theme & Settings
					</div>
					: null
				}
			</div>

			<div className='ez-tm-container'>
				<div className='ez-tm-categories'>
					{
						categories.map((c) => {
							var className = classNames('ez-tm-category', {
								'active': catgoryActive == c
							});

							return (
								<div
									className={className}
									onClick={(e) => (
										setCategoryActive(c)
									)}
								>
									{options[c].title || c.capitalize()}
								</div>
							)
						})
					}
				</div>

				<div className='ez-tm-body'>
					<div className='ez-tm-description'>{
						options[catgoryActive].description
					}</div>
					{
						ParseOptions[catgoryActive]
					}
				</div>
				<div className='ez-tm-footer'>
					<Button.Group space noWrap>
						<Button md icon='refresh-left' title="Reset" onClick={() => {
							setVariables(cssVariables);
							document.documentElement.removeAttribute('style');
						
						}
							
						} />
						<Button md full primary
							disabled={!changedKeys.length}
							onClick={() => (setModalActive(true))}>Save Theme</Button>
					</Button.Group>
					<Modal lg active={modalActive} setActive={setModalActive}>
						<div className='ez-tm-save'>
							<h3>Save CSS Theme</h3>
							<p>Include these CSS variables to override the default theme variables</p>
							<div className='ez-tm-save-code'>
								<code>
									{
										`:root{\r\n${changedKeys.map((v, i) => (`	${v}: ${variables[v]};`)).join("\r\n")}\r\n}`
									}
								</code>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		</div>
	), document.body);

}

ThemeMaker.parseMultipleVariables = (variable) => (
	[
		'--' + variable,
		'--' + variable + '-light',
		'--' + variable + '-x-light',
		'--' + variable + '-dark',
		'--' + variable + '-code'
	]
);

ThemeMaker.parseVariable = (variable) => (
	'--' + variable
);

ThemeMaker.parseColor = (color) => (
	(typeof color === "string" && /^rgba?\(/.test(color)) ?
		color.replace(/^(rgba?\()/, '').replace(')', '').split(',').reduce((o, v, i) => ({
			...o,
			[(['r','g','b','a'])[i]]: v
		}), {}) : color
);

ThemeMaker.isValidPixelInput = (value, pixelFields=4, isOptionalFields=false) => {
	var n = pixelFields;

	var pixelPicker = `(\\d+(?:px)?(?:em)?)`; //One pixel field
	var beforePixelPicker = `(?:\\s{1,5})`; //Pixel fields are seperated by space
	var afterPixelPicker = isOptionalFields ? '?': '';
	var endPixelPicker = "(?:\\s{0,5})$"; //The ending pixel field doesn't need space
	var makeRegex = '^';
	

	for(var i = 0; i < n; i++){
		makeRegex += i ? beforePixelPicker + pixelPicker + afterPixelPicker: pixelPicker;
		makeRegex += (i === n -1) ? endPixelPicker : '';
	}
	var regX = new RegExp(makeRegex);

	return regX.test(value) ? makeRegex : false;
}

ThemeMaker.stringifyColor = (color) => (
	(typeof color === "string") ? color : (
		color && color.hasOwnProperty('r') && color.hasOwnProperty('g') && color.hasOwnProperty('b') ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 0})` : '#fff'
	)
);

ThemeMaker.ColorPicker = (props) => {
	const [active, setActive] = useState(false);
	const parsedColor = useMemo(()=> (ThemeMaker.parseColor(props.color)),[props.color]);
	const [color, setColor] = useState(parsedColor);
	var passProps = filterProps(props, ['color', 'onChange']);

	useEffect(() => {
		if(!active && color != parsedColor) {
			setColor(parsedColor);
		}	
	}, [parsedColor, color, active]);

	return (
		<Dropdown noMobile mobileLarge {...passProps} full active={active} setActive={setActive} handle={
			<div className='ez-tm-cg-color' style={{
				background: props.color
			}}>
				<span>{props.title}</span>
				<span className='ez-tm-cg-c-subtitle'>{props.subtitle}</span>
			</div>
		}>
			<ChromePicker
				color={color}
				disableAlpha={false}
				onChange={({hex, rgb}) => (
					setColor(rgb.a !== 1 ? rgb : hex)
				)}
				onChangeComplete={(colors) => {
					if(colors && colors.hex && colors.rgb && typeof props.onChange === "function") {
						return props.onChange(colors);
					}
				}
				}
			/>
		</Dropdown>
	);
};

ThemeMaker.SingleColorPicker = ({ variable, variables, setVariables }) => {
	const main = ThemeMaker.parseVariable(variable);
	return (
		<div className='ez-tm-single-color'>
			<ThemeMaker.ColorPicker
				title={variables[main]}
				color={variables[main]}
				onChange={({ hex, rgb }) => (
					setVariables({
						[main]: rgb.a !== 1 ? ThemeMaker.stringifyColor(rgb) : hex
					})
				)}
			/>
		</div>
	);
};

ThemeMaker.MultipleColorPicker = ({ variable, variables, setVariables }) => {
	const [main, light, xlight, dark, code] = ThemeMaker.parseMultipleVariables(variable);
	
	return (
		<div className='ez-tm-color-group'>
			<div className='ez-tm-cg-main'>
				<ThemeMaker.ColorPicker
					title={variables[main]}
					color={variables[main]}
					onChange={({ hex, rgb }) => {
						var pickedColor = rgb.a !== 1 ? ThemeMaker.stringifyColor(rgb) : hex;
						var tinyStringify = rgb.a !== 1 ? 'toRgbString' : 'toString';
						var makeXlight = tinycolor(pickedColor).lighten(37)[tinyStringify]();

						return setVariables({
							[main]: pickedColor,
							[light]: tinycolor(pickedColor).lighten(22)[tinyStringify](),
							[xlight]: makeXlight === '#ffffff' ? tinycolor(pickedColor).lighten(30)[tinyStringify]() : makeXlight,
							[dark]: tinycolor(pickedColor).darken(20)[tinyStringify](),
							[code]: Object.values(rgb).slice(0,3).join(', ')
						})
					}}
				/>
			</div>
			<div className='ez-tm-cg-others'>
				<ThemeMaker.ColorPicker
					title="Light"
					subtitle={variables[light]}
					color={variables[light]}
					left
					onChange={({ hex, rgb }) => (
						setVariables({
							[light]: rgb.a !== 1 ? ThemeMaker.stringifyColor(rgb) : hex
						})
					)}
				/>		
				<ThemeMaker.ColorPicker
					title="Lighter"
					subtitle={variables[xlight]}
					color={variables[xlight]}
					onChange={({ hex, rgb }) => (
						setVariables({
							[xlight]: rgb.a !== 1 ? ThemeMaker.stringifyColor(rgb) : hex
						})
					)}
				/>
				<ThemeMaker.ColorPicker
					title="Dark"
					subtitle={variables[dark]}
					color={variables[dark]}
					right
					onChange={({ hex, rgb }) => (
						setVariables({
							[dark]: rgb.a !== 1 ? ThemeMaker.stringifyColor(rgb) : hex
						})
					)}
				/>
			</div>
		</div>
	)
};

ThemeMaker.PixelPicker = ({ variable, variables, setVariables }) => {
	const parsedVariable = ThemeMaker.parseVariable(variable);
	const hasDot = /\.[pxem]{2}$/.test(variables[parsedVariable]);
	const pixels = parseFloat(variables[parsedVariable].replace(/[^\d\.]+/g,''));
	const currentNumber = !isNaN(pixels) ? pixels : 0;
	return (
		<div className='ez-tm-pixel-picker'>
			<Input.Group>
				<Input.Number
					md
					full
					float
					noButtons
					value={hasDot ? `${currentNumber}.` : currentNumber}
					onChange={(number) => {
						setVariables({
							[parsedVariable]: number + 'px'
						})
					}}
				/>
				<Badge md active>px</Badge>
			</Input.Group>
		</div>
	)
};

ThemeMaker.MultiplePixelPicker = ({ variable, variables, setVariables, fields }) => {
	const [invalid, setInvaild] = useState(false);
	const pixels = ThemeMaker.parseVariable(variable);
	
	const value = variables[pixels],
		hasFields = fields && Array.isArray(fields) && fields.length,
		fieldsLength = hasFields ? fields.length : 4,
		isValidValue = ThemeMaker.isValidPixelInput(value, fieldsLength),
		fieldValues = isValidValue ?
			Array.from(value.matchAll(new RegExp(isValidValue, "g")))[0].slice(1).map(
				(e) => (e.replace(/[^\d.]+/g, ''))
			) :
			Array.from(Array(fieldsLength).keys()).map(
				() => (0)
			);
	console.log(value, fieldValues);
	const sliderPicker = hasFields ? (
		(
			<Dropdown noMobile left disabled={invalid} handle={
				<Icon name='git-commit' danger={invalid} />
			}>
				<div className='ez-tm-pixel-range'>
					{
						fields.map((f, i) => {
							return (
								<div className='ez-tm-pr-item'>
									<label>{f}</label>
									<input
										value={fieldValues[i]}
										onChange={(e) => {
											var copyArray = fieldValues.slice();
											copyArray[i] = e.target.value;
											console.log(copyArray, copyArray[i])
											setVariables({
												[pixels]: copyArray.join('px ') + 'px'
											})
										}}
										type="range"
										min="0"
										max="50"
									/>
								</div>
							)
						})
					}
				</div>
			</Dropdown>
		)
	) : null;

	return (
		<div className='ez-tm-multi-pixel-picker'>
			<Input
				type='text'
				md
				full
				active={invalid}
				placeholder='0 0 2px 0'
				danger={invalid}
				spellCheck={false}
				value={value}
				before={sliderPicker}
				onChange={(e) => {
					var v = e.target.value;
					if(!v || !ThemeMaker.isValidPixelInput(v, fieldsLength)) {
						setInvaild(true);
					}
					else {
						if(invalid) {
							setInvaild(false);
						}
					}
					setVariables({
						[pixels]: v
					})
				}}
			/>
		</div>
	)
};

ThemeMaker.TextPicker = ({ variable, variables, setVariables }) => {
	const text = ThemeMaker.parseVariable(variable);
	return (
		<div className='ez-tm-pixel-picker'>
			<Input
				type='text'
				md
				full
				value={variables[text]}
				onChange={(v) => (
					setVariables({
						[text]: v
					})
				)}
			/>
		</div>
	);
};

ThemeMaker.Item = (props) => {
	return (
		<div className='ez-tm-item'>
			<div className='ez-tm-item-header'>
				<label className='ez-tm-item-title'>{props.title}</label>
				<p className='ez-tm-item-description'>{props.description}</p>
			</div>
			<div className='ez-tm-item-body'>
				{props.children}
			</div>
		</div>
	);
};

ThemeMaker.Subcategory = (props) => {
	const [active, setActive] = useState(false);
	const className = classNames('ez-tm-subcategory', {
		'active': active
	});

	return (
		<div className={className}>
			<div className='ez-tm-subcategory-header' onClick={(e) => (
				setActive(!active)
			)}>
				<Icon className='ez-tm-subcategory-expand' name={
					active ? 'chevron-up' : 'chevron-down'
				} />
				<label className='ez-tm-subcategory-title'>{props.title}</label>
				<p className='ez-tm-subcategory-description'>{props.description}</p>
				
			</div>
			<div className='ez-tm-subcategory-body'>
				{active ? props.children : null}
			</div>
		</div>
	)
};

export default ThemeMaker;

