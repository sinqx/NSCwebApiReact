import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserReportInfo = () => {
  const { god, kvartal, k_PRED } = useParams();
  const [report, setReport] = useState({});
  const [editedReport, setEditedReport] = useState({});

  useEffect(() => {
    axios
      .get(
        `https://localhost:7100/api/UserReport/getInfo?god=${god}&kpred=${k_PRED}&kvartal=${kvartal}`
      )
      .then(function (response) {
        setReport(response.data);
        setEditedReport(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [god, k_PRED, kvartal]);

  const handleReportChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setEditedReport((prevReport) => ({
      ...prevReport,
      [name]: newValue,
    }));

    handleСhangeReport(name, newValue); // Вызов функции handleSaveReport при изменении поля
  };

  const handleСhangeReport = (propertyName, propertyValue) => {
    const updatedReport = {
      ...editedReport,
      [propertyName]: propertyValue,
    };

    console.log(updatedReport);
    axios
      .patch("https://localhost:7100/api/UserReport/change", null, {
        params: {
          god: report.god,
          k_pred: report.k_PRED,
          kvartal: report.kvartal,
        },
        data: {
          parameters: {
            [propertyName]: propertyValue,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("Report saved successfully");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response.data);
      });
  };

  const handleSaveReport = () => {
    console.log(editedReport);
    axios
      .put("https://localhost:7100/api/UserReport/replace", editedReport, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("Report saved successfully");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Национальный Статистический Комитет</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">
                  Дата: {report.god}, квартал #{report.kvartal}
                </h5>
                <p className="card-text">Код предприятия: {report.k_PRED}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Отобразить поля отчета для редактирования */}
      <h2>Редактирование отчета</h2>
      <div>
        <label>INDGR:</label>
        <input
          type="checkbox"
          name="indgr"
          checked={editedReport.indgr ?? report.indgr}
          onChange={handleReportChange}
        />
      </div>
      <div>
        <label>date_UPDATE:</label>
        <input
          type="date"
          name="date_UPDATE"
          value={
            (editedReport.date_UPDATE || report.date_UPDATE)?.split("T")[0]
          }
          onChange={handleReportChange}
        />
      </div>
      <div>
        <label>F_I_O:</label>
        <input
          type="text"
          name="f_I_O"
          value={editedReport.f_I_O ?? report.f_I_O}
          onChange={handleReportChange}
        />
      </div>
      <div>
        <label>K_NPO:</label>
        <input
          type="text"
          name="k_NPO"
          value={editedReport.k_NPO ?? report.k_NPO}
          onChange={handleReportChange}
        />
      </div>
      {/* Добавьте остальные поля для редактирования */}

      {/* Кнопка сохранения отчета */}
      <button onClick={handleSaveReport}>Сохранить</button>
    </div>
  );
};

export default UserReportInfo;
