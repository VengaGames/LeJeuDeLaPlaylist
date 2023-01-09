import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../service/api";
import './style.css';
import fleche_arriere from './fleche_arriere.png';

const Login = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const getRooms = async () => {
    const res = await API.get("/room");
    if (!res.ok) return console.log(res);
    setRooms(res.data);
  };

  useEffect(() => {
    getRooms();
  }, []);

  const handlesubmit = (e) => {
    e.preventDefault();
    const room = e.target.elements.room.value;
    const name = e.target.elements.name.value;
    navigate(`/game?room=${room}&name=${name}`);
  };
  return (
    <div>

      <a href="/">
        <img className="retour" src={fleche_arriere} alt='icone fleche retour' />
      </a>
      <div className="w-full h-full flex items-center justify-center">

        <div className="join">

          <h1 className="titre-jeu">Le Jeu de la Playlist</h1>

          <form onSubmit={handlesubmit} className="login-form">
            <label className="text" htmlFor="room">Room</label>
            <input placeholder="Name of the room..." autoComplete="off" className="lesinput" required type="text" name="room" />
            <label className="text" htmlFor="name">Pseudo</label>
            <input placeholder="Your Pseudo..." autoComplete="off" className="lesinput" required type="text" name="name" />
            <div className="buttonform">
              <button className="join-button" type="submit">
                JOIN
              </button>
            </div>
          </form>
        </div>
        {rooms.length > 0 ? (
          <div className="mt-4">
            <h1 className="text-lg mb-2">Salles disponibles :</h1>
            <div className="flex flex-col gap-2">
              {rooms.map((room) => (
                <div key={room.room} className="flex gap-2">
                  <div>{room.room}</div>
                  <div>
                    ({room.usersNb} joueur{room.usersNb > 1 ? "s" : ""})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="footer">
        <h3 className="bottom"> Vengaboys © - 2023</h3>
      </div>
    </div>
  );
};

export default Login;
