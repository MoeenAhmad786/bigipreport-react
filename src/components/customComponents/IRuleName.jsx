import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import imgDetails from '../../../src/assets/images/details.png'; // Adjust the path as necessary

const IRuleName = (props) => {
  console.log(props,"props in irule name")
    const { loadbalancer, name } = props.data;
    const toggleModal=props.toggleModal
  const type = "display";
  const ruleName = name.replace(/^\/Common\//, '');

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to see iRule details
    </Tooltip>
  );

  return (
    <div onClick={()=>{toggleModal(name,loadbalancer)}}>
      {type === 'display' && (
        <>
          <span className="">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="#"
              
            >
           
            </a>
          </span>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip}
          >
            <a
              className=""
              data-originalvirtualservername={name}
              data-loadbalancer={loadbalancer}
            
              
            >
              {ruleName}
              <span className="px-2">
                <img src={imgDetails} alt="details" />
              </span>
            </a>
          </OverlayTrigger>
        </>
      )}
      {type !== 'display' && (
        <span>{ruleName}</span>
      )}
    </div>
  );
};

export default IRuleName;
