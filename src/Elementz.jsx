/*!
  Copyright (c) 2021 Elis K <elementz@elis.cc>.
  Licensed under the Affero General Public License (AGPL), see
  https://github.com/elementz-ui/elementz
*/

import './Assets/ezTheme';

/**
 * Components
 */
//import Flag from 'Components/Flag'; Too big size, better imported by cherrypick
import { Row, Col } from './Components/Bootstrap';
import Alert from './Components/Alert';
import Badge from './Components/Badge';
import Box from './Components/Box';
import Button from './Components/Button';
import Dropdown from './Components/Dropdown';
import Group from './Components/Group';
import Icon from './Components/Icon';
import Input from './Components/Input';
import Loading from './Components/Loading';
import Menu from './Components/Menu';
import Modal from './Components/Modal';
import Nav from './Components/Nav';
import Progress from './Components/Progress';
import Radio from './Components/Radio';
import Select from './Components/Select';
import Switch from './Components/Switch';
import Table from './Components/Table';

/**
 * Hooks
 */
import { RouterProvider, useRouter, useHistory } from './Hooks/useRouter';
import { useThemeDarkMode, useThemeSize } from './Hooks/useTheme';
import getHistory from './Hooks/getHistory';
import useComponentWillMount from './Hooks/useComponentWillMount';
import useLocalStorage from './Hooks/useLocalStorage';
import useModal from './Hooks/useModal';
import useMultiState from './Hooks/useMultiState';
import useOutside from './Hooks/useOutside';
import usePrevious from './Hooks/usePrevious';
import useScript from './Hooks/useScript';

/**
 * CSS
 */
import './Style/Effects.scss';
import './Style/Main.scss';
import './Style/Theme.scss';

export {
  Alert,
  Badge,
  Box,
  Button,
  Col,
  Dropdown,
  getHistory,
  Group,
  Icon,
  Input,
  Loading,
  Menu,
  Modal,
  Nav,
  Progress,
  Radio,
  RouterProvider,
  Row,
  Select,
  Switch,
  Table,
  useComponentWillMount,
  useHistory,
  useLocalStorage,
  useModal,
  useMultiState,
  useOutside,
  usePrevious,
  useRouter,
  useScript,
  useThemeDarkMode,
  useThemeSize,
};
