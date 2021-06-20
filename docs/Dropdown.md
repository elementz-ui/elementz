A blank customizable dropdown/popover component
```js
import React, {useState} from 'react';
import {Dropdown, Menu, Button} from 'elementz';

const [active,setActive] = useState(false);

<Button.Group space>
	<Dropdown 
		arrow 
		arrowBorder 
		active={active}
		setActive={setActive}
		handle={
			<Button noMobile iconRight='chevron-down'>Drop it</Button>
		}>
			<Menu>
				<Menu.Item icon='user'>Profile</Menu.Item>
				<Menu.Item icon='bell'>Notifications</Menu.Item>
				<Menu.Divider/>
				<Menu.Item icon='cog'>Settings</Menu.Item>
			</Menu>

	</Dropdown>

	<Dropdown 
		hover
		noMobile
		handle={
			<Button>Hover me</Button>
		}>
			<Menu noBorder>
				<Menu.Item icon='user' danger>Edit</Menu.Item>
				<Menu.Divider/>
				<Menu.Item icon='close' danger>Delete</Menu.Item>
			</Menu>
	</Dropdown>


	<Dropdown 
		hover
		handle={
			<Button simple>Hover me too</Button>
		}>
			<div className='ez-bg-primary p-50'>
				<p className='ez-text-white'>I'm a custom dropdown content</p>
			</div>
	</Dropdown>
</Button.Group>
```