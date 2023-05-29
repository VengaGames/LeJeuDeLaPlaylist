import React from "react";
import jeuplaylist from "/assets/playlist.jpg";
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
      <div className="flex flex-row flex-wrap pt-10 gap-10 justify-center items-center mb-10">
        <div className="flex flex-col justify-center items-center">
          <div className="justify-center bg-[#1e1f29] rounded-lg p-5">
            <img className="object-cover w-56 h-56 rounded-lg" src={jeuplaylist} alt="jeu de la playlist" />
            <p className="pt-5 text-center font-semibold whitespace-nowrap dark:text-white">Jeu de la Playlist</p>
          </div>
          <NavLink
            className="mt-10 bg-[#FDFDFD] rounded-3xl text-center w-56 flex flex-row justify-center items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
            to="/login"
            end>
            <p className="p-3 font-semibold">Jouer</p>
            <img className="w-5 h-4" src={manette} alt="manette logo" />
          </NavLink>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="justify-center bg-[#1e1f29] rounded-lg p-5">
            <img className="object-cover w-56 h-56 rounded-lg" src={uno} alt="jeu de la playlist" />
            <p className="pt-5 text-center font-semibold whitespace-nowrap dark:text-white">UNO</p>
          </div>
          <a
            className="mt-10 bg-[#FDFDFD] rounded-3xl text-center w-56 flex flex-row justify-center items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
            href="https://uno-lh06.onrender.com/"
            rel="noopener noreferrer">
            <p className="p-3 font-semibold">Jouer</p>
            <img className="w-5 h-4" src={manette} alt="manette logo" />
          </a>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="justify-center bg-[#1e1f29] rounded-lg p-5">
            <img className="object-cover w-56 h-56 rounded-lg" src={blindtest} alt="jeu de la playlist" />
            <p className="pt-5 text-center font-semibold whitespace-nowrap dark:text-white">BlindTest</p>
          </div>
          <a
            className="mt-10 bg-[#FDFDFD] rounded-3xl text-center w-56 flex flex-row justify-center items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
            href="https://vengablindtest.onrender.com/"
            rel="noopener noreferrer">
            <p className="p-3 font-semibold">Jouer</p>
            <img className="w-5 h-4" src={manette} alt="manette logo" />
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
