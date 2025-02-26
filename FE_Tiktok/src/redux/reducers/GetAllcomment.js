import { INIT_STATE } from "constant";
import { GetAllcomment } from "redux/actions";

export default function GetAllcommentReducer(state = INIT_STATE.datacomment,action) {
    switch(action.type) {
        case GetAllcomment.GetcommentRequest.toString():
            return {
                ...state
            }
        case GetAllcomment.GetcommentSuccess.toString():
           //  console.log("Full API response:", action.payload);
            // console.log("🔄 New Page:", action.payload.data.page);
            // console.log("📝 New Comments:", action.payload.data.comment);
            const newComments = action.payload.data.comment;
            return {
                ...state,
                page: action.payload.data.page,
                errCode: newComments.length === 0 ? 1 : 0,
                commentitem: [
                    ...new Map([...state.commentitem, ...newComments]
                        .map(item => [item.id, item]) // Chỉ giữ lại comment có id duy nhất
                    ).values()
                ]
            };
        case GetAllcomment.Updatenewcomment.toString():
            let newitem = [action.payload,...state.commentitem];
            console.log("new item: ",newitem);
            return {
                ...state,
                commentitem: newitem
            }
        case GetAllcomment.Updateavailablecomment.toString():
            const itemcomment = state.commentitem.map((item) => 
                item.id === action.payload.id
                ? {...item,Content: action.payload.Content,updateAt: action.payload.updateAt} : item
            );
            return {
                ...state,
                commentitem: itemcomment,
            }
        case GetAllcomment.Deleteavailablecomment.toString():
            const newarr = state.commentitem.filter(item => item.id !== action.payload)
            return {
                ...state,
                commentitem: newarr
            }
        case GetAllcomment.Resetstatecomment.toString():
            return {
                ...state,
                commentitem: []
            }
        case GetAllcomment.GetcommentFailure.toString():
            return {
                ...state
            }
        default:
            return state
    }
}