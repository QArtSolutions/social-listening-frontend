// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BrandInput from './BrandInput'; // Ensure to adjust the import path if necessary

// const LoginPage = ({ setIsAuthenticated }) => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Add your loginUser API function here
//   async function loginUser(credentials) {
//     return fetch('http://localhost:5000/login', {  // Adjust the URL to your API endpoint
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(credentials)
//     })
//     .then(data => data.json());
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Call the loginUser API with the user input
//     const response = await loginUser({
//       username,
//       email,
//       password
//     });

//     if (response.success) {
//       // If login is successful, store login state and redirect to Home
//       window.localStorage.setItem("isLoggedIn", true);
//       setIsAuthenticated(true); // Set authentication state
//       navigate('/home'); // Redirect to Home page
//     } else {
//       setError('Invalid credentials');
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       {error && <div>{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username:
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//         </label>
//         <label>
//           Email:
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </label>
//         <label>
//           Password:
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </label>
//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       {/* Display BrandInput component conditionally based on authentication */}
//       {window.localStorage.getItem("isLoggedIn") && (
//         <BrandInput setIsAuthenticated={setIsAuthenticated} />
//       )}
//     </div>
//   );
// };

// export default LoginPage;
