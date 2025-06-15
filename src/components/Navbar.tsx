import React, { useContext, useState } from 'react';
import { UserContext } from '../managers/UserContext';
import defaultAvatar from '../images/gamelogo.png';
import { supabase } from '../managers/supabaseClient';
import bcrypt from 'bcryptjs';

const AVATAR_OPTIONS = [
  'https://i.postimg.cc/59CNJQzx/pfp1.png',
  'https://i.postimg.cc/ZR2tfV73/pfp2.png',
  'https://i.postimg.cc/59CNJQzx/pfp1.png',
];

const Navbar: React.FC = () => {
  const { user, setUser, setShowLogin, setShowRegister, showLogin, showRegister } = useContext(UserContext);
  // Estado local para los formularios
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  // Registro
  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');
    setLoading(true);
    try {
      // Verifica si el usuario ya existe
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', registerData.username)
        .single();
      if (existing) {
        setRegisterError('El usuario ya existe.');
        setLoading(false);
        return;
      }
      // Hashea la contraseña
      const hash = await bcrypt.hash(registerData.password, 10);
      // Inserta el usuario con avatar_url
      const { error } = await supabase
        .from('users')
        .insert({ username: registerData.username, password_hash: hash, avatar_url: selectedAvatar });
      if (error) {
        setRegisterError('Error al registrar usuario.');
      } else {
        setRegisterSuccess('¡Usuario registrado! Ahora puedes iniciar sesión.');
        setRegisterData({ username: '', password: '' });
        setSelectedAvatar(AVATAR_OPTIONS[0]);
      }
    } catch (e) {
      setRegisterError('Error inesperado.');
    }
    setLoading(false);
  };

  // Login
  const handleLogin = async () => {
    setLoginError('');
    setLoading(true);
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('*')
        .eq('username', loginData.username)
        .single();
      if (!userRow) {
        setLoginError('Usuario no encontrado.');
        setLoading(false);
        return;
      }
      const match = await bcrypt.compare(loginData.password, userRow.password_hash);
      if (!match) {
        setLoginError('Contraseña incorrecta.');
        setLoading(false);
        return;
      }
      setUser({ name: userRow.username, avatar: userRow.avatar_url || defaultAvatar });
      setShowLogin(false);
      setLoginData({ username: '', password: '' });
    } catch (e) {
      setLoginError('Error inesperado.');
    }
    setLoading(false);
  };

  return (
    <>
      <nav className="w-full h-20 bg-black/80 border-b border-green-700 flex items-center px-8 fixed top-0 left-0 z-50 shadow-lg">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={user?.avatar || defaultAvatar}
            alt="avatar"
            className="w-12 h-12 rounded-full border-2 border-green-400 bg-black object-cover"
          />
          <span className="text-xl font-bold text-green-200 font-mono">
            {user ? user.name : 'Invitado'}
          </span>
        </div>
        <div className="flex gap-4">
          {!user && (
            <>
              <button
                className="px-5 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono shadow"
                onClick={() => setShowLogin(true)}
              >
                Iniciar sesión
              </button>
              <button
                className="px-5 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white font-mono shadow"
                onClick={() => setShowRegister(true)}
              >
                Registrar
              </button>
            </>
          )}
        </div>
      </nav>
      {/* Modal de login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 shadow-xl min-w-[320px]">
            <h2 className="text-2xl text-green-200 mb-4 font-mono">Iniciar sesión</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
              <input
                type="text"
                placeholder="Nombre de usuario"
                className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none"
                value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                autoFocus
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              />
              {loginError && <div className="text-red-400 text-sm">{loginError}</div>}
              <button type="submit" className="mt-2 px-6 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
            </form>
            <button className="mt-4 px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-mono w-full" onClick={() => setShowLogin(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {/* Modal de registro */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-8 shadow-xl min-w-[320px]">
            <h2 className="text-2xl text-blue-200 mb-4 font-mono">Registro</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
              <input
                type="text"
                placeholder="Nombre de usuario"
                className="px-4 py-2 rounded bg-gray-800 text-white border border-blue-400 focus:outline-none"
                value={registerData.username}
                onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                autoFocus
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="px-4 py-2 rounded bg-gray-800 text-white border border-blue-400 focus:outline-none"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              />
              {/* Selector de avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-blue-200 text-lg mb-1">Elige tu foto de perfil:</div>
                <div className="flex gap-4">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt={`Avatar ${idx+1}`}
                        className={`w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-200 ${selectedAvatar === url ? 'border-blue-500 scale-110 ring-4 ring-blue-300 bg-blue-100' : 'border-gray-600 opacity-60 hover:opacity-100'}`}
                        onClick={() => setSelectedAvatar(url)}
                        style={{ boxShadow: selectedAvatar === url ? '0 0 16px 4px #60a5fa, 0 0 0 8px #dbeafe' : 'none', background: selectedAvatar === url ? '#dbeafe' : 'none', zIndex: selectedAvatar === url ? 2 : 1 }}
                      />
                      {selectedAvatar === url && (
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          borderRadius: '9999px',
                          border: '4px solid #2563eb',
                          boxShadow: '0 0 24px 8px #60a5fa',
                          pointerEvents: 'none',
                          zIndex: 3
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {registerError && <div className="text-red-400 text-sm">{registerError}</div>}
              {registerSuccess && <div className="text-green-400 text-sm">{registerSuccess}</div>}
              <button type="submit" className="mt-2 px-6 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white font-mono" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
            </form>
            <button className="mt-4 px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-mono w-full" onClick={() => setShowRegister(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 