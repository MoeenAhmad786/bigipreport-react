import virtualServers from "../../Data/virtualservers.json";
import preferences from "../../Data/preferences.json"
import Irules from "../../Data/irules.json"
import poolsMap from "../../Data/pools.json"

export function showVirtualServerDetails(virtualserver, loadbalancer) {
    let html;
    const virtualservers = virtualServers ;
    alert("in function")
    // Find the matching pool from the JSON object
    const matchingVirtualServer = virtualservers.find(
      vip => vip.name === virtualserver && vip.loadbalancer === loadbalancer
    )
  
    // If a virtual server was found, populate the pool details table and display it on the page
    if (matchingVirtualServer) {
  
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
      } = matchingVirtualServer;
  
      html = '<div class="virtualserverdetailsheader">';
      html +=
        `<span>Virtual Server: ${  name  }</span><br>`;
      html +=
        `<span>Load Balancer: ${
        renderLoadBalancer(loadbalancer, 'display')
        }</span>`;
      html += '</div>';
  
      const firstLayer = $('div#firstlayerdetailscontentdiv');
      firstLayer.attr('data-type', 'virtualserver');
      firstLayer.attr('data-objectname', name);
      firstLayer.attr('data-loadbalancer', loadbalancer);
  
      let xlate;
      switch (sourcexlatetype) {
        case 'snat':
          xlate = `SNAT:${  sourcexlatepool}`;
          break;
        default:
          xlate = sourcexlatetype || 'Unknown';
      }
  
      const trafficGroup = trafficgroup || 'N/A';
      const defaultPool = defaultpool || 'N/A';
  
      // Build the table and headers
      // First row containing simple properties in two cells which in turn contains subtables
      let table = `<table class="virtualserverdetailstablewrapper">
                          <tbody>
                             <tr>
                               <td>`;
  
      // Subtable 1
      table += `<table class="virtualserverdetailstable">
                  <tr>
                    <th>Name</th>
                    <td>
                      ${name}
                    </td>
                  </tr>
                  <tr>
                    <th>IP:Port</th>
                    <td>${ip}:${port}</td>
                  </tr>
                  <tr>
                    <th>Profile Type</th>
                    <td>${profiletype}</td>
                  </tr>
                  <tr>
                    <th>Default pool</th>
                    <td>${renderPool(loadbalancer, defaultPool, 'display')}</td>
                  </tr>
                  <tr><th>Traffic Group</th><td>${trafficGroup}</td></tr>
                  <tr><th>Description</th><td>${description || ''}</td></tr>
              </table>
           </td>`;
  
      // Subtable 2
      table += `<td>
                  <table class="virtualserverdetailstable">
                    <tr>
                      <th>Client SSL Profile</th>
                      <td>${sslprofileclient.join('<br>')}</td>
                    </tr>
                    <tr>
                      <th>Server SSL Profile</th>
                      <td>${sslprofileserver.join('<br>')}</td>
                    </tr>
                    <tr>
                      <th>Compression Profile</th>
                      <td>${compressionprofile}</td>
                    </tr>
                    <tr>
                      <th>Persistence Profiles</th>
                      <td>${persistence.join('<br>')}</td>
                    </tr>
                    <tr><th>Source Translation</th><td>${xlate}</td></tr>
                    <tr>
                      <th>Other Profiles</th>
                      <td>${otherprofiles.join('<br>')}</td>
                    </tr>
                  </table>
              </td>
             </tr>
           </tbody>
       </table>
       <br>`;
  
      table += `<table class="virtualserverdetailstable">
                      <tr>
                        <th>Current Connections</th>
                        <th>Maximum Connections</th>
                        <th>5 second average CPU usage</th>
                        <th>1 minute average CPU usage</th>
                        <th>5 minute average CPU usage</th>
                      </tr>
                      <tr>
                        <td>${currentconnections}</td>
                        <td>${maximumconnections}</td>
                        <td>${cpuavg5sec}</td>
                        <td>${cpuavg1min}</td>
                        <td>${cpuavg5min}</td>
                       </tr>
                </table>
                <br>`;
  
      if (!matchingVirtualServer.policies.some(p => p === 'None')) {
        table += `<table class="virtualserverdetailstable">
                  <tr><th>Policy name</th></tr>
                  ${policies.map(
                    p => `<tr><td>${renderPolicy(loadbalancer, p, 'display')}</td></tr>`
                  )}`;
      }
  
      if (preferences.ShowiRules) {
        if (irules.length > 0) {
          // Add the assigned irules
          table += '<table class="virtualserverdetailstable">';
  
          if (preferences.ShowiRuleLinks) {
            table += '    <tr><th>iRule name</th><th>Data groups</th></tr>';
          } else {
            table += '    <tr><th>iRule name</th></tr>';
          }
  
          irules.forEach(iRuleName => {
            // If iRules linking has been set to true show iRule links
            // and parse data groups
            if (preferences.ShowiRuleLinks) {
              const iRule = Irules.find(
                i => i.name === iRuleName && i.loadbalancer === loadbalancer);
  
              if (!iRule || Object.keys(iRule).length === 0) {
                table +=
                  `    <tr><td>${
                  iRuleName
                  }</td><td>N/A (empty rule)</td></tr>`;
              } else {
                const datagroupdata = [];
                if (iRule.datagroups && iRule.datagroups.length > 0) {
                  iRule.datagroups.forEach((datagroup) => {
                    const dataGroupName = datagroup.split('/')[2];
  
                    if (preferences.ShowDataGroupLinks) {
                      datagroupdata.push(
                        renderDataGroup(loadbalancer, datagroup, 'display')
                      );
                    } else {
                      datagroupdata.push(dataGroupName);
                    }
                  });
                } else {
                  datagroupdata.push('N/A');
                }
  
                table += `    <tr><td>${renderRule(
                  loadbalancer,
                  iRule.name,
                  'display'
                )}</td><td>${datagroupdata.join('<br>')}</td></tr>`;
              }
            } else {
              table += `        <tr><td>${iRuleName}</td></tr>`;
            }
          });
  
          table += '</table>';
        }
      }
  
      html += table;
    } else {
      html = `
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
  
          </div>`;
    }
  
    $('a#closefirstlayerbutton').text('Close virtual server details');
    $('#firstlayerdetailscontentdiv').html(html);
    $('#firstlayerdiv').fadeIn(updateLocationHash);
    toggleAdcLinks();
  }
  
  function toggleAdcLinks() {
    if (localStorage.getItem('showAdcLinks') === 'false') {
      $('.adcLinkSpan').hide();
    } else {
      $('.adcLinkSpan').show();
    }
  }


  export function renderLoadBalancer(loadbalancer, type){
   
    let balancer;
    if (preferences.HideLoadBalancerFQDN) {
      [balancer] = loadbalancer.split('.');
    } else {
      balancer = loadbalancer;
    }
    if (type === 'display') {
      return `<a href="https://${loadbalancer}" target="_blank" class="plainLink">${balancer}</a>`;
    }
    return balancer;
  }

  function renderPool(loadbalancer, name, type) {
    if (name === 'N/A') {
      return name;
    }
    const poolName = name.replace(/^\/Common\//, '');
    let result = '';
    if (type === 'display') {
      result += `<span class="adcLinkSpan"><a target="_blank"
      href="https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/pool/properties.jsp?name=${name}">Edit</a></span>`;
    }
    result += poolStatus(poolsMap.get(`${loadbalancer}:${name}`), type);
    if (type === 'display') {
      result += `<a class="tooltip" data-originalpoolname="${name}" data-loadbalancer="${loadbalancer}"
      href="Javascript:showPoolDetails('${name}','${loadbalancer}');">`;
    } else {
      result += ' ';
    }
    result += poolName;
    if (type === 'display') {
      result += `<span class="detailsicon">
                        <img src="images/details.png" alt="details">
                        </span>
                        <p>Click to see pool details</p>
                  </a>`;
    }
    return result;
  }

  function renderPolicy(loadbalancer, name, type) {
    if (name === 'None') {
      return 'None';
    }
    let result = '';
    if (type === 'display') {
      result += `<span class="adcLinkSpan"></span>
                  <a class="tooltip" data-originalvirtualservername="${name}" data-loadbalancer="${loadbalancer}"
                   href="Javascript:showPolicyDetails('${name}','${loadbalancer}');">`;
    }
    result += name;
    if (type === 'display') {
      result += `<span class="detailsicon"><img src="images/details.png" alt="details"></span>
                         <p>Click to see policy details</p>
                      </a>`;
    }
    return result;
  }

  function renderDataGroup(loadbalancer, name, type) {
    const datagroupName = name.replace(/^\/Common\//, '');
    let result = '';
    if (type === 'display') {
      result += `
      <span class="adcLinkSpan">
        <a target="_blank"
        href="https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp?name=${name}">
          Edit
        </a>
     </span>
     <a class="tooltip" data-originalvirtualservername="${name}" data-loadbalancer="${loadbalancer}"
         href="Javascript:showDataGroupDetails('${name}','${loadbalancer}');">`;
    }
    result += datagroupName;
    if (type === 'display') {
      result +=
        '<span class="detailsicon"><img src="images/details.png" alt="details"></span>';
      result += '<p>Click to see Data Group details</p>';
      result += '</a>';
    }
    return result;
  }

  function renderRule(loadbalancer, name, type) {
    const ruleName = name.replace(/^\/Common\//, '');
    let result = '';
    if (type === 'display') {
      result += `<span class="adcLinkSpan">
                   <a target="_blank"
                   href="https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/rule/properties.jsp?name=${name}">
                       Edit
                   </a>
                 </span>
                 <a class="tooltip" data-originalvirtualservername="${name}" data-loadbalancer="${loadbalancer}"
                  href="Javascript:showiRuleDetails('${name}','${loadbalancer}');">`;
    }
    result += ruleName;
    if (type === 'display') {
      result += `<span class="detailsicon"><img src="images/details.png" alt="details"></span>
                        <p>Click to see iRule details</p>
                     </a>`;
    }
    return result;
  }

  function poolStatus(pool, type) {
    if (!pool || type === 'export') {
      return '';
    }
    const { enabled, availability, status } = pool;
    const pStatus = `${enabled}:${availability}`;
  
    if (type === 'display' || type === 'print') {
      if (pStatus === 'enabled:available') {
        return (
          `<span class="statusicon">
              <img src="images/green-circle-checkmark.png" alt="${pStatus}" title="${pStatus} - ${status}"/>
          </span>`
        );
      }
  
      if (pStatus === 'enabled:unknown') {
        return (
          `<span class="statusicon">
              <img src="images/blue-square-questionmark.png" alt="${pStatus}" title="${pStatus} - ${status}"/>
           </span>`
        );
      }
  
      if (pStatus === 'enabled:offline') {
        return (
          `<span class="statusicon">
              <img src="images/red-circle-cross.png" alt="${pStatus}" title="${pStatus} - ${status}"/>
          </span>`
        );
      }
  
      if (
        pStatus === 'disabled-by-parent:available' ||
        pStatus === 'disabled-by-parent:offline'
      ) {
        return (
          `<span class="statusicon">
              <img src="images/black-circle-checkmark.png" alt="${pStatus}" title="${pStatus} - ${status}"/>
           </span>`
        );
      }
      return pStatus;
    }
  
    return pStatus;
  }