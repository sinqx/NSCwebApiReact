import React, { useState } from "react";
import axios from "axios";
import ReportTable from "./ReportTable";
import CompanyTable from "./CompanyTable";
import "./UserReportInfo.css";

const UserReportInfo = () => {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [searchGod, setSearchGod] = useState(currentYear.toString());
  const [searchK_PRED, setSearchK_PRED] = useState("");
  const [searchKvaratl, setSearchKvaratl] = useState("");
  const [searchResult, setSearchResult] = useState(false);

  const handleSearch = () => {
    axios
      .get(
        `https://localhost:7100/api/UserReport/getAnswers?god=${searchGod}&kpred=${searchK_PRED}&kvaratl=${searchKvaratl}`
      )
      .then(function (response) {
        console.log(response);
        
        setAnswers(response.data);
        setSearchResult(true); // Результат поиска найден
        setError(null); // Сбросить ошибку
      })
      .catch(function (error) {
        console.log(error);
        setSearchResult(false); // Результат поиска не найден
        setError(error.response.data.detail); // Установить значение ошибки
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
                    maxLength="4" 
                    pattern="\d{4}"  
                  />
                  Номер квартала{" "}
                  <input
                    type="text"
                    placeholder="__"
                    value={searchKvaratl}
                    onChange={(e) => setSearchKvaratl(e.target.value)}
                    maxLength="1" 
                    pattern="\d" 
                  />
                </h5>
                <p className="card-text">
                  Код предприятия:{" "}
                  <input
                    type="text"
                    placeholder="00000000"
                    value={searchK_PRED}
                    onChange={(e) => setSearchK_PRED(e.target.value)}
                    maxLength="8" 
                    pattern="\d{8}"  
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
            <h2>Адрессная часть</h2>
            <CompanyTable
            kpred={searchK_PRED} />
            {/* ... */}
            <br></br>
            <h2>Редактирование отчета</h2>
            <ReportTable           
              answers={answers}
              setAnswers={setAnswers}
            />
            {/* ... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReportInfo;
