import React, { useState, useEffect } from 'react';
import { getMilestones, createMilestone, updateMilestone } from '../services/milestoneApi';
import io from 'socket.io-client';
import { Target, Calendar, TrendingUp, Plus, CheckCircle2 } from 'lucide-react';
import './MilestoneTracker.css';

const socket = io('http://localhost:5000');

const MilestoneTracker = ({ projectId }) => {
    const [milestones, setMilestones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        targetDate: '',
        progress: 0,
    });

    useEffect(() => {
        fetchMilestones();

        socket.emit('join_project', projectId);

        socket.on('milestone_updated', () => {
            fetchMilestones();
        });

        return () => {
            socket.off('milestone_updated');
        };
    }, [projectId]);

    const fetchMilestones = async () => {
        try {
            const data = await getMilestones(projectId);
            setMilestones(data);
        } catch (error) {
            console.error("Error fetching milestones:", error);
        }
    };

    const handleCreateMilestone = async (e) => {
        e.preventDefault();
        try {
            await createMilestone({
                ...newMilestone,
                projectId,
                status: 'not-started',
            });
            socket.emit('milestone_updated', { projectId });
            setNewMilestone({ title: '', description: '', targetDate: '', progress: 0 });
            setShowForm(false);
            fetchMilestones();
        } catch (error) {
            console.error("Error creating milestone:", error);
        }
    };

    const handleUpdateProgress = async (id, newProgress) => {
        try {
            const status = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started';
            await updateMilestone(id, { progress: newProgress, status });
            socket.emit('milestone_updated', { projectId });
            fetchMilestones();
        } catch (error) {
            console.error("Error updating milestone:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'in-progress': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <div className="milestone-tracker">
            <div className="milestone-header">
                <div className="header-left">
                    <Target size={24} />
                    <h2>Project Milestones</h2>
                </div>
                <button className="add-milestone-btn" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Add Milestone
                </button>
            </div>

            {showForm && (
                <form className="milestone-form" onSubmit={handleCreateMilestone}>
                    <input
                        type="text"
                        placeholder="Milestone title"
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                        rows="2"
                    />
                    <input
                        type="date"
                        value={newMilestone.targetDate}
                        onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                    />
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Create Milestone</button>
                        <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            <div className="milestones-list">
                {milestones.length === 0 ? (
                    <div className="empty-state">
                        <Target size={48} />
                        <p>No milestones yet. Create one to track your project progress!</p>
                    </div>
                ) : (
                    milestones.map((milestone) => (
                        <div key={milestone._id} className="milestone-card">
                            <div className="milestone-info">
                                <div className="milestone-title-row">
                                    <h3>{milestone.title}</h3>
                                    {milestone.status === 'completed' && (
                                        <CheckCircle2 size={20} color="#10b981" />
                                    )}
                                </div>
                                {milestone.description && (
                                    <p className="milestone-description">{milestone.description}</p>
                                )}
                                <div className="milestone-meta">
                                    <span className="date">
                                        <Calendar size={14} />
                                        {formatDate(milestone.targetDate)}
                                    </span>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: `${getStatusColor(milestone.status)}20`, color: getStatusColor(milestone.status) }}
                                    >
                                        {milestone.status.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="progress-section">
                                <div className="progress-header">
                                    <span className="progress-label">
                                        <TrendingUp size={14} />
                                        Progress
                                    </span>
                                    <span className="progress-value">{milestone.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${milestone.progress}%`,
                                            backgroundColor: getStatusColor(milestone.status)
                                        }}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={milestone.progress}
                                    onChange={(e) => handleUpdateProgress(milestone._id, parseInt(e.target.value))}
                                    className="progress-slider"
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MilestoneTracker;
