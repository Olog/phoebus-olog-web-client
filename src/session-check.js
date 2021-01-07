import axios from 'axios';

function checkSession () {
    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    return axios.get(`${process.env.REACT_APP_BASE_URL}/Olog/user`, { withCredentials: true })
            .then(res => {return res.data});
}

export default checkSession;