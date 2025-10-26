/**
 * Grading Utilities
 *
 * Calculate grades and generate synthesis for vendor evaluations
 */

import type { Answer, Question, Category } from "@shared/types";

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F' | null;

interface CategoryGrade {
  category: Category;
  grade: Grade;
  yesCount: number;
  limitedCount: number;
  noCount: number;
  unknownCount: number;
  total: number;
  percentage: number;
}

/**
 * Calculate grade for a category based on answers
 */
export function calculateCategoryGrade(
  category: Category,
  questions: Question[],
  answers: Answer[]
): CategoryGrade {
  const categoryQuestions = questions.filter(q => q.category_id === category.id);
  const categoryAnswers = answers.filter(a =>
    categoryQuestions.some(q => q.id === a.question_id)
  );

  let yesCount = 0;
  let limitedCount = 0;
  let noCount = 0;
  let unknownCount = 0;

  categoryAnswers.forEach(answer => {
    if (answer.answer === 'yes') yesCount++;
    else if (answer.answer === 'limited') limitedCount++;
    else if (answer.answer === 'no') noCount++;
    else if (answer.answer === 'not-enough-info') unknownCount++;
  });

  const total = categoryQuestions.length;
  const answered = categoryAnswers.length;

  // If not all questions answered, return null grade
  if (answered < total) {
    return {
      category,
      grade: null,
      yesCount,
      limitedCount,
      noCount,
      unknownCount,
      total,
      percentage: Math.round((answered / total) * 100),
    };
  }

  // Calculate grade based on yes answers + partial credit for limited (0.5 weight)
  const weightedScore = yesCount + (limitedCount * 0.5);
  const percentage = (weightedScore / total) * 100;

  let grade: Grade;
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B';
  else if (percentage >= 70) grade = 'C';
  else if (percentage >= 60) grade = 'D';
  else grade = 'F';

  return {
    category,
    grade,
    yesCount,
    limitedCount,
    noCount,
    unknownCount,
    total,
    percentage: Math.round(percentage),
  };
}

/**
 * Calculate all category grades
 */
export function calculateAllGrades(
  categories: Category[],
  questions: Question[],
  answers: Answer[]
): CategoryGrade[] {
  return categories.map(category =>
    calculateCategoryGrade(category, questions, answers)
  );
}

/**
 * Generate bottom line synthesis statement
 */
export function generateBottomLine(
  vendorName: string,
  categoryGrades: CategoryGrade[],
  voiceMode: 'no-bs' | 'corporate'
): string {
  const completedGrades = categoryGrades.filter(g => g.grade !== null);

  if (completedGrades.length === 0) {
    return voiceMode === 'no-bs'
      ? 'Complete all questions to see your bottom line assessment.'
      : 'A comprehensive assessment will be available upon completion of all evaluation criteria.';
  }

  // Count red flags (categories with D or F)
  const redFlags = completedGrades.filter(g => g.grade === 'D' || g.grade === 'F');
  const strengths = completedGrades.filter(g => g.grade === 'A' || g.grade === 'B');

  if (voiceMode === 'no-bs') {
    if (redFlags.length >= 3) {
      return `${vendorName} has serious problems (${redFlags.length} red flags). Unless you're desperate or they're uniquely solving your problem, look elsewhere.`;
    }

    if (redFlags.length >= 1) {
      const redFlagCategories = redFlags.map(r => r.category.key.toUpperCase()).join(', ');
      return `${vendorName} is decent overall but has concerning gaps in: ${redFlagCategories}. Make sure these weaknesses won't bite you later.`;
    }

    if (strengths.length >= 5) {
      return `${vendorName} looks solid across the board. Still verify their claims, but this is a vendor worth serious consideration.`;
    }

    return `${vendorName} is okay - no major red flags, but nothing spectacular either. Typical vendor who'll get the job done if you manage them well.`;
  } else {
    // Corporate voice
    if (redFlags.length >= 3) {
      return `${vendorName} presents significant risk factors across multiple evaluation dimensions (${redFlags.length} categories require attention). Recommend exploring alternative solutions unless unique capabilities justify the risk profile.`;
    }

    if (redFlags.length >= 1) {
      const redFlagCategories = redFlags.map(r => r.category.key.toUpperCase()).join(', ');
      return `${vendorName} demonstrates acceptable capabilities with identified gaps in: ${redFlagCategories}. Recommend developing mitigation strategies for these areas before proceeding.`;
    }

    if (strengths.length >= 5) {
      return `${vendorName} demonstrates strong performance across evaluation criteria. Subject to standard due diligence verification, this vendor merits serious consideration for your requirements.`;
    }

    return `${vendorName} presents a balanced profile with no critical deficiencies. Performance expectations should be managed through appropriate governance and oversight mechanisms.`;
  }
}

