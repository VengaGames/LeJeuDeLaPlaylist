import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jeuplaylist from "../asset/jeuplaylist.png";
import indev from "../asset/indev.png";
import endev from "../asset/endev.png";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="flex flex-row justify-center">
        <h1 className="mt-5 flex font-bold  text-3xl  bg-white justify-center rounded-lg w-fit"> VengaGames</h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="mt-10 justify-center">
          <NavLink className="flex justify-center" to="/login" end>
            <img
              className=" w-6/12 h-8/10 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ..."
              src={jeuplaylist}
              alt="jeu de la playlist"
            />
          </NavLink>
        </div>
        <div className="mt-10 justify-center">
          <NavLink className="flex justify-center" to="/login" end>
            <img
              className=" w-6/12 h-8/10 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ..."
              src={jeuplaylist}
              alt="jeu de la playlist"
            />
          </NavLink>
        </div>
      </div>

      <div className="fixed bottom-0 flex justify-center w-full">
        <h3> Vengaboys © - 2023</h3>
      </div>
    </div>
  );
};

export default Home;
