import { takeLatest, call,put,select } from "redux-saga/effects"
import * as actions from '../actions';
import * as api from '../../api';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie';
function* fetchLoginSaga (action){
    try {
        const lg = yield call (api.logintk,action.payload);
     //   console.log('login',lg.data);
        yield put(actions.AuthenLogin.AuthenLoginSuccess(lg.data));
        yield put(actions.hideloadingdata());
        if(lg.data.errCode === 0){
            Cookies.set('useremail', lg.data.user.email, { expires: 1 });
            Cookies.set('avatar', lg.data.user.avatar, { expires: 1 });
            Cookies.set('username', lg.data.user.fullName, { expires: 1 });
            Cookies.set('iduser', lg.data.user.id, { expires: 1 });
            window.location.reload();
        }else{
            toast.error(`${lg.data.message}`);
        }
    } catch(err){
        console.error(err);
        yield put(actions.AuthenLogin.AuthenLoginFailure(err));
        yield put(actions.hideloadingdata());
    }
}

function* fetchForgotPassSaga (action){
    try {
        const fp = yield call (api.forgotpasstk,action.payload);
        
        yield put(actions.Forgotpass.ForgotpassSuccess(fp.data));
        yield put(actions.hideloadingdata());
        if(fp.data.errCode === 0){
            toast.success('password was changed success, please login again !!!');
        }else {
            toast.error(`${fp.data.message}`);
        }
    } catch(err){
        console.error(err);
        yield put(actions.Forgotpass.ForgotpassFailure(err));
        yield put(actions.hideloadingdata());
    }
}

function* fetchGetAllpost (action){
    try{
        const {_limit } = action.payload;
        const {_page,hasMore} = yield select(
            state => state.datapost
        )
        if(!hasMore) return;
        const postresult = yield call (api.getAllpost,{
            _page,_limit
        });
        console.log("API result:", postresult.data);
        yield put(actions.GetAllpost.LoadPostsSuccess(postresult.data));
    }catch(err){
        console.error(err);
        yield put(actions.GetAllpost.LoadPostsFail(err));
    }
}

function* fetchGetAllpostsofowner (action){
    try{
        const postresult = yield call (api.getAllpostsofowner,action.payload);
        yield put(actions.GetAllpostsofowner.postSuccess(postresult.data));
    }catch(err){
        console.error(err);
        yield put(actions.GetAllpostsofowner.postFailure(err)); 
    }
}

function* fetchCreatecodeAuthen (action){
    try{
        const coderesult = yield call (api.authenemailgetpass,action.payload);
        
        yield put(actions.CreateAuthencode.createcodeSuccess(coderesult));
        yield put(actions.hideloadingdata());
        if(coderesult.data.errCode === 0){
            toast.success("the code was send to email success, please checking the email !!!");
        }else {
            toast.error(coderesult.data.message);
        }
    }catch(err){
        console.log(err);
        yield put(actions.CreateAuthencode.createcodeFailure(err));
        yield put(actions.hideloadingdata());
    }
}

function* fetchRegistermember (action){
    try{
        const fr = yield call (api.createaccount,action.payload);
        
        yield put(actions.CreateAccount.createaccountSuccess(fr.data));
        yield put(actions.hideloadingdata());
        if(fr.data.errCode !== 0){
            toast.error(`${fr.data.message}`);
        }
        else {
            toast.success('your account created success, please login with new your account !!!');
        }
    }catch(err){
        console.log(err);
        yield put(actions.CreateAccount.createaccountFailure(err));
        yield put(actions.hideloadingdata());
    }
}

function* fetchAllcommentofpost (action){
    try {
        const {_limit,IDpost} = action.payload;
        const {_page,hasMore} = yield select(
            state => state.datacomment
        )
        //console.log(hasMore," ");
        if(!hasMore) return;
        const res = yield call(api.getAllcomment,{
            IDpost:IDpost,
            _page:_page,
            _limit: _limit});
        
        yield put (actions.GetAllcomment.LoadCommentSuccess(res.data.data));
    }catch(e){
        yield put (actions.GetAllcomment.LoadCommentFail());
    }
}
function* mySaga(){
    yield takeLatest(actions.AuthenLogin.AuthenLoginRequest,fetchLoginSaga);
    yield takeLatest(actions.Forgotpass.ForgotpassRequest,fetchForgotPassSaga);
    yield takeLatest(actions.CreateAuthencode.createcodeRequest,fetchCreatecodeAuthen);
    yield takeLatest(actions.CreateAccount.createaccountRequest,fetchRegistermember);
    yield takeLatest(actions.GetAllpost.LoadPosts,fetchGetAllpost);
    yield takeLatest(actions.GetAllpostsofowner.postRequest,fetchGetAllpostsofowner);
    yield takeLatest(actions.GetAllcomment.LoadComment,fetchAllcommentofpost);
}

export default mySaga;