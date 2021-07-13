import { func } from "prop-types";

export function filterProps (fromProps, extraProps=[], onlyCustom=false) {
	const insideProps = [
		'icon', 'effect', 'md', 'sm', 'lg', 'xl', 'large', 'small', 'medium',
		'children', 'active', 'setActive', 'visible', 'isVisible', 'hasIcon',
		'primary', 'secondary', 'rounded', 'danger', 'warning', 'info', 'success',
		'loading', 'transparent', 'boxShadow', 'float',
		'noPad', 'noPadding', 'noBodyPad', 'bodyClassname', 'bodyClassName', 'auto', 'center',
		'noBorder', 'noShadow', 'full', 'actionHidden', 'ns', 'noWrap',
		'simple', 'vertical', 'space',
		'cancel', 'iconClassName', 'arrow', 'border', 'arrowBorder', 'circle', 'reverse', 'gradient',
		'incomplete', 'dot', 'after', 'before', 'mobileLeft', 'rainbow', 'effect', 'stretch', 'solid',
		"iconRight", "icon", "onNumber", "noButtons", "container", "incremental", "max", "min", "containerClassName",
		"nw", "nm", "actionHidden", 'overlay', "start", 'mobileLarge', 'noMobile', 'mb','containerOnClick', 'label', 'description'
	];

	const toFilter = onlyCustom ? extraProps : [
		...insideProps,
		...extraProps
	];

	var filteredProps = {}
	for (var k in fromProps) {
		if (toFilter.includes(k) || !fromProps.hasOwnProperty(k)) continue;
		filteredProps[k] = fromProps[k];
	}
	return filteredProps;
}

export function mainClasses(props){
	return {
		'primary': props.primary,
		'secondary': props.secondary,
		'danger': props.danger,
		'warning': props.warning,
		'success': props.success,
		"info": props.info,
		'active': props.active,
		'loading': props.loading,
		'readonly': props.readOnly,
		'disabled': props.disabled,
		'sm': props.sm || props.small,
		'md': props.md || props.medium,
		'lg': props.lg || props.large,
		'xl': props.xl || props.xlarge,
		'auto': props.auto || props.full,
		'responsive': (props.before || props.after) && props.responsive,
		'no-shadow': props.noShadow,
		'no-border': props.noBorder
	}
}

export function refHandler(currentRef, forwardRef) {
	return function (e) {
		var refs = [currentRef, forwardRef];
		for(var ref of refs) {
			if(ref) {
				if(typeof ref === "function") {
					ref(e);
				}
				if(ref.hasOwnProperty('current')) {
					ref.current = e;
				}
			}
		}
	}
};

export function classNames() {
  
	var className = [];
	for(var i = 0; i < arguments.length; i++){
	  var cls = arguments[i];
	  if(typeof cls === "string") {
		className.push(cls);
		continue;
	  }
	  if(Array.isArray(cls)) {
		className = className.concat(cls);
		continue;
	  }
	  if(typeof cls == "object") {
		for(var keyc in cls) {
		  if(!cls[keyc]) {
			continue;
		  }
		  className.push(keyc);
		}
	  }
	}
	return className.map((x,i,self)=> ( self.indexOf(x) === i ? x.trim() : null)).filter((x) => x).join(' ');
}
  

export function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
	  const later = () => {	
		timeout = null;
		func(...args);
	  };
	  clearTimeout(timeout);
	  timeout = setTimeout(later, wait);
	};
};

export function ago(sec) {
	var suffix = (sec < 0) ? "left" : "ago";
	sec = Math.abs(sec);
	var exact = null;
	var formatted = [];
	var approx = null;
	var now = "Just now";

	var relatives = {
		"second": sec % 60,
		"minute": (sec / 60) % 60,
		"hour": (sec / (60 * 60)) % 24,
		"day_formatted": (sec / (60 * 60 * 24)),
		"day": (sec / (60 * 60 * 24)) % 7,
		"week": (sec / (60 * 60 * 24 * 7)) % 4,
		"month": (sec / (60 * 60 * 24 * 7 * 4)) % 12,
		"year": (sec / (60 * 60 * 24 * 7 * 4 * 12)),
	}

	for (var key in relatives) {
		var value = Math.max(0, Math.floor(relatives[key]));
		var ss = (value <= 1) ? "" : "s"; var sp = " "; var zz = (value < 10) ? "0" : "";

		if (value > 0 && key != "day_formatted") {
			approx = [value, (key + ss), suffix].join(sp);
			exact = [value, (key + ss), (exact || suffix)].join(sp);		
		}

		if (formatted.length < 4 && (formatted.length < 2 || value != "0")) {
			formatted.unshift(zz + value)
		}
	}

	return {
		"approx": approx || now,
		"exact": exact || now,
		"formatted": formatted.join(":")
	}
}

