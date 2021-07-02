A modern and easy-to-use table packed with all neccessary features.

Try resizing your browser to see mobile responsiveness. 
```jsx
import React, {useState, useMemo, useReducer} from 'react';
import {Table, Switch, Radio, Button, Alert, useMultiState} from 'elementz';
import Flag from 'Flag'; // import Flag from 'elementz/Components/Flag';
import {TableDemoData, TableDemoOptions} from './options/Data';

const [config, setConfig] = useMultiState({
	rows: 10000,
	scrollable: false,
	expandable: false,
	searchable: true,
	filterable: true,
	sortable: true,
	selectable: true,
	fixed: true,
	empty: false,
	loading: false,
});

const [selected, setSelected] = useState([]);

const generated = TableDemoData();

const data = useMemo( ()=>(generated.slice(0,config.rows)), [generated, config.rows]);

const columns = {
	first: {
		title: 'First Name',
		filter:{
			custom: true, //Allow custom filter values
			multiple: true, //Allow multiple filter values
			negative: true, //Allow negative filtering ('is not')
			options: [data[0].first, 'John','Paul', data[2].first, data[3].first] //Array of allowed filter options
		}
	},
	last: {
		title: 'Last Name',
		onRender: (last, row, i)=>(
			<div onClick={Alert.bind(null,`You clicked Mrs.${last}`)}>
				{last}
			</div>
		)
	},
	phone: {
		title: 'Phone',
	},
	country: {
		title: 'Country',
		onRender: (iso, row, i)=>(
			<Flag iso={iso} title={iso}/>
		)
	},	
	age: {
		title: 'Age',
		filter: {
			//Custom filter options
			options: {
				'Older than 30': (age)=>(age > 30),
				'Between 18 and 25': (age)=>(age >= 18 && age <= 25)
			}
		}
	},
};

const memoizedColumns = useMemo(() => (columns), []);

<>
	<TableDemoOptions config={config} setConfig={setConfig} />

	<Table 
		columns={memoizedColumns}
		data={config.empty ? [] : data}
		sortable={config.sortable}
		searchable={config.searchable}
		filterable={config.filterable}
		selectable={config.selectable}
		paginate={!config.scrollable}
		
		limit={5}
		scrollable={config.scrollable ? '500px' : false}
		
		fixed={config.fixed}
		loading={config.loading}

		expandable={config.expandable}
		onExpand={(row, i)=>(<span>Oh, You expanded me #{i}</span>)}
		
		actionHidden
		onAction={(row, i, isBulk)=>{
			if(!isBulk) return (
				<Button sm simple icon='more-h' className='icon-bold' />
			);
			return ( 
				<Button.Group>
					<Button sm secondary reverse icon='pencil' />
					<Button sm danger reverse icon='close' />
				</Button.Group>
			)
		}}

		onMobile={(row, i)=>(
			<div className='pt-30 pb-30 m-auto'>
				<div><b>Name.</b> {row.first + ' ' + row.last}</div>
				<div><b>Located.</b> {row.country} <Flag iso={row.country}/></div>
				<div><b>Contact.</b> {row.phone}</div>
			</div>
		)}

	/>
</>


```

### Remote
You can use the table in remote mode, by passing a function (memoized).
This way you can easily handle millions of rows. 

Check out this package https://github.com/elementz-ui/querify for parsing remote table options and building SQL queries

```jsx
import React, {useState, useMemo, useReducer, useCallback} from 'react';
import {Button, useMultiState} from 'elementz';
import Flag from 'Flag'; // import Flag from 'elementz/Components/Flag';
import {TableDemoOptions} from './options/Data';


const [config, setConfig] = useMultiState({
	infinite: false,
	fixed: false,
	refresh: false,
	loading: false
});

const columns = {
	first: {
		title: 'First Name',
		filter:{
			custom: true, //Allow custom filter values
			multiple: true, //Allow multiple filter values
			negative: true, //Allow negative filtering ('is not')
			options: ['John','Paul']
		}
	},
	last: {
		title: 'Last Name',
	},
	country: {
		title: 'Country',
		onRender: (iso)=>(<Flag iso={iso} title={iso}/>)
	},
	phone: {
		title: 'Phone'
	},
	age: {
		title: 'Age',
		filter: {
			//Custom filter functions
			options: {
				'Older than 30': (age)=>(age > 30),
				'Between 18 and 25': (age)=>(age >= 18 && age <= 25)
			}
		}
	}
};


<>
	<TableDemoOptions config={config} setConfig={setConfig} />

	<Table 
		columns={columns}
		sortable

		//You send a request to your backend and filter/search/sort data according to the specified options
		//The response should return an object {data, total}

		data={
			useCallback(async (offset, limit, filters, search, sort)=> {		
				const params = (new URLSearchParams({
					offset,
					limit,
					search: search || '',
					filters: filters ? JSON.stringify(filters): '',
					sort: sort ? JSON.stringify(sort) : '',
				})).toString();

				return fetch(`https://api.elementz.style/users?${params}`)
					.then((res)=> res.json())
					.then((res) => {
						return {
							//Items (Filtered/Sorted & Paginated with offset/limit)
							data: res.data, 

							//Total count of items (Filtered/Sorted without pagination)
							total: res.total 
						}
					})
			},[config.refresh])
		}

		loading={config.loading}
		limit={config.infinite ? 50 : 5}
		fixed={config.fixed}
		paginate={!config.infinite}
		scrollable={config.infinite ? '500px' : false}
		onAction={(row, i, isBulk)=>{
			if(!isBulk) return (
				<Button sm simple icon='more-h' className='icon-bold' />
			);
			return ( 
				<Button.Group>
					<Button sm secondary reverse icon='pencil' />
					<Button sm danger reverse icon='close' onClick={(e)=>{

						//We should trigger a data refresh when deleting/modifying rows
						//This can be done simply by changing a dependency state of the 'useCallback'

						setConfig({
							refresh: Math.random()
						})
					}} />
				</Button.Group>
			)
		}}
		onMobile={(row, i)=>(
			<div className='pt-30 pb-30 m-auto'>
				<div><b>Name.</b> {row.first + ' ' + row.last}</div>
				<div><b>Located.</b> {row.country} <Flag iso={row.country}/></div>
				<div><b>Contact.</b> {row.phone}</div>
			</div>
		)}
	/>
</>


```