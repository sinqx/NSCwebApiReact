import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyTable = ({ kpred }) => {
  const [companyData, setCompanyData] = useState({});
  const [error, setError] = useState(null);

  const fetchCompanyData = () => {
    // Выполнить запрос на получение данных о компании
    axios
      .get(`https://localhost:7100/api/Company/get/${kpred}`)
      .then((response) => {
        setCompanyData(response.data);
        setError(null);
        console.log(response.data);
      })
      .catch((error) => {
        setError(error.response.data.detail);
        console.log(error);
      });
  };

  const handleResetCompanyData = () => {
    setCompanyData({});
  };

  const handleUpdateData = (e) => {
    const { value, name, checked, type } = e.target;
    const sanitizedValue =
      type === "checkbox"
        ? checked
          ? 1
          : 0
        : value.trim() === ""
        ? ""
        : value;

    setCompanyData((prevData) => ({
      ...prevData,
      [name]: prevData.hasOwnProperty(name) ? sanitizedValue : "",
    }));
  };

  const handleSaveCompanyData = () => {
    console.log(companyData);
    axios
      .put(`https://localhost:7100/api/Company/update/${kpred}`, companyData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("Company data saved successfully");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>{" "}
        </div>
      )}
      <table className="iksweb mb-4">
        <tbody>
          <tr>
            <td>
              <strong>Наименование предприятия/организации</strong>
            </td>
            <td>{companyData.name}</td>
          </tr>
          <tr>
            <td>
              <strong>Вид экономической деятельности</strong>
            </td>
            <td>{companyData.expr1}</td>
          </tr>
          <tr>
            <td>
              <strong>Есть ли у вас изменения контактных данных</strong>
            </td>
            <td>
              <input
                type="checkbox"
                name="tiP1"
                checked={companyData.tiP1 === 1}
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
                name="t_ZN"
                value={companyData.t_ZN  || ""}
                onChange={handleUpdateData}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Адрес предприятия</strong>
            </td>
            <td>
              <input
                type="text"
                name="adress"
                value={companyData.adress  || ""}
                onChange={handleUpdateData}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Электронная почта</strong>
            </td>
            <td><input
                type="text"
                name="email"
                value={companyData.email  || ""}
                onChange={handleUpdateData}
              /></td>
          </tr>
          <tr>
            <td>
              <strong>Номер телефона исполнителя</strong>
            </td>
            <td><input
                type="number"
                name="t_ON"
                value={companyData.t_ON  || ""}
                onChange={handleUpdateData}
              /></td>
          </tr>
          <tr>
            <td>
              <strong>Имя исполнителя (ФИО)</strong>  
            </td>
            <td><input
                type="text"
                name="f_I_O"
                value={companyData.f_I_O  || ""}
                onChange={handleUpdateData}
              /></td>
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
