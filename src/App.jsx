import Layout from "./layout/Layout";
import SideMenue from "./components/SideMenue";
import React, { useContext, useEffect } from 'react'
import { DataContext, DataProvider } from "./Context/DataContext";



const App = () => {
  const {
   fetchData
  } = useContext(DataContext);
  useEffect(() => {
    // fetchData can be called again if you need to refresh the data
    fetchData();
  }, []);
  return (
    
    <Layout>
        <SideMenue/>
      </Layout>
    
  )
}
export default App
