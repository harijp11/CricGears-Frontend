import React from "react";
import { BoltIcon as Bat, Award, Truck, Headphones } from "lucide-react";
import { SiteHeader } from "../components/ui/header";
import { SiteFooter } from "../components/ui/footer";
import crafting from "../../public/craftman with bat.webp";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <div className="bg-white text-black">
        <header className="bg-black text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">About Our Cricket Bats</h1>
            <p className="text-xl">Crafting Excellence for Every Innings</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8">Our Story</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <p className="text-lg mb-4">
                  Founded in 2005, our passion for cricket drove us to create
                  the finest bats in the game. With years of expertise and a
                  commitment to quality, we've become a trusted name among
                  professionals and enthusiasts alike. Our journey began in a
                  small workshop in Yorkshire, where master craftsman James
                  Wilson spent countless hours perfecting his technique.Through dedication
                  and innovation, we've earned partnerships with leading cricket
                  academies and professional teams worldwide, helping nurture
                  the next generation of cricket talent. Our commitment to
                  excellence has been recognized with multiple industry awards,
                  including "Best Cricket Equipment Manufacturer" for three
                  consecutive years.
                </p>
                <p className="text-lg mb-4">
                  Every bat we craft is a testament to our dedication, combining
                  traditional techniques with cutting-edge technology to deliver
                  unparalleled performance on the pitch. We carefully select
                  each piece of willow, considering factors like grain
                  structure, weight, and density to ensure optimal performance.
                  Our seasoned craftsmen spend up to 12 hours on each bat,
                  meticulously shaping and pressing the willow to achieve the
                  perfect balance of power and control. We're not just making
                  cricket bats - we're crafting instruments of excellence that
                  help players achieve their full potential. Each bat undergoes
                  rigorous quality testing, including computer-assisted weight
                  distribution analysis and multiple rounds of performance
                  trials by professional players.
                </p>
                <p className="text-lg">
                  Our commitment extends beyond just creating exceptional
                  cricket bats. We believe in sustainable manufacturing
                  practices, sourcing our English willow from certified
                  sustainable forests. We've also pioneered innovative recycling
                  programs for old cricket bats, giving them new life as
                  training equipment for youth programs. Our workshop runs on
                  renewable energy, and we're proud to be one of the first
                  carbon-neutral cricket equipment manufacturers in the
                  industry. Through our 'Bats for Future Stars' initiative,
                  we've donated over 1,000 bats to underprivileged young
                  cricketers across the globe, helping spread the joy of cricket
                  to every corner of the world.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src={crafting}
                  alt="Craftsman working on a cricket bat"
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Bat size={40} />,
                  title: "Premium Quality",
                  description:
                    "Hand-selected willow and meticulous craftsmanship ensure top-notch bats.",
                },
                {
                  icon: <Award size={40} />,
                  title: "Performance Tested",
                  description:
                    "Each bat undergoes rigorous testing to meet professional standards.",
                },
                {
                  icon: <Truck size={40} />,
                  title: "Fast Delivery",
                  description:
                    "Swift and secure shipping to get you playing in no time.",
                },
                {
                  icon: <Headphones size={40} />,
                  title: "Expert Support",
                  description:
                    "Our team of cricket enthusiasts is always ready to assist you.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg text-center"
                >
                  <div className="text-black mb-4 flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8">Our Commitment</h2>
            <div className="bg-black text-white p-8 rounded-lg">
              <p className="text-lg mb-4">
                We're not just selling cricket bats; we're nurturing a legacy.
                Our commitment to the sport goes beyond commerce – we're
                dedicated to elevating the game, one bat at a time.
              </p>
              <p className="text-lg">
                From the moment you pick up one of our bats, you'll feel the
                difference. It's not just about scoring runs; it's about the
                confidence, the perfect balance, and the sweet spot that turns
                good shots into great ones.
              </p>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
