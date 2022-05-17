import ologService from './olog-service';

function checkSession () {
    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    return ologService.get('/user', { withCredentials: true })
            .then(res => {return res.data})
            .catch(err => alert("Unable to check login session: " + err));
}

export default checkSession;