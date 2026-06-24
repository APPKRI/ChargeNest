import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: "",

        role: "driver"

    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            setError("");

            await registerUser(formData);

            alert("Registration Successful");

            navigate("/login");

        }

        catch (err) {

            setError(

                err.response?.data?.message ||

                "Registration Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-green-50 flex items-center justify-center">


            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">


                <h1 className="text-3xl font-bold text-center text-green-600">

                    ChargeNest

                </h1>


                <p className="text-center text-gray-500 mt-2">

                    Create your account

                </p>



                {error && (

                    <p className="text-red-500 mt-4">

                        {error}

                    </p>

                )}



                <form
                    className="mt-8"
                    onSubmit={handleSubmit}
                >



                    <div className="mb-4">

                        <label className="block mb-2 font-medium">

                            Full Name

                        </label>


                        <input

                            type="text"

                            name="name"

                            value={formData.name}

                            onChange={handleChange}

                            placeholder="Enter your full name"

                            className="w-full border rounded-lg px-4 py-3"

                            required

                        />

                    </div>




                    <div className="mb-4">

                        <label className="block mb-2 font-medium">

                            Email

                        </label>


                        <input

                            type="email"

                            name="email"

                            value={formData.email}

                            onChange={handleChange}

                            placeholder="Enter your email"

                            className="w-full border rounded-lg px-4 py-3"

                            required

                        />

                    </div>




                    <div className="mb-4">

                        <label className="block mb-2 font-medium">

                            Password

                        </label>


                        <input

                            type="password"

                            name="password"

                            value={formData.password}

                            onChange={handleChange}

                            placeholder="Enter your password"

                            className="w-full border rounded-lg px-4 py-3"

                            required

                        />

                    </div>





                    <div className="mb-6">

                        <label className="block mb-2 font-medium">

                            Register As

                        </label>


                        <select

                            name="role"

                            value={formData.role}

                            onChange={handleChange}

                            className="w-full border rounded-lg px-4 py-3"

                        >

                            <option value="driver">

                                Driver

                            </option>


                            <option value="host">

                                Host

                            </option>

                        </select>

                    </div>




                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"

                    >

                        {

                            loading ?

                            "Creating Account..."

                            :

                            "Create Account"

                        }

                    </button>


                </form>




                <div className="mt-6 text-center">

                    <p className="text-gray-600">

                        Already have an account?


                        <Link

                            to="/login"

                            className="text-green-600 ml-1"

                        >

                            Login

                        </Link>


                    </p>

                </div>


            </div>


        </div>

    );

}


export default Signup;