import React from 'react';
import poolsMap from "../../Data/pools.json";
import monitors from "../../Data/monitors.json";
import preferences from "../../Data/preferences.json";

const parseMonitorRequestParameters=(sendString)=> {

    const lines = sendString.split(/\\r\\n|\\\\r\\\\n/);
    const requestDataArr = lines[0].split(' ');
  
    // Invalid HTTP request
    if(requestDataArr.length !== 3) return {};
  
    const [verb, uri, version] = requestDataArr;
  
    const monitorComponents = {
      verb,
      uri,
      version,
      headers: []
    }
  
    // Add only valid headers
    lines.filter(l => /^[^:]+: *[^:]*$/.test(l)).forEach(h => {
      const [key, value] = h.split(/:\s*/);
      monitorComponents.headers.push({key, value});
    })
  
    return monitorComponents;
  }

const translateStatus = (member) => {
  const translatedStatus = {
    availability: '',
    enabled: '',
    realtime: '',
  };

  switch (member.availability) {
    case 'available':
      translatedStatus.availability = 'UP';
      break;
    case 'unknown':
      translatedStatus.availability = 'UNKNOWN';
      break;
    default:
      translatedStatus.availability = 'DOWN';
  }

  switch (member.enabled) {
    case 'enabled':
      translatedStatus.enabled = 'Enabled';
      break;
    case 'disabled-by-parent':
      translatedStatus.enabled = 'Disabled by parent';
      break;
    case 'disabled':
      translatedStatus.enabled = 'Disabled';
      break;
    default:
      translatedStatus.enabled = 'Unknown';
  }

  switch (member.realtimestatus) {
    case 'up':
      translatedStatus.realtime = 'UP';
      break;
    case 'down':
      translatedStatus.realtime = 'DOWN';
      break;
    case 'session_disabled':
      translatedStatus.realtime = 'DISABLED';
      break;
    default:
      translatedStatus.realtime = member.realtimestatus || 'N/A';
  }

  return translatedStatus;
};

const renderLoadBalancer = (loadbalancer, type) => {
  let balancer;
  if (preferences.HideLoadBalancerFQDN) {
    [balancer] = loadbalancer.split('.');
  } else {
    balancer = loadbalancer;
  }
  if (type === 'display') {
    return <a href={`https://${loadbalancer}`} target="_blank" rel="noopener noreferrer">{balancer}</a>;
  }
  return balancer;
};

const generateMonitorTests = (monitor, member) => {
  const { type, sendstring } = monitor;
  const { ip, port } = member;

  const escapedIP = /.+:.+:.+:/.test(ip) ? `[${ip}]` : ip;

  const protocol = type.replace(/:.*$/, '');
  const { verb, uri, version, headers } = parseMonitorRequestParameters(sendstring);

  const monitorTests = {};

  let curl; let http; let netcat;

  if (['http', 'https', 'tcp', 'tcp-half-open'].includes(protocol)) {
    if (['http', 'https'].includes(protocol)) {
      if (verb === 'GET' || verb === 'HEAD') {
        curl = 'curl';

        if (verb === 'HEAD') {
          curl += ' -I';
        }

        if (version === 'HTTP/1.0') {
          curl += ' -0';
        }

        headers.forEach(h => {
          curl += ` -H "${h.key}:${h.value}"`;
        });

        curl += ` ${protocol}://${escapedIP}:${port}${uri}`;
      }
      monitorTests.curl = curl;
    }

    if (protocol === 'http' || protocol === 'tcp' || protocol === 'tcp-half-open') {
      netcat = `echo -ne "${sendstring}" | nc ${ip} ${port}`;
    }

    if (protocol === 'http' || protocol === 'https') {
      http = `${protocol}://${escapedIP}:${port}${uri}`;
    }
  }

  return {
    curl,
    http,
    netcat,
  };
};