export function copy (text) {
	if (window.clipboardData && window.clipboardData.setData) {
		return window.clipboardData.setData("Text", text);
	} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed";
		document.body.appendChild(textarea);
		textarea.select();
		try {
			document.execCommand("copy");
			return true;
		} catch (ex) {
			console.warn("Copy to clipboard failed.", ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
}
export function select (el) {
	var win = window;
	var doc = win.document, sel, range;
	if (win.getSelection && doc.createRange) {
		sel = win.getSelection();
		range = doc.createRange();
		range.selectNodeContents(el);
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (doc.body.createTextRange) {
		range = doc.body.createTextRange();
		range.moveToElementText(el);
		range.select();
	}
}
export function week() {
	var labels = ['Sun','Mon','Tue','Wen','Thu','Fri','Sat'];
	var day = (new Date()).getUTCDay();
	var sorted = [];
	for(var i = 0; i < labels.length; i++){
		var key = (labels.length - day + i) % labels.length;
		sorted[key] = labels[i];
	}
	return sorted;
}

export function numberWithCommas(x) {
    return x && x.toString ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0';
}

export function capitalize(s) {
	return s.split(' ').map(function (str) { return str.charAt(0).toUpperCase() + str.substring(1); }).join(' ');
}

export function md0(s) {
	var h = 0, s='' +s, l = s.length, i = 0;
	if ( l > 0 )
	  while (i < l)
		h = (h << 5) - h + s.charCodeAt(i++) | 0;
	return h.toString(36);
};

export function random(len, chars="Aa#") {
	
	chars = (!chars || typeof chars !== "string" || chars.length > 4) ? "Aa#$" : chars, //eslint-disable-line
	len = len || 0;

	var charsets = {
			"A": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"a": "abcdefghijklmnopqrstuvwxyz",
			"#": "0123456789",
			"$": "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\"
		},
		fullCharset = "",
		generated = "";

	for(var charset in charsets) {
		if(~chars.indexOf(charset)) {
			fullCharset += charsets[charset];
		}
	}

	for(var i = 0; i < len; i++){
		generated += fullCharset[Math.floor(Math.random() * fullCharset.length)];
	}

	return generated;
}
  
String.prototype.md0 = function () { return md0(this) };

String.prototype.capitalize = function () { return capitalize(this) };

String.prototype.format = String.prototype.format || function () {
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

Array.prototype.searchObjects = function (key, value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][key] === value) {
			return this[i];
		}
	}
}


export function timsort(array, compare, lo, hi) {
	'use strict';
 
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	  }
	}
  
	var DEFAULT_MIN_MERGE = 32;
  
	var DEFAULT_MIN_GALLOPING = 7;
  
	var DEFAULT_TMP_STORAGE_LENGTH = 256;
  
	var POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
  
	function log10(x) {
	  if (x < 1e5) {
		if (x < 1e2) {
		  return x < 1e1 ? 0 : 1;
		}
  
		if (x < 1e4) {
		  return x < 1e3 ? 2 : 3;
		}
  
		return 4;
	  }
  
	  if (x < 1e7) {
		return x < 1e6 ? 5 : 6;
	  }
  
	  if (x < 1e9) {
		return x < 1e8 ? 7 : 8;
	  }
  
	  return 9;
	}
  
	function alphabeticalCompare(a, b) {
	  if (a === b) {
		return 0;
	  }
  
	  if (~ ~a === a && ~ ~b === b) {
		if (a === 0 || b === 0) {
		  return a < b ? -1 : 1;
		}
  
		if (a < 0 || b < 0) {
		  if (b >= 0) {
			return -1;
		  }
  
		  if (a >= 0) {
			return 1;
		  }
  
		  a = -a;
		  b = -b;
		}
  
		var al = log10(a);
		var bl = log10(b);
  
		var t = 0;
  
		if (al < bl) {
		  a *= POWERS_OF_TEN[bl - al - 1];
		  b /= 10;
		  t = -1;
		} else if (al > bl) {
		  b *= POWERS_OF_TEN[al - bl - 1];
		  a /= 10;
		  t = 1;
		}
  
		if (a === b) {
		  return t;
		}
  
		return a < b ? -1 : 1;
	  }
  
	  var aStr = String(a);
	  var bStr = String(b);
  
	  if (aStr === bStr) {
		return 0;
	  }
  
	  return aStr < bStr ? -1 : 1;
	}
  
	function minRunLength(n) {
	  var r = 0;
  
	  while (n >= DEFAULT_MIN_MERGE) {
		r |= n & 1;
		n >>= 1;
	  }
  
	  return n + r;
	}
  
	function makeAscendingRun(array, lo, hi, compare) {
	  var runHi = lo + 1;
  
	  if (runHi === hi) {
		return 1;
	  }
  
	  if (compare(array[runHi++], array[lo]) < 0) {
		while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
		  runHi++;
		}
  
		reverseRun(array, lo, runHi);
	  } else {
		while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
		  runHi++;
		}
	  }
  
	  return runHi - lo;
	}
  
	function reverseRun(array, lo, hi) {
	  hi--;
  
	  while (lo < hi) {
		var t = array[lo];
		array[lo++] = array[hi];
		array[hi--] = t;
	  }
	}
  
	function binaryInsertionSort(array, lo, hi, start, compare) {
	  if (start === lo) {
		start++;
	  }
  
	  for (; start < hi; start++) {
		var pivot = array[start];
  
		var left = lo;
		var right = start;
  
		while (left < right) {
		  var mid = left + right >>> 1;
  
		  if (compare(pivot, array[mid]) < 0) {
			right = mid;
		  } else {
			left = mid + 1;
		  }
		}
  
		var n = start - left;
  
		switch (n) {
		  case 3:
			array[left + 3] = array[left + 2];
  
		  case 2:
			array[left + 2] = array[left + 1];
  
		  case 1:
			array[left + 1] = array[left];
			break;
		  default:
			while (n > 0) {
			  array[left + n] = array[left + n - 1];
			  n--;
			}
		}
  
		array[left] = pivot;
	  }
	}
  
	function gallopLeft(value, array, start, length, hint, compare) {
	  var lastOffset = 0;
	  var maxOffset = 0;
	  var offset = 1;
  
	  if (compare(value, array[start + hint]) > 0) {
		maxOffset = length - hint;
  
		while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
		  lastOffset = offset;
		  offset = (offset << 1) + 1;
  
		  if (offset <= 0) {
			offset = maxOffset;
		  }
		}
  
		if (offset > maxOffset) {
		  offset = maxOffset;
		}
  
		lastOffset += hint;
		offset += hint;
	  } else {
		maxOffset = hint + 1;
		while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
		  lastOffset = offset;
		  offset = (offset << 1) + 1;
  
		  if (offset <= 0) {
			offset = maxOffset;
		  }
		}
		if (offset > maxOffset) {
		  offset = maxOffset;
		}
  
		var tmp = lastOffset;
		lastOffset = hint - offset;
		offset = hint - tmp;
	  }
  
	  lastOffset++;
	  while (lastOffset < offset) {
		var m = lastOffset + (offset - lastOffset >>> 1);
  
		if (compare(value, array[start + m]) > 0) {
		  lastOffset = m + 1;
		} else {
		  offset = m;
		}
	  }
	  return offset;
	}
  
	function gallopRight(value, array, start, length, hint, compare) {
	  var lastOffset = 0;
	  var maxOffset = 0;
	  var offset = 1;
  
	  if (compare(value, array[start + hint]) < 0) {
		maxOffset = hint + 1;
  
		while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
		  lastOffset = offset;
		  offset = (offset << 1) + 1;
  
		  if (offset <= 0) {
			offset = maxOffset;
		  }
		}
  
		if (offset > maxOffset) {
		  offset = maxOffset;
		}
  
		var tmp = lastOffset;
		lastOffset = hint - offset;
		offset = hint - tmp;
	  } else {
		maxOffset = length - hint;
  
		while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
		  lastOffset = offset;
		  offset = (offset << 1) + 1;
  
		  if (offset <= 0) {
			offset = maxOffset;
		  }
		}
  
		if (offset > maxOffset) {
		  offset = maxOffset;
		}
  
		lastOffset += hint;
		offset += hint;
	  }
  
	  lastOffset++;
  
	  while (lastOffset < offset) {
		var m = lastOffset + (offset - lastOffset >>> 1);
  
		if (compare(value, array[start + m]) < 0) {
		  offset = m;
		} else {
		  lastOffset = m + 1;
		}
	  }
  
	  return offset;
	}
  
	var TimSort = (function () {
	  function TimSort(array, compare) {
		_classCallCheck(this, TimSort);
  
		this.array = null;
		this.compare = null;
		this.minGallop = DEFAULT_MIN_GALLOPING;
		this.length = 0;
		this.tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
		this.stackLength = 0;
		this.runStart = null;
		this.runLength = null;
		this.stackSize = 0;
  
		this.array = array;
		this.compare = compare;
  
		this.length = array.length;
  
		if (this.length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
		  this.tmpStorageLength = this.length >>> 1;
		}
  
		this.tmp = new Array(this.tmpStorageLength);
  
		this.stackLength = this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40;
  
		this.runStart = new Array(this.stackLength);
		this.runLength = new Array(this.stackLength);
	  }
  
	  TimSort.prototype.pushRun = function pushRun(runStart, runLength) {
		this.runStart[this.stackSize] = runStart;
		this.runLength[this.stackSize] = runLength;
		this.stackSize += 1;
	  };
  
	  TimSort.prototype.mergeRuns = function mergeRuns() {
		while (this.stackSize > 1) {
		  var n = this.stackSize - 2;
  
		  if (n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1] || n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1]) {
  
			if (this.runLength[n - 1] < this.runLength[n + 1]) {
			  n--;
			}
		  } else if (this.runLength[n] > this.runLength[n + 1]) {
			break;
		  }
		  this.mergeAt(n);
		}
	  };
  
	  TimSort.prototype.forceMergeRuns = function forceMergeRuns() {
		while (this.stackSize > 1) {
		  var n = this.stackSize - 2;
  
		  if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
			n--;
		  }
  
		  this.mergeAt(n);
		}
	  };
  
	  TimSort.prototype.mergeAt = function mergeAt(i) {
		var compare = this.compare;
		var array = this.array;
  
		var start1 = this.runStart[i];
		var length1 = this.runLength[i];
		var start2 = this.runStart[i + 1];
		var length2 = this.runLength[i + 1];
  
		this.runLength[i] = length1 + length2;
  
		if (i === this.stackSize - 3) {
		  this.runStart[i + 1] = this.runStart[i + 2];
		  this.runLength[i + 1] = this.runLength[i + 2];
		}
  
		this.stackSize--;
  
		var k = gallopRight(array[start2], array, start1, length1, 0, compare);
		start1 += k;
		length1 -= k;
  
		if (length1 === 0) {
		  return;
		}
  
		length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
  
		if (length2 === 0) {
		  return;
		}
  
		if (length1 <= length2) {
		  this.mergeLow(start1, length1, start2, length2);
		} else {
		  this.mergeHigh(start1, length1, start2, length2);
		}
	  };
  
	  TimSort.prototype.mergeLow = function mergeLow(start1, length1, start2, length2) {
  
		var compare = this.compare;
		var array = this.array;
		var tmp = this.tmp;
		var i = 0;
  
		for (i = 0; i < length1; i++) {
		  tmp[i] = array[start1 + i];
		}
  
		var cursor1 = 0;
		var cursor2 = start2;
		var dest = start1;
  
		array[dest++] = array[cursor2++];
  
		if (--length2 === 0) {
		  for (i = 0; i < length1; i++) {
			array[dest + i] = tmp[cursor1 + i];
		  }
		  return;
		}
  
		if (length1 === 1) {
		  for (i = 0; i < length2; i++) {
			array[dest + i] = array[cursor2 + i];
		  }
		  array[dest + length2] = tmp[cursor1];
		  return;
		}
  
		var minGallop = this.minGallop;
  
		while (true) {
		  var count1 = 0;
		  var count2 = 0;
		  var exit = false;
  
		  do {
			if (compare(array[cursor2], tmp[cursor1]) < 0) {
			  array[dest++] = array[cursor2++];
			  count2++;
			  count1 = 0;
  
			  if (--length2 === 0) {
				exit = true;
				break;
			  }
			} else {
			  array[dest++] = tmp[cursor1++];
			  count1++;
			  count2 = 0;
			  if (--length1 === 1) {
				exit = true;
				break;
			  }
			}
		  } while ((count1 | count2) < minGallop);
  
		  if (exit) {
			break;
		  }
  
		  do {
			count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
  
			if (count1 !== 0) {
			  for (i = 0; i < count1; i++) {
				array[dest + i] = tmp[cursor1 + i];
			  }
  
			  dest += count1;
			  cursor1 += count1;
			  length1 -= count1;
			  if (length1 <= 1) {
				exit = true;
				break;
			  }
			}
  
			array[dest++] = array[cursor2++];
  
			if (--length2 === 0) {
			  exit = true;
			  break;
			}
  
			count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
  
			if (count2 !== 0) {
			  for (i = 0; i < count2; i++) {
				array[dest + i] = array[cursor2 + i];
			  }
  
			  dest += count2;
			  cursor2 += count2;
			  length2 -= count2;
  
			  if (length2 === 0) {
				exit = true;
				break;
			  }
			}
			array[dest++] = tmp[cursor1++];
  
			if (--length1 === 1) {
			  exit = true;
			  break;
			}
  
			minGallop--;
		  } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
  
		  if (exit) {
			break;
		  }
  
		  if (minGallop < 0) {
			minGallop = 0;
		  }
  
		  minGallop += 2;
		}
  
		this.minGallop = minGallop;
  
		if (minGallop < 1) {
		  this.minGallop = 1;
		}
  
		if (length1 === 1) {
		  for (i = 0; i < length2; i++) {
			array[dest + i] = array[cursor2 + i];
		  }
		  array[dest + length2] = tmp[cursor1];
		} else if (length1 === 0) {
		  throw new Error('mergeLow preconditions were not respected');
		} else {
		  for (i = 0; i < length1; i++) {
			array[dest + i] = tmp[cursor1 + i];
		  }
		}
	  };
  
	  TimSort.prototype.mergeHigh = function mergeHigh(start1, length1, start2, length2) {
		var compare = this.compare;
		var array = this.array;
		var tmp = this.tmp;
		var i = 0;
  
		for (i = 0; i < length2; i++) {
		  tmp[i] = array[start2 + i];
		}
  
		var cursor1 = start1 + length1 - 1;
		var cursor2 = length2 - 1;
		var dest = start2 + length2 - 1;
		var customCursor = 0;
		var customDest = 0;
  
		array[dest--] = array[cursor1--];
  
		if (--length1 === 0) {
		  customCursor = dest - (length2 - 1);
  
		  for (i = 0; i < length2; i++) {
			array[customCursor + i] = tmp[i];
		  }
  
		  return;
		}
  
		if (length2 === 1) {
		  dest -= length1;
		  cursor1 -= length1;
		  customDest = dest + 1;
		  customCursor = cursor1 + 1;
  
		  for (i = length1 - 1; i >= 0; i--) {
			array[customDest + i] = array[customCursor + i];
		  }
  
		  array[dest] = tmp[cursor2];
		  return;
		}
  
		var minGallop = this.minGallop;
  
		while (true) {
		  var count1 = 0;
		  var count2 = 0;
		  var exit = false;
  
		  do {
			if (compare(tmp[cursor2], array[cursor1]) < 0) {
			  array[dest--] = array[cursor1--];
			  count1++;
			  count2 = 0;
			  if (--length1 === 0) {
				exit = true;
				break;
			  }
			} else {
			  array[dest--] = tmp[cursor2--];
			  count2++;
			  count1 = 0;
			  if (--length2 === 1) {
				exit = true;
				break;
			  }
			}
		  } while ((count1 | count2) < minGallop);
  
		  if (exit) {
			break;
		  }
  
		  do {
			count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
  
			if (count1 !== 0) {
			  dest -= count1;
			  cursor1 -= count1;
			  length1 -= count1;
			  customDest = dest + 1;
			  customCursor = cursor1 + 1;
  
			  for (i = count1 - 1; i >= 0; i--) {
				array[customDest + i] = array[customCursor + i];
			  }
  
			  if (length1 === 0) {
				exit = true;
				break;
			  }
			}
  
			array[dest--] = tmp[cursor2--];
  
			if (--length2 === 1) {
			  exit = true;
			  break;
			}
  
			count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
  
			if (count2 !== 0) {
			  dest -= count2;
			  cursor2 -= count2;
			  length2 -= count2;
			  customDest = dest + 1;
			  customCursor = cursor2 + 1;
  
			  for (i = 0; i < count2; i++) {
				array[customDest + i] = tmp[customCursor + i];
			  }
  
			  if (length2 <= 1) {
				exit = true;
				break;
			  }
			}
  
			array[dest--] = array[cursor1--];
  
			if (--length1 === 0) {
			  exit = true;
			  break;
			}
  
			minGallop--;
		  } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
  
		  if (exit) {
			break;
		  }
  
		  if (minGallop < 0) {
			minGallop = 0;
		  }
  
		  minGallop += 2;
		}
  
		this.minGallop = minGallop;
  
		if (minGallop < 1) {
		  this.minGallop = 1;
		}
  
		if (length2 === 1) {
		  dest -= length1;
		  cursor1 -= length1;
		  customDest = dest + 1;
		  customCursor = cursor1 + 1;
  
		  for (i = length1 - 1; i >= 0; i--) {
			array[customDest + i] = array[customCursor + i];
		  }
  
		  array[dest] = tmp[cursor2];
		} else if (length2 === 0) {
		  throw new Error('mergeHigh preconditions were not respected');
		} else {
		  customCursor = dest - (length2 - 1);
		  for (i = 0; i < length2; i++) {
			array[customCursor + i] = tmp[i];
		  }
		}
	  };
  
	  return TimSort;
	})();
  
	function sort(array, compare, lo, hi) {
	  if (!Array.isArray(array)) {
		throw new TypeError('Can only sort arrays');
	  }
  
	  if (!compare) {
		compare = alphabeticalCompare;
	  } else if (typeof compare !== 'function') {
		hi = lo;
		lo = compare;
		compare = alphabeticalCompare;
	  }
  
	  if (!lo) {
		lo = 0;
	  }
	  if (!hi) {
		hi = array.length;
	  }
  
	  var remaining = hi - lo;
  
	  if (remaining < 2) {
		return;
	  }
  
	  var runLength = 0;
  
	  if (remaining < DEFAULT_MIN_MERGE) {
		runLength = makeAscendingRun(array, lo, hi, compare);
		binaryInsertionSort(array, lo, hi, lo + runLength, compare);
		return;
	  }
  
	  var ts = new TimSort(array, compare);
  
	  var minRun = minRunLength(remaining);
  
	  do {
		runLength = makeAscendingRun(array, lo, hi, compare);
		if (runLength < minRun) {
		  var force = remaining;
		  if (force > minRun) {
			force = minRun;
		  }
  
		  binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
		  runLength = force;
		}
  
		ts.pushRun(lo, runLength);
		ts.mergeRuns();
  
		remaining -= runLength;
		lo += runLength;
	  } while (remaining !== 0);
  
	  ts.forceMergeRuns();
	}
	
	return sort(array, compare, lo, hi);
};
  
export function isValidEffect(name) {
	const effects = [
		'grow',
		'grow-rotate',
		'shrink',
		'pulse',
		'bounce',
		'float',
		'hang',
		'buzz',
		'icon-backward',
		'icon-forward',
		'icon-down',
		'icon-up',
		'icon-rotate',
		'icon-buzz',
		'icon-float'
	];

	const effect = name && ~effects.indexOf(name) ? "ez-effect-" + name : '';
	return effect;
}