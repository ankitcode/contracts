/*
Dashboard or home page
*/

// Imports
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  Label,
} from "recharts";

const Home = () => {
  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview("init");
  }, []);
  const data = [
    {
      name: "A",
      GeM: 4000,
      NonGeM: 2400,
    },
    {
      name: "B",
      GeM: 3000,
      NonGeM: 1398,
    },
    {
      name: "C",
      GeM: 2000,
      NonGeM: 9800,
    },
    {
      name: "D",
      GeM: 2780,
      NonGeM: 3908,
    },
    {
      name: "E",
      GeM: 1890,
      NonGeM: 4800,
    },
  ];
  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Dashboard</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid" align="center">
            <div className="row">
              <div className="col-12">
                <Card style={{ width: "100rem" }}>
                  <Card.Header>
                    <Card.Title></Card.Title>
                  </Card.Header>

                  <div
                    className="card card-info shadow bg-white pt-1 pb-1 pl-1 pr-1 rounded"
                    style={{ width: "100rem" }}
                  >
                    <Card.Header>
                      <Card.Title>Dashboard</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-6">
                          <Card>
                            <Card.Header style={{ backgroundColor: "#A7C7E7" }}>
                              <Card.Title>
                                GeM vs Non-GeM Procurement
                              </Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <Tabs
                                id="controlled-tab-example"
                                className="mb-3"
                              >
                                <Tab eventKey="chartMonth" title="This Month">
                                  <ResponsiveContainer
                                    width="100%"
                                    height={470}
                                  >
                                    <BarChart data={data}>
                                      <XAxis dataKey="name">
                                        <Label
                                          value="Location"
                                          offset={0 - 5}
                                          position="insideBottom"
                                          style={{
                                            fontSize: "1.2rem",
                                          }}
                                        />
                                      </XAxis>
                                      <YAxis>
                                        <Label
                                          value="Amount (in Lakhs)"
                                          offset={0}
                                          position="insideLeft"
                                          angle="-90"
                                          style={{
                                            fontSize: "1.2rem",
                                          }}
                                        />
                                      </YAxis>
                                      <Tooltip />
                                      <Legend
                                        verticalAlign="top"
                                        align="right"
                                      />
                                      <Bar dataKey="GeM" fill="#3C84AB" />
                                      <Bar dataKey="NonGeM" fill="#85CDFD" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </Tab>
                                <Tab eventKey="chartYear" title="This Year">
                                  <div>This Year Chart</div>
                                </Tab>
                              </Tabs>
                            </Card.Body>
                          </Card>
                        </div>
                        <div className="col-6">
                          <Card>
                            <Card.Header style={{ backgroundColor: "#A7C7E7" }}>
                              <Card.Title>Type of Procurement</Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <Tabs
                                id="controlled-tab-example"
                                className="mb-3"
                              >
                                <Tab eventKey="pieMonth" title="This Month">
                                  <div>This Month Pie</div>
                                </Tab>
                                <Tab eventKey="pieYear" title="This Year">
                                  <div>This Year Pie</div>
                                </Tab>
                              </Tabs>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </Card.Body>
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

export default Home;
