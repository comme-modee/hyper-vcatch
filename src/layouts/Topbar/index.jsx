import { useLocation } from 'react-router-dom';
import { profileMenus } from './data';
import ProfileDropdown from './ProfileDropdown';
import MaximizeScreen from './MaximizeScreen';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';


// assets
import userImage from '@/assets/images/users/user-image-1.png';
import { ThemeSettings, useThemeContext, useUserInfoContext } from '@/common';
import useThemeCustomizer from '@/components/ThemeCustomizer/useThemeCustomizer';
import { useViewport } from '@/hooks';
import useGetUserRole from '@/common/api/useGetUserRole';
import { useState, useEffect } from 'react';
import useGetClientList from './useGetClientList';
import './Topbar.style.css';


const Topbar = ({ topbarDark, toggleMenu, navOpen }) => {
	const [ userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')));
	const { settings, updateSettings, updateSidebar } = useThemeContext();
	const { data:clientListData, getClientList } = useGetClientList();
	const [ showClientSelectBox, setShowClientSelectBox ] = useState(false);
	const location = useLocation();

	const { sideBarType } = useThemeCustomizer();

	const { width } = useViewport();

	//로그인한 사용자 정보
	const userRole = useGetUserRole();
	
	//셀렉트박스에서 클라이언트 선택하면 saveClientUid로 전달
	const [ client, setClient ] = useState('');

	//clientUid, clientName 저장
	const { clientUid, saveClientName, saveClientUid } = useUserInfoContext(); 

	useEffect(()=>{
		if(userInfo) {
			getClientList(userInfo.username)
		}
		if(['/monitoring/keyword-week', '/monitoring/keyword-24hour', '/monitoring/keyword-month', '/monitoring/report'].includes(location.pathname)) {
			setShowClientSelectBox(true)
		} else {
			setShowClientSelectBox(false)
		}
	},[userInfo, location])

	useEffect(()=>{
		if(client || client === '') {
			saveClientUid(client)
			if(client !== '') {
				const findClient = clientListData.find(cl => cl.client_uid === parseInt(client, 10));
				saveClientName(findClient.client_name)
			}
		}
	},[client])

	// useEffect(()=>{
	// 	if(clientListData) {
	// 		const findClient = clientListData.find(cl => cl.client_uid === client);
	// 		console.log(findClient)
	// 	}
	// },[clientListData])

	


	/**
	 * Toggle the leftmenu when having mobile screen
	 */
	const handleLeftMenuCallBack = () => {
		if (width < 1140) {
			if (sideBarType === 'full') {
				showLeftSideBarBackdrop();
				document.getElementsByTagName('html')[0].classList.add('sidebar-enable');
			} else if (sideBarType === 'condensed' || sideBarType === 'fullscreen') {
				updateSidebar({ size: ThemeSettings.sidebar.size.default });
			} else {
				updateSidebar({ size: ThemeSettings.sidebar.size.condensed });
			}
		} else if (sideBarType === 'condensed') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default });
		} else if (sideBarType === 'full' || sideBarType === 'fullscreen') {
			showLeftSideBarBackdrop();
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable');
		} else {
			updateSidebar({ size: ThemeSettings.sidebar.size.condensed });
		}
	};

	/**
	 * creates backdrop for leftsidebar
	 */
	function showLeftSideBarBackdrop() {
		const backdrop = document.createElement('div');
		backdrop.id = 'custom-backdrop';
		backdrop.className = 'offcanvas-backdrop fade show';
		document.body.appendChild(backdrop);

		backdrop.addEventListener('click', function () {
			document.getElementsByTagName('html')[0].classList.remove('sidebar-enable');
			hideLeftSideBarBackdrop();
		});
	}

	function hideLeftSideBarBackdrop() {
		const backdrop = document.getElementById('custom-backdrop');
		if (backdrop) {
			document.body.removeChild(backdrop);
			document.body.style.removeProperty('overflow');
		}
	}

	/**
	 * Toggle Dark Mode
	 */
	const toggleDarkMode = () => {
		if (settings.theme === 'dark') {
			updateSettings({ theme: ThemeSettings.theme.light });
		} else {
			updateSettings({ theme: ThemeSettings.theme.dark });
		}
	};

	/**
	 * Toggles the right sidebar
	 */
	const handleRightSideBar = () => {
		updateSettings({ rightSidebar: ThemeSettings.rightSidebar.show });
	};

	return (
		<div className={'navbar-custom'}>
			<div className="topbar container-fluid">
				<div className="d-flex align-items-center gap-lg-2 gap-0">
					{/* <div className="logo-topbar">
						<Link to="/" className={topbarDark ? 'logo-light' : 'logo-dark'}>
							<span className="logo-lg">
								<img src={topbarDark ? logo : logoDark} alt="logo" />
							</span>
							<span className="logo-sm">
								<img src={topbarDark ? logoSm : logoDarkSm} alt="small logo" />
							</span>
						</Link>
					</div> */}

					<button className="button-toggle-menu" onClick={handleLeftMenuCallBack}>
						<i className="mdi mdi-menu" />
					</button>

					<button
						className={`navbar-toggle ${navOpen ? 'open' : ''}`}
						onClick={toggleMenu}
					>
						<div className="lines">
							<span />
							<span />
							<span />
						</div>
					</button>

					{/* 클라이언트 셀렉트 박스 */}
					{showClientSelectBox ? 
						<Form.Select id='topbar-client-select' defaultValue={clientUid || ''} aria-label="Default select example" onChange={(e) => setClient(e.target.value)}>
							<option value=''>클라이언트 선택</option>
							{clientListData && clientListData.map((client, index) => <option key={`${client.client_uid}${index}`} value={client.client_uid}>{client.client_name}</option>)}
						</Form.Select>
					: <></> }

				</div>

				<ul className="topbar-menu d-flex align-items-center gap-lg-3 gap-2">
					{/* <li className="dropdown d-lg-none">
						<SearchDropdown />
					</li> */}

					{/* 테마 세팅 */}
					{/* <li className="d-none d-sm-inline-block">
						<button
							className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
							onClick={handleRightSideBar}
						>
							<i className="ri-settings-3-line font-22"></i>
						</button>
					</li> */}

					{/* 테마 모드 변경 */}
					<li>
						<OverlayTrigger
							placement="left"
							overlay={<Tooltip id="dark-mode-toggler">테마 변경</Tooltip>}
						>
							<div className="nav-link" id="light-dark-mode" onClick={toggleDarkMode}>
								<i className="ri-moon-line font-22" />
							</div>
						</OverlayTrigger>
					</li>

					{/* 전체화면 */}
					<li className="d-none d-md-inline-block">
						<MaximizeScreen />
					</li>

					{/* 사용자 프로필 */}
					<li className="dropdown">
						<ProfileDropdown
							userImage={userImage}
							menuItems={profileMenus}
							username={userInfo.username}
							userTitle={userRole}
						/>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Topbar;
