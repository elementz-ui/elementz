A simple component wrapper for grouping Buttons, Inputs or Badges. (Aliases `Button.Group`, `Input.Group`)

```js
import {Group, Button, Input, Badge, Icon} from 'elementz';

<Group vertical space start>
	<Button.Group>
		<Button icon='chevron-left' sm />
		<Button value='1' sm />
		<Button value='2' sm />
		<Button value='3' sm />
		<Button icon='chevron-right' sm />
	</Button.Group>

	<Input.Group>
		<Badge active >www.</Badge>
		<Input  placeholder='example'/>
		<Badge active >.com</Badge>
	</Input.Group>

	<Input.Group>
		<Badge success icon='sign-in' />
		<Input success active full placeholder='Username'/>
		<Input success active full placeholder='Password' type='password' after={<Icon name='eye' />}/>
		<Button success rounded iconRight='chevron-right' effect='icon-forward'>Login</Button>
	</Input.Group>

	<Button.Group space>
		<Button success reverse value='Cancel' />
		<Button success value='Save' />
	</Button.Group>

	<Button.Group vertical stretch>
		<Button icon='user' value='Profile' />
		<Button icon='send' value='Messages' />
		<Button icon='cog' value='Settings' />
	</Button.Group>
</Group>
```