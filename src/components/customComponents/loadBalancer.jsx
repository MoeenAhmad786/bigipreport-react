import React, { useContext, useEffect, useState } from 'react'
import preferences from "../../Data/preferences.json";


const loadBalancer = (props) => {
 
    console.log(props,"props--->loadbalancer")
    const loadbalancer=props.data.loadbalancer;
    const type=props.type;
    const [prefferences, setPrefferences] = useState(preferences);
    const [data,setData]=useState(null)
    const loadBlancerFunc=()=>{
        let balancer;
        if (prefferences.HideLoadBalancerFQDN) {
          [balancer] = loadbalancer.split('.');
        } else {
          balancer = loadbalancer;
        }
        if (type === 'display') {
          return `<a href="https://${loadbalancer}" target="_blank" class="plainLink">${balancer}</a>`;
        }
        return <a href="https://${loadbalancer}" target="_blank" class="plainLink">{balancer}</a>;
    }
    useEffect(()=>{
       setData( loadBlancerFunc())
    },[])
  return (
    <div>{data}</div>
  )
}

export default loadBalancer



  