// Utility function for calculating average grade (currently unused but available for future use)
// function calculateAverageGrade(grades: Grade[]): number {
//   const gradeValues: Record<Exclude<Grade, null>, number> = {
//     A: 4,
//     B: 3,
//     C: 2,
//     D: 1,
//     F: 0,
//   };
//
//   const sum = grades.reduce((acc, grade) => {
//     if (grade === null) return acc;
//     return acc + gradeValues[grade];
//   }, 0);
//   return sum / grades.length;
// }

/**
 * Get grade color for display
 */
export function getGradeColor(grade: Grade): string {
  switch (grade) {
    case 'A':
      return 'text-green-700 bg-green-100';
    case 'B':
      return 'text-blue-700 bg-blue-100';
    case 'C':
      return 'text-yellow-700 bg-yellow-100';
    case 'D':
      return 'text-orange-700 bg-orange-100';
    case 'F':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
}

/**
 * Get overall assessment color based on category grades
 * Returns: 'red' (serious problems), 'yellow' (mixed/caution), 'green' (good)
 */
export function getOverallAssessmentColor(categoryGrades: CategoryGrade[]): 'red' | 'yellow' | 'green' {
  const completedGrades = categoryGrades.filter(g => g.grade !== null);

  if (completedGrades.length === 0) return 'yellow';

  const redFlags = completedGrades.filter(g => g.grade === 'D' || g.grade === 'F').length;
  const strengths = completedGrades.filter(g => g.grade === 'A' || g.grade === 'B').length;

  // Red: 3+ red flags (serious problems)
  if (redFlags >= 3) return 'red';

  // Green: 5+ strengths and 0-1 red flags (good overall)
  if (strengths >= 5 && redFlags <= 1) return 'green';

  // Yellow: everything else (mixed results, proceed with caution)
  return 'yellow';
}

/**
 * Get grade explanation for a specific category
 */
export function getGradeExplanation(categoryKey: string, grade: Grade, voiceMode: 'no-bs' | 'corporate'): string {
  const explanations: Record<string, Record<Exclude<Grade, null>, { noBs: string; corporate: string }>> = {
    see: {
      A: {
        noBs: 'You can see exactly how this works. No smoke and mirrors.',
        corporate: 'Strong transparency. Technical architecture and functionality are well-documented.',
      },
      B: {
        noBs: 'Mostly transparent, but some black box elements remain.',
        corporate: 'Good transparency with minor gaps in technical documentation.',
      },
      C: {
        noBs: 'Significant opacity. You\'ll have to trust them on key parts.',
        corporate: 'Moderate transparency. Several areas lack clear visibility.',
      },
      D: {
        noBs: 'Mostly black box. You\'re buying magic beans.',
        corporate: 'Limited transparency. Significant technical details unavailable.',
      },
      F: {
        noBs: 'You cannot see enough to know if this tool is truly useful.',
        corporate: 'Insufficient transparency to evaluate technical capabilities.',
      },
    },
    change: {
      A: {
        noBs: 'Excellent flexibility. They won\'t hold you hostage.',
        corporate: 'Strong vendor flexibility with minimal lock-in risk.',
      },
      B: {
        noBs: 'Good flexibility with minor lock-in points.',
        corporate: 'Good vendor flexibility with manageable dependencies.',
      },
      C: {
        noBs: 'Moderate lock-in. Leaving will hurt but is possible.',
        corporate: 'Moderate lock-in. Migration would require significant effort.',
      },
      D: {
        noBs: 'Significant lock-in risks detected.',
        corporate: 'Significant lock-in. Migration would be complex and costly.',
      },
      F: {
        noBs: 'Hotel California - you can check in but never leave.',
        corporate: 'Severe lock-in. Migration would be extremely difficult.',
      },
    },
    use: {
      A: {
        noBs: 'Genuinely usable. Your team will actually use this.',
        corporate: 'Excellent usability. High adoption likelihood.',
      },
      B: {
        noBs: 'Strong usability with minor concerns.',
        corporate: 'Strong usability with minor training requirements.',
      },
      C: {
        noBs: 'Usable but clunky. Expect complaints.',
        corporate: 'Acceptable usability. May require change management.',
      },
      D: {
        noBs: 'Frustrating to use. Adoption will be a battle.',
        corporate: 'Poor usability. Significant adoption challenges expected.',
      },
      F: {
        noBs: 'So bad people will find workarounds to avoid it.',
        corporate: 'Severe usability issues. Adoption highly unlikely.',
      },
    },
    adapt: {
      A: {
        noBs: 'Highly customizable. You can make it yours.',
        corporate: 'Excellent customization capabilities. High alignment potential.',
      },
      B: {
        noBs: 'Good customization with some constraints.',
        corporate: 'Good customization within reasonable boundaries.',
      },
      C: {
        noBs: 'Limited customization. Their way or the highway.',
        corporate: 'Moderate customization. Some workflow adjustments required.',
      },
      D: {
        noBs: 'Rigid and inflexible. You\'ll bend to fit them.',
        corporate: 'Limited customization. Significant process changes needed.',
      },
      F: {
        noBs: 'Zero flexibility. Hope their way matches yours.',
        corporate: 'No meaningful customization available.',
      },
    },
    leave: {
      A: {
        noBs: 'Clean exit available. Data export is straightforward.',
        corporate: 'Excellent data portability and exit path.',
      },
      B: {
        noBs: 'Can leave with minor friction.',
        corporate: 'Good exit path with standard migration effort.',
      },
      C: {
        noBs: 'Leaving is possible but painful.',
        corporate: 'Exit possible but requires significant planning.',
      },
      D: {
        noBs: 'Your data is trapped. Extraction will be expensive.',
        corporate: 'Difficult exit. Data extraction complex and costly.',
      },
      F: {
        noBs: 'Data hostage situation. Good luck getting out.',
        corporate: 'Severe exit barriers. Data extraction may be infeasible.',
      },
    },
    learn: {
      A: {
        noBs: 'Excellent learning support. Your team will actually improve.',
        corporate: 'Strong enablement. Team capability development likely.',
      },
      B: {
        noBs: 'Good learning resources with minor gaps.',
        corporate: 'Good enablement with standard training support.',
      },
      C: {
        noBs: 'Minimal learning support. You\'re on your own.',
        corporate: 'Limited enablement. Self-service learning required.',
      },
      D: {
        noBs: 'No real learning here. Just more dependency.',
        corporate: 'Poor enablement. Increased vendor dependency likely.',
      },
      F: {
        noBs: 'This tool makes your team dumber, not smarter.',
        corporate: 'No meaningful skill development. Complete vendor dependency.',
      },
    },
  };

  const categoryExplanations = explanations[categoryKey];
  if (!categoryExplanations || !grade) return '';

  const gradeExplanation = categoryExplanations[grade];
  if (!gradeExplanation) return '';

  return voiceMode === 'no-bs' ? gradeExplanation.noBs : gradeExplanation.corporate;
}