const PoolDetails = ({ pool, loadbalancer }) => {
    const  layer = 'first'
    const type="display"
  const matchingpool = poolsMap.find(p => p.loadbalancer === loadbalancer && p.name === pool.name);
  console.log(matchingpool,"matchingpool")
  const render = [];

  if (matchingpool) {
    const { description, loadbalancingmethod, actiononservicedown, allownat, allowsnat, members, monitors: poolmonitors } = matchingpool;
    render.push(
      <div key="header">
        <h4>Pool: {matchingpool.name}</h4>
        <p>Load Balancer: {renderLoadBalancer(loadbalancer, 'display')}</p>
      </div>
    );

    render.push(
      <table key="details" className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Load Balancing Method</th>
            <th>Action On Service Down</th>
            <th>Allow NAT</th>
            <th>Allow SNAT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{description || ''}</td>
            <td>{loadbalancingmethod}</td>
            <td>{actiononservicedown}</td>
            <td>{allownat}</td>
            <td>{allowsnat}</td>
          </tr>
        </tbody>
      </table>
    );

    render.push(
      <div key="members">
        <h5>Member details</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th>Port</th>
              <th>Priority Group</th>
              <th>Connections</th>
              <th>Max Connections</th>
              <th>Availability</th>
              <th>Enabled</th>
              <th>Status Description</th>
              <th>Realtime Availability</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => {
              const memberStatus = translateStatus(member);
              return (
                <tr key={idx}>
                  <td>{member.name}</td>
                  <td>{member.ip}</td>
                  <td>{member.port}</td>
                  <td>{member.priority}</td>
                  <td>{member.currentconnections}</td>
                  <td>{member.maximumconnections}</td>
                  <td>{memberStatus.availability}</td>
                  <td>{memberStatus.enabled}</td>
                  <td>{member.status}</td>
                  <td>{memberStatus.realtime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );

    if (poolmonitors.length > 0) {
      render.push(
        <div key="monitors">
          <h5>Assigned monitors</h5>
          {poolmonitors.map((monitorName, idx) => {
            const matchingMonitor = monitors.find(m => m.loadbalancer === loadbalancer && m.name === monitorName);
            if (matchingMonitor) {
              const { curl, http, netcat } = generateMonitorTests(matchingMonitor, members[0]); // Assuming the first member for tests

              return (
                <div key={idx}>
                  <h6>{matchingMonitor.name}</h6>
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td><b>Type</b></td>
                        <td>{matchingMonitor.type}</td>
                      </tr>
                      <tr>
                        <td><b>Send string</b></td>
                        <td>{matchingMonitor.sendstring}</td>
                      </tr>
                      <tr>
                        <td><b>Receive String</b></td>
                        <td>{matchingMonitor.receivestring}</td>
                      </tr>
                      <tr>
                        <td><b>Disable String</b></td>
                        <td>{matchingMonitor.disablestring}</td>
                      </tr>
                      <tr>
                        <td><b>Interval</b></td>
                        <td>{matchingMonitor.interval}</td>
                      </tr>
                      <tr>
                        <td><b>Timeout</b></td>
                        <td>{matchingMonitor.timeout}</td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Member Name</th>
                        <th>Member IP</th>
                        <th>Member Port</th>
                        <th>HTTP Link</th>
                        <th>Curl Link</th>
                        <th>Netcat Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member, memberIdx) => {
                        const { name, ip, port } = member;
                        const escapedIP = /.+:.+:.+:/.test(ip) ? `[${ip}]` : ip;
                        const protocol = matchingMonitor.type.replace(/:.*$/, '').toLowerCase();

                        return (
                          <tr key={memberIdx}>
                            <td>{name}</td>
                            <td>
                              {protocol === 'http' || protocol === 'https' ? (
                                <a href={`${protocol}://${escapedIP}`}>{ip}</a>
                              ) : (
                                ip
                              )}
                            </td>
                            <td>{port}</td>
                            <td>{http ? <button className="btn btn-link" data-copy={http}>Copy</button> : 'N/A'}</td>
                            <td>{curl ? <button className="btn btn-link" data-copy={curl}>Copy</button> : 'N/A'}</td>
                            <td>{netcat ? <button className="btn btn-link" data-copy={netcat}>Copy</button> : 'N/A'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
  }
   console.log(render,pool,loadbalancer,"render in pool modal ")
  return <div>{render}</div>;
};

export default PoolDetails;
