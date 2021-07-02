
/* eslint-disable no-unused-expressions */

import React, { useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {findDOMNode} from 'react-dom'
import { filterProps, classNames, capitalize, md0, random, timsort, debounce, numberWithCommas } from '../Functions/Functions';
import "./../Style/Table.scss";
import "./../Style/Select.scss";
import Input from './Input';
import Icon from './Icon';
import Button from './Button';
import Loading from './Loading';
import Dropdown from './Dropdown';
import Select from './Select';
import { useVirtual } from 'react-virtual';

import PropTypes from 'prop-types';
import useController from '../Hooks/useController';

  
const TableFilter = function (props) {
	const {
		options,
		columns,
		filter,
		filters,
		setFilters,
		setSelected,
		setFilterOpen,
		filterOpen,
		setPage
	} = props;

	const { allowed, all } = filter;

	const [filterState, setFilterState] = useState({
		key: allowed[0],
		equals: true,
		value: null
	});

	
	const handleValueChange = function (e) {
		const isNative = e && e.target;

		var value = isNative ? e.target.value : e;
		
		let values = isNative ? [].slice.call(e.target.selectedOptions).map(a => a.value) : e;
		

		setFilterState({
			...filterState,
			value: values.length ? values : value
		});
	}

	const handleFilterApply = function (e) {
		
		if(!filterState.key || !filterState.value || !all[filterState.key]) {
			return false;
		}
		if(Array.isArray(filterState.value) && filterState.value[0] == "") {
			return false;
		}

		
		setFilterOpen(false);
		setPage(1, [1], false);
		setSelected([], [[],[]], false);

		var values = Array.isArray(filterState.value) ? filterState.value : [filterState.value];
		values = values.reduce((o, v, i) => ({
			...o,
			[v]: filterState.equals
		}), {});

		if(!all[filterState.key].multiple) {
			var firstKey = Object.keys(values)[0];

			return setFilters({
				...filters,
				[filterState.key]: {
					[firstKey]: values[firstKey]
				}
			})
		};

		var currentValues = filters[filterState.key] && typeof filters[filterState.key] == "object" ?
			{
				...filters[filterState.key],
				...values
			} :
			values;

		setFilters({
			...filters,
			[filterState.key]: currentValues
		});

		
	}


	const renderKeys = (
		<Select.Nice
			full
			className="ez-filter-keys"
			secondary
			onChange={(e) => {
				setFilterState({
					key: e,
					value: null,
					equals: true
				})
			}}
		>
			{
				allowed.map((k,i) => (
					<option key={`ez-filter-key-${i}`} selected={i==0} value={k}>{columns[k].title || capitalize(k)}</option>
				))
			}
		</Select.Nice>
	);

	const renderEqual =  (
		<div
			className={classNames("ez-filter-equal", {
				"negative": !filterState.equals,
				"disabled": all[filterState.key] ? !all[filterState.key].allowEquals : true
			})}
			title={!filterState.equals ? 'Is not' : 'Is'}
			onClick={(e) => (
				(all[filterState.key] ? all[filterState.key].allowEquals : true) &&
				setFilterState({
					...filterState,
					equals: !filterState.equals
				})
			)}
		>
			=
		</div>
	);
	

	const renderValues = function () {
		var key = (filterState.key || (allowed && allowed.length ? allowed[0] : null));
		
		if(!all[key]) {
			return null;
		}
		const all_values_array = Array.isArray(all[key].options) ? all[key].options : [...all[key].values];

		return (
			<Select.Nice
				full
				custom={all[key].custom}
				multiple={all[key].multiple}
				className="ez-filter-values"
				searchable
				secondary
				key={'val' + filterState.key}
				onChange={handleValueChange}
			>
				{
					all_values_array.map((v,i) => (
						<Select.Option key={`${filterState.key}-${i}`} value={v}>{v}</Select.Option>
					))
				}
			</Select.Nice>
		);
	}();

	return allowed.length ? (
		<div className="ez-filter-fields">
			{renderKeys}
			{renderEqual}
			{renderValues}
			<Button.Group nw space end className='mt-10'>
				<Button
					full
					cancel
					secondary
					value="Cancel"
					onClick={() => {
						setFilterOpen(false);
					}}
				/>
				<Button
					full
					secondary
					value="Apply"
					onClick={handleFilterApply}
				/>
			</Button.Group>	
		</div>
	) : null
		
}

const TableFooter = function (props) {
	
	const {
		options,
		scroll,
		page,
		setPage,
		start, end, total, limit,
		isLoading,
		isRemote,
		setSelected
	} = props;

	
	const pages = Math.max(0, Math.ceil(total / limit)),
		hasPagination = pages > 1 && options.paginate;
	
	var totalPages,
		currentPages,
		hasMoreLeft,
		hasMoreRight = 0;
	
	
	if(hasPagination) {
		//eslint-disable-next-line
		 totalPages = [...Array(pages).keys()], //eslint-disable-line
			currentPages = page > pages - 3 ? //eslint-disable-line
				totalPages.slice(Math.max(0, pages - 5), pages) : //eslint-disable-line
				 ((page < 5 || pages < 5) ? totalPages.slice(0, 5) : totalPages.slice(Math.max(0, page - 2), page + 3)), //eslint-disable-line
			 
			 hasMoreLeft = (page - 3) > 1, //eslint-disable-line
				hasMoreRight = (page + 3) < pages; //eslint-disable-line
	}

	const unselect = () => (isRemote ? setSelected([],[[],[]], false) : null);

	return (
		<div className="ez-footer">
				<div className="ez-info">
				{
					end > 0 ?
						(
							scroll ?
								(
								<span>Showing {numberWithCommas(total)} items</span>
								)
								: (
								<span>Showing {numberWithCommas(Math.max(1, start))} to {numberWithCommas(end)} of {numberWithCommas(total)} items</span>
								)
						)
						: null
				}
				</div>
				{hasPagination ?
					(
					<div
						className="ez-pagination">
						<Input.Group>
							<Button
								md
								disabled={!hasMoreLeft || isLoading}
								icon='chevron-double-left'
								className='ez-pg-navigate'
								onClick={(e) => (
									setPage(1),
									unselect()
								)}
							/>

							<Button

								md
								disabled={page <= 1 || isLoading}
								icon='chevron-left'
								className='ez-pg-navigate'
								onClick={(e) => (
									setPage(Math.max(1, page - 1)),
									unselect()
								)}
							/>
								{
									hasMoreLeft ?
										<span className="ez-pg-more">...</span>
										: null

								}
								{
									currentPages.map((p) => (
										<Button

											md
											onClick={(e) => (
												setPage(p + 1),
												unselect()
											)}
											disabled={isLoading}
											key={'ez-pg-button-'+p}
											className={`ez-pg-button${(p+1) == page ? ' active' : ''}`}
										>
											{p + 1}
										</Button>
									))
								}
								{
									hasMoreRight ?
										<span className="ez-pg-more">...</span>
										: null

								}
							<Button

								md
								disabled={page == pages || isLoading}
								icon='chevron-right'
								className='ez-pg-navigate'
								onClick={(e) => (
									setPage(Math.min(pages, page + 1)),
									unselect()
								)}
							/>
							<Button
							
								md
								disabled={!hasMoreRight || isLoading}
								icon='chevron-double-right'
								className='ez-pg-navigate'
								onClick={(e) => (
									setPage(pages),
									unselect()
								)}
							/>
						</Input.Group>
					</div>
					)
					: null
				}	
		</div>
		
	)
}

function Table(props) {
	
	const options = props;

	const [sorting, setSorting] = useController(options, "sorting", {
		type: false,
		column: null
	}, "onSortChange");

	const [search, setSearch] = useController(options, "search", null, "onSearchChange");

	const [filters, setFilters] = useController(options, "filters", {}, "onFiltersChange");

	const [page, setPage] = useController(options, "page", 1, "onPageChange");

	const [selected, setSelected] = useController(options, "selected", [], "onSelectChange");

	const [expanded, setExpanded] = useController(options, "expanded", {}, "onExpandChange");

	const [remote, setRemote] = useState({
		data: [],
		total: 0
	});

	const [cache, setCache] = useState({});

	const [loading, setLoading] = useState(false);

	const [filterOpen, setFilterOpen] = useState(false);

	const tableContainer = useRef(null);

	const scrollingRef = useRef();

	const [scrollFinish, setScrollFinish] = useState(true);
	
	const [horizontalScrolling, setHorizontalScrolling] = useState({
		scrolling: false,
		end: false
	});

	const [horizontalOverflow, setHorizontalOverflow] = useState(null);

	const rowHeight = useRef({});

	const firstRender = useRef(true);

	const [mobile, setMobile] = useState(window.innerWidth <= 1080);

	const [rowHeights, setRowHeights] = useState({
		items: {},
		start: 0
	});

	const [remoteRefresh, setRemoteRefresh] = useState(0); //Triggers a refresh on remote fetching
	
	const isRemote = typeof options.data === "function",
		getDataIndex = (data) => (md0('' + data.data.length + data.total + page + search + sorting.column + sorting.type + JSON.stringify(filters) + remoteRefresh)),
		data_index = getDataIndex(remote),
		isCache = (options.cache && cache[data_index]),
		columns = options.columns,
		columns_keys = Object.keys(columns),
		isLoading = options.loading || loading,
		scroll = (options.scrollable && !options.paginate) ? (/^([0-9]+(px|%)?|auto)$/.test(options.scrollable) ? options.scrollable : '100%') : false,
		scrollRowHeight = (scroll && options.scrollRowHeight && /^[0-9]+(px)?$/.test(options.scrollRowHeight) ? options.scrollRowHeight : false), 
		defaultScrollRowHeight = 50,
		hasBeforeColumn = (options.selectable || options.expandable),
		hasAfterColumn = (options.onAction),
		colSpan = columns_keys.length + (hasBeforeColumn ? 1 : 0) + (hasAfterColumn ? 1 : 0),
		isCustom = mobile && typeof options.onMobile === "function",
		hasActions = (options.selectable && selected.length);
	
	const ParseData = useMemo(() => {
		if(isRemote) {
			return {};
		}
		
		const data_indexed = {},
			data = [],
			filterValues = {};
	
		const hasCustomFormat = (typeof options.format === "function");
		const filterables = !options.filterable ? false : (options.filterable === true ? columns_keys : (Array.isArray(options.filterable) ? options.filterable : [options.filterable]));

		for(var i = 0; i < options.data.length; ++i) {

			//Data & Data_Indexed
			var index = random(10);
			var _row = (hasCustomFormat ? options.format(options.data[i], i) : options.data[i]);
			var row = !options.columnOrder ? { ..._row } : Object.keys(_row).sort((a, b) => (
				columns_keys.indexOf(a) - columns_keys.indexOf(b)
			)).reduce((o, v, i) => ({
				...o,
				[v]: _row[v]
			}), {});

	
			data_indexed[index] = row;
			data[data.length] = row;
		
			//Cache Data in Lowercase to optimize searching
			var dataCaching = {}
			for(var col in row) {
				dataCaching[col] = ('' + row[col]).toLowerCase()
			}

			

			Object.defineProperty(data_indexed[index], "__ez__", {
				enumerable: false,
				writable: false,
				value: {
					index: index,
					originalIndex: i,
					dataCaching: dataCaching
				}
			});

			//Filter Values
			if(filterables && filterables.length) {
				for(var name in row) {
					if(!columns[name] || (!~filterables.indexOf(name) && !columns[name].filter)) {
						continue;
					}
			
					filterValues[name] = filterValues[name] || {
						values: new Set(),
						options: columns[name].filter && columns[name].filter.options ?
							(Array.isArray(columns[name].filter.options) ? columns[name].filter.options :
								(columns[name].filter.options.__proto__.constructor.name == "Object" ? Object.keys(columns[name].filter.options) : null)) : null,
				
						multiple: columns[name].filter ? columns[name].filter.multiple : false,
						custom: columns[name].filter ? columns[name].filter.custom : false,
						allowEquals: columns[name].filter ? columns[name].filter.negative : false
					}

					if(row[name] && (typeof row[name] === "string" || typeof row[name] === "number")) {
						filterValues[name].values.add(row[name]);
					}
					
				}
			}
		}

		const filterAllowed = Object.keys(filterValues).filter((a) => (
			(filterValues[a].values.size <= 100) || filterValues[a].options
		));

		return {
			data,
			data_indexed,
			filter: {
				all: filterValues,
				allowed: filterAllowed,
				filterables: filterables
			}
		}
	}, [options.columns, options.data, options.format, options.filterable, options.columnOrder]);

	const FilterData = useMemo(() => {

		if(isRemote) {
			return {}
		}
		
		const { data,
			data_indexed,
			filter } = ParseData;
			
		const hasFilters = filter.filterables && Object.keys(filters).length;
		const hasSearching = (options.searchable === true || (Array.isArray(options.searchable) && options.searchable.length)) && typeof search === "string";
		const hasSorting = sorting && sorting.column && columns[sorting.column];

		const searchables = !hasSearching ? false : (options.searchable === true ? columns_keys : (Array.isArray(options.searchable) ? options.searchable : [options.searchable]));
		const sorter = hasSorting && (typeof columns[sorting.column].sort === 'function') ? columns.sort : (typeof options.onSort === 'function' ? options.onSort : function (x, y, type) {
			var [a, b] = type ? [y, x] : [x, y]; //Asc/Desc
			return (a < b ? -1 : (a > b ? 1 : 0));
		});

		var filtered = [],
			filtered_indexed = {};

		for(var i = 0; i < data.length; ++i) {

			var isIncluded = true;
			var row = data[i];

			if(hasFilters) {
			
				for(var column in filters) {
					var filtered_values = filters[column];
					
					if(!isIncluded) {
						break;
					}
					
					if(filtered_values === undefined || typeof filtered_values !== "object" || !Object.keys(filtered_values).length) {
						continue;
					}

					const customFilters = columns[column].filter &&
						columns[column].filter.options &&
						columns[column].filter &&
						columns[column].filter.options.__proto__.constructor.name == "Object" ? columns[column].filter.options : null;
				
				
					var filtered_values_keys = Object.keys(filtered_values);
				
					for(var v = 0; v < filtered_values_keys.length; v++) {
						var value = filtered_values_keys[v];
						var equals = filtered_values[value];
						var hasCustomFilter = customFilters && typeof customFilters[value] === "function";

						var matches = hasCustomFilter ?
							customFilters[value](row[column], i, data)
							: (row[column] == value);

						if((!matches && equals)) {
							isIncluded = false;
						}
						
						if((!equals && matches)) {
							isIncluded = false;
							break;
						}
						if(matches && equals || (!equals && v == (filtered_values_keys.length - 1) && !matches)) {
							isIncluded = true;
							break;
						}
					}
				}
			}

			if(!isIncluded) {
				continue;
			}

			if(hasSearching) {
				isIncluded = false;
				for(var searchable of searchables) {
					if(~row.__ez__.dataCaching[searchable].indexOf(search)) {
						isIncluded = true;
						break;
					}
				}
			}

			if(!isIncluded) {
				continue;
			}

			filtered[filtered.length] = row;
			filtered_indexed[row.__ez__.index] = row;
		}

		if(hasSorting) {
			timsort(filtered, (a, b) => (sorter(a[sorting.column], b[sorting.column], sorting.type)));
			//filtered.sort((a, b) => (sorter(a[sorting.column], b[sorting.column], sorting.type)));
		}
	

		const filtered_indexed_keys = Object.keys(filtered_indexed);
		const total = (options.total || filtered.length),
			limit = (options.limit || total);

		return {
			filtered,
			filtered_indexed,
			filtered_indexed_keys,
			total,
			limit
		}
		
	}, [ParseData, ParseData.data,  filters.allowed, filters, search, sorting.type, sorting.column, options.searchable, options.onSort, options.columns]);

	const PaginateData = useMemo(() => {
		if(isRemote) {
			return {}
		}

		const {
			filtered,
			filtered_indexed,
			filtered_indexed_keys,
			total,
			limit
		} = FilterData;

		const [start, end] = function () {
			var start = Math.max(0, (page - 1)) * limit,
				end = start + limit;
		
			if(end > total) {
				end = total;
			}
			return [start, end];
		}();
	
		const paginated = options.paginate ?
			filtered.slice(start, end) :
			filtered;

		return {
			start,
			end,
			paginated
		}

	}, [FilterData, page, options.paginate]);
 
	const {
		data,
		data_indexed, 
		filter,
		filtered,
		filtered_indexed,
		filtered_indexed_keys,
		total,
		limit,
		start,
		end,
		paginated,
		formatFilters
	} = useMemo(()=>{
			if(!isRemote) {
				return {
					...ParseData,
					...FilterData,
					...PaginateData
				}
			}
			
			var [remoteData, remoteTotal] = [remote.data, remote.total];

			const
				data_indexed = remoteData.reduce((o, v, i) => {
					var _row = ((typeof options.format === "function") ? options.format(v, i) : v);
					var row = !options.columnOrder ? { ..._row } : Object.keys(_row).sort((a, b) => (
						columns_keys.indexOf(a) - columns_keys.indexOf(b)
					)).reduce((o, v, i) => ({
						...o,
						[v]: _row[v]
					}), {});
					
					var index = md0(data_index + i);
					o[index] = row;
					Object.defineProperty(o[index], "__ez__", {
						enumerable: false,
						writable: false,
						value: {
							index: index,
							originalIndex: i,
						}
					});
					return o;
				},{}),
				data = Object.values(data_indexed),
				filterValues = !options.filterable ? {} : columns_keys.reduce((o, name, i) => {
					if(!columns[name].filter || !columns[name].filter.options) {
						return o;
					}
				
					var options = (Array.isArray(columns[name].filter.options) ? columns[name].filter.options :
						(columns[name].filter.options.__proto__.constructor.name == "Object" ? Object.keys(columns[name].filter.options) : null));
				
					if(!options) {
						return o;
					}

					o[name] = {
						options: options,
						multiple: columns[name].filter.multiple,
						custom: columns[name].filter.custom,
						allowEquals: columns[name].filter.negative
					}

					return o;

				}, {}),
				filter = {
				all: filterValues,
				allowed: Object.keys(filterValues)
				},
				filtered = data,
				filtered_indexed = data_indexed,
				filtered_indexed_keys = Object.keys(data_indexed),
				paginated = data,
				total = (remoteTotal || options.total || 0),
				limit = (options.limit || total),
				start = scroll ? data.length : (Math.max(0, (page - 1)) * limit),
				end = (start + limit) > total ? total : (start + limit),
				formatFilters = Object.keys(filters).reduce(
					(o, v, i) => {
						if(!filters[v] || !Object.keys(filters[v]).length) {
							return o;
						}

						o[v] = Object.keys(filters[v]).reduce((o, x, i) => {
							var equals = !filters[v][x] ? "negative" : "positive";
							o[equals].push(x);
							return o;

						}, {
							"positive": [],
							"negative": []
						});

						return o;
					},
					{}
				);

			const result = {
				data,
				data_indexed,
				filter,
				filtered,
				filtered_indexed,
				filtered_indexed_keys,
				total,
				limit,
				start,
				end,
				paginated,
				formatFilters
			}

			return result;

		}, [
			remote, isRemote,
			ParseData, FilterData, ParseData,
			page, filters, search, sorting,
			options.filterable, options.searchable, options.sortable, options.total, options.limit,
			options.paginate, options.scrollable, options.columnOrder,
			columns
	]);
	

	useEffect(() => {
		setSelected([],
			[[], []],
			false);
	}, [data, options.data, options.scrollable]);

	useEffect(() => {
		if(isRemote && scroll) {
			setRemote({
				data: [],
				total: 0
			});
			setScrollFinish(true);
		}
	}, [filters, search, sorting, scroll, isRemote]);
	
	useEffect(() => {
		if(!firstRender.current) {
			setRemoteRefresh(Math.random())
		}
	}, [isRemote, options.data]);

	useEffect(() => {
		
		if(isRemote && scroll && scrollFinish) {
			setLoading(true);

			Promise.resolve(options.data(start, limit, formatFilters, search, sorting))
				.then((res) => {
					if(!res || !Array.isArray(res.data) || isNaN(Number(res.total))) {
						console.warn(res);
						return Promise.reject("Ez-Table: Invalid response object received\r\nExcepting: '{\r\n data: Array,\r\n total: Integer\r\n}'");
					}

					setScrollFinish(false);

					setRemote({
						data: [
							...remote.data,
							...res.data
						],
						total: res.total
					});
					
				
				})
				.catch((err) => {
					console.error(err);
				})
				.then(() => {
					setLoading(false);
					setSelected([], [[],[]], false);
				});
		}
	}, [isRemote, options.data, filters, search, sorting, scroll, scrollFinish, remote])
	
	useEffect(() => {
		if(isRemote && !scroll) {
			
			if(isCache) {
				return setRemote(cache[data_index]);
			}

			setLoading(true);
			Promise.resolve(options.data(start, limit, formatFilters, search, sorting))
				.then((res) => {
					if(!res || !Array.isArray(res.data) || isNaN(Number(res.total))) {
						console.warn(res);
						return Promise.reject("Ez-Table: Invalid response object received\r\nExcepting: '{\r\n data: Array,\r\n total: Integer\r\n}'");
					}

					setRemote({
						data: res.data,
						total: res.total
					});
					
					if(res.data.length) {
						var dataIndex = getDataIndex(res);
						setCache({
							...cache,
							[dataIndex]: res
						});
					
					}
				})
				.catch((err) => {
					console.error(err);
				})
				.then(() => {
					setLoading(false);
					
					setSelected([], [[],[]], false);
				});
			
		}
	},[isRemote, options.data, start, end, filters, search, sorting, scroll, isCache, data_index])
	
	useEffect(() => {
		const handleResize = function (e) {
			setMobile((window.innerWidth <= 1080));
			setHorizontalOverflow((tableContainer.current && tableContainer.current.scrollWidth > tableContainer.current.clientWidth));
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

	useEffect(() => {
		firstRender.current = false;
	}, []);
	
	const handleColClick = function (name, col) {
		
		return function (e) {
			if((options.sortable === true || (Array.isArray(options.sortable) && options.sortable.includes(name))) && !isLoading && paginated && paginated.length) {
				setSorting({
					type: !sorting.type,
					column: name
				});
			}

			if(typeof col.onClick === "function") {
				col.onClick({
					...col,
					isColumn: true
				}, null, 0, e);
			}
		}
	}

	const handleColDoubleClick = function (name, col) {
		
		return function (e) {
			if((options.sortable === true || (Array.isArray(options.sortable) && options.sortable.includes(name))) && !isLoading && paginated && paginated.length) {
				setSorting({
					type: false,
					column: false
				});
			}

			if(typeof col.onDoubleClick === "function") {
				col.onDoubleClick({
					...col,
					isColumn: true
				}, null, 0, e);
			}
		}
	}

	const handleRowClick = function (row, i) {
		return function (e) {
			var isCheckbox =
				e.target.classList.contains("ez-rb-container") ||
				e.target.parentNode.classList.contains("ez-rb-container") ||
				e.target.parentNode.parentNode.classList.contains("ez-rb-container");
			
			if(isCheckbox) {
				return false;
			}
			if(typeof options.onRowClick === "function") {
				options.onRowClick(row, i, e);
			}
		}
	}

	const handleCellClick = function (column, cell, i, row) {
		return function (e) {
			if(typeof columns[column].onClick === "function") {
				columns[column].onClick(cell, row, i, e);
			}
		}
	}

	const handleCellMouseOver = function (column, cell, i, row) {
		return function (e) {
			if(typeof columns[column].onMouseOver === "function") {
				columns[column].onMouseOver(cell, row, i, e);
			}
		}
	}
	
	const handleSearch = debounce(function (e) {
		const { target } = e;
		const value = target.value;

		if(!value || !value.trim() || !options.searchable) {
			if(search) {
				setSearch(false);
			}
			return false;
		}
		
		setPage(1);
		setSearch(isRemote ? value : value.toLowerCase());
		
	}, isRemote ? 500 : 1);
	
	const handleScroll = function (e) {
		var _horizontalScrolling = {
			scrolling: false,
			end: false
		}

		if(e.currentTarget.scrollLeft > 0) {
			_horizontalScrolling.scrolling = true;
		}
		if(e.currentTarget.scrollLeft + e.currentTarget.offsetWidth >= e.currentTarget.scrollWidth) {
			_horizontalScrolling.end = true;
		}

		setHorizontalScrolling(_horizontalScrolling);

		if(!scroll) {
			return false;
		}
		
		const scrollHeight = isNaN(parseInt(scroll)) ? 100 : parseInt(scroll);

		if(!scrollFinish && e.currentTarget && ((e.currentTarget.scrollTop + e.currentTarget.clientHeight + scrollHeight)  >= e.currentTarget.scrollHeight)) {
			setScrollFinish(true);
		}
	}
	
	const handleRowSelect = function (row, originalIndex, customIndex, e) {	
		var updateSelected = !~selected.indexOf(customIndex) ? [
			...selected,
			customIndex
		] : [
				...selected.slice(0, selected.indexOf(customIndex)),
				...selected.slice(selected.indexOf(customIndex) + 1, selected.length)
			];
		
		//Forward to onChange listener
		var onChangeParams = [
			updateSelected.map((i) => filtered_indexed[i]), //rows
			updateSelected //selected
		];
		
		return setSelected(updateSelected, onChangeParams);
	}

	const handleRowExpand = function (row, originalIndex, customIndex, e) {
		var expandedContent = typeof options.onExpand === "function" ?
			options.onExpand(filtered_indexed[customIndex], originalIndex, !expanded[customIndex]) :
			"Nothing to see here";

		var updateExpanded = !expanded[customIndex] ? {
			...expanded,
			[customIndex]: expandedContent
		} : {
				...expanded,
				[customIndex]: undefined
			};
		
		var onChangeParams = [
			Object.keys(updateExpanded).map((i) => filtered_indexed[i]), //rows
			updateExpanded //expanded
		];
	
		return setExpanded(updateExpanded, onChangeParams);
	}

	const handleScrollRowHeight = (e, paginatedIndex) => {
		if(!e) {
			return false;
		}
		rowHeight.current[data_index] = rowHeight.current[data_index] || {};
		rowHeight.current[data_index][paginatedIndex] = e.offsetHeight;
	}

	const selectAll = (
		<Input
			type="checkbox"
			secondary
			checked={selected.length > 0}
			incomplete={selected.length < filtered_indexed_keys.length}
			onChange={
				(e) => {
					var updateSelected = selected.length === filtered_indexed_keys.length ?
						[] :
						filtered_indexed_keys;

					var onChangeParams = [
						updateSelected.map((i) => (filtered_indexed[i])), //rows
						updateSelected, //selected
						true //isSelectAll
					];

					return setSelected(updateSelected, onChangeParams);
				}
			}
			value={
				selected.length > 0 ? numberWithCommas(selected.length) + ' Selected' : ''
			}	
		/>
	
	);

	const actionsAll = (
		<div className="ez-column-actions">
				{
					options.onAction && (typeof options.onAction === "function") && options.selectable && selected.length > 0 ?
						options.onAction(
							selected.map((i) => (data_indexed[i])), //rows
							selected.map((i) => (
								data_indexed[i] ?
									data_indexed[i].__ez__.originalIndex :
									-1)
							), //indexes
							true //isBulk
						)
						: null
				}
		</div>
	)


	const selectRow = (row, originalIndex, customIndex) => (
			<Input
				key={`ez-select-row-check-${customIndex}`}
				secondary
				type="checkbox"
				checked={~selected.indexOf(customIndex)}
				onChange={(e) => (
						handleRowSelect(row, originalIndex, customIndex, e)
				)}
			/>
	);

	const expandRow = (row, originalIndex, customIndex) => (
		<Icon
			name={
				!expanded[customIndex]
				? 'chevron-right' : 'chevron-down'
			}
			className='ez-expand-icon'
			onClick={(e) => (
				handleRowExpand(row, originalIndex, customIndex, e)
			)}
		>

		</Icon>	
	)
	
	const beforeColumn = (
		<th className="ez-column-before">
			<div
				className='ez-cb-container'
				
			>
				{
					options.expandable ?
						<div className='ez-column-expand'>
							<Icon name='chevron-down' />
						</div>
						: null
				}
				{
					options.selectable && !selected.length ?
					 selectAll 
						: null
				}
				
			</div>
			
		</th>
	);

	const beforeRow = (row, originalIndex, customIndex) => (
		<td key={`ez-row-before-${customIndex}`} className={`ez-row-before ez-rb-${customIndex}`}>
			<div className='ez-rb-container'>
				{
					options.expandable ?
						expandRow(row, originalIndex, customIndex)
						: null
				}
				{
					options.selectable ?
						selectRow(row, originalIndex, customIndex)
						: null
				}
				
			</div>

		</td>
	);

	const afterColumn = (
		<th className="ez-column-after">
			<div></div>
		</th>
	);

	const afterRow = (originalIndex, customIndex) => (
		<td key={`ez-row-after-${customIndex}`} className={`ez-row-after ez-rb-${customIndex}`}>
			<div className="ez-row-actions">
				{
					options.onAction && (typeof options.onAction === "function") ?
						options.onAction([data_indexed[originalIndex]], [originalIndex])
						: null
				}
			</div>
		</td>
	);

	const bulkActions = (
		<div className='ez-bulk-actions'>
			{
				options.expandable ?
					<div className='ez-column-expand'></div>
					: null
			}
			<div className='ez-select-all' title={
				options.selectable ? (selected.length === filtered_indexed_keys.length ?
					"Unselect All"
					: "Select All") : ""
				}
			>
				{selectAll}
			</div>
			{actionsAll}
		</div>
	);

	const renderColumns = function () {		
		const mainClassname = classNames(
			"ez-columns",
			{
				"ez-none": hasActions
			}
		);

		return (
			<>
				{
					false ?
						(
							<tr className='ez-bulk-actions-row'>
								<td colSpan={colSpan}>
									{bulkActions}
								</td>
							</tr>
						)
						: null
				}
				<tr className={mainClassname}>
					{
						hasBeforeColumn ?
							beforeColumn
							:
							null
					}
					{
						columns_keys.map((i) => (
							<th key={`head-${i}`} className={`ez-head-${i}${sorting.column === i ? ' sorted' : ''}`}
								onClick={
									handleColClick(i, columns[i])
								}
								onDoubleClick={
									handleColDoubleClick(i, columns[i])
								}
							>
								<div>
									<span>{columns[i].value || columns[i].title}</span>
									<Icon
										name={sorting.type ? 'sort-amount-down' : 'sort-amount-up'}
										className='ez-head-sort-icon'
									/>
								</div>
							</th>
						))
					}
					{
						hasAfterColumn ?
							afterColumn
							: null
					}
				</tr>

			</>
		)
	}();

	const renderCell = (column, cell, i, row) => {
		if(!columns[column] || typeof columns[column] !== "object") {
			return null;
		}
		var cell = (typeof columns[column].onRender === "function") ? columns[column].onRender(cell, row, i) : cell;
		return (
			<td key={`ez-td-${column}-${i}`} onClick={handleCellClick(column, cell, i, row)} onMouseOver={handleCellMouseOver(column, cell, i, row)}>
				{cell}
			</td>
		)
	};

	const getRowProps = (row, originalIndex, customIndex) => {
		var className = classNames(
			'ez-row',	
			`ez-r-${originalIndex}`,
			{
				'ez-row-custom': isCustom,
				'ez-row-selected': options.selectable && ~selected.indexOf(customIndex),
				'ez-row-expanded': options.expandable && expanded[customIndex]
			}
		);

		var rowProps = {
			onClick: handleRowClick(row, originalIndex),
			className: className
		}

		if(typeof options.onRowRender === "function") {
			var customRowProps = options.onRowRender(row, originalIndex);
			if(customRowProps === false || customRowProps === null) {
				return null;
			}
			if(customRowProps && typeof customRowProps === "object" && customRowProps.__proto__.constructor.name == "Object") {
				rowProps = {
					...rowProps,
					...customRowProps
				}
			}
		}

		return rowProps;
	}

	const renderRowCustom = (row, paginatedIndex) => {
		var originalIndex = row ? row.__ez__.originalIndex : -1;
		var customIndex = row ? row.__ez__.index : -1;
		var customRow = options.onMobile(row, originalIndex);

		var rowProps = getRowProps(row, originalIndex, customIndex);

		//Select on Touch Press
		var touchTimeout;
		var handleTouchStart = function (e) {
			touchTimeout = setTimeout(function () {
				handleRowSelect(row, originalIndex, customIndex, e);
			}, 300);
			return touchTimeout;
		}
		var handleTouchEnd = function (e) {
			clearTimeout(touchTimeout);
		}
		var handleTouchMove = function (e) {
			clearTimeout(touchTimeout);
		}

		var expandRow = options.expandable ? (
			<div className='ez-row-custom-expand-container' onClick={(e) => (
				handleRowExpand(row, originalIndex, customIndex, e)
			)}>
				<Icon
					name={
						!expanded[customIndex]
							? 'chevron-down' : 'chevron-up'
					}
					className='ez-expand-icon'
					
					/>
			</div>
		) : null;

		var expandedRow = options.expandable && expanded[customIndex] ? expanded[customIndex] : null;

		return (
			<tr
				{...rowProps}
				ref={(e) => (
					handleScrollRowHeight(e, paginatedIndex)
				)}	
				key={`ez-row-custom-${originalIndex}`}
			>
				<td
					colSpan={colSpan}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					onTouchMove={handleTouchMove}
				>
					{customRow}
					{expandRow}
					{expandedRow}
				</td>
			</tr>
		);
	}

	const renderRow = (row, paginatedIndex) => {

		var originalIndex = row ? row.__ez__.originalIndex : -1;
		var customIndex = row ? row.__ez__.index : -1;

		var cells = Object.keys(row).map((name) => (renderCell(name, row[name], originalIndex, row)));

		var rowProps = getRowProps(row, originalIndex, customIndex);

		var hasBeforeActions = options.selectable || options.expandable;
		var hasAfterActions = options.onAction;

		return (
			<>
				<tr
					{...rowProps}
					ref={(e) => (
						handleScrollRowHeight(e, paginatedIndex)
					)}
					key={`ez-row-${originalIndex}`}

				>
					{hasBeforeActions ?
						beforeRow(row, originalIndex, customIndex)
						: null
					}

					{cells}

					{
						hasAfterActions ?
							afterRow(originalIndex, customIndex)
							: null
					}
				</tr>

				{
					options.expandable && expanded[customIndex] ?
						(
							<tr className={`ez-expanded-row ez-ex-r-${originalIndex}`} key={`expanded-row-${originalIndex}`}>
								<td colSpan={colSpan}>
									{expanded[customIndex]}
								</td>
							</tr>
						)
						:
						null
				}
			</>
		);

	}

	const renderAppliedFilters = Object.keys(filters).flatMap((column) => (
		Object.keys(filters[column]).map((value, i) => (
			<div key={"ez-af-"+column+i} className="ez-af">
				<span className="ez-af-name">{columns[column].title || capitalize(column)}</span>
				<span className="ez-af-equals">{filters[column][value] ? 'is' : 'is not'}</span>
				<span className="ez-af-value">{capitalize(value)}</span>
				<Icon onClick={(e) => {
					var equals = filters[column][value];
					
					//eslint-disable-next-line
					var {
						[value]: equals,
						...removedFilter
					} = filters[column];
					
					//eslint-disable-next-line
					setFilters({
						...filters,
						[column]: removedFilter
					});
		
					setPage(1, [1], false);
					setSelected([], [[],[]], false);

				}} name="close" />
			</div>
		))
	));
	
	const renderEmpty = (
		<tr className='ez-empty-table-row'>
			<td colSpan={colSpan}>
				<div className='ez-empty-table'>{isLoading ? (
					<Loading center />
					) : options.empty}
				</div>
			</td>
		</tr>
	);


	const rowVirtualizer = useVirtual({
		size: paginated.length,
		parentRef: tableContainer,
		estimateSize: useCallback(
			(i) => {
				var height = scrollRowHeight || ((rowHeights[data_index] && rowHeights[data_index].items[i]) ? rowHeights[data_index].items[i] : defaultScrollRowHeight);
				/*
				if(height !== 50) {
					console.log(height, i)
				}
				*/
				return height;
			},
			[rowHeights, data_index, options.scrollRowHeight],
		),

		keyExtractor: useCallback(
			(i) => (
				data_index + i
			)
		,[data_index]),
		overscan: 10,
		scrollToFn: useCallback((offset, defaultScrollTo) => {
			const duration = 1000;
			const start = tableContainer.current.scrollTop;
			const startTime = (scrollingRef.current = Date.now());
			
			const easeInOutQuint = function(t) {
				return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
			}
			  
			const run = () => {
			  if (scrollingRef.current !== startTime) return;
			  const now = Date.now();
			  const elapsed = now - startTime;
			  const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
			  const interpolated = start + (offset - start) * progress;
		
			  if (elapsed < duration) {
				defaultScrollTo(interpolated);
				requestAnimationFrame(run);
			  } else {
				defaultScrollTo(interpolated);
			  }
			};
		
			requestAnimationFrame(run);
		}, [])
	});

	const rowStartSize = rowVirtualizer.virtualItems.length ? rowVirtualizer.virtualItems[0].start : 0

	const renderRows = function () {
		if(!paginated || !paginated.length) {
			return renderEmpty;
		}
		
		const rowRenderer = isCustom ? renderRowCustom : renderRow;

		if(scroll) {
			return rowVirtualizer.virtualItems.map(virtualRow => rowRenderer(paginated[virtualRow.index], virtualRow.index));
		}
		
		return paginated.map(rowRenderer);
	}();


	const passState = {
		options,
		columns,
		filters,
		scroll,
		setFilters,
		setSelected,
		isLoading,
		filter,
		page,
		filterOpen,
		setFilterOpen,
		setPage,
		start, end, total, limit,
		isRemote,
	};

	const className = classNames("ez-table", props.className, {
		"ez-table-fixed": options.fixed,
		"ez-table-loading": isLoading,
		"ez-table-expandable": options.expandable,
		"ez-table-custom": isCustom,
		"ez-table-action-hidden": options.actionHidden,
		"ez-has-filtering": options.filterable,
		"ez-has-searching": options.searchable,
		"ez-overflow-horizontal": horizontalOverflow || (tableContainer.current && tableContainer.current.scrollWidth > tableContainer.current.clientWidth),
		"ez-scrolling-horizontal": horizontalScrolling.scrolling,
		"ez-scrolling-horizontal-end": horizontalScrolling.end,
	});

	return (
		<div className={className} style={{
			height: options.height
		}}>
			<div className="ez-tools">
				<div className="ez-search-filter">
					{
						options.filterable ?
							<div className="ez-add-filter">
								<Dropdown
									arrow
									mobileLarge
									handle={
										<Button
											noMobile
											disabled={!options.filterable || !filter.allowed.length}
											value='Filters'
											className='ez-open-filters'

											iconRight='chevron-down'
											iconClassName='icon-20 icon-bold'
											large
											onClick={(e) => (
												setFilterOpen(!filterOpen)
											)}
										/>
									}
									medium
									active={filterOpen}
									onOutsideClick={(e) => (
										setFilterOpen(false)
									)}
								>
									<div className="ez-filter">
										<TableFilter {...passState} />
									</div>
								</Dropdown>
							</div>
						: null
					}
				
					{
						options.searchable ? 
							<div className="ez-search">
								<Input
									secondary lg auto type='text'
									disabled={!isRemote && (!paginated || !paginated.length) && !search}
									placeholder='Search'
									className='form-control' before={
									<Icon name='search' />
								}
								onChange={handleSearch} />
							</div>
							: null
					}
				</div>
				<div className="ez-applied-filters">
					{renderAppliedFilters}
				</div>
			</div>
			
			<div ref={tableContainer}
				className={
					classNames(
						"ez-table-container",
						{
							"ez-tc-scroll": scroll,
							"ez-tc-loading": isLoading
						}
					)
				}
				style={
					scroll ? {
						height: scroll
					} : null
				}
				onScroll={handleScroll}
			>
				{hasActions ? (
					<div className='ez-bulk-actions-row'>
						{bulkActions}
					</div>
				) : null}
				<div
					className={'ez-table-inner-container'}
					style={scroll && paginated && paginated.length ? {
						height: `${rowVirtualizer.totalSize}px`,
						paddingTop: `${rowStartSize}px`,
						width: '100%',
						position: 'relative',
					  } : null}
				>
					<table>
						{hasBeforeColumn ?
							(
								<colgroup>
									{
										[...Array(colSpan).keys()].map((i) => (
											<col key={i} className="ez-col" />
										))
									}
								</colgroup>
							)
							 : null
						}
						<thead>
							{renderColumns}
						</thead>
						<tbody ref={(e) => {
							if(!scroll || !paginated || !paginated.length) {
								return false;
							}
							if(rowVirtualizer.virtualItems.length && (!rowHeights[data_index] || rowVirtualizer.virtualItems[0].index >= rowHeights[data_index].start)) {
								setRowHeights({
									...rowHeights,
									[data_index]: {
										items: {
											...rowHeight.current[data_index]
										},
										start: Object.keys(rowHeight.current[data_index]).slice(-1)[0]
									}
								});
							}
						}}>
							{renderRows}
						</tbody>
					</table>

					
				</div>
				
			</div>
			
			<TableFooter {...passState} />
		</div>
	);
}

Table.defaultProps = {
	data: [],
	columns: {},
	empty: (
		<div className={"ez-default-empty"}>No items found.</div>
	), //Show when empty

	height: '100%',
	sortable: true,
	filterable: true,
	searchable: true,
	paginate: true,
	selectable: true,
	columnOrder: false,
	cache: true,
	limit: 10
}

Table.propTypes = {
	/**
	 * An array of data objects (Memoized)
	 * <br/>- OR -
	 * <br/>A memoized callback function `(offset, limit, filters, search, sort) => Promise({data, total})`
	 */
	data: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]),

	/**
	 * Table columns (Object must be memoized)
	 */
	columns: PropTypes.object,

	/**
	 * Pagination & Scrolling Item Limit
	 */
	limit: PropTypes.number,

	/**
	 * Loading state
	 */
	loading: PropTypes.bool,

	/**
	 * Render Component when no items found
	 */
	empty: PropTypes.node,

	/**
	 * Table height
	 */
	height: PropTypes.string,

	/**
	 * Fixed Table Layot
	 */
	fixed: PropTypes.bool, 

	/**
	 * A memoized callback function for formatting the data. `(row, i) => ({})`
	 * <br/> You should probably use this if your data object keys doesn't match the column keys, or the order is not the same.
	 */
	format: PropTypes.func, 

	/**
	 * Enable pagination
	 */

	paginate: PropTypes.bool,

	/** 
	 * Enable Virtual Scrolling and set the scrolling height.
	 * <br/>It can be either `auto`, a percentage i.e `100%`, or pixels i.e `500px` 
	 */
	scrollable: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	
	/**
	 * Enable sorting, either an Array of column names or `true`
	 */
	sortable: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	]),

	/**
	 * Enable filtering, either an Array of column names or `true`
	 */
	filterable: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	]),

	/**
	 * Enable searching
	 */
	searchable: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	]),

	/**
	 * Enable selecting. Selection on mobile works by touching and holding a row.
	 */
	selectable: PropTypes.bool,

	/**
	 * Enable expanding rows. Must also set `onExpand`.
	 */
	expandable: PropTypes.bool,

	/**
	 * Render expanded rows. `(row, i, isExpanded) => (<MyCustomExpandedData/>)`
	 */
	onExpand: PropTypes.func,

	/**
	 * Render action buttons. `(row, i , isBulk) => (<MyCustomActions/>)`
	 */
	onAction: PropTypes.func,

	/**
	 * Only show row actions on hover
	 */
	actionHidden: PropTypes.bool,

	/**
	 * Custom sorting function. `(a,b) => ()`
	 */
	onSort: PropTypes.func,
	
	/**
	 * Turn on responsive mode & render custom rows for Mobile.
	 * `(row, i) => (<MyCustomRow/>)`
	 */
	onMobile: PropTypes.func,
	
	/**
	 * Called on Row Render. `(row, i) => ()`
	 * <br/>Return `false` to skip row.
	 * <br/>Return an object of props that will be forwarded as row props.
	 */
	onRowRender: PropTypes.func,

	/**
	 * Set onClick for row. `(row, i) => ()`
	 */
	onRowClick: PropTypes.func,

	/**
	 * Controlled pagination page state
	 */
	page: PropTypes.number,

	/**
	 * Controlled page state setter (Simpler alternative than using `onPageChange` for only updating controlled state)
	 */
	setPage: PropTypes.func,

	/**
	 * Fires on page change. (page) => ()
	 * <br/> Return `false` to prevent default.
	 */
	onPageChange: PropTypes.func,

	/**
	 * Default pagination page
	 */
	defaultPage: PropTypes.number,

	/**
	 * Controlled search state
	 */
	search: PropTypes.string,

	/**
	 * Controlled search state setter (Simpler alternative than using `onSearchChange` for only updating controlled state)
	 */
	setSearch: PropTypes.func,

	/**
	 * Fires on search change. (value) => ()
	 * <br/> Return `false` to prevent default.
	 */
	onSearchChange: PropTypes.func,

	/**
	 * Default Search Value
	 */
	defaultSearch: PropTypes.string,
	
	/**
	 * Controlled selected rows state (An array of custom row index keys that is calculated on row rendering)
	 */
	selected: PropTypes.array,

	/**
	 * Controlled selected state setter (Simpler alternative than using `onSelectChange` for only updating controlled state)
	 */
	setSelected: PropTypes.func,

	/**
	 * Fires on selection change. (rows, selected, isSelectAllAction) => ()
	 * <br/> Return `false` to prevent default.
	 */
	onSelectChange: PropTypes.func,

	/**
	 * Controlled expanded rows state (An object: {customRowIndexKey: expandedContent})
	 */
	expanded: PropTypes.object,

	/**
	 * Controlled expanded state setter (Simpler alternative than using `onExpandChange` for only updating controlled state)
	 */
	setExpanded: PropTypes.func,

	/**
	 * Fires on expanded rows change. (rows, expanded) => ()
	 * <br/> Return `false` to prevent default.
	 */
	onExpandChange: PropTypes.func,

	/**
	 * Controlled filters state (An object: { columnKey: { filterValue: isNotNegative }} )
	 */
	filters: PropTypes.object,

	/**
	 * Controlled filters state setter (Simpler alternative than using `onFiltersChange` for only updating controlled state)
	 */
	setFilters: PropTypes.func,

	/**
	 * Fires on filters change. (filters) => ()
	 * <br/> Return `false` to prevent default.
	 */
	onFiltersChange: PropTypes.func,

	/**
	 * Controlled sort state (An object: {`type`: isAscending, `column`: columnKey} )
	 */
	sorting: PropTypes.object,

	/**
	 * Controlled sorting state setter (Simpler alternative than using `onSortChange` for only updating controlled state)
	 */
	setSorting: PropTypes.func,

	/**
	 * Fires on sort change. (sorting) => ()
	 * <br/> Return `false` to prevent default.
	 */
	onSortChange: PropTypes.func,
	
	/**
	 * Caching data for Remote Mode
	 */
	cache: PropTypes.bool,
	
	/**
	 * Virtual Row Height is automatically calculated when scrolling.
	 * If your rows have a static height, you can set it here.
	 */
	scrollRowHeight: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	
	/**
	 * The column keys should match the row keys order. This is disabled for best performance. 
	 */
	columnOrder: PropTypes.bool,
}

export default Table;