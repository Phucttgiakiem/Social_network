import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import config from '~/config';
import styles from './Header.module.scss';
import images from 'assets/images';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import { useEffect,useCallback } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { AuthenLogin, showAuthendialog } from 'redux/actions';
import {
    faEllipsisVertical,
    faEarthAsia,
    faCircleQuestion,
    faKeyboard,
    faSignOut,
} from '@fortawesome/free-solid-svg-icons';

import Menu from '~/components/Popper/Menu';
// import { faKeybase } from '@fortawesome/free-brands-svg-icons';
import { AuthenDialogState$, DetailuserState$ } from 'redux/selectors';
import { faUser, faCoins, faGear } from '@fortawesome/free-solid-svg-icons';
import { InboxIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '~/pages/Search';
import Login from 'pages/login/Login';
import { logoutAccount } from 'api';
const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            user: [
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];

function Header() {
    
    const {isshow} = useSelector(AuthenDialogState$);
    const dispatch = useDispatch();
    // Kiểm tra cookie để lấy thông tin user
    const userData = useSelector(DetailuserState$);

    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.to) {
            case '/logout':
                handleLogoutAccount();
                break;
            case `/profile/${userData?.id}`:
                window.location.assign(`/profile/${userData?.id}`);
                break;
            default:
                break;
        }
    };
    
    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
            to: `/profile/${userData?.id}`,
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'My All Videos',
            to: '/mypost',
        },
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Setting',
            to: '/settings',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/logout',
            separate: true,
        },
    ];
    const handleLogin = useCallback(() => {
        dispatch(showAuthendialog());
    },[dispatch]);
    
    const handleLogoutAccount = useCallback(async() => {
        await logoutAccount();
        dispatch(AuthenLogin.AuthenLoginReset());
        localStorage.removeItem('access_token');
        window.location.replace('/');
    },[dispatch])

    useEffect(() => {
        if (userData && !userData?.email && Object.keys(userData).length > 0) {
            handleLogin();
        }
    }, [userData]);
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="tiktok" />
                </Link>
                <Search />
                <div className={cx('actions')}>
                    {userData && userData?.email ? (
                        <>
                            <Tippy delay={[0, 50]} content="Upload video" placement="bottom">
                                <Link to={"/upload"}>
                                    <button className={cx('action-btn')} >
                                            <UploadIcon />
                                    </button>
                                </Link>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <MessageIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <InboxIcon />
                                    <span className={cx('badge')}>12</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button text>Upload</Button>
                            <Button primary onClick={handleLogin}>
                                Log in
                            </Button>
                        </>
                    )}
                    <Menu items={userData && userData?.email ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {userData?.email ? (
                            <Image
                                src={
                                    userData?.avatar ||
                                    'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D'
                                }
                                className={cx('user-avatar')}
                                alt="Nguyen Van A"
                                // fallback="https://files.fullstack.edu.vn/f8-prod/user_photos/390191/65dbf5490804b.jpg"
                            />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
            {isshow && <Login />}
        </header>
    );
}

export default Header;
