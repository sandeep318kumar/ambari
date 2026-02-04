import { useContext, useEffect } from "react";
import { AppContext } from "../store/context";


const Subscribers = () => {
  const {client,isSocketConnected}=useContext(AppContext);
  useEffect(()=>{
    if(isSocketConnected)
    client.subscribe("/events/requests",(message:any)=>{
        console.log("Message is",message)
    })
    client.subscribe("/events/services",(message:any)=>{
      console.log("Message is",message)
  })
  },[isSocketConnected])
  return <></>;
};

export default Subscribers;
