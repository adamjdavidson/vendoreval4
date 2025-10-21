# SEE - Transparency

**Can you see how it works?**

Transparency is the foundation of trust, governance, and effective AI deployment. If you can't see how a system makes decisions, you can't audit it, debug it, govern it, or trust it.

## What "SEE" Means

The SEE criterion evaluates whether a vendor provides visibility into:

1. **System Prompts**: The instructions given to the AI model
2. **Model Selection**: Which AI models are used and why
3. **Retrieval Mechanisms**: How information is found and ranked
4. **Decision Logic**: How the system arrives at specific outputs
5. **Data Sources**: What information feeds into responses
6. **Version Control**: Changes to prompts, models, and configurations over time

## Why Transparency Matters

### You Can't Govern What You Can't See

**Direct Version:**
If your vendor won't show you their system prompts, they're asking you to trust a black box. When (not if) something goes wrong—biased output, compliance violation, security leak—you'll have no way to diagnose or fix it. That's not a vendor relationship; that's vendor dependence.

**Suitable for Work Version:**
Effective governance requires understanding how systems make decisions. Without visibility into prompts, retrieval logic, and model selection, organizations cannot:
- Conduct compliance audits
- Investigate unexpected outputs
- Implement controls to prevent bias
- Meet regulatory requirements for explainability

### Debugging Requires Visibility

**Direct Version:**
When users complain "the AI gave me a wrong answer," you need to know: Was it the prompt? The retrieval? The model? Bad source data? Without transparency, you're guessing. Vendors who hide their internals are selling you a system you can't fix.

**Suitable for Work Version:**
Effective troubleshooting depends on understanding the decision path from user input to system output. This includes:
- Which documents were retrieved and why
- What instructions the model received
- How the model weighted different information sources
- What configuration settings influenced the response

### Trust Requires Verification

**Direct Version:**
"Trust us, our proprietary algorithm works great" is not an acceptable answer for enterprise AI. You're not buying magic beans. Demand to see the actual system prompts, the actual retrieval logic, the actual decision chains.

**Suitable for Work Version:**
Enterprise AI adoption requires stakeholder confidence. Transparency enables:
- Technical validation of vendor claims
- Risk assessment by security and compliance teams
- Informed evaluation of system capabilities
- Evidence-based decision-making during procurement

## What Good Transparency Looks Like

### Excellent (Green)

A vendor with strong transparency provides:

✅ **Full System Prompt Access**: Complete prompts viewable and exportable, not just high-level summaries

✅ **Model Documentation**: Clear information about which models are used, version numbers, and update schedules

✅ **Retrieval Transparency**: Detailed documentation of how documents are ranked, what metadata is used, and how relevance is determined

✅ **Decision Logging**: Audit trails showing the full decision path for each query

✅ **Configuration Visibility**: All tuning parameters and settings are documented and accessible

✅ **Change Management**: Version control with notifications when prompts or models change

**Example**: "You can view and export all system prompts from the admin panel. Retrieval ranking uses BM25 with metadata boosting (configurable weights). All queries log the top 10 retrieved documents with similarity scores. We notify you 30 days before model updates."

### Acceptable with Caveats (Yellow)

A vendor with partial transparency:

⚠️ Provides high-level prompt summaries but not full text

⚠️ Documents models used but not retrieval mechanisms

⚠️ Offers logs but without enough detail to reconstruct decisions

⚠️ Shows some configurations but hides "proprietary" tuning

**Example**: "We use GPT-4 with custom prompts optimized for your use case. Our retrieval algorithm is proprietary but uses semantic similarity. Logs available on request."

### Unacceptable (Red)

A vendor with poor transparency:

❌ Refuses to share system prompts, calling them "proprietary"

❌ Won't disclose which models are used or how they're selected

❌ Provides no documentation of retrieval or ranking logic

❌ Offers no audit logs or decision trails

❌ Makes claims without providing evidence or verification methods

**Example**: "Our proprietary AI engine delivers superior results through advanced algorithms we can't disclose for competitive reasons."

## Evaluation Questions

When evaluating a vendor's transparency, ask:

