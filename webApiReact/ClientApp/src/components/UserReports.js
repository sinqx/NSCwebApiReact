import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserReports.css";

const UserReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7100/api/UserReport/")
      .then(function (response) {
        // handle success
        setReports(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const getUserReportLink = (report) => {
    const { god, kvartal, k_PRED } = report;
    return {
      pathname: `/UserReport/getInfo/${god}/${kvartal}/${k_PRED}`,
    };
  };
  return (
    <div>
      <h1>Отчёты</h1>
      <div className="report_container">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              className="card mb-3"
              key={`${report.god}_${report.kvartal}_${report.k_PRED}`}
            >
              <div className="card-body">
                <h5 className="card-title">
                  {report.kvartal} Квартал - {report.god}
                </h5>
                <p className="card-text">Код предприятия: {report.k_PRED}</p>
                <Link
                  to={getUserReportLink(report)}
                  className="btn btn-primary"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Данные отчетов загружаются...</p>
        )}
      </div>
    </div>
  );
};

export default UserReports;
