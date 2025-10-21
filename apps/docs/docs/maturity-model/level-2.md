# Level 2: Workflow Augmentation

## Overview

At Level 2, AI moves from individual experimentation to integrated business processes. Departments deploy AI to augment specific workflows, with IT involvement, basic governance, and integration with existing systems. AI becomes operational infrastructure, not just personal productivity.

**Think**: AI-powered customer support ticketing, automated document processing, CRM enrichment, or sales call summarization.

## Characteristics

### Scale
- **Users**: Departments, cross-functional teams (10-100+ people)
- **Usage**: Workflow-integrated, consistent, operational
- **Organizational Support**: Budgeted, IT-supported deployment
- **IT Involvement**: Active (integration, security, operations)
- **Governance**: Formal policies and oversight

### Use Cases
- Customer support automation (ticket routing, summarization, response drafting)
- Sales enablement (CRM data enrichment, call transcription, opportunity scoring)
- Document processing (contract review, invoice extraction, compliance checking)
- HR operations (resume screening, employee Q&A, onboarding automation)
- Data enrichment (lead qualification, market research, competitive intelligence)

### AI Interaction Model
- Integrated into existing applications (CRM, ticketing, collaboration tools)
- Automated workflows triggered by events
- AI-enhanced interfaces within familiar tools
- Background processing with user review

### Risk Profile
- **Data Risk**: Moderate (departmental data, potentially customer-facing)
- **Operational Risk**: Significant (workflow disruptions affect department productivity)
- **Compliance Risk**: Moderate to high (may involve PII, customer data, financial info)
- **Lock-In Risk**: Moderate (switching disrupts operations and requires retraining)
- **Reputation Risk**: Moderate (errors may affect customer experience)

## Vendor Evaluation at Level 2

### Critical Criteria

**USE - Output Quality and Consistency**
- Is output quality consistent enough for operational workflows?
- Can the system handle edge cases and unexpected inputs?
- Do users trust the results enough to act on them?

**Priority**: **🔴 CRITICAL**

**Why**: Operational workflows require reliability. Inconsistent quality creates more work than it saves.

**CHANGE - Integration and Workflow Customization**
- Does it integrate with our existing systems (CRM, ticketing, collaboration tools)?
- Can we customize workflows to match our processes?
- Can we tune behavior for our specific use cases?

**Priority**: **🔴 CRITICAL**

**Why**: Level 2 is about fitting AI into existing workflows. Without integration capability, deployment fails.

### Important Criteria

**SEE - Transparency for Debugging**
- When things go wrong, can we diagnose why?
- Can we see what data was retrieved and how decisions were made?
- Do we have audit logs for operational issues?

**Priority**: **🟡 IMPORTANT**

**Why**: Operational systems require debugging. Without visibility, you can't fix problems.

**ADAPT - Scalability and Model Options**
- Can it scale to department-wide usage?
- Can we switch models if quality degrades?
- Does it keep pace with AI improvements?

**Priority**: **🟡 IMPORTANT**

**Why**: Departmental scale reveals performance issues. Need flexibility to improve over time.

### Increasing Priority

**LEAVE - Exit Strategy Becomes Relevant**
- Can we export data and configurations if we need to switch?
- Are we building dependencies that would be expensive to unwind?

**Priority**: **🟢 MODERATE**

**Why**: Switching is harder at Level 2 than Level 1. Start planning exit strategy before lock-in deepens.

**LEARN - Building Internal Capability**
- Can our team tune and improve the system?
- Are we learning or just becoming dependent?

**Priority**: **🟢 MODERATE**

**Why**: Internal capability reduces vendor dependency and enables optimization.

## Examples of Level 2 Deployments

### Successful Level 2 Examples

**Customer Support - SaaS Company**
- AI summarizes support tickets and suggests responses
- Integrated with Zendesk
- Support agents review and edit AI drafts
- **Result**: 40% reduction in response time, 25% increase in ticket volume handled

**Sales CRM - Enterprise B2B**
- AI enriches leads from LinkedIn with research and news
- Generates call prep briefs for sales reps
- Integrated with Salesforce
- **Result**: 30% increase in qualified leads, reps save 5 hours/week on research

**HR Resume Screening - Financial Services**
- AI screens resumes against job requirements
- Flags top candidates for recruiter review
- Integrated with applicant tracking system
- **Result**: 70% reduction in time-to-screen, improved diversity metrics

### Failed Level 2 Examples

