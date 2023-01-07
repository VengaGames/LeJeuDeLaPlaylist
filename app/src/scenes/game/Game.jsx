import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../../service/api";
let socket;

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const [dataSearch, setDataSearch] = useState([]);
  const qRef = useRef();
  const roomData = {
    name: query.get("name"),
    room: query.get("room"),
  };
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [allVideosSelected, setAllVideosSelected] = useState(false);
  const [curentPlayingMusic, setCurrentPlayingMusic] = useState(null);

  useEffect(() => {
    const { name, room } = roomData;
    socket = io(import.meta.env.VITE_BACKEND_ENDPOINT, {
      transports: ["websocket"],
      upgrade: false,
    });
    socket.emit("join", { name, room }, () => {});
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("all-videos-selected", (confirmation) => {
      setAllVideosSelected(confirmation);
      if (!confirmation) setSelectedVideo(null);
      socket.emit("next-music", null);
    });
    socket.on("the-next-music", (music) => {
      setCurrentPlayingMusic(music);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      socket.emit("select-video", selectedVideo);
    } else {
      socket.emit("select-video", null);
    }
  }, [selectedVideo]);

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

  if (allVideosSelected)
    return (
      <div className="w-full h-full m-2 flex items-center justify-center">
        <div className="flex items-center flex-col w-fit">
          <h1 className="mb-4">Room : {roomData.room}</h1>
          <div className="flex flex-col items-center">
            <ConnectedPlayers players={users} />
            <div>Toutes les musiques ont été sélectionnées</div>
            <div>Jeu en cours</div>
            {users.find((user) => user.id === socket.id)?.admin && (
              <>
                {curentPlayingMusic && (
                  <div className="flex flex-col items-center">
                    <iframe
                      className="w-O h-0"
                      src={`https://www.youtube.com/embed/${curentPlayingMusic.id.videoId}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen></iframe>
                    <button className="p-1 border border-black m-2" onClick={() => socket.emit("next-music", null)}>
                      Passer à la musique suivante
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full h-full m-2 flex items-center justify-center">
      <div className="flex items-center flex-col w-fit">
        <h1 className="mb-4">Room : {roomData.room}</h1>
        {selectedVideo ? (
          <div className="flex flex-col items-center">
            <ConnectedPlayers players={users} />
            <div>Musique sélectionnée</div>
            <div>Titre : {decodeEntities(selectedVideo.snippet.title)} </div>
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
                {loading && <div>Chargement...</div>}
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
  const [showPlayers, setShowPlayers] = useState(true);
  return (
    <div onClick={() => setShowPlayers((prev) => !prev)} className="flex flex-col h-fit p-3 border border-black rounded-lg items-center">
      <div className="">Joueurs</div>
      {showPlayers ? (
        <div className="flex flex-col gap-2">
          {players.map((player) => (
            <div key={player.id} className="flex gap-2">
              {player.admin && <div className="text-red-500">A</div>}
              <div className={`${player.videoSelected ? "text-green-500" : "text-black"}`}>{player.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-black">{players.length} joueurs connectés</div>
      )}
    </div>
  );
};

export default Login;
