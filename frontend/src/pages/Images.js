import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Images = ({ img, setLiked, setFollow, setNewTags }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [tag, setTag] = useState();

  const isFollowed = img?.followingUsers?.length > 0;
  const isLiked = img?.likes?.length > 0;

  const handleselected = (img) => {
    setSelectedImg(img);
  };
  const closemodal = () => {
    setSelectedImg(null);
  };

  const handleLike = async (imgId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    setLiked((prev) => !prev);
    await axios
      .post(`http://localhost:5001/picture/likepicture/${imgId}`, {}, config)
      .then((res) => {
        // console.log(res.data);
        toast.success(res.data.message);
        setLiked((prev) => !prev);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  };

  const handlefollow = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    setFollow((prev) => !prev);
    try {
      await axios
        .post(`http://localhost:5001/picture/following/${id}`, {}, config)
        .then((res) => {
          toast.success(res.data.message);
          setFollow((prev) => !prev);
        })
        .catch((err) => toast.error(err.message));
    } catch (error) {
      console.error(error);
    }
  };

  const handletag = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    setNewTags((prev) => !prev);
    try {
      await axios
        .post(`http://localhost:5001/picture/tagging/${id}`, { tag }, config)
        .then((res) => {
          toast.success(res.data.message);
          setNewTags((prev) => !prev);
          setSelectedImg((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
          setTag("");
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handledeletetag = async (t, id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    try {
      await axios
        .post(
          `http://localhost:5001/picture/deletetag/${id}`,
          { tag: t },
          config
        )
        .then((res) => {
          toast.success(res.data.message);
          // console.log(res.data);
          setSelectedImg((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== t),
          }));
          setNewTags((prev) => !prev);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div key={img._id} className="relative overflow-hidden rounded-lg">
        <img
          src={require(`../Images/${img.imageUrl}`)}
          alt={img.caption}
          className="w-full h-auto object-cover rounded-lg cursor-pointer transition-transform transform hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-80 transition-opacity">
          <div className="flex space-x-4 text-white">
            <div className="bg-yellow-500 rounded p-2 ">
              {img?.tags?.length > 0
                ? img.tags[img.tags.length - 1]
                : "No tags available"}
            </div>
            <button
              className="bg-black bg-opacity-50 p-2 rounded-full"
              onClick={() => handleLike(img._id)}
            >
              {isLiked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#e91e63"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              ) : (
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </span>
              )}
            </button>
            <button
              className="bg-black bg-opacity-50 p-2 rounded-full "
              onClick={() => handleselected(img)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {selectedImg && (
        <div className="fixed inset-0 z-50 flex bg-gray-900 bg-opacity-50">
          {/* Modal content */}
          <div className="flex w-full max-w-6xl mx-auto my-8 bg-white rounded-lg overflow-hidden">
            {/* Left side: image */}
            <div className="w-2/3 p-4 m-2 overflow-y-scroll">
              <img
                src={require(`../Images/${img.imageUrl}`)}
                alt={img.caption}
                className="w-full h-auto  object-fit"
              />
            </div>

            {/* Right side: image details */}
            <div className="w-1/3 p-6">
              <h2 className="text-2xl text-gray-500 font-semibold">
                {selectedImg.caption}
              </h2>
              <div className="my-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-full"
                  onClick={() => handlefollow(selectedImg._id)}
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </button>
              </div>
              <p className="text-gray-300">Tags</p>
              <div className=" w-full max-h-[200px] overflow-y-auto flex flex-wrap gap-2">
                {selectedImg.tags.length > 0 ? (
                  selectedImg.tags.map((t) => (
                    <div key={t}>
                      <p className="bg-yellow-400 flex justify-center  rounded p-2 m-1 align-center text-center text-white">
                        {t}{" "}
                        <span
                          className="mx-1 cursor-pointer"
                          onClick={() => handledeletetag(t, selectedImg._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="teal"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No tags available</p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="tags" className="block text-xl text-gray-400">
                  Add Tag
                </label>
                <input
                  id="tags"
                  type="text"
                  className="mt-2 w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter tag..."
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
                <button
                  className="mt-2 bg-green-500 text-white py-2 px-4 rounded-full"
                  onClick={() => handletag(selectedImg._id)}
                >
                  Add Tag
                </button>
              </div>

              <div className="mt-4">
                <button
                  className="text-red-500 font-bold p-1"
                  onClick={closemodal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Images;
