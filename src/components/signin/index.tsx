// components/MyComponent.jsx
import React from 'react';
import { account } from './../../lib/appwrite';


const SignIn = () => {

  const handleSignIn = async (e) => {
    e.preventDefault();
  
  account.createOAuth2Session('google', 'http://www.blozum/com/demo', 'http://www.blozum.com/');

   const session = await account.getSession('current');
    // Get the session ID
    const sessionId = session.$id;
    // Update the session
    const promise = account.updateSession(sessionId);
    // promise.then(
    //   function (response) {
    //     console.log(response); // Success
    //   },
    //   function (error) {
    //     console.log(error); // Failure
    //   }
    // );
  }
  
  return (
    <div className="justify-center">
    <button onClick={handleSignIn}
    className="border-[1px] border-black/50 hover:border-black p-4 m-2 shadow-lg rounded-md mx-auto font-semibold"
    >
    Sign in with Google 
    </button>
    </div>
    )
};
export default SignIn;