import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { MdLogout } from "react-icons/md";
import Tippy from '@tippyjs/react/headless';
import Cookies from 'js-cookie';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Headermobile.module.scss';
import { faHome, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { showAuthendialog,AuthenLogin } from 'redux/actions';
import { AuthenDialogState$ } from 'redux/selectors';
import Login from 'pages/login';
const cx = classNames.bind(styles);
function Headermobile () {
    const {isshow} = useSelector(AuthenDialogState$);
    const username = Cookies.get('username');
    const id = Cookies.get('iduser');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const replacestatusshowlogin = useCallback(() => {
            dispatch(showAuthendialog())
    },[dispatch])
    const moveprofile = () => {
        navigate(`/profile/${id}`)
    }
    const handleLogoutAccount = useCallback(() => {
            // remove all Cookies
            Cookies.remove('useremail');
            Cookies.remove('avatar');
            Cookies.remove('username');
            Cookies.remove('iduser');
            dispatch(AuthenLogin.AuthenLoginReset());
            window.location.reload();
        },[dispatch])
    const renderbtnclient = () => {
        return (
            <div className={cx('actions-profile')}>
                <div className={cx('wrapper-profile')} onClick={() => moveprofile()}>
                    <span className={cx('icon-profile')}>
                        <ImProfile />
                    </span>
                    <span className={cx('title-profile')}>Profile</span>
                </div>
                <div className={cx('wrapper-logout')} onClick={() => handleLogoutAccount()}>
                    <span className={cx('icon-logout')}>
                        <MdLogout />
                    </span>
                    <span className={cx('title-logout')}>Logout</span>
                </div>
            </div>
        )
    }
    return (
        <header className={cx('wrapper')}>
            {
                isshow && <Login/>
            }
            <div className={cx('actions')}>
                <Link to="/" className={cx('nav-btn')}>
                    <button className={cx('home-btn')}>
                        <FontAwesomeIcon icon={faHome} />
                        <span>Home</span>
                    </button>
                </Link>
                <Link to="/inbox" className={cx('nav-btn')}>
                    <button className={cx('inbox-btn')}>
                        <FontAwesomeIcon icon={faMessage} />
                        <span>Inbox</span>
                    </button>
                </Link>
                {
                    username !== undefined ? (
                        <Tippy
                            interactive
                          //  trigger="click"
                            offset={[-50,5]}
                            delay={[0,30]}
                            placement="top"
                            render={() => renderbtnclient()}
                        >
                            <div className={cx('nav-btn')}>
                                <button className={cx('profile-btn')}>
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Me</span>
                                </button>
                            </div>
                        </Tippy>
                    ) : (
                        <div className={cx('nav-btn')}>
                            <button className={cx('profile-btn')} onClick={() => replacestatusshowlogin()}>
                                <FontAwesomeIcon icon={faUser} />
                                <span>Login</span>
                            </button>
                        </div>
                    )
                }
            </div>
        </header>
    )
}
export default Headermobile;