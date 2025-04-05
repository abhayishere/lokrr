import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X, FileText, FileCode } from "lucide-react";
import { API_URL } from '@/config';

export default function ViewDocumentModal({ isOpen, onClose, document }) {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchDocumentContent = async () => {
            if (!document) return;

            try {
                setIsLoading(true);
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(`${API_URL}/get`, {
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
                    throw new Error("Failed to fetch document content");
                }

                const data = await response.json();

                // Handle different file types
                if (data.document_type.startsWith('image/')) {
                    setContent({ type: 'image', url: data.s3_url });
                } else if (data.document_type.startsWith('text/') || 
                          data.document_type.includes('javascript') || 
                          data.document_type.includes('python') || 
                          data.document_type.includes('java') || 
                          data.document_type.includes('html') || 
                          data.document_type.includes('css')) {
                    const contentResponse = await fetch(data.s3_url);
                    const textContent = await contentResponse.text();
                    setContent({ type: 'text', content: textContent });
                } else {
                    setContent({ type: 'other', url: data.s3_url });
                }
            } catch (error) {
                console.error('Error fetching document:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch document content"
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchDocumentContent();
        }
    }, [isOpen, document, toast]);

    const handleViewInNewTab = () => {
        window.open(content.url, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-black border-gray-800">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl text-white">{document?.document_name}</DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:bg-purple-600 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>
                
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : content?.type === 'image' ? (
                        <div className="flex justify-center">
                            <img 
                                src={content.url} 
                                alt={document?.document_name}
                                className="max-h-[70vh] max-w-full object-contain"
                            />
                        </div>
                    ) : content?.type === 'text' ? (
                        <div className="bg-gray-900 p-4 rounded-lg h-[70vh] overflow-auto">
                            <pre className="text-white whitespace-pre-wrap font-mono text-sm">
                                {content.content}
                            </pre>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <FileText className="h-16 w-16 text-gray-400" />
                            <p className="text-gray-400 text-center">
                                Click below to download the file
                            </p>
                            <Button
                                onClick={handleViewInNewTab}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Download File
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 