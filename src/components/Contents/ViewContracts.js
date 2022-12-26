/*
View Contracts component 
- Allows admin to view all contracts
- Other users can only see contracts added by them
- Users can edit contracts added by them
*/
// Imports
import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  dateFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditContract from "./EditContract";

const ViewContracts = () => {
  const { user } = useSelector((state) => state.root);
  // to keep contracts data to be shown on the page
  const [data, setData] = useState([]);
  // to show edit contract modal
  const [showEditModal, setEditModal] = useState(false);
  //Data to be edited
  const [rowToEdit, setRowToEdit] = useState({});
  // redirect to edit data
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  //Data to be deleted
  const [rowToDelete, setRowToDelete] = useState({});
  // For showing and hiding modal
  const [showModal, setModalShow] = useState(false);
  // axios configure headers
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview("init");
    // get contracts data
    async function fetchData() {
      try {
        axiosConfig.headers["authToken"] = user.authToken;
        const res = await axios.post(
          "/api/contracts/getContracts",
          {},
          axiosConfig
        );
        // set contracts data
        console.log(res.data.contractsData);
        setData(res.data.contractsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  /*-------------------------------Start of Handling table data---------------------------------*/
  // Handle modal close onhide and on selecting 'No' option
  const handleClose = () => {
    setRowToDelete({});
    setModalShow(false);
  };

  // Adding s_no to data
  //const doubled = data.map((item, idx) => (item.s_no = idx + 1));

  // Link to show LOA file on new tab
  const linkFollowLoa = (cell, row, rowIndex, formatExtraData) => {
    let path = "Files/loaFiles" + "/" + row.loa;
    return (
      <a href={path} target="_blank">
        {row.packageName}
      </a>
    );
  };

  // Link to show Non GeM Approval file on new tab
  const linkFollowApproval = (cell, row, rowIndex, formatExtraData) => {
    let path = "Files/approvalFiles" + "/" + row.approval;
    return (
      <a href={path} target="_blank">
        {row.approvingOfficer}
      </a>
    );
  };

  // Columns for table
  const columns = [
    {
      dataField: "packageName",
      text: "Package Name",
      headerAlign: "center",
      headerStyle: { minWidth: "250px", backgroundColor: "#A7C7E7" },
      formatter: linkFollowLoa,
      sort: true,
    },
    {
      dataField: "location",
      text: "Location",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "awardedOn",
      text: "Awarded Date",
      headerAlign: "center",
      formatter: dateFormatter,
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
      // Date filter option
      filter: dateFilter({
        withoutEmptyComparatorOption: true,
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        style: { display: "inline" },
        className: "custom-datefilter-class",
        comparatorStyle: { backgroundColor: "#9ebfd6" },
        comparatorClassName: "custom-comparator-class",
        dateStyle: { backgroundColor: "#9ebfd6", margin: "0px" },
        dateClassName: "custom-date-class",
      }),
    },
    {
      dataField: "value",
      text: "Value",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "procurementNature.label",
      text: "Procurement Nature",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "throughGeM.label",
      text: "Through GeM",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
      searchable: false,
    },
    {
      dataField: "gemMode.label",
      text: "GeM Mode",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "msmeVendor.label",
      text: "MSME Vendor",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "msmeType.label",
      text: "MSME Type",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "reasonNotGeM.label",
      text: "Reason",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "availableOnGeM.label",
      text: "Available on GeM",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
      searchable: false,
    },
    {
      dataField: "approvingOfficer",
      text: "Approver",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      formatter: linkFollowApproval,
      sort: true,
    },
    {
      dataField: "gemAvailabilityReport.label",
      text: "Availability Report",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
      searchable: false,
    },
    {
      dataField: "action",
      text: "Action",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      align: "center",
      formatter: (cellContent, row) => {
        return (
          <>
            {/*Adding buttun to delete contract data*/}
            <button
              className="btn btn-danger btn-xs deleteContract"
              onClick={() => {
                setModalShow(true);
                setRowToDelete(row);
              }}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
            <button
              className="btn btn-danger btn-xs deleteContract"
              onClick={() => {
                setEditModal(true);
                setRowToEdit(row);
              }}
            >
              <i className="fa fa-edit" aria-hidden="true"></i>
            </button>
          </>
        );
      },
    },
  ];
  // Date formatter
  const moment = require("moment");
  function dateFormatter(cell) {
    return <span>{moment(cell).format("DD-MM-YYYY")}</span>;
  }

  // Default sort on table
  const defaultSorted = [
    {
      dataField: "awardedOn",
      order: "desc",
    },
  ];

  // Delete row data function
  const handleDelete = async (row) => {
    try {
      axiosConfig.headers["authToken"] = user.authToken;
      const res = await axios.post(
        "/api/contracts/deleteContractsData",
        { id: row._id },
        axiosConfig
      );
      if (res.data.success) {
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(res.data.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
      const response = await axios.post(
        "/api/contracts/getContracts",
        {},
        axiosConfig
      );
      setData(response.data.contractsData);
    } catch (error) {
      console.log(error);
    }
    setRowToDelete({});
    setModalShow(false);
  };
  /*-------------------------------End of Handling table data---------------------------------*/

  /*----------------------------------Start of Pagination---------------------------------------*/
  // Showing total on pagination
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  // set options for pagination
  const options = {
    paginationSize: 5,
    pageStartIndex: 1,
    hidePageListOnlyOnePage: true,
    firstPageText: "First",
    prePageText: "Back",
    nextPageText: "Next",
    lastPageText: "Last",
    nextPageTitle: "First page",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "All",
        value: data.length,
      },
    ],
  };
  /*----------------------------------End of Pagination---------------------------------------*/

  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>View Contracts</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">View Contracts</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"></h3>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title"></h3>
                    </div>
                    <div className="card-body">
                      <ToolkitProvider
                        keyField="_id"
                        data={data}
                        columns={columns}
                        search
                        exportCSV
                      >
                        {(props) => (
                          <div
                            id="example1_wrapper"
                            className="dataTables_wrapper dt-bootstrap4"
                          >
                            <div className="row">
                              <div className="col-sm-12 col-md-6">
                                <ExportCSVButton
                                  {...props.csvProps}
                                  className="btn btn-secondary buttons-csv buttons-html5"
                                  tabIndex="0"
                                  aria-controls="example1"
                                  type="button"
                                >
                                  <i className="fas fa-solid fa-file-csv fa-2x"></i>
                                </ExportCSVButton>
                              </div>
                              <div className="col-sm-12 col-md-6">
                                <div
                                  id="example1_filter"
                                  className="dataTables_filter"
                                >
                                  <SearchBar
                                    {...props.searchProps}
                                    type="search"
                                    className="form-control form-control-sm"
                                    placeholder=""
                                    aria-controls="example1"
                                  ></SearchBar>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <BootstrapTable
                              {...props.baseProps}
                              bootstrap4
                              wrapperClasses="table-responsive"
                              data={data}
                              columns={columns}
                              pagination={paginationFactory(options)}
                              striped
                              hover
                              condensed
                              defaultSorted={defaultSorted}
                              keyField="_id"
                              filter={filterFactory()}
                            />
                          </div>
                        )}
                      </ToolkitProvider>
                      <Modal
                        show={showModal}
                        onHide={handleClose}
                        backdrop="static"
                        centered
                        keyboard="False"
                        size="sm"
                      >
                        <Modal.Body>Do you want to delete?</Modal.Body>
                        <Modal.Footer justifycontent="space-between">
                          <Button variant="secondary" onClick={handleClose}>
                            No
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDelete(rowToDelete);
                            }}
                            align="right"
                          >
                            Yes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <EditContract show={showEditModal} row={rowToEdit} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ViewContracts;
