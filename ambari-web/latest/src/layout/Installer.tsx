import { FunctionComponent } from "react";
import NavBar from "../components/Navbar";
import LicenseFooter from "../components/LicenseFooter";
import { Outlet } from "react-router-dom";

 
const InstallerLayout: FunctionComponent = () => {
    return(
        <>
            <div className="d-flex flex-column h-95">
                <NavBar viewsList={[]} subPath="Installer"/>
                <div className="h-100" style={{ paddingBottom: '50px' }}>
                    <Outlet/>
                </div>
            </div>
            <LicenseFooter hasSidebar={false} />
        </>
    )
}
 
export default InstallerLayout;
