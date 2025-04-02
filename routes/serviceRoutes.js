const express = require('express');
const { getServiceList, getIssuesByService,addService,addPollutionIssue } = require('../controllers/serviceController');

const router = express.Router();

// List of services
router.get('/servicelist', getServiceList);
router.post('/addservice', addService);
// List of issues based on selected service
router.get('/issuelist/:serviceId', getIssuesByService);
router.post('/issueadd/:serviceId', addPollutionIssue);
module.exports = router;
