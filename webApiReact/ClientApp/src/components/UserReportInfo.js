import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserReportInfo = () => {
  const { god, kvartal, k_PRED } = useParams();
  const [report, setReport] = useState({});
  const [editedReport, setEditedReport] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleEraseReport = () => {
    setEditedReport({});
    setIsFormValid(false);
  };

  const handleReportChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setEditedReport((prevReport) => ({
      ...prevReport,
      [name]: newValue,
    }));

    // Проверяем, заполнены ли все поля формы
    const formFields = Object.values({
      ...editedReport,
      [name]: newValue,
    });
    const isValid = formFields.every(
      (field) => field !== "" && field !== undefined
    );
    setIsFormValid(isValid);
  };


  const handleSaveReport = () => {
    if (!isFormValid) {
      alert("Заполните все поля формы перед сохранением.");
      return;
    }
    editedReport.god = god
    editedReport.k_PRED = k_PRED
    editedReport.kvartal = kvartal
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
      <div className="content_container">
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

        {/* Отобразить поля отчета для редактирования */}
        <h2>Редактирование отчета</h2>
        <div>
          <label>INDGR:</label>
          <input
            type="checkbox"
            name="indgr"
            checked={editedReport.indgr ?? false}
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
            value={editedReport.f_I_O ?? ""}
            onChange={handleReportChange}
          />
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            name="k_NPO"
            value={editedReport.k_NPO ?? ""}
            onChange={handleReportChange}
            className="form-control"
            aria-required="true"
            placeholder="Пусто"
          />
          <label>k_NPO</label>
        </div>
        {/* Добавьте остальные поля для редактирования */}
        <iframe src="/ReportInfoPDFformat.html" width="100%" height="800px" title="Report Info"></iframe>
        {/* Кнопка сохранения отчета */}
        <button onClick={handleSaveReport}>Сохранить</button>
        <button onClick={handleEraseReport}>Очистить</button>
      </div>
    </div>
  );
};

export default UserReportInfo;
