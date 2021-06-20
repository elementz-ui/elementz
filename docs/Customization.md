## Mode
You can toggle dark mode or change default theme size by using these hooks:

```jsx static
import {useThemeDarkMode, useThemeSize} from 'elementz';

const [isDarkMode, toggleDarkMode] = useThemeDarkMode();
const [size, setSize] = useThemeSize();

<>
	<Switch defaultChecked={isDarkMode} onClick={toggleDarkMode} />
	<Radio onChange={setSize}>
		<Radio.Item id='sm'>Small</Radio.Item>
		<Radio.Item id='md'>Medium</Radio.Item>
		<Radio.Item id='lg'>Large</Radio.Item>
		<Radio.Item id='xl'>Extra Large</Radio.Item>
	</Radio>
</>
```
You can also change the Theme without using hooks, the API is exposed in the window object.

```jsx static
	window.EzTheme = {
		isDarkMode,
		toggleDarkMode(),
		size,
		setSize()
	};
```


## Style
Elementz uses CSS variables for making customization easier, you can use the Magic Theme Customizer tool to play around and pick your custom colors/options, then you include those variables in your app style to override the default variables.

It's recommended to also use Elementz variables in your custom components, so you can easily manage the styling over all components, and you can easily switch between light and dark mode.

You can do this by adding these **classNames** to your custom components (or you can include the variables directly in your CSS, but this is simpler):

- **`ez-text`**: Theme text color
- **`ez-text-light`**: Theme light text color
- **`ez-text-x-light`**: Theme lighter text color

- **`ez-bg`**: Theme background color
- **`ez-bg-box`**: Theme box background color
- **`ez-bg-input`**: Theme input background color
- **`ez-bg-dark`**: Theme background dark

- **`ez-padding`**: Box Padding
- **`ez-input-padding`**: Padding for Buttons, Inputs, etc. (Optionally add size class `sm`,`md`,`lg`,`xl`)
- **`ez-border`**: Border Color, Width and Radius
- **`ez-shadow`**: Box Shadow
- **`ez-input-shadow`**: Shadow for Buttons, Inputs, etc.

- **`ez-font-family`**: Font family 
- **`ez-font-size`**: Text Font Size (Supports size classes)
- **`ez-icon-font-size`**: Icon Font Size (Supports size classes)

- **`ez-circle`**: Width & Height for circle elements (Supports size classes)
- **`ez-small-circle`**: Width & Height for smaller circle elements (Supports size classes)
- **`ez-box-width`**: Max width for Modals etc. (Supports size classes)

#### With Colors
Available colors are:
```jsx static
[`primary`,`secondary`, `info`, `warning`,`danger`,`success`,`pink`,`indigo`,`purple`,`cyan`,`orange`, `yellow`, `green`, `black`, `grey`,`white`]
```

- **`ez-text-{color}`**: Text Color 
- **`ez-text-{color}-light`**: Light Text Color
- **`ez-text-{color}-x-light`**: Lighter Text Color
- **`ez-text-{color}-dark`**: Dark Text Color

- **`ez-icon-{color}`**: Icon Color (Add class to parent to affect children icons)
- **`ez-icon-{color}-light`**: Light Icon Color
- **`ez-icon-{color}-x-light`**: Lighter Icon Color
- **`ez-icon-{color}-dark`**: Dark Icon Color

- **`ez-bg-{color}`**: Background Color
- **`ez-bg-{color}-light`**: Light Background Color
- **`ez-bg-{color}-x-light`**: Lighter Background Color
- **`ez-bg-{color}-dark`**: Dark Background Color

Example:

```jsx
import {Icon} from 'elementz';

<section className='ez-bg p-50 w-100 mw-500'>
	<div className='ez-bg-box ez-border ez-padding ez-shadow w-100'>
		<h1 className='ez-text ez-font-size xl'>Reports</h1>
		<small className='ez-text-light ez-font-size sm'>Information about your usage. Try toggling dark mode.</small>
		<div className='ez-bg-info ez-text-info-light ez-icon-white ez-border mt-20 p-15'>
			<Icon name='info-circle' /> No reports found
		</div>
	</div>
</section>
```

## Other

### Bootstrap
Elementz also has the Bootstrap layot included by default so you can use the responsive Bootstrap Columns & Rows.

### Shorthands
There are a few shorthand classes included for setting margin, padding.
For example: 
- `m-auto`: Margin auto
- `mr-auto`: Margin right auto. (Or `mt` -> Margin Top, `ml`-> Margin Left, `mb` -> Margin Bottom)
- `m-5`: Margin 5px. (Or `10`,`15`,`20`,`25`,`30`,`35`,`40`,`50`,`65`,`80`,`100`) 
- `mr-5`: Margin right 5px. (Or `mt`,`ml`,`mb`)
- `p-5`, `pr-5`, `pt-5`,`pl-5`,`pb-5` for padding, shorthands same as margin.

### Cherry-picking
You can import a single component if that's all you need, with cherrypicking the bundle size is much smaller

Example:

```jsx static
import Flag from 'elementz/Components/Flag';
```