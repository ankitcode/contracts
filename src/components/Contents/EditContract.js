import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const EditContract = (props) => {
  let axiosConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  const { user } = useSelector((state) => state.root);

  // Options for select box
  const procurementNatureOptions = [
    { value: "worksCivil", label: "Works or Civil" },
    { value: "goods", label: "Goods" },
    { value: "services", label: "Services" },
  ];

  const throughGeMOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const gemModeOptions = [
    { value: "notApplicable", label: "Not Applicable" },
    { value: "gemCategories", label: "Categories Available on GeM" },
    { value: "custom", label: "Through Custom Bidding" },
    { value: "boq", label: "BoQ Based Bidding" },
  ];

  const msmeVendorOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const msmeTypeOptions = [
    { value: "notApplicable", label: "Not Applicable" },
    { value: "women", label: "Women" },
    { value: "scst", label: "SC/ST" },
    { value: "womenscst", label: "Women SC/ST" },
  ];

  const reasonNotThroughGeM = [
    { value: "urgent", label: "Urgent" },
    { value: "rateContract", label: "Rate Contract" },
    { value: "pac", label: "PAC/OEM Category" },
    { value: "dgr", label: "DGR" },
    { value: "lifeInsurance", label: "Life Insurance" },
    { value: "featureNotAvailable", label: "Category/Feature Not Available" },
    { value: "singleTender", label: "Single Tender" },
    { value: "mou", label: "MoU" },
    { value: "lte", label: "LTE" },
    { value: "otherReason", label: "Other Reason" },
  ];

  const availOnGeM = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const availabilityReportCreated = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const [loaFileName, setLoaFileName] = useState("");
  const [approvalFileName, setApprovalFileName] = useState("");
  const [msmeCertificateFileName, setMsmeCertificateFileName] = useState("");
  const FILE_SIZE = 10 * 1024 * 1024;
  const SUPPORTED_FORMATS = ["application/pdf"];

  //const [showNotGemPart, setShowNotGemPart] = useState(false);

  const validationSchema = Yup.object({
    packageName: Yup.string().required("Required!"),
    loaCopy: Yup.mixed().when("isLoaCopy", {
      is: (val) => {
        return val;
      },
      then: Yup.mixed()
        .required("Required!")
        .test(
          "fileFormat",
          "Only pdf Allowed!",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        )
        .test(
          "fileSize",
          "Max file size Allowed is 10 MB !",
          (value) => value && value.size <= FILE_SIZE
        ),
    }),
    dateAwarded: Yup.string().required("Required!"),
    amount: Yup.string()
      .matches(/^\d+$/, "Enter only digits!")
      .required("Required!"),
    natureOfProcurement: Yup.object().required("Required!"),
    throughGeM: Yup.object().required("Required!"),
    gemMode: Yup.object().required("Required!"),
    msmeVendor: Yup.object().required("Required!"),
    msmeCertificateFile: Yup.mixed().when("msmeVendor", {
      is: (val) => {
        if (val) {
          return val.value === "yes";
        } else {
          return true;
        }
      },
      then: Yup.mixed().when("isMSMECertificateFile", {
        is: (val) => {
          return val;
        },
        then: Yup.mixed()
          .required("Required!")
          .test(
            "fileFormat",
            "Only pdf Allowed!",
            (value) => value && SUPPORTED_FORMATS.includes(value.type)
          )
          .test(
            "fileSize",
            "Max file size Allowed is 10 MB !",
            (value) => value && value.size <= FILE_SIZE
          ),
      }),
    }),
    msmeType: Yup.object().required("Required!"),
    reasonNotGeM: Yup.object().when("throughGeM", {
      is: (val) => {
        if (val) {
          return val.value === "no";
        } else {
          return true;
        }
      },
      then: Yup.object().required("Required!"),
    }),
    availableOnGeM: Yup.object().when("throughGeM", {
      is: (val) => {
        if (val) {
          return val.value === "no";
        } else {
          return true;
        }
      },
      then: Yup.object().required("Required!"),
    }),
    approvingOfficer: Yup.string().when("throughGeM", {
      is: (val) => {
        if (val) {
          return val.value === "no";
        } else {
          return true;
        }
      },
      then: Yup.string()
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          "Enter a Valid Name!"
        )
        .required("Required!"),
    }),
    approvalCopy: Yup.mixed().when("throughGeM", {
      is: (val) => {
        if (val) {
          return val.value === "no";
        } else {
          return true;
        }
      },
      then: Yup.mixed().when("isApprovalCopy", {
        is: (val) => {
          return val;
        },
        then: Yup.mixed()
          .required("Required!")
          .test(
            "fileFormat",
            "Only pdf Allowed!",
            (value) => value && SUPPORTED_FORMATS.includes(value.type)
          )
          .test(
            "fileSize",
            "Max file size Allowed is 10 MB !",
            (value) => value && value.size <= FILE_SIZE
          ),
      }),
    }),
    availabilityReport: Yup.object().when("throughGeM", {
      is: (val) => {
        if (val) {
          //console.log(val);
          return val.value === "no";
        } else {
          return true;
        }
      },
      then: Yup.object().required("Required!"),
    }),
  });

  return (
    <Modal show={props.show} backdrop="static" centered keyboard="False">
      <Modal.Body>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Card style={{ width: "55rem" }}>
                  <Card.Header>
                    <Card.Title></Card.Title>
                  </Card.Header>
                  <div
                    className="card card-info shadow bg-white pt-1 pb-1 pl-1 pr-1 rounded"
                    style={{ width: "55rem" }}
                  >
                    <Card.Header>
                      <Card.Title>Edit Contract Data</Card.Title>
                    </Card.Header>
                    <Formik
                      initialValues={{
                        packageName: props.row.packageName,
                        loaCopy: null,
                        isLoaCopy: false,
                        dateAwarded: props.row.awardedOn
                          ? props.row.awardedOn.split("T")[0]
                          : "",
                        amount: props.row.value,
                        natureOfProcurement: props.row.procurementNature,
                        throughGeM: props.row.throughGeM,
                        gemMode: props.row.gemMode,
                        msmeVendor: props.row.msmeVendor,
                        msmeCertificateFile: null,
                        isMSMECertificateFile: !props.row.msmeCertificate
                          ? true
                          : false,
                        msmeType: props.row.msmeType,
                        reasonNotGeM: props.row.reasonNotGeM,
                        availableOnGeM: props.row.availableOnGeM,
                        approvingOfficer: props.row.approvingOfficer,
                        approvalCopy: null,
                        isApprovalCopy: !props.row.approval ? true : false,
                        availabilityReport: props.row.gemAvailabilityReport,
                      }}
                      validationSchema={validationSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          if (values.throughGeM.value == "yes") {
                            values.reasonNotGeM = "";
                            values.availableOnGeM = "";
                            values.approvingOfficer = "";
                            values.availabilityReport = "";
                            values.approvalCopy = null;
                            setApprovalFileName(null);
                          }
                          if (values.msmeVendor.value == "no") {
                            values.msmeType = "";
                            values.msmeCertificateFile = null;
                            setMsmeCertificateFileName(null);
                          }
                          const formData = new FormData();
                          if (values.loaCopy) {
                            formData.append("loaCopy", values.loaCopy);
                            delete values["loaCopy"];
                          }
                          if ("msmeCertificateFile" in values) {
                            formData.append(
                              "msmeCertificateFile",
                              values.msmeCertificateFile
                            );
                            delete values["msmeCertificateFile"];
                          }
                          if (values.approvalCopy) {
                            formData.append(
                              "approvalCopy",
                              values.approvalCopy
                            );
                            delete values["approvalCopy"];
                          }
                          formData.append("data", JSON.stringify(values));
                          axiosConfig.headers["authToken"] = user.authToken;
                          const res = await axios.put(
                            "/api/contracts/updateContractsData/" +
                              props.row._id,
                            formData,
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
                          setSubmitting(false);
                          props.editShow(false);
                          setTimeout(
                            window.location.reload.bind(window.location),
                            800
                          );
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        handleReset,
                        setFieldValue,
                        setTouched,
                        handleState,
                        /* and other goodies */
                      }) => (
                        <form
                          className="form-horizontal"
                          onSubmit={handleSubmit}
                        >
                          <div className="card-body">
                            <div className="form-group row">
                              <label
                                htmlFor="packageName"
                                className="col-3 col-form-label"
                              >
                                Package Name
                              </label>
                              <div className="col-9">
                                <textarea
                                  type="textarea"
                                  className="form-control"
                                  row={2}
                                  name="packageName"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.packageName}
                                />
                                <ErrorMessage name="packageName">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>

                            <div className="form-group row">
                              <label className="col-3 col-form-label">
                                LOA
                              </label>
                              <div className="col-3">
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input
                                      name="loaCopy"
                                      type="file"
                                      onChange={(event) => {
                                        //console.log(
                                        //event.currentTarget.files[0]
                                        //);
                                        setFieldValue("isLoaCopy", true);
                                        if (event.currentTarget.files[0]) {
                                          setFieldValue(
                                            "loaCopy",
                                            event.currentTarget.files[0]
                                          );
                                          setLoaFileName(
                                            event.currentTarget.files[0].name
                                          );
                                        } else {
                                          setFieldValue(
                                            "loaCopy",
                                            null
                                          );
                                          setLoaFileName("");
                                        }
                                      }}
                                      onBlur={handleBlur}
                                      className="form-control"
                                      id="loaCopy"
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="loaCopy"
                                    >
                                      {loaFileName
                                        ? loaFileName
                                        : props.row.loa
                                        ? props.row.loa.originalname
                                        : ""}
                                    </label>
                                  </div>
                                </div>
                                <ErrorMessage name="loaCopy">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                              <label
                                htmlFor="dateAwarded"
                                className="col-3 col-form-label"
                              >
                                Awarded On
                              </label>
                              <div className="col-3">
                                <input
                                  type="date"
                                  className="form-control"
                                  name="dateAwarded"
                                  onChange={(event) => {
                                    setFieldValue(
                                      "dateAwarded",
                                      event.target.value
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.dateAwarded}
                                />
                                <ErrorMessage name="dateAwarded">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label
                                htmlFor="amount"
                                className="col-3 col-form-label"
                              >
                                Value <span>&#8377;</span>
                              </label>
                              <div className="col-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="amount"
                                  onChange={(event) => {
                                    setFieldValue("amount", event.target.value);
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.amount}
                                />
                                <ErrorMessage name="amount">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                              <label
                                htmlFor="natureOfProcurement"
                                className="col-3 col-form-label"
                              >
                                Procurement Nature
                              </label>
                              <div className="col-3">
                                <Select
                                  name="natureOfProcurement"
                                  options={procurementNatureOptions}
                                  onChange={(opt, e) => {
                                    setFieldValue("natureOfProcurement", opt);
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.natureOfProcurement}
                                />
                                <ErrorMessage name="natureOfProcurement">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label
                                htmlFor="throughGeM"
                                className="col-3 col-form-label"
                              >
                                Through GeM
                              </label>
                              <div className="col-3">
                                <Select
                                  name="throughGeM"
                                  options={throughGeMOptions}
                                  onChange={(opt, e) => {
                                    setFieldValue("throughGeM", opt);
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.throughGeM}
                                />
                                <ErrorMessage name="throughGeM">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                              <label
                                htmlFor="gemMode"
                                className="col-3 col-form-label"
                              >
                                GeM Mode
                              </label>
                              <div className="col-3">
                                <Select
                                  name="gemMode"
                                  options={gemModeOptions}
                                  onChange={(opt, e) => {
                                    setFieldValue("gemMode", opt);
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.gemMode}
                                />
                                <ErrorMessage name="gemMode">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>
                            <hr
                              style={{
                                height: "10px",
                              }}
                            />

                            <div className="form-group row">
                              <label
                                htmlFor="msmeVendor"
                                className="col-3 col-form-label"
                              >
                                MSME Vendor
                              </label>
                              <div className="col-3">
                                <Select
                                  name="msmeVendor"
                                  options={msmeVendorOptions}
                                  onChange={(opt, e) => {
                                    setFieldValue("msmeVendor", opt);
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.msmeVendor}
                                />
                                <ErrorMessage name="msmeVendor">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                              <label
                                htmlFor="msmeType"
                                className="col-3 col-form-label"
                              >
                                MSME Type
                              </label>
                              <div className="col-3">
                                <Select
                                  name="msmeType"
                                  options={msmeTypeOptions}
                                  onChange={(opt, e) => {
                                    setFieldValue("msmeType", opt);
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.msmeType}
                                />
                                <ErrorMessage name="msmeType">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-3 col-form-label">
                                MSME Certificate (if MSME)
                              </label>
                              <div className="col-3">
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input
                                      name="msmeCertificateFile"
                                      type="file"
                                      onChange={(event) => {
                                        //console.log(
                                        //event.currentTarget.files[0]
                                        //);
                                        setFieldValue(
                                          "isMSMECertificateFile",
                                          true
                                        );
                                        if (event.currentTarget.files[0]) {
                                          setFieldValue(
                                            "msmeCertificateFile",
                                            event.currentTarget.files[0]
                                          );
                                          setMsmeCertificateFileName(
                                            event.currentTarget.files[0].name
                                          );
                                        } else {
                                          setFieldValue(
                                            "msmeCertificateFile",
                                            null
                                          );
                                          setMsmeCertificateFileName("");
                                        }
                                      }}
                                      onBlur={handleBlur}
                                      className="form-control"
                                      id="msmeCertificateFile"
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="msmeCertificateFile"
                                    >
                                      {msmeCertificateFileName
                                        ? msmeCertificateFileName
                                        : props.row.msmeCertificate
                                        ? props.row.msmeCertificate.originalname
                                        : ""}
                                    </label>
                                  </div>
                                </div>
                                <ErrorMessage name="msmeCertificateFile">
                                  {(msg) => (
                                    <div style={{ color: "red" }}>{msg}</div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>
                            <hr
                              style={{
                                height: "10px",
                              }}
                            />
                            {values.throughGeM.value === "no" ? (
                              <>
                                <div className="form-group row">
                                  <label
                                    htmlFor="reasonNotGeM"
                                    className="col-3 col-form-label"
                                  >
                                    Reason for Not Through GeM
                                  </label>
                                  <div className="col-3">
                                    <Select
                                      name="reasonNotGeM"
                                      options={reasonNotThroughGeM}
                                      onChange={(opt, e) => {
                                        setFieldValue("reasonNotGeM", opt);
                                        //setTouched(true);
                                      }}
                                      onBlur={handleBlur}
                                      value={values.reasonNotGeM}
                                    />
                                    <ErrorMessage name="reasonNotGeM">
                                      {(msg) => (
                                        <div style={{ color: "red" }}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                  <label
                                    htmlFor="availableOnGeM"
                                    className="col-3 col-form-label"
                                  >
                                    Available on GeM
                                  </label>
                                  <div className="col-3">
                                    <Select
                                      name="availableOnGeM"
                                      options={availOnGeM}
                                      onChange={(opt, e) => {
                                        setFieldValue("availableOnGeM", opt);
                                        //setTouched(true);
                                      }}
                                      onBlur={handleBlur}
                                      value={values.availableOnGeM}
                                    />
                                    <ErrorMessage name="availableOnGeM">
                                      {(msg) => (
                                        <div style={{ color: "red" }}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label
                                    htmlFor="approvingOfficer"
                                    className="col-3 col-form-label"
                                  >
                                    Approving Officer
                                  </label>
                                  <div className="col-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="approvingOfficer"
                                      onChange={(event) => {
                                        setFieldValue(
                                          "approvingOfficer",
                                          event.target.value
                                        );
                                        //setTouched(true);
                                      }}
                                      onBlur={handleBlur}
                                      value={values.approvingOfficer}
                                    />
                                    <ErrorMessage name="approvingOfficer">
                                      {(msg) => (
                                        <div style={{ color: "red" }}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                  <label className="col-3 col-form-label">
                                    Approval
                                  </label>
                                  <div className="col-3">
                                    <div className="input-group">
                                      <div className="custom-file">
                                        <input
                                          name="approvalCopy"
                                          type="file"
                                          onChange={(event) => {
                                            //console.log(
                                            //event.currentTarget.files[0]
                                            //);
                                            setFieldValue(
                                              "isApprovalCopy",
                                              true
                                            );
                                            if (event.currentTarget.files[0]) {
                                              setFieldValue(
                                                "approvalCopy",
                                                event.currentTarget.files[0]
                                              );
                                              setApprovalFileName(
                                                event.currentTarget.files[0].name
                                              );
                                            } else {
                                              setFieldValue(
                                                "approvalCopy",
                                                null
                                              );
                                              setApprovalFileName("");
                                            }
                                          }}
                                          onBlur={handleBlur}
                                          className="form-control"
                                          id="approvalCopy"
                                        />
                                        <label
                                          className="custom-file-label"
                                          htmlFor="approvalCopy"
                                        >
                                          {approvalFileName
                                            ? approvalFileName
                                            : props.row.approval
                                            ? props.row.approval.originalname
                                            : ""}
                                        </label>
                                      </div>
                                    </div>
                                    <ErrorMessage name="approvalCopy">
                                      {(msg) => (
                                        <div style={{ color: "red" }}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label
                                    htmlFor="availabilityReport"
                                    className="col-3 col-form-label"
                                  >
                                    Availability Report Created
                                  </label>
                                  <div className="col-3">
                                    <Select
                                      name="availabilityReport"
                                      options={availabilityReportCreated}
                                      onChange={(opt, e) => {
                                        setFieldValue(
                                          "availabilityReport",
                                          opt
                                        );
                                        //setTouched(true);
                                      }}
                                      onBlur={handleBlur}
                                      value={values.availabilityReport}
                                    />
                                    <ErrorMessage name="availabilityReport">
                                      {(msg) => (
                                        <div style={{ color: "red" }}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                          <Card.Footer>
                            <button type="submit" className="btn btn-info">
                              Update
                            </button>
                            <button
                              type="submit"
                              className="btn btn-default float-right"
                              onClick={(e) => {
                                handleReset(e);
                                props.editShow(false);
                                props.editRow({});
                                setLoaFileName("");
                                setApprovalFileName("");
                                setMsmeCertificateFileName("");
                              }}
                            >
                              Cancel
                            </button>
                          </Card.Footer>
                        </form>
                      )}
                    </Formik>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default EditContract;
