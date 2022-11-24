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
        name={name}
        value={field.value}
        onChange={(value) => helpers.setValue(value)}
        options={options}
        onBlur={() => helpers.setTouched(true)}
      />
      <ErrorMessage name={name} />
    </>
  );
};

const FileSelect = ({ name, options }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <>
      <input
        name={name}
        type="file"
        onChange={(event) => {
          helpers.setFieldValue("loaCopy", event.currentTarget.files[0]);
        }}
        onBlur={() => helpers.setTouched(true)}
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
                <Resizable>
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
                          /* and other goodies */
                        }) => (
                          <form
                            className="form-horizontal"
                            onSubmit={handleSubmit}
                          >
                            <div className="card-body">
                              <div className="form-group row">
                                <label
                                  for="packageName"
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
                                  for="loaCopy"
                                  className="col-3 col-form-label"
                                >
                                  LOA
                                </label>
                                <div className="col-3">
                                  <div className="custom-file">
                                    <FileSelect
                                      name="loaCopy"
                                    />
                                  </div>
                                  {/*<input
                                    type="file"
                                    className="form-control"
                                    name="loaCopy"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.loaCopy}
                        />*/}
                                  <ErrorMessage name="loaCopy" />
                                </div>
                                <label
                                  for="dateAwarded"
                                  className="col-3 col-form-label"
                                >
                                  Awarded On
                                </label>
                                <div className="col-3">
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="dateAwarded"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.dateAwarded}
                                  />
                                  <ErrorMessage name="dateAwarded" />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  for="amount"
                                  className="col-3 col-form-label"
                                >
                                  Value <span>&#8377;</span>
                                </label>
                                <div className="col-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="amount"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.amount}
                                  />
                                  <ErrorMessage name="amount" />
                                </div>
                                <label
                                  for="natureOfProcurement"
                                  className="col-3 col-form-label"
                                >
                                  Procurement Nature
                                </label>
                                <div className="col-3">
                                  <FormSelect
                                    name="natureOfProcurement"
                                    options={procurementNatureOptions}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  for="throughGeM"
                                  className="col-3 col-form-label"
                                >
                                  Through GeM
                                </label>
                                <div className="col-3">
                                  <FormSelect
                                    name="throughGeM"
                                    options={throughGeMOptions}
                                  />
                                </div>
                                <label
                                  for="gemMode"
                                  className="col-3 col-form-label"
                                >
                                  GeM Mode
                                </label>
                                <div className="col-3">
                                  <FormSelect
                                    name="gemMode"
                                    options={gemModeOptions}
                                  />
                                </div>
                              </div>
                              <hr
                                style={{
                                  height: "10px",
                                }}
                              />
                              <div className="form-group row">
                                <label
                                  for="reasonNotGeM"
                                  className="col-3 col-form-label"
                                >
                                  Reason for Not Through GeM
                                </label>
                                <div className="col-3">
                                  <FormSelect
                                    name="reasonNotGeM"
                                    options={reasonNotThroughGeM}
                                  />
                                </div>
                                <label
                                  for="availableOnGeM"
                                  className="col-3 col-form-label"
                                >
                                  Available on GeM
                                </label>
                                <div className="col-3">
                                  <FormSelect
                                    name="availableOnGeM"
                                    options={availonGeM}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  for="approvingOfficer"
                                  className="col-3 col-form-label"
                                >
                                  Approving Officer
                                </label>
                                <div className="col-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="approvingOfficer"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.approvingOfficer}
                                  />
                                  <ErrorMessage name="approvingOfficer" />
                                </div>
                                <label
                                  for="availabilityReport"
                                  className="col-3 col-form-label"
                                >
                                  Availability Report Created
                                </label>
                                <div className="col-3">
                                  <FormSelect
                                    name="availabilityReport"
                                    options={availabilityReportCreated}
                                  />
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
                </Resizable>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AddNew;
