import { useCallback,memo,useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {faHeart, faCommentDots} from '@fortawesome/free-solid-svg-icons';
import styles from './Headercommentcard.module.scss';

import Cookies from 'js-cookie';
import Image from 'components/Image';
import Button from 'components/Button';
import ButtonIcon from 'components/Button/ButtonIcon';
import { showAuthendialog,GetAllpost, GetAllpostsofowner } from 'redux/actions';
import { Statecatalogonheader } from "./Comment";
const cx = classNames.bind(styles);

function Headercommentcard ({contentpost}) {
    const { id } = useParams();
    const {Contentpost,Namemusicvideo,ListLike,CommentCount,email,fullname,avatar} = contentpost
    const { catalog, setCatalog } = useContext(Statecatalogonheader);
    const iduser = Cookies.get('iduser');
    const dispatch = useDispatch();
    const replacestatusshowlogin = useCallback(() => {
        dispatch(showAuthendialog())
    },[dispatch])
    const updatestatelike = useCallback((statuslike) => {
            dispatch(GetAllpost.UpdateStatelikeofuser({id:id.split("-")[0],typelike:statuslike,UserID:iduser}));
    },[dispatch, id,iduser]);
    const addlike = async () => {
        if(iduser === undefined){
            replacestatusshowlogin()
        }else{
            try {
                await axios.post('https://social-network-be-ll5p.onrender.com/api/createLikepost',{
                    iduser: iduser,
                    idpost: id.split("-")[0],
                })
                updatestatelike("addlike");
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
                updatestatelike("removelike");
            } catch (err){
                console.log(err.response.data.error);
            }
        }
    }
    // const nonecomment = () => {
    //         const divcomment = document.getElementById('frame_comment');
    //         const btndown = document.getElementById('btndown').children[0];
    //         btndown.style.transform = 'rotate(0deg)';
    //         btndown.style.transition = 'transform 0.3s ease';
    //         divcomment.style.transform = 'translateY(100vh)';
    //         divcomment.style.transition = 'transform 3s';
    //         setTimeout(() => {
    //             btndown.style.transform = 'rotate(180deg)';
    //         }, 3000);
    // }
    return (
        <>
            <div className={cx('Detail_description')}>
                <div className={cx('Header_description')}>
                    <div className={cx('info_auther')}>
                        <Image src={avatar ||
                            'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D'}
                            alt={fullname || email}
                            className={cx('user-avatar')} />
                    </div>
                    <span className={cx('name-user')}>{fullname ? fullname : email?.split('@')[0] || ''}</span>
                    <Button small primary className={cx('btn-follow')}>Follow</Button>
                </div>
                <div className={cx('main_description')}>
                    <span className={cx('titlepost')}>
                        {Contentpost}
                    </span>
                    <span className={cx('hashtappost')}>
                        {/* {contentpost.hashtabvideo} */}
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
                    ListLike.some(users => users.UserID === iduser) ? (
                        
                        <div className={cx('likeaction')} onClick={ removelike }>
                                <ButtonIcon rounded className={cx('btnlike')}>
                                    {<FontAwesomeIcon icon={faHeart} className={cx('likevideo')} />}
                                </ButtonIcon>
                                <h4 className={cx('alllike')}>{ListLike.length}</h4>
                        </div>
                    ):(
                        <div className={cx('likeaction')} onClick={ addlike }>
                            <ButtonIcon rounded className={cx('btnlike')}>
                                {<FontAwesomeIcon icon={faHeart} />}
                            </ButtonIcon>
                            <h4 className={cx('alllike')}>{ListLike.length}</h4>
                        </div>
                    )
                }
                <div className={cx('commentaction')}>
                        <ButtonIcon rounded className={cx('btncomment')}>
                            {<FontAwesomeIcon icon={faCommentDots} />}
                        </ButtonIcon>
                        <h4 className={cx('allcomment')}>{CommentCount}</h4>
                </div>
            </div>
            <div className={cx('Detail_another_info')}>
                <span className={cx('total_comment',{ active: catalog === "comment" })} onClick={() => setCatalog("comment")}>{"Bình luận (" + CommentCount + ")"}</span>
                <span className={cx('another_info', { active: catalog === "video_khac" })} onClick={() => setCatalog("video_khac")}>Video khác</span>
            </div>
        </>
    )
}
export default memo(Headercommentcard);