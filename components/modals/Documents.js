"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadModal from '@/components/modals/UploadModal';
import DocumentDetailsModal from '@/components/modals/DocumentDetailsModal';
import { Search, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ViewDocumentModal from '@/components/modals/ViewDocumentModal';
import { API_URL } from '@/config';

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const fetchDocuments = useCallback(async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.push("/");
                return;
            }

            const response = await fetch(`${API_URL}/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch documents");
            }

            const data = await response.json();
            setDocuments(data.documents || []); // Ensure documents is always an array
        } catch (error) {
            console.error('Fetch error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load documents"
            });
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, [router, toast]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleRefresh = useCallback(async () => {
        await fetchDocuments();
    }, [fetchDocuments]);

    // Filter documents based on search query
    const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => 
        doc.document_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center space-y-4 mt-12">
            <Upload className="h-16 w-16 text-gray-400" />
            <h3 className="text-2xl font-bold text-white text-center">
                No Documents Found
            </h3>
            <p className="text-gray-400 text-center max-w-md">
                {searchQuery 
                    ? "No documents match your search criteria. Try a different search term."
                    : "Start by uploading your first document using the upload button above."}
            </p>
        </div>
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search documents"
                        className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-400 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <UploadModal onUploadSuccess={handleRefresh} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Recent Documents</h2>
            
            {isLoading ? (
                <div className="text-center text-gray-400 mt-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    Loading documents...
                </div>
            ) : filteredDocuments.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {filteredDocuments.map((doc) => (
                        <div
                            key={doc.document_id}
                            className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-medium mb-1">{doc.document_name}</h3>
                                    <p className="text-gray-400 text-sm">{doc.document_type}</p>
                                </div>
                                <DocumentDetailsModal 
                                    document={doc} 
                                    onDeleteSuccess={handleRefresh}
                                />
                            </div>
                            <div className="flex mt-4 space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:bg-purple-600 hover:text-white"
                                    onClick={() => {
                                        setSelectedDocument(doc);
                                        setIsViewModalOpen(true);
                                    }}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ViewDocumentModal 
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedDocument(null);
                }}
                document={selectedDocument}
            />
        </div>
    );
}