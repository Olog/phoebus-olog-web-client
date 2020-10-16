import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function checkSession () {
    // If there is a session cookie, try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    if(cookies.get('SESSION')){
        return axios.get(`${process.env.REACT_APP_BASE_URL}/user`, { withCredentials: true })
            .then(res => {return res.data});
    }
    else{
        return null;
    }
}

export default checkSession;