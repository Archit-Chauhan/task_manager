import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import task1 from "../assets/task 1.jpg";
import task2 from "../assets/task 2.jpg";
import task3 from "../assets/task 3.jpg";

import AbstractBackground from "../components/AbstractBackground";

const images = [task1, task2, task3];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AbstractBackground>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-center">

        {/* LEFT SECTION */}
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            WorkSync Pro makes <br />
            workforce management easy
          </h1>


          <div className="max-w-md">
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <Link
              to="/login"
              className="block mt-4 text-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Sign up
            </Link>
          </div>

          <div className="flex items-center gap-4 my-6 max-w-md">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="flex gap-4">
            {["G", "M", "A", "S"].map((icon, i) => (
              <button
                key={i}
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-lg font-bold hover:shadow-lg transition"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="-translate-y-10">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
            </div>

            <div className="relative w-full h-[550px] overflow-hidden">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Task Manager Preview"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImage ? "opacity-300" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </AbstractBackground>
  );
};

export default Home;
