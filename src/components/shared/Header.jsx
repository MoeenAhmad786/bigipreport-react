import Logo from "../../assets/images/logo.png"

import React from 'react'

const Header = () => {
  return (
    <>
    <div className=""></div>
    <div className="bigipreportheader"><img alt="BigIPReport logo" style={{maxWidth: "350px"}}
                                            src={Logo}/></div>
    <div id="realtimestatusdiv" className="realtimestatusdiv">
        <table>
            <tbody>
            <tr>
                <td><span className="topleftheader">Status VIPs:</span></td>
                <td><span id="realtimetestsuccess">0</span> working, <span
                    id="realtimetestfailed">0</span> failed,
                    <span id="realtimenotconfigured">0</span> not configured
                </td>
            </tr>
            <tr>
                <td><span className="topleftheader">Polling state:</span></td>
                <td id="pollingstatecell"><span id="ajaxqueue">0</span> queued<span
                    id="realtimenextrefresh"></span>
                </td>
            </tr>
            </tbody>

        </table>
    </div>
    <div id="navbuttondiv"></div>
</>
  )
}

export default Header