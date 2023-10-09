import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserReportInfo = () => {
  const { god, kvartal, k_PRED } = useParams();
  const [report, setReport] = useState({});
  const [editedReport, setEditedReport] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        `https://localhost:7100/api/UserReport/getInfo?god=${god}&kpred=${k_PRED}&kvartal=${kvartal}`
      )
      .then(function (response) {
        setReport(response.data);
        setEditedReport(response.data);

        // Проверяем, что iframe загружен и доступен
        if (iframeRef.current && iframeRef.current.contentWindow) {
          // Отправляем данные в iframe
          console.log(response.data)
          iframeRef.current.contentWindow.postMessage(response.data, "*");
        }
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
    editedReport.god = god;
    editedReport.k_PRED = k_PRED;
    editedReport.kvartal = kvartal;
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

        <iframe
          src={`/ReportInfoRus.html?report=${encodeURIComponent(
            JSON.stringify(report)
          )}`}
          width="1150px"
          height="810px"
          title="Report Info"
        ></iframe>
        {/* Кнопка сохранения отчета */}
        <button onClick={handleSaveReport}>Сохранить</button>
        <button onClick={handleEraseReport}>Очистить</button>
      </div>
    </div>
  );
};

export default UserReportInfo;
