import classNames from 'classnames/bind';
import { useEffect, useCallback, useRef} from 'react';
import Showvideo from 'components/VideoItem/Showvideo';
import styles from './Home.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { GetAllpostState$,loginState$} from 'redux/selectors';
import { GetAllpost,GetAllpostsofowner } from 'redux/actions';
import CardPostloading from "../../components/LoadingCard/CardPostloading/CardPostloading";

import useInfiniteScroll from '../../hook/useInfiniteScroll';
import socketIOService from '../../services/socketIOService';
const cx = classNames.bind(styles);


function Home() {
    const {hasMore,loading,posts} = useSelector(GetAllpostState$);
    const triggerRef = useRef();
    const user = useSelector(loginState$)
    const dispatch = useDispatch();
    useInfiniteScroll({
        triggerRef,
        loadAction: GetAllpost.LoadPosts,
        selectState: GetAllpostState$,
        payload: {
            _limit: 2
        },
        options: {
            root: document.querySelector('#wrapper_post'),
            threshold: 0.1,
            rootMargin: '200px'
        }
    });
    const updatecountlike = useCallback((data) => {
        const {id,countlike,typelike,UserID} = data
        dispatch(GetAllpost.UpdateStatelikeofuser({
            id: id,
            countlike: countlike,
            typelike:typelike,
            UserID:UserID
        }));
    },[dispatch])
    useEffect(() => {
        socketIOService.on('add-like', (newpost) => {
            updatecountlike(newpost);
            dispatch(GetAllpostsofowner.UpdateIncreaselike(newpost));
        });
        socketIOService.on('remove-like', (newpost) => {
            updatecountlike(newpost);
             dispatch(GetAllpostsofowner.UpdateDecreaselike(newpost));
        });
        return () => {
            socketIOService.off('add-like');
            socketIOService.off('remove-like');
        }
    }, [updatecountlike,dispatch]);
    
    return (
        <div className={cx('home')} id="wrapper_post">
            {   
                posts && posts.length > 0 ? 
                    posts.map((item) => (
                        <Showvideo
                            key={item.idpost}
                            prop={item}
                            user={user}
                        />  
                    )) : 
                    <h3>Không có bài đăng</h3>
            }
            {!hasMore && (
                <div ref={triggerRef}>
                    {loading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <CardPostloading key={i} />
                        ))
                    }
                </div>
            )}
        </div>
    )
}
export default Home;
