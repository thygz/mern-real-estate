import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserFailure,
    signOutUserSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ScrollToTop from '../components/ScrollToTop';

export default function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({
        username: '' || currentUser.username,
        email: '' || currentUser.email,
        password: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();
    // firebase storage
    // allow read;
    // allow write: if
    // request.resource.size < 2 * 1024 * 1024 &&
    // request.resource.contentType.matches('image/.*')

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
                setFileUploadError(false);
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validationErrors = {};
            if (!formData.username.trim()) {
                validationErrors.username = 'Username is required';
            }
            if (!formData.email.trim()) {
                validationErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                validationErrors.email = 'Invalid email address';
            }
            if (!formData.password.trim()) {
                validationErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                validationErrors.password =
                    'Password must be at least 8 characters long';
            }
            setValidationErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                dispatch(updateUserStart());
                const res = await fetch(`/api/user/update/${currentUser._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (data.success === false) {
                    dispatch(updateUserFailure(data.message));
                    return;
                }
                dispatch(updateUserSuccess(data));
                setUpdateSuccess(true);
                toast.success('Profile updated successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
            }
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));
        } catch (error) {
            dispatch(signOutUserFailure(data.message));
        }
    };

    return (
        <div className="max-w-xl mx-auto px-3 pt-10 pb-14 min-h-[75vh]">
            <ScrollToTop />
            <div className="p-3 bg-inherit rounded-sm">
                <h1 className="text-2xl font-semibold mt-5 mb-7 text-slate-800 text-center">
                    Edit Your Profile
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-10 md:gap-3"
                >
                    <div className="w-full flex flex-col justify-center items-center">
                        <input
                            onChange={(e) => setFile(e.target.files[0])}
                            type="file"
                            ref={fileRef}
                            hidden
                            accept="image/*"
                        />
                        <div
                            className="flex flex-col justify-center items-center gap-3 cursor-pointer text-slate-500 hover:text-cyan-700"
                            onClick={() => fileRef.current.click()}
                        >
                            <img
                                src={formData.avatar || currentUser.avatar}
                                alt="profile"
                                className="rounded-full h-28 w-28 object-cover self-center mt-2 md:mt-0"
                            />
                            <p className="capitalize text-sm underline">
                                Upload a new photo
                            </p>
                        </div>
                        <p className="text-xs mt-3 mx-auto text-center max-w-[8.5rem]">
                            {fileUploadError ? (
                                <span className="text-red-700">
                                    Error image upload (Image must be less than
                                    2mb)
                                </span>
                            ) : filePerc > 0 && filePerc < 100 ? (
                                <span className="text-slate-700">
                                    Uploading {filePerc}%
                                </span>
                            ) : filePerc === 100 ? (
                                <span className="text-green-700">
                                    Image successfully uploaded!
                                </span>
                            ) : (
                                ''
                            )}
                        </p>
                    </div>
                    <div className="flex flex-col flex-1 gap-5">
                        <div className="flex flex-col flex-1">
                            <p className="text-xs font-semibold p-[0.15rem] text-gray-600">
                                Username
                            </p>
                            <input
                                type="text"
                                placeholder="username"
                                defaultValue={currentUser.username}
                                id="username"
                                className={`border bg-inherit px-3 py-2 rounded-sm text-sm ${
                                    validationErrors.username
                                        ? 'border-red-600 focus:outline-none'
                                        : 'border-gray-300 focus:outline-gray-400'
                                }`}
                                onChange={handleChange}
                            />
                            {validationErrors.username && (
                                <span className="text-xs text-red-600 font-semibold px-1">
                                    {validationErrors.username}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-xs font-semibold p-[0.15rem] text-gray-600">
                                Email
                            </p>
                            <input
                                type="email"
                                placeholder="email"
                                defaultValue={currentUser.email}
                                id="email"
                                className={`border bg-inherit px-3 py-2 rounded-sm text-sm ${
                                    validationErrors.email
                                        ? 'border-red-600 focus:outline-none'
                                        : 'border-gray-300 focus:outline-gray-400'
                                }`}
                                onChange={handleChange}
                            />
                            {validationErrors.email && (
                                <span className="text-xs text-red-600 font-semibold px-1">
                                    {validationErrors.email}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-xs font-semibold p-[0.15rem] text-gray-600">
                                Password
                            </p>
                            <input
                                type="password"
                                id="password"
                                className={`border bg-inherit px-3 py-2 rounded-sm text-sm ${
                                    validationErrors.password
                                        ? 'border-red-600 focus:outline-none'
                                        : 'border-gray-300 focus:outline-gray-400'
                                }`}
                                onChange={handleChange}
                            />
                            {validationErrors.password && (
                                <span className="text-xs text-red-600 font-semibold px-1">
                                    {validationErrors.password}
                                </span>
                            )}
                        </div>
                        <button
                            disabled={loading}
                            className="bg-cyan-700 text-white p-2 mt-5 rounded-sm font-semibold hover:opacity-95 disabled:opacity-80"
                        >
                            {loading ? 'Loading...' : 'Save Changes'}
                        </button>
                        <div className="flex justify-between mt-2 text-sm">
                            <span
                                onClick={handleDeleteUser}
                                className="text-red-700 cursor-pointer"
                            >
                                Delete account
                            </span>
                            <span
                                onClick={handleSignOut}
                                className="text-red-700 cursor-pointer"
                            >
                                Sign out
                            </span>
                        </div>
                    </div>
                </form>
                <p className="text-red-700 mt-5 text-xs">
                    {error ? error : ''}
                </p>
            </div>
        </div>
    );
}
