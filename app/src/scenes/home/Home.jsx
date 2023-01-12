import React, { useEffect, useState } from "react";
import jeuplaylist from "../asset/jeuplaylist.png";
import { NavLink } from "react-router-dom";
import vengaicon from "../asset/vengaicon.jpeg";

const Home = () => {
  return (
    <div>
      <nav class="p-3 border-gray-700 bg-gray-800">
        <div class="container flex flex-wrap items-center justify-between mx-auto">
          <NavLink href="/" class="flex flex-row items-center">
            <img src={vengaicon} class="h-6 mr-3 sm:h-10" alt="Venga Logo" />
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VengaGAMES</span>
          </NavLink>
        </div>
      </nav>

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
      </div>

      <div className="fixed bottom-0 flex justify-center w-full bg-gray-800 ">
        <h3 className=" text-white"> Vengaboys © - 2023</h3>
      </div>
    </div>
  );
};

export default Home;
