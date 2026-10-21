const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const Intern = require('./models/interns');
const Task = require('./models/tasks');
const Project = require('./models/projects');
const Attendance = require('./models/attendence');
const WorkReport = require('./models/work_reports');
const Feedback = require('./models/feedback');

app.use(expressjson());
app.use(cors);


app.get('/',(req,res)=>{
    res.send("The working of the InternHub");
});

//CRUD operations

//GET ALL INTERNS 

// view ALL INTERNS
app.get('/interns', async (req, res) => {
    try {
        const interns = await Intern.findAll();

        res.status(200).json({
            message: "All interns have been found",
            data: interns
        });

    } catch (error) {
        res.status(500).json({
            message: "Can't find relevant entries",
            error: error.message
        });
    }
});

//add interns
app.post('/interns', async (req, res) => {
    try {
        const intern = await Intern.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            course: req.body.course,
            department: req.body.department,
            joining_date: req.body.joining_date
        });

        res.status(201).json({
            message: "Intern has been added",
            data: intern
        });

    } catch (error) {
        res.status(500).json({
            message: "Intern cannot be added",
            error: error.message
        });
    }
});
//edit or update using put

app.put('/interns/:id', async (req, res) => {
    try {
        const intern = await Intern.findByPk(req.params.id);

        if (!intern) {
            return res.status(404).json({
                message: "Intern not found"
            });
        }

        await intern.update({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            course: req.body.course,
            department: req.body.department,
            joining_date: req.body.joining_date
        });

        res.status(200).json({
            message: "Data is updated successfully",
            data: intern
        });

    } catch (error) {
        res.status(500).json({
            message: "Data could not be updated",
            error: error.message
        });
    }
});

///Data has been delete 


app.delete('/interns/:id', async (req, res) => {
    try {
        const intern = await Intern.findByPk(req.params.id);

        if (!intern) {
            return res.status(404).json({
                message: "Intern not found"
            });
        }

        await intern.destroy();

        res.status(200).json({
            message: "Intern has been deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Data cannot be deleted",
            error: error.message
        });
    }
});

// CRUD operations for Tasks

// CREATE TASK
app.post('/tasks', async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            intern_id: req.body.intern_id,
            project_id: req.body.project_id
        });

        res.status(201).json({
            message: "Task has been created",
            data: task
        });

    } catch (error) {
        res.status(500).json({
            message: "Task cannot be created",
            error: error.message
        });
    }
});

// GET ALL TASKS
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();

        res.status(200).json({
            message: "All tasks have been found",
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Tasks cannot be found",
            error: error.message
        });
    }
});


// UPDATE TASK
app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            intern_id: req.body.intern_id,
            project_id: req.body.project_id
        });

        res.status(200).json({
            message: "Task has been updated",
            data: task
        });

    } catch (error) {
        res.status(500).json({
            message: "Task cannot be updated",
            error: error.message
        });
    }
});


// DELETE TASK
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.destroy();

        res.status(200).json({
            message: "Task has been deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Task cannot be deleted",
            error: error.message
        });
    }
});


// CRUD Functions for 
// CREATE PROJECT
app.post('/projects', async (req, res) => {
    try {
        const project = await Project.create({
            project_name: req.body.project_name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            status: req.body.status
        });

        res.status(201).json({
            message: "Project has been created",
            data: project
        });

    } catch (error) {
        res.status(500).json({
            message: "Project cannot be created",
            error: error.message
        });
    }
});

// GET ALL PROJECTS
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll();

        res.status(200).json({
            message: "All projects have been found",
            data: projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Projects cannot be found",
            error: error.message
        });
    }
});


// UPDATE PROJECT
app.put('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        await project.update({
            project_name: req.body.project_name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            status: req.body.status
        });

        res.status(200).json({
            message: "Project has been updated",
            data: project
        });

    } catch (error) {
        res.status(500).json({
            message: "Project cannot be updated",
            error: error.message
        });
    }
});


// DELETE PROJECT
app.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        await project.destroy();

        res.status(200).json({
            message: "Project has been deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Project cannot be deleted",
            error: error.message
        });
    }
});


