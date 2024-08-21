import React, { useState, useEffect, useRef, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadBalancer from "./customComponents/loadBalancer";
import { PoolCell } from "./customComponents/PoolMembers";
import { Modal, Button, Table } from "react-bootstrap";
import PoolDetails from "./customComponents/poolModal";
import IrulesJson from ".././Data/irules.json";
import PoolMembersCellRenderer from "./customComponents/PoolMembersCellRenderer";
import PoolJson from ".././Data/pools.json";
import DataGroup from "./customComponents/DataGroup";
import dataGroupJson from ".././Data/datagroups.json";
import vsJson from ".././Data/virtualservers.json";
import IRuleName from "./customComponents/IRuleName";
import DataGroupModal from "./customComponents/DataGroupModal.jsx";
import IruleModal from "./customComponents/IruleModal.jsx";
// Define columns for AG Grid

const Irules = () => {
  const [siteData, setSiteData] = useState([]);
  const [pool, setPool] = useState(null);
  const [loadbalancer, setLoadbalancer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const initialColumns = [
    {
      headerName: "Load Balancer",
      cellRenderer: LoadBalancer,
      field: "loadbalancer",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Name",
      field: "name",
      cellRenderer: (params) => {
        const irule = params.data; // Assuming params.data is the pool
        return (
          <>
            <IRuleName data={irule} type={"display"} toggleModal={(irule, iruleLoadbalancer) => {
                      setShowModalIrule(true);
                      setIrule(irule);
                      setIruleLoadbalancer(iruleLoadbalancer);
                      console.log(irule, iruleLoadbalancer,"in toggle irule")
                      //check the
                    }} />
          </>
        );
      },
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Associated Pools",
      cellRenderer: (params) => {
        let PoolProp;
        const pools = params.data.pools; // Assuming params.data is the pool
        const poolFind = (Pool) => {
          const pool = PoolJson.find((p) => p.name === Pool);
          return pool;
        };
        return (
          <>
            {pools.length > 0
              ? pools.map((Pool, idx) => (
                  <PoolCell
                    key={idx}
                    pool={(PoolProp = poolFind(Pool))}
                    type={"display"}
                    toggleModal={(pool, loadbalancer) => {
                      setShowModal(true);
                      setPool(pool);
                      setLoadbalancer(loadbalancer);
                    }}
                  />
                ))
              : "none"}
          </>
        );
      },
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Associated DataGroups",
      cellRenderer: (params) => {
        let DataProp;
        const datagroups = params.data.datagroups; // Assuming params.data is the pool
        const dataGroupFind = (Datagroup) => {
          const datagroups = dataGroupJson.find((d) => d.name === Datagroup);
          return datagroups;
        };
        return (
          <>
            {datagroups.length > 0
              ? datagroups.map((Data, idx) => (
                  <DataGroup
                    key={idx}
                    data={(DataProp = dataGroupFind(Data))}
                    toggleModal={(dataGroup, DataLoadbalancer) => {
                      setShowModaldata(true);
                      setDataGroup(dataGroup);
                      setDataLoadbalancer(DataLoadbalancer);
                      console.log(dataGroup, DataLoadbalancer, "in toggle");
                      //check the
                    }}
                  />
                ))
              : "None"}
          </>
        );
      },
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Associated Virtual Servers",
      // cellRenderer: (params) => (    USE same as the virtual server name also fetch the virtual server first
      //   <PoolMembersCellRenderer members={params.data.members}/>
      // ),
      cellRenderer: (params) => {
        let vsProp;
        const virtualServers = params.data.virtualservers; // Assuming params.data is the pool
        const VSFind = (vserver) => {
          const vservers = vsJson.find((v) => v.name === vserver);
          return vservers;
        };
        return (
          <>
            {virtualServers.length > 0
              ? virtualServers.map(
                  (vserver, idx) =>
                    // <DataGroups   ///change the component
                    //   key={idx}
                    //   pool={vsProp = VSFind(vserver)}
                    //   type={"display"}
                    //   toggleModal={() => {
                    //     //check the
                    //   }}
                    // />
                    " "
                )
              : "None"}
          </>
        );
      },
      autoHeight: true,
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Length",
      cellRenderer: (params) => params.data.definition.length,
      autoHeight: true,
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.field)
  );
  const [showModal, setShowModal] = useState(false);
  const [showModalData, setShowModaldata] = useState(false);
  const [showModalIrule, setShowModalIrule] = useState(false);
  const [dataGroup, setDataGroup] = useState(null);
  const [Irule, setIrule] = useState(null);
  const [dataLoadbalancer, setDataLoadbalancer] = useState(null);
  const [iruleLoadbalancer, setIruleLoadbalancer] = useState(null);

  const gridApiRef = useRef(null);

  useEffect(() => {
    setSiteData(IrulesJson);
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    if (gridApiRef.current) {
      gridApiRef.current.api.setQuickFilter(event.target.value);
    }
  };

  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns((prevVisibleColumns) =>
      prevVisibleColumns.includes(columnId)
        ? prevVisibleColumns.filter((id) => id !== columnId)
        : [...prevVisibleColumns, columnId]
    );
  };

  const exportCSV = (filename, data) => {
    const csvContent = [
      [
        "Load Balancer",
        "Name",
        "Description",
        "IP:Port",
        "SNAT",
        "ASM",
        "SSL",
        "Comp",
        "Persist",
        "Pool/Members",
      ],
      ...data.map((row) => [
        row.loadbalancer,
        row.name,
        row.description,
        `${row.ip}:${row.port}`,
        row.sourcexlatetype
          ? `SNAT:${row.sourcexlatepool || "N/A"}`
          : "Unknown",
        row.asmPolicies ? row.asmPolicies.join(", ") : "N/A",
        `${row.sslprofileclient.includes("None") ? "No" : "Yes"}/${
          row.sslprofileserver.includes("None") ? "No" : "Yes"
        }`,
        row.compressionprofile === "None" ? "No" : "Yes",
        row.persistence.includes("None") ? "No" : "Yes",
        row.pools?.join(", ") || "N/A",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;
                overflow: hidden;
              }
              table {
                width: 90%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                table {
                  width: 90%;
                }
              }
            </style>
          </head>
          <body>
            <h2>Print</h2>
            ${document.querySelector(".ag-theme-alpine")?.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const filteredData = siteData.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleExportVisibleCSV = () => {
    const visibleData = siteData.map((row) => {
      return initialColumns
        .filter((col) => visibleColumns.includes(col.field))
        .map((col) => {
          const value = col.valueGetter
            ? col.valueGetter({ data: row })
            : row[col.field];
          return typeof value === "string" ? value.replace(/,/g, "") : value;
        });
    });
    exportCSV("visible_columns.csv", visibleData);
  };

  const handleExportAllCSV = () => {
    exportCSV("all_columns.csv", siteData);
  };

  return (
    <div className="d-flex flex-column">
      <div className="dataTables_wrapper no-footer">
        <div className="dataTables_filter">
          <label>Search all the columns: </label>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: "10px", padding: "8px" }}
          />
        </div>
        <div className="dt-buttons">
          <button
            className="dt-button tableHeaderColumnButton resetFilters"
            type="button"
            title="Clear global and column filters"
          >
            <span>Reset</span>
          </button>
          <button
            className="dt-button tableHeaderColumnButton toggleExpansion"
            type="button"
            title="Temporarily expand all"
          >
            <span>Expand</span>
          </button>
          {initialColumns.map((col) => (
            <button
              key={col.field}
              className={`dt-button buttons-columnVisibility ${
                visibleColumns.includes(col.field) ? "active" : ""
              }`}
              type="button"
              onClick={() => toggleColumnVisibility(col.field)}
            >
              <span>{col.headerName}</span>
            </button>
          ))}
          <button
            className="dt-button buttons-csv buttons-html5 tableHeaderColumnButton exportFunctions"
            type="button"
            title="Export current filtered results to CSV"
            onClick={handleExportVisibleCSV}
          >
            <span>Export Visible to CSV</span>
          </button>
          <button
            className="dt-button buttons-csv buttons-html5 tableHeaderColumnButton exportFunctions"
            type="button"
            title="Export all data to CSV"
            onClick={handleExportAllCSV}
          >
            <span>Export All to CSV</span>
          </button>
          <button
            className="dt-button buttons-print buttons-html5 tableHeaderColumnButton exportFunctions"
            type="button"
            title="Print current filtered results"
            onClick={handlePrint}
          >
            <span>Print</span>
          </button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          ref={gridApiRef}
          rowData={filteredData}
          columnDefs={initialColumns}
          pagination
          paginationPageSize={10}
        />
      </div>

      {/* Bootstrap Modal */}
      <Modal size="xl" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pool Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PoolDetails loadbalancer={loadbalancer} pool={pool}></PoolDetails>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        show={showModalData}
        onHide={() => setShowModaldata(false)}
      >
        <Modal.Body>
          <DataGroupModal
            loadbalancer={dataLoadbalancer}
            datagroup={dataGroup}
          ></DataGroupModal>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModaldata(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        show={showModalIrule}
        onHide={() => setShowModalIrule(false)}
      >
        <Modal.Body>
          <IruleModal
           
            name={Irule}
            loadbalancer={iruleLoadbalancer}
            toggleData={(dataGroup, DataLoadbalancer) => {
              setShowModaldata(true);
              setDataGroup(dataGroup);
              setDataLoadbalancer(DataLoadbalancer);
              console.log(dataGroup, DataLoadbalancer, "in toggle");
              //check the
            }}
            togglePool={(pool, loadbalancer) => {
              setShowModal(true);
              setPool(pool);
              setLoadbalancer(loadbalancer);
            }}
          ></IruleModal>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalIrule(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Irules;
