import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// Create the context
export const DataContext = createContext();

// Create the provider component
export const DataProvider = ({ children }) => {
  // Step 2: Define state variables for each JSON data
  const [poolsJson, setPools] = useState([]);
  const [monitorsJson, setMonitors] = useState([]);
  const [virtualServersJson, setVirtualServers] = useState([]);
  const [irulesJson, setIrules] = useState([]);
  const [dataGroupsJson, setDataGroups] = useState([]);
  const [loadBalancersJson, setLoadBalancers] = useState([]);
  const [preferencesJson, setPreferences] = useState([]);
  const [knownDevicesJson, setKnownDevices] = useState([]);
  const [certificatesJson, setCertificates] = useState([]);
  const [deviceGroupsJson, setDeviceGroups] = useState([]);
  const [asmPoliciesJson, setAsmPolicies] = useState([]);
  const [natJson, setNat] = useState([]);
  const [stateJson, setState] = useState([]);
  const [policiesJson, setPolicies] = useState([]);
  const [loggedErrorsJson, setLoggedErrors] = useState([]);

  // Step 3: Fetch data from APIs and update the states
  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        axios.get('https://loadbalancing.se/bigipreportdemo/json/pools.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/monitors.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/virtualservers.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/irules.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/datagroups.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/loadbalancers.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/preferences.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/knowndevices.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/certificates.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/devicegroups.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/asmpolicies.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/nat.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/state.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/policies.json'),
        axios.get('https://loadbalancing.se/bigipreportdemo/json/loggederrors.json'),
      ]);

      // Parse JSON responses
      const data = await Promise.all(responses.map(response => response.json()));

      // Update state variables with the fetched data
      setPools(data[0]);
      setMonitors(data[1]);
      setVirtualServers(data[2]);
      setIrules(data[3]);
      setDataGroups(data[4]);
      setLoadBalancers(data[5]);
      setPreferences(data[6]);
      setKnownDevices(data[7]);
      setCertificates(data[8]);
      setDeviceGroups(data[9]);
      setAsmPolicies(data[10]);
      setNat(data[11]);
      setState(data[12]);
      setPolicies(data[13]);
      setLoggedErrors(data[14]);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Provide the state variables and fetchData function to the children
  return (
    <DataContext.Provider value={{
      poolsJson, monitorsJson, virtualServersJson, irulesJson, dataGroupsJson, loadBalancersJson,
      preferencesJson, knownDevicesJson, certificatesJson, deviceGroupsJson, asmPoliciesJson, natJson,
      stateJson, policiesJson, loggedErrorsJson, fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};
