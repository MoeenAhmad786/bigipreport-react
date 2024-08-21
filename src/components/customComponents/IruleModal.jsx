import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import irulesJson from "../../Data/irules.json";
import preferencesJson from "../../Data/preferences.json";
import LoadBalancer from "./loadBalancer";
import DataGroup from './DataGroup';
import PoolCell from './PoolMembers';

const IruleDetails = ({ name, loadbalancer, toggleData, togglePool }) => {
  const matchingIrule = irulesJson.find(
    iRule => iRule.name === name && iRule.loadbalancer === loadbalancer
  );

  if (!matchingIrule) {
    return <div>No matching iRule found.</div>;
  }

  const definition = matchingIrule.definition.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div>
      <h5>iRule: {matchingIrule.name}</h5>
      <LoadBalancer data={{ loadbalancer }} type="display" />
      
      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          rowData={[
            {
              key: 'iRule Definition',
              value: <pre className="" dangerouslySetInnerHTML={{ __html: definition }} />
            }
          ]}
          columnDefs={[
            { headerName: 'iRule Definition', field: 'value' }
          ]}
          domLayout="autoHeight"
        />
      </div>

      {preferencesJson.ShowDataGroupLinks && (
        <div>
          <h6>Data Groups:</h6>
          {matchingIrule.datagroups.map((dg, idx) => (
            <DataGroup
              key={idx}
              data={{ dg,loadbalancer  }}
              toggleModal={(dataGroup, dataLoadbalancer) => toggleData(dataGroup, dataLoadbalancer)}
            />
          ))}

          <h6>Pools:</h6>
          {matchingIrule.pools.map((pool, idx) => (
            <PoolCell
              key={idx}
              pool={pool}
              type="display"
              toggleModal={(pool, loadbalancer) => togglePool(pool, loadbalancer)}
            />
          ))}
        </div>
      )}

      {matchingIrule.virtualservers && matchingIrule.virtualservers.length > 0 && (
        <div>
          <h6>Used by {matchingIrule.virtualservers.length} Virtual Servers:</h6>
          <div>
            {matchingIrule.virtualservers.map((vs, idx) => (
              <div key={idx}>{"Virtual Server: " + vs}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IruleDetails;
