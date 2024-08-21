// src/components/DataGroupDetails.js
import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import loadBalancer from './loadBalancer';
import 'bootstrap/dist/css/bootstrap.min.css';
import dataGroupJson from "../../Data/datagroups.json"
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";


const DataGroupModal = ({ datagroup, loadbalancer }) => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const matchingDatagroup = dataGroupJson.find(
      (dg) => dg.name === datagroup && dg.loadbalancer === loadbalancer
    );

    if (matchingDatagroup) {
      const data = Object.keys(matchingDatagroup.data).map((key) => ({
        key,
        value: matchingDatagroup.data[key],
      }));

      setRowData(data);
    } else {
      setRowData([]);
    }
  }, [datagroup, loadbalancer]);

  const columnDefs = [
    { headerName: 'Key', field: 'key',flex:1 },
    {
      headerName: 'Value',
      flex:1,
      field: 'value',
      cellRenderer: (params) => {
        const items = params.value.split(' ').map((item) => {
          if (item.match(/^http(s)?:/)) {
            return `<a href="${item}" target="_blank">${item}</a>`;
          }
          return item;
        });

        return items.join(' ');
      },
    },
  ];

  return (
    <div className="container mt-3">
      <div className="datagroup-details-header mb-3">
        <h4>Data group: {datagroup}</h4>
        <h5><loadBalancer data={{loadbalancer:loadbalancer}} type="display"/></h5>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

// Function to render load balancer, assuming it's available in the context
// const renderLoadBalancer = (loadbalancer, type) => {
//   let balancer;
//   if (siteData.preferences.HideLoadBalancerFQDN) {
//     [balancer] = loadbalancer.split('.');
//   } else {
//     balancer = loadbalancer;
//   }
//   if (type === 'display') {
//     return (
//       <a href={`https://${loadbalancer}`} target="_blank" rel="noopener noreferrer" className="plainLink">
//         {balancer}
//       </a>
//     );
//   }
//   return balancer;
// };

export default DataGroupModal;
