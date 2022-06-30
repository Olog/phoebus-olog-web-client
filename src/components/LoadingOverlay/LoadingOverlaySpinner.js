import './LoadingOverlaySpinner.css';
import LoadingIoLdsRing from './LoadingIoLdsRing';

const LoadingOverlaySpinner = ({message}) => {
    return (
        <div id='loading-overlay--spinner'>
            <LoadingIoLdsRing/>
            {message &&
                <div>{message}</div>
            }
        </div>
    );
}

export default LoadingOverlaySpinner;