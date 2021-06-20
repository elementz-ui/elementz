```js
import {Badge, Icon} from 'elementz';

<Badge.Group space>
	<Badge primary sm>Testing</Badge>
	<Badge secondary sm>Testing</Badge>
	<Badge warning sm>Testing</Badge>
	<Badge danger sm circle><Icon name='user'/></Badge>
	<Badge.Group>
		<Badge danger sm>
			<Icon name='close'/>
		</Badge>
		<Badge danger sm>Remove</Badge>
	</Badge.Group>
	<Badge.Group>
		<Badge success sm>
			<Icon name='plus'/>
		</Badge>
		<Badge success sm>Add</Badge>
	</Badge.Group>
</Badge.Group>
```