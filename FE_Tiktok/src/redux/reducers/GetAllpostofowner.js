import { INIT_STATE } from "constant";
import { GetAllpostsofowner } from "redux/actions";

export default function GetAllpostofownerreducer (state = INIT_STATE.datapostofowner, action) {
    switch(action.type){
        case GetAllpostsofowner.postRequest.toString():
            return {
                ...state,
            }
        case GetAllpostsofowner.postSuccess.toString():
          //  console.log("data fetch from server: ",action.payload);
            return {
                ...state,
                pagepost: action.payload.page,
                postdata: 
                    Array.isArray(action.payload.post) && action.payload.post.length > 0
                    ? [...(state.postdata || []), ...action.payload.post] : state.postdata || []
            }
        case GetAllpostsofowner.UpdateTotalcomment.toString():
           // console.log("mày đã vào đây",action.payload);
            const totalcm = state.postdata.map(item =>
                item.id === action.payload.id ?
                {
                    ...item,
                    commentCount: action.payload.countcomment
                }:item)
          //  console.log("updated post two: ", totalcm);
            return {
                ...state,
                postdata: totalcm
            }
        case GetAllpostsofowner.UpdateIncreaselike.toString():
            let newPosts = state.postdata.map((item) => 
                item.id === action.payload.id ? 
                {...item,likes: [...item.likes,action.payload.newuser]} : item
            );
           // let test = action.payload.newuser;
            console.log("test newuser: ",newPosts[0]);
            return {
                ...state,
                postdata: newPosts
            }
        case GetAllpostsofowner.UpdateDecreaselike.toString():
          //  console.log("action: ",action.payload.olduser.UserID);
            let updatedPosts = state.postdata.map(item => 
                item.id === action.payload.id ?
                {...item,likes: [...item.likes.filter(vl => vl.UserID !== action.payload.olduser.UserID)]} : item
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