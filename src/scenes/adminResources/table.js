// Table.js
//Source for expanded col: https://codesandbox.io/s/react-table-expand-rows-xpgcg?from-embed=&file=/src/App.js:2151-2766
import React from "react";
import { useTable, useSortBy, useExpanded } from "react-table";
import "./table.css"
export default function Table({ columns, data }) {
  const initialState = { hiddenColumns: ['Description'] };
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    state: { expanded },
    visibleColumns,
  } = useTable({
    columns,
    data,
    initialState
    
  }, useSortBy, useExpanded);
  console.log('table data',data)
  /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */

  const renderRowSubComponent = React.useCallback(
      ({ row }) => (
        <h3>
          data here
          {row}
        </h3>
      ),

      []
    );
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} onClick={() => column.toggleSortBy(!column.isSortedDesc)}>{column.render("Header")}
              <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                  
              </th>
              
            ))}
            
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <>
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
            {row.isExpanded ? (
                <tr className = "expand1">
                  <td className = "expand" colSpan={visibleColumns.length}>
                    <tr className = "summary">Description</tr>
                  <td className = "expand">{row.values.Description}</td>
                  </td>
                </tr>
              ) : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
}