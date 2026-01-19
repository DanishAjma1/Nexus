import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEnterpreneurById, addTeamMember, updateTeamMember, deleteTeamMember } from "../../data/users";
import { Entrepreneur, TeamMember } from "../../types";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Plus, Edit2, Trash2, X, Upload, ArrowLeft, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export const ManageTeam: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [roles, setRoles] = useState(""); // Comma separated string for input
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Predefined roles for dropdown
    const predefinedRoles = [
        "CEO",
        "CTO",
        "CFO",
        "COO",
        "Founder",
        "Co-Founder",
        "Manager",
        "Team Lead",
        "Developer",
        "Designer",
        "Marketing Head",
        "Sales Head",
        "Product Manager",
        "Operations Manager",
        "HR Manager",
        "Advisor",
        "Investor",
        "Board Member",
        "Consultant"
    ];

    const fetchData = async () => {
        if (user?.userId) {
            try {
                const data = await getEnterpreneurById(user.userId);
                setEntrepreneur(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleOpenModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setName(member.name);
            setRoles(member.role.join(", "));
            setPreviewUrl(member.avatarUrl);
        } else {
            setEditingMember(null);
            setName("");
            setRoles("");
            setAvatarFile(null);
            setPreviewUrl("");
        }
        setIsModalOpen(true);
        setShowDropdown(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
        setShowDropdown(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRoleSelect = (role: string) => {
        const currentRoles = roles.split(",").map(r => r.trim()).filter(r => r !== "");
        
        // Check if role already exists
        if (currentRoles.includes(role)) {
            // Remove role if already selected
            const updatedRoles = currentRoles.filter(r => r !== role);
            setRoles(updatedRoles.join(", "));
        } else {
            // Add role
            currentRoles.push(role);
            setRoles(currentRoles.join(", "));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.userId) return;

        const formData = new FormData();
        formData.append("name", name);

        // Split roles by comma and trim
        let rolesArray = roles.split(",").map(r => r.trim()).filter(r => r !== "");
        
        // If no roles are provided, set default role
        if (rolesArray.length === 0) {
            rolesArray = ["Member"];
        }
        
        rolesArray.forEach(r => formData.append("role", r));

        if (avatarFile) {
            formData.append("avatarUrl", avatarFile);
        }

        try {
            if (editingMember) {
                if (editingMember._id) {
                    await updateTeamMember(user.userId, editingMember._id, formData);
                    toast.success("Team member updated successfully");
                }
            } else {
                await addTeamMember(user.userId, formData);
                toast.success("Team member added successfully");
            }
            setIsModalOpen(false);
            fetchData(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Failed to save team member");
        }
    };

    const handleDelete = async (memberId: string) => {
        if (!user?.userId) return;
        if (window.confirm("Are you sure you want to remove this team member?")) {
            try {
                await deleteTeamMember(user.userId, memberId);
                toast.success("Team member removed successfully");
                fetchData();
            } catch (error) {
                console.error(error);
                toast.error("Failed to remove team member");
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to={`/profile/entrepreneur/${user?.userId}`}>
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>Back to Profile</Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Team</h1>
                </div>
                <Button leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
                    Add Team Member
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entrepreneur?.team && entrepreneur.team.length > 0 ? (
                    entrepreneur.team.map((member) => (
                        <Card key={member._id} className="overflow-hidden">
                            <CardBody className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar src={member.avatarUrl} alt={member.name} size="lg" />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {member.role.map((r, idx) => (
                                                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(member)}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => member._id && handleDelete(member._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No team members added yet.</p>
                        <Button variant="outline" className="mt-4" onClick={() => handleOpenModal()}>
                            Add your first team member
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[9999]">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg m-4">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-6">
                            {editingMember ? "Edit Team Member" : "Add Team Member"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div className="flex flex-col items-center justify-center mb-6">
                                <div className="relative w-24 h-24 mb-2">
                                    <Avatar src={previewUrl || ""} alt="Preview" size="xl" />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm hover:bg-gray-50"
                                    >
                                        <Upload size={14} className="text-gray-600" />
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-gray-500">Click icon to upload photo</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Roles (select from dropdown or type separated by commas)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={roles}
                                        onChange={(e) => setRoles(e.target.value)}
                                        onClick={() => setShowDropdown(true)}
                                        className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="e.g. CEO, CTO or type custom role"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                                
                                {/* Selected roles preview */}
                                {roles && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {roles.split(",").map(r => r.trim()).filter(r => r !== "").map((role, idx) => (
                                            <span 
                                                key={idx} 
                                                className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full flex items-center gap-1"
                                            >
                                                {role}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRoleSelect(role)}
                                                    className="text-primary-600 hover:text-primary-800"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-500 font-medium">Predefined Roles</p>
                                        </div>
                                        {predefinedRoles.map((role, index) => {
                                            const isSelected = roles.split(",").map(r => r.trim()).includes(role);
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => handleRoleSelect(role)}
                                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${isSelected ? 'bg-primary-50' : ''}`}
                                                >
                                                    <span className={isSelected ? 'text-primary-700 font-medium' : 'text-gray-700'}>
                                                        {role}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="text-primary-600">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <div className="p-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">Click roles to select/deselect. You can also type custom roles.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingMember ? "Save Changes" : "Add Member"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};