// RECORD ATTENDANCE
app.post('/attendance', async (req, res) => {
    try {
        const attendance = await Attendance.create({
            intern_id: req.body.intern_id,
            attendance_date: req.body.attendance_date,
            status: req.body.status
        });

        res.status(201).json({
            message: "Attendance has been recorded",
            data: attendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Attendance cannot be recorded",
            error: error.message
        });
    }
});


// GET ALL ATTENDANCE
app.get('/attendance', async (req, res) => {
    try {
        const attendance = await Attendance.findAll();

        res.status(200).json({
            message: "Attendance records have been found",
            data: attendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Attendance cannot be found",
            error: error.message
        });
    }
});


// UPDATE ATTENDANCE
app.put('/attendance/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findByPk(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        await attendance.update({
            intern_id: req.body.intern_id,
            attendance_date: req.body.attendance_date,
            status: req.body.status
        });

        res.status(200).json({
            message: "Attendance has been updated",
            data: attendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Attendance cannot be updated",
            error: error.message
        });
    }
});

// DELETE ATTENDANCE
app.delete('/attendance/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findByPk(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        await attendance.destroy();

        res.status(200).json({
            message: "Attendance has been deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Attendance cannot be deleted",
            error: error.message
        });
    }
});

// CREATE WORK REPORT
app.post('/work-reports', async (req, res) => {
    try {
        const report = await WorkReport.create({
            intern_id: req.body.intern_id,
            report_title: req.body.report_title,
            description: req.body.description,
            report_date: req.body.report_date
        });

        res.status(201).json({
            message: "Work report has been submitted",
            data: report
        });

    } catch (error) {
        res.status(500).json({
            message: "Work report cannot be submitted",
            error: error.message
        });
    }
});


// GET ALL WORK REPORTS
app.get('/work-reports', async (req, res) => {
    try {
        const reports = await WorkReport.findAll();

        res.status(200).json({
            message: "All work reports have been found",
            data: reports
        });

    } catch (error) {
        res.status(500).json({
            message: "Work reports cannot be found",
            error: error.message
        });
    }
});


// UPDATE WORK REPORT
app.put('/work-reports/:id', async (req, res) => {
    try {
        const report = await WorkReport.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Work report not found"
            });
        }

        await report.update({
            intern_id: req.body.intern_id,
            report_title: req.body.report_title,
            description: req.body.description,
            report_date: req.body.report_date
        });

        res.status(200).json({
            message: "Work report has been updated",
            data: report
        });

    } catch (error) {
        res.status(500).json({
            message: "Work report cannot be updated",
            error: error.message
        });
    }
});


// DELETE WORK REPORT
app.delete('/work-reports/:id', async (req, res) => {
    try {
        const report = await WorkReport.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Work report not found"
            });
        }

        await report.destroy();

        res.status(200).json({
            message: "Work report has been deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Work report cannot be deleted",
            error: error.message
        });
    }
});

// CREATE FEEDBACK
app.post('/feedback', async (req, res) => {
    try {
        const feedback = await Feedback.create({
            intern_id: req.body.intern_id,
            feedback_text: req.body.feedback_text,
            rating: req.body.rating,
            feedback_date: req.body.feedback_date
        });

        res.status(201).json({
            message: "Feedback has been added",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Feedback cannot be added",
            error: error.message
        });
    }
});

// GET ALL FEEDBACK
app.get('/feedback', async (req, res) => {
    try {
        const feedback = await Feedback.findAll();

        res.status(200).json({
            message: "All feedback has been found",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Feedback cannot be found",
            error: error.message
        });
    }
});

// UPDATE FEEDBACK
app.put('/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        await feedback.update({
            intern_id: req.body.intern_id,
            feedback_text: req.body.feedback_text,
            rating: req.body.rating,
            feedback_date: req.body.feedback_date
        });

        res.status(200).json({
            message: "Feedback has been updated",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Feedback cannot be updated",
            error: error.message
        });
    }
});

// DELETE FEEDBACK
app.delete('/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        await feedback.destroy();

        res.status(200).json({
            message: "Feedback has been deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Feedback cannot be deleted",
            error: error.message
        });
    }
});


sequelize.authenticate()
    .then(() => {
        console.log("DataBase is connected");
        console.log("This will run on http://localhost:3000");
    })
    .catch((error) => {
        console.log("The server is not connecting");
        console.log(error);
    });

