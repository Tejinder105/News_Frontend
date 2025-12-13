import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Globe, Share2, Mail, Image as ImageIcon, CheckCircle, AlertCircle, Users, Megaphone, Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
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
        { id: "ads", label: "Advertisements", icon: <Megaphone size={18} /> },
    ];

    // Advertisement state
    const [advertisements, setAdvertisements] = useState([]);
    const [adsLoading, setAdsLoading] = useState(false);
    const [showAdForm, setShowAdForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [adForm, setAdForm] = useState({
        name: "",
        headline: "",
        description: "",
        image: "",
        link: "",
        tag: "Shop Now",
        placement: "sidebar",
        isActive: true,
        priority: 0,
    });

    const fetchAdvertisements = async () => {
        setAdsLoading(true);
        try {
            const data = await adminService.getAdvertisements(token);
            setAdvertisements(data || []);
        } catch (err) {
            console.error("Failed to fetch advertisements", err);
            setMessage({ type: "error", text: "Failed to fetch advertisements" });
        } finally {
            setAdsLoading(false);
        }
    };

    // Fetch advertisements when ads tab is active
    useEffect(() => {
        if (activeTab === "ads" && token) {
            fetchAdvertisements();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, token]);

    const handleAdFormChange = (field, value) => {
        setAdForm(prev => ({ ...prev, [field]: value }));
    };

    const resetAdForm = () => {
        setAdForm({
            name: "",
            headline: "",
            description: "",
            image: "",
            link: "",
            tag: "Shop Now",
            placement: "sidebar",
            isActive: true,
            priority: 0,
        });
        setEditingAd(null);
        setShowAdForm(false);
    };

    const handleEditAd = (ad) => {
        setAdForm({
            name: ad.name,
            headline: ad.headline,
            description: ad.description || "",
            image: ad.image,
            link: ad.link,
            tag: ad.tag || "Shop Now",
            placement: ad.placement || "sidebar",
            isActive: ad.isActive,
            priority: ad.priority || 0,
        });
        setEditingAd(ad);
        setShowAdForm(true);
    };

    const handleSaveAd = async (e) => {
        e.preventDefault();
        setAdsLoading(true);
        setMessage(null);
        
        try {
            if (editingAd) {
                await adminService.updateAdvertisement(editingAd._id, adForm, token);
                setMessage({ type: "success", text: "Advertisement updated successfully!" });
            } else {
                await adminService.createAdvertisement(adForm, token);
                setMessage({ type: "success", text: "Advertisement created successfully!" });
            }
            resetAdForm();
            fetchAdvertisements();
        } catch (err) {
            console.error("Failed to save advertisement", err);
            setMessage({ type: "error", text: "Failed to save advertisement" });
        } finally {
            setAdsLoading(false);
        }
    };

    const handleDeleteAd = async (id) => {
        if (!window.confirm("Are you sure you want to delete this advertisement?")) return;
        
        setAdsLoading(true);
        try {
            await adminService.deleteAdvertisement(id, token);
            setMessage({ type: "success", text: "Advertisement deleted successfully!" });
            fetchAdvertisements();
        } catch (err) {
            console.error("Failed to delete advertisement", err);
            setMessage({ type: "error", text: "Failed to delete advertisement" });
        } finally {
            setAdsLoading(false);
        }
    };

    const handleToggleAdStatus = async (ad) => {
        try {
            await adminService.updateAdvertisement(ad._id, { isActive: !ad.isActive }, token);
            fetchAdvertisements();
        } catch (err) {
            console.error("Failed to toggle ad status", err);
        }
    };

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

                        {/* Advertisements Settings */}
                        <div className={activeTab === "ads" ? "block" : "hidden"}>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h3 className="text-lg font-semibold text-gray-800">Advertisement Management</h3>
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        resetAdForm();
                                        setShowAdForm(true);
                                    }}
                                    iconLeft={<Plus size={16} />}
                                >
                                    Add New
                                </Button>
                            </div>

                            {/* Ad Form Modal/Inline */}
                            {showAdForm && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-md font-semibold text-gray-700 mb-4">
                                        {editingAd ? "Edit Advertisement" : "Create New Advertisement"}
                                    </h4>
                                    <form onSubmit={handleSaveAd} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Name *"
                                                value={adForm.name}
                                                onChange={(e) => handleAdFormChange("name", e.target.value)}
                                                placeholder="Ad name (internal)"
                                                required
                                            />
                                            <Input
                                                label="Headline *"
                                                value={adForm.headline}
                                                onChange={(e) => handleAdFormChange("headline", e.target.value)}
                                                placeholder="Catchy headline"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                value={adForm.description}
                                                onChange={(e) => handleAdFormChange("description", e.target.value)}
                                                className="w-full px-3 py-2 rounded-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                                                placeholder="Short description..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Image URL *"
                                                value={adForm.image}
                                                onChange={(e) => handleAdFormChange("image", e.target.value)}
                                                placeholder="https://..."
                                                required
                                            />
                                            <Input
                                                label="Link URL *"
                                                value={adForm.link}
                                                onChange={(e) => handleAdFormChange("link", e.target.value)}
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                                <select
                                                    value={adForm.tag}
                                                    onChange={(e) => handleAdFormChange("tag", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="Shop Now">Shop Now</option>
                                                    <option value="Learn More">Learn More</option>
                                                    <option value="Visit Site">Visit Site</option>
                                                    <option value="Get Started">Get Started</option>
                                                    <option value="Contact Us">Contact Us</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Placement</label>
                                                <select
                                                    value={adForm.placement}
                                                    onChange={(e) => handleAdFormChange("placement", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="sidebar">Sidebar</option>
                                                    <option value="inline">Inline (Article)</option>
                                                    <option value="header">Header</option>
                                                    <option value="footer">Footer</option>
                                                    <option value="all">All Placements</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                                <input
                                                    type="number"
                                                    value={adForm.priority}
                                                    onChange={(e) => handleAdFormChange("priority", parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="adActive"
                                                checked={adForm.isActive}
                                                onChange={(e) => handleAdFormChange("isActive", e.target.checked)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                            />
                                            <label htmlFor="adActive" className="text-sm text-gray-700">Active (visible to users)</label>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button type="submit" loading={adsLoading} iconLeft={<Save size={16} />}>
                                                {editingAd ? "Update" : "Create"}
                                            </Button>
                                            <Button type="button" variant="secondary" onClick={resetAdForm}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Advertisements List */}
                            {adsLoading && !showAdForm ? (
                                <div className="flex justify-center py-8">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                                </div>
                            ) : advertisements.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No advertisements yet. Create your first one!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {advertisements.map((ad) => (
                                        <div
                                            key={ad._id}
                                            className={`flex items-center gap-4 p-4 rounded-lg border ${ad.isActive ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200 opacity-60"}`}
                                        >
                                            <img
                                                src={ad.image}
                                                alt={ad.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900 truncate">{ad.name}</h4>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${ad.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                                        {ad.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                        {ad.placement}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{ad.headline}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Clicks: {ad.clicks || 0} • Impressions: {ad.impressions || 0}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleAdStatus(ad)}
                                                    className={`p-2 rounded-lg hover:bg-gray-100 ${ad.isActive ? "text-green-600" : "text-gray-400"}`}
                                                    title={ad.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    {ad.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleEditAd(ad)}
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAd(ad._id)}
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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
