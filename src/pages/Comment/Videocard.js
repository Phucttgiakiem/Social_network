import classNames from 'classnames/bind';
import styles from './Videocard.module.scss';
import { useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { memo } from "react";
const cx = classNames.bind(styles);

function Videocard ({prop}) {
    const wrapperRef = useRef(null);
    const { id } = useParams();
    const [idPost, suffixId] = id.split("-").map(Number);
    const navigate = useNavigate();
    //console.log(idPost);
    const handleClick = (itemId) => {
        navigate(`/Comment/${itemId}-${suffixId}`); 
    };
    return (
        <div ref={wrapperRef} className={cx('wrapper')}>
            {
                prop.map((item,index) => (
                    <div key={index} className={cx('cardvideo')} onClick={() => handleClick(item.id)}>
                        <img
                            src="/audio_wave.gif"
                            alt="wave"
                            className={cx("ware_icon")}
                            style={{ visibility: item.id === idPost ? 'visible' : 'hidden' }}
                        />
                        <video src={item.MediaURL} type="video/mp4"/>
                    </div>
                ))
            }
        </div>
    )
}
export default memo(Videocard);