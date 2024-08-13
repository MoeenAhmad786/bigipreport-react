import React, { useState, useEffect, useRef } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import IVirtualServer from "../interfaces/IVirtualServer";
import virtualServers from "../Data/virtualservers.json";

// Define columns for the table
const initialColumns: TableColumn<IVirtualServer>[] = [
    {
      name: "Load Balancer",
      selector: (row: any) => row.loadbalancer,
      sortable: true,
      id: 'loadbalancer',
    },
    {
      name: "Name",
      selector: (row: any) => row.name,
      sortable: true,
      id: 'name',
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true,
      id: 'description',
    },
    {
      name: "IP:Port",
      selector: (row: any) => `${row.ip}:${row.port}`,
      sortable: true,
      id: 'ipport',
    },
    {
      name: "SNAT",
      selector: (row: any) =>
        row.sourcexlatetype ? `SNAT:${row.sourcexlatepool || "N/A"}` : "Unknown",
      sortable: true,
      id: 'snat',
    },
    {
      name: "ASM",
      selector: (row: any) =>
        row.asmPolicies ? row.asmPolicies.join(", ") : "N/A",
      sortable: true,
      id: 'asm',
    },
    {
      name: "SSL",
      selector: (row: any) =>
        `${row.sslprofileclient.includes("None") ? "No" : "Yes"}/${
          row.sslprofileserver.includes("None") ? "No" : "Yes"
        }`,
      sortable: true,
      id: 'ssl',
    },
    {
      name: "Comp",
      selector: (row: any) => (row.compressionprofile === "None" ? "No" : "Yes"),
      sortable: true,
      id: 'comp',
    },
    {
      name: "Persist",
      selector: (row: any) => (row.persistence.includes("None") ? "No" : "Yes"),
      sortable: true,
      id: 'persist',
    },
    {
      name: "Pool/Members",
      selector: (row: any) => row.pools?.join(", ") || "N/A",
      sortable: true,
      id: 'poolmembers',
    },
  ];

const VirtualServers: React.FC = () => {
  const [siteData, setSiteData] = useState<IVirtualServer[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(initialColumns.map(col => col.id));
  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    setSiteData(virtualServers);
  }, []);
  

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredData = siteData.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prevVisibleColumns) =>
      prevVisibleColumns.includes(columnId)
        ? prevVisibleColumns.filter((id) => id !== columnId)
        : [...prevVisibleColumns, columnId]
    );
  };

  const columns = initialColumns.filter((col) =>
    visibleColumns.includes(col.id)
  );

  // Convert data to CSV text format
  const convertToCSV = (data: IVirtualServer[]) => {
    // Define the headers from column names
    const headers = columns.map(col => col.name).join(", ");
  
    // Define rows based on the data
    const rows = data.map(row => {
      return columns.map(col => {
        // Extract value using the selector function
        const value = col.selector(row);
  
        // Handle case where value might be an array or object
        return typeof value === "string"
          ? value.replace(/,/g, "") // Remove commas for CSV consistency
          : Array.isArray(value)
          ? value.join("; ") // Handle arrays, join with a semicolon
          : value;
      }).join(", ");
    });
  
    // Combine headers and rows into CSV format
    return [headers, ...rows].join("\n");
  };
  

  const copyToClipboard = () => {
    const csvText = convertToCSV(filteredData);
    navigator.clipboard.writeText(csvText).then(
      () => alert("Copied to clipboard!"),
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  const handlePrint = () => {
    const visibleColumnsData = columns.filter(col => visibleColumns.includes(col.id));
  
    // Create table HTML dynamically
    const tableHtml = `
      <table>
        <thead>
          <tr>
            ${visibleColumnsData.map(col => `<th>${col.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${siteData.map(row => `
            <tr>
              ${visibleColumnsData.map(col => {
                const value = col?.selector(row);
                return `<td>${typeof value === "string" ? value.replace(/,/g, "") : value}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  
    // Open print window and write HTML with styles
    const printWindow = window.open('', '', 'height=600,width=800');
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
            ${tableHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  
  

  const exportCSV = (data: IVirtualServer[], filename: string) => {
    const csvContent = [
      ["Load Balancer", "Name", "Description", "IP:Port", "SNAT", "ASM", "SSL", "Comp", "Persist", "Pool/Members"],
      ...data.map(row => [
        row.loadbalancer, row.name, row.description, `${row.ip}:${row.port}`,
        row.sourcexlatetype ? `SNAT:${row.sourcexlatepool || "N/A"}` : "Unknown",
        row.asmPolicies ? row.asmPolicies.join(", ") : "N/A",
        `${row.sslprofileclient.includes("None") ? "No" : "Yes"}/${row.sslprofileserver.includes("None") ? "No" : "Yes"}`,
        row.compressionprofile === "None" ? "No" : "Yes",
        row.persistence.includes("None") ? "No" : "Yes",
        row.pools?.join(", ") || "N/A"
      ])
    ]
      .map(e => e.join(","))
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

  const downloadVisibleCSV = () => {
    // Prepare header based on visible columns
    const headers = initialColumns
      .filter(col => visibleColumns.includes(col.id))
      .map(col => col.name);
  
    // Prepare data rows
    const rows = siteData.map(row => 
      initialColumns
        .filter(col => visibleColumns.includes(col.id))
        .map(col => {
          // Handle special formatting or missing values if necessary
          if (col.selector) {
            return col.selector(row);
          }
          return row[col.id] || "";
        })
    );
  
    // Combine headers and rows into CSV content
    const csvContent = [
      headers,
      ...rows
    ]
      .map(e => e.join(","))
      .join("\n");
  
    // Export CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "visible_columns.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAllCSV = () => {
    exportCSV(siteData, "all_columns.csv");
  };
  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold', // Make header text bold
        backgroundColor: '#f4f4f4', // Light grey background for headers
        fontSize: '16px', // Increase font size for headers
        borderBottom: '2px solid #ddd', // Bottom border for header cells
        paddingLeft: '8px', // Cell padding
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        fontSize: '14px', // Font size for cells
        borderRight: '1px solid #ddd', // Right border for cells
        borderBottom: '1px solid #ddd', // Border for data cells
        paddingLeft: '8px', // Cell padding
        paddingRight: '8px',
      },
    },
    table: {
      style: {
        border: '1px solid #ddd', // Border for the table
        borderCollapse: 'collapse', // Collapse table borders
      },
    },
    rows: {
      style: {
        minHeight: '72px', // Row height
      },
    },
  };

  return (
    <div className='mainsection'>
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
              key={col.id}
              className={`dt-button buttons-columnVisibility ${visibleColumns.includes(col.id) ? 'active' : ''}`}
              type="button"
              onClick={() => toggleColumnVisibility(col.id)}
            >
              <span>{col.name}</span>
            </button>
          ))}
          <button
            className="dt-button buttons-copy buttons-html5 tableHeaderColumnButton exportFunctions"
            type="button"
            title="Copy current filtered results as text to clipboard"
            onClick={copyToClipboard}
          >
            <span>Copy</span>
          </button>
          <button
            className="dt-button buttons-print tableHeaderColumnButton exportFunctions"
            type="button"
            title="Print current filtered results"
            onClick={handlePrint}
          >
            <span>Print</span>
          </button>
          <button
            className="dt-button buttons-csv buttons-html5 tableHeaderColumnButton exportFunctions"
            type="button"
            title="Download current filtered results in CSV format"
            onClick={downloadVisibleCSV}
          >
            <span>CSV</span>
          </button>
          <button
            className="dt-button buttons-csv buttons-html5 tableHeaderColumnButton exportFunctions"
            type="button"
            title="Download all results in CSV format"
            onClick={downloadAllCSV}
          >
            <span>All CSV</span>
          </button>
        </div>
        <div ref={tableRef}>
          <DataTable
            columns={columns}
            data={visibleColumns.length > 0 ? filteredData : []}
            pagination
            paginationPerPage={10}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualServers;
