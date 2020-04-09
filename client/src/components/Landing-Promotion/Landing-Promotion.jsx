import React from "react";
import { Link } from "react-router-dom";

const LandingPromotion = () => {
  return (
    <div className="mx-auto w-75 text-center">
      <h1>
        Welcome to <span className="brand-name text-jellybean">STORIES!</span>
      </h1>
      <p className="text-muted lead mt-2">Login or Create an account</p>
      { /* prettier-ignore*/ }
      <div className="mt-4">
        <Link to="/login" className="text-uppercase btn btn-primary mr-2 btn-rounded px-4">
          sign in
        </Link>
        <Link to="/register" className="text-uppercase btn btn-secondary ml-2 btn-rounded px-4">
          sign up
        </Link>
      </div>
    </div>
  );
};

export default LandingPromotion;
