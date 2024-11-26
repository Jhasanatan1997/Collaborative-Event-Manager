const schedule = require("node-schedule");
const sendEmail = require("./emailService");
const Task = require("../models/Task");

const scheduleReminder = (taskId, reminderTime, email) => {
    const job = schedule.scheduleJob(reminderTime, async () => {
        try {
            const task = await Task.findById(taskId);
            if (task) {
                const subject = `Reminder: ${task.title}`;
                const text = `Hi, just a reminder about your task: ${task.title}. Details: ${task.description}.`;
                await sendEmail(email, subject, text);
                console.log("Reminder sent for task:", task.title);
            } else {
                console.log("Task not found for reminder.");
            }
        } catch (error) {
            console.error("Error sending reminder:", error);
        }
    });

    return job;
};

module.exports = scheduleReminder;