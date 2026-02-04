export interface StackServiceComponent {
    componentName:string;
    isDisabled:boolean;
   }
 
   export interface ServiceComponent {
     StackServiceComponents: StackServiceComponent;
   }
 
   export interface Service {
     StackServices: {
       service_name: string;
     };
     components: ServiceComponent[];
   }
 
   export interface ServicesResponse {
     items: Service[];
   }
 
   export interface SelectedService {
     is_selected: boolean;
     service_name: string;
   }