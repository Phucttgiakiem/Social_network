import { INIT_STATE } from "constant";
import { GetAllpost } from "redux/actions";

export default function GetAllpostReducer(state = INIT_STATE.datapost, action) {
    switch (action.type) {
        case GetAllpost.LoadPosts.toString():
            return {
                ...state,
                loading:true
            }
        case GetAllpost.LoadPostsSuccess.toString():
            return {
                ...state,
                loading: false,
                _page: state._page + 1,
                posts: [
                    ...state.posts,
                    ...action.payload.post
                ],
                hasMore: action.payload.post.length > 0
            }
        case GetAllpost.LoadPostsFail.toString():
            return {
                ...state,
                loading: false,
                message:action.payload.message
            }
        case GetAllpost.ResetPosts.toString():
            return {
                ...state,
                posts: [],
            }
        case GetAllpost.ChangeTotallike.toString():
            const updatedPosts = state.posts.map((item) =>
                item.idpost === action.payload.id
                    ? { ...item, countlike: action.payload.countlike }
                    : item
            );
            return {
                ...state,
                posts: updatedPosts,
            };
        case GetAllpost.ChangeTotalComment.toString():
            const updatedPost = state.posts.map((item) =>
                item.idpost === action.payload.id
                    ? { ...item, countcomment: action.payload.countcomment }
                    : item
            );
            return {
                ...state,
                posts: updatedPost,
            };
        case GetAllpost.UpdateStatelikeofuser.toString(): {
            
            const updatedPosts = state.posts.map(item => {
                if (item.idpost !== Number.parseInt(action.payload.id)) return item;
                let newListLike;
                if (action.payload.typelike === "addlike") {
                    newListLike = [...item.listlike, { UserID: action.payload.UserID }];
                } else {
                    newListLike = item.listlike.filter(
                        vl => vl.UserID !== action.payload.UserID
                    );
                }

                return {
                    ...item,
                    listlike: newListLike,
                    countlike: newListLike.length, 
                };
            });

            return {
                ...state,
                posts: updatedPosts,
            };
        }
        default:
            return state;
    }
}