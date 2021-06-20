/*!
  Copyright (c) 2021 Elis K <elementz@elis.cc>.
  Licensed under the Affero General Public License (AGPL), see
  https://github.com/elementz-ui/elementz
*/

import React from 'react';



import './Assets/ezTheme'; 

/**
 * Components
 */
import Alert from './Components/Alert';
import Button from './Components/Button';
import Badge from './Components/Badge';
import Dropdown from './Components/Dropdown';
import Icon from './Components/Icon';
//import Flag from './Components/Flag'; Too big size, better imported by cherrypick
import Input from './Components/Input'; 
import Loading from './Components/Loading'; 
import Menu from './Components/Menu';
import Modal from './Components/Modal';
import Nav from './Components/Nav';
import Box from './Components/Box';
import Progress from './Components/Progress';
import Radio from './Components/Radio';
import Select from './Components/Select';
import Switch from './Components/Switch';
import Group from './Components/Group';
import Table from './Components/Table';
import {Row, Col} from './Components/Bootstrap';

/**
 * Hooks
 */
import useLocalStorage from './Hooks/useLocalStorage';
import useModal from './Hooks/useModal';
import useOutside from './Hooks/useOutside';
import usePrevious from './Hooks/usePrevious';
import useScript from './Hooks/useScript';
import useMultiState from './Hooks/useMultiState';
import useComponentWillMount from './Hooks/useComponentWillMount';
import { RouterProvider, useRouter, useHistory } from './Hooks/useRouter';
import { useThemeDarkMode, useThemeSize } from './Hooks/useTheme';
import getHistory from './Hooks/getHistory';


/**
 * CSS
 */
import './Style/Theme.scss';
import './Style/Main.scss';
import './Style/Effects.scss';


export {
	Menu, Modal, Dropdown, Button, Input, Radio, Table, Group, Switch,
	Loading, Icon, Nav, Select, Alert, Progress, Box, Badge, Row, Col,
	useLocalStorage, useModal, usePrevious, useScript, useOutside,	useMultiState,
	useComponentWillMount, useRouter, useHistory, RouterProvider, getHistory,
	useThemeDarkMode, useThemeSize
}
