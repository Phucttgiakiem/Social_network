import { useImperativeHandle,forwardRef,useRef } from "react";
function Videos({src,className,onClick},ref) {
    const videoRef = useRef();
    
    useImperativeHandle(ref,() =>({
        play (){
            videoRef.current.play();
        },
        pause(){
            videoRef.current.pause()
        }
    }))
    return (
          <video ref={videoRef} src={src} className={className} onClick={onClick}/>
    );
}

export default forwardRef(Videos);
