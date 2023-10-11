import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserReportInfo.css";

const UserReportInfo = () => {
  const { god, kvaratl, k_PRED } = useParams();
  const [report, setReport] = useState({});
  const [editedReport, setEditedReport] = useState({});
  const [searchGod, setSearchGod] = useState("");
  const [searchKvaratl, setSearchKvaratl] = useState("");
  const [searchK_PRED, setSearchK_PRED] = useState("");

  const handleSearch = () => {
    axios
      .get(
        `https://localhost:7100/api/UserReport/getInfo?god=${searchGod}&kpred=${searchK_PRED}&kvaratl=${searchKvaratl}`
      )
      .then(function (response) {
        setReport(response.data);
        setEditedReport(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleResetReport = () => {
    setEditedReport(report);
  };

  const handleUpdateReport = (updatedReport) => {
    const { name, value, type, checked } = updatedReport.target;
    const newValue = type === "checkbox" ? checked : value;
    // Проверка на ввод знака минус и символа "e"
    if (
      type === "number" &&
      (updatedReport.key === "-" || updatedReport.key === "e")
    ) {
      updatedReport.preventDefault();
      return;
    }
    const sanitizedValue = value === "" ? null : newValue;

    setEditedReport((prevReport) => ({
      ...prevReport,
      [name]: sanitizedValue,
    }));
  };

  const handleSaveReport = () => {
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
      <div className="content_container mb-4">
        <div className="row ">
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">
                  Дата:{" "}
                  <input
                    type="text"
                    placeholder="2023"
                    value={searchGod}
                    onChange={(e) => setSearchGod(e.target.value)}
                  />
                  Номер квартала{" "}
                  <input
                    type="text"
                    placeholder="__   "
                    value={searchKvaratl}
                    onChange={(e) => setSearchKvaratl(e.target.value)}
                  />
                </h5>
                <p className="card-text">
                  Код предприятия:{" "}
                  <input
                    type="text"
                    placeholder="00000000"
                    value={searchK_PRED}
                    onChange={(e) => setSearchK_PRED(e.target.value)}
                  />
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleSearch}>
                Найти
              </button>
            </div>
          </div>
        </div>

        {/* Отобразить поля отчета для редактирования */}
        <h2>Редактирование отчета</h2>
        <table className="iksweb mb-4">
          <tbody>
            <tr>
              <td>Наименование показателя </td>
              <td>Код строки </td>
              <td>Единицы измерения</td>
              <td>
                {report.tiP2 === 1
                  ? "Базар/рынок"
                  : report.tiP2 === 2
                  ? "Торговый центр"
                  : "Место"}{" "}
              </td>
            </tr>
            <tr>
              <td>A</td>
              <td>Б</td>
              <td>В</td>
              <td>{report.tiP2}</td>
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
                />
              </td>
            </tr>
            <tr>
              <td>
                Торговая площадь, отведенная под торговые объекты индивидуальных
                предпринимателей
              </td>
              <td>07</td>
              <td>м²</td>
              <td>
                {report.tiP2 === 1 ? (
                  "Х"
                ) : (
                  <input
                    type="number"
                    name="p7"
                    value={editedReport.p7}
                    onChange={handleUpdateReport}
                    readOnly={report.tiP2 === 1}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>Средняя стоимость 1 места в день</td>
              <td>08</td>
              <td>сомов</td>
              <td>
                {report.tiP2 === 2 ? (
                  "Х"
                ) : (
                  <input
                    type="number"
                    name="p8"
                    value={editedReport.p8}
                    onChange={handleUpdateReport}
                    readOnly={report.tiP2 === 2}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>
                Общий сбор за пользование торговым местом на рынке (за квартал)
              </td>
              <td>09</td>
              <td>тыс.сомов</td>
              <td>
                {report.tiP2 === 2 ? (
                  "Х"
                ) : (
                  <input
                    type="number"
                    name="p9"
                    value={editedReport.p9}
                    onChange={handleUpdateReport}
                    readOnly={report.tiP2 === 2}
                  />
                )}
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
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Кнопка сохранения отчета */}
        <div className="buttons-container">
          <button
            className="btn btn-save"
            onClick={handleSaveReport}
          >
            Сохранить
          </button>
          <button
            className="btn btn-reset"
            onClick={handleResetReport}
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReportInfo;
