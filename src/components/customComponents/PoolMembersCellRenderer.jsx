import React, { useState } from 'react';
import { PoolMember } from './PoolMembers';
// import imgExpand from "../../../src/assets/images/"
const PoolMembersCellRenderer = ({members}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  

  return (
    <>
      {members.length > 1 ? (
        <>
          {!isExpanded ? (
            <div
              onClick={() => setIsExpanded(true)}
              className="view-members"
              
            >
              View {members.length} pool members
            </div>
          ) : (
            
            <div>
              <div
                onClick={() => setIsExpanded(false)}
                className="hide-members"
               
              >
                View {members.length} pool members
              </div>
              {members.map((member, idx) => (
                <div key={idx} className="h-100">
                  <PoolMember member={member} type={"display"} idx={idx} />
                </div>
              ))}
              
            </div>
          )}
        </>
      ) : (
        <div className="h-100">
          <PoolMember member={members[0]} type={"display"} idx={0} />
        </div>
      )}
    </>
  );
};

export default PoolMembersCellRenderer;
