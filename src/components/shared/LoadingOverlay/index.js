import LoadingOverlaySpinner from "./LoadingOverlaySpinner";
import './LoadingOverlay.css'

const LoadingOverlay = ({children, active=true, message}) => {
    
    const overlay = active 
    ? <div id='loading-overlay--overlay' >
            <LoadingOverlaySpinner message={message} />
        </div>
    : null;

    return (
        <div id='loading-overlay--container' >
            {overlay}
            {children} 
        </div>
    );

};

export default LoadingOverlay;