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
        setReports(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const getUserReportLink = (report) => {
    const { god, kvartal, k_PRED } = report;
    return {
      pathname: `/UserReport/getInfo/${god}/${kvartal}/${k_PRED}`,
    };
  };

  const getCurrentQuarter = () => {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 2) {
      return "1";
    } else if (month >= 3 && month <= 5) {
      return "2";
    } else if (month >= 6 && month <= 8) {
      return "3";
    } else {
      return "4";
    }
  };

  
  const currentQuarter = getCurrentQuarter();
  const createReportForCurrentQuarter = () => {
    // Обработчик для создания отчета за текущий квартал
    // ...
  };

  const quarterWords = ["Зима", "Весна", "Лето", "Осень"]; // Соответствие числовых значений кварталам словами

  const hasReportForCurrentQuarter = reports.some(
    
    (report) => report.kvartal === currentQuarter 
  );

  return (
    <div>
      <h1>Отчеты</h1>
      <div className="content_container">
        {!hasReportForCurrentQuarter && (
          <div className="card mb-3">
            <div className="card-body">
              <button
                className="btn btn-success"
                onClick={createReportForCurrentQuarter}
              >
                Создать отчет за {quarterWords[currentQuarter - 1]}
              </button>
            </div>
          </div>
        )}
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              className="card mb-3"
              key={`${report.god}_${report.kvartal}_${report.k_PRED}`}
            >
              <div className="card-body">
                <h5 className="card-title">
                  {quarterWords[report.kvartal - 1]} - {report.god}
                </h5>
                <p className="card-text">Код предприятия: {report.k_PRED}</p>
                <Link to={getUserReportLink(report)} className="btn btn-primary">
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