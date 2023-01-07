import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../../service/api";
import { DebounceInput } from "react-debounce-input";
let socket;

const Login = () => {
  const [dataSearch, setDataSearch] = useState([]);
  const qRef = useRef();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const query = new URLSearchParams(window.location.search);

  useEffect(() => {
    const room = query.get("room");
    const name = query.get("name");
    socket = io(import.meta.env.VITE_BACKEND_ENDPOINT, {
      transports: ["websocket"],
      upgrade: false,
    });
    socket.emit("join", { name, room }, () => {});
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  const getResults = async () => {
    if (!qRef.current.value) return setDataSearch([]);
    setLoading(true);
    const res = await API.get(`/youtube/search?q=${qRef.current.value}`);
    if (!res.ok) return console.log(res);
    setDataSearch(res.data.items);
    setLoading(false);
  };

  const decodeEntities = (s) => {
    const el = document.createElement("p");
    el.innerHTML = s;
    const str = el.textContent;
    return str;
  };

  return (
    <div className="w-full h-full m-2 flex items-center justify-center">
      <div className="flex items-center flex-col w-fit">
        <h1 className="mb-4">Jeu</h1>
        {selectedVideo ? (
          <div className="flex flex-col items-center">
            <ConnectedPlayers players={users} />
            <div>Musique sélectionnée</div>
            <div>Titre : {selectedVideo.snippet.title} </div>
            <button className="p-1 border border-black m-2" onClick={() => setSelectedVideo(null)}>
              Revenir à la recherche
            </button>
          </div>
        ) : (
          <>
            <div className="flex w-full gap-3">
              <ConnectedPlayers players={users} />
              <div className="flex flex-col items-center">
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getResults();
                    }
                  }}
                  className="bg-gray-200 !ring-0 !outline-none"
                  type="text"
                  ref={qRef}
                />
                <button disabled={loading} className="p-1 border border-black m-2" onClick={() => getResults()}>
                  Rechercher
                </button>
              </div>
            </div>
            <div className="">
              {dataSearch.map((item) => (
                <div onClick={() => setSelectedVideo(item)} className="flex py-2 gap-2 bg-white max-w-[300px] cursor-pointer border hover:bg-green-100" key={item.id.videoId}>
                  <img className="max-w-[50px]" src={item.snippet.thumbnails.medium.url} alt="" />
                  <p>{decodeEntities(item.snippet.title)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ConnectedPlayers = ({ players }) => {
  return (
    <div className="flex flex-col h-fit p-3 border border-black rounded-lg items-center">
      <div className="">Joueurs connectés</div>
      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <div key={player.id} className="flex gap-2">
            <div>{player.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
