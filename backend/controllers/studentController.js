
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const StudentAccount = require("../models/StudentAccount");
const StudentProfile = require("../models/StudentProfile");

// =====================================================
// STUDENT REGISTRATION
// POST /api/student/register
// =====================================================

const registerStudent = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingStudent = await StudentAccount.findOne({
            email: normalizedEmail,
        });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered. Please login.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const student = await StudentAccount.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password: passwordHash,
            accountStatus: "ACTIVE",
        });

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                accountStatus: student.accountStatus,
            },
        });

    } catch (error) {
        console.error("STUDENT REGISTRATION ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Student registration failed",
        });
    }
};


// =====================================================
// STUDENT LOGIN
// POST /api/student/login
// =====================================================

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const student = await StudentAccount.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (student.accountStatus !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Your account is suspended",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                role: "STUDENT",
                email: student.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE || "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Student login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                accountStatus: student.accountStatus,
            },
        });

    } catch (error) {
        console.error("STUDENT LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Student login failed",
        });
    }
};


// =====================================================
// GET CURRENT STUDENT
// GET /api/student/me
// =====================================================

const getCurrentStudent = async (req, res) => {
    try {
        const student = await StudentAccount.findById(
            req.student.id
        );

        if (!student || student.accountStatus !== "ACTIVE") {
            return res.status(404).json({
                success: false,
                message: "Active student account not found",
            });
        }

        return res.status(200).json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                accountStatus: student.accountStatus,
            },
        });

    } catch (error) {
        console.error("GET STUDENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student account",
        });
    }
};


// =====================================================
// GET STUDENT PROFILE
// GET /api/student/profile
// =====================================================

const getStudentProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({
            account: req.student.id,
        });

        return res.status(200).json({
            success: true,
            profile: profile || null,
        });

    } catch (error) {
        console.error("GET STUDENT PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile",
        });
    }
};


// =====================================================
// CREATE OR UPDATE STUDENT PROFILE
// PUT /api/student/profile
// =====================================================

const saveStudentProfile = async (req, res) => {
    try {
        const {
            education,
            subjects,
            interests,
            hobbies,
            strengths,
            careerPreferences,
            careerGoalStatus,
        } = req.body;

        const allowedStatuses = [
            "UNDECIDED",
            "EXPLORING",
            "DECIDED",
        ];

        const status = careerGoalStatus || "UNDECIDED";

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career goal status",
            });
        }

        const toStringArray = (value) => {
            if (value === undefined) return undefined;

            if (!Array.isArray(value)) {
                throw new Error("Profile list fields must be arrays");
            }

            return value
                .filter((item) => typeof item === "string")
                .map((item) => item.trim())
                .filter(Boolean);
        };

        const profileData = {
            education: education || {},
            careerGoalStatus: status,
        };

        const fields = {
            subjects,
            interests,
            hobbies,
            strengths,
            careerPreferences,
        };

        for (const [key, value] of Object.entries(fields)) {
            const cleaned = toStringArray(value);

            if (cleaned !== undefined) {
                profileData[key] = cleaned;
            }
        }

        if (
            education !== undefined &&
            (
                typeof education !== "object" ||
                education === null ||
                Array.isArray(education)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Education must be an object",
            });
        }

        const profile = await StudentProfile.findOneAndUpdate(
            { account: req.student.id },
            {
                $set: profileData,
                $setOnInsert: { account: req.student.id },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Student profile saved successfully",
            profile,
        });

    } catch (error) {
        console.error("SAVE STUDENT PROFILE ERROR:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Failed to save student profile",
        });
    }
};


module.exports = {
    registerStudent,
    loginStudent,
    getCurrentStudent,
    getStudentProfile,
    saveStudentProfile,
};
