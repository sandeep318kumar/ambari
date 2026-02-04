import { useLocation, useParams } from "react-router-dom";
import EnableHighAvailibilityNameNode from "./highAvailibility/nameNode";
import ManageJournalNodes from "./highAvailibility/journalNode";
import EnableNamenodeFederation from "./highAvailibility/Federation";
import EnableHighAvailibilityRangerAdmin from "./highAvailibility/rangerAdmin";
import EnableHighAvailibilityResourceManger from "./highAvailibility/resourceManager";
import ReassignComponent from "./reassign";

function ServiceActionsUrlMapping({serviceName}: {serviceName: string}) {
    const {componentName}=useParams();
    const location=useLocation();
    function mapUrlToComponent(){
        if(location.pathname.includes("highAvailability")&&componentName==="NameNode"){
            return <EnableHighAvailibilityNameNode isMappingOnly/>
        }
        if(location.pathname.includes("federation") && componentName === "NameNode"){
            return <EnableNamenodeFederation isMappingOnly/>
        }
         if(location.pathname.includes("highAvailability")&&componentName==="JournalNode"){
            return <ManageJournalNodes isMappingOnly/>
        }
         if(location.pathname.includes("reassign")){
            return <ReassignComponent serviceName={serviceName} isMappingOnly/>
        }
        if(location.pathname.includes("highAvailability")&&componentName==="RangerAdmin"){
            return <EnableHighAvailibilityRangerAdmin isMappingOnly/>
        }
        if(location.pathname.includes("highAvailability")&&componentName==="ResourceManager"){
            return <EnableHighAvailibilityResourceManger isMappingOnly/>
        }
    }
    return mapUrlToComponent()
}
export default ServiceActionsUrlMapping;