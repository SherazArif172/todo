import { Button } from "@mui/material";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-black p-4 shadow-md">
      <div className="container flex justify-between items-center mx-auto">
        <div className="text-2xl text-white font-extrabold">TODO</div>

        <Button variant="contained" href="#contained-buttons">
          Sign In
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

//
