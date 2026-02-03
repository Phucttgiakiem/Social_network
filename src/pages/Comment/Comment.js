import classNames from 'classnames/bind';
import { useCallback, useState, useEffect, useRef, memo, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
//import axios from 'axios';
import styles from './Comment.module.scss';
import { OffIcon } from 'components/Icons';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Videos from 'components/VideoItem/Videos';
import { Link } from 'react-router-dom';
import { GetAllpostsofowner, showAuthendialog, GetAllpost } from 'redux/actions';
import { AuthenDialogState$, GetAllpostsowner$, DetailuserState$ } from 'redux/selectors';
import { GetAllcomment } from 'redux/actions';
import Login from 'pages/login';
import Commentcard from './Commentcard';
import Headercommentcard from './Headercommentcard';
import Videocard from './Videocard';
import Image from 'components/Image';
import ButtonIcon from 'components/Button/ButtonIcon';
import { faMusic, faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { getPost } from '../../api/index';

const cx = classNames.bind(styles);
export const Statecatalogonheader = createContext();
function Comment() {
    const { id } = useParams();
    const [isPauseVideo, setPauseVideo] = useState(true);
    const [idownerlink, setIdowner] = useState(id.split('-')[1]);
    const [catalog, setCatalog] = useState('comment');
    const [isCommentVisible, setIsCommentVisible] = useState(true);
    const [isscroll, setScroll] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const { postdata } = useSelector(GetAllpostsowner$);
    const detailpost = postdata.find(p => p.id === parseInt(id.split('-')[0]));
    const VideoRef = useRef();
    const itemVideoRef = useRef(0);
    const { isshow } = useSelector(AuthenDialogState$);
    const userData = useSelector(DetailuserState$);
    const dispatch = useDispatch();

    const commentCount = detailpost?.commentCount ?? 0;
    const navigate = useNavigate();
    
    // part for handle with video
    const togglePlayPause = () => {
        if (VideoRef.current) {
            if (isPauseVideo) {
                VideoRef.current.play(); // Gọi phương thức play() từ ref của video
            } else {
                VideoRef.current.pause(); // Gọi phương thức pause() từ ref của video
            }
            setPauseVideo(!isPauseVideo); // Đảo trạng thái play/pause
            setShowIcon(true);

            setTimeout(() => {
                setShowIcon(false);
            }, 1500);
        }
    };
    const showcomment = () => {
        setIsCommentVisible(true);
    };

    const nonecomment = () => {
        const btndown = document.getElementById('btndown').children[0];
        setIsCommentVisible(false);
    };

    const handlePrevVideo = () => {
        if (itemVideoRef.current > 0) {
            itemVideoRef.current -= 1;
            const newVideo = postdata[itemVideoRef.current];
            if (newVideo) {
                navigate(`/Comment/${newVideo.id}-${idownerlink}`);
            }
        }
    };

    const handleNextVideo = () => {
        if (itemVideoRef.current < postdata.length - 1) {
            itemVideoRef.current += 1;
            const newVideo = postdata[itemVideoRef.current];
            if (newVideo) {
                navigate(`/Comment/${newVideo.id}-${idownerlink}`);
            }
        } else {
            setScroll(true);
        }
    };


    useEffect(()=>{
        const fetchAllposts = ()=> {
            dispatch(GetAllpostsofowner.Resetstatepost());
            dispatch(GetAllpostsofowner.postRequest({
                Iduser: parseInt(idownerlink),
            }))
        }
        fetchAllposts();
    },[idownerlink]);
    return (
        <div className={cx('wrapper')}>
            {isshow && <Login />}
            <div className={cx('userpost')}>
                <Videos
                    ref={VideoRef}
                    className={cx('stylevideo')}
                    src={detailpost?.mediaURL}
                    onClick={togglePlayPause}
                />
                {showIcon && <FontAwesomeIcon icon={isPauseVideo ? faPlay : faPause} className={cx('video-icon')} />}
                <div className={cx('wrapper-info-post')}>
                    <div className={cx('Avatar-container')}>
                        <a href={`/profile/${detailpost?.UserID}`} className={cx('AvatarLink')}>
                            <Image
                                src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D"
                                alt="Nguyen Van A"
                                className={cx('user-avatar')}
                            />
                        </a>
                    </div>
                    <div className={cx('postinfo-container')}>
                        <div className={cx('Main-ContentWrapper')}>
                            {detailpost?.userinfo?.fullname ? (
                                <span className={cx('span-text')}>{detailpost?.User?.fullname}</span>
                            ) : (
                                <span className={cx('span-text')}>{detailpost?.User?.email}</span>
                            )}
                            {/* <span className={cx('span-text')}>{Titlepost}</span> */}
                            <div className={cx('maincontain-wrapper')}>
                                <p>{detailpost?.Content}</p>
                            </div>
                        </div>
                        <div className={cx('Final-MainWrapper')}>
                            <FontAwesomeIcon icon={faMusic} className={cx('music-note')} />
                            <span className={cx('span-text-music')}>{detailpost?.Namemusicvideo}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('ActionContainer')}>
                    {detailpost?.likes.some((users) => Number.parseInt(users.UserID) === userData?.id) ? (
                        <div className={cx('likeaction')}>
                            <ButtonIcon rounded className={cx('btnlike')}>
                                {<FontAwesomeIcon icon={faHeart} className={cx('likevideo')} />}
                            </ButtonIcon>
                            <h4 className={cx('alllike')}>{detailpost?.likes.length}</h4>
                        </div>
                    ) : (
                        <div className={cx('likeaction')}>
                            <ButtonIcon rounded className={cx('btnlike')}>
                                {<FontAwesomeIcon icon={faHeart} />}
                            </ButtonIcon>
                            <h4 className={cx('alllike')}>{detailpost?.likes.length}</h4>
                        </div>
                    )}
                    <div className={cx('commentaction')} onClick={() => showcomment()}>
                        <ButtonIcon rounded className={cx('btncomment')}>
                            {<FontAwesomeIcon icon={faCommentDots} />}
                        </ButtonIcon>
                        <h4 className={cx('allcomment')}>{commentCount}</h4>
                    </div>
                </div>
                <Link to={'/'}>
                    <span className={cx('btn-closewrap')}>
                        {<OffIcon className={cx('close-video')} width="1.8rem" height="1.8rem" />}
                    </span>
                </Link>
                <div className={cx('wrapper-next-stepvideo')}>
                    <span className={cx('btn-stevvideo')} onClick={() => handlePrevVideo()}>
                        <IoIosArrowDown />
                    </span>
                    <span className={cx('btn-nextvideo')} onClick={() => handleNextVideo()}>
                        <IoIosArrowDown />
                    </span>
                </div>
            </div>
            <div id="frame_comment" className={cx('Description_of_post',isCommentVisible? 'show':'hide')}>
                <span id="btndown" className={cx('btn-down')} onClick={nonecomment} >
                    <IoIosArrowDown />
                </span>
                <Statecatalogonheader.Provider value={{ catalog, setCatalog }}>
                   {detailpost && ( <Headercommentcard contentpost={detailpost} isVisible={isCommentVisible} commentCount={commentCount}/>)}
                </Statecatalogonheader.Provider>
                    {
                    catalog === "comment" ? 
                    (<Commentcard iduser={userData?.id}/>) 
                        : 
                    (<Videocard prop={postdata} />)
                    }
                
            </div>
        </div>
    )
    
}

export default Comment;
