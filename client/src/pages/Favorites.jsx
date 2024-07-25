import { useEffect, useState } from 'react';
import ScrollToTop from '../components/ScrollToTop';
import { GiRaceCar } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MoonLoader from 'react-spinners/MoonLoader';

export default function Favorites() {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deleteMake, setDeleteMake] = useState('');
    const [deleteModel, setDeleteModel] = useState('');
    const [favoriteListing, setFavoriteListing] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const params = useParams();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/user/getFavoriteCar/${currentUser._id}`
                );
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                const favoriteCar = data[0].favorites;
                setFavoriteListing(favoriteCar);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser._id]);

    const handleDeleteFavorite = async (listingId) => {
        try {
            const res = await fetch(
                `/api/user/deleteFavoriteCar/${listingId}`,
                {
                    method: 'POST',
                }
            );
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFavoriteListing((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
            toast.info('Favorite unsaved', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleOpenDeleteModal = (listingId, make, model) => {
        setDeleteId(listingId);
        setDeleteMake(make);
        setDeleteModel(model);
        setToggleDeleteModal(true);
    };

    return (
        <div className="px-3 pt-10 pb-20 max-w-3xl mx-auto min-h-[75vh]">
            <ScrollToTop />
            <div className="p-3 bg-inherit">
                {!loading && favoriteListing && favoriteListing.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center items-center">
                            <GiRaceCar className="text-center text-5xl text-slate-800" />
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-800 text-center mt-[-2rem] mb-7">
                            My Favorites
                        </h1>
                        {favoriteListing.map((item) => (
                            <div
                                key={item._id}
                                className="border-2 rounded-lg py-2 px-3 flex justify-between items-center gap-4"
                            >
                                <Link to={`/listing/${item._id}`}>
                                    <img
                                        src={item.imageUrls[0]}
                                        alt="favorite image"
                                        className="h-24 w-24 object-contain"
                                    />
                                </Link>
                                <Link
                                    className="text-slate-700 font-semibold text-sm truncate flex-1"
                                    to={`/listing/${item._id}`}
                                >
                                    <p>
                                        {item.year} {''}
                                        {item.make} {''}
                                        {item.model}
                                    </p>
                                    <div>
                                        <p className="font-semibold text-cyan-700 text-md mt-3">
                                            &#8369;
                                            {item.price.toLocaleString('en-US')}
                                        </p>
                                        <p className="flex items-center gap-1 text-slate-500 text-xs">
                                            <FaMapMarkerAlt className="text-green-700" />
                                            {item.address}
                                        </p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() =>
                                        handleOpenDeleteModal(
                                            item._id,
                                            item.make,
                                            item.model
                                        )
                                    }
                                    className="text-lg bg-slate-200 p-1 hover:bg-slate-300 duration-300 rounded-sm"
                                >
                                    <RiDeleteBin6Line />
                                </button>
                                <div
                                    className={`fixed flex flex-col justify-center items-center gap-5 inset-0 w-80 sm:w-96 h-32 rounded-lg mx-auto my-auto bg-slate-50 p-3 sm:p-5 z-50 ${
                                        toggleDeleteModal ? 'block' : 'hidden'
                                    }`}
                                >
                                    <p className="text-center text-sm text-slate-800 font-semibold">
                                        Are you sure you want to delete{' '}
                                        {deleteMake} {deleteModel}?
                                    </p>
                                    <div className="flex gap-5">
                                        <button
                                            className="text-white text-sm bg-red-600 w-24 h-8 rounded-md hover:bg-opacity-90 font-medium"
                                            onClick={() => {
                                                handleDeleteFavorite(deleteId);
                                                setToggleDeleteModal(false);
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="text-sm bg-white w-24 h-8 rounded-md shadow-sm font-medium"
                                            onClick={() =>
                                                setToggleDeleteModal(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-[60vh]">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center gap-2">
                                <MoonLoader size={25} color="#155f75" />
                                <p className="text-center text-2xl font-semibold text-slate-600">
                                    Loading
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                <p className="text-xl font-semibold text-slate-600">
                                    You have no favorite listing yet.
                                </p>
                                <Link
                                    to={'/search'}
                                    className="flex flex-1 justify-center items-center"
                                >
                                    <button className="flex gap-2 justify-center items-center px-5 py-1 text-white text-sm rounded-full font-semibold bg-gradient-to-r from-cyan-600 to-cyan-400 hover:bg-opacity-20">
                                        Search car
                                        <GiRaceCar className="text-center text-4xl text-slate-900" />
                                    </button>
                                </Link>
                            </div>
                        )}
                        {error && (
                            <p className="text-center text-2xl font-semibold text-slate-600">
                                Something went wrong!
                            </p>
                        )}
                    </div>
                )}
                <div className="hidden">
                    {toggleDeleteModal
                        ? (document.body.style.overflow = 'hidden')
                        : (document.body.style.overflow = 'auto')}
                </div>
                <div
                    onClick={() => setToggleDeleteModal(false)}
                    className={`fixed bg-black bg-opacity-70 z-40 top-0 left-0 right-0 bottom-0 ${
                        toggleDeleteModal
                            ? 'opacity-1 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                    }`}
                ></div>
            </div>
        </div>
    );
}
