```js
<>
<span onClick={ 
	(e)=> (
		Alert.danger("Danger")
	)
}>
	Show me
</span>

<span onClick={
	(e)=> (
		Alert.success("success")
	)
}>
	Show me
</span>

<span onClick={
	(e)=> (
		Alert.warning("warning")
	)
}>
	Show me
</span>

<span onClick={
	(e)=> (
		Alert({
			text: 'custom',
			className: 'secondary'
		})
	)
}>
	Show me
</span>
</> 
```
 