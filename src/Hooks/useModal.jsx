import React,{useState} from 'react';

const useModal = (visible = false) => {
	const [isOpened, setOpened] = useState(visible);
  
	function open() {
		setOpened(true);
	}
	function hide() {
		setOpened(false);
	}
	function toggle() {
		setOpened(!isOpened);
	}
  
	return [
		isOpened,
		toggle,
		open,
		hide
	];
};

export default useModal;