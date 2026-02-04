function OverlayBackdrop({isOpen}:{isOpen: boolean}) {
    if(isOpen){
        return <div className="overlay-backdrop"></div>
    }
    return null;
}
 
export default OverlayBackdrop;