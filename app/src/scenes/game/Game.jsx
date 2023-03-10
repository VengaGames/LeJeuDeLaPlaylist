import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../../service/api";
import { MdOutlineAudiotrack, MdOutlineAdminPanelSettings } from "react-icons/md";
import Confetti from "react-confetti";
import { HiArrowLeft } from "react-icons/hi";
import useSocket from "../../hooks/socket";
import { RiLoader2Fill } from "react-icons/ri";
import ReactPlayer from "react-player/youtube";

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const { socket, isConnected } = useSocket();
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
  const [counter, setCounter] = useState(0);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isConnected) return;
    const { name, room } = roomData;
    socket.emit("join", { name, room }, () => {
      getSettings();
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("all-videos-selected", (confirmation) => {
      setAllVideosSelected(confirmation);
      setLoading(true);
      if (!confirmation) {
        setSelectedVideo(null);
        setDataSearch([]);
        setLoading(false);
        setCounter(0);
        return;
      }
      socket.emit("next-music", null);
    });
    socket.on("the-next-music", (music) => {
      setCurrentPlayingMusic(music);
      setCounter((p) => p + 1);
    });
    socket.on("audio-for-everyone-confirm", (confirmation) => {
      setAudioForEveryone(confirmation);
    });
    return () => {
      socket.off("roomData");
      socket.off("all-videos-selected");
      socket.off("the-next-music");
      socket.off("audio-for-everyone-confirm");
      socket.emit("leave-room");
    };
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;
    if (selectedVideo) {
      socket.emit("select-video", selectedVideo);
    } else {
      socket.emit("select-video", null);
    }
  }, [selectedVideo, isConnected]);

  const getResults = async () => {
    if (!qRef.current.value) return setDataSearch([]);
    setLoading(true);
    const res = await API.get(`/youtube/search?q=${qRef.current.value}`);
    if (!res.ok) return console.log(res);
    setDataSearch(res.data);
    setLoading(false);
  };

  const getSettings = async () => {
    const res = await API.get(`/room/settings/${roomData.room}`);
    if (!res.ok) return console.log(res);
    setAudioForEveryone(res.data.audioEveryone);
  };

  const decodeEntities = (s) => {
    const el = document.createElement("p");
    el.innerHTML = s;
    const str = el.textContent;
    return str;
  };

  if (!isConnected)
    return (
      <div className="flex flex-col items-center gap-5">
        <div>Connexion en cours...</div>
        <RiLoader2Fill className="animate-spin text-7xl" />
      </div>
    );

  if (allVideosSelected)
    return (
      <Wrapper roomData={roomData} audioForEveryone={audioForEveryone} users={users}>
        <Confetti width={window.innerWidth} height={window.innerHeight} />
        <div className="flex items-center flex-col w-fit">
          <div className="flex flex-col items-center">
            <div>Toutes les musiques ont ??t?? s??lectionn??es</div>
            <div>Jeu en cours</div>
            <div>
              Musique {counter}/{users.length}
            </div>
            {loading && <div>Chargement de l'audio en cours...</div>}
            {curentPlayingMusic ? (
              <div className="flex flex-col items-center">
                {audioForEveryone ? (
                  <ReactPlayer width={0} height={0} onReady={() => setLoading(false)} playing={true} url={`https://www.youtube.com/watch?v=${curentPlayingMusic.videoId}`} />
                ) : null}
                {users.find((user) => user.id === socket.id)?.admin ? (
                  <>
                    {!audioForEveryone ? (
                      <ReactPlayer width={0} height={0} onReady={() => setLoading(false)} playing={true} url={`https://www.youtube.com/watch?v=${curentPlayingMusic.videoId}`} />
                    ) : null}
                    <button
                      className="p-1 border border-black m-2"
                      onClick={() => {
                        socket.emit("next-music", null);
                        setLoading(true);
                      }}>
                      Passer ?? la musique suivante
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Wrapper>
    );

  return (
    <Wrapper roomData={roomData} audioForEveryone={audioForEveryone} users={users}>
      {selectedVideo ? (
        <div className="flex flex-col items-center">
          <div>Musique s??lectionn??e</div>
          <div>Titre : {decodeEntities(selectedVideo.title)} </div>
          <button className="p-1 border border-black m-2" onClick={() => setSelectedVideo(null)}>
            Revenir ?? la recherche
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center w-full gap-3">
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
              <div onClick={() => setSelectedVideo(item)} className="flex py-2 gap-2 bg-white max-w-[300px] cursor-pointer border hover:bg-green-100" key={item.videoId}>
                <img className="max-w-[50px] max-h-[48px]" src={item.thumbnail} alt="" />
                <p>{decodeEntities(item.title)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Wrapper>
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
              {player.admin && <MdOutlineAdminPanelSettings className="text-red-500" />}
              <div className={`${player.videoSelected ? "text-green-500" : "text-black"}`}>{player.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-black">{players.length} joueurs connect??s</div>
      )}
    </div>
  );
};

const Wrapper = ({ children, roomData, audioForEveryone, users }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3">
      <div className="flex mb-4 flex-row justify-between items-center w-full">
        <NavLink to="/login" end>
          <HiArrowLeft className="transition min-w-[32px] min-h-[32px] ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300" alt="icone fleche retour" />
        </NavLink>

        <h1 className="flex items-center">
          Room : {roomData.room} {audioForEveryone && <MdOutlineAudiotrack />}
        </h1>
        <div />
      </div>
      <ConnectedPlayers players={users} />
      <div className="flex items-center flex-col w-full p-3">{children}</div>
    </div>
  );
};

export default Login;
