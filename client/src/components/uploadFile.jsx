"use client";

import { FileInput, Label } from "flowbite-react";

export function FileUpload() { // Renaming function for better clarity
  return (
    <div>
      <div>
        <Label htmlFor="file-upload-helper-text" value="Upload file" />
      </div>
      <FileInput id="file-upload-helper-text" helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)." />
    </div>
  );
}

export default FileUpload; // Add default export
