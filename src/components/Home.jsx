import { useState, useEffect } from "react";
import axios from "axios";

import InquiryData from "./InquiryData";
import { FolderOpenDot, MailQuestion, Rss } from "lucide-react";
import bg from "../assets/pattern2.png";
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
      <div className="bg-neutral-50  py-6 px-4 ">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Total Inquiries Card */}
  <div className="relative bg-white border-b-4 border-[#ebb661] shadow-xl rounded-xl transition-transform hover:scale-105 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background: `url(${bg})`,
        backgroundPosition: "center",
        opacity: 0.2,
      }}
    ></div>
    
    <div className="relative flex  justify-between px-6 py-4">
      {/* Left side - Icon and Title */}
      <div className="fle items-center space-y-2">
        <div className="p-3 inline-block bg-amber-100 border border-[#ebb661] shadow-lg rounded-xl ">
          <MailQuestion size={32} className="text-whit" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-neutral-900">
            Total Inquiries
          </h2>
        </div>
      </div>
      
      {/* Right side - Number */}
      <div className="text-right">
        <p className="text-4xl font-bold text-neutral-950">
          {inquiryCount}
        </p>
      </div>
    </div>
  </div>

  {/* Total Gallery Images Card */}
  <div className="relative bg-white border-b-4 border-[#ebb661] shadow-xl rounded-xl transition-transform hover:scale-105 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background: `url(${bg})`,
        backgroundPosition: "center",
        opacity: 0.2,
      }}
    ></div>
    
    <div className="relative flex  justify-between px-6 py-4">
      {/* Left side - Icon and Title */}
      <div className="flx items-center space-y-3">
        <div className="p-3 inline-block bg-amber-100 border border-[#ebb661] shadow-lg rounded-xl flex-shrink-0">
          <FolderOpenDot size={32} className="text-whit" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-neutral-900">
            Total Gallery Images
          </h2>
        </div>
      </div>
      
      {/* Right side - Number */}
      <div className="text-right">
        <p className="text-4xl font-bold text-neutral-950">
          {caseCount}
        </p>
      </div>
    </div>
  </div>

  {/* Total Blogs Card */}
  <div className="relative bg-white border-b-4 border-[#ebb661] shadow-xl rounded-xl transition-transform hover:scale-105 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background: `url(${bg})`,
        backgroundPosition: "center",
        opacity: 0.2,
      }}
    ></div>
    
    <div className="relative flex justify-between px-6 py-4">
      {/* Left side - Icon and Title */}
      <div className="flx items-center space-y-3">
        <div className="p-3 inline-block bg-amber-100 border border-[#ebb661] shadow-lg rounded-xl flex-shrink-0">
          <Rss size={32} className="text-whit" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-neutral-900">
            Total Blogs
          </h2>
        </div>
      </div>
      
      {/* Right side - Number */}
      <div className="text-right">
        <p className="text-4xl font-bold text-neutral-950">
          {blogCount}
        </p>
      </div>
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
