import { INIT_STATE } from "constant";
import { GetAllpost } from "redux/actions";

export default function GetAllpostReducer(state = INIT_STATE.datapost, action) {
    switch (action.type) {
        case GetAllpost.GetpostRequest.toString():
            return {
                ...state,
            };
        case GetAllpost.GetpostSuccess.toString():
            return {
                ...state,
                message: action.payload.message,
                // postofuser: Array.isArray(action.payload.post) && action.payload.post.length > 0
                //     ? [...(state.postofuser || []), ...action.payload.post]
                //     : state.postofuser || [],
                postofuser: [
                    ...new Map([...state.postofuser, ...action.payload.post]
                        .map(item => [item.idpost, item]) // Chỉ giữ lại post có id duy nhất
                    ).values()
                ]
            };
        case GetAllpost.GetpostFailure.toString():
            return {
                ...state,
            };
        case GetAllpost.Resetstatepost.toString():
            return {
                ...state,
                message: "",
                postofuser: [], // Đảm bảo reset về mảng rỗng
            };

        case GetAllpost.ChangeTotallike.toString():
            const updatedPosts = state.postofuser.map((item) =>
                item.idpost === action.payload.id
                    ? { ...item, countlike: action.payload.countlike }
                    : item
            );
            return {
                ...state,
                postofuser: updatedPosts,
            };
        case GetAllpost.ChangeTotalComment.toString():
            const updatedPost = state.postofuser.map((item) =>
                item.idpost === action.payload.id
                    ? { ...item, countcomment: action.payload.countcomment }
                    : item
            );
           // console.log("updated post: ", updatedPost);
            return {
                ...state,
                postofuser: updatedPost,
            };
        case GetAllpost.UpdateStatelikeofuser.toString():

            let newlist = null;
            if (action.payload.typelike === "addlike") {
                newlist = state.postofuser.map((item) =>
                    item.idpost === action.payload.id
                        ? { ...item,listlike: [...item.listlike,{UserID: action.payload.UserID}]}
                        : item
                );
            } else {
                newlist = state.postofuser.map((item) =>
                    item.idpost === action.payload.id
                        ? { ...item,listlike: [...item.listlike.filter((vl) => vl.UserID !== action.payload.UserID)]}
                        : item
                );
            }
            console.log("newlist: ",state.postofuser);
            return {
                ...state,
                postofuser: newlist,
            };
        default:
            return state;
    }
}