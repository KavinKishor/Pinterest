import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const navigate = useNavigate();

 const handlesignup = async (e) => {
   e.preventDefault();
   try {
     await axios
       .post("http://localhost:5001/user/register", {
         name,
         email,
         password,
       })
       .then((res) => {
         toast.success(res.data.message);
         navigate("/");
       })
       .catch((err) => toast.error(err.response.data.message));
   } catch (error) {
     toast.error(error);
   }
 };
 return (
   <>
     <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
         <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-blue-800">
           Sign up
         </h2>
       </div>

       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
         <form onSubmit={handlesignup} className="space-y-6">
           <div>
             <label
               htmlFor="name"
               className="block text-sm font-medium leading-6 text-gray-900"
             >
               Name
             </label>
             <div className="mt-2">
               <input
                 id="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 type="text"
                 required
                 className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               />
             </div>
           </div>
           <div>
             <label
               htmlFor="email"
               className="block text-sm font-medium leading-6 text-gray-900"
             >
               Email address
             </label>
             <div className="mt-2">
               <input
                 id="email"
                 name="email"
                 type="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 autoComplete="email"
                 className="block  p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               />
             </div>
           </div>

           <div>
             <div className="flex items-center justify-between">
               <label
                 htmlFor="password"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Password
               </label>
             </div>
             <div className="mt-2">
               <input
                 id="password"
                 name="password"
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 autoComplete="current-password"
                 className="block  p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               />
             </div>
           </div>

           <div>
             <button
               type="submit"
               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             >
               Sign up
             </button>
           </div>
         </form>

         <p className="mt-10 text-center text-sm text-gray-500">
           Having account with us?{" "}
           <Link
             to="/"
             className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
           >
             Please sign in
           </Link>
         </p>
       </div>
     </div>
   </>
 );
};

export default SignUp;
