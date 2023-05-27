import React from "react";
import jeuplaylist from "/assets/jeuplaylist.png";
import uno from "/assets/unologo.png";
import { NavLink } from "react-router-dom";
import vengaicon from "/assets/vengaicon.jpeg";
import manette from "/assets/manette.svg";
import blindtest from "/assets/blindtest.jpeg";

const Home = () => {
  return (
    <div>
      <nav className="p-3 border-gray-700 bg-[#1e1f29]">
        <div className="container flex flex-wrap items-center justify-center mx-auto">
          <div className="flex flex-row justify-center items-center">
            <img src={vengaicon} className="h-6 mr-3 sm:h-10 " alt="Venga Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VengaGAMES</span>
          </div>
        </div>
      </nav>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center">
          <div className="mt-10 justify-center mr-10 bg-[#1e1f29] rounded-lg">
            <div className="w-fit h-fit">
              <img className="object-cover w-56 h-56 rounded-t-lg " src={jeuplaylist} alt="jeu de la playlist" />
            </div>

            <p className="mt-2 text-center font-semibold whitespace-nowrap dark:text-white">Jeu de la Playlist</p>
          </div>
          <NavLink className="" to="/login" end>
            <div className="bg-[#FDFDFD] mt-10 rounded-3xl text-center w-56 flex flex-row justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
              {" "}
              <p className=" mt-3 mb-3 font-semibold">Jouer</p> <img className="w-5 h-4 ml-2" src={manette} alt="manette logo" />
            </div>
          </NavLink>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-col mt-10 justify-center bg-[#1e1f29] rounded-lg ">
            <div className="w-fit h-fit">
              <img className="object-cover w-56 h-56 rounded-t-lg " src={uno} alt="uno logo" />
            </div>

            <p className="mt-2 text-center font-semibold whitespace-nowrap dark:text-white">UNO</p>
          </div>
          <a href="https://uno-lh06.onrender.com/" rel="noopener noreferrer">
            <div className="bg-[#FDFDFD] mt-10 rounded-3xl text-center w-56 flex flex-row justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
              {" "}
              <p className=" mt-3 mb-3 font-semibold">Jouer</p> <img className="w-5 h-4 ml-2" src={manette} alt="manette logo" />
            </div>
          </a>
        </div>
        <div className="flex flex-col justify-center ml-10">
          <div className="flex flex-col mt-10 justify-center bg-[#1e1f29] rounded-lg ">
            <div className="w-fit h-fit">
              <img className="object-cover w-56 h-56 rounded-t-lg " src={blindtest} alt="blindtest logo" />
            </div>

            <p className="mt-2 text-center font-semibold whitespace-nowrap dark:text-white">BlindTest</p>
          </div>
          <a href="https://vengablindtest.onrender.com/" rel="noopener noreferrer">
            <div className="bg-[#FDFDFD] mt-10 rounded-3xl text-center w-56 flex flex-row justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
              {" "}
              <p className=" mt-3 mb-3 font-semibold">Jouer</p> <img className="w-5 h-4 ml-2" src={manette} alt="manette logo" />
            </div>
          </a>
        </div>
      </div>

      <div className="fixed bottom-0 flex justify-center w-full bg-[#1e1f29]">
        <h3 className="text-white">Vengaboys © - 2023</h3>
      </div>
    </div>
  );
};

export default Home;
