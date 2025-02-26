import { combineReducers } from "redux";
import Login from './Loginr';
import ShowAuthenDialog from './ShowAuthenDialog';
import ForgotPass from './Forgotpass'
import pageLogin from './ContentAuthen';
import comebackpageLogin from './ComebackLogin';
import codegetpass from './CodeAuthenEmail';
import Showloading from './ShowLoadingNotifi';
import Registermember from './CreateAccount';
import datapost from './GetAllpost';
import datapostofowner from './GetAllpostofowner';
import ShowListComment from './Showcomment';
import ShowEditprofile from './ShowEditprofile';
import datacomment from './GetAllcomment';
export default combineReducers({
    Login,
    ShowAuthenDialog,
    ForgotPass,
    pageLogin,
    comebackpageLogin,
    codegetpass,
    Showloading,
    Registermember,
    datapost,
    datapostofowner,
    datacomment,
    ShowListComment,
    ShowEditprofile
});