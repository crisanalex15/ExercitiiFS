import React from "react";
import { Routes, Route } from "react-router-dom";
import "./style.scss";
import CarList from "./CarList";
import EngineList from "./EngineList";
import Header from "./Header";
import MotorcycleList from "./MotorcycleList";

const MainPage = () => {
  return (
    <>
      <Header />
      <div className="main-page">
        <div className="main-page__content">
          <div className="main-page__section">
            <Routes>
              <Route path="/" element={<CarList />} />
              <Route path="/motociclete" element={<MotorcycleList />} />
              <Route path="/engines" element={<EngineList />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
