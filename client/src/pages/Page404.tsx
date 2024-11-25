import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/router";

export const Page404: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="mt-4 text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page Not Found</p>
        <Button className="mt-6">
          <Link to={AppRoutes.root}>Go to Home</Link>
        </Button>
      </div>
    </div>
  );
};
