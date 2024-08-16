import React from 'react';
import virtualServers from "../../Data/virtualservers.json";
import preferences from "../../Data/preferences.json";
import Irules from "../../Data/irules.json";
import poolsMap from "../../Data/pools.json";

const ShowVirtualServerDetails = ({ virtualserver, loadbalancer, toggleModal }) => {
  const vs = virtualServers.find(
    (vip) => vip.name === virtualserver && vip.loadbalancer === loadbalancer
  );

  if (!vs) {
    return (
      <div id="objectnotfound">
        <h1>No matching Virtual Server was found</h1>
        <h4>What happened?</h4>
        When clicking the report it will parse the JSON data to find the matching Virtual Server and display the
        details. However, in this case it was not able to find any matching Virtual Server.
        <h4>Possible reason</h4>
        This might happen if the report is being updated as you navigate to the page.
        If you see this page often, please report a bug
        <a href="https://devcentral.f5.com/codeshare/bigip-report">DevCentral</a>.
        <h4>Possible solutions</h4>
        Refresh the page and try again.
      </div>
    );
  }

  const {
    name,
    currentconnections,
    cpuavg1min,
    cpuavg5min,
    cpuavg5sec,
    maximumconnections,
    sourcexlatetype,
    sourcexlatepool,
    trafficgroup,
    defaultpool,
    description,
    sslprofileclient,
    sslprofileserver,
    compressionprofile,
    profiletype,
    persistence,
    otherprofiles,
    policies,
    irules,
    ip,
    port,
  } = vs;

  const xlate = sourcexlatetype === 'snat' ? `SNAT:${sourcexlatepool}` : sourcexlatetype || 'Unknown';
  const trafficGroup = trafficgroup || 'N/A';
  const defaultPool = defaultpool || 'N/A';

  const renderLoadBalancer = () => {
    const balancer = preferences.HideLoadBalancerFQDN ? loadbalancer.split('.')[0] : loadbalancer;
    return <a href={`https://${loadbalancer}`} target="_blank" rel="noopener noreferrer" className="plainLink">{balancer}</a>;
  };

  const renderPool = (name) => {
    if (name === 'N/A') return name;
    const poolName = name.replace(/^\/Common\//, '');
    return (
      <span className="adcLinkSpan">
        <a target="_blank" rel="noopener noreferrer"
           href={`https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/pool/properties.jsp?name=${name}`}>
          Edit
        </a>
        {poolStatus(poolsMap.get(`${loadbalancer}:${name}`))}
        <a className="tooltip" data-originalpoolname={name} data-loadbalancer={loadbalancer}
           href={`javascript:showPoolDetails('${name}','${loadbalancer}');`}>
          {poolName}
          <span className="detailsicon">
            <img src="images/details.png" alt="details" />
          </span>
          <p>Click to see pool details</p>
        </a>
      </span>
    );
  };

  const renderPolicy = (name) => {
    if (name === 'None') return 'None';
    return (
      <span className="adcLinkSpan">
        <a className="tooltip" data-originalvirtualservername={name} data-loadbalancer={loadbalancer}
           href={`javascript:showPolicyDetails('${name}','${loadbalancer}');`}>
          {name}
          <span className="detailsicon">
            <img src="images/details.png" alt="details" />
          </span>
          <p>Click to see policy details</p>
        </a>
      </span>
    );
  };

  const renderRule = (name) => {
    const ruleName = name.replace(/^\/Common\//, '');
    return (
      <span className="adcLinkSpan">
        <a target="_blank" rel="noopener noreferrer"
           href={`https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/rule/properties.jsp?name=${name}`}>
          Edit
        </a>
        <a className="tooltip" data-originalvirtualservername={name} data-loadbalancer={loadbalancer}
           href={`javascript:showiRuleDetails('${name}','${loadbalancer}');`}>
          {ruleName}
          <span className="detailsicon">
            <img src="images/details.png" alt="details" />
          </span>
          <p>Click to see iRule details</p>
        </a>
      </span>
    );
  };

  const renderDataGroup = (name) => {
    const datagroupName = name.replace(/^\/Common\//, '');
    return (
      <span className="adcLinkSpan">
        <a target="_blank" rel="noopener noreferrer"
           href={`https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp?name=${name}`}>
          Edit
        </a>
        <a className="tooltip" data-originalvirtualservername={name} data-loadbalancer={loadbalancer}
           href={`javascript:showDataGroupDetails('${name}','${loadbalancer}');`}>
          {datagroupName}
          <span className="detailsicon">
            <img src="images/details.png" alt="details" />
          </span>
          <p>Click to see Data Group details</p>
        </a>
      </span>
    );
  };

  const poolStatus = (pool) => {
    if (!pool) return '';
    const { enabled, availability, status } = pool;
    const pStatus = `${enabled}:${availability}`;
    const statusIcons = {
      'enabled:available': 'green-circle-checkmark.png',
      'enabled:unknown': 'blue-square-questionmark.png',
      'enabled:offline': 'red-circle-cross.png',
      'disabled-by-parent:available': 'black-circle-checkmark.png',
      'disabled-by-parent:offline': 'black-circle-cross.png',
      'disabled:available': 'black-circle-checkmark.png',
      'disabled:offline': 'black-circle-cross.png'
    };
    const iconSrc = statusIcons[pStatus] || 'default-icon.png';
    return (
      <span className="statusicon">
        <img src={`images/${iconSrc}`} alt={pStatus} title={`${pStatus} - ${status}`} />
      </span>
    );
  };

  return (
    <div>
      <div className="virtualserverdetailsheader">
        <span>Virtual Server: {name}</span><br />
        <span>Load Balancer: {renderLoadBalancer()}</span>
      </div>
      <table className="virtualserverdetailstablewrapper">
        <tbody>
          <tr>
            <td>
              <table className="virtualserverdetailstable">
                <tbody>
                  <tr><th>Name</th><td>{name}</td></tr>
                  <tr><th>IP:Port</th><td>{ip}:{port}</td></tr>
                  <tr><th>Profile Type</th><td>{profiletype}</td></tr>
                  <tr><th>Default pool</th><td>{renderPool(defaultPool)}</td></tr>
                  <tr><th>Traffic Group</th><td>{trafficGroup}</td></tr>
                  <tr><th>Description</th><td>{description || ''}</td></tr>
                </tbody>
              </table>
            </td>
            <td>
              <table className="virtualserverdetailstable">
                <tbody>
                  <tr><th>Client SSL Profile</th><td>{sslprofileclient.join('<br>')}</td></tr>
                  <tr><th>Server SSL Profile</th><td>{sslprofileserver.join('<br>')}</td></tr>
                  <tr><th>Compression Profile</th><td>{compressionprofile}</td></tr>
                  <tr><th>Persistence Profiles</th><td>{persistence.join('<br>')}</td></tr>
                  <tr><th>Source Translation</th><td>{xlate}</td></tr>
                  <tr><th>Other Profiles</th><td>{otherprofiles.join('<br>')}</td></tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <table className="virtualserverdetailstable">
        <tbody>
          <tr>
            <th>Current Connections</th>
            <th>Maximum Connections</th>
            <th>5 second average CPU usage</th>
            <th>1 minute average CPU usage</th>
            <th>5 minute average CPU usage</th>
          </tr>
          <tr>
            <td>{currentconnections}</td>
            <td>{maximumconnections}</td>
            <td>{cpuavg5sec}</td>
            <td>{cpuavg1min}</td>
            <td>{cpuavg5min}</td>
          </tr>
        </tbody>
      </table>
      <br />
      { !policies.includes('None') && (
        <table className="virtualserverdetailstable">
          <tbody>
            <tr><th>Policy name</th></tr>
            {policies.map(p => (
              <tr key={p}><td>{renderPolicy(p)}</td></tr>
            ))}
          </tbody>
        </table>
      )}
      { preferences.ShowiRules && irules.length > 0 && (
        <table className="virtualserverdetailstable">
          <tbody>
            <tr>
              <th>iRule name</th>
              {preferences.ShowiRuleLinks && <th>Data groups</th>}
            </tr>
            {irules.map(iRuleName => {
              const iRule = Irules.find(
                (i) => i.name === iRuleName && i.loadbalancer === loadbalancer
              );
              if (!iRule || Object.keys(iRule).length === 0) {
                return (
                  <tr key={iRuleName}>
                    <td>{iRuleName}</td>
                    <td>N/A (empty rule)</td>
                  </tr>
                );
              }
              const datagroupdata = iRule.datagroups && iRule.datagroups.length > 0
                ? iRule.datagroups.map(datagroup => preferences.ShowDataGroupLinks
                    ? renderDataGroup(datagroup, 'display')
                    : datagroup.split('/')[2]
                  )
                : ['N/A'];

              return (
                <tr key={iRuleName}>
                  <td>{renderRule(iRule.name, 'display')}</td>
                  {preferences.ShowiRuleLinks && <td>{datagroupdata.join('<br>')}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button onClick={toggleModal}>Close virtual server details</button>
    </div>
  );
};

export default ShowVirtualServerDetails;