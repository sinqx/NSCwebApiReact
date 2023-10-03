import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7100/api/UserReport/")
      .then(function (response) {
        // handle success
        setReports(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const getUserReportLink = (report) => {
    const { god, kvartal, k_PRED } = report;
    console.log(god);
    return `/UserReports/getInfo/${god}/${k_PRED}/${kvartal}`;
  };

  return (
    <div>
      <h1>Национальный Статистический Комитет</h1>
      <div className="container">
        <div className="row">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                className="col-md-4"
                key={`${report.GOD}_${report.kvartal}_${report.k_pred}`}
              >
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">
                      Дата: {report.GOD}, квартал #{report.kvartal}
                    </h5>
                    <p className="card-text">
                      Код предприятия: {report.k_pred}
                    </p>
                    <Link
                      to={getUserReportLink(report)}
                      className="btn btn-primary"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Данные отчетов загружаются...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReports;
