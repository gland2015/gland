import React from "react";

export function FluentBg(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" {...props}>
            <g opacity=".2" clip-path="url(#E)">
                <path
                    d="M1466.4 1795.2c950.37 0 1720.8-627.52 1720.8-1401.6S2416.77-1008 1466.4-1008-254.4-380.482-254.4 393.6s770.428 1401.6 1720.8 1401.6z"
                    fill="url(#A)"
                />
                <path
                    d="M394.2 1815.6c746.58 0 1351.8-493.2 1351.8-1101.6S1140.78-387.6 394.2-387.6-957.6 105.603-957.6 714-352.38 1815.6 394.2 1815.6z"
                    fill="url(#B)"
                />
                <path
                    d="M1548.6 1885.2c631.92 0 1144.2-417.45 1144.2-932.4S2180.52 20.4 1548.6 20.4 404.4 437.85 404.4 952.8s512.276 932.4 1144.2 932.4z"
                    fill="url(#C)"
                />
                <path
                    d="M265.8 1215.6c690.246 0 1249.8-455.595 1249.8-1017.6S956.046-819.6 265.8-819.6-984-364.005-984 198-424.445 1215.6 265.8 1215.6z"
                    fill="url(#D)"
                />
            </g>
            <defs>
                <radialGradient
                    id="A"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(1466.4 393.6) rotate(90) scale(1401.6 1720.8)"
                >
                    <stop stopColor="#107c10" />
                    <stop offset="1" stopColor="#c4c4c4" stop-opacity="0" />
                </radialGradient>
                <radialGradient
                    id="B"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(394.2 714) rotate(90) scale(1101.6 1351.8)"
                >
                    <stop stopColor="#0078d4" />
                    <stop offset="1" stopColor="#c4c4c4" stop-opacity="0" />
                </radialGradient>
                <radialGradient
                    id="C"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(1548.6 952.8) rotate(90) scale(932.4 1144.2)"
                >
                    <stop stopColor="#ffb900" stop-opacity=".75" />
                    <stop offset="1" stopColor="#c4c4c4" stop-opacity="0" />
                </radialGradient>
                <radialGradient
                    id="D"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(265.8 198) rotate(90) scale(1017.6 1249.8)"
                >
                    <stop stopColor="#d83b01" stop-opacity=".75" />
                    <stop offset="1" stopColor="#c4c4c4" stop-opacity="0" />
                </radialGradient>
                <clipPath id="E">
                    <path fill="#fff" d="M0 0h1920v1080H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}
