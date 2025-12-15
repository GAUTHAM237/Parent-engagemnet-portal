const Progress = require("../models/Progress");
const Student = require("../models/Student");
const User = require("../models/User");

// Get student's overall progress
const getOverallProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user.userId;

    // Verify parent has access to this student
    const parent = await User.findById(parentId);
    if (!parent.children.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's progress" });
    }

    const progress = await Progress.find({ studentId })
      .populate("subject", "name")
      .sort({ date: -1 });

    // Calculate overall statistics
    const overallStats = {
      averageGrade: 0,
      totalSubjects: 0,
      improvement: 0,
      attendance: 0,
    };

    if (progress.length > 0) {
      overallStats.averageGrade =
        progress.reduce((acc, curr) => acc + curr.grade, 0) / progress.length;
      overallStats.totalSubjects = new Set(
        progress.map((p) => p.subject._id)
      ).size;
      overallStats.attendance =
        progress.reduce((acc, curr) => acc + curr.attendance, 0) /
        progress.length;
    }

    res.json({
      student: await Student.findById(studentId),
      progress,
      overallStats,
    });
  } catch (error) {
    console.error("Get overall progress error:", error);
    res
      .status(500)
      .json({ message: "Error fetching progress", error: error.message });
  }
};

// Get progress by subject
const getSubjectProgress = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const parentId = req.user.userId;

    // Verify parent has access
    const parent = await User.findById(parentId);
    if (!parent.children.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's progress" });
    }

    const progress = await Progress.find({
      studentId,
      subject: subjectId,
    })
      .populate("subject", "name")
      .sort({ date: -1 });

    // Calculate subject statistics
    const subjectStats = {
      averageGrade: 0,
      highestGrade: 0,
      lowestGrade: 100,
      improvement: 0,
      attendance: 0,
    };

    if (progress.length > 0) {
      subjectStats.averageGrade =
        progress.reduce((acc, curr) => acc + curr.grade, 0) / progress.length;
      subjectStats.highestGrade = Math.max(...progress.map((p) => p.grade));
      subjectStats.lowestGrade = Math.min(...progress.map((p) => p.grade));
      subjectStats.attendance =
        progress.reduce((acc, curr) => acc + curr.attendance, 0) /
        progress.length;

      // Calculate improvement
      const oldestGrade = progress[progress.length - 1].grade;
      const newestGrade = progress[0].grade;
      subjectStats.improvement = newestGrade - oldestGrade;
    }

    res.json({
      subject: await Subject.findById(subjectId),
      progress,
      subjectStats,
    });
  } catch (error) {
    console.error("Get subject progress error:", error);
    res.status(500).json({
      message: "Error fetching subject progress",
      error: error.message,
    });
  }
};

// Get attendance records
const getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user.userId;

    // Verify parent has access
    const parent = await User.findById(parentId);
    if (!parent.children.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this attendance" });
    }

    const attendance = await Progress.find({ studentId })
      .select("date attendance subject")
      .populate("subject", "name")
      .sort({ date: -1 });

    const attendanceStats = {
      overallAttendance: 0,
      totalDays: attendance.length,
      presentDays: 0,
      absentDays: 0,
    };

    if (attendance.length > 0) {
      attendanceStats.presentDays = attendance.filter(
        (a) => a.attendance === 1
      ).length;
      attendanceStats.absentDays =
        attendance.length - attendanceStats.presentDays;
      attendanceStats.overallAttendance =
        (attendanceStats.presentDays / attendance.length) * 100;
    }

    res.json({
      attendance,
      attendanceStats,
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
};

// Get assessment results
const getAssessments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user.userId;

    // Verify parent has access
    const parent = await User.findById(parentId);
    if (!parent.children.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these assessments" });
    }

    const assessments = await Progress.find({
      studentId,
      assessmentType: { $exists: true },
    })
      .populate("subject", "name")
      .sort({ date: -1 });

    const assessmentStats = {
      totalAssessments: assessments.length,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 100,
    };

    if (assessments.length > 0) {
      assessmentStats.averageScore =
        assessments.reduce((acc, curr) => acc + curr.grade, 0) /
        assessments.length;
      assessmentStats.highestScore = Math.max(
        ...assessments.map((a) => a.grade)
      );
      assessmentStats.lowestScore = Math.min(
        ...assessments.map((a) => a.grade)
      );
    }

    res.json({
      assessments,
      assessmentStats,
    });
  } catch (error) {
    console.error("Get assessments error:", error);
    res
      .status(500)
      .json({ message: "Error fetching assessments", error: error.message });
  }
};

// Get progress report
const getProgressReport = async (req, res) => {
  try {
    const { studentId, term } = req.params;
    const parentId = req.user.userId;

    // Verify parent has access
    const parent = await User.findById(parentId);
    if (!parent.children.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this report" });
    }

    const report = await Progress.find({
      studentId,
      term,
    })
      .populate("subject", "name")
      .sort({ subject: 1 });

    const reportStats = {
      termAverage: 0,
      totalSubjects: 0,
      passedSubjects: 0,
      needsImprovement: [],
    };

    if (report.length > 0) {
      reportStats.termAverage =
        report.reduce((acc, curr) => acc + curr.grade, 0) / report.length;
      reportStats.totalSubjects = report.length;
      reportStats.passedSubjects = report.filter((r) => r.grade >= 40).length;
      reportStats.needsImprovement = report
        .filter((r) => r.grade < 40)
        .map((r) => ({
          subject: r.subject.name,
          grade: r.grade,
        }));
    }

    res.json({
      student: await Student.findById(studentId),
      report,
      reportStats,
    });
  } catch (error) {
    console.error("Get progress report error:", error);
    res.status(500).json({
      message: "Error fetching progress report",
      error: error.message,
    });
  }
};

module.exports = {
  getOverallProgress,
  getSubjectProgress,
  getAttendance,
  getAssessments,
  getProgressReport,
};
