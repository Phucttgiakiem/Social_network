import classNames from 'classnames/bind';
import { useState,useCallback,useRef,useEffect } from 'react';
import { useDispatch,useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
//import io from 'socket.io-client';
import axios from 'axios';
import Button from 'components/Button';
import CommentItem from './CommentItem';
import CardCommentloading from '../../components/LoadingCard/CardCommentloading/CardCommentloading';
import { BsEmojiSmile } from "react-icons/bs";
import { GetAllcomment, GetAllpost,GetAllpostsofowner, showAuthendialog } from 'redux/actions';
import {GetAllcomment$} from 'redux/selectors';
import Picker from "emoji-picker-react";
import styles from './Commentcard.module.scss';
import useInfiniteScroll from '../../hook/useInfiniteScroll';
import socketIOService from '../../services/socketIOService';
const cx = classNames.bind(styles);

function Commentcard({iduser}){
   // console.log(errCode);
    const { id } = useParams();
    const [idPost, suffixId] = id.split("-").map(Number);

    const [showPicker,setShowPicker] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [inputStr, setInputStr] = useState("");
   // const [comment, setComment] = useState([]);
   // const [page,setPage] = useState(1);
    const triggerRef = useRef();
    const {hasMore,loading,commentitem} = useSelector(GetAllcomment$);
   // const iduser = parseInt(Cookies.get('iduser'));
    const dispatch = useDispatch();
    const replacestatusshowlogin = useCallback(() => {
            dispatch(showAuthendialog())
        },[dispatch])
    useEffect(()=> {
        socketIOService.on('add-comment',newltcm => {
            dispatch(GetAllcomment.Updatenewcomment(newltcm));
        })
        socketIOService.on('remove-com',commentdelete => {
            dispatch(GetAllcomment.Deleteavailablecomment(commentdelete));
        }) 
        socketIOService.on('edit-com',commentedit => {
            dispatch(GetAllcomment.Updateavailablecomment(commentedit));
        })
        return () => {
            socketIOService.off('add-comment');
            socketIOService.off('remove-com');
            socketIOService.off('edit-com');
        };
    },[])
    const addcomment = async () => {
        const {data} = await axios.post('http://localhost:3000/api/createcomment',{
            idpost: idPost,
            comment: inputStr,
            iduser
        });
        setInputStr('');
        dispatch(GetAllpostsofowner.UpdateTotalcomment({id: idPost,countcomment:data.data}));
        dispatch(GetAllpost.ChangeTotalComment({id: idPost,countcomment:data.data}));
    }
    const removeComment = async (idcomment) => {
        const {data} = await axios.post('http://localhost:3000/api/removecomment',{idcomment: idcomment});
        dispatch(GetAllpostsofowner.UpdateTotalcomment({id: idPost,countcomment:data.data}));
        dispatch(GetAllpost.ChangeTotalComment({id: idPost,countcomment:data.data}));
    }
    const handleInputFocus = () => {
        // Tắt textarea của comment đang chỉnh sửa khi input được focus
        setEditingCommentId(null);
    };
    const onEmojiClick = (event, emojiObject) => {
       // console.log(emojiObject.EmojiClickData);
        setInputStr((prevInput) => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };
    /* useInfiniteScroll(triggerRef, () => {
        if (hasMore) {
            dispatch(GetAllcomment.LoadComment({IDpost: idPost,_limit:6}));
        }
    }); */
    useInfiniteScroll({triggerRef,
        loadAction:GetAllcomment.LoadComment,
        selectState: GetAllcomment$,
        payload: {
            IDpost: idPost,
            _limit: 6
        },
        options: {
            root: document.querySelector('#wrapper_comment'),
            threshold: 0.1,
            rootMargin: '200px'
        }
    })
    useEffect(() => {
        dispatch(GetAllcomment.ResetComment());
        dispatch(GetAllcomment.LoadComment({ IDpost: idPost, _limit: 6 }));
    }, [idPost]);

    return (
        <>
                <div className={cx('Detail_all_comments')} id="wrapper_comment">
                    {commentitem.length > 0 && commentitem.map(cmt => (
                        <CommentItem key={cmt.id} comment={cmt} iduser={iduser} editingCommentId={editingCommentId}
                                    setEditingCommentId={setEditingCommentId} onRemove={removeComment}/>
                        ))}
                    {
                        <div ref={triggerRef}>
                            {loading &&
                                Array.from({ length: 6 }).map((_, i) => (
                                    <CardCommentloading key={i} />
                                ))
                            }
                        </div>
                    }

                </div>
                <div className={cx('Footer')}>
                    <div className={cx('func_another')}>
                        {iduser ? (
                            <>
                                <div className={cx('parent_inp_comt')}>
                                    <input type="text" placeholder='Type content of your comment' className={cx('commenthere')} value={inputStr}
                                        onChange={(e) => setInputStr(e.target.value)}
                                        onFocus={handleInputFocus} />
                                    {showPicker && (
                                        <div
                                            style={{
                                                position: 'absolute', // Picker luôn cố định trên màn hình
                                                bottom: '50px', // Điều chỉnh khoảng cách từ đáy màn hình
                                                right: '0px', // Điều chỉnh khoảng cách từ trái màn hình (hoặc dùng right)
                                                zIndex: 10,
                                            }}
                                        >
                                            <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}
                                    <BsEmojiSmile className={cx('emoji_style')} onClick={() => setShowPicker((val) => !val)} />
                                </div>
                                {inputStr ? (
                                    <Button className={cx('btn-sendlight')} onClick={addcomment}>Send</Button>
                                ) : (
                                    <Button disabled>Send</Button>
                                )}

                            </>
                        ) : (
                            <div className={cx('wrapper_info_login')} onClick={replacestatusshowlogin}>
                                Đăng nhập để bình luận
                            </div>
                        )}
                    </div>
                </div>
        </>
    )
}
export default Commentcard;