import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

const products = [
  {
    id: 1,
    image: "/images/unisex-classic-tee-maroon-front-67c224fee35f1.webp",
    alt: "Petrichor T-Shirt",
  },
  {
    id: 2,
    image: "/images/unisex-classic-tee-forest-green-front-and-back-67c24e797e636.webp",
    alt: "Stranger In Disguise T-Shirt",
  },
  {
    id: 3,
    image: "/images/unisex-classic-tee-black-front-2-67c238a3f2131.webp",
    alt: "Talkin Secret T-Shirt",
  },
];

export default function MerchCarousel() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Merch Heading */}
      <h1 className="text-[4em] font-extrabold text-center text-[#131c20] italic mb-4">
        Merch
      </h1>

      {/* Carousel - Volle Breite */}
      <div className="w-full">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-3/5">
                <a
                  href="https://shop.talkinsecret.com"
                  className="block transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-auto transition-all duration-300 hover:brightness-110"
                    loading="lazy"
                  />
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center justify-center w-full mt-6 text-center px-4">
        <p className="text-xl font-semibold mb-4">Support the noise - Wear the merch!</p>
        <a href="https://shop.talkinsecret.com" target="_blank" rel="noopener noreferrer">
          <button className="bg-primary hover:bg-background hover:border-primary hover:border-solid border-solid border-2 border-primary hover:border-2 text-white rounded-none px-16 py-6 font-semibold transition-colors">
            Shop
          </button>
        </a>
      </div>
    </div>
  );
}
