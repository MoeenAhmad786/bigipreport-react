import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import irulesJson from "../../Data/irules.json";
import poolJson from "../../Data/pools.json"
import vsJson from "../../Data/virtualservers.json"
import preferencesJson from "../../Data/preferences.json";
import LoadBalancer from "./loadBalancer";
import DataGroup from './DataGroup';
import { PoolCell } from './PoolMembers';
import { Table } from 'react-bootstrap';

const IruleDetails = ({ name, loadbalancer, toggleData, togglePool }) => {
  const matchingIrule = irulesJson.find(
    iRule => iRule.name === name && iRule.loadbalancer === loadbalancer
  );

  if (!matchingIrule) {
    return <div>No matching iRule found.</div>;
  }

  const definition = matchingIrule.definition.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  console.log(definition,"definition in modal")
  const findPool=(Pool)=>{
    const pool = poolJson.find((p) => p.name === Pool);
    return pool;
  }
  const findVS=(vserver)=>{
    const vservers = vsJson.find((v) => v.name === vserver);
    return vservers;
  }
  return (
    <div>
      <h5>iRule: {matchingIrule.name}</h5>
      <h5><LoadBalancer data={{ loadbalancer:loadbalancer }} type="display" /></h5>
      
      <div  style={{ maxheight: '600px', width: '100%' }}>
      <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>iRule Definition</th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td><pre style={{ maxHeight:"400px",overflowY:"auto" }}>{definition}</pre></td>
        </tr>
      </tbody>
    </Table>
      </div>

      {preferencesJson.ShowDataGroupLinks && (
        <div>
          <h6>Data Groups:</h6>
          {matchingIrule.datagroups.length ? 
          <>{matchingIrule.datagroups.map((dg, idx) => (
            <DataGroup
              key={idx}
              data={{ dg,loadbalancer  }}
              toggleModal={(dataGroup, dataLoadbalancer) => toggleData(dataGroup, dataLoadbalancer)}
            />
          ))}</>:"None"}

          <h6>Pools:</h6>
          {matchingIrule.pools.length ? 
          <>{matchingIrule.pools.map((pool, idx) => (
            <PoolCell
              key={idx}
              pool={pool=findPool(pool)}
              type="display"
              toggleModal={(pool, loadbalancer) => togglePool(pool, loadbalancer)}
            />
          ))}</>:"None"}
        </div>
      )}

      {matchingIrule.virtualservers && matchingIrule.virtualservers.length > 0 && (
        <div>
          <h6> Virtual Servers:</h6>
          <div>
            {matchingIrule.virtualservers.length ? 
          <>{matchingIrule.virtualservers.map((vs, idx) => (
               <div key={idx}>{ + vs}</div>
              //  vs component
            ))}</>:"None"}
          </div>
        </div>
      )}
    </div>
  );
};

export default IruleDetails;
