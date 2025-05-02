import { useState, useEffect } from 'react';
import axios from 'axios';
import { decrypt, showAlert } from '../utils';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import CreateItemDialog from './CreateItem';

export default function UserDashboard() {
    
    const navigate = useNavigate()
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectData, setProjectData] = useState(null);
    

    const [showProjectDialog, setShowProjectDialog] = useState(false);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '' });

    useEffect(() => {
        const user = decrypt()
        if (!user?._id) navigate("/")

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/users');
                setUserData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load user data');
                setLoading(false);
                console.error(err);
            }
        };

        fetchUserData();
    }, []);

    
    useEffect(() => {
        const fetchProjectTasks = async () => {
            if (!selectedProject) return;

            try {
                setLoading(true);
                const response = await axios.get(`/api/tasks/${selectedProject._id}`);
                setProjectData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load project tasks');
                setLoading(false);
                console.error(err);
            }
        };

        fetchProjectTasks();
    }, [selectedProject]);

    const handleCreateProject = async () => {
        try {
            const response = await axios.post('/api/users/project', newProject);
            setUserData(response.data.data);
            setShowProjectDialog(false);
            setNewProject({ title: '', description: '' });
            showAlert({
                title: 'Project Created!',
                text: 'Your project was successfully created.',
            });
        } catch (err) {
            setError('Failed to create project');
            console.error(err);
            showAlert({
                title: 'Error',
                text: 'Something went wrong while creating the project.',
                icon: 'error',
            });
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            const response = await axios.delete(`/api/users/project/${projectId}`);
            setUserData(response.data.data);
            showAlert({
                title: 'Project Deleted!',
                text: 'The project was removed.',
            });
        } catch (err) {
            setError('Failed to delete project');
            console.error(err);
            showAlert({
                title: 'Deletion Failed',
                text: 'Unable to delete project.',
                icon: 'error',
            });
        }
    };

    const handleCreateTask = async () => {
        if (!selectedProject) return;

        try {
            const response = await axios.post(`/api/tasks/${selectedProject._id}`, newTask);
            setProjectData(response.data);
            setShowTaskDialog(false);
            setNewTask({ title: '', description: '' });
            showAlert({
                title: 'Task Created!',
                text: 'Your task was successfully created.',
            });
        } catch (err) {
            setError('Failed to create task');
            console.error(err);
            showAlert({
                title: 'Error',
                text: 'Something went wrong while creating the task.',
                icon: 'error',
            });
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
            setProjectData({
                ...projectData,
                data: {
                    ...projectData.data,
                    tasks: projectData.data.tasks.map(task =>
                        task._id === taskId ? { ...task, status: newStatus } : task
                    )
                }
            });
        } catch (err) {
            setError('Failed to update task');
            console.error(err);
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            setProjectData({
                ...projectData,
                data: {
                    ...projectData.data,
                    tasks: projectData.data.tasks.filter(task => task._id !== taskId)
                }
            });
        } catch (err) {
            setError('Failed to delete task');
            console.error(err);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-red-500">
                    <p className="text-xl font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">User Dashboard</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: User Profile and Projects List */}
                    <div className="md:col-span-1 space-y-8">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-blue-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
                                    {userData?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{userData?.name}</h2>
                                    <p className="text-gray-600">{userData?.email}</p>
                                    <p className="text-gray-600">{userData?.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Projects List */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">My Projects</h2>
                                <button
                                    disabled={userData.projects?.length > 4}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 cursor-pointer rounded-md text-sm transition-colors"
                                    onClick={() => setShowProjectDialog(true)}
                                >
                                    New Project
                                </button>
                            </div>

                            <div className="space-y-4">
                                {userData?.projects?.map((project) => (
                                    <div
                                        key={project._id}
                                        className={`border flex justify-between rounded-lg p-4 cursor-pointer transition-colors ${selectedProject && selectedProject._id === project._id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setSelectedProject(project)}
                                    >
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-800">{project.title}</h3>
                                            <p className="text-gray-600 mt-1">{project.description}</p>
                                        </div>
                                        <button
                                            className="h-8 w-8 flex cursor-pointer items-center justify-center text-red-500 hover:bg-red-50 rounded-full"
                                            onClick={() => handleDeleteProject(project._id)}
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                ))}

                                {userData.projects?.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No projects found. Click "New Project" to create one.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Project Details and Tasks */}
                    <div className="md:col-span-2">
                        {selectedProject ? (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selectedProject.title}</h2>
                                        <p className="text-gray-600">{selectedProject.description}</p>
                                    </div>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 cursor-pointer rounded-md text-sm transition-colors"
                                        onClick={() => setShowTaskDialog(true)}
                                    >
                                        New Task
                                    </button>
                                </div>

                                {/* Tasks List */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Tasks</h3>

                                    {projectData && projectData.data.tasks.length > 0 ? (
                                        <div className="space-y-4">
                                            {projectData.data.tasks.map((task) => (
                                                <div key={task._id} className="border border-gray-900/50 rounded-lg p-4">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">{task.title}</h4>
                                                            <p className="text-gray-600 mt-1">{task.description}</p>
                                                            <div className="mt-2 flex items-center">
                                                                <span className="text-sm text-gray-500 mr-2">Status:</span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'done'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : task.status === 'in-progress'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <div className="flex flex-col space-y-2">
                                                                <button
                                                                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-xs"
                                                                    onClick={() => handleUpdateTaskStatus(task._id, 'in-progress')}
                                                                >
                                                                    In Progress
                                                                </button>
                                                                <button
                                                                    className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-md text-xs"
                                                                    onClick={() => handleUpdateTaskStatus(task._id, 'done')}
                                                                >
                                                                    Done
                                                                </button>
                                                            </div>
                                                            <button
                                                                className="h-8 w-8 flex items-center cursor-pointer justify-center text-red-500 hover:bg-red-50 rounded-full"
                                                                onClick={() => handleDeleteTask(task._id)}
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border rounded-lg">
                                            <p className="text-gray-500">No tasks found. Click "New Task" to create one.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
                                <p className="text-gray-500">Select a project to view details and tasks.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Use the reusable dialog component for projects */}
            <CreateItemDialog
                isOpen={showProjectDialog}
                onClose={() => setShowProjectDialog(false)}
                title="Create New Project"
                itemData={newProject}
                setItemData={setNewProject}
                onSubmit={handleCreateProject}
                itemType="Project"
            />

            {/* Use the reusable dialog component for tasks */}
            <CreateItemDialog
                isOpen={showTaskDialog}
                onClose={() => setShowTaskDialog(false)}
                title="Create New Task"
                itemData={newTask}
                setItemData={setNewTask}
                onSubmit={handleCreateTask}
                itemType="Task"
            />
        </div>
    );
}