**Document Processing - Law Firm**
- AI contract review deployed without sufficient accuracy
- Missed critical clauses in 8% of contracts
- No visibility into why errors occurred
- **Result**: Rolled back after client impact. $500K investment lost.

**Customer Service - Retail**
- AI chatbot deployed without ability to hand off to humans
- Poor integration with ticketing system
- Couldn't customize for company voice
- **Result**: Customer satisfaction dropped 15%. System abandoned after 6 months.

## Level 2 Decision-Making

### Who Decides?
- **Department Leaders**: Identify use cases and value
- **IT/Engineering**: Evaluate integration, security, scalability
- **Compliance/Legal**: Review data handling and risk
- **Procurement**: Negotiate contracts
- **Executive Sponsor**: Provides budget and organizational support

### What to Evaluate?

#### Technical Requirements
1. **Integration Capabilities**: Pre-built connectors for your systems?
2. **API Quality**: Can you build custom integrations?
3. **Scalability**: Performance at department scale?
4. **Reliability**: Uptime, error rates, consistency?

#### Operational Requirements
1. **Quality Consistency**: Acceptable output quality across diverse inputs?
2. **Workflow Fit**: Can it adapt to your processes?
3. **User Experience**: Easy enough for department-wide adoption?
4. **Support**: Adequate vendor support for operational issues?

#### Governance Requirements
1. **Data Handling**: Complies with your data policies?
2. **Audit Capability**: Can you trace decisions and outputs?
3. **Access Controls**: Appropriate permissions and roles?
4. **Compliance**: Meets regulatory requirements (GDPR, HIPAA, etc.)?

## Risks at Level 2

### Integration Failures
**Risk**: System doesn't integrate well, creating more work than it saves

**Mitigation**:
- Thorough integration testing during pilot
- Verify API quality and documentation
- Test with real data and workflows
- Have IT evaluate technical feasibility

### Quality Inconsistency at Scale
**Risk**: AI that worked for individuals produces unacceptable errors at scale

**Mitigation**:
- Pilot with real workflow scenarios
- Measure accuracy on representative data
- Implement quality monitoring
- Design human review checkpoints

### User Resistance
**Risk**: Department refuses to adopt, citing poor quality or workflow disruption

**Mitigation**:
- Involve users in evaluation and pilot
- Ensure AI improves workflow, doesn't complicate it
- Provide adequate training
- Start with power users, expand gradually

### Data Leakage
**Risk**: Sensitive departmental data exposed through AI system

**Mitigation**:
- Review vendor data handling practices
- Ensure compliance with policies
- Implement data classification rules
- Restrict access appropriately

### Vendor Lock-In
**Risk**: Deployment creates dependencies difficult to unwind

**Mitigation**:
- Evaluate LEAVE criterion seriously
- Test data export before deployment
- Document configurations externally
- Maintain capability to switch if needed

## When to Move to Level 3

### Signs You're Ready for Level 3
✅ Multiple departments using AI successfully
✅ Clear ROI and executive support for expansion
✅ IT has operational expertise running AI systems
✅ Desire to deploy AI as cross-functional capability
✅ Use cases require agentic behavior and autonomous decision-making
✅ Organization has mature governance and change management

### Signs You Should Stay at Level 2
⚠️ Current deployments still stabilizing
⚠️ Mixed results across departments
⚠️ Organization struggling with change management
⚠️ IT lacks operational maturity for enterprise-scale AI
⚠️ Governance and compliance processes not yet established

### Common Mistake
**Jumping to Level 3 before mastering Level 2**: Deploying enterprise-wide AI without operational maturity. Result: High-profile failures, organizational backlash, wasted investment.

## Transitioning from Level 2 to Level 3

### Prepare for Level 3
When Level 2 proves value across multiple departments:

1. **Consolidate Learnings**
   - What worked across different departments?
   - What integrations and capabilities are most valuable?
   - What governance gaps have emerged?

2. **Assess Organizational Readiness**
   - Is leadership committed to AI transformation?
   - Does IT have capacity for enterprise deployment?
   - Are governance and compliance frameworks in place?

3. **Evaluate Vendor Scalability**
   - Can current vendors scale to enterprise-wide deployment?
   - Do they support agentic and autonomous capabilities?
   - Are all six criteria strong (not just USE and CHANGE)?

4. **Plan Governance**
   - Enterprise-wide AI policy
   - Risk management framework
   - Compliance and audit procedures
   - Change management approach

