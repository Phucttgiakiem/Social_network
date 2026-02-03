import classNames from 'classnames/bind';
import styles from './CardPostloading.module.scss';
const cx = classNames.bind(styles);
export default function CardPostloading () {
    return (
        <div className={cx('post-card')}>
            <div className={cx('header-post-card')}>
                <div className={cx('avatar-post-card','shimmer')}></div>
                <div className={cx('Title-post-card')}>
                    <div className={cx('Username-post-card','shimmer')}></div>
                    <div className={cx('Musicname-post-card','shimmer')}></div>
                </div>
            </div>
            <div className={cx('body-post-card','shimmer')}></div>
        </div>
    );
}