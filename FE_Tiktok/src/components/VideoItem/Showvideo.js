import classNames from 'classnames/bind';
import { memo, useCallback,useState,useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentDots, faMusic, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import Videos from './Videos';
import ButtonIcon from 'components/Button/ButtonIcon';
import styles from './Showvideo.module.scss';
import Image from 'components/Image';
import Button from 'components/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAuthendialog} from 'redux/actions';
import { GetAllpost } from 'redux/actions';

const cx = classNames.bind(styles);

function Showvideo({ prop,user}) {
    console.log("Showvideo props:", prop.listlike);
    const VideoRef = useRef();
    const iduser = Cookies.get('iduser');
    const id = prop.idpost
    const dispatch = useDispatch();
    const [isPortrait, setVideoStyle] = useState(false);
    const [isPauseVideo, setPauseVideo] = useState(true);
    const [showIcon, setShowIcon] = useState(false);
    const navigate = useNavigate();
    const movetocomment = useCallback(() => {
        navigate(`/Comment/${id}-${prop.userID}`);
    },[prop.userID,id]);
    const replacestatusshowlogin = useCallback(() => {
        dispatch(showAuthendialog())
    },[dispatch]);

    const updatestatelike = useCallback((statuslike) => {
        dispatch(GetAllpost.UpdateStatelikeofuser({id:id,typelike:statuslike,UserID:iduser}));
    },[dispatch, id,iduser]);
    
    const addlike = async () => {
        if(user.id === undefined){
            replacestatusshowlogin()
        }else{
            try {
                const {data} = await axios.post('http://localhost:8096/api/createLikepost',{
                    iduser: user.id,
                    idpost: prop.idpost,
                })
                updatestatelike("addlike")
            } catch(err){
                console.log(err.response);
            }
        }
    }

    const removelike = async () => {
        if(user.id === undefined){
            replacestatusshowlogin()
        }else{
            try {
                const {data} = await axios.post('http://localhost:8096/api/removeLikepost',{
                    iduser : user.id,
                    idpost: prop.idpost
                })
                updatestatelike("removelike")
            } catch (err){
                console.log(err.response);
            }
        }
    }
    const setsizeframevideo = () => {
        const videoElement = document.createElement('video'); // Tạo thẻ video trong DOM (ẩn)
        videoElement.src = prop.mediaURL; // Đặt URL từ prop vào video
        videoElement.addEventListener('loadedmetadata', () => {
            const widthvideo = videoElement.videoWidth; // Lấy chiều rộng của video
            const heightvideo = videoElement.videoHeight; // Lấy chiều cao của video
            if (widthvideo > heightvideo) {
                setVideoStyle(false);
            } else {
                setVideoStyle(true);
            }
        });

        videoElement.addEventListener('error', () => {
            console.error('Unable to load video. Please check the URL.');
        });
    }
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
    
    useEffect(() => {
        setsizeframevideo();
    }, []);
    
    return (
        <div className={cx('wrapper')}>
            <div className={cx('AuthorContentWrapper')}>
                <div className={cx('Avatar-container')}>
                    <a href={`/profile/${prop.userID}`} className={cx('AvatarLink')}>
                        <Image
                            src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D"
                            alt="Nguyen Van A"
                            className={cx('user-avatar')}
                        />
                    </a>
                </div>
                <div className={cx('postinfo-container')}>
                    <div className={cx('Main-ContentWrapper')}>
                        {prop.userinfo.fullName ? (
                            <span className={cx('span-text')}>{prop.userinfo.fullName}</span>
                        ) : (
                            <span className={cx('span-text')}>{prop.userinfo.email}</span>
                        )}
                        {/* <span className={cx('span-text')}>{Titlepost}</span> */}
                        <div className={cx('maincontain-wrapper')}>
                            <p>{prop.content}</p>
                        </div>
                    </div>
                    <div className={cx('Final-MainWrapper')}>
                        <FontAwesomeIcon icon={faMusic} className={cx('music-note')} />
                        <span className={cx('span-text-music')}>{prop.namemusicvideo}</span>
                    </div>
                </div>
                {/* <span className={cx('author-title')}>{Titleuser}</span> */}
                <div className={cx('follow-container')}>
                    <Button outline small>
                        Follow
                    </Button>
                </div>
            </div>

            <div className={cx('Actionvideowrapper')}>
                <div className={cx('video-container', isPortrait ? 'portrait' : 'landscape')}>
                    <Videos ref={VideoRef} className={cx('video-itemone')} src={prop.mediaURL} onClick={togglePlayPause}/>
                    {showIcon && (
                        <FontAwesomeIcon
                            icon={isPauseVideo ? faPlay : faPause}
                            className={cx('video-icon')}
                        />
                    )}
                </div>
                <div className={cx('ActionContainer')}>
                        {
                           prop.listlike.some(item => parseInt(item.UserID) ===  parseInt(iduser)) ?  
                                (
                                    <div className={cx('likeaction')} onClick={removelike}>
                                        <ButtonIcon rounded className={cx('btnlike')}>
                                            {<FontAwesomeIcon icon={faHeart} className={cx('likevideo')} />}
                                        </ButtonIcon>
                                        <h4 className={cx('alllike')}>{prop.countlike}</h4>
                                    </div> 
                                ) : 
                                (
                                    <div className={cx('likeaction')} onClick={addlike}>
                                        <ButtonIcon rounded className={cx('btnlike')}>
                                            {<FontAwesomeIcon icon={faHeart} />}
                                        </ButtonIcon>
                                        <h4 className={cx('alllike')}>{prop.countlike}</h4>
                                    </div> 
                                )
                        }
                   {/* <Link to={`/Comment/${id}-${prop.userID}`}> */}
                        <div className={cx('commentaction')} onClick={movetocomment}>
                            <ButtonIcon rounded className={cx('btncomment')}>
                                {<FontAwesomeIcon icon={faCommentDots} />}
                            </ButtonIcon>
                            <h4 className={cx('allcomment')}>{prop.countcomment}</h4>
                        </div>
                   {/* </Link> */}
                </div>
            </div>
        </div>
    );
}

export default memo(Showvideo);