### Vendor Transition Considerations
**Level 2 vendors often can't scale to Level 3:**
- Lack transparency required for enterprise governance (SEE)
- No support for agentic/autonomous workflows (ADAPT)
- Poor exit strategy creates unacceptable risk at scale (LEAVE)
- Don't build internal capability (LEARN)

**Evaluate early**: Can your Level 2 vendor meet Level 3 requirements?
- If yes: Plan expansion with current vendor
- If no: Start Level 3 vendor evaluation before current lock-in deepens

## Best Practices for Level 2

### Do's ✅
- **Pilot rigorously**: Test with real users, data, and workflows
- **Measure everything**: Track quality, usage, ROI, user satisfaction
- **Involve users early**: Design with users, not for them
- **Integrate deeply**: Make AI feel native to existing workflows
- **Plan for scale**: Choose vendors that can grow with you
- **Build capability**: Train team to tune and improve the system
- **Document everything**: Capture configurations and best practices
- **Monitor continuously**: Track quality and performance over time

### Don'ts ❌
- **Don't skip the pilot**: Never go straight to full deployment
- **Don't ignore quality issues**: Address problems before scaling
- **Don't over-automate**: Keep humans in the loop for critical decisions
- **Don't forget change management**: AI changes workflows; prepare users
- **Don't accept black boxes**: Require transparency for debugging
- **Don't ignore exit strategy**: Test data export before committing
- **Don't forget governance**: Establish policies before problems arise

## Level 2 Success Metrics

### Adoption Metrics
- Percentage of department actively using AI
- Daily active users and session frequency
- Tasks completed with AI assistance

### Quality Metrics
- Output accuracy (measured against ground truth)
- User ratings of AI suggestions
- Error rate and types
- Escalation rate (how often humans override AI)

### Efficiency Metrics
- Time saved per user per task
- Volume increase (more work handled with same resources)
- Cost per transaction or ticket

### Strategic Metrics
- User satisfaction (NPS/CSAT)
- ROI (cost savings vs. investment)
- Readiness for Level 3 (operational maturity)

## Example Level 2 Journey

### Quarter 1: Planning and Evaluation
- Customer support identified as high-value use case
- Evaluated 5 vendors using Level 2 criteria
- Selected vendor strong in USE, CHANGE, SEE
- Negotiated pilot with 10 users

### Quarter 2: Pilot
- Integrated with Zendesk
- Trained 10 support agents
- Processed 1,000 tickets with AI assistance
- Measured quality, user satisfaction, time savings
- **Results**: 85% accuracy, 4.2/5 user rating, 35% time savings

### Quarter 3: Department Rollout
- Expanded to 50 agents
- Refined prompts based on pilot learnings
- Established quality monitoring
- Documented best practices
- **Results**: Maintained quality at scale, user adoption 78%

### Quarter 4: Optimization and Expansion
- Iterated on prompts and workflows
- Improved accuracy to 92%
- Other departments interested in AI
- Evaluating expansion to sales and HR

### Decision Point: Ready for Level 3?
- Multiple departments want AI
- Strong ROI and executive support
- **Question**: Can current vendor support enterprise-wide deployment?
  - Evaluate for Level 3 requirements across all six criteria

## Key Takeaways

1. **Level 2 is about operational integration**
   - AI must fit workflows, not disrupt them
   - Integration capability is critical
   - Quality must be consistent at scale

2. **All six criteria start to matter**
   - USE and CHANGE are critical
   - SEE and ADAPT become important
   - LEAVE and LEARN are no longer ignorable

3. **Pilot thoroughly before scaling**
   - Test with real users, data, and workflows
   - Measure quality rigorously
   - Address issues before department-wide rollout

4. **Plan for Level 3 from the start**
   - Choose vendors that can scale beyond Level 2
   - Build internal capability progressively
   - Avoid lock-in that will force expensive Level 3 migration

5. **Level 2 is transition zone**
   - Can't stay here forever—either scale to Level 3 or fall behind
   - Most competitive advantage comes from Level 3+
   - Level 2 is proving ground for enterprise transformation

## Next Steps

- [Explore Level 3 (Organizational Transformation) →](/docs/maturity-model/level-3)
- [Return to Maturity Model Overview →](/docs/maturity-model/overview)
- [Review CHANGE criterion for integration requirements →](/docs/framework/change)
- [Start evaluating a vendor →](http://localhost:5174)
