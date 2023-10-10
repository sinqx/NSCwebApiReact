import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserReportInfo.css";

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

  const handleIframeLoad = (event) => {
    const iframe = event.target;
    const iframeWindow = iframe.contentWindow;
    iframeWindow.handleUpdateReport = handleUpdateReport;
  };

  const handleUpdateReport = (updatedReport) => {
    const { name, value, type, checked } = updatedReport.target;
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
        {/* <iframe
          src={`/ReportInfoRus.html?report=${encodeURIComponent(
            JSON.stringify(report)
          )}`}
          width="1150px"
          height="810px"
          title="Report Info"
          sandbox="allow-scripts"
          onLoad={handleIframeLoad}
        ></iframe> */}
        <table class="iksweb">
          <tbody>
            <tr>
              <td>Наименование показателя </td>
              <td>Код строки </td>
              <td>Единицы измерения</td>
              <td>Количество </td>
            </tr>
            <tr>
              <td>A</td>
              <td>Б</td>
              <td>В</td>
              <td>P0</td>
            </tr>
            <tr>
              <td>
                Число торговых мест и торговых объектов (кроме магазинов),
                отведенных под торговлю –всего{" "}
              </td>
              <td>01</td>
              <td>единиц </td>
              <td>
                <input
                  type="number"
                  name="p1"
                  value={editedReport.p1}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>из них на которых фактически осуществлялась торговля </td>
              <td>02</td>
              <td>единиц </td>
              <td>
                <input
                  type="number"
                  name="p2"
                  value={editedReport.p2}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>в том числе: юридическими лицами</td>
              <td>03</td>
              <td>единиц </td>
              <td>
                <input
                  type="number"
                  name="p3"
                  value={editedReport.p3}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>
                хозяйствующими субъектами, имеющими статус физического лица
              </td>
              <td>04</td>
              <td>единиц </td>
              <td>
                <input
                  type="number"
                  name="p4"
                  value={editedReport.p4}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>индивидуальными предпринимателями</td>
              <td>05</td>
              <td>единиц </td>
              <td>
                <input
                  type="number"
                  name="p5"
                  value={editedReport.p5}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>Количество магазинов </td>
              <td>06</td>
              <td>единиц </td>
              <td>
                <input
                  type="number"
                  name="p6"
                  value={editedReport.p6}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>
                Торговая площадь, отведенная под торговые объекты индивидуальных
                предпринимателей
              </td>
              <td>07</td>
              <td> м²</td>
              <td>
                <input
                  type="number"
                  name="p7"
                  value={editedReport.p7}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>Средняя стоимость 1 места в день </td>
              <td>08</td>
              <td>сомов </td>
              <td>
                <input
                  type="number"
                  name="p8"
                  value={editedReport.p8}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>
                Общий сбор за пользование торговым местом на рынке (за квартал)
              </td>
              <td>09</td>
              <td>тыс.сомов</td>
              <td>
                <input
                  type="number"
                  name="p9"
                  value={editedReport.p9}
                  onChange={handleUpdateReport}
                  pattern="[0-9]*"
                />
              </td>
            </tr>
            <tr>
              <td>Количество дней работы за квартал</td>
              <td>10</td>
              <td>дней </td>
              <td>
                <input
                  type="number"
                  name="p10"
                  value={editedReport.p10}
                  onChange={handleUpdateReport}
                  inputMode ="numeric"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Кнопка сохранения отчета */}
        <button onClick={handleSaveReport}>Сохранить</button>
        <button onClick={handleEraseReport}>Очистить</button>
      </div>
    </div>
  );
};

export default UserReportInfo;
