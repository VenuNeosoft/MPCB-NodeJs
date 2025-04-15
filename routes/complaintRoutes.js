const express = require('express');
const raiseComplaint = require('../controllers/raiseComplaintController');
const { getComplaints, getAssignedComplaints } = require('../controllers/getComplaintsController');
const {updateComplaint,updateComplaintBySupervisor} = require('../controllers/updateComplaintController');
const { protect, fieldUserProtect ,supervisorProtect} = require('../middleware/authMiddleware');
const {
    assignToFieldUser,
  } = require('../controllers/assignToFieldUserController'); 
// const uploadFields = require('../middleware/uploadMiddleware');


const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/assigned', protect, getAssignedComplaints);
router.get('/', protect, getComplaints);

router.post('/raise', upload.single('citizenImage'), raiseComplaint);
router.put(
    '/update/:id',
    protect,              // ✅ Auth first
    fieldUserProtect,     // ✅ Role check second
    upload.array('images', 10),
    updateComplaint
  );
  


router.put('/supervisor/update/:id', supervisorProtect, upload.array('images', 10), updateComplaintBySupervisor);


router.put('/assign-to-field/complaint-id/:id', supervisorProtect, assignToFieldUser);
module.exports = router;
