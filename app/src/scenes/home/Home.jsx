import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './homestyle.css';
import jeuplaylist from './jeuplaylist.png';


const Home = () => {

    return (
        <div>
            <div className="top">
                <h1 className="title">VengaGames</h1>
            </div>

            <div className="presentoir">
                <div className="cardgame">
                    <a href="/login">
                        <img className="playlistimage" src={jeuplaylist} alt='jeu de la playlist' />
                    </a>
                </div>
                <div className="cardgame">

                    <h1>Prochain jeu ?</h1>

                </div>
            </div>


            <div className="footer">
                <h3 className="bottom"> Vengaboys © - 2023</h3>
            </div>
        </div>
    );
};

export default Home;
