const Service = require('../models/serviceModel');
const Issue = require('../models/issueModel');

// @desc Add a new service
// @route POST /api/services/add
const addService = async (req, res) => {
  const { name, description } = req.body;
  console.log(req.body); 
  if (!name) {
    return res.status(400).json({ message: 'Service name is required' });
  }

  try {
    const service = new Service({
      name,
      description,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error adding service', error });
  }
};

// @desc Get list of services
// @route GET /api/services/list
const getServiceList = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

// @desc Get list of issues based on selected service
// @route GET /api/issues/list/:serviceId

const addPollutionIssue = async (req, res) => {
    const { serviceId } = req.params;
    const { name, description } = req.body;
  
    // Validate request body
    if (!name || !description) {
      return res.status(400).json({ message: 'Issue name and description are required' });
    }
  
    try {
      // Check if service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Create a new issue and associate it with the service
      const issue = new Issue({
        name,
        description,
        serviceId, // Reference to the service
      });
  
      await issue.save();
      res.status(201).json(issue); // Return the added issue
    } catch (error) {
      res.status(500).json({ message: 'Error adding pollution issue', error });
    }
  };
const getIssuesByService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    const issues = await Issue.find({ serviceId });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issues', error });
  }
};

module.exports = { getServiceList, getIssuesByService, addService,addPollutionIssue };
