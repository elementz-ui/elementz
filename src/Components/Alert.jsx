import "./../Style/Alert.scss";

//Forked from? ... I don't remmeber

var Toaster = function () {
	var Toastify = function (options) {
		
		return new Toastify.lib.init(options);
	}
  
	Toastify.lib = Toastify.prototype = {
		constructor: Toastify,
  
		
		init: function (options) {
			
			if (!options) {
				options = {};
			}
  
			
			this.options = {};
  
			this.toastElement = null;
  
			
			this.options.text = options.text || "Hi there!"; 
			this.options.node = options.node 
			this.options.duration = options.duration === 0 ? 0 : options.duration || 3000; 
			this.options.selector = options.selector; 
			this.options.callback = options.callback || function () { }; 
			this.options.destination = options.destination; 
			this.options.newWindow = options.newWindow || false; 
			this.options.close = options.close || false; 
			this.options.gravity = options.gravity === "bottom" ? "toastify-bottom" : "toastify-top"; 
			this.options.positionLeft = options.positionLeft || false; 
			this.options.position = options.position || ''; 
			this.options.backgroundColor = options.backgroundColor; 
			this.options.avatar = options.avatar || ""; 
			this.options.className = options.className || ""; 
			this.options.stopOnFocus = options.stopOnFocus === undefined ? true : options.stopOnFocus; 
			this.options.onClick = options.onClick; 
  
			const normalOffset = { x: 0, y: 0 };
  
			this.options.offset = options.offset || normalOffset 
  
			
			return this;
		},
  
		
		buildToast: function () {
			
			if (!this.options) {
				throw "Toastify is not initialized";
			}
  
			
			var divElement = document.createElement("div");
			divElement.className = "toastify on " + this.options.className;
  
			
			if (!!this.options.position) {
				divElement.className += " toastify-" + this.options.position;
			} else {
				
				if (this.options.positionLeft === true) {
					divElement.className += " toastify-left";
					console.warn('Property `positionLeft` will be depreciated in further versions. Please use `position` instead.')
				} else {
					
					divElement.className += " toastify-right";
				}
			}
  
			
			divElement.className += " " + this.options.gravity;
  
			if (this.options.backgroundColor) {
				divElement.style.background = this.options.backgroundColor;
			}
  
			
			if (this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE) {
				
				divElement.appendChild(this.options.node)
			} else {
				divElement.innerHTML = this.options.text;
  
				if (this.options.avatar !== "") {
					var avatarElement = document.createElement("img");
					avatarElement.src = this.options.avatar;
  
					avatarElement.className = "toastify-avatar";
  
					if (this.options.position == "left" || this.options.positionLeft === true) {
						
						divElement.appendChild(avatarElement);
					} else {
						
						divElement.insertAdjacentElement("afterbegin", avatarElement);
					}
				}
			}
  
			
			if (this.options.close === true) {
				
				var closeElement = document.createElement("span");
				closeElement.innerHTML = "&#10006;";
  
				closeElement.className = "toast-close";
  
				
				closeElement.addEventListener(
					"click",
					function (event) {
						event.stopPropagation();
						this.removeElement(this.toastElement);
						window.clearTimeout(this.toastElement.timeOutValue);
					}.bind(this)
				);
  
				
				var width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
  
				
				
				if ((this.options.position == "left" || this.options.positionLeft === true) && width > 360) {
					
					divElement.insertAdjacentElement("afterbegin", closeElement);
				} else {
					
					divElement.appendChild(closeElement);
				}
			}
  
			
			if (this.options.stopOnFocus && this.options.duration > 0) {
				const self = this;
				
				divElement.addEventListener(
					"mouseover",
					function (event) {
						window.clearTimeout(divElement.timeOutValue);
					}
				)
				
				divElement.addEventListener(
					"mouseleave",
					function () {
						divElement.timeOutValue = window.setTimeout(
							function () {
								
								self.removeElement(divElement);
							},
							self.options.duration
						)
					}
				)
			}
		
			
			if (typeof this.options.destination !== "undefined") {
				divElement.addEventListener(
					"click",
					function (event) {
						event.stopPropagation();
						if (this.options.newWindow === true) {
							window.open(this.options.destination, "_blank");
						} else {
							window.location = this.options.destination;
						}
					}.bind(this)
				);
			}
  
			if (typeof this.options.onClick === "function" && typeof this.options.destination === "undefined") {
				divElement.addEventListener(
					"click",
					function (event) {
						event.stopPropagation();
						this.options.onClick();
					}.bind(this)
				);
			}
  
			
			if (typeof this.options.offset === "object") {
  
				var x = getAxisOffsetAValue("x", this.options);
				var y = getAxisOffsetAValue("y", this.options);
		  
				const xOffset = this.options.position == "left" ? x : `-${x}`;
				const yOffset = this.options.gravity == "toastify-top" ? y : `-${y}`;
  
				divElement.style.transform = `translate(${xOffset}, ${yOffset})`;
  
			}
  
			
			return divElement;
		},
  
		
		showToast: function () {
			
			this.toastElement = this.buildToast();
  
			
			var rootElement;
			if (typeof this.options.selector === "undefined") {
				rootElement = document.body;
			} else {
				rootElement = document.getElementById(this.options.selector);
			}
  
			
			if (!rootElement) {
				throw "Root element is not defined";
			}
  
			
			rootElement.insertBefore(this.toastElement, rootElement.firstChild);
  
			
			Toastify.reposition();
  
			if (this.options.duration > 0) {
				this.toastElement.timeOutValue = window.setTimeout(
					function () {
						
						this.removeElement(this.toastElement);
					}.bind(this),
					this.options.duration
				); 
			}
  
			
			return this;
		},
  
		hideToast: function () {
			if (this.toastElement.timeOutValue) {
				clearTimeout(this.toastElement.timeOutValue);
			}
			this.removeElement(this.toastElement);
		},
  
		
		removeElement: function (toastElement) {
			
			
			toastElement.className = toastElement.className.replace(" on", "");
  
			
			window.setTimeout(
				function () {
					
					if (this.options.node && this.options.node.parentNode) {
						this.options.node.parentNode.removeChild(this.options.node);
					}
  
					
					if (toastElement.parentNode) {
						toastElement.parentNode.removeChild(toastElement);
					}
  
					
					this.options.callback.call(toastElement);
  
					
					Toastify.reposition();
				}.bind(this),
				400
			); 
		},
	};
  
	
	Toastify.reposition = function () {
  

		var topLeftOffsetSize = {
			top: 15,
			bottom: 15,
		};
		var topRightOffsetSize = {
			top: 15,
			bottom: 15,
		};
		var offsetSize = {
			top: 15,
			bottom: 15,
		};
  
		
		var allToasts = document.getElementsByClassName("toastify");
  
		var classUsed;
  
		
		for (var i = 0; i < allToasts.length; i++) {
			
			if (containsClass(allToasts[i], "toastify-top") === true) {
				classUsed = "toastify-top";
			} else {
				classUsed = "toastify-bottom";
			}
  
			var height = allToasts[i].offsetHeight;
			classUsed = classUsed.substr(9, classUsed.length - 1)
			
			var offset = 15;
  
			var width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
  
			
			if (width <= 360) {
				
				allToasts[i].style[classUsed] = offsetSize[classUsed] + "px";
  
				offsetSize[classUsed] += height + offset;
			} else {
				if (containsClass(allToasts[i], "toastify-left") === true) {
					
					allToasts[i].style[classUsed] = topLeftOffsetSize[classUsed] + "px";
  
					topLeftOffsetSize[classUsed] += height + offset;
				} else {
					
					allToasts[i].style[classUsed] = topRightOffsetSize[classUsed] + "px";
  
					topRightOffsetSize[classUsed] += height + offset;
				}
			}
		}
  
		
		return this;
	};
  
	
	function getAxisOffsetAValue(axis, options) {
  
		if (options.offset[axis]) {
			if (isNaN(options.offset[axis])) {
				return options.offset[axis];
			}
			else {
				return options.offset[axis] + 'px';
			}
		}
  
		return '0px';
  
	}
  
	function containsClass(elem, yourClass) {
		if (!elem || typeof yourClass !== "string") {
			return false;
		} else if (
			elem.className &&
			elem.className
				.trim()
				.split(/\s+/gi)
				.indexOf(yourClass) > -1
		) {
			return true;
		} else {
			return false;
		}
	}
  
	
	Toastify.lib.init.prototype = Toastify.lib;
  
	return Toastify;
}();

function Alert(options) {
	options = typeof options === "string" ?
		{
			text: options
		} : options;
	
	return Toaster(options).showToast();
}

const themes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

for(var i = 0; i < themes.length; i++) {
	var color = themes[i];
	Alert[color] = (function (color, text, opts = {}) {
		return Toaster({
			text,
			className: color,
			...opts
		}).showToast();
	}).bind(null, color);
}
if(typeof window !== 'undefined') {
	window.Alert = Alert;
}


export default Alert;