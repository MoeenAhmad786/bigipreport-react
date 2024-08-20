import React, { useContext, useState } from 'react';
import ShowVirtualServerDetails from "./modal" // Ensure the correct file path
import virtualServers from "../../Data/virtualservers.json";

const Name = (props) => {

  const { loadbalancer, name } = props.data;
  const [toggle, setToggle] = useState(false);

  const toggleModal = () => {
    setToggle(!toggle);
  };

  const handleShowDetails = () => {
    toggleModal();
  };

  // Find virtual server
  const vs = virtualServers.find((o) => o.name === name && o.loadbalancer === loadbalancer);

  if (!vs) {
    return <div>Virtual server not found</div>;
  }

  const vsStatus = `${vs.enabled}:${vs.availability}`;
  const cleanName = name.replace(/^\/Common\//, '');

  // Status mapping
  const statusIcons = {
    'enabled:available': {
      src: "../../../src/assets/images/green-circle-checkmark.png",
      alt: "Available (Enabled)",
      title: `${vsStatus} - The virtual server is available`,
    },
    'enabled:unknown': {
      src: "../../../src/assets/images/blue-square-questionmark.png",
      alt: "Unknown (Enabled)",
      title: `${vsStatus} - The children pool member(s) either don't have service checking enabled, or service check results are not available yet`,
    },
    'enabled:offline': {
      src: "../../../src/assets/images/red-circle-cross.png",
      alt: "Offline (Enabled)",
      title: `${vsStatus} - The children pool member(s) are down`,
    },
    'disabled:available': {
      src: "../../../src/assets/images/black-circle-cross.png",
      alt: "Available (Disabled)",
      title: `${vsStatus} - The virtual server is disabled`,
    },
    'disabled:unknown': {
      src: "../../../src/assets/images/black-circle-checkmark.png",
      alt: "Unknown (Disabled)",
      title: `${vsStatus} - The children pool member(s) either don't have service checking enabled, or service check results are not available yet`,
    },
    'disabled:offline': {
      src: "../../../src/assets/images/black-circle-cross.png",
      alt: "Offline (Disabled)",
      title: `${vsStatus} - The children pool member(s) are down`,
    },
    'disabled-by-parent:offline': {
      src: "../../../src/assets/images/black-circle-cross.png",
      alt: "Offline (Disabled-by-parent)",
      title: `${vsStatus} - The parent is disabled and the children pool member(s) are down`,
    },
    'disabled-by-parent:available': {
      src: "../../../src/assets/images/black-diamond-exclamationmark.png",
      alt: "Available (Disabled-by-parent)",
      title: `${vsStatus} - The children pool member(s) are available but the parent is disabled`,
    }
  };

  // Determine the status icon based on vsStatus
  const statusIcon = statusIcons[vsStatus] || { src: '', alt: vsStatus, title: vsStatus };

  return (
    <div>
      {toggle ? (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={toggleModal}>
              &times;
            </button>
            <div className="modal-body">
              <ShowVirtualServerDetails
                virtualserver={name}
                loadbalancer={loadbalancer}
                toggleModal={toggleModal}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className="adcLinkSpan none">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${loadbalancer}/tmui/Control/jspmap/tmui/locallb/virtual_server/properties.jsp?name=${name}`}
            >
              Edit
            </a>
          </span>
          <span className="statusicon">
            <img
              src={statusIcon.src}
              alt={statusIcon.alt}
              title={statusIcon.title}
            />
          </span>
          <a
            className="tooltip details-link"
            data-originalvirtualservername={name}
            data-loadbalancer={loadbalancer}
            onClick={handleShowDetails}
          >
            {cleanName}
            <span className="detailsicon">
              <img src="../../../src/assets/images/details.png" alt="details" />
            </span>
            <p>Click to see virtual server details</p>
          </a>
        </div>
      )}
    </div>
  );
};

export default Name;