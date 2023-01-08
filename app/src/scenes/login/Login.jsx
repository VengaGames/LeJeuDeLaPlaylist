import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../service/api";

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
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-fit flex flex-col items-center m-5 border p-3 border-black rounded-md">
        <h1 className="text-lg mb-2">Rejoindre une salle</h1>
        <form onSubmit={handlesubmit} className="flex gap-4 flex-col items-center">
          <label htmlFor="room">Salle</label>
          <input autoComplete="off" className="bg-gray-200 !ring-0 !outline-none" required type="text" name="room" />
          <label htmlFor="name">Nom</label>
          <input autoComplete="off" className="bg-gray-200 !ring-0 !outline-none" required type="text" name="name" />
          <button className="border border-black p-2" type="submit">
            Rejoindre
          </button>
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
  );
};

export default Login;
