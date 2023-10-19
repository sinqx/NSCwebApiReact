import React from "react";
import axios from "axios";

const ReportTable = ({ report, answers, setAnswers }) => {
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
        [name]: sanitizedValue !== null ? sanitizedValue : undefined,
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
      <table className="iksweb mb-4">
        <tbody>
          <tr>
            <td>
              <strong>Наименование показателя </strong>
            </td>
            <td>
              <strong>Код строки</strong>{" "}
            </td>
            <td>
              <strong>Единицы измерения</strong>
            </td>
            <td>
              <strong>
                {report.p0 === 1
                  ? "Базар/рынок"
                  : report.p0 === 2
                  ? "Торговый центр"
                  : "Место"}{" "}
              </strong>
            </td>
          </tr>
          <tr>
            <td>A</td>
            <td>Б</td>
            <td>В</td>
            <td>{report.p0}</td>
          </tr>
          <tr>
            <td>
              <strong>
                Число торговых мест и торговых объектов (кроме магазинов),
                отведенных под торговлю – всего
              </strong>
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
            <td>
              <strong>
                из них на которых фактически осуществлялась торговля{" "}
              </strong>
            </td>
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
            <td>
              <strong>в том числе: юридическими лицами</strong>
            </td>
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
              <strong>
                хозяйствующими субъектами, имеющими статус физического лица
              </strong>
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
            <td>
              <strong>индивидуальными предпринимателями</strong>
            </td>
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
            <td>
              <strong>Количество магазинов </strong>
            </td>
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
              <strong>
                Торговая площадь, отведенная под торговые объекты индивидуальных
                предпринимателей
              </strong>
            </td>
            <td>07</td>
            <td>м²</td>
            <td>
              {report.p0 === 1 ? (
                "Х"
              ) : (
                <input
                  type="number"
                  name="p7"
                  value={answers.p7}
                  onChange={handleUpdateAnswers}
                  readOnly={report.p0 === 1}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Средняя стоимость 1 места в день</strong>
            </td>
            <td>08</td>
            <td>сомов</td>
            <td>
              {report.p0 === 2 ? (
                "Х"
              ) : (
                <input
                  type="number"
                  name="p8"
                  value={answers.p8}
                  onChange={handleUpdateAnswers}
                  readOnly={report.p0 === 2}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              <strong>
                Общий сбор за пользование торговым местом на рынке (за квартал)
              </strong>
            </td>
            <td>09</td>
            <td>тыс.сомов</td>
            <td>
              {report.p0 === 2 ? (
                "Х"
              ) : (
                <input
                  type="number"
                  name="p9"
                  value={answers.p9}
                  onChange={handleUpdateAnswers}
                  readOnly={report.p0 === 2}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Количество дней работы за квартал</strong>
            </td>
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
  );
};

export default ReportTable;
