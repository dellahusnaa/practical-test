"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DatabaseComponent from "@/components/Database/DatabaseComponent";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MainComponent: React.FC = () => {
    return ( // Tambahkan return jika tidak ada
        <div className="w-full xl:px-30 px-10 mt-4">
            <DatabaseComponent />
        </div>
    );
};

export default MainComponent;
