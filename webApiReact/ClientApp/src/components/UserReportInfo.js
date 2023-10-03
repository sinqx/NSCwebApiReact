import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const UserReportInfo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const god = searchParams.get("god");
  const kpred = searchParams.get("kpred");
  const kvartal = searchParams.get("kvartal");

  const [reports, setReports] = useState([]);
  console.log(god,kpred,kvartal);
  useEffect(() => {
    axios
      .get(
        `https://localhost:7100/api/UserReport/getInfo?god=${god}&kpred=${kpred}&kvartal=${kvartal}`
      )
      .then(function (response) {
        // handle success
        setReports(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [god, kpred, kvartal]);

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
                      Дата: {report.god}, квартал #{report.kvartal}
                    </h5>
                    <p className="card-text">
                      Код предприятия: {report.k_PRED}
                    </p>
                    <a
                      href={`/Reports/Details/${report.id}`}
                      className="btn btn-primary"
                    >
                      Подробнее
                    </a>
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

export default UserReportInfo;
