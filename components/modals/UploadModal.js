"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from '@/config';

export default function UploadModal({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("tags", tags);
      formData.append("description", description);

      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      await response.json();
      
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });

      // Reset form and close modal
      setSelectedFile(null);
      setTags("");
      setDescription("");
      setIsOpen(false);

      // Call onUploadSuccess to refresh the documents list
      if (onUploadSuccess) {
        await onUploadSuccess();
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-purple-600 hover:text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl text-white">Upload Document</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div 
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mt-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-white">Drag and drop a document here, or</p>
            <label className="cursor-pointer">
              <Input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <span className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                Upload File
              </span>
            </label>
            {selectedFile && (
              <p className="text-sm text-gray-400">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-gray-400">Tags</label>
            <Input
              placeholder="Enter tags"
              className="mt-1 bg-gray-900 border-gray-800 text-white"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Description</label>
            <Textarea
              placeholder="Enter description"
              className="mt-1 bg-gray-900 border-gray-800 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}