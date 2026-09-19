import Shelter from "../models/Shelter.js";

const initialShelters = [
  {
    id: "SHL-01",
    name: "St. Jude High School Shelter",
    location: "Area B - North Sector",
    capacity: 300,
    occupied: 215,
    supplies: "Good (Water: 85%, Food: 70%, Meds: 90%)",
    contact: "+1 555-8821"
  },
  {
    id: "SHL-02",
    name: "City Indoor Sports Complex",
    location: "Area A - West End",
    capacity: 500,
    occupied: 460,
    supplies: "Low (Water: 20%, Food: 30%, Meds: 40%)",
    contact: "+1 555-8822"
  },
  {
    id: "SHL-03",
    name: "East Side Community Hall",
    location: "Area D - East Bay",
    capacity: 200,
    occupied: 85,
    supplies: "Adequate (Water: 60%, Food: 65%, Meds: 80%)",
    contact: "+1 555-8823"
  }
];

export const getShelters = async (req, res) => {
  try {
    const list = await Shelter.find();
    if (list.length > 0) return res.json(list);
  } catch (error) {}
  res.json(initialShelters);
};

export const updateShelter = async (req, res) => {
  const { id } = req.params;
  try {
    const shelter = await Shelter.findByIdAndUpdate(id, req.body, { new: true });
    if (shelter) return res.json({ success: true, shelter });
  } catch (error) {}

  const mem = initialShelters.find((s) => s.id === id);
  if (mem) {
    Object.assign(mem, req.body);
  }
  res.json({ success: true, shelter: mem || initialShelters[0] });
};
