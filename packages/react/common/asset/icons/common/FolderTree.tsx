import React from "react";

export function FolderTree(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" {...props}>
            <path d="M288 224h224a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32H400L368 0h-80a32 32 0 0 0-32 32v64H64V8a8 8 0 0 0-8-8H40a8 8 0 0 0-8 8v392a16 16 0 0 0 16 16h208v64a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V352a32 32 0 0 0-32-32H400l-32-32h-80a32 32 0 0 0-32 32v64H64V128h192v64a32 32 0 0 0 32 32zm0 96h66.74l32 32H512v128H288zm0-288h66.74l32 32H512v128H288z"></path>
        </svg>
    );
}
