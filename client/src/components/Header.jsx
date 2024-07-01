import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import usedCarsTraxxLogo from '../assets/usedCarsTraxxLogo.png';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { FaCircleUser } from 'react-icons/fa6';
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserFailure,
    signOutUserSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [toggleProfile, setToggleProfile] = useState(false);
    const [toggleLoginSignup, setToggleLoginSignup] = useState(false);
    const dispatch = useDispatch();

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
    // bg-slate-100
    return (
        <header className="bg-slate-100 shadow-md sticky top-0 z-30">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-2 h-[54px]">
                <div
                    className={`flex justify-center items-center gap-1 ${
                        toggleMenu ? 'hidden' : 'visible'
                    }`}
                >
                    <Link to="/">
                        <img
                            className="w-36 md:w-40"
                            src={usedCarsTraxxLogo}
                            alt="logo"
                        />
                        {/* <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">UsedCars</span>
                        <span className="text-slate-700">Traxx</span>
                    </h1> */}
                    </Link>
                </div>
                <div className="flex justify-center items-center gap-10">
                    <div
                        className={`flex flex-col-reverse lg:flex-row justify-end lg:justify-center items-start lg:items-center gap-3 lg:gap-10 fixed lg:static w-[260px] lg:w-[100%] top-0 bottom-0 bg-slate-100 px-3 py-10 lg:p-0 z-30 transition-all duration-150 ease-in ${
                            toggleMenu ? 'right-0' : 'right-[-260px]'
                        }`}
                    >
                        <div className="lg:hidden">
                            {currentUser ? (
                                <div className="pt-4 pb-3 flex flex-col flex-1">
                                    <div className="flex justify-center items-center gap-3 mb-3 pl-5 pr-12 whitespace-nowrap">
                                        <img
                                            src={currentUser.avatar}
                                            alt="profile"
                                            className="rounded-full h-[1.7rem] w-[1.7rem] object-cover"
                                        />
                                        <p className="text-cyan-900 font-bold text-base truncate max-w-[8.5rem]">
                                            Welcome {currentUser.username}!
                                        </p>
                                    </div>
                                    <div className="h-[1px] w-full bg-slate-400"></div>
                                    <ul
                                        className="flex flex-col text-sm font-semibold mt-2"
                                        onClick={() => setToggleMenu(false)}
                                    >
                                        <Link to="/profile">
                                            <li className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px]">
                                                Edit Profile
                                            </li>
                                        </Link>
                                        <Link to="/create-listing">
                                            <li className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px]">
                                                Sell Your Car
                                            </li>
                                        </Link>
                                        <Link to="/show-listing">
                                            <li className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px]">
                                                Show Listings
                                            </li>
                                        </Link>
                                        <li
                                            className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px] cursor-pointer"
                                            onClick={handleDeleteUser}
                                        >
                                            Delete Account
                                        </li>
                                        <Link to="/sign-in">
                                            <li
                                                className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px] cursor-pointer"
                                                onClick={handleSignOut}
                                            >
                                                Log out
                                            </li>
                                        </Link>
                                    </ul>
                                </div>
                            ) : (
                                <ul
                                    className="flex flex-col text-sm font-semibold gap-3 w-full px-1 mt-5"
                                    onClick={() => setToggleMenu(false)}
                                >
                                    <Link to="/sign-in">
                                        <li className="text-white py-2 px-24 bg-cyan-700 hover:opacity-90 duration-300 rounded-sm">
                                            Login
                                        </li>
                                    </Link>
                                    <Link to="/sign-up">
                                        <li className="text-gray-500 hover:text-gray-400 duration-300 py-[0.42rem] px-[5.35rem] bg-white border-gray-500 border-[1px] rounded-sm">
                                            Sign Up
                                        </li>
                                    </Link>
                                </ul>
                            )}
                        </div>
                        <ul
                            className="gap-4 lg:gap-10 capitalize font-semibold lg:text-center flex flex-col lg:flex-row text-sm pl-5 lg:pl-0 mt-2 lg:mt-0"
                            onClick={() => setToggleMenu(false)}
                        >
                            <Link to="/">
                                <li className="inline text-cyan-800 hover:text-cyan-500 duration-300">
                                    Home
                                </li>
                            </Link>
                            <Link to="/about">
                                <li className="inline text-cyan-800 hover:text-cyan-500 duration-300">
                                    About
                                </li>
                            </Link>
                            <Link>
                                <li className="inline text-cyan-800 hover:text-cyan-500 duration-300">
                                    Buy Car
                                </li>
                            </Link>
                            <Link>
                                <li className="inline text-cyan-800 hover:text-cyan-500 duration-300">
                                    Sell Car
                                </li>
                            </Link>
                        </ul>
                        {/* <form
                            onSubmit={handleSubmit}
                            className="bg-white py-3 px-3 rounded-sm flex items-center w-full lg:w-80 xl:w-96 mt-2 lg:mt-0"
                        >
                            <input
                                type="text"
                                placeholder="Search brand, price and more"
                                className="bg-transparent focus:outline-none w-full lg:w-80 xl:w-96 text-xs placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button>
                                <FaSearch className="text-slate-600" />
                            </button>
                        </form>
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white py-3 px-3 rounded-sm flex items-center w-full lg:w-80 xl:w-96 mt-2 lg:mt-0"
                        >
                            <input
                                type="text"
                                placeholder="Search brand, price and more"
                                className="bg-transparent focus:outline-none w-full lg:w-80 xl:w-96 text-xs placeholder-gray-500"
                                value={modelSearch}
                                onChange={(e) => setModelSearch(e.target.value)}
                            />
                            <button>
                                <FaSearch className="text-slate-600" />
                            </button>
                        </form> */}
                        <div
                            onClick={() => setToggleMenu(false)}
                            className="w-full flex justify-center items-center lg:hidden"
                        >
                            <Link to="/">
                                <img
                                    className="w-40"
                                    src={usedCarsTraxxLogo}
                                    alt="logo"
                                />
                            </Link>
                        </div>
                        <RiCloseLine
                            onClick={() => setToggleMenu(false)}
                            className="text-2xl text-cyan-800 absolute top-4 right-4 lg:hidden cursor-pointer"
                        />
                    </div>
                    <div className={`${toggleMenu ? 'hidden' : 'visible'}`}>
                        {currentUser ? (
                            <div
                                className="hidden lg:flex justify-center items-center text-cyan-800 hover:text-cyan-600 duration-300 text-sm font-semibold tracking-wide bg-white px-2 gap-2 rounded-full border-[1px] border-gray-300 relative whitespace-nowrap cursor-pointer z-20 h-[2.15rem]"
                                onMouseEnter={() => setToggleProfile(true)}
                                onMouseLeave={() => setToggleProfile(false)}
                            >
                                <RiMenu3Line className="text-4xl" />
                                {/* <FaCircleUser className="text-lg" /> */}
                                <img
                                    src={currentUser.avatar}
                                    alt="profile"
                                    className="rounded-full h-[1.2rem] w-[1.2rem] object-cover"
                                />
                                {/* hidden group-hover:block hover:block */}
                                <div
                                    className={`absolute top-[-15px] right-2 ${
                                        toggleProfile ? 'block' : 'hidden'
                                    }`}
                                >
                                    <div className="pt-14">
                                        <div className="absolute w-4 h-4 top-12 right-3 bg-white border-l-[2px] border-t-[2px] rotate-45"></div>
                                    </div>
                                    <div className="bg-white pt-4 pb-3 border-2 rounded-md cursor-default">
                                        <div className="mb-3 pl-5 pr-16">
                                            <p className="text-cyan-900 font-bold text-base truncate max-w-[9rem]">
                                                Welcome {currentUser.username}!
                                            </p>
                                        </div>
                                        <div className="h-[1px] w-full bg-slate-400"></div>
                                        <ul
                                            className="flex flex-col text-sm font-semibold"
                                            onClick={() =>
                                                setToggleProfile(false)
                                            }
                                        >
                                            <Link to="/profile">
                                                <li className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px]">
                                                    Edit Profile
                                                </li>
                                            </Link>
                                            <Link to="/create-listing">
                                                <li className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px]">
                                                    Sell Your Car
                                                </li>
                                            </Link>
                                            <Link to="/show-listing">
                                                <li className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px]">
                                                    Show Listings
                                                </li>
                                            </Link>
                                            <li
                                                className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px] cursor-pointer"
                                                onClick={handleDeleteUser}
                                            >
                                                Delete Account
                                            </li>
                                            <Link to="sign-in">
                                                <li
                                                    className="text-cyan-800 hover:text-cyan-500 duration-300 py-2 pl-5 pr-12 border-b-[1px] cursor-pointer"
                                                    onClick={handleSignOut}
                                                >
                                                    Log out
                                                </li>
                                            </Link>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div
                                    className="hidden lg:flex justify-center items-center text-cyan-800 hover:text-cyan-600 duration-300 text-sm font-semibold tracking-wide bg-white p-2 gap-2 rounded-full border-[1px] border-gray-300 relative whitespace-nowrap cursor-pointer"
                                    onMouseEnter={() =>
                                        setToggleLoginSignup(true)
                                    }
                                    onMouseLeave={() =>
                                        setToggleLoginSignup(false)
                                    }
                                >
                                    <RiMenu3Line className="text-lg" />
                                    <FaCircleUser className="text-lg" />

                                    <div
                                        className={`absolute top-[-15px] right-2 ${
                                            toggleLoginSignup
                                                ? 'block'
                                                : 'hidden'
                                        }`}
                                    >
                                        <div className="pt-14">
                                            <div className="absolute w-4 h-4 top-12 right-3 bg-white border-l-[2px] border-t-[2px] rotate-45"></div>
                                        </div>
                                        <div className="bg-white border-2 p-3 rounded-md">
                                            <ul
                                                className="flex text-sm font-semibold gap-2"
                                                onClick={() =>
                                                    setToggleLoginSignup(false)
                                                }
                                            >
                                                <Link to="/sign-in">
                                                    <li className="text-white py-2 px-6 bg-cyan-700 hover:opacity-90 duration-300 rounded-sm">
                                                        Login
                                                    </li>
                                                </Link>
                                                <Link to="/sign-up">
                                                    <li className="text-gray-500 hover:text-gray-400 duration-300 py-[0.46rem] px-4 bg-white border-gray-500 border-[1px] rounded-sm">
                                                        Sign Up
                                                    </li>
                                                </Link>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* <button className="bg-red-600 text-white text-xs lg:text-sm py-2 px-3 lg:px-4 hover:opacity-90 tracking-wide rounded">
                                    Login
                                </button> */}
                            </div>
                        )}
                    </div>
                    <div className="hidden">
                        {toggleMenu
                            ? (document.body.style.overflow = 'hidden')
                            : (document.body.style.overflow = 'visible')}
                    </div>
                </div>
                <div className="lg:hidden">
                    {currentUser ? (
                        <div
                            className={`flex lg:hidden justify-center items-center text-cyan-800 hover:text-cyan-600 duration-300 text-sm font-semibold tracking-wide bg-white py-[0.4rem] px-2 gap-2 rounded-full border-[1px] border-gray-300 relative whitespace-nowrap cursor-pointer ${
                                toggleMenu ? 'hidden' : 'visible'
                            }`}
                            onClick={() => setToggleMenu(true)}
                        >
                            <RiMenu3Line className="text-[1.2rem]" />
                            {/* <FaCircleUser className="text-lg" /> */}
                            <img
                                src={currentUser.avatar}
                                alt="profile"
                                className="rounded-full h-[1.2rem] w-[1.2rem] object-cover"
                            />
                        </div>
                    ) : (
                        <div>
                            <div
                                className={`flex lg:hidden justify-center items-center text-cyan-800 hover:text-cyan-600 duration-300 text-sm font-semibold tracking-wide bg-white p-2 gap-2 rounded-full border-[1px] border-gray-300 relative whitespace-nowrap cursor-pointer ${
                                    toggleMenu ? 'hidden' : 'visible'
                                }`}
                                onClick={() => setToggleMenu(true)}
                            >
                                <RiMenu3Line className="text-lg" />
                                <FaCircleUser className="text-lg" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                onClick={() => setToggleMenu(false)}
                className={`fixed bg-black bg-opacity-60 z-10 top-0 left-0 right-0 bottom-0 ${
                    toggleMenu
                        ? 'opacity-1 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            ></div>
        </header>
    );
}
