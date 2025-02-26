import classNames from 'classnames/bind';
import { useState,useCallback,useEffect } from 'react';
import { useDispatch,useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';
//import io from 'socket.io-client';
import axios from 'axios';
import Image from 'components/Image';
import Button from 'components/Button';
import CommentItem from './CommentItem';
import { BsEmojiSmile } from "react-icons/bs";
import { GetAllcomment, GetAllpost,GetAllpostsofowner, showAuthendialog } from 'redux/actions';
import Picker from "emoji-picker-react";
import styles from './Commentcard.module.scss';
const cx = classNames.bind(styles);

function Commentcard({page,errCode,commentitem,countcm}){
   // console.log(errCode);
    const { id } = useParams();
    const [idPost, suffixId] = id.split("-").map(Number);
    const [showPicker,setShowPicker] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [inputStr, setInputStr] = useState("");
   // const [comment, setComment] = useState([]);
   // const [page,setPage] = useState(1);
   
   //console.log(commentitem);
    const iduser = parseInt(Cookies.get('iduser'));
    const dispatch = useDispatch();
    const replacestatusshowlogin = useCallback(() => {
            dispatch(showAuthendialog())
        },[dispatch])
    const addcomment = async () => {
        const {data} = await axios.post('http://localhost:8096/api/createcomment',{
            idpost: idPost,
            comment: inputStr,
            iduser: Cookies.get('iduser')
        });
        setInputStr('');
        dispatch(GetAllpostsofowner.UpdateTotalcomment({id: idPost,countcomment:data.data}));
        dispatch(GetAllpost.ChangeTotalComment({id: idPost,countcomment:data.data}));
    }
    const removeComment = async (idcomment) => {
        const {data} = await axios.post('http://localhost:8096/api/removecomment',{idcomment: idcomment});
      //  console.log(data);
        dispatch(GetAllpostsofowner.UpdateTotalcomment({id: idPost,countcomment:data.data}));
        dispatch(GetAllpost.ChangeTotalComment({id: idPost,countcomment:data.data}));
    }
    const handleInputFocus = () => {
        // Tắt textarea của comment đang chỉnh sửa khi input được focus
        setEditingCommentId(null);
    };
    const onEmojiClick = (event, emojiObject) => {
        console.log(emojiObject.EmojiClickData);
        setInputStr((prevInput) => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };
    const fetchcommentlieoutside = useCallback(() => {
        console.log("Fetching more comments...");
        dispatch(GetAllcomment.GetcommentRequest({IDpost: idPost,_limit:6,_page:page + 1}))
    },[dispatch,page]);
    useEffect(()=> {
        dispatch(GetAllcomment.Resetstatecomment());
        const fetchcomment = ()=>{
            dispatch(GetAllcomment.GetcommentRequest({IDpost: idPost,_limit:6,_page:1}))
        }
        fetchcomment()
    },[dispatch,idPost]);
    return (
        <>
                <div className={cx('Detail_all_comments')} id="wrapper_comment">
                    {commentitem.length === 0 ? (
                        <div className={cx('wrapper_none_comment')}>
                            <span>
                                <Image src="/chat.png" className='img-nonecomment' />
                            </span>

                            <span className={cx('inform_comment')}>Không có comment</span>
                        </div>
                    ) : (
                        <div className={cx('wrapper_comment')} >
                            {commentitem.map((detailcomment, index) => (
                                <CommentItem
                                    comment={detailcomment}
                                    key={index}
                                    onRemove={removeComment}
                                    editingCommentId={editingCommentId}
                                    setEditingCommentId={setEditingCommentId}
                                    iduser={iduser} />
                            ))}
                            <InfiniteScroll
                                dataLength={commentitem.length}
                                next={fetchcommentlieoutside}
                                hasMore={errCode === 0}
                                loader={
                                    <div className={cx('inform-scroll')}>
                                        <h4>Loading...</h4>
                                    </div>
                                }
                                endMessage={
                                    <div className={cx('inform-scroll')}>
                                        <p>
                                            <b>the last of result for search</b>
                                        </p>
                                    </div>
                                }
                                scrollThreshold={0.8}
                                scrollableTarget="wrapper_comment"
                            >
                            </InfiniteScroll>
                        </div>
                    )}
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