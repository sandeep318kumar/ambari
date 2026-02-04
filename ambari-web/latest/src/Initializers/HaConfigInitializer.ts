import ConfigInitializer from "./ConfigInitializer";
//@ts-ignore
import NnHaConfigInitializer from "../Utils/configs.ts";

class HaConfigInitializer extends ConfigInitializer {
    constructor() {
        super();
        // this.initializerTypes = [
        //     { name: "host_with_port", method: "_initAsHostWithPort" },
        //     { name: "hosts_with_port", method: "_initAsHostsWithPort" },
        // ];
    }
}

export default HaConfigInitializer;
