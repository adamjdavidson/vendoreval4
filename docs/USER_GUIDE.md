# VendorEval User Guide

## Overview

VendorEval is a web application designed to help you systematically evaluate and compare vendors across multiple categories and criteria. The tool guides you through a structured evaluation process and generates comprehensive reports.

**Current Version**: v0.1.0-alpha
**Live Application**: https://vendoreval3.vercel.app

---

## Getting Started

### Accessing the Application

1. Navigate to https://vendoreval3.vercel.app
2. The application is currently in **test mode** - no login required
3. Click "Start New Evaluation" to begin

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled

---

## Using VendorEval

### Starting an Evaluation

1. **Enter Vendor Name**
   - Click "Start New Evaluation" on the landing page
   - Enter the name of the vendor you're evaluating
   - Click "Start Evaluation"

2. **Navigate Categories**
   - The evaluation is organized into 6 main categories
   - Each category contains specific questions
   - Progress through categories using the navigation

### Evaluation Categories

The tool evaluates vendors across these key areas:

1. **Search & Discovery** - How well can you find information?
2. **Content Quality** - Is the information accurate and useful?
3. **User Experience** - How easy is the tool to use?
4. **Integration & Workflow** - Does it fit into your existing processes?
5. **Performance & Reliability** - Is it fast and dependable?
6. **Value & ROI** - Is it worth the investment?

### Answering Questions

Each question offers multiple response options:

- **Excellent** - Outstanding performance, exceeds expectations
- **Good** - Solid performance, meets expectations
- **Fair** - Acceptable but has noticeable limitations
- **Poor** - Significant issues or missing functionality
- **N/A** - Not applicable to your use case

**Adding Notes:**
- Each answer can include optional notes
- Use notes to capture specific examples, concerns, or context
- Notes appear in the final report

### Using Voice Mode

Voice mode allows hands-free evaluation:

1. Click the microphone icon to enable voice mode
2. Speak your answers naturally
3. Say category names or grades (e.g., "Excellent", "Good")
4. The system will interpret your speech and record answers

**Voice Commands:**
- "Next question" - Move to next question
- "Previous question" - Go back one question
- "Excellent" / "Good" / "Fair" / "Poor" - Record answer
- Category names - Jump to specific category

### Overall Assessment

After completing all categories:

1. **Overall Grade** - Provide a holistic assessment (A through F)
2. **Summary Notes** - Key takeaways and overall impressions
3. **Final Recommendation** - Would you recommend this vendor?

### Saving Your Work

- Evaluations are automatically saved to your browser's local storage
- Your progress is preserved if you close the browser
- You can return to incomplete evaluations later

### Exporting Results

**PDF Export:**
1. Complete your evaluation
2. Click "Export to PDF" button
3. PDF includes:
   - Vendor name and evaluation date
   - Category-by-category breakdown
   - All answers and notes
   - Overall assessment and recommendation

**Viewing Past Evaluations:**
- Return to the landing page to see all completed evaluations
- Click on any evaluation to view details
- Export any evaluation to PDF at any time

---

## Understanding Scores

### Category Grades

Each category receives a letter grade based on your answers:

- **A** - Excellent performance across the board (90-100%)
- **B** - Good performance with minor issues (80-89%)
- **C** - Fair performance with notable gaps (70-79%)
- **D** - Poor performance, significant concerns (60-69%)
- **F** - Failing, major issues or deal-breakers (below 60%)

Grades are calculated automatically based on your responses to each question in the category.

### Overall Grade

The overall grade is **manually assigned** by you during the final assessment. This allows you to:
- Weight categories based on your priorities
- Account for factors not covered in structured questions
- Apply your judgment and experience

---

## Tips for Effective Evaluations

### Before You Start

1. **Test the vendor** - Actually use the tool before evaluating
2. **Define your needs** - Know what's important to your team
3. **Gather stakeholder input** - Include perspectives from different users
4. **Set aside time** - A thorough evaluation takes 15-30 minutes

### During Evaluation

1. **Be honest** - Accurate assessments lead to better decisions
2. **Use notes liberally** - Future you will appreciate the context
3. **Mark N/A appropriately** - Skip irrelevant questions
4. **Take breaks** - You can save and return later

### After Evaluation

1. **Review before finalizing** - Check your answers for consistency
2. **Compare vendors** - Evaluate multiple options using the same criteria
3. **Share results** - Export PDFs for team discussions
4. **Revisit decisions** - Re-evaluate vendors periodically

---

## Data and Privacy

### Current Alpha Version (Test Mode)

- **No authentication required** - Anonymous access
- **Data stored locally** - Evaluations saved in browser storage only
- **Not backed up** - Clearing browser data will delete evaluations
- **No server storage** - Your data never leaves your device

### Future Production Version

When test mode is disabled:
- User accounts with authentication
- Cloud storage via Supabase
- Data synced across devices
- Team collaboration features

---

## Troubleshooting

### Evaluation Not Saving

**Problem**: Progress isn't being saved
**Solution**:
- Check that JavaScript is enabled
- Ensure local storage isn't disabled in browser settings
- Try a different browser

### Voice Mode Not Working

**Problem**: Voice commands aren't recognized
**Solution**:
- Grant microphone permissions when prompted
- Use Chrome or Edge (best voice recognition support)
- Speak clearly and at normal volume
- Check that microphone is working in system settings

### PDF Export Issues

**Problem**: PDF won't download or looks incorrect
**Solution**:
- Check browser's download settings
- Allow pop-ups from the application
- Try exporting from a different browser
- Ensure evaluation is complete

### Can't Find Past Evaluations

**Problem**: Previous evaluations are missing
**Solution**:
- Check if browser data was cleared
- Verify you're using the same browser/device
- Local storage is device-specific in test mode

---

## Known Limitations (Alpha Version)

This is an alpha release with the following limitations:

1. **Local storage only** - No cloud backup
2. **No user accounts** - Can't sync across devices
3. **No collaboration** - Can't share with team members in real-time
4. **No comparison view** - Can't see multiple vendors side-by-side
5. **Limited customization** - Fixed question set

These features are planned for future releases.

---

## Getting Help

### Feedback and Issues

This is an alpha version - your feedback is valuable!

- Report bugs or issues
- Suggest new features
- Share your evaluation experience
- Request additional categories or questions

### Feature Requests

Planned features for future versions:
- Team collaboration
- Custom question sets
- Vendor comparison dashboard
- Historical tracking and trends
- Integration with decision-making frameworks

---

## Version History

### v0.1.0-alpha (Current)

**Released**: October 21, 2025

**Features**:
- Six evaluation categories with 20+ questions
- Voice mode for hands-free evaluation
- PDF export functionality
- Local storage persistence
- Anonymous access (test mode)

**Status**: Alpha testing - ready for feedback

---

## Glossary

**Category**: A major area of evaluation (e.g., Search & Discovery)

**Question**: A specific criterion within a category

**Grade**: Letter grade (A-F) assigned to each category based on answers

**Overall Assessment**: Final holistic evaluation of the vendor

**Test Mode**: Current operating mode allowing anonymous access without authentication

**Voice Mode**: Hands-free evaluation using speech recognition

**Export**: Generate PDF report of evaluation results

---

*Last Updated: October 21, 2025*
*Documentation Version: 1.0*
