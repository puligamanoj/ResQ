/**
 * 5. Matching Engine — Missing Persons Registry Matching
 *
 * Performs attribute matching between reported missing persons and shelter intake records.
 */

export const matchMissingPerson = (missingPersonReport, shelterRecords = []) => {
  if (!missingPersonReport || !missingPersonReport.name) return { matchFound: false, confidence: 0 };

  const targetName = missingPersonReport.name.toLowerCase().trim();

  for (const shelter of shelterRecords) {
    if (shelter.residents && Array.isArray(shelter.residents)) {
      const match = shelter.residents.find((resident) => resident.name.toLowerCase().trim().includes(targetName));
      if (match) {
        return {
          matchFound: true,
          matchedPerson: match,
          location: shelter.name,
          confidence: 95
        };
      }
    }
  }

  return {
    matchFound: false,
    confidence: 0,
    status: "Searching active shelter databases..."
  };
};

export default matchMissingPerson;
