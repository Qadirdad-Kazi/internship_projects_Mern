const Milestone = require('../models/Milestone');

exports.getMilestones = async (req, res) => {
    try {
        const { projectId } = req.params;
        const milestones = await Milestone.find({ projectId }).sort({ targetDate: 1 });
        res.json(milestones);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMilestone = async (req, res) => {
    try {
        const newMilestone = new Milestone(req.body);
        const savedMilestone = await newMilestone.save();
        res.status(201).json(savedMilestone);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateMilestone = async (req, res) => {
    try {
        const updatedMilestone = await Milestone.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedMilestone);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMilestone = async (req, res) => {
    try {
        await Milestone.findByIdAndDelete(req.params.id);
        res.json({ message: 'Milestone deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
