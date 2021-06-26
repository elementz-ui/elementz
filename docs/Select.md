### Basic
Just basic select
```js
import {Group, Select} from 'elementz';

<>
	<Group space ns>
		<Select>
			<option selected>This is One</option>
			<option>Two</option>
			<option>Three is here toooo</option>
		</Select>
		<Select disabled loading>
			<option selected>One</option>
			<option >Two</option>
			<option >Three is here toooo</option>
		</Select>
		<Select primary active>
			<option >One</option>
			<option >Two</option>
			<option >Three is here toooo</option>
		</Select>
		<Select lg danger active>
			<option >One</option>
			<option selected>Two</option>
			<option >Three is here toooo</option>
		</Select>
		<Select xl full>
			<option selected>One</option>
			<option >Two</option>
			<option >Three is here toooo</option>
		</Select>
	</Group>
</>
```

### Nice
A select wrapper for multiple & searchable selection based in `react-select-me`
```js
import {Group, Select} from 'elementz';

<>
	<Group space>
		<Select.Nice>
			<option value={1}>This is a nice select</option>
			<option value={2}>Dos</option>
			<option value={3}>Tres</option>
		</Select.Nice>

		<Select.Nice 
			searchable
			custom
			info
			full
			className='mw-350'
		>
			<option value={1}>I'm searchable & accept new values</option>
			<option value={2}>Dos</option>
			<option value={3}>Tres</option>
		</Select.Nice>

		
		<Select.Nice 
			multiple
			placeholder="I'm multiple"
			full
			searchable
			custom
			secondary
		>
			<option value='uno'>Unos</option>
			<option value='dos'>Dos</option>
			<option value='tres'>Tres</option>
			<option value='another'>Another one</option>
		</Select.Nice>
	</Group>

	<Group space className='mt-20' ns>
		<Select.Nice sm primary active>
			<option selected value={1}>I'm small</option>
			<option value={2}>Dos</option>
			<option value={3}>Tres</option>
		</Select.Nice>

		<Select.Nice md info>
			<option selected value={1}>I'm medium</option>
			<option value={2}>Dos</option>
			<option value={3}>Tres</option>
		</Select.Nice>

		<Select.Nice lg warning>
			<option selected value={1}>I'm large</option>
			<option value={2}>Dos</option>
			<option value={3}>Tres</option>
		</Select.Nice>
		<Select.Nice xl danger active full className='mw-350'>
			<option selected value={1}>I'm extra large cavron</option>
			<option value={2}>Dos</option>
			<option value={3}>Tres</option>
		</Select.Nice>
	</Group>
</>
```