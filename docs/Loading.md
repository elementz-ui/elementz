

### Circle
Just simple loading circle
```js
import {Loading} from 'elementz';

<>
	<Loading primary sm isLoading={false}><span>Finished Loading</span></Loading>
	<Loading primary sm/>
	<Loading secondary md/>
	<Loading danger lg/>
	<Loading warning xl/>
</>

```

### Loading.Skeleton
By wrapping your root element with `Loading.Skeleton`, all children will be overlayed with a nice loading effect, purely with only CSS.

```jsx
import {Loading, Switch, Badge, Row, Col} from 'elementz';
import React, {useState} from 'react';
import {LoremIpsum} from './options/Data';

const [loading, setLoading] = useState(true);

<>
	<Row nm nw center start className='mb-15' >
		<span className='mr-15'>isLoading</span>
		<Switch onChange={setLoading.bind(null, !loading)} defaultChecked={true}/>
	</Row>

	<Loading.Skeleton isLoading={loading}>
		<Row>
			<Col c6>
				<h1>What is Ipsum Lorem?</h1>
				<p className='mt-15'>{LoremIpsum}</p>
			</Col>
			<Col c6>
				<h1>What is Lorem Ipsum?</h1>
				<p className='mt-15'>{LoremIpsum}</p>
			</Col>
		</Row>
		<Row nm nw center className='mt-25 p-b'>
			<div className='mr-50'>
				<Loading.Skeleton.Custom circle>
					<Badge xl circle primary icon='info-circle' />
				</Loading.Skeleton.Custom>
			</div>
			<div>
				<h1>What is Lorem Ipsum?</h1>
				<p className='mt-15'>{LoremIpsum}</p>
			</div>
		</Row>
	</Loading.Skeleton>
</>
```

#### Loading.Skeleton.Custom
Elements such as headings and texts are wrapped automatically, but some elements such as images or other custom elements are not and it's neccessary to use the custom skelet wrapper `Loading.Skeleton.Custom`

In some cases, you can simply add the className `ez-skelet` to your custom elements 

```js
import React, {useState} from 'react';
import {Loading, Row, Badge, Switch} from 'elementz';
import {VerticalBar} from './options/Data';

const [loading, setLoading] = useState(true);

<>
	<Row nm nw center start className='mb-15' >
		<span className='mr-15'>isLoading</span>
		<Switch onChange={setLoading.bind(null, !loading)} defaultChecked={true}/>
	</Row>

	<Loading.Skeleton isLoading={loading}>
		<Row nm nw center start>
			{/* 
			   We simply add the 'ez-skelet' class to wrap our custom icon element
			*/}
			<Badge circle lg icon='user' className='ez-skelet'/>
			
			<div className='ml-50'>
				<h1>I get the loading effect automatically</h1>
				<small>Me too</small>
			</div>
		</Row>

		{/* 
		   We use the Loading.Skeleton.Custom to wrap the whole chart
		*/}
		<div className='w-100 mt-20'>
			<Loading.Skeleton.Custom>
					<VerticalBar />
			</Loading.Skeleton.Custom>
		</div>

	</Loading.Skeleton>
</>

```
