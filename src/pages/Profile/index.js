/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusEditprofile$, DetailuserState$, GetAllpostsowner$ } from 'redux/selectors';
import styles from './Profile.module.scss';
import Button from 'components/Button';
import Image from 'components/Image';
import { Link, useParams } from 'react-router-dom';
import { GridVideo, LikeVideo, NoneVideo } from '~/components/Icons';
import { showEditprofile, GetAllpostsofowner } from 'redux/actions';
import Editprofile from './Editprofile';
import { getUsernotAuth } from '../../api/index';
const cx = classNames.bind(styles);
function Profile() {
    const { id } = useParams();
    const { postdata } = useSelector(GetAllpostsowner$);
    const [activeTab, setActiveTab] = useState('Videos');
    const [DataVideoLike, setDataVideolike] = useState([]);
    const { showEdit } = useSelector(StatusEditprofile$);
    const reduxUserData = useSelector(DetailuserState$);
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();
    const handlechangeEditprofile = useCallback(() => {
        dispatch(showEditprofile());
    }, [dispatch]);
    useEffect(() => {
        if (!id) return;
        dispatch(GetAllpostsofowner.postRequest({ Iduser: id }));
    }, [id, dispatch]);

    useEffect(() => {
        const fetchUser = async () => {
            if (reduxUserData && Object.keys(reduxUserData).length > 0) {
                setUserData(reduxUserData);
            } else {
                const res = await getUsernotAuth({ id });
                setUserData(res.data.profileuser);
            }
        };
        fetchUser();
    }, [reduxUserData, id]);
    useEffect(() => {
        if (activeTab === 'Liked') {
            setDataVideolike(postdata.filter((item) => item.likes?.length > 0));
        } else {
            setDataVideolike([]);
        }
    }, [activeTab, postdata]);
    let video = activeTab === 'Videos' ? postdata : DataVideoLike;
    return (
        <>
            {showEdit && <Editprofile prop={userData} />}
            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <div className={cx('avatar')}>
                        <Image
                            className={cx('user-avatar')}
                            src={
                                'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D'
                            }
                            alt="avatar user"
                        />
                    </div>
                    <div className={cx('title')}>
                        <div className={cx('userIdentifier')}>
                            <h1>{userData && userData.fullName ? userData.fullName : userData?.email}</h1>
                        </div>
                        {Number(id) === userData?.id && userData?.access_Token &&(
                            <div className={cx('btnpanel')}>
                                <Button primary onClick={() => handlechangeEditprofile()}>
                                    Edit profile
                                </Button>
                            </div>
                        )}

                        <div className={cx('CountInfo')}>
                            <div className={cx('Info-one')}>
                                <strong>0</strong>
                                <span>Followers</span>
                            </div>
                        </div>
                        <div className={cx('Bio')}>
                            <p>{userData?.Bio}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('main')}>
                    <div className={cx('FeedTabwrapper')}>
                        <div onClick={() => setActiveTab('Videos')} className={cx({ active: activeTab === 'Videos' })}>
                            <GridVideo className={cx('icon-feed')} />
                            <span>Videos</span>
                        </div>
                        <div onClick={() => setActiveTab('Liked')} className={cx({ active: activeTab === 'Liked' })}>
                            <LikeVideo className={cx('icon-feed')} />
                            <span>Liked</span>
                        </div>
                    </div>
                    <div className={cx('maindetailwrapper')}>
                        {video.length > 0 ? (
                            video.map((item, index) => (
                                <Link to={`/Comment/${item.id}-${item.UserID}`} key={index}>
                                    <div className={cx('wrapper-videoitem')}>
                                        <video className={cx('video-style')} preload="auto" muted>
                                            <source src={item.MediaURL} />
                                        </video>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className={cx('diverrorContainer')}>
                                <div className={cx('diverrorIconwrapper')}>
                                    <NoneVideo />
                                </div>
                                <p>Upload your first video</p>
                                <p>Your videos will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
