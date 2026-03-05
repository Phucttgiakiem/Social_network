import {useEffect,useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";

const INTERSECTION_THRESHOLD = 5;
const LOAD_DELAY_MS = 300;
/* const useInfiniteScroll = (ref,onLoadMore) => {
    useEffect(() => {
        if(!ref.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                onLoadMore();
            }
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    },[ref,onLoadMore]);
}
export default useInfiniteScroll; */
/* const useInfiniteScroll = ({triggerRef,loadAction,selectState,options,payload}) => {
    const dispatch = useDispatch();
    const {loading,hasMore } = useSelector(selectState);
    const handleEntry = useCallback(
        debounce((entry) => {
            const { boundingClientRect, intersectionRect, isIntersecting} = entry;
            if (!loading && hasMore && isIntersecting && 
            boundingClientRect.bottom - intersectionRect.bottom <= INTERSECTION_THRESHOLD
            ){
                dispatch(loadAction(payload));
            }
        }, LOAD_DELAY_MS),
        [loading,hasMore,dispatch,loadAction]
    )
    const onIntersect = useCallback(
        (entries) => handleEntry(entries[0]),
        [handleEntry]
    );
    useEffect(() => {
        if(!triggerRef.current) return;
        const observer = new IntersectionObserver(onIntersect,options);
        observer.observe(triggerRef.current);
        return () => {
            observer.disconnect();
            handleEntry.cancel();
        };
    },[triggerRef,onIntersect,options,handleEntry]);
}
export default useInfiniteScroll; */
const useInfiniteScroll = ({ triggerRef, loadAction, selectState, options, payload }) => {
    const dispatch = useDispatch();
    const { loading, hasMore } = useSelector(selectState);

    const onIntersect = useCallback(
        (entries) => {
            const entry = entries[0];

            if (entry.isIntersecting && !loading && hasMore) {
                dispatch(loadAction(payload));
            }
        },
        [loading, hasMore, dispatch, loadAction, payload]
    );

    useEffect(() => {
        const el = triggerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(onIntersect, options);
        observer.observe(el);

        return () => observer.disconnect();
    }, [triggerRef, onIntersect, options]);
};
export default useInfiniteScroll;
