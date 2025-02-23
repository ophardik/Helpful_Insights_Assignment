const express=require("express");
const { addCandidate, allCandidate, singleCandidate, updateDetails, deleteCandidate } = require("../Controller/candidateController");
const router=express()

router.post("/addCandidate",addCandidate);
router.get("/allCandidate",allCandidate);
router.get("/singleCandidate",singleCandidate);
router.patch("/updateDetails",updateDetails);
router.delete("/deleteCandidate/:id",deleteCandidate);


module.exports=router