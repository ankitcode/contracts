import React, { useState } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import filterFactory from "react-bootstrap-table2-filter";
import Select from "react-select";

const ManageUsers = () => {
  const data = [
    {
      id: "1",
      name: "ankit",
      empNo: "60003836",
      post: "Engr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "2",
      name: "ankit",
      empNo: "60003836",
      post: "Engr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "3",
      name: "ankit",
      empNo: "60003836",
      post: "Engr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "4",
      name: "ankit",
      empNo: "60003836",
      post: "Engr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "5",
      name: "ankit",
      empNo: "60003836",
      post: "Engr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "6",
      name: "ankit",
      empNo: "60003836",
      post: "Engr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "7",
      name: "Dileep",
      empNo: "60020617",
      post: "Asst Mgr",
      department: "IT",
      location: "RHQ-Vadodara",
    },
    {
      id: "8",
      name: "Mayank Dhar Shukla",
      empNo: "60001441",
      post: "DGM",
      department: "IT",
      location: "RHQ-Vadodara",
    },
  ];

  data.map((item, idx) => (item.s_no = idx + 1));

  //For delete modal
  const [showModal, setModalShow] = useState(false);
  const handleClose = () => {
    setRowToDelete({});
    setModalShow(false);
  };
  //const handleShow = () => setModalShow(true);

  //Data to be deleted
  const [rowToDelete, setRowToDelete] = useState({});

  // Columns for table
  const columns = [
    {
      dataField: "s_no",
      text: "S/No.",
      headerStyle: { minWidth: "50px", backgroundColor: "#A7C7E7" },
      style: { width: "fit-content" },
    },
    {
      dataField: "name",
      text: "Name",
      headerAlign: "center",
      headerStyle: { minWidth: "150px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "empNo",
      text: "Employee No",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "post",
      text: "Designation",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      sort: true,
    },
    {
      dataField: "department",
      text: "Department",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
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
      dataField: "action",
      text: "Action",
      headerAlign: "center",
      headerStyle: { minWidth: "100px", backgroundColor: "#A7C7E7" },
      align: "center",
      formatter: (cellContent, row) => {
        return (
          <>
            <button
              className="btn btn-danger btn-xs deleteUserBtn"
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
  const handleDelete = (row) => {
    console.log(row);
    // Todo - delete API call

    setRowToDelete({});
    setModalShow(false);
  };

  // Default sort on table
  const defaultSorted = [
    {
      dataField: "s_no",
      order: "asc"
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

  const addUserOptions = [
    { value: "60003836", label: "Ankit" },
    { value: "60020617", label: "Dileep Rathore" },
    { value: "60001441", label: "Mayank Shukla" },
  ];

  const [addUser, setAddUser] = useState({});

  const handleAddUser = () => {console.log(addUser);};

  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Manage Users</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Manage Users</li>
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
                        keyField="id"
                        data={data}
                        columns={columns}
                        search
                      >
                        {(props) => (
                          <div
                            id="example1_wrapper"
                            className="dataTables_wrapper dt-bootstrap4"
                          >
                            <div className="row">
                              <div className="col-4">
                                <Select
                                  name="addUser"
                                  options={addUserOptions}
                                  onChange={(opt, e) => {
                                    setAddUser(opt);
                                  }}
                                  isClearable={() => {
                                    setAddUser({});
                                    return true;
                                  }}
                                  blurInputOnSelect="true"
                                  placeholder="Add User"
                                />
                              </div>
                              <div className="col-2">
                                {" "}
                                <Button className="addUserBtn" onClick={handleAddUser}>
                                <i className="fas fa-user-plus"></i>
                                </Button>{" "}
                              </div>
                              <div className="col-6">
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
                              keyField="id"
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
                        <Modal.Footer justifyContent="space-between">
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
                            Yes...Delete It!
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

export default ManageUsers;
