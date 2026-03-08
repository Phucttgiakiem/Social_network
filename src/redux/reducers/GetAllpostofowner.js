import { INIT_STATE } from "constant";
import { GetAllpostsofowner } from "redux/actions";

export default function GetAllpostofownerreducer (state = INIT_STATE.datapostofowner, action) {
    switch(action.type){
        case GetAllpostsofowner.postRequest.toString():
            return {
                ...state,
            }
        case GetAllpostsofowner.postSuccess.toString():
            return {
                ...state,
                pagepost: action.payload.page,
                postdata: 
                    Array.isArray(action.payload.post) && action.payload.post.length > 0
                    ? [...(state.postdata || []), ...action.payload.post] : state.postdata || []
            }
        case GetAllpostsofowner.UpdateTotalcomment.toString():
            const totalcm = state.postdata.map(item =>
                item.id === action.payload.id ?
                {
                    ...item,
                    commentCount: action.payload.countcomment
                }:item)
            return {
                ...state,
                postdata: totalcm
            }
        case GetAllpostsofowner.UpdateIncreaselike.toString():
            return {
                ...state,
                postdata: state.postdata.map(item =>
                item.id === action.payload.id
                    ? {
                        ...item,
                        likes: item.likes.some(
                        vl => Number(vl.UserID) === Number(action.payload.UserID)
                        )
                        ? item.likes
                        : [...item.likes, { UserID: String(action.payload.UserID) }]
                    }
                    : item
                )
            };
        case GetAllpostsofowner.UpdateDecreaselike.toString():
          //  console.log("action: ",action.payload.olduser.UserID);
            let updatedPosts = state.postdata.map(item => 
                item.id === action.payload.id ?
                {...item,likes: item.likes.filter(
                vl => Number(vl.UserID) !== Number(action.payload.UserID))} : item
            )
         //   console.log("danh sach post cua nguoi dung sau xoalike: ",updatedPosts)
            return {
                ...state,
                postdata: updatedPosts
            }
        case GetAllpostsofowner.Resetstatepost.toString():
            return {
                ...state,
                postdata: []
            }
        case GetAllpostsofowner.postFailure.toString():
            return {
                ...state,
            };
        default:
            return state
    }
}