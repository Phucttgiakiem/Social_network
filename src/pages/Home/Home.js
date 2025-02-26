import classNames from 'classnames/bind';
import { useEffect,memo, useCallback, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
//import axios from 'axios';
import Showvideo from 'components/VideoItem/Showvideo';
//import Comment from 'pages/Comment/Comment';
//import Login from 'pages/login/Login';
import styles from './Home.module.scss';
import Cookies from 'js-cookie';

import { useDispatch, useSelector } from 'react-redux';
import { GetAllpostState$} from 'redux/selectors';
import { GetAllpost } from 'redux/actions';
import io from 'socket.io-client';
const cx = classNames.bind(styles);

const socket = io('https://social-network-be-ll5p.onrender.com', {
    reconnection: true
});

function Home() {
   // const [datapost, setDatapost] = useState([]);
  //  const [postAddLike, setPostAddLike] = useState([]);
  //  const [postRemoveLike, setPostRemoveLike] = useState([]);
   // const [getdata, setIsgetdata] = useState(false);
    const page = useRef(1);
    const {message,postofuser} = useSelector(GetAllpostState$);
    const dispatch = useDispatch();
    const userFromCookies = {
        email: Cookies.get('useremail'),
        avatar: Cookies.get('avatar'),
        fullName: Cookies.get('username'),
        id: Cookies.get('iduser'),
    }; 
    
    const user = userFromCookies;   
    console.log(postofuser);
   /*  const showPost = async (user) => {
        /* try {
            const {data} = await axios.post("https://social-network-be-ll5p.onrender.com/api/getPost",{ Iduser: user.id || null});
            setDatapost(data.post);
        }catch(err){
            console.log(err);
        }
    } */
   
       // showPost(user);
    const fetchPost = useCallback(() => {
        page.current = page.current + 1;
        dispatch(GetAllpost.GetpostRequest({ Iduser: user.id || null, _page: page.current,_limit: 2 }));
       // setIsgetdata(false);
    },[page])
    // const handleScroll = useCallback(() => {
    //     const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    //     // if client scroll near bottom of page then load more data
    //     if (scrollTop + clientHeight >= scrollHeight - 10) {
    //         setPage(prev => prev + 1);
    //       //  setIsgetdata(true);
    //     }
    // },[setPage])
    const updatecountlike = useCallback((data) => {
        const {id,countlike} = data.data
        const action = GetAllpost.ChangeTotallike({
            id: id,
            countlike: countlike,
        });
        dispatch(action);
    },[dispatch])
    useEffect(() => {
        socket.on('add-like', (newpost) => {
            updatecountlike(newpost);
        });
        socket.on('remove-like', (newpost) => {
            updatecountlike(newpost);
        });
        return () => {
            socket.off('add-like');
            socket.off('remove-like');
        }
    }, [updatecountlike]);
    // useEffect(() => {
        //     window.addEventListener("scroll", handleScroll);
        //     return () => {
            //         window.removeEventListener("scroll", handleScroll);
            //     };
            // }, [handleScroll]);
            // let uiPosts = postAddLike.length > 0 ? postAddLike : postRemoveLike.length > 0 ? postRemoveLike : datapost;
    useEffect(() => {
      //  dispatch(GetAllpost.Resetstatepost());
        dispatch(GetAllpost.GetpostRequest({ Iduser: user.id || null, _page: 1, _limit: 2 }));
    }, [dispatch,user.id]);
    return (
        <div className={cx('home')}>
            {   
                postofuser && postofuser.length > 0 ? (
                    postofuser.map((item,index) => (
                        <Showvideo
                            key={index}
                            prop={item}
                            user={user}
                        />   
                    ))
                ):(
                    <p>Không tìm thấy bài đăng</p>
                )
                
            }
            <InfiniteScroll
                dataLength={postofuser.length}
                next={fetchPost}
                hasMore={message === 'Cannot found post' ? false : true}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                  pullDownToRefreshThreshold={210}
            >
            </InfiniteScroll>
        </div>
            
    );
}
export default Home;
