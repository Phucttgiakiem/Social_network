import { useCallback,memo,useContext,useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {faHeart, faCommentDots} from '@fortawesome/free-solid-svg-icons';
import styles from './Headercommentcard.module.scss';
import Image from 'components/Image';
import Button from 'components/Button';
import ButtonIcon from 'components/Button/ButtonIcon';
import { showAuthendialog,GetAllpost, GetAllpostsofowner } from 'redux/actions';
import { Statecatalogonheader } from "./Comment";
import socketIOService from '../../services/socketIOService';
import {loginState$} from 'redux/selectors';
const cx = classNames.bind(styles);

function Headercommentcard ({contentpost,commentCount}) {
    const { id } = useParams();
    const {Content,Namemusicvideo,likes,Hashtabvideo,User} = contentpost
    const { catalog, setCatalog } = useContext(Statecatalogonheader);
    const user = useSelector(loginState$)
    const dispatch = useDispatch();
    const replacestatusshowlogin = useCallback(() => {
        dispatch(showAuthendialog())
    },[dispatch])
    const updatestatelike = useCallback((statuslike) => {
        if(statuslike.typelike === "addlike"){
            dispatch(GetAllpostsofowner.UpdateIncreaselike(statuslike));
        }
        else {
            dispatch(GetAllpostsofowner.UpdateDecreaselike(statuslike))
        }
           dispatch(GetAllpost.UpdateStatelikeofuser(statuslike));
    },[dispatch]);
    const addlike = async () => {
        if(user?.id === undefined){
            replacestatusshowlogin()
        }else{
            try {
                await axios.post('http://localhost:3000/api/createLikepost',{
                    iduser: user?.id,
                    idpost: Number.parseInt(id.split("-")[0]),
                })
            } catch(err){
                console.log(err.response.data.error);
            }
        }
    }
    const removelike = async () => {
        if(user?.id === undefined){
            replacestatusshowlogin()
        }else{
            try {
                await axios.post('http://localhost:3000/api/removeLikepost',{
                    iduser :user?.id,
                    idpost: Number.parseInt(id.split("-")[0])
                })
            } catch (err){
                console.log(err.response.data.error);
            }
        }
    }
    useEffect(() => {
            socketIOService.on('add-like', (newpost) => {
                updatestatelike(newpost);
            });
            socketIOService.on('remove-like', (newpost) => {
                updatestatelike(newpost);
            });
            return () => {
                socketIOService.off('add-like');
                socketIOService.off('remove-like');
            }
        }, [updatestatelike]);
    return (
        <>
            <div className={cx('Detail_description')}>
                <div className={cx('Header_description')}>
                    <div className={cx('info_auther')}>
                        <Image src={User?.avatar ||
                            'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D'}
                            alt={User?.fullname || User?.email}
                            className={cx('user-avatar')} />
                    </div>
                    <span className={cx('name-user')}>{User?.fullname ? User?.fullname : User?.email?.split('@')[0] || ''}</span>
                    <Button small primary className={cx('btn-follow')}>Follow</Button>
                </div>
                <div className={cx('main_description')}>
                    <span className={cx('titlepost')}>
                        {Content}
                    </span>
                    <span className={cx('hashtappost')}>
                         {Hashtabvideo}
                        #hashtabvideo
                    </span>
                </div>
                <div className={cx('footer_description')}>
                    <span className={cx('music_background')}>Nhạc nền -</span>
                    <span className={cx('name_music')}>{Namemusicvideo}</span>
                </div>
            </div>
            <div className={cx('action_with_post')}>
                {
                    likes.some(users => Number.parseInt(users.UserID) === user?.id) ? (
                        
                        <div className={cx('likeaction')} onClick={ removelike }>
                                <ButtonIcon rounded className={cx('btnlike')}>
                                    {<FontAwesomeIcon icon={faHeart} className={cx('likevideo')} />}
                                </ButtonIcon>
                                <h4 className={cx('alllike')}>{likes.length}</h4>
                        </div>
                    ):(
                        <div className={cx('likeaction')} onClick={ addlike }>
                            <ButtonIcon rounded className={cx('btnlike')}>
                                {<FontAwesomeIcon icon={faHeart} />}
                            </ButtonIcon>
                            <h4 className={cx('alllike')}>{likes.length}</h4>
                        </div>
                    )
                }
                <div className={cx('commentaction')}>
                        <ButtonIcon rounded className={cx('btncomment')}>
                            {<FontAwesomeIcon icon={faCommentDots} />}
                        </ButtonIcon>
                        <h4 className={cx('allcomment')}>{commentCount}</h4>
                </div>
            </div>
            <div className={cx('Detail_another_info')}>
                <span className={cx('total_comment',{ active: catalog === "comment" })} onClick={() => setCatalog("comment")}>{"Bình luận (" + commentCount + ")"}</span>
                <span className={cx('another_info', { active: catalog === "video_khac" })} onClick={() => setCatalog("video_khac")}>Video khác</span>
            </div>
        </>
    )
}
export default Headercommentcard;