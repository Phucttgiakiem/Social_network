import { createAction } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
}


export const AuthenLogin = {
    AuthenLoginRequest: createAction('AuthenLoginRequest',(payload)=>payload),
    AuthenLoginSuccess: createAction('AuthenLoginSuccess', (payload) => payload),
    AuthenLoginFailure: createAction('AuthenLoginFailure', (err) => err),
    AuthenLoginReset: createAction('AuthenLoginReset')
};

export const Forgotpass = {
    ForgotpassRequest: createAction('ForgotpassRequest',(payload) => payload),
    ForgotpassSuccess: createAction('ForgotpassSuccess',(payload) => payload),
    ForgotpassFailure: createAction('ForgotpassFailure',(err) => err),
    ForgotpassReset: createAction('ForgotpassReset')
}

export const CreateAuthencode = {
    createcodeRequest: createAction('CreatecodeRequest',(payload) => payload),
    createcodeSuccess: createAction('CreatecodeSuccess',(payload)=> payload),
    createcodeFailure: createAction('CreatecodeFailure',(err) => err)
}

export const CreateAccount = {
    createaccountRequest: createAction('CreateaccountRequet',(payload) => payload),
    createaccountSuccess: createAction('CreateaccountSuccess',(payload) => payload),
    createaccountFailure: createAction('CreateaccountFailure',(err) => err),
    createaccountReset: createAction('ResetstateRegister')
}

export const GetAllpost = {
    GetpostRequest: createAction('GetpostRequest',(payload) => payload),
    GetpostSuccess: createAction('GetpostSuccess',(payload) => payload),
    GetpostFailure: createAction('GetpostFailure',(err) => err),
    Resetstatepost: createAction('Resetstatepost'),
    ChangeTotallike: createAction('ChangeTotallike',(payload) => payload),
    ChangeTotalComment: createAction('ChangeTotalComment',(payload) => payload),
    UpdateStatelikeofuser: createAction('Updatestatelikeofuser',(payload) => payload)
}

export const GetAllpostsofowner = {
    postRequest: createAction('postRequest',(payload) => payload),
    postSuccess: createAction('postSuccess',(payload) => payload),
    postFailure: createAction('postFailure',(err) => err),
    Resetstatepost: createAction('Resetstatepost'),
    UpdateTotalcomment: createAction('UpdateTotalcomment',(payload) => payload),
    UpdateIncreaselike: createAction('UpdateIncreaselike',(payload) => payload),
    UpdateDecreaselike: createAction('UpdateDecreaselike',(payload) => payload),
}

export const GetAllmessagesofpost = {
    GetmessageRequest: createAction('GetmessageRequest',(payload) => payload),
    GetmessageSuccess: createAction('GetmessageSuccess',(payload) => payload),
    GetmessageFailure: createAction('GetmessageFailure',(err) => err),
}

export const GetAllcomment = {
    GetcommentRequest: createAction('GetcommentRequest',(payload) => payload),
    GetcommentSuccess: createAction('GetcommentSuccess',(payload) => payload),
    GetcommentFailure: createAction('GetcommentFailure',(err) => err),
    Resetstatecomment: createAction('Resetstatecomment'),
    Updatenewcomment: createAction('Updatenewcomment',(payload) => payload),
    Updateavailablecomment: createAction('Updateavailablecomment',(payload) => payload),
    Deleteavailablecomment: createAction('Deleteavailablecomment',(payload) => payload),
}

export const showAuthendialog = createAction('SHOW_AUTHEN_DIALOG');
export const hideAuthendialog = createAction('HIDE_AUTHEN_DIALOG');

export const showcontrollogin = createAction('ContentLogin',(payload) => payload);
export const showcontrolregister = createAction('ContentRegister',(payload) => payload);
export const showDetailloginwithemail = createAction('DetailLogin',(payload) => payload);
export const showDetailregisterwithemail = createAction('DetailRegister',(payload) => payload);
export const showtakepassacount = createAction('ContentForgotPass',(payload) => payload);

export const edithtmlcode = createAction('EDIT_HTMLCODE',(payload) => payload);
export const addhistory = createAction('ADD_HISTORY',(payload) => payload);
export const removehistory = createAction('REMOVE_HISTORY',(payload) => payload);

export const showloadingdata = createAction('SHOW_LOADING_DATA');
export const hideloadingdata = createAction('HIDE_LOADING_DATA');

//component comment
export const showcomment = createAction('SHOW_COMMENT');
export const hidecomment = createAction('HIDE_COMMENT');

export const showEditprofile = createAction('SHOW_Editprofile');
export const hideEditprofile = createAction('HIDE_Editprofile');

//export const catalogcomment = createAction('Catalogcomment');




