import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UserReports.css";

const UserReports = () => {
  const navigate = useNavigate();
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
    axios
    .post("https://localhost:7100/api/UserReport/create", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      console.log("Report saved successfully");
      console.log(response.data);
      // const k_PRED = 22222222;
      // const god = new Date().getFullYear();
      // const kvartal =  getCurrentQuarter();
      // console.log(k_PRED, god, kvartal)
      // return {
      //   pathname: `/UserReport/getInfo/${god}/${kvartal}/${k_PRED}`,
      // };
      navigate(getUserReportLink(response.data)); // Перенаправляем пользователя на страницу отчета
    })
    .catch(function (error) {
      console.log(error);
    });
   
    
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
                Создать отчет за {currentQuarter} квартал. 
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
                  Картал {report.kvartal} - {report.god}
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