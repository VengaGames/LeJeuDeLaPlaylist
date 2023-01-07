import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    const room = e.target.elements.room.value;
    const name = e.target.elements.name.value;
    console.log(room, name);
    navigate(`/game?room=${room}&name=${name}`);
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-fit flex flex-col items-center m-5 border p-3 border-black rounded-md">
        <h1 className="text-lg mb-2">Rejoindre une salle</h1>
        <form onSubmit={handlesubmit} className="flex gap-4 flex-col items-center">
          <label htmlFor="room">Salle</label>
          <input autoComplete="off" className="bg-gray-100 !ring-0 !outline-none" required type="text" name="room" />
          <label htmlFor="name">Nom</label>
          <input autoComplete="off" className="bg-gray-100 !ring-0 !outline-none" required type="text" name="name" />
          <button className="border border-black p-2" type="submit">
            Rejoindre
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
