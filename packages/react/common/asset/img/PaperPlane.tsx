import React from "react";

export function PaperPlane(props) {
    return (
        <svg {...props} width="442" height="415" viewBox="0 0 442 415" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
                <path fillRule="evenodd" clipRule="evenodd" d="M173.394 137.012V202.949L351.302 0.949219L173.394 137.012Z" fill="white" stroke="black" />
                <path fillRule="evenodd" clipRule="evenodd" d="M173.395 137.012L206.652 164.949L351.303 0.949219L173.395 137.012Z" fill="black" />
                <path d="M350.341 1.89152L275.935 170.827L91.4291 109.785L350.341 1.89152Z" fill="url(#paint0_linear)" stroke="black" />
                <path d="M173.394 136.234L351.302 0.949219" stroke="black" />
            </g>
            <defs>
                <filter id="filter0_d" x="0" y="0.550781" width="441.677" height="413.722" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="120" />
                    <feGaussianBlur stdDeviation="45" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <linearGradient id="paint0_linear" x1="180.5" y1="254.449" x2="252.057" y2="78.8903" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DDDDDD" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>
    );
}
