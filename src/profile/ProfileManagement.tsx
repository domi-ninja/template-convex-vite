import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function ProfileManagement() {
    const user = useQuery(api.users.getUserAndAuthAccount);
    const updateProfile = useMutation(api.users.updateProfile);
    const deleteAccount = useMutation(api.users.deleteAccount);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    // Initialize/refresh form data when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    // Merged view of formData and user
    const mergedProfile = {
        name: formData.name || user?.name || "",
        email: formData.email || user?.email || "",
    };

    const handleSave = async () => {
        try {
            const payload: { name?: string; email?: string } = {
                name: formData.name || undefined,
            };
            // Only send email if provider is email
            if (user?.provider === "email") {
                payload.email = formData.email || undefined;
            }
            await updateProfile(payload);
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Profile update error:", error);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            });
        }
        setIsEditing(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "DELETE") {
            toast.error("Please type DELETE to confirm account deletion");
            return;
        }

        try {
            await deleteAccount();
            toast.success("Account deleted successfully");
            // The user will be automatically logged out
        } catch (error) {
            toast.error("Failed to delete account");
            console.error("Account deletion error:", error);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Update your personal details and contact information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        {isEditing ? (
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your name"
                            />
                        ) : (
                            <div className="text-sm py-2 px-3 bg-muted rounded-md">
                                {mergedProfile.name || "No name set"}
                            </div>
                        )}
                    </div>

                    {/* Removed debug render that could print non-primitive values */}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        {isEditing ? (
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={user?.provider !== "email"}
                                placeholder="Enter your email"
                            />
                        ) : (
                            <div className="text-sm py-2 px-3 bg-muted rounded-md">
                                {mergedProfile.email || "No email set"}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button onClick={() => void handleSave()}>Save Changes</Button>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isDeleting ? (
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleting(true)}
                        >
                            Delete Account
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800 mb-2">
                                    <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and all associated data including:
                                </p>
                                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                                    <li>All your data</li>
                                    <li>Your profile information</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="delete-confirmation" className="text-sm font-medium">
                                    Type <strong>DELETE</strong> to confirm:
                                </label>
                                <Input
                                    id="delete-confirmation"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="DELETE"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    onClick={() => void handleDeleteAccount()}
                                    disabled={deleteConfirmation !== "DELETE"}
                                >
                                    I understand, delete my account
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDeleting(false);
                                        setDeleteConfirmation("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
