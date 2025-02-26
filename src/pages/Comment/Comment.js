import classNames from 'classnames/bind';
import { useCallback,useState, useEffect,useRef,memo,createContext } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons';
//import axios from 'axios';
import styles from './Comment.module.scss';
import { OffIcon } from 'components/Icons';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import Videos from 'components/VideoItem/Videos';
import { Link } from 'react-router-dom';
import { GetAllpostsofowner,showAuthendialog,GetAllpost } from "redux/actions";
import { AuthenDialogState$,GetAllpostsowner$,GetAllcomment$ } from 'redux/selectors';
import { GetAllcomment } from 'redux/actions';
import Login from 'pages/login';
import Commentcard from './Commentcard';
import Headercommentcard from './Headercommentcard';
import Videocard from './Videocard';
import Image from 'components/Image';
import ButtonIcon from 'components/Button/ButtonIcon';
import { faMusic,faHeart,faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { IoIosArrowDown } from "react-icons/io";
const cx = classNames.bind(styles);
export const Statecatalogonheader = createContext();
const socket = io('https://social-network-be-ll5p.onrender.com', {
    reconnection: true
});
function Comment() {
    const { id } = useParams();
    // const [contentpost,setData] = useState([]);
    // const [datacomment,setDatacomment] = useState([]);
    // const [totalcomment,setDatatotalcomment] = useState(0);
    // const [lscommentAdd,setAddcom] = useState([]);
    // const [lscommentRem,setRemove] = useState([]);
    // const [lscommentEdit,setEditcom] = useState([]);
    const [isPauseVideo, setPauseVideo] = useState(true);
    const [idownerlink, setIdowner] = useState(id.split("-")[1]);
    const [catalog, setCatalog] = useState("comment");
    const [isCommentVisible, setIsCommentVisible] = useState(true);
    const [isscroll, setScroll] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [detailpost,setDetailpost] = useState({
        idpost: "",
        Contentpost: "",
        URLvideo: "",
        Updatedate: "",
        Namemusicvideo: "",
        ListLike: [],
        CommentCount: "",
        idowner: "",
        email: "",
        fullname: "",
        avatar: "",
    });
    const VideoRef = useRef();
    const itemVideoRef = useRef(0);
    const {isshow} = useSelector(AuthenDialogState$);
    
    const dispatch = useDispatch();
   // const [pagevideo,setPagevideo] = useState(1);
   // const {message,postofuser} = useSelector(GetAllpostState$);
   // console.log("data root: ",postofuser);
    const {pagepost,postdata} = useSelector(GetAllpostsowner$)
    const navigate = useNavigate();
    const iduser = Cookies.get('iduser');
    const {page,errCode,commentitem} = useSelector(GetAllcomment$);
    const updatestatelike = useCallback((statuslike) => {
        dispatch(GetAllpost.UpdateStatelikeofuser({id:id.split("-")[0],typelike:statuslike,UserID:iduser}));
    },[dispatch, id,iduser]);
    const replacestatusshowlogin = useCallback(() => {
            dispatch(showAuthendialog())
    },[dispatch])
    const addlike = async () => {
        if(iduser === undefined){
            replacestatusshowlogin()
        }else{
            try {
                await axios.post('https://social-network-be-ll5p.onrender.com/api/createLikepost',{
                    iduser: iduser,
                    idpost: id.split("-")[0],
                })
                
            } catch(err){
                console.log(err.response.data.error);
            }
        }
    }
    const removelike = async () => {
        if(iduser === undefined){
            replacestatusshowlogin()
        }else{
            try {
                await axios.post('https://social-network-be-ll5p.onrender.com/api/removeLikepost',{
                    iduser :iduser,
                    idpost: id.split("-")[0]
                })
                
            //  dispatch(GetAllpostsofowner.UpdateDecreaselike({UserID: iduser}));
            } catch (err){
                console.log(err.response.data.error);
            }
        }
    }
    const updatelike = useCallback(() => {
        dispatch (GetAllpostsofowner.UpdateIncreaselike({
            id: parseInt(id.split("-")[0]),
            newuser: {
                UserID: iduser
            }
        }))
    },[dispatch,iduser,id])
    const updateunlike = useCallback(() => {
        dispatch (GetAllpostsofowner.UpdateDecreaselike({
            id: parseInt(id.split("-")[0]),
            olduser: {
                UserID: iduser
            }
        }))
    },[dispatch,iduser,id])
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
        }
        else {
            setScroll(true);
        }
    };
    const fetchPostlimit = () => {
        dispatch(GetAllpostsofowner.postRequest({
            Iduser: parseInt(idownerlink),
            _limit: 7,
            _page: pagepost
        }));
      //  console.log("pagevideo: ",pagevideo);
    }
    useEffect(() => {
        
        if (isscroll) {
    
            fetchPostlimit();
            setScroll(false);
        }
    },[isscroll,setScroll]);
    useEffect(()=> {
        socket.on('add-like', (newpost) => {
            updatestatelike("addlike");
            updatelike();
        });
        socket.on('remove-like', (newpost) => {
            updatestatelike("removelike");
            updateunlike();
        });
        socket.on('add-comment',newltcm => {
            dispatch(GetAllcomment.Updatenewcomment(newltcm));
        })
        socket.on('remove-com',commentdelete => {
            dispatch(GetAllcomment.Deleteavailablecomment(commentdelete));
        })
        socket.on('edit-com',commentedit => {
            dispatch(GetAllcomment.Updateavailablecomment(commentedit));
        })
        return () => {
            socket.off('add-like');
            socket.off('remove-like');
            socket.off('add-comment');
            socket.off('remove-com');
            socket.off('edit-com');
        };
    },[dispatch,updateunlike,updatelike,updatestatelike])
    
    useEffect(()=>{
        //console.log("Data updated: ", data);
        if(Array.isArray(postdata) && postdata.length > 0){
            let codepost = parseInt(id.split("-")[0]);
            for(let i = 0; i < postdata.length; i++){
                if(postdata[i].id === codepost){
                    setDetailpost({
                        idpost: postdata[i].id,
                        Contentpost: postdata[i].Content,
                        URLvideo: postdata[i].MediaURL,
                        Updatedate: postdata[i].updateAt,
                        Namemusicvideo: postdata[i].Namemusicvideo,
                        ListLike: postdata[i].likes,
                        CommentCount: postdata[i].commentCount,
                        idowner: postdata[i].User.id,
                        email: postdata[i].User.email,
                        fullname: postdata[i].User.fullName,
                        avatar: postdata[i].User.avatar || ""
                    })
                    break;
                }
            }
        }
    },[postdata,id,setDetailpost]);
    
    useEffect(()=>{
        const fetchAllposts = ()=> {
            dispatch(GetAllpostsofowner.Resetstatepost());
            dispatch(GetAllpostsofowner.postRequest({
                Iduser: parseInt(idownerlink),
                _limit: 7,
                _page: 1
            }))
        }
        fetchAllposts();
    },[dispatch,idownerlink]);
   // console.log('scroll video: ',isscroll);
    return (
        <div className={cx('wrapper')}>
            {isshow && <Login />}
            <div className={cx('userpost')}>
                <Videos ref={VideoRef} className={cx('stylevideo')} src={detailpost.URLvideo} onClick={togglePlayPause}/>
                {showIcon && (
                    <FontAwesomeIcon
                        icon={isPauseVideo ? faPlay : faPause}
                        className={cx('video-icon')}
                    />
                )}
                <div className={cx('wrapper-info-post')}>
                    <div className={cx('Avatar-container')}>
                        <a href={`/profile/${detailpost.idowner}`} className={cx('AvatarLink')}>
                            <Image
                                src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D"
                                alt="Nguyen Van A"
                                className={cx('user-avatar')}
                            />
                        </a>
                    </div>
                    <div className={cx('postinfo-container')}>
                        <div className={cx('Main-ContentWrapper')}>
                            {detailpost.fullname ? (
                                <span className={cx('span-text')}>{detailpost.fullname}</span>
                            ) : (
                                <span className={cx('span-text')}>{detailpost.email}</span>
                            )}
                            {/* <span className={cx('span-text')}>{Titlepost}</span> */}
                            <div className={cx('maincontain-wrapper')}>
                                <p>{detailpost.Contentpost}</p>
                            </div>
                        </div>
                        <div className={cx('Final-MainWrapper')}>
                            <FontAwesomeIcon icon={faMusic} className={cx('music-note')} />
                            <span className={cx('span-text-music')}>{detailpost.Namemusicvideo}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('ActionContainer')}>
                    {
                        detailpost.ListLike.some(users => users.UserID === iduser) ?  
                            (
                                <div className={cx('likeaction')} onClick={ removelike }>
                                    <ButtonIcon rounded className={cx('btnlike')}>
                                        {<FontAwesomeIcon icon={faHeart} className={cx('likevideo')} />}
                                    </ButtonIcon>
                                    <h4 className={cx('alllike')}>{detailpost.ListLike.length}</h4>
                                </div> 
                            ) : 
                            (
                                <div className={cx('likeaction')} onClick={ addlike }>
                                    <ButtonIcon rounded className={cx('btnlike')}>
                                        {<FontAwesomeIcon icon={faHeart} />}
                                    </ButtonIcon>
                                    <h4 className={cx('alllike')}>{detailpost.ListLike.length}</h4>
                                </div> 
                            )
                    }
                    <div className={cx('commentaction')} onClick={() => showcomment()}>
                        <ButtonIcon rounded className={cx('btncomment')}>
                            {<FontAwesomeIcon icon={faCommentDots} />}
                        </ButtonIcon>
                        <h4 className={cx('allcomment')}>{detailpost.CommentCount}</h4>
                    </div>
                </div>
                <Link to={"/"}>
                    <span className={cx('btn-closewrap')}>{<OffIcon className={cx('close-video')} width='1.8rem' height='1.8rem' />}
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
                    <Headercommentcard contentpost={detailpost} isVisible={isCommentVisible}/>
                </Statecatalogonheader.Provider>
                 {
                    catalog === "comment" ? 
                    (<Commentcard page = {page} errCode={errCode} commentitem = {commentitem} countcm={detailpost.CommentCount}/>) 
                        : 
                    (<Videocard prop={postdata} onScroll={setScroll}/>)
                 }
            </div>
        </div>
    );
}

export default Comment;
