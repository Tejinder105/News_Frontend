import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Globe, Share2, Mail, Image as ImageIcon, CheckCircle, AlertCircle, Users } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import Input from "../../Components/Ui/Input";
import Button from "../../Components/Ui/Button";
import SectionHeading from "../../Components/Ui/SectionHeading";
import adminService from "../../Services/adminService";

function Settings() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const { register, handleSubmit, setValue } = useForm();
    const { getAccessTokenSilently } = useAuth0();

    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                setToken(accessToken);
            } catch (error) {
                console.error("Error getting token:", error);
            }
        };
        fetchToken();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!token) return;
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
                // Don't block the UI if settings fetch fails
                // User can still update settings
            } finally {
                setFetchLoading(false);
            }
        };
        fetchSettings();
    }, [setValue, token]);

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

    const [userEmail, setUserEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState("user");
    const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);

    const handleRoleUpdate = async (e) => {
        e.preventDefault();
        if (!userEmail.trim()) {
            setMessage({ type: "error", text: "Please enter a valid email address" });
            return;
        }

        setRoleUpdateLoading(true);
        setMessage(null);
        try {
            await adminService.updateUserRoleByEmail(userEmail, selectedRole, token);
            setMessage({ type: "success", text: `Role updated successfully for ${userEmail}` });
            setUserEmail("");
            setSelectedRole("user");
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error("Failed to update role", err);
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update user role" });
        } finally {
            setRoleUpdateLoading(false);
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
                            <p className="text-sm text-gray-600 mb-6">Update user roles by entering their email address</p>

                            <form onSubmit={handleRoleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        User Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        required
                                        disabled={roleUpdateLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign Role
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={roleUpdateLoading}
                                    >
                                        <option value="user">User</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    loading={roleUpdateLoading}
                                    iconLeft={<Save size={18} />}
                                >
                                    Update Role
                                </Button>
                            </form>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <h4 className="text-sm font-semibold text-blue-900 mb-2">Role Descriptions:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li><strong>User:</strong> Can view published articles</li>
                                    <li><strong>Editor:</strong> Can create and edit articles</li>
                                    <li><strong>Admin:</strong> Full access to all features</li>
                                </ul>
                            </div>
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
