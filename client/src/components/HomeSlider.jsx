import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import Listingitem from '../components/Listingitem';
import { FaArrowRight } from 'react-icons/fa6';
import SwiperNavButton from './SwiperNavButton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/bundle';

export default function HomeSlider({
    bodytypeListings,
    carBodytype,
    showMore,
}) {
    return (
        <Swiper
            slidesPerView={1.25}
            spaceBetween={6}
            // pagination={{
            //     clickable: true,
            // }}
            // navigation
            breakpoints={{
                350: {
                    slidesPerView: 1.35,
                    spaceBetween: 6,
                },
                390: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                },
                430: {
                    slidesPerView: 1.65,
                    spaceBetween: 6,
                },
                510: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                },
                580: {
                    slidesPerView: 2.3,
                    spaceBetween: 12,
                },
                710: {
                    slidesPerView: 2.8,
                    spaceBetween: 18,
                },
                800: {
                    slidesPerView: 3,
                    spaceBetween: 18,
                },
                900: {
                    slidesPerView: 3.5,
                    spaceBetween: 18,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
            }}
            modules={[Pagination, Navigation]}
            // style={{
            //     '--swiper-pagination-bottom': '7px',
            //     '--swiper-pagination-top': 'auto',
            //     '--swiper-pagination-right': 'auto',
            //     '--swiper-pagination-left': '8px',
            //     '--swiper-pagination-color': '#06B6D4',
            // }}
            className="pb-5 lg:pb-0"
        >
            {bodytypeListings.map((listing) => (
                <SwiperSlide>
                    <Listingitem listing={listing} key={listing._id} />
                </SwiperSlide>
            ))}
            <SwiperSlide>
                <Link to={`/search?${carBodytype}`}>
                    <div className="bg-white shadow-md hover:shadow-lg rounded-lg w-[95%] flex flex-col justify-center items-center gap-5 py-[4.15rem] sm:py-[4.3rem] lg:py-[4.53rem] xl:py-[5.14rem] group">
                        <div className="h-20 w-20 rounded-full bg-cyan-50 group-hover:bg-cyan-600 flex justify-center items-center">
                            <FaArrowRight className="text-xl text-slate-700 group-hover:text-white" />
                        </div>
                        <p className="text-xs text-slate-900 uppercase">
                            Show more {showMore}
                        </p>
                    </div>
                </Link>
            </SwiperSlide>
            <SwiperNavButton />
        </Swiper>
    );
}
