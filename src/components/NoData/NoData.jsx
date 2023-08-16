import Lottie from 'lottie-react';
import NoDataAnimation from '../../assets/lottie/nodata-animation.json';
import styles from './NoData.module.css'

function NoData({text}) {
    return (
        <div className={styles.wrapper}>
            <Lottie animationData={NoDataAnimation} loop={true} className={styles.lottiePlayer} style={{height: "120px"}}/>
            <span className={styles.description}>{text}</span> 
        </div>
    );
}

export default NoData;
