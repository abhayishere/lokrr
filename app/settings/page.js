"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Save } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { API_URL } from '@/config';

export default function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { toast } = useToast();

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a new username"
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`${API_URL}/update-username`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    new_username: newUsername
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update username");
            }

            toast({
                title: "Success",
                description: "Username updated successfully"
            });
            setNewUsername("");
        } catch (error) {
            console.error("Error updating username:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update username"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all password fields"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "New passwords do not match"
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`${API_URL}/update-password`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update password");
            }

            toast({
                title: "Success",
                description: "Password updated successfully"
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update password"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

                <div className="max-w-2xl space-y-8">
                    {/* Username Change Section */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <div className="flex items-center mb-6">
                            <User className="h-5 w-5 text-purple-600 mr-2" />
                            <h2 className="text-xl font-semibold text-white">Change Username</h2>
                        </div>
                        <form onSubmit={handleUsernameChange} className="space-y-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="New Username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Updating...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Save className="h-4 w-4 mr-2" />
                                        Update Username
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <div className="flex items-center mb-6">
                            <Lock className="h-5 w-5 text-purple-600 mr-2" />
                            <h2 className="text-xl font-semibold text-white">Change Password</h2>
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Updating...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Save className="h-4 w-4 mr-2" />
                                        Update Password
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}