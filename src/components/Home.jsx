import { useState, useEffect } from "react";
import axios from "axios";

import InquiryData from "./InquiryData";
import { FolderOpenDot, MailQuestion, Rss } from "lucide-react";
import bg from '../assets/pattern2.png'
const Home = () => {
  const [blogCount, setBlogCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);

  const fetchData = async () => {
    try {
      // Fetch total blogs
      const inquiryResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/inquiry/getall`
      );
      setInquiryCount(inquiryResponse.data.inquiries.length);

      const blogResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/blog/getall`
      );
      setBlogCount(blogResponse.data.length);

      // Fetch total cases
      const caseResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/gallery/getall`
      );
      setCaseCount(caseResponse.data?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* <h1 className="text-3xl font-semibold text-center text-neutral-900 mb-4">Hello Admin</h1> */}
      <div className="bg-neutral-50   py-6 px-4 sm:px-6 lg:px-8">
        <div className="">
          {/* Greeting */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative   flex justify-around items-center border-b-4 border-neutral-950 bg-white shadow-xl px-6 py-4  rounded-xl transition-transform hover:scale-105">
              
            <div className="absolute inset-0 "  style={{background:`url(${bg})`,backgroundPosition:'center',opacity:0.2,}} >

</div>
              {/* Icon */}
              <div className="p-3 bg-neutral-950 shadow-2xl   rounded-xl">
                <MailQuestion size={40} className="text-white" />
              </div>

              {/* Content */}
              <div className="flex flex-col text-neutral-900">
                <h2 className="text-lg font-semibold tracking-wide">
                  Total Inquiries
                </h2>
                <p className="text-4xl font-bold mt-2 text-neutral-950">
                  {inquiryCount}
                </p>
              </div>
            </div>

            <div className="relative   flex justify-around items-center bg-white border-b-4 border-neutral-950 shadow-xl px-6 py-4 rounded-xl transition-transform hover:scale-105"
            
           
            >
              <div className="absolute inset-0 "  style={{background:`url(${bg})`,backgroundPosition:'center',opacity:0.2,}} >

              </div>
              
              
              {/* Icon */}
              <div className="p-3 bg-neutral-950 shadow-2xl   rounded-xl">
                <FolderOpenDot size={40} className="text-white" />
              </div>

              {/* Content */}
              <div className="flex flex-col text-neutral-900">
                <h2 className="text-lg font-semibold tracking-wide">
                  Total Gallery Images
                </h2>
                <p className="text-4xl font-bold mt-2 text-neutral-950">
                  {caseCount}
                </p>
              </div>
            </div>

            <div className="relative   flex justify-around items-center bg-white border-b-4 border-neutral-950 shadow-xl px-6 py-4 rounded-xl transition-transform hover:scale-105">
            <div className="absolute inset-0 "  style={{background:`url(${bg})`,backgroundPosition:'center',opacity:0.2,}} >

</div>
              
              {/* Icon */}
              <div className="p-3 bg-neutral-950 shadow-2xl   rounded-xl">
                <Rss size={40} className="text-white" />
              </div>

              {/* Content */}
              <div className="flex flex-col text-neutral-900">
                <h2 className="text-lg font-semibold tracking-wide">
                  Total Blogs
                </h2>
                <p className="text-4xl font-bold mt-2 text-neutral-950">
                  {blogCount}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10">
          <InquiryData />
        </div>
      </div>
    </>
  );
};

export default Home;
