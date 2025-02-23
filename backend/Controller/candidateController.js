const candidateModel = require("../Model/candidateModel");

const addCandidate = async (req, res) => {
    try {
        const { name, email, phone, position } = req.body;
        const existingCandidate = await candidateModel.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ message: "Candidate already exists" });
        }
        const newCandidate = await candidateModel.create({
            name,
            email,
            phone,
            position
        });
        res.status(201).json({
            message: "Candidate added successfully",
            newCandidate
        });
    } catch (error) {
        console.log("error in adding candidate", error);
        return res.status(400).json({
            succes: "false",
            message: "Error in adding candidate"
        })
    }
}

const allCandidate = async (req, res) => {
    try {
        const allCandidates = await candidateModel.find({});
        const structured = await allCandidates.map((candidate) => ({
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            id:candidate.id
        }))
        return res.status(200).json({
            message: "All candidates fetched successfully",
            structured,
            success: "true"
        })
    } catch (error) {
        console.log("error in fetching all candidates", error);
        return res.status(400).json({
            succes: "false",
            message: "Error in fetching all candidates"
        })
    }
}

const singleCandidate = async (req, res) => {
    try {
        const candidateId = req.query.candidateId
        const candidate = await candidateModel.findById(candidateId)
        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found",
                success: "false"
            })
        } else {
            return res.status(200).json({
                message: "Candidate found successfully",
                candidate,
                success: "true"
            })
        }

    } catch (error) {
        console.log("error in getting specific candidate", error);
        return res.status(400).json({
            succes: "false",
            message: "Error in getting specific candidate"
        })
    }
}

const updateDetails = async (req, res) => {
    try {
        const { id, name, email, phone, position } = req.body;

        // Validate required fields
        if(!id){
            return res.status(400).json({
                message: "Candidate ID is required",
                success: "false"
                })
        }
        if ( !name || !email || !phone || !position) {
            return res.status(400).json({
                message: "Server Error",
                success: false,
            });
        }

        const updatedCandidate = await candidateModel.findOneAndUpdate(
            { _id: id }, 
            { name, email, phone, position }, 
            { new: true } 
        );

        
        if (!updatedCandidate) {
            return res.status(404).json({
                message: "Candidate not found",
                success: false,
            });
        }

        // Return success response
        return res.status(200).json({
            message: "Candidate updated successfully",
            success: true,
            candidateDetails: updatedCandidate,
        });

    } catch (error) {
        console.error("Error in updating details:", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating details",
            error: error.message, // Include the error message for debugging
        });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const deletedCandidate = await candidateModel.findByIdAndDelete(req.params.id);

        if (!deletedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting candidate", error: error.message });
    }
};
module.exports = { addCandidate, allCandidate,singleCandidate,updateDetails,updateDetails,deleteCandidate }