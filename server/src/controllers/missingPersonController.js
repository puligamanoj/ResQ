import MissingPerson from "../models/MissingPerson.js";
import matchMissingPerson from "../services/matchingEngine.js";

const initialPersons = [
  {
    id: "MP-101",
    name: "Arthur Pendelton",
    age: 68,
    lastSeenLocation: "Area A Sector 2 Flood Zone",
    status: "Searching",
    reportedBy: "Family",
    contactPhone: "+1 555-9011",
    details: "Wearing blue rain jacket and glasses."
  },
  {
    id: "MP-102",
    name: "Sophia Martinez",
    age: 14,
    lastSeenLocation: "Commercial Complex Area C",
    status: "Located & Safe",
    reportedBy: "St. Jude Shelter Staff",
    contactPhone: "+1 555-9022",
    details: "Safely evacuated to St. Jude shelter."
  }
];

export const getMissingPersons = async (req, res) => {
  try {
    const list = await MissingPerson.find().sort({ createdAt: -1 });
    if (list.length > 0) return res.json(list);
  } catch (error) {}
  res.json(initialPersons);
};

export const createMissingPerson = async (req, res) => {
  try {
    const person = new MissingPerson(req.body);
    await person.save();
    
    // Check match engine
    const matchResult = matchMissingPerson(req.body, []);
    res.status(201).json({ success: true, missingPerson: person, matchResult });
  } catch (error) {
    const fallback = {
      id: `MP-${Math.floor(100 + Math.random() * 900)}`,
      ...req.body,
      status: "Searching"
    };
    initialPersons.unshift(fallback);
    res.status(201).json({ success: true, missingPerson: fallback });
  }
};
