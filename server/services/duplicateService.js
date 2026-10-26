import memoryStore from './memoryStore.js';

// Simple text tokenization helper
const tokenize = (text) => {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  return new Set(words);
};

// Calculate Jaccard similarity between two sets of words
const calculateSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return (intersection.size / union.size) * 100;
};

export const findPotentialDuplicates = (complaintData) => {
  const { title, description, category, institution } = complaintData;
  const targetWords = tokenize(`${title} ${description}`);
  const allComplaints = memoryStore.getAllComplaints();

  const matches = [];

  for (const cmp of allComplaints) {
    // Institution must match or be in same category
    const sameInstitution = cmp.institution.toLowerCase().includes(institution.toLowerCase());
    const sameCategory = cmp.category === category;

    if (!sameInstitution && !sameCategory) continue;

    const cmpWords = tokenize(`${cmp.title} ${cmp.description}`);
    const textScore = calculateSimilarity(targetWords, cmpWords);

    let compositeScore = textScore;
    if (sameCategory) compositeScore += 25;
    if (sameInstitution) compositeScore += 25;

    // Cap score at 100%
    compositeScore = Math.min(Math.round(compositeScore), 100);

    // If similarity >= 40%, flag as potential duplicate
    if (compositeScore >= 40) {
      matches.push({
        referenceId: cmp.referenceId,
        title: cmp.title,
        category: cmp.category,
        institution: cmp.institution,
        currentStatus: cmp.currentStatus,
        createdAt: cmp.createdAt,
        matchScore: compositeScore,
        reasons: [
          sameInstitution ? 'Identical institution target' : null,
          sameCategory ? 'Matching complaint category' : null,
          textScore > 15 ? 'Significant keyword correlation' : null
        ].filter(Boolean)
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

export default findPotentialDuplicates;
