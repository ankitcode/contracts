import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Card from 'react-bootstrap/Card';

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const MyCheckbox = ({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <div>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
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

        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Card>
                  <Card.Header>
                    <Card.Title></Card.Title>
                  </Card.Header>

                  <div className="card card-info shadow bg-white pt-1 pb-1 pl-1 pr-1 rounded">
                    <Card.Header>
                      <Card.Title>Add Contract Data</Card.Title>
                    </Card.Header>

                    <form className="form-horizontal">
                      <div className="card-body">
                        <div className="form-group row">
                          <label
                            for="packageName"
                            className="col-2 col-form-label"
                          >
                            Package Name
                          </label>
                          <div className="col-10">
                            <textarea
                              type="textarea"
                              className="form-control"
                              id="packageName"
                              row={2}
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <label for="loaCopy" className="col-2 col-form-label">
                            LOA
                          </label>
                          <div className="col-2">
                            <input
                              type="text"
                              className="form-control"
                              id="loaCopy"
                            />
                          </div>
                          <label for="date" className="col-2 col-form-label">
                            Awarded On
                          </label>
                          <div className="col-2">
                            <input
                              type="date"
                              className="form-control"
                              id="date"
                            />
                          </div>
                          <label for="amount" className="col-1 col-form-label">
                            Value <span>&#8377;</span>
                          </label>
                          <div className="col-3">
                            <input
                              type="text"
                              className="form-control"
                              id="amount"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            for="natureOfProcurement"
                            className="col-2 col-form-label"
                          >
                            Procurement Nature
                          </label>
                          <div className="col-2">
                            <Select options={procurementNatureOptions} />
                          </div>
                          <label
                            for="throughGeM"
                            className="col-2 col-form-label"
                          >
                            Through GeM
                          </label>
                          <div className="col-2">
                            <Select options={throughGeMOptions} />
                          </div>
                          <label for="gemMode" className="col-1 col-form-label">
                            GeM Mode
                          </label>
                          <div className="col-3">
                            <Select options={gemModeOptions} />
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
                        >
                          Reset
                        </button>
                      </Card.Footer>
                    </form>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title"></h3>
                    </div>

                    <div className="card-body">
                      <Formik
                        initialValues={{
                          firstName: "",
                          lastName: "",
                          email: "",
                          acceptedTerms: false, // added for our checkbox
                          jobType: "", // added for our select
                        }}
                        validationSchema={Yup.object({
                          firstName: Yup.string()
                            .max(15, "Must be 15 characters or less")
                            .required("Required"),
                          lastName: Yup.string()
                            .max(20, "Must be 20 characters or less")
                            .required("Required"),
                          email: Yup.string()
                            .email("Invalid email address")
                            .required("Required"),
                          acceptedTerms: Yup.boolean()
                            .required("Required")
                            .oneOf(
                              [true],
                              "You must accept the terms and conditions."
                            ),
                          jobType: Yup.string()
                            .oneOf(
                              ["designer", "development", "product", "other"],
                              "Invalid Job Type"
                            )
                            .required("Required"),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                          setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                          }, 400);
                        }}
                      >
                        <Form>
                          <MyTextInput
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="Jane"
                          />

                          <MyTextInput
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                          />

                          <MyTextInput
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="jane@formik.com"
                          />

                          <MySelect label="Job Type" name="jobType">
                            <option value="">Select a job type</option>
                            <option value="designer">Designer</option>
                            <option value="development">Developer</option>
                            <option value="product">Product Manager</option>
                            <option value="other">Other</option>
                          </MySelect>

                          <MyCheckbox name="acceptedTerms">
                            I accept the terms and conditions
                          </MyCheckbox>

                          <button type="submit">Submit</button>
                        </Form>
                      </Formik>
                    </div>
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
