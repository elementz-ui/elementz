Input elements have similar syntax to native HTML elements

### Basic
```js
import {Input} from 'elementz';

<Input.Group space>
	<Input placeholder='Just a text input'/>
	<Input type='password' placeholder='Just a password input'/>
</Input.Group>
```

### Number
I challange you to try and type any character other than a number

```js
import {Input, Badge} from 'elementz';
<>
	
	<Input type='number' incremental={1} max={100} onChange={console.log.bind(null,"Change number:")} />
	<small>Try scrolling on it</small>

	<Input.Group className='mt-20'>
		<Input type='number' sm noButtons incremental={1} max={100}/>
		<Badge sm>px</Badge>
	</Input.Group>
</>
```


### Checkbox
A CSS only custom checkbox

```js
<Input.Group space vertical start>
	<Input type='checkbox' primary>I'm a checkbox</Input>
	<Input type='checkbox' secondary defaultChecked>I'm a checkbox</Input>
	<Input type='checkbox' success>I'm a checkbox</Input>
	<Input type='checkbox' danger incomplete defaultChecked>I'm an incomplete checkbox</Input>
</Input.Group>
```


### Radiobox
A CSS only custom radiobox

```js
<Input.Group space vertical start>
	<Input type='radio' name='radio' primary defaultChecked>I'm a radio</Input>
	<Input type='radio' name='radio' secondary>I'm a radio</Input>
	<Input type='radio' name='radio' danger>I'm a radio</Input>
</Input.Group>

```

### Copy
```jsx
import React, {useState} from 'react';
import {Icon} from 'elementz';
import {copy} from '../src/Functions/Functions';

const [show, setShow] = useState(false);

<Input 
	active
	readonly
	full
	spellCheck={false}
	after={<Icon name='copy' />}
	className='clickable'
	containerClassName='clickable mw-350'
	value={"bc1qte5dj2g04pzefxcwxu4gxvu83mmf5qsucnpl0n"}	
	overlay={
		show ? (
			<div className='ez-bg-primary ez-animation-pop flex center ez-text-white w-100 h-100'>
				Copied <Icon name='checkmark' />
			</div>
		) : null
	}
	containerOnClick={(e)=>{
		if(show){
			return false;
		}
		copy(e.target.value);
		setShow(true);
		setTimeout(setShow.bind(null,false),2000);
	}}
/>


```



### States
A CSS only custom radiobox

```js
import {Input, Icon, Badge, Button} from 'elementz';

<Input.Group space>
	<Input defaultValue='A disabled input' disabled container/>
	<Input defaultValue='A loading input' after={<Icon name='user'/>} disabled loading/>
	<Input defaultValue='An active input' primary active/>
</Input.Group>
```

### Sizes

```js

import {Input, Icon, Badge} from 'elementz';


<>
	<Input.Group space ns>
		<Input placeholder='Just a text input' sm/>
		<Input placeholder='Just a text input' md/>
		<Input placeholder='Just a text input' lg/>
		<Input placeholder='Just a text input' xl/>

	</Input.Group>
	<Input.Group space className='mt-5' ns>
		<Input type='checkbox' sm/>
		<Input type='checkbox' md disabled/>
		<Input type='checkbox' lg/>
		<Input type='checkbox' xl/>
		<Input type='radio' name='radio' sm/>
		<Input type='radio' name='radio' md/>
		<Input type='radio' name='radio' lg/>
		<Input type='radio' name='radio' xl/>

		<Input.Group full>
				<Badge primary icon='search'></Badge>
				<Input active primary full placeholder="A flexible width input"/>
		</Input.Group>
	</Input.Group>
</>
```

### Actions
```js
import React, {useState} from 'react';
import {Input, Icon, Badge} from 'elementz';


const [isLoading,setLoading] = useState({
	'search': false,
	'edit': false,
	'custom': false
});

const [showPassword, setShowPassword] = useState(false);

<Input.Group space>
	<Input
		loading={isLoading.search}
		before={
			<Icon name='search'/>
		}
		placeholder='Search something'
		onChange={(e)=>(
			setLoading({...isLoading, search: !isLoading.search})
		)}
	/>
	<Input
		success
		loading={isLoading.edit} 
		actionHidden
		after={
			<Icon 
				name='pencil'
				onClick={(e)=>(
					setLoading({...isLoading, edit: !isLoading.edit})
				)}
			/>
		}
		defaultValue='Click my hidden action'
	/>

	<Input
		type={showPassword ? 'text' : 'password'}
		after={
			<Icon 
				name={showPassword ? 'eye-slash': 'eye'}
				onClick={()=>(setShowPassword(!showPassword))}
			/>
		}
		placeholder='Change your password'
		defaultValue={'mySecretPassword'}
	/>

	<Input
		before={
			<Badge className='p-5' warning>
				Premium
			</Badge>
		}
		after={
			<img src='https://tikapi.io/assets/img/star.png' width='19px'/>
		}
		loading={isLoading.custom}
		secondary
		placeholder='I have custom actions'
		onChange={(e)=>(
			setLoading({...isLoading, custom: !isLoading.custom})
		)}
	/>
</Input.Group>
```

