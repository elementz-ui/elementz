

### Main

```js noeditor
import ThemeMaker from '../src/Components/ThemeMaker';
<ThemeMaker />
```

```js
import {Button, Alert} from 'elementz';

<Button.Group space>
	<Button>I'm basic</Button>
	<Button primary>Primary</Button>
	<Button secondary>Secondary</Button>
	<Button warning>I'm warning you</Button>
	<Button 
		danger 
		effect='icon-buzz' 
		iconRight='sad' 
		onClick={()=> Alert.danger("So dangerous")}
		>I'm dangerous</Button>
	<Button 
		success
		onClick={()=> Alert.success("Yes")}
	>I'm successful</Button>
</Button.Group>
```

### Reverse
```js
<Button.Group space>
	<Button primary reverse icon='laugh'/>
	<Button secondary reverse>Push Me</Button>
	<Button warning reverse>Push Me</Button>
	<Button danger reverse>Push Me</Button>
	<Button success reverse>Push Me</Button>
</Button.Group>
```

### Gradient
```js
<Button.Group space>
	<Button rainbow gradient>Push Me</Button>
	<Button primary secondary gradient>Push Me</Button>
	<Button primary gradient>Push Me</Button>
	<Button secondary gradient>Push Me</Button>
	<Button warning gradient >Push Me</Button>
	<Button danger gradient>Push Me</Button>
	
</Button.Group>
```

### Transparent

```js { "props": {"className": "ez-bg-primary"} }
<Button.Group space>
	<Button transparent>You can't see me</Button>
	<Button transparent reverse>My text is transparent</Button>
</Button.Group>
```

### Shapes & Sizes
A button can be rounded or circle, big or small, no discrimination

```js
<Button.Group space ns>
	<Button primary rounded>I'm extra rounded</Button>
	<Button secondary circle icon='thumbs-up'></Button>
	<Button warning large>I'm big</Button>
	<Button danger xl>I'm bigger</Button>
	<Button success small>I'm small so what</Button>
	<Button info full>I'm flexible</Button>
</Button.Group>
```

### States

```js
import React, {useState} from 'react';

const [isLoading, setLoading] = useState(false);

<Button.Group space>
	<Button primary active>Active</Button>
	<Button primary reverse active>Active too</Button>
	<Button primary disabled>Disabled</Button>
	<Button primary disabled loading>Loading</Button>
	<Button 
		rainbow 
		gradient 
		rounded 
		effect='grow-rotate' 
		disabled={isLoading} 
		loading={isLoading} 
		onClick={()=> setLoading(!isLoading)}>
		Click me
	</Button>
</Button.Group>
```

### Effects
You can add some cool hover effects

```js
<>
	<Button.Group space className='mb-25'>
		<Button primary effect='grow'>Grow</Button>
		<Button primary effect='grow-rotate'>Grow and Rotate</Button>
		<Button primary	effect='shrink'>Shrink</Button>
		<Button primary	effect='bounce'>Bounce</Button>
		<Button primary	effect='float'>Float</Button>
		<Button primary	effect='hang'>Hang</Button>
		<Button primary	effect='buzz'>Buzz</Button>
	</Button.Group>
	
	<Button.Group space>
		<Button 
			secondary 
			icon='arrow-circle-left' 
			effect='icon-backward'>
			Icon Backward
		</Button>
		<Button 
			secondary 
			iconRight='arrow-circle-right' 
			effect='icon-forward'>
			Forward
		</Button>
		<Button 
			secondary 
			icon='arrow-circle-down' 
			effect='icon-down'>
			Icon Down
		</Button>
		<Button 
			secondary 
			icon='arrow-circle-up' 
			effect='icon-up'>
			Icon Up
		</Button>
		<Button 
			secondary 
			icon='refresh-double'
			effect='icon-rotate'>
			Icon Rotate
		</Button>
		<Button 
			secondary 
			icon='lock'
			effect='icon-buzz'>
			Icon Buzz
		</Button>
		<Button 
			secondary 
			iconRight='shortcut'
			effect='icon-float'>
			Icon Float
		</Button>
	</Button.Group>
</>
```

