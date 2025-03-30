import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentDetailsModal({ document, onDeleteSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document_id: document.document_id
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      // Close the modal and refresh the document list
      setIsOpen(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete document",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white border-gray-800 max-w-xl w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Document Details</DialogTitle>
        </DialogHeader>
        
        <div className="bg-gray-900/50 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-gray-400" />
            <div className="space-y-1 flex-1">
              <div className="text-base text-gray-400">
                {document.document_name}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{document.document_type}</span>
                <span>•</span>
                <span>{document.size || 'Size not available'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="text-base text-gray-400 mb-2">Tags</h4>
            <div className="text-gray-400">No tags</div>
          </div>

          <div>
            <h4 className="text-base text-gray-400 mb-2">Description</h4>
            <div className="bg-gray-900/50 rounded-lg p-4 text-gray-400 min-h-[100px]">
              No description provided.
            </div>
          </div>

          <Button 
            variant="destructive" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-base"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}