import React, { useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';

import './../Style/Input.scss';
import useController from '../Hooks/useController';
import {
  classNames,
  filterProps,
  isValidEffect,
  mainClasses,
} from '../Functions/Functions';

import Icon from './Icon';
import Group from './Group';

// This needs some code cleanup
const Input = React.forwardRef((props, ref) => {
  const inputType = props.type || 'text';
  if (inputType === 'number') return <Input.Number {...props} />;

  const inputElement = useRef(null);
  let passProps = filterProps(props, ['className']);

  const effect = isValidEffect(props.effect);
  const icon = props.icon && (
      <Icon className={props.iconClassName} name={props.icon}></Icon>
    ),
    before = (props.before || icon) && (
      <div className="element-action before">{props.before || icon}</div>
    ),
    after = props.after && (
      <div className="element-action after">{props.after}</div>
    ),
    overlay = props.overlay && (
      <div className="ez-input-overlay">{props.overlay}</div>
    );

  const clickHandler = e => {
    if (typeof props.containerOnClick === 'function') {
      return props.containerOnClick(e);
    }

    if (props.type != 'file' || !inputElement.current) {
      return;
    }

    if (e.target !== inputElement.current) {
      return inputElement.current.click();
    }
  };

  const keyDown = e => {
    if (e.keyCode == 13) {
      if (typeof props.onEnter === 'function') props.onEnter(e);
    }

    if (typeof props.onKeyDown === 'function') {
      return props.onKeyDown(e);
    }
  };

  const handleRef = e => {
    inputElement.current = e;

    if (ref) {
      if (typeof ref === 'function') ref(e);
      if (ref.hasOwnProperty('current')) ref.current = e;
    }
  };

  const elements = {
    file: {
      class: 'input-file',
      noBefore: true,
      noAfter: true,
      before: () => <div className="input-mask" />,
      after: () => props.children,
    },

    text: {
      class: 'input-text',
    },

    password: {
      class: 'input-password',
    },

    email: {
      class: 'input-email',
      props: {
        inputmode: 'email',
      },
    },

    number: {
      type: 'text',
    },

    checkbox: {
      props: {
        id: 'checkbox_' + Math.round(Math.random() * 1e6).toString(),
        value: props.value || 'true',
      },
      noBefore: true,
      noAfter: true,
      class: 'input-checkbox',
      after: () => (
        <label htmlFor={elements.checkbox.props.id}>
          {props.children || props.value}
        </label>
      ),
    },

    radio: {
      props: {
        id: 'radiobox_' + Math.round(Math.random() * 1e6).toString(),
        value:
          props.value ||
          (typeof props.children === 'string' ? props.children : null),
      },
      noBefore: true,
      noAfter: true,
      class: 'input-radiobox',
      after: () => (
        <label htmlFor={elements.radio.props.id}>
          {props.children || props.value}
        </label>
      ),
    },
  };

  const element = elements[props.type] || elements['text'],
    type =
      elements[inputType] && elements[inputType].type
        ? elements[inputType].type
        : inputType;

  if (element.props) {
    passProps = { ...passProps, ...element.props };
  }

  const className = classNames(
    'ez-input-element',
    element.class,
    effect,
    props.containerClassName,
    mainClasses(props),
    {
      'action-hidden': props.actionHidden,
      'input-action': props.before || props.after,
      'box-shadow': props.boxShadow,
      hasOverlay: overlay,
      noOverlayOverflow: props.noOverlayOverflow,
      incomplete: props.dot || props.incomplete, //Checkbox
    }
  );

  const inputClassName = classNames(
    'ez-input',
    props.className,
    mainClasses(props)
  );

  const needContainer =
    overlay ||
    before ||
    after ||
    icon ||
    element.before ||
    element.after ||
    props.container;

  const inputContainer = needContainer ? (
    <div onClick={clickHandler} className={className}>
      {before && !element.noBefore && before}
      {element.before && element.before()}
      <input
        {...passProps}
        type={type}
        ref={handleRef}
        className={inputClassName + ' ez-input-wrapped'}
        onKeyDown={keyDown}
      />
      {element.after && element.after()}
      {after && !element.noAfter && after}
      {overlay}
    </div>
  ) : (
    <input
      {...passProps}
      type={type}
      ref={handleRef}
      className={inputClassName}
    />
  );

  return inputContainer;
});

Input.List = Input.Multi = props => {
  //eslint-disable-line

  const initalItems = Array.isArray(props.defaultValue)
    ? props.defaultValue
    : [];

  const itemReducer = function (state, action) {
    switch (action.type) {
      case 'add':
        return [action.item].concat(state);
      case 'delete':
        return state.filter(item => item !== action.item);
      default:
        throw new Error();
    }
  };

  const inputProps = props.inputProps || {};

  const [items, setItems] = useReducer(itemReducer, initalItems); //eslint-disable-line
  const itemsCurrent = Array.isArray(props.value) ? props.value : items;
  const inputRef = useRef(null); //eslint-disable-line

  const max = isNaN(props.max) ? 50 : +props.max;
  const min = isNaN(props.min) ? 0 : +props.min;
  const duplicates = props.duplicates;

  //eslint-disable-next-line
  useEffect(() => {
    if (triggerEvent('onChange', itemsCurrent));
  }, [itemsCurrent]);

  const triggerEvent = (name, value) => {
    if (typeof props[name] === 'function') {
      if (props[name](value) === false) return false;
    }

    return true;
  };

  const addItem = () => {
    const value = inputRef.current.value;

    if (!inputRef.current || !inputRef.current.value) return false;
    if (itemsCurrent.length == max) return false;
    if (!duplicates && ~itemsCurrent.indexOf(value)) return false;
    if (!triggerEvent('onAdd', value)) return false;

    setItems({
      type: 'add',
      item: value,
    });

    inputRef.current.value = '';
  };

  const deleteItem = item => {
    if (!inputRef.current) return false;
    if (itemsCurrent.length == min) return false;
    if (!triggerEvent('onDelete', item)) return false;

    setItems({
      type: 'delete',
      item: item,
    });
  };

  const itemElements = itemsCurrent.map((item, index) => (
    <div key={index} className="multi-item">
      <span className="multi-item-text">{item}</span>
      <div className="multi-item-actions">
        <Icon
          className={props.iconClassName}
          name="close"
          onClick={deleteItem.bind(null, item)}
        />
      </div>
    </div>
  ));

  const inputClasses = ['ez-multi-input'];
  if (props.className) inputClasses.push(props.className);

  return (
    <div className={inputClasses.join(' ')}>
      <Input
        {...inputProps}
        type="text"
        ref={inputRef}
        after={
          <Icon
            className={props.iconClassName}
            name={props.icon || 'add-to-list'}
            onClick={addItem}
          />
        }
      />
      <div className="multi-items">{itemElements}</div>
    </div>
  );
};

Input.Number = React.forwardRef((props, ref) => {
  //eslint-disable-line

  const options = {
    parse: props.float ? parseFloat : parseInt,
    increment: !isNaN(parseFloat(props.incremental))
      ? parseFloat(props.incremental)
      : props.defaultValue || 1,
    max: !isNaN(parseFloat(props.max)) ? parseFloat(props.max) : 999999999999,
    min: !isNaN(parseFloat(props.min))
      ? parseFloat(props.min)
      : props.defaultValue || 0,
  };

  const [value, setValue] = useController(props, 'value', options.min);

  const inputElement = useRef(null);
  const lastValue = useRef(value);
  const isFirstRender = useRef(true);
  const isDefaultValue = useRef(true);

  const isInvalidValue = n => {
    const texted = '' + n;
    const float = props.float ? '\\.' : '';
    const negative = props.negative ? '\\-' : '';
    const pattern = new RegExp(`^${negative}[0-9${float}]+$`);
    return !pattern.test(n) || (texted.length > 1 && texted.substr(0, 1) == 0);
  };

  const forwardChange = n => {
    const changeListener = props.onNumber || props.onChange;

    if (
      (n === lastValue.current && !isDefaultValue.current) ||
      isInvalidValue(n)
    )
      return false;

    if (isDefaultValue.current) isDefaultValue.current = false;

    lastValue.current = n;
    if (typeof changeListener == 'function') return changeListener(n) !== false;

    return true;
  };

  const handlePlus = v => {
    const updateValue = Math.min(
      options.max,
      lastValue.current + options.increment
    );

    if (forwardChange(updateValue)) setValue(updateValue);
  };

  const handleMinus = e => {
    const updateValue = Math.max(
      options.min,
      lastValue.current - options.increment
    );

    if (forwardChange(updateValue)) setValue(updateValue);
  };

  const handleWheel = e => {
    const el = this || e.target,
      scrollTop = el.scrollTop,
      scrollHeight = el.scrollHeight,
      height = el.offsetHeight,
      delta = e.wheelDelta,
      up = delta > 0;

    const prevent = () => {
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      return false;
    };

    if (!up && -delta > scrollHeight - height - scrollTop) {
      // Scrolling down, but this will take us past the bottom.
      el.scrollTo(null, scrollHeight);
      handleMinus();
      return prevent();
    } else if (up && delta > scrollTop) {
      // Scrolling up, but this will take us past the top.
      el.scrollTo(null, 0);
      handlePlus();
      return prevent();
    }
  };

  const handleChange = e => {
    const isDot =
      props.float && e.target.value.substr(e.target.value.length - 1) == '.';
    const value = options.parse(e.target.value);

    let updateValue = Math.max(options.min, Math.min(options.max, value));
    updateValue = isDot ? `${updateValue}.` : updateValue;

    if (forwardChange(updateValue)) setValue(updateValue);
  };

  const handlePaste = e => {
    const key = e.clipboardData.getData('text/plain');
    const isInvalid = isInvalidValue(key);

    if (isInvalid) {
      e.preventDefault();
      return false;
    }

    if (options.parse(key) > options.max || options.parse(key) < options.min) {
      e.preventDefault();
      return false;
    }

    if (typeof props.onPaste == 'function') {
      return props.onPaste(e);
    }
  };

  const handleKeyDown = e => {
    // Handle Backspace
    const char = e.keyCode || e.which;
    const isSelectedAll =
      typeof e.target.selectionStart == 'number'
        ? e.target.selectionStart == 0 &&
          e.target.selectionEnd == e.target.value.length
        : false;

    // Ctrl+X
    if ((e.ctrlKey || e.metaKey) && e.keyCode == 88 && isSelectedAll) {
      e.target.value = options.min;
      e.preventDefault();
      return false;
    }

    //Backspace
    if (char == 8 && (e.target.value.length == 1 || isSelectedAll)) {
      e.target.value = options.min;
      e.preventDefault();
      return false;
    }

    if (typeof props.onKeyDown == 'function') {
      return props.onKeyDown(e);
    }
  };

  const handleKeyPress = e => {
    const charCode = e.keyCode || e.which;
    const key = String.fromCharCode(charCode);
    const hasSelection = typeof e.target.selectionStart == 'number';
    const isInvalid = isInvalidValue(key);
    const isFloatDot =
      props.float && key === '.' && !~e.target.value.indexOf('.');

    if (isInvalid && !isFloatDot) {
      e.preventDefault();
      return false;
    }

    if (!hasSelection && options.parse(e.target.value) > options.max) {
      e.preventDefault();
      return false;
    }

    if (typeof props.onKeyPress == 'function') {
      return props.onKeyPress(e);
    }

    return true;
  };

  const handleRef = e => {
    inputElement.current = e;

    if (ref) {
      if (typeof ref === 'function') ref(e);
      if (ref.hasOwnProperty('current')) ref.current = e;
    }
  };

  useEffect(() => {
    isFirstRender.current = false;

    if (inputElement.current) {
      inputElement.current.addEventListener('wheel', handleWheel, {
        passive: false,
      });
    }

    return () => {
      return (
        inputElement.current &&
        inputElement.current.removeEventListener('wheel', handleWheel)
      );
    };
  }, []);

  const minus = !props.noButtons && (
    <div className="element-action">
      <Icon
        className={props.iconClassName}
        name="minus-square"
        onClick={handleMinus}
      />
    </div>
  );

  const plus = !props.noButtons && (
    <div className="element-action">
      <Icon
        className={props.iconClassName}
        name="plus-square"
        onClick={handlePlus}
      />
    </div>
  );

  const className = classNames(mainClasses(props), props.className);
  const containerClassName = classNames(mainClasses(props), 'input-number');

  const passProps = filterProps(props, [
    'className',
    'value',
    'setValue',
    'ref',
    'before',
    'after',
    'onChange',
    'onNumber',
  ]);

  return (
    <Input
      {...passProps}
      after={plus}
      before={minus}
      className={className}
      containerClassName={containerClassName}
      inputMode="numeric"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onKeyPress={handleKeyPress}
      onPaste={handlePaste}
      placeholder={options.min}
      ref={handleRef}
      size={1}
      type="text"
      value={value}
    />
  );
});

Input.Group = Group;

Input.propTypes = {
  /** Action icon, button, text or any element to add inside input before */
  before: PropTypes.node,

  /** Action icon, button, text or any element to add inside input after */
  after: PropTypes.node,

  /** Show an overlay element on Inpit */
  overlay: PropTypes.any,

  /** Hide Overlay Element Overflow */
  noOverlayOverflow: PropTypes.bool,

  /** Show actions on focus */
  actionHidden: PropTypes.bool,

  /** `[type='checkbox']`: Incomplete state */
  incomplete: PropTypes.bool,

  /** `[type='number']`: Incremental number  */
  incremental: PropTypes.number,

  /** `[type='number']`: Maximum allowed number  */
  max: PropTypes.number,

  /** `[type='number']`: Minimum allowed number  */
  min: PropTypes.number,

  /** `[type='number']`: Allow float numbers  */
  float: PropTypes.bool,

  /** `[type='number']`: Allow negative numbers  */
  negative: PropTypes.bool,

  /** Use primary theme colors */
  primary: PropTypes.bool,

  /** Use secondary theme colors */
  secondary: PropTypes.bool,

  /** Use warning theme colors */
  warning: PropTypes.bool,

  /** Use danger theme colors */
  danger: PropTypes.bool,

  /** Use info theme colors */
  info: PropTypes.bool,

  /** Use success theme colors */
  success: PropTypes.bool,

  /** Active state, shows theme border color */
  active: PropTypes.bool,

  /** Loading */
  loading: PropTypes.bool,

  /** Disabled */
  disabled: PropTypes.bool,

  /** Small Size */
  sm: PropTypes.bool,

  /** Medium Size */
  md: PropTypes.bool,

  /** Large Size */
  lg: PropTypes.bool,

  /** Extra Large Size */
  xl: PropTypes.bool,

  /** Flexible 100% Width */
  full: PropTypes.bool,

  /** No box shadow */
  noShadow: PropTypes.bool,

  /** No border */
  noBorder: PropTypes.bool,

  /** Input Element ClassName */
  className: PropTypes.any,

  /** Input Container ClassName */
  containerClassName: PropTypes.any,
};

export default Input;
