const express = require('express');
const raiseComplaint = require('../controllers/raiseComplaintController');
const { getComplaints, getAssignedComplaints } = require('../controllers/getComplaintsController');
const {updateComplaint,updateComplaintBySupervisor} = require('../controllers/updateComplaintController');
const { protect, fieldUserProtect ,supervisorProtect} = require('../middleware/authMiddleware');

// const uploadFields = require('../middleware/uploadMiddleware');


const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/assigned', protect, getAssignedComplaints);
router.get('/', protect, getComplaints);

router.post('/raise', upload.single('citizenImage'), raiseComplaint);

router.put('/update/:id', fieldUserProtect, upload.single('fieldUserImage'), updateComplaint);
router.put('/supervisor/update/:id', supervisorProtect, upload.single('fieldUserImage'), updateComplaintBySupervisor);


module.exports = router;
