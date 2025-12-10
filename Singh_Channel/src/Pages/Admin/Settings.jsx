import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Globe, Share2, Mail, Image as ImageIcon, CheckCircle, AlertCircle, Users } from "lucide-react";
import Input from "../../Components/Ui/Input";
import Button from "../../Components/Ui/Button";
import SectionHeading from "../../Components/Ui/SectionHeading";
import adminService from "../../Services/adminService";
// import { useAuth } from "../../hooks/useAuth"; // Assuming hook exists, checking snippet later.
// Using local storage for token if useAuth not obvious, or I'll try to find it.
// Checking Sidebar again, it doesn't show auth usage clearly but likely passed down or in context.
// Re-checking AdminLayout.

function Settings() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const { register, handleSubmit, setValue, reset } = useForm();

    // Get token from localStorage for now as common pattern
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await adminService.getSettings();
                if (data) {
                    // Flatten the object for form if needed, but our model is flat.
                    Object.keys(data).forEach((key) => {
                        setValue(key, data[key]);
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchSettings();
    }, [setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage(null);
        try {
            if (!token) {
                throw new Error("No access token found");
            }
            await adminService.updateSettings(data, token);
            setMessage({ type: "success", text: "Settings updated successfully!" });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to update settings. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const data = await adminService.getAllUsers({ token, limit: 100 });
            setUsers(data.users || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "team" && token) {
            fetchUsers();
        }
    }, [activeTab, token]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole, token);
            // Optimistic update or refetch
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setMessage({ type: "success", text: "User role updated successfully" });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error("Failed to update role", err);
            setMessage({ type: "error", text: "Failed to update user role" });
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "seo", label: "SEO", icon: <ImageIcon size={18} /> }, // Using ImageIcon as placeholder or Search
        { id: "social", label: "Social", icon: <Share2 size={18} /> },
        { id: "contact", label: "Contact", icon: <Mail size={18} /> },
        { id: "team", label: "Team", icon: <Users size={18} /> },
    ];

    if (fetchLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <SectionHeading title="Settings" />

            <div className="mt-6 flex flex-col md:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">

                        {message && (
                            <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* General Settings */}
                        <div className={activeTab === "general" ? "block" : "hidden"}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">General Settings</h3>
                            <div className="space-y-4">
                                <Input label="Site Name" {...register("siteName")} placeholder="e.g. Singh Channel" />
                                <Input label="Site Description" {...register("siteDescription")} placeholder="Short description of your site" />
                                <Input label="Footer Text" {...register("footerText")} placeholder="© 2024..." />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Logo URL" {...register("logo")} placeholder="https://..." />
                                    <Input label="Favicon URL" {...register("favicon")} placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        {/* SEO Settings */}
                        <div className={activeTab === "seo" ? "block" : "hidden"}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">SEO Configuration</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Meta Keywords</label>
                                    <textarea
                                        {...register("metaKeywords")}
                                        className="w-full px-3 py-2 rounded-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                        placeholder="news, updates, daily, ..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Meta Description</label>
                                    <textarea
                                        {...register("metaDescription")}
                                        className="w-full px-3 py-2 rounded-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                        placeholder="Detailed description for search engines..."
                                    />
                                </div>
                                <Input label="Google Analytics ID" {...register("googleAnalyticsId")} placeholder="UA-XXXXXXXXX-X" />
                            </div>
                        </div>

                        {/* Social Settings */}
                        <div className={activeTab === "social" ? "block" : "hidden"}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Social Media Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Facebook" {...register("facebook")} placeholder="https://facebook.com/..." />
                                <Input label="Twitter (X)" {...register("twitter")} placeholder="https://x.com/..." />
                                <Input label="Instagram" {...register("instagram")} placeholder="https://instagram.com/..." />
                                <Input label="LinkedIn" {...register("linkedin")} placeholder="https://linkedin.com/in/..." />
                                <Input label="YouTube" {...register("youtube")} placeholder="https://youtube.com/..." />
                            </div>
                        </div>

                        {/* Contact Settings */}
                        <div className={activeTab === "contact" ? "block" : "hidden"}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h3>
                            <div className="space-y-4">
                                <Input label="Email Address" type="email" {...register("email")} placeholder="contact@example.com" />
                                <Input label="Phone Number" {...register("phone")} placeholder="+1 234 567 890" />
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        {...register("address")}
                                        className="w-full px-3 py-2 rounded-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                        placeholder="123 News Street, City, Country"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Team Settings */}
                        <div className={activeTab === "team" ? "block" : "hidden"}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Team Management</h3>

                            {usersLoading ? (
                                <div className="text-center py-8 text-gray-500">Loading users...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-600 text-sm">
                                                <th className="py-2 px-2">Name</th>
                                                <th className="py-2 px-2">Email</th>
                                                <th className="py-2 px-2">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-3 px-2 font-medium text-gray-800">{user.name}</td>
                                                    <td className="py-3 px-2 text-gray-600 text-sm">{user.email}</td>
                                                    <td className="py-3 px-2">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                                            className="px-2 py-1 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                                                            disabled={user._id === "current_user_id_placeholder" /* Add current user check logic if needed */}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="editor">Editor</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length === 0 && <p className="text-center py-4 text-gray-500">No users found.</p>}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button type="submit" loading={loading} iconLeft={<Save size={18} />}>
                                Save Changes
                            </Button>
                        </div>

                    </form>
                </div>
            </div >
        </div >
    );
}

export default Settings;
