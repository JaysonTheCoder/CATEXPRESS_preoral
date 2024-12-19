import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loader from "../partials/Loader";
import { db } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPass, setConfirmPass] = useState("");
  const [Error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const handleSignup = async () => {
    // Input validations
    if (!firstname || !lastname || !Email || !Password || !ConfirmPass) {
      setError("All fields are required.");
      return;
    }
    if (Password !== ConfirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const usersCollection = collection(db, "admins");

      // Check if the email already exists
      const emailQuery = query(usersCollection, where("email", "==", Email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setError("Email already exists.");
        setLoading(false);
        return;
      }

      // Generate a new document ID based on the collection size
      const snapshot = await getDocs(usersCollection);
      const newDocId = snapshot.size.toString();

      // Save the new user
      const userData = {
        firstname,
        lastname,
        email: Email,
        password: Password,
      };

      await setDoc(doc(db, "admins", newDocId), userData);

      // Reset form fields
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPass("");
      setError(null);

      // Navigate to login page
      navigator("/");
    } catch (err) {
      console.error("Signup Error: ", err);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-container">
      {loading && <Loader />}
      <div className="sign-form-wrap">
        <div className="form-title"></div>
        <div className="err-container">
          <p>{Error && Error}</p>
        </div>
        <div className="form">
          <div className="input">
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              required
              id="firstname"
            />
            <label htmlFor="firstname">First Name</label>
          </div>
          <div className="input">
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              required
              id="lastname"
            />
            <label htmlFor="lastname">Last Name</label>
          </div>
          <div className="input">
            <input
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
              id="email"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input">
            <input
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              required
              id="create-password"
            />
            <label htmlFor="create-password">Create Password</label>
            <button
              onMouseEnter={() => setShowPass(true)}
              onMouseLeave={() => setShowPass(false)}
              className="showVisibility"
            >
              {!showPass ? (
                <Visibility style={{ fontSize: 13, color: "#00000090" }} />
              ) : (
                <VisibilityOff style={{ fontSize: 13, color: "#00000090" }} />
              )}
            </button>
          </div>
          <div className="input">
            <input
              value={ConfirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              type={showConfirmPass ? "text" : "password"}
              required
              id="confirm-password"
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <button
              onMouseEnter={() => setShowConfirmPass(true)}
              onMouseLeave={() => setShowConfirmPass(false)}
              className="showVisibility"
            >
              {!showConfirmPass ? (
                <Visibility style={{ fontSize: 13, color: "#00000090" }} />
              ) : (
                <VisibilityOff style={{ fontSize: 13, color: "#00000090" }} />
              )}
            </button>
          </div>
          <button onClick={handleSignup} id="submit" disabled={loading}>
            Create
          </button>
          <Link to="/">
            <i>Already have an account?</i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
