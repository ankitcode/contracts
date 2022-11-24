import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Field, Formik, Form, useField, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import { Dropdown } from "bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Resizable } from "react-resizable";

const FormSelect = ({ name, options }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <>
      <Select
        type="select"
        name={name}
        options={options}
        onChange={(value) => {
          console.log(helpers);
          //console.log(helpers);
          helpers.setValue(value);
          helpers.setTouched(true);
          console.log(field);
        }}
        //onBlur={() => }
        value={field.value}
      />
      <ErrorMessage name={name} />
    </>
  );
};

const FileSelect = ({ name, options }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <>
      <Field
        name={name}
        type="file"
        onChange={(event) => {
          console.log(event.currentTarget.files[0]);
          helpers.setFieldValue("loaCopy", event.currentTarget.files[0]);
          helpers.setTouched(true);
        }}
        className="form-control"
      />
      <ErrorMessage name={name} />
    </>
  );
};

const AddNew = () => {
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

  const reasonNotThroughGeM = [
    { value: "notApplicable", label: "Not Applicable" },
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

  const availonGeM = [
    { value: "notApplicable", label: "Not Applicable" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const availabilityReportCreated = [
    { value: "notApplicable", label: "Not Applicable" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const [fileName, setFileName] = useState("");
  const FILE_SIZE = 2048 * 1024;
  const SUPPORTED_FORMATS = ["application/pdf"];
  const validationSchema = Yup.object({
    packageName: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
        "Enter Valid Package Name!"
      )
      .required("Required!"),
    loaCopy: Yup.mixed()
      .required("File is Required!")
      .test(
        "fileFormat",
        "Only pdf Allowed!",
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      )
      .test(
        "fileSize",
        "Max file size Allowed is 2 MB !",
        (value) => value && value.size <= FILE_SIZE
      ),
    dateAwarded: Yup.string().required("Required!"),
    amount: Yup.string()
      .matches(/^\d+$/, "Enter only digits!")
      .required("Required!"),
    natureOfProcurement: Yup.object().required("Required!"),
    throughGeM: Yup.object().required("Required!"),
    gemMode: Yup.object().required("Required!"),
    reasonNotGeM: Yup.object().required("Required!"),
    availableOnGeM: Yup.object().required("Required!"),
    approvingOfficer: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "Enter a Valid Name!"
      )
      .required("Required!"),
    availabilityReport: Yup.object().required("Required!"),
  });

  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Add Contracts</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Add Contracts</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="content" id="scrollingCard">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Card style={{ width: "60rem" }}>
                  <Card.Header>
                    <Card.Title></Card.Title>
                  </Card.Header>

                  <div
                    className="card card-info shadow bg-white pt-1 pb-1 pl-1 pr-1 rounded"
                    style={{ width: "60rem" }}
                  >
                    <Card.Header>
                      <Card.Title>Add Contract Data</Card.Title>
                    </Card.Header>

                    <Formik
                      initialValues={{
                        packageName: "",
                        loaCopy: null,
                        dateAwarded: "",
                        amount: "",
                        natureOfProcurement: "",
                        throughGeM: "",
                        gemMode: "",
                        reasonNotGeM: "",
                        availableOnGeM: "",
                        approvingOfficer: "",
                        availabilityReport: "",
                      }}
                      validationSchema={validationSchema}
                      onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                          alert(JSON.stringify(values, null, 2));
                          setSubmitting(false);
                        }, 400);
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
                                        console.log(
                                          event.currentTarget.files[0]
                                        );
                                        setFieldValue(
                                          "loaCopy",
                                          event.currentTarget.files[0]
                                        );
                                        setFileName(
                                          event.currentTarget.files[0].name
                                        );
                                        //setTouched(true);
                                      }}
                                      onBlur={handleBlur}
                                      className="form-control"
                                      id="loaCopy"
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="loaCopy"
                                    >
                                      {fileName ? fileName : ""}
                                    </label>
                                  </div>
                                  {/*<div className="input-group-append">
                                    <span className="input-group-text">Upload</span>
                                  </div>*/}
                                </div>
                                {/* <input
                                  name="loaCopy"
                                  type="file"
                                  onChange={(event) => {
                                    console.log(event.currentTarget.files[0].name);
                                    setFieldValue(
                                      "loaCopy",
                                      event.currentTarget.files[0]
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  //value={values.loaCopy}
                                  className="form-control"
                                />*/}
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
                                      options={availonGeM}
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
                              Save
                            </button>
                            <button
                              type="submit"
                              className="btn btn-default float-right"
                              onClick={(e) => {
                                handleReset(e);
                                setFileName("");
                              }}
                            >
                              Reset
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
      </div>
    </>
  );
};

export default AddNew;