### System Prompts
- **Q**: Can I view the complete system prompts, not just summaries?
- **Q**: Can I export prompts for audit and version control?
- **Q**: Do you notify me when prompts change?

### Model Selection
- **Q**: Which AI models do you use (provider, model name, version)?
- **Q**: How do you decide which model to use for each query?
- **Q**: Can I choose or switch models?

### Retrieval Mechanisms
- **Q**: How do you determine which documents are relevant to a query?
- **Q**: What ranking algorithm do you use (BM25, semantic, hybrid)?
- **Q**: Can I see which documents were retrieved for a specific query?
- **Q**: What metadata or filters affect retrieval?

### Decision Transparency
- **Q**: Do you provide audit logs showing how specific outputs were generated?
- **Q**: Can I trace a response back to source documents and prompts?
- **Q**: What information is logged and for how long?

### Configuration Visibility
- **Q**: Can I see all configuration settings that affect system behavior?
- **Q**: Which settings can I modify and which are fixed?
- **Q**: Do you document the impact of different configuration choices?

## Red Flags

Watch out for vendors who:

🚩 Use "proprietary" as an excuse to hide basic operational details

🚩 Provide only vague, high-level descriptions of how things work

🚩 Refuse to show system prompts under any circumstances

🚩 Can't or won't provide audit logs for specific queries

🚩 Change models or prompts without notification

🚩 Claim their "secret sauce" can't be explained or documented

## Why Vendors Resist Transparency

**What they say**: "Our proprietary algorithms are our competitive advantage."

**What it often means**:
- They don't want competitors to see how simple their approach is
- They're worried you'll realize you could build it yourself
- They're hiding quality issues or shortcuts
- They want flexibility to change things without your knowledge

**The truth**: Real competitive advantages come from execution, integration quality, and ongoing improvement—not from hiding how things work.

## Best Practices for Procurement

### During Evaluation
1. **Request Demos with Transparency**: Ask to see system prompts and retrieval logs during the demo
2. **Review Documentation**: Evaluate the depth and completeness of technical documentation
3. **Test Audit Capabilities**: Request audit logs for specific test queries
4. **Verify Change Management**: Ask how model and prompt updates are communicated

### In Contracts
1. **Require Prompt Access**: Contractual right to view and export all system prompts
2. **Mandate Change Notifications**: 30-day notice before model or prompt changes
3. **Specify Logging Requirements**: Detailed audit logs retained for defined period
4. **Include Documentation SLAs**: Minimum standards for technical documentation

### Post-Deployment
1. **Regular Audits**: Periodic review of prompts, configurations, and decision logs
2. **Monitor Changes**: Track all vendor-initiated changes to models or settings
3. **Validate Claims**: Test vendor assertions against actual logged behavior
4. **Document Gaps**: Track areas where transparency is lacking for future negotiations

## Real-World Impact

### Case Study: Hidden Model Change

**Scenario**: An AI-powered customer service tool suddenly started producing more verbose, less helpful responses.

**With Transparency**: Team reviewed audit logs, discovered vendor had switched from GPT-4 to GPT-3.5 without notice, demanded rollback.

**Without Transparency**: Team spent weeks debugging their own data and configurations, never discovered the root cause, user satisfaction dropped 15%.

### Case Study: Compliance Audit Failure

**Scenario**: Regulator requested documentation of how AI system made specific decisions.

**With Transparency**: Company provided audit logs showing retrieval documents, system prompts, and decision chains. Passed audit.

**Without Transparency**: Vendor provided vague summaries. Company couldn't demonstrate decision process. Failed audit, faced penalties.

## Key Takeaway

**Transparency isn't optional for enterprise AI.**

You wouldn't buy a car you're not allowed to look under the hood of. You wouldn't buy enterprise software where the vendor refuses to document how it works. Don't accept black-box AI.

Demand to see:
- The actual prompts
- The actual models
- The actual retrieval logic
- The actual decision paths

If a vendor won't show you, they're asking you to trust them blindly. That's not a foundation for enterprise deployment.

## Next Steps

- [Explore the CHANGE criterion (Control) →](/docs/framework/change)
- [Start evaluating a vendor →](http://localhost:5174)
