import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LoadBalancer from "./customComponents/loadBalancer";
import { PoolCell } from "./customComponents/PoolMembers";
import { Modal, Button } from 'react-bootstrap';
import PoolDetails from "./customComponents/poolModal";
import PoolJson from ".././Data/pools.json";
import PoolMembersCellRenderer from "./customComponents/PoolMembersCellRenderer";

// Define columns for AG Grid

const Pools = () => {

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
      flex:1,
    },
    {
      headerName: "Name",
      field: "name",
      cellRenderer: (params) => {
        const pool = params.data; // Assuming params.data is the pool
        return (
          <>
            <PoolCell
              pool={pool}
              type={"display"}
              toggleModal={(pool,loadbalancer) => {
                setShowModal(true);
                setPool(pool);
                setLoadbalancer(loadbalancer);
              }}
            />
          </>
        );
      },
      sortable: true,
      filter: true,
      flex:1,
    },
    {
      headerName: "Orphan",
      valueGetter: (params) =>
        `${params.data.orphaned == true ? "true" : "false"}`,
      field:"orphaned",
      sortable: true,
      filter: true,
      flex:1,
    },
    {
      headerName: "Method"
      ,field:"loadbalancingmethod",
      sortable: true,
      filter: true,
      flex:1,
    },
    {
      headerName: "Members",
      cellRenderer: (params) => (
        <PoolMembersCellRenderer members={params.data.members}/>
      ),
      flex:1,
      autoHeight: true,
      sortable: true,
      filter: true,
    },
    
  ];
  const [visibleColumns, setVisibleColumns] = useState(
    initialColumns.map((col) => col.field)
  );
  const [showModal, setShowModal] = useState(false);

  const gridApiRef = useRef(null);
  
  
  useEffect(() => {
    setSiteData(PoolJson);
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
      <div className="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
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
    </div>
  );
};

export default Pools;
