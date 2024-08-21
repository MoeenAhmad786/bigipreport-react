import React from 'react';
import img1 from "../../../src/assets/images/details.png";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const DataGroup = (props) => {
  console.log(props,"props in datagroup")
  const { loadbalancer, name } = props.data;
  const toggleModal=props.toggleModal
  const type = "display";
  const datagroupName = name.replace(/^\/Common\//, '');

  return (
    <div>
      {type === 'display' ? (
        <>
          <span className="">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp?name=${name}`}
            >
              
            </a>
          </span>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${name}`}>
                Click to see Data Group details
              </Tooltip>
            }
          >
            <a
              className=""
              data-originalvirtualservername={name}
              data-loadbalancer={loadbalancer}
              href="#"
              onClick={()=>{toggleModal(name,loadbalancer)}}
            >
              {datagroupName}
              <span className="detailsicon">
                <img src={img1} alt="details" />
              </span>
            </a>
          </OverlayTrigger>
        </>
      ) : (
        <span>{datagroupName}</span>
      )}
    </div>
  );
};

export default DataGroup;
