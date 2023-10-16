import React from "react";
import axios from "axios";

const CompanyTable = () => {
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = () => {
    // Выполнить запрос на получение данных о компании
    axios
      .get("https://localhost:7100/api/Company/get?kpred=kpred")
      .then((response) => {
        setCompanyData(response.data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.detail);
      });
  };

  const handleResetCompanyData = () => {
    setCompanyData(companyData);
  };

  const handleUpdateData = (e) => {
    const value = e.target;
    const sanitizedValue = value === "" ? null : newValue;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: sanitizedValue,
    }));
  };

  const handleSaveCompanyData = () => {
    company.k_PRED = report.k_PRED;
    console.log(company);
    console.log(report);
    axios
      .put(`https://localhost:7100/api/UserReport/change`, company, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("Report saved successfully");
        console.log(response);
        console.log(company);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <table class="iksweb mb-4">
        <tbody>
          <tr>
            <td>
              <strong>Наименование предприятия/организации</strong>
            </td>
            <td>
              {" "}
              <input
                type="text"
                name="name"
                value={companyData.name}
                onChange={handleUpdateData}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Вид экономической деятельности</strong>
            </td>
            <td>
              <input
                type="c2"
                name="Expr1"
                value={companyData.Expr1}
                onChange={handleUpdateData}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Есть ли у вас изменения контактных данных</strong>
            </td>
            <td>
              <input
                type="checkbox"
                name="TIP1"
                value={companyData.TIP1}
                onChange={handleUpdateData}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Товарный знак</strong>
            </td>
            <td>
              <input
                type="text"
                name="T_ZN"
                value={companyData.T_ZN}
                onChange={handleUpdateData}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Адрес предприятия</strong>
            </td>
            <td><input
                type="text"
                name="adress"
                value={companyData.adress}
                onChange={handleUpdateData}
              /></td>
          </tr>
          <tr>
            <td>
              <strong>Электронная почта</strong>
            </td>
            <td>С6</td>
          </tr>
          <tr>
            <td>
              <strong>Номер телефона исполнителя</strong>
            </td>
            <td>С7</td>
          </tr>
          <tr>
            <td>
              <strong>Имя исполнителя (ФИО)</strong>
            </td>
            <td>С8</td>
          </tr>
        </tbody>
      </table>
      {/* Кнопка сохранения отчета */}
      <div className="buttons-container">
        <button className="btn btn-save" onClick={handleSaveCompanyData}>
          Сохранить
        </button>
        <button className="btn btn-reset" onClick={handleResetCompanyData}>
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default CompanyTable;
