import React, { useEffect, useState } from 'react'
import virtualServers from "../../Data/virtualservers.json";
import { showVirtualServerDetails } from './modal';
const Name = (props) => {
    const loadbalancer=props.data.loadbalancer;
    const name=props.data.name;
    const type=props.data.type;
    const [data,setData]=useState(null)
    const getVirtualServer=(vs, loadbalancer)=>{
        return (
            virtualServers.find((o) => o.name === vs && o.loadbalancer === loadbalancer)
          );

    }
    const virtualServerStatus=(row, type)=>{
        const { enabled, availability } = row;
        if (!enabled || !availability) return '';
        const vsStatus = `${enabled}:${availability}`;
      
        if (type === 'filter') {
          return vsStatus;
        }
      
        if (type === 'export') {
          // split into fields later
          return `${enabled}@SPLIT@${availability}@SPLIT@`;
        }
      
        if (vsStatus === 'enabled:available') {
          return `<span class="statusicon"><img src="../../../src/assets/images/green-circle-checkmark.png" alt="Available (Enabled)"
                      title="${vsStatus} - The virtual server is available"/></span>`;
        }
      
        if (vsStatus === 'enabled:unknown') {
          return (
            '<span class="statusicon"><img src="../../../src/assets/images/blue-square-questionmark.png" alt="Unknown (Enabled)"' +
            ` title="${vsStatus} - The children pool member(s) either don't have service checking enabled, or ` +
            'service check results are not available yet"/></span>'
          );
        }
      
        if (vsStatus === 'enabled:offline') {
          return (
            '<span class="statusicon"><img src="../../../src/assets/images/red-circle-cross.png" alt="Offline (Enabled)"' +
            ` title="${vsStatus} - The children pool member(s) are down"/></span>`
          );
        }
      
        if (vsStatus === 'disabled:available') {
          return (
            '<span class="statusicon"><img src="../../../src/assets/images/black-circle-cross.png" alt="Available (Disabled)"' +
            ` title="${vsStatus} - The virtual server is disabled"/></span>`
          );
        }
      
        if (vsStatus === 'disabled:unknown') {
          return (
            '<span class="statusicon"><img src="../../../src/assets/images/black-circle-checkmark.png" alt="Unknown (Disabled)"' +
            ` title="${vsStatus} - The children pool member(s) either don't have service checking enabled,` +
            ' or service check results are not available yet"/></span>'
          );
        }
      
        if (vsStatus === 'disabled:offline') {
          return (
            '<span class="statusicon"><img src="../../../src/assets/images/black-circle-cross.png" alt="Offline (Disabled)"' +
            ` title="${vsStatus} - The children pool member(s) are down"/></span>`
          );
        }
      
        if (vsStatus === 'disabled-by-parent:offline') {
          return (
            '<span class="statusicon">' +
            '<img src="../../../src/assets/images/black-circle-cross.png" alt="Offline (Disabled-by-parent)"' +
            ` title="${vsStatus} - The parent is disabled and the children pool member(s) are down"/></span>`
          );
        }
      
        if (vsStatus === 'disabled-by-parent:available') {
          return (
            '<span class="statusicon">' +
            '<img src="../../../src/assets/images/black-diamond-exclamationmark.png" alt="Available (Disabled-by-parent)"' +
            ` title="${vsStatus} - The children pool member(s) are available but the parent is disabled"/></span>`
          );
        }
        return vsStatus;

    }
       
    const renderVirtualServer= (loadbalancer, name)=>{
        const type='display';
        const vsName = name.replace(/^\/Common\//, '');
        let result = '';
        if (type === 'display') {
          result += `<span class="adcLinkSpan none" ><a target="_blank" href="https://${loadbalancer}`;
          result += `/tmui/Control/jspmap/tmui/locallb/virtual_server/properties.jsp?name=${name}">Edit</a></span>`;
        }
        if (type === 'display' || type === 'print' || type === 'filter' || type === 'export') {
          const vs = getVirtualServer(name, loadbalancer);
          result += virtualServerStatus(vs, type);
        }
        if (type === 'display') {
          result += `<a  class="tooltip details-link"  data-originalvirtualservername="${name}"`
          result += ` data-loadbalancer="${loadbalancer}"`;
          result += `  >`;
        }
        
       


        result += vsName;
        if (type === 'display') {
          result += `<span  class="detailsicon" id="${name}">
                            <img src="../../../src/assets/images/details.png" alt="details"></span>
                            <p>Click to see virtual server details</p>
                            </a>`;
        }
       
       
        return result;
    }
    useEffect(()=>{
        setData(renderVirtualServer(loadbalancer, name))
         

    },[])



  return (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default Name
