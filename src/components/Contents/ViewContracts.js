import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import filterFactory, { dateFilter, Comparator } from "react-bootstrap-table2-filter";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { toast } from "react-toastify";

const ViewContracts = () => {
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const { user } = useSelector((state) => state.root);
  const [data, setData] = useState([]);

  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview("init");
    async function fetchData() {
      try {
        //console.log(user.authToken);
        axiosConfig.headers["authToken"] = user.authToken;
        //console.log(axiosConfig);
        const res = await axios.post(
          "/api/contracts/getContracts",
          {},
          axiosConfig
        );
        //console.log(res.data.contractsData);
        setData(res.data.contractsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  
  // Adding s_no to data
  //const doubled = data.map((item, idx) => (item.s_no = idx + 1));

  // Link to edit table data
  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return <Link to="/edit">{row.packageName}</Link>;
  };

  //For delete modal
  const [showModal, setModalShow] = useState(false);
  const handleClose = () => {
    setRowToDelete({});
    setModalShow(false);
  };
  const handleShow = () => setModalShow(true);

  //Data to be deleted
  const [rowToDelete, setRowToDelete] = useState({});

  // Columns for table
  const columns = [

    {
      dataField: "packageName",
      text: "Package Name",
      headerAlign: "center",
      headerStyle: { minWidth: "250px", backgroundColor: "#A7C7E7" },
      //formatter: linkFollow,
      sort: true,
    },
    {
      dataField: "awardedOn",
      text: "Awarded Date",
      headerAlign: "center",
      formatter: dateFormatter,
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
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
            <button
              className="btn btn-danger btn-xs deleteContract"
              onClick={() => {
                setModalShow(true);
                setRowToDelete(row);
              }}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          </>
        );
      },
    },
  ];

  // Delete function
  const handleDelete = async (row) => {
    try {
      axiosConfig.headers["authToken"] = user.authToken;
      
      const res = await axios.post(
        "/api/contracts/deleteContractsData",
        { id: row._id },
        axiosConfig
      );
      //setData(res.data.user);
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
      //console.log(res.data.contractsData);
      setData(response.data.contractsData);
    } catch (error) {
      console.log(error);
    }
    setRowToDelete({});
    setModalShow(false);
  };

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

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 5,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
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
    //buttonsAlwaysShown: ["Back","Next","Last","First"],
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

  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;

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
