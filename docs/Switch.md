```jsx
import React, {useState} from 'react';
import {Switch, Group} from 'elementz';

const [active, setActive] = useState(false);
<Group space ns>
	<Switch success sm name={'test'}/>
	<Switch active={active} setActive={setActive} md defaultChecked  on='yes' off='no'/>
	<Switch secondary lg on='on' off='off'/>
	<Switch danger xl  on='yes' off='no' defaultChecked />
	<Switch warning xl disabled on='|' defaultChecked />
	<Switch success xl disabled loading defaultChecked />
	<Switch info xl loading defaultChecked />
</Group>
```