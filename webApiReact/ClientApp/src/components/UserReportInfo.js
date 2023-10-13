import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserReportInfo.css";

const UserReportInfo = () => {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState(null);
  const [report, setReport] = useState({});
  const [answers, setAnswers] = useState({});
  const { god, kvaratl, k_PRED } = useParams();
  const [searchGod, setSearchGod] = useState(currentYear.toString());
  const [searchK_PRED, setSearchK_PRED] = useState("");
  const [searchKvaratl, setSearchKvaratl] = useState("");
  const [searchResult, setSearchResult] = useState(false);

  const handleSearch = () => {
    axios
      .get(
        `https://localhost:7100/api/UserReport/getInfo?god=${searchGod}&kpred=${searchK_PRED}&kvaratl=${searchKvaratl}`
      )
      .then(function (response) {
        console.log(response);
        const fetchedReport = response.data;
        const initialAnswers = {};

        for (let i = 1; i <= 10; i++) {
          const propName = `p${i}`;
          initialAnswers[propName] = fetchedReport[propName.toLowerCase()];
        }

        setReport(fetchedReport);
        setAnswers(initialAnswers);
        setSearchResult(true); // Результат поиска найден
        setError(null); // Сбросить ошибку
     
      })
      .catch(function (error) {
        console.log(error);
        setSearchResult(false); // Результат поиска не найден
        setError(error.response.data.detail); // Установить значение ошибки
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleResetReport = () => {
    setAnswers(report);
  };

  const handleUpdateAnswers = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    // Проверка на ввод знака минус и символа "e"
    if (type === "number" && (e.key === "-" || e.key === "e")) {
      e.preventDefault();
      return;
    }
    const sanitizedValue = value === "" ? null : newValue;

    if (name.startsWith("p")) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [name]: sanitizedValue,
      }));
    }
  };

  const handleSaveReport = () => {
    answers.GOD = report.god;
    answers.k_PRED = report.k_PRED;
    answers.Kvaratl = report.kvaratl;
    console.log(answers);
    console.log(report);
    axios
      .put(`https://localhost:7100/api/UserReport/change`, answers, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("Report saved successfully");
        console.log(response);
        console.log(answers);
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
                    placeholder="____"
                    value={searchGod}
                    onChange={(e) => setSearchGod(e.target.value)}
                  />
                  Номер квартала{" "}
                  <input
                    type="text"
                    placeholder="__"
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

        {/* Отобразить ошибку, если есть */}
        {error && (
          <div>
            <p>{error}</p>{" "}
          </div>
        )}

        {/* Отобразить поля отчета для редактирования */}
        {searchResult && (
          <div>
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
                      value={answers.p1}
                      onChange={handleUpdateAnswers}
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
                      value={answers.p2}
                      onChange={handleUpdateAnswers}
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
                      value={answers.p3}
                      onChange={handleUpdateAnswers}
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
                      value={answers.p4}
                      onChange={handleUpdateAnswers}
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
                      value={answers.p5}
                      onChange={handleUpdateAnswers}
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
                      value={answers.p6}
                      onChange={handleUpdateAnswers}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Торговая площадь, отведенная под торговые объекты
                    индивидуальных предпринимателей
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
                        value={answers.p7}
                        onChange={handleUpdateAnswers}
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
                        value={answers.p8}
                        onChange={handleUpdateAnswers}
                        readOnly={report.tiP2 === 2}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    Общий сбор за пользование торговым местом на рынке (за
                    квартал)
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
                        value={answers.p9}
                        onChange={handleUpdateAnswers}
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
                      value={answers.p10}
                      onChange={handleUpdateAnswers}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Кнопка сохранения отчета */}
            <div className="buttons-container">
              <button className="btn btn-save" onClick={handleSaveReport}>
                Сохранить
              </button>
              <button className="btn btn-reset" onClick={handleResetReport}>
                Сбросить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReportInfo;
