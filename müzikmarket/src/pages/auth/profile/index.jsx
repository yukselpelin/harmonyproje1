import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { handleSignOut, handleUser } from '@/redux/slice/basket';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';

const Profile = () => {
  const user = useSelector((state) => state.basket.user);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(user?.birth || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [address, setAddress] = useState(user?.address || '');
  const dispatch = useDispatch();
  const handleUpdate = async () => {
    const data = {
      name,
      email,
      password,
      phone,
      birth: birthDate,
      gender,
      address,
    };

    const res = await fetch('http://localhost:8080/users/profileupdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      const data = await res.json();
      dispatch(handleUser(data));
      swal({
        title: 'Güncelleme başarılı',
        icon: 'success',
        buttons: 'Teşekkürler',
      });
    }
  };

  return (
    <>
      <Header />
      {user ? (
        <>
          <div className="max-w-md mx-auto mt-8 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700">Ad:</label>
                  <input
                    className="bg-gray-100 px-4 py-2 w-full rounded-lg"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Eposta:</label>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    {email}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Telefon numarası:
                  </label>
                  <input
                    className="bg-gray-100 px-4 py-2 w-full rounded-lg"
                    type={'text'}
                    pattern="\d*"
                    maxLength={'11'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700">Şifre:</label>
                  <input
                    className="bg-gray-100 px-4 py-2 w-full rounded-lg"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Doğum Tarihi:</label>
                  <input
                    className="bg-gray-100 px-4 py-2 w-full rounded-lg"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Cinsiyet:</label>
                  <div className="flex">
                    <label className="mr-4">
                      <input
                        type="radio"
                        value="Male"
                        checked={gender === 'Male'}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <span className="ml-2">Erkek</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="Female"
                        checked={gender === 'Female'}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <span className="ml-2">Kadın</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Adres:</label>
                  <textarea
                    className="bg-gray-100 px-4 py-2 w-full rounded-lg"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className=" flex flex-row items-center justify-center text-center mt-8 gap-7">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdate}
              >
                Kaydet
              </button>
              <button
                onClick={() => {
                  dispatch(handleSignOut());
                  window.location.href = '/';
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute -translate-x-1/2 top-1/2 left-1/2 translate-y-1/2">
          <h1>Lütfen giriş yapın</h1>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Profile;
