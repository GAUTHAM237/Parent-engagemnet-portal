const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      enum: ["Term 1", "Term 2", "Term 3"],
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    attendance: {
      present: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
    },
    assessments: [
      {
        type: {
          type: String,
          enum: ["quiz", "test", "exam", "assignment", "project"],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        maxScore: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        feedback: String,
        improvement: String,
      },
    ],
    performance: {
      classRank: Number,
      percentile: Number,
      improvement: Number, // Percentage improvement from last term
      strengths: [String],
      areasForImprovement: [String],
    },
    teacherRemarks: {
      comment: String,
      recommendations: [String],
      date: {
        type: Date,
        default: Date.now,
      },
    },
    parentFeedback: {
      comment: String,
      acknowledged: {
        type: Boolean,
        default: false,
      },
      date: Date,
    },
    extraActivities: [
      {
        activity: String,
        performance: String,
        date: Date,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
progressSchema.index({ studentId: 1, subject: 1, academicYear: 1 });
progressSchema.index({ "assessments.date": -1 });

// Virtual for attendance percentage
progressSchema.virtual("attendancePercentage").get(function () {
  if (this.attendance.total === 0) return 0;
  return (this.attendance.present / this.attendance.total) * 100;
});

// Virtual for average assessment score
progressSchema.virtual("averageAssessmentScore").get(function () {
  if (!this.assessments.length) return 0;
  const sum = this.assessments.reduce(
    (acc, assessment) => acc + (assessment.score / assessment.maxScore) * 100,
    0
  );
  return sum / this.assessments.length;
});

// Methods
progressSchema.methods = {
  // Calculate overall grade
  calculateOverallGrade: function () {
    const assessmentWeight = 0.7;
    const attendanceWeight = 0.3;

    const assessmentScore = this.averageAssessmentScore;
    const attendanceScore = this.attendancePercentage;

    return (
      assessmentScore * assessmentWeight + attendanceScore * attendanceWeight
    );
  },

  // Add new assessment
  addAssessment: function (assessment) {
    this.assessments.push(assessment);
    return this.save();
  },

  // Update attendance
  updateAttendance: function (present, total) {
    this.attendance.present = present;
    this.attendance.total = total;
    this.attendance.percentage = (present / total) * 100;
    return this.save();
  },

  // Add teacher remarks
  addTeacherRemarks: function (remarks) {
    this.teacherRemarks = {
      ...this.teacherRemarks,
      ...remarks,
      date: new Date(),
    };
    return this.save();
  },
};

// Static methods
progressSchema.statics = {
  // Get student's progress across all subjects
  getStudentProgress: function (studentId, academicYear) {
    return this.find({ studentId, academicYear })
      .populate("subject")
      .sort({ subject: 1 });
  },

  // Get class performance for a subject
  getClassPerformance: function (subjectId, academicYear, term) {
    return this.find({ subject: subjectId, academicYear, term })
      .select("grade assessments attendance")
      .populate("studentId", "name");
  },

  // Get term report
  getTermReport: function (studentId, academicYear, term) {
    return this.find({ studentId, academicYear, term })
      .populate("subject")
      .sort({ subject: 1 });
  },
};

// Middleware
progressSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
