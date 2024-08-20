import React, { useState } from "react";
import poolsMap from "../../Data/pools.json";
import virtualServers from "../../Data/virtualservers.json";
import { Table } from 'react-bootstrap';

export const PoolMember = ({ member, type, idx }) => {
    console.log(idx,"in member index")
  const { name, ip, port } = member;
  const memberName = name.split("/")[2];

  return (
    <tr>
    <td data-pool={member.poolNum}>
      {type === "display" || type === "print" ? (
        <span data-member={`${ip}:${port}`}>
          {memberName !== `${ip}:${port}` && memberName !== `${ip}.${port}` ? `(${ip})` : ""}
          {memberName}
        </span>
      ) : (
        <span>
          {memberName}
        </span>
      )}
    </td></tr>
  );
};

const Pool = ({ loadbalancer, name, type,toggleModal,pool }) => {
  if (name === "N/A") return name;
  const poolName = name?.replace(/^\/Common\//, "");

  return (
       <>
      {type === "display" && (
        <>
          <span className="none">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/pool/properties.jsp?name=${name}`}
            >
              Edit
            </a>
          </span>
          <a
            href="#"
            onClick={()=>{toggleModal(pool,loadbalancer)}}
            data-originalpoolname={name}
            data-loadbalancer={loadbalancer}

          >
            {poolName}
            <span className=""></span>
            <p>Click to see pool details</p>
          </a>
        </>
      )}
    </>
  );
};

export const PoolCell = ({ pool, type,toggleModal }) => {
  if (!pool) return null;

  const { loadbalancer, name, members } = pool;

  return (
    
        <Pool loadbalancer={loadbalancer} name={name} type={type} toggleModal={toggleModal} pool={pool}/>
     
  );
};

const PoolMembers = (props) => {

    console.log(props,"props")
  const { pools, name } = props.data;
  const {toggleModal}=props
  const virtualServer = virtualServers.find((o) => o.name === name);
  const type = "display";

  // State for managing expanded pools
  const [expandedPools, setExpandedPools] = useState({});

  const handleToggle = (id) => {
    setExpandedPools((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderPools = () => {
    if (!pools) return "N/A";

    const { loadbalancer: vipLoadbalancer } = virtualServer;

    return pools.map((poolName, index) => {
      const pool = poolsMap.find(
        (p) => p.loadbalancer === vipLoadbalancer && p.name === poolName
      );
      console.log(pool,"poooooool")
      const tid = `${index}`; // Unique ID for each pool

      return pool ? (
        <div key={tid}>
          {type === "display" && (
            <>
              <div
                className="mb-2"
                variant="link"
                onClick={() => handleToggle(tid)}
              >
                {expandedPools[tid]
                  ? <div className="d-flex justify-content-between " >
                      <div className="w-50"><PoolCell pool={pool} type={type} rowIndex={index} toggleModal={toggleModal} /></div>
                      <div className="w-50 px-2 py-1  text-center">
                          
                          {pool.members && pool.members.map((member, idx) => (
                            
                              <PoolMember member={member} type={type} idx={idx}/>
                            
                          ))}
                        </div>
                    </div>
                  : `Show ${pools.length} associated pools`}
              </div>
            </>
          )}
        </div>
      ) : null;
    });
  };

  return <div>{renderPools()}</div>;
};

export default PoolMembers;
