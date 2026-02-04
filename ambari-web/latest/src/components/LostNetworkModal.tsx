import { Button, Modal } from "react-bootstrap";

type PropTypes = {
    onClose: () => void;
    isOpen: boolean;
};

const LostNetworkModal = ({ onClose, isOpen }: PropTypes) => {
    const options = [
        "Configure your hosts for access to the Internet.",
        "If you are using an Internet Proxy, refer to the Ambari Documentation on how to configure Ambari to use the Internet Proxy.",
        "Use the Local Repository option.",
    ];
    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Public Repository Option Not Selected</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: 12 }}>
                Ambari is unable to confirm access to the Public Repositories, which means you might not have Internet access and will not be able to use the Public Repository option for installing the software. Your choices:
                <ul>
                    {options.map((opt:string)=>{
                        return <li key="opt" className="mt-2" style={{fontSize:12}}>
                            {opt}
                        </li>
                    })}
                </ul>
                If you do not have internet access and select this option, you will fail the Repository Base URL validation.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LostNetworkModal;