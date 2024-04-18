import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const CarouselSlider = () => {

    
var settings = {
    infinite: true,
    speed: 1500,
    slidesToShow: 8,
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
          infinite: true,
          autoplay: true,
          speed: 1500,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
          initialSlide: 2,
          autoplay: true,
          speed: 1500,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          autoplay: true,
          speed: 1500,
        },
      },
    ],
  };


    return(
        <div
        className="border-[#0b6e4f]/50 shadow shadow-[#0b6e4f]  md:p-24 p-2 py-16 rounded-3xl md:m-8 "
        style={{
            background: 'radial-gradient(140% 107.13% at 50% 10%,transparent 37.41%,#0b6e4f 69.27%,#fff 100%)',
          }}
        >
    <Slider
    
          className="hidden md:flex md:justify-center md:items-center gap-4"
          {...settings}
        >
      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>

      <div
        className="justify-center md:mx-8 mx-2 col-span-1 footer_grad rounded-md text-3xl border-white text-center text-white md:p-8 p-4 overflow-hidden leading-5"
      >
        ITC
      </div>
       </Slider> 
       </div>
    )
}

export default CarouselSlider