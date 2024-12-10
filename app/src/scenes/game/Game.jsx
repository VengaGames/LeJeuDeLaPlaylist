import arrow from '/assets/rightArrow.svg';
import vengaicon from '/assets/vengaicon.jpeg';
import React, { useEffect, useRef, useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { MdOutlineAdminPanelSettings, MdOutlineAudiotrack } from 'react-icons/md';
import { RiLoader2Fill } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import useSocket from '../../hooks/socket';
import API from '../../service/api';
import { Music } from './MusicPlayer';

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const { socket, isConnected } = useSocket();
  const roomData = { name: query.get('name'), room: query.get('room') };
  const qRef = useRef();

  const [dataSearch, setDataSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const [roomSettings, setRoomSettings] = useState({});

  useEffect(() => {
    if (!isConnected) return;
    const { name, room } = roomData;
    if (!name || !room) return (window.location.href = 'https://vengahomepage.onrender.com/login?game=playlist');
    socket.emit('join', { name, room }, () => getSettings());
    socket.on('roomData', ({ users }) => setUsers(users));

    socket.on('all-videos-selected', () => {
      setRoomSettings((p) => ({ ...p, allSelected: true }));
      socket.emit('next-music');
    });
    socket.on('the-next-music', (music) => {
      setRoomSettings((p) => ({ ...p, currentMusic: music, counter: (p?.counter || 0) + 1 }));
      if (!music) {
        setSelectedVideo(null);
        setDataSearch([]);
        setLoading(false);
        setRoomSettings((p) => ({ ...p, counter: 0, allSelected: false }));
      }
    });
    socket.on('audio-for-everyone-confirm', (confirmation) => setRoomSettings((p) => ({
      ...p,
      audioEveryone: confirmation
    })));

    return () => socket.emit('leave-room');
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;
    socket.emit('select-video', selectedVideo);
  }, [selectedVideo, isConnected]);

  const getResults = async () => {
    if (!qRef.current.value) return setDataSearch([]);
    setLoading(true);
    const res = await API.get(`/youtube/search?q=${qRef.current.value}`);
    setLoading(false);
    setDataSearch(res.data);
  };

  const getSettings = async () => {
    const res = await API.get(`/room/settings/${roomData.room}`);
    setRoomSettings((p) => ({ ...p, audioEveryone: res.data.audioEveryone }));
  };

  const decodeEntities = (s) => {
    const el = document.createElement('p');
    el.innerHTML = s;
    const str = el.textContent;
    return str;
  };

  if (!isConnected)
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="text-white">Connexion en cours...</div>
        <RiLoader2Fill className="animate-spin text-7xl text-white" />
      </div>
    );

  if (roomSettings.allSelected)
    return (
      <Wrapper roomData={roomData} audioForEveryone={roomSettings.audioEveryone} users={users}>
        <div className="flex items-center flex-col w-fit">
          <div className="flex flex-col items-center">
            <div className="text-white">Toutes les musiques ont été sélectionnées</div>
            <div className="text-white">Jeu en cours</div>
            <div className="text-white">
              Musique {roomSettings.counter}/{users.length}
            </div>
            {loading && <div className="text-white">Chargement de l'audio en cours...</div>}
            {roomSettings.currentMusic ? (
              <div className="flex flex-col items-center">
                {roomSettings.audioEveryone ?
                  <Music setLoading={setLoading} YTurl={roomSettings.currentMusic.id} /> : null}
                {users.find((user) => user.id === socket.id)?.admin ? (
                  <>
                    {!roomSettings.audioEveryone ?
                      <Music setLoading={setLoading} YTurl={roomSettings.currentMusic.id} /> : null}
                    <button
                      className="p-1 bg-[#FDFDFD] mt-10 rounded-3xl text-center w-56 flex flex-row justify-center items-center"
                      onClick={() => {
                        socket.emit('next-music');
                        setLoading(true);
                      }}>
                      Passer à la musique suivante
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
    <Wrapper roomData={roomData} audioForEveryone={roomSettings.audioEveryone} users={users}>
      {selectedVideo ? (
        <div className="flex flex-col items-center">
          <div className="text-white">Musique sélectionnée</div>
          <div className="text-white">Titre : {decodeEntities(selectedVideo.title)} </div>
          <button
            className="p-1 bg-[#FDFDFD] mt-10 rounded-3xl text-center w-56 flex flex-row justify-center items-center font-semibold "
            onClick={() => setSelectedVideo(null)}>
            Revenir à la recherche
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center w-full gap-3">
            <div className="flex flex-col items-center mb-4">
              {users.find((user) => user.id === socket.id)?.admin ? (
                <div className="flex gap-1 mb-2">
                  <input type="checkbox" checked={roomSettings.audioEveryone || false}
                         onChange={(e) => socket.emit('audio-for-everyone', e.target.checked)} />
                  <label className="text-white" htmlFor="audioForEveryone">
                    Audio pour tout le monde ?
                  </label>
                </div>
              ) : null}
              <div className="flex flex-row bg-[#242531] rounded-3xl w-96 h-12  ">
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) getResults();
                  }}
                  placeholder="Pssst, donne moi le titre !"
                  className="bg-[#242531] !ring-0 !outline-none rounded-3xl text-white w-96 h-12 ml-10"
                  type="text"
                  ref={qRef}
                />
                <button disabled={loading} className="p-3 rounded-full text-white bg-[#00FECC]"
                        onClick={() => getResults()}>
                  <img src={arrow} alt="arrow right" />
                </button>
              </div>
              {loading && <div className="text-white">Chargement...</div>}
            </div>
          </div>
          <div className="">
            {dataSearch.map((item) => (
              <div onClick={() => setSelectedVideo(item)}
                   className="flex py-2 gap-2 bg-[#242531] max-w-[300px] cursor-pointer hover:bg-[#00FECC] rounded-xl mb-2"
                   key={item.id}>
                <img className="max-w-[50px] max-h-[48px] rounded-lg ml-2 " src={item.thumbnail} alt="" />
                <p className="text-white mr-2 ml-4">{decodeEntities(item.title)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Wrapper>
  );
};

const ConnectedPlayers = ({ players }) => {
  return (
    <div className="flex flex-col h-fit p-3 border border-white rounded-lg items-center">
      <div className="text-white">Joueurs</div>
      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <div key={player.id} className="flex gap-2">
            {player.admin && <MdOutlineAdminPanelSettings className="text-red-500" />}
            <div className={`${player.videoSelected ? 'text-green-500' : 'text-white'}`}>{player.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Wrapper = ({ children, roomData, audioForEveryone, users }) => {
  return (
    <div>
      <nav className="p-3 border-gray-700 bg-[#242531]">
        <div className="container flex flex-wrap items-center justify-center mx-auto">
          <div className="flex flex-row justify-center items-center">
            <img src={vengaicon} className="h-6 mr-3 sm:h-10 " alt="Venga Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VengaGAMES</span>
          </div>
        </div>
      </nav>
      <div className="w-full h-full flex flex-col items-center justify-center p-3">
        <div className="flex mb-4 flex-row justify-between items-center w-full">
          <NavLink to="https://vengahomepage.onrender.com/login?game=playlist" end>
            <HiArrowLeft
              className="text-white transition min-w-[32px] min-h-[32px] ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              alt="icone fleche retour"
            />
          </NavLink>

          <h1 className="flex items-center text-white">
            Room : {roomData.room} {audioForEveryone && <MdOutlineAudiotrack />}
          </h1>
          <div />
        </div>
        <ConnectedPlayers players={users} />
        <div className="flex items-center flex-col w-full p-3">{children}</div>
      </div>
    </div>
  );
};

export default Login;
