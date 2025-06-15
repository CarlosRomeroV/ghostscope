import { useContext, useState } from 'react';
import { UserContext } from '../managers/UserContext';
import { supabase } from '../managers/supabaseClient';
import bcrypt from 'bcryptjs';

const AVATAR_OPTIONS = [
  'https://i.postimg.cc/59CNJQzx/pfp1.png',
  'https://i.postimg.cc/ZR2tfV73/pfp2.png',
  'https://i.postimg.cc/59CNJQzx/pfp1.png',
];

const AccountMenu = ({ onBack }: { onBack: () => void }) => {
  const { user, setUser } = useContext(UserContext);
  // Login/Register
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  // Cambiar nombre/foto
  const [newName, setNewName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  // Cambiar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Registro
  const handleRegister = async () => {
    setRegisterError(''); setRegisterSuccess(''); setLoading(true);
    try {
      const { data: existing } = await supabase.from('users').select('id').eq('username', registerData.username).single();
      if (existing) { setRegisterError('El usuario ya existe.'); setLoading(false); return; }
      const hash = await bcrypt.hash(registerData.password, 10);
      const { error } = await supabase.from('users').insert({ username: registerData.username, password_hash: hash, avatar_url: selectedAvatar });
      if (error) setRegisterError('Error al registrar usuario.');
      else { setRegisterSuccess('¡Usuario registrado! Ahora puedes iniciar sesión.'); setRegisterData({ username: '', password: '' }); setSelectedAvatar(AVATAR_OPTIONS[0]); }
    } catch { setRegisterError('Error inesperado.'); }
    setLoading(false);
  };
  // Login
  const handleLogin = async () => {
    setLoginError(''); setLoading(true);
    try {
      const { data: userRow } = await supabase.from('users').select('*').eq('username', loginData.username).single();
      if (!userRow) { setLoginError('Usuario no encontrado.'); setLoading(false); return; }
      const match = await bcrypt.compare(loginData.password, userRow.password_hash);
      if (!match) { setLoginError('Contraseña incorrecta.'); setLoading(false); return; }
      setUser({ name: userRow.username, avatar: userRow.avatar_url });
      setShowLogin(false); setLoginData({ username: '', password: '' });
    } catch { setLoginError('Error inesperado.'); }
    setLoading(false);
  };
  // Cambiar nombre
  const handleChangeName = async () => {
    setNameError(''); setNameSuccess('');
    if (!user) return;
    if (!newName.trim()) { setNameError('El nombre no puede estar vacío.'); return; }
    if (newName === user.name) { setNameError('El nombre es igual al actual.'); return; }
    const { error } = await supabase.from('users').update({ username: newName }).eq('username', user.name);
    if (error) setNameError('Error al cambiar el nombre.');
    else { setUser({ ...user, name: newName }); setNameSuccess('Nombre actualizado.'); }
  };
  // Cambiar foto
  const handleChangeAvatar = async (url: string) => {
    setAvatarSuccess('');
    if (!user) return;
    const { error } = await supabase.from('users').update({ avatar_url: url }).eq('username', user.name);
    if (!error) { setUser({ ...user, avatar: url }); setAvatarSuccess('Foto actualizada.'); }
  };
  // Cambiar contraseña
  const handleChangePassword = async () => {
    setPasswordError(''); setPasswordSuccess('');
    if (!user) return;
    if (!oldPassword || !newPassword) { setPasswordError('Rellena ambos campos.'); return; }
    // Buscar usuario
    const { data: userRow } = await supabase.from('users').select('*').eq('username', user.name).single();
    if (!userRow) { setPasswordError('Usuario no encontrado.'); return; }
    const match = await bcrypt.compare(oldPassword, userRow.password_hash);
    if (!match) { setPasswordError('Contraseña actual incorrecta.'); return; }
    const hash = await bcrypt.hash(newPassword, 10);
    const { error } = await supabase.from('users').update({ password_hash: hash }).eq('username', user.name);
    if (error) setPasswordError('Error al cambiar la contraseña.');
    else { setPasswordSuccess('Contraseña actualizada.'); setOldPassword(''); setNewPassword(''); }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8">
      <h2 className="text-3xl font-bold mb-6 text-green-200 drop-shadow-lg font-[MedievalSharp] tracking-wide">
        Cuenta
      </h2>
      {!user && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button className="w-full py-4 rounded-xl text-xl font-mono shadow-lg border-2 bg-green-900 text-white border-green-400 cursor-pointer" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
          <button className="w-full py-4 rounded-xl text-xl font-mono shadow-lg border-2 bg-blue-900 text-white border-blue-400 cursor-pointer" onClick={() => setShowRegister(true)}>Registrarse</button>
        </div>
      )}
      {user && (
        <>
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full border-4 border-green-400 bg-black object-cover mb-2" />
            <div className="text-lg text-green-200 font-mono">{user.name}</div>
            <div className="w-full flex flex-col gap-2 mt-4">
              <label className="text-green-300 font-mono">Cambiar nombre de usuario:</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none" />
              <button onClick={handleChangeName} className="mt-1 px-4 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono">Actualizar nombre</button>
              {nameError && <div className="text-red-400 text-sm">{nameError}</div>}
              {nameSuccess && <div className="text-green-400 text-sm">{nameSuccess}</div>}
            </div>
            <div className="w-full flex flex-col gap-2 mt-4">
              <label className="text-green-300 font-mono">Cambiar foto de perfil:</label>
              <div className="flex gap-4">
                {AVATAR_OPTIONS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx+1}`}
                    className={`w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-200 ${user.avatar === url ? 'border-green-500 scale-110 ring-4 ring-green-300 bg-green-100' : 'border-gray-600 opacity-60 hover:opacity-100'}`}
                    onClick={() => handleChangeAvatar(url)}
                  />
                ))}
              </div>
              {avatarSuccess && <div className="text-green-400 text-sm">{avatarSuccess}</div>}
            </div>
            <div className="w-full flex flex-col gap-2 mt-4">
              <label className="text-green-300 font-mono">Cambiar contraseña:</label>
              <input type="password" placeholder="Contraseña actual" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none" />
              <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none" />
              <button onClick={handleChangePassword} className="mt-1 px-4 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono">Actualizar contraseña</button>
              {passwordError && <div className="text-red-400 text-sm">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-400 text-sm">{passwordSuccess}</div>}
            </div>
          </div>
        </>
      )}
      <button
        onClick={onBack}
        className="mt-8 px-8 py-3 rounded-2xl bg-black/70 text-[#4fff7b] border-2 border-[#4fff7b] hover:bg-black/80 text-2xl font-bold font-[Ichigayamincho] shadow"
        style={{ fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif' }}
      >
        Volver
      </button>
      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 shadow-xl min-w-[320px]">
            <h2 className="text-2xl text-green-200 mb-4 font-mono">Iniciar sesión</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
              <input type="text" placeholder="Nombre de usuario" className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} autoFocus />
              <input type="password" placeholder="Contraseña" className="px-4 py-2 rounded bg-gray-800 text-white border border-green-400 focus:outline-none" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
              {loginError && <div className="text-red-400 text-sm">{loginError}</div>}
              <button type="submit" className="mt-2 px-6 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
            </form>
            <button className="mt-4 px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-mono w-full" onClick={() => setShowLogin(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {/* Register modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-8 shadow-xl min-w-[320px]">
            <h2 className="text-2xl text-blue-200 mb-4 font-mono">Registro</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
              <input type="text" placeholder="Nombre de usuario" className="px-4 py-2 rounded bg-gray-800 text-white border border-blue-400 focus:outline-none" value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} autoFocus />
              <input type="password" placeholder="Contraseña" className="px-4 py-2 rounded bg-gray-800 text-white border border-blue-400 focus:outline-none" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
              <div className="flex flex-col items-center gap-2">
                <div className="text-blue-200 text-lg mb-1">Elige tu foto de perfil:</div>
                <div className="flex gap-4">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <img key={idx} src={url} alt={`Avatar ${idx+1}`} className={`w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-200 ${selectedAvatar === url ? 'border-blue-500 scale-110 ring-4 ring-blue-300 bg-blue-100' : 'border-gray-600 opacity-60 hover:opacity-100'}`} onClick={() => setSelectedAvatar(url)} />
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
    </div>
  );
};

export default AccountMenu; 