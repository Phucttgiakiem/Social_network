export const INIT_STATE = {
    Login: {
        data: []
    },
    ForgotPass: {
        data: []
    },
    Registermember : {
        result: []
    },
    ShowAuthenDialog:{
        isshow: false
    },
    pageLogin : {
        htmlcode: ""
    },
    comebackpageLogin: {
        history: []
    },
    codegetpass : {
        data: []
    },
    datapost : {
        message:"",
        _page:1,
        loading:false,
        hasMore: true,
        posts: []
    },
    datapostofowner: {
        postdata: []
    },
    datacomment: {
        _page: 1,
        loading: false,
        hasMore: true,
        errCode: null,
        commentitem: []
    },
    datamessage : {
        messagedata: []
    },
    Showloading : {
        isshowloading: false
    },
    ShowListComment : {
        isshowlc: false
    },
    ShowEditprofile: {
        showEdit: false
    }
}