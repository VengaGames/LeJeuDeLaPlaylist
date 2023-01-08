import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../../service/api";
import { MdOutlineAudiotrack } from "react-icons/md";
let socket;

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const roomData = {
    name: query.get("name"),
    room: query.get("room"),
  };
  const [dataSearch, setDataSearch] = useState([]);
  const qRef = useRef();
  const [loading, setLoading] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [allVideosSelected, setAllVideosSelected] = useState(false);
  const [curentPlayingMusic, setCurrentPlayingMusic] = useState(null);
  const [audioForEveryone, setAudioForEveryone] = useState(false);

  const [users, setUsers] = useState([]);

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
      if (!confirmation) {
        setSelectedVideo(null);
        setDataSearch([]);
      }
      socket.emit("next-music", null);
    });
    socket.on("the-next-music", (music) => {
      setCurrentPlayingMusic(music);
    });
    socket.on("audio-for-everyone-confirm", (confirmation) => {
      setAudioForEveryone(confirmation);
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
            {curentPlayingMusic ? (
              <div className="flex flex-col items-center">
                {audioForEveryone ? (
                  <iframe
                    className="w-O h-0"
                    src={`https://www.youtube.com/embed/${curentPlayingMusic.id.videoId}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
                ) : null}
                {users.find((user) => user.id === socket.id)?.admin ? (
                  <>
                    {!audioForEveryone ? (
                      <iframe
                        className="w-O h-0"
                        src={`https://www.youtube.com/embed/${curentPlayingMusic.id.videoId}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen></iframe>
                    ) : null}
                    <button className="p-1 border border-black m-2" onClick={() => socket.emit("next-music", null)}>
                      Passer à la musique suivante
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full h-full m-2 flex items-center justify-center">
      <div className="flex items-center flex-col w-fit">
        <h1 className="mb-4 flex items-center">
          Room : {roomData.room} {audioForEveryone && <MdOutlineAudiotrack />}{" "}
        </h1>
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
                {users.find((user) => user.id === socket.id)?.admin ? (
                  <div className="flex gap-1 mb-2">
                    <input type="checkbox" checked={audioForEveryone} onChange={(e) => socket.emit("audio-for-everyone", e.target.checked)} />
                    <label htmlFor="audioForEveryone">Audio pour tout le monde ?</label>
                  </div>
                ) : null}
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
  players.sort((a, b) => {
    if (a.videoSelected && !b.videoSelected) return -1;
    if (!a.videoSelected && b.videoSelected) return 1;
    return 0;
  });
  players.sort((a, b) => {
    a.name.localeCompare(b.name);
  });
  players.sort((a, b) => {
    if (a.admin && !b.admin) return -1;
    if (!a.admin && b.admin) return 1;
    return 0;
  });
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
