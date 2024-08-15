import React, { useState } from 'react';
import Certificates from './Certificates';
import DataGroups from './DataGroups';
import Devices from './Devices';
import Help from './Help';
import Irules from './Irules';
import Logs from './Logs';
import Policies from './Policies';
import Preferences from './Prefferences';
import VirtualServers from './VirtualServers';
import Pools from './Pools';

const SideMenue = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleClick = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const renderComponent = () => {
    switch (currentTab) {
      case 0:
        return <VirtualServers />;
      case 1:
        return <Pools />;
      case 2:
        return <Irules />;
      case 3:
        return <Policies />;
      case 4:
        return <DataGroups />;
      case 5:
        return <Devices />;
      case 6:
        return <Certificates />;
      case 7:
        return <Logs />;
      case 8:
        return <Preferences />;
      case 9:
        return <Help />;
      default:
        return <VirtualServers />;
    }
  };

  return (
    <div className="sidemenu">
      <div className="menuitem" id="virtualserversbutton" onClick={() => handleClick(0)}>
        <img id="virtualserverviewicon" src="../src/assets/images/virtualservericon.png" alt="" />
        Virtual Servers
      </div>
      <div className="menuitem" id="poolsbutton" onClick={() => handleClick(1)}>
        <img id="poolsicon" src="../src/assets/images/poolsicon.png" alt="" />
        Pools
      </div>
      <div className="menuitem" id="irulesbutton" onClick={() => handleClick(2)}>
        <img id="irulesicon" src="../src/assets/images/irulesicon.png" alt="" />
        iRules
      </div>
      <div className="menuitem" id="policiesbutton" onClick={() => handleClick(3)}>
        <img id="policiesicon" src="../src/assets/images/policiesicon.png" alt="" />
        Policies
      </div>
      <div className="menuitem" id="datagroupbutton" onClick={() => handleClick(4)}>
        <img id="datagroupsicon" src="../src/assets/images/datagroupicon.png" alt="" />
        Data Groups
      </div>
      <div className="menuitem" id="deviceoverviewbutton" onClick={() => handleClick(5)}>
        <img id="devicesoverviewicon" src="../src/assets/images/devicesicon.png" alt="" />
        Devices
      </div>
      <div className="menuitem" id="certificatebutton" onClick={() => handleClick(6)}>
        <img id="certificateicon" src="../src/assets/images/certificates.png" alt="" />
        Certificates
        <span id="certificatenotification"></span>
      </div>
      <div className="menuitem" id="logsbutton" onClick={() => handleClick(7)}>
        <img id="logsicon" src="../src/assets/images/logsicon.png" alt="" />
        Logs
      </div>
      <div className="menuitem" id="preferencesbutton" onClick={() => handleClick(8)}>
        <img id="preferencesicon" src="../src/assets/images/preferences.png" alt="" />
        Preferences
      </div>
      <div className="menuitem" id="helpbutton" onClick={() => handleClick(9)}>
        <img id="helpicon" src="../src/assets/images/help.png" alt="" />
        Help
      </div>
      <div className="content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default SideMenue;
