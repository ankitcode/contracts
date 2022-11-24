import React from "react";
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
    { value: "gemCategories", label: "Categories Available on GeM" },
    { value: "custom", label: "Through Custom Bidding" },
    { value: "boq", label: "BoQ Based Bidding" },
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

  const availonGeM = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const availabilityReportCreated = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

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
                <Card style={{ width: "75rem" }}>
                  <Card.Header>
                    <Card.Title></Card.Title>
                  </Card.Header>

                  <div
                    className="card card-info shadow bg-white pt-1 pb-1 pl-1 pr-1 rounded"
                    style={{ width: "75rem" }}
                  >
                    <Card.Header>
                      <Card.Title>Add Contract Data</Card.Title>
                    </Card.Header>

                    <Formik
                      initialValues={{
                        packageName: "",
                        loaCopy: "",
                        dateAwarded: "",
                        amount: "",
                        natureOfProcurement: null,
                        throughGeM: "",
                        gemMode: "",
                        reasonNotGeM: "",
                        availableOnGeM: "",
                        approvingOfficer: "",
                        availabilityReport: "",
                      }}
                      validate={(values) => {
                        const errors = {};
                        if (!values.packageName) {
                          errors.packageName = "Required";
                        }
                        if (!values.loaCopy) {
                          errors.loaCopy = "Required";
                        }
                        if (!values.dateAwarded) {
                          errors.dateAwarded = "Required";
                        }
                        if (!values.amount) {
                          errors.amount = "Required";
                        }
                        if (!values.natureOfProcurement) {
                          errors.natureOfProcurement = "Required";
                        }
                        if (!values.throughGeM) {
                          errors.throughGeM = "Required";
                        }
                        if (!values.gemMode) {
                          errors.gemMode = "Required";
                        }
                        if (!values.reasonNotGeM) {
                          errors.reasonNotGeM = "Required";
                        }
                        if (!values.availableOnGeM) {
                          errors.availableOnGeM = "Required";
                        }
                        if (!values.approvingOfficer) {
                          errors.approvingOfficer = "Required";
                        }
                        if (!values.availabilityReport) {
                          errors.availabilityReport = "Required";
                        }
                        return errors;
                      }}
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
                                <ErrorMessage name="packageName" />
                              </div>
                            </div>

                            <div className="form-group row">
                              <label
                                htmlFor="loaCopy"
                                className="col-3 col-form-label"
                              >
                                LOA
                              </label>
                              <div className="col-3">
                                <input
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
                                />
                                <ErrorMessage name="loaCopy" />
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
                                <ErrorMessage name="dateAwarded" />
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
                                <ErrorMessage name="amount" />
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
                                    setFieldValue(
                                      "natureOfProcurement",
                                      opt
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.natureOfProcurement}
                                />
                                <ErrorMessage name="natureOfProcurement" />
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
                                    setFieldValue(
                                      "throughGeM",
                                      opt
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.throughGeM}
                                />
                                <ErrorMessage name="throughGeM" />
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
                                    setFieldValue(
                                      "gemMode",
                                      opt
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.gemMode}
                                />
                                <ErrorMessage name="gemMode" />
                              </div>
                            </div>
                            <hr
                              style={{
                                height: "10px",
                              }}
                            />
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
                                    setFieldValue(
                                      "reasonNotGeM",
                                      opt
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.reasonNotGeM}
                                />
                                <ErrorMessage name="reasonNotGeM" />
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
                                    setFieldValue(
                                      "availableOnGeM",
                                      opt
                                    );
                                    //setTouched(true);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.availableOnGeM}
                                />
                                <ErrorMessage name="availableOnGeM" />
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
                                <ErrorMessage name="approvingOfficer" />
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
                                <ErrorMessage name="availabilityReport" />
                              </div>
                            </div>
                          </div>
                          <Card.Footer>
                            <button type="submit" className="btn btn-info">
                              Save
                            </button>
                            <button
                              type="submit"
                              className="btn btn-default float-right"
                              onClick={handleReset}
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
