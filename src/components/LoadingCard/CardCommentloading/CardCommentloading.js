import classNames from 'classnames/bind';
import styles from './CardCommentloading.module.scss';
const cx = classNames.bind(styles);
function CardCommentloading () {
    return (
        <div className={cx('comment-card')}>
            <div className={cx('left-comment-card')}>
                <span className={cx('image-comment-card','shimmer')}></span>
            </div>
            <div className={cx('right-comment-card')}>
                <div className={cx('header-comment-card','shimmer')}></div>
                <div className={cx('body-comment-card','shimmer')}></div>
            </div>
        </div>
    )
}
export default CardCommentloading;