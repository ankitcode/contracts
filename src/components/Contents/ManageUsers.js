import React, { useState, useEffect } from "react";
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
import axios from "../../axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ManageUsers = () => {
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const { user } = useSelector((state) => state.root);
  const [data, setData] = useState([]);
  const [adduseroptions, setAdduseroptions] = useState([]);
  const [adduser, setAdduser] = useState([]);

  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview("init");
    async function fetchData() {
      try {
        axiosConfig.headers["authToken"] = user.authToken;
        const res = await axios.post(
          "/api/auth/getAllAddedUsers",
          {},
          axiosConfig
        );
        setData(res.data.user);
        //console.log(res.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchAllADUsers() {
      try {
        const res = await axios.post(
          "/api/auth/getAllADUsers",
          {},
          axiosConfig
        );
        setAdduseroptions(res.data.empData);
        //console.log(res.data.empData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    fetchAllADUsers();
  }, []);

  data.map((item, idx) => (item.s_no = idx + 1));

  //console.log(adduser);
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
  const handleDelete = async (row) => {
    //console.log(row._id);
    try {
      axiosConfig.headers["authToken"] = user.authToken;
      const res = await axios.post(
        "/api/auth/removeUser",
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
        "/api/auth/getAllAddedUsers",
        {},
        axiosConfig
      );
      //console.log(response.data.user)
      setData(response.data.user);
    } catch (error) {
      console.log(error);
    }
    setRowToDelete({});
    setModalShow(false);
  };

  // Default sort on table
  const defaultSorted = [
    {
      dataField: "s_no",
      order: "asc",
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

  {
    /*const addUserOptions = [
    { value: "60003836", label: "Ankit" },
    { value: "60020617", label: "Dileep Rathore" },
    { value: "60001441", label: "Mayank Shukla" },
  ];
*/
  }

  const handleAddUser = async () => {
    if (adduser) {
      try {
        axiosConfig.headers["authToken"] = user.authToken;
        const res = await axios.post(
          "/api/auth/addUser",
          { empNo: adduser.value },
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
          "/api/auth/getAllAddedUsers",
          {},
          axiosConfig
        );
        setData(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
                        keyField="_id"
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
                                  options={adduseroptions}
                                  onChange={(opt, e) => {
                                    setAdduser(opt);
                                  }}
                                  isClearable={() => {
                                    setAdduser({});
                                    return true;
                                  }}
                                  blurInputOnSelect="true"
                                  placeholder="Add User"
                                />
                              </div>
                              <div className="col-2">
                                {" "}
                                <Button
                                  className="addUserBtn"
                                  onClick={handleAddUser}
                                >
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
                            Delete It
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
