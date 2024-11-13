import React, { useEffect, useState } from "react";
import Header from "../Utilities/Header";
import axios from "axios";
import Images from "./Images";
import { toast } from "react-toastify";
import Loader from "../Utilities/Loader";

const Dashboard = () => {
  const [images, setImages] = useState([]);

  const [image, setImage] = useState();
  const [tags, setTags] = useState();
  const [caption, setCaption] = useState("");
  const [liked, setLiked] = useState(false);
  const [follow, setFollow] = useState(false);
  const [newTags, setNewTags] = useState(false);
  const [newImg, setNewImg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [openForm, setOpenForm] = useState(false);
  const userdata = localStorage.getItem("userDatas");
  const userName = JSON.parse(userdata).split("@")[0];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    function fetchallimages() {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
      axios
        .get("http://localhost:5001/picture/allpictures", config)
        .then((res) => {
          console.log(res.data.pictures);

          let filterdImage = res.data.pictures;
          if (selectedFilter === "liked") {
            filterdImage = filterdImage.filter((img) => img.likes.length > 0);
          } else if (selectedFilter === "following") {
            filterdImage = filterdImage.filter(
              (img) => img.followingUsers.length > 0
            );
          }
          setImages(filterdImage);
        })
        .catch((err) => console.log(err));
    }
    fetchallimages();
  }, [liked, follow, newTags, newImg, selectedFilter]);

  const handleNewImage = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
      console.log(config);

      const formdata = new FormData();
      formdata.append("image", image);
      formdata.append("caption", caption);
      formdata.append("tags", tags);

      await axios
        .post("http://localhost:5001/picture/newimage", formdata, config)
        .then((res) => {
          console.log(res.data);
          toast.success(res.data.message);
          setNewImg((prev) => !prev);
          setCaption("");
          setTags("");
          setImage(null);
          setOpenForm(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header setSelectedFilter={setSelectedFilter} userName={userName} />
      <p className="p-1 flex justify-center items-center text-[28px] text-gray-600 w-full h-[80px]">
        Hi , {userName} we welcomes you back...❤
      </p>
      <div className="flex flex-col items-center">
        <p className="text-center text-gray-500">
          Are you await for share ideas!😎
        </p>
        <button
          className="mt-4 rounded-md bg-blue-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={() => setOpenForm(!openForm)}
        >
          Post 🐱‍🏍
        </button>
      </div>

      {openForm && (
        <div className=" m-2  border-4 rounded">
          <div>
            <form
              onSubmit={handleNewImage}
              className=" flex justify-around items-center  text-gray-600 w-100 h-[180px] mx-5 "
            >
              <input
                type="file"
                required
                placeholder="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="border-2 rounded p-1 w-[350px]"
              />
              <input
                type="text"
                placeholder="Add tag"
                required
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="border-2 rounded p-2 w-[350px]"
              />
              <input
                type="text"
                placeholder="Add caption"
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-2 rounded p-2 w-[350px]"
              />
              <button
                type="submit"
                className="w-[100px] rounded-md bg-teal-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Share
              </button>
              <button
                type="submit"
                className="w-[100px] rounded-md bg-red-500 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                onClick={() => setOpenForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="py-4 px-4 columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {Images &&
            images.map((img) =>
              img?._id ? (
                <Images
                  img={img}
                  key={img._id}
                  setLiked={setLiked}
                  setFollow={setFollow}
                  setNewTags={setNewTags}
                />
              ) : null
            )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
