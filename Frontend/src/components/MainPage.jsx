import React from "react";
import "./style.scss";
import CarList from "./CarList";

const MainPage = () => {
  return (
    <div className="main-page">
      <div className="main-page__header">
        <h1>🚗 Car & Engine Management</h1>
        <p>
          Gestionează cu ușurință mașinile și motoarele din parcul tău auto.
          Creează, editează și organizează datele tehnice ale vehiculelor.
        </p>
      </div>

      <div className="main-page__content">
        <div className="main-page__section">
          <CarList />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
