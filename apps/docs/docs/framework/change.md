# CHANGE - Control

**Can you control it?**

Control determines whether an AI system adapts to your needs or forces you to adapt to it. Without control, you're buying a one-size-fits-all solution that will never quite fit.

## What "CHANGE" Means

The CHANGE criterion evaluates whether you can:

1. **Customize System Prompts**: Modify instructions to match your use cases
2. **Swap Models**: Choose or switch between different AI models
3. **Configure Behavior**: Adjust parameters like temperature, response length, tone
4. **Control Retrieval**: Tune how information is ranked and filtered
5. **Modify Workflows**: Adapt the system to your processes, not vice versa
6. **Deploy Flexibly**: Choose cloud, on-premise, or hybrid deployment

## Why Control Matters

### Generic AI Doesn't Fit Enterprise Workflows

**Direct Version:**
No vendor knows your business better than you do. If they won't let you customize prompts or swap models, they're forcing you to use their generic solution for your specific problem. That's not enterprise software—that's a toy with a big price tag.

**Suitable for Work Version:**
Enterprise AI systems must align with organizational workflows, terminology, and requirements. Without customization capabilities, organizations face:
- Outputs that don't match company voice or standards
- Inability to incorporate domain expertise
- Forced process changes to accommodate tool limitations
- Suboptimal results that can't be improved

### Requirements Change, Systems Must Too

**Direct Version:**
What works today won't work next year. Your business evolves, AI models improve, and vendor relationships shift. If you can't swap models or modify behavior, you're locked into whatever the vendor decides to give you. That's not a partnership—it's a hostage situation.

**Suitable for Work Version:**
Business requirements, regulatory environments, and AI capabilities evolve continuously. Control ensures:
- Ability to adopt better models as they become available
- Compliance with changing regulatory requirements
- Optimization based on actual usage patterns
- Independence from vendor strategic decisions

### Lock-In Starts with Lost Control

**Direct Version:**
The moment you can't change the system to match your needs, you lose negotiating power. Vendors know this. That's why they build beautiful cages—easy to enter, expensive to leave. Control isn't a feature; it's your leverage.

**Suitable for Work Version:**
Organizations that cannot modify AI systems face structural lock-in:
- Switching costs increase as processes adapt to tool limitations
- Alternative vendors may not replicate specific customizations
- Institutional knowledge becomes embedded in vendor configurations
- Market power shifts entirely to the vendor

## What Good Control Looks Like

### Excellent (Green)

A vendor with strong control provides:

✅ **Full Prompt Editing**: Modify system prompts through UI or API with version control

✅ **Model Choice**: Select from multiple models (GPT-4, Claude, open-source) and switch easily

✅ **Configurable Parameters**: Adjust temperature, max tokens, frequency penalty, etc.

✅ **Retrieval Tuning**: Control ranking algorithms, metadata weights, filtering rules

✅ **Workflow Customization**: Adapt the system to your processes without vendor involvement

✅ **Deployment Flexibility**: Cloud, on-premise, or hybrid deployment options

✅ **API Access**: Full programmatic control for custom integrations

**Example**: "You have full access to edit system prompts with git-like version control. Choose between GPT-4, Claude 3.5, or Llama 3 with one click. All model parameters are configurable. Deploy in your VPC or ours. Complete REST API for custom workflows."

### Acceptable with Caveats (Yellow)

A vendor with partial control:

⚠️ Allows prompt customization but within templates or constraints

⚠️ Offers 2-3 model options but not full flexibility

⚠️ Some parameters configurable, others fixed

⚠️ Workflow customization requires vendor consultation or services

⚠️ Cloud-only deployment with limited configuration options

**Example**: "You can customize prompts using our template system. We offer GPT-4 and Claude 3 Opus. Temperature and max tokens are configurable. Retrieval tuning available through support tickets. Cloud deployment only."

### Unacceptable (Red)

A vendor with poor control:

❌ No prompt customization—"our prompts are optimized, don't change them"

❌ Single model with no alternatives

❌ No configurable parameters—"our defaults work best"

❌ Fixed workflows that can't be adapted

❌ Cloud-only with no deployment alternatives

❌ No API or limited API with restricted functionality

**Example**: "Our AI is pre-configured for optimal performance. Customization would degrade results. We use the best model for each task—you don't need to choose. Deploy through our managed cloud service only."

## Evaluation Questions

When evaluating a vendor's control capabilities, ask:

### Prompt Customization
- **Q**: Can I edit system prompts directly, or only through templates?
- **Q**: Is there version control for prompt changes?
- **Q**: Can I A/B test different prompts?
- **Q**: Are there any restrictions on prompt content or length?

### Model Selection
- **Q**: Which models can I choose from?
- **Q**: Can I switch models without vendor involvement?
- **Q**: Do you support fine-tuning or BYOM (bring your own model)?
- **Q**: What happens if my preferred model is deprecated?

### Configuration Control
- **Q**: Which model parameters can I adjust (temperature, top_p, max tokens, etc.)?
- **Q**: Can I set different configurations for different use cases or users?
- **Q**: Do you provide guidance on parameter tuning?
- **Q**: Can I save and reuse configuration profiles?

### Retrieval Control
- **Q**: Can I tune retrieval ranking algorithms?
- **Q**: Can I adjust metadata weights or add custom filters?
- **Q**: Can I control how many documents are retrieved?
- **Q**: Can I exclude certain sources or date ranges?

### Workflow Customization
- **Q**: Can I modify the user interface or workflow?
- **Q**: Can I integrate custom steps or validations?
- **Q**: Do I need vendor involvement for workflow changes?
- **Q**: Can I create different workflows for different teams?

### Deployment Flexibility
- **Q**: Do you support on-premise deployment?
- **Q**: Can I deploy in my own cloud account (VPC)?
- **Q**: What are my options for multi-region or hybrid deployment?
- **Q**: Can I control data residency for compliance?

## Red Flags

Watch out for vendors who:

🚩 Claim their "optimized" configuration is the only way

🚩 Require vendor services for simple customization tasks

🚩 Lock you into a single model with no alternatives

🚩 Restrict API access to control how you use the system

🚩 Force cloud deployment even when you have compliance requirements

🚩 Make customization so difficult you'll never actually do it

🚩 Charge expensive fees for basic configuration changes

## Why Vendors Limit Control

**What they say**: "We've optimized everything so you don't have to worry about it."

**What it often means**:
- They want to reduce support burden by preventing customization
- They're hiding limitations in their architecture
- They're building lock-in by making you dependent on their configurations
- They don't want you to realize how simple their system actually is
- They want to sell professional services for customization

**The truth**: "Optimized for you" often means "optimized for our operations." Real enterprise software puts control in your hands.

## Best Practices for Procurement

### During Evaluation
1. **Test Customization**: Request hands-on access to modify prompts and settings
2. **Verify Model Options**: Confirm which models are available and test switching
3. **Review API Documentation**: Evaluate completeness and flexibility of programmatic access
4. **Assess Deployment Options**: Verify compatibility with your infrastructure requirements

### In Contracts
1. **Guarantee Customization Rights**: Contractual right to modify prompts, models, and configurations
2. **Lock Model Availability**: Specify which models must remain available
3. **Prevent Restriction Changes**: Vendor can't reduce control levels in future versions
4. **Cap Customization Fees**: Limit or eliminate fees for configuration changes

### Post-Deployment
1. **Exercise Control Regularly**: Use customization features to prevent atrophy
2. **Document Customizations**: Track all modifications for migration planning
3. **Test Model Switching**: Periodically verify you can actually switch models
4. **Review Restrictions**: Identify limitations that weren't apparent during evaluation

## Real-World Impact

### Case Study: Model Lock-In

**Scenario**: Vendor used GPT-4 exclusively. OpenAI raised API prices 40%. Vendor passed costs to customer. Customer couldn't switch models.

**With Control**: Customer switched to Claude 3.5 Sonnet, achieving better quality at lower cost within one day.

**Without Control**: Customer paid 40% more or renegotiated entire contract from position of weakness.

### Case Study: Prompt Optimization

**Scenario**: AI customer service tool had generic responses that didn't match brand voice. Customer satisfaction declining.

**With Control**: Team edited prompts to include brand guidelines and company-specific terminology. Satisfaction improved 25% in two weeks.

**Without Control**: Team submitted "feedback" to vendor. Vendor added request to backlog. No changes after 6 months. Tool was eventually abandoned.

### Case Study: Compliance Requirements

**Scenario**: New regulation required all AI decisions to reference specific legal text. Needed to modify retrieval and prompt behavior.

**With Control**: Compliance team updated prompts to require legal citations. Added retrieval filter for approved sources. Compliant in 3 days.

**Without Control**: Vendor said change would take "6-8 weeks of professional services" at $50K. Compliance deadline was 4 weeks. Emergency migration to different vendor cost $200K.

## The Control Spectrum

### Maximum Control (Best)
- Self-hosted open-source models
- Full code access and modification rights
- Complete infrastructure control
- **Trade-off**: Requires internal ML expertise

### Strong Control (Enterprise-Grade)
- Hosted solution with full prompt editing
- Multiple model options with easy switching
- Configurable parameters and workflows
- API-first architecture
- **Trade-off**: Depends on vendor infrastructure

### Limited Control (Risky)
- Template-based customization only
- 1-2 model options
- Some parameters configurable
- **Trade-off**: May work initially but limits future flexibility

### No Control (Avoid)
- Fixed prompts and workflows
- Single model, no alternatives
- No meaningful configuration options
- **Trade-off**: Fast initial deployment, but high risk of mismatch and lock-in

## Key Takeaway

**Control isn't about wanting to tinker—it's about owning your AI strategy.**

You need control because:
- Your requirements are unique and will evolve
- AI models are improving rapidly and you need to adopt better options
- Vendor relationships can sour and you need alternatives
- Competitive advantage comes from customization, not generic solutions

If a vendor won't give you control, they're betting you'll be too locked in to leave when you realize the system doesn't fit. That bet is usually right.

Don't make it.

## Next Steps

- [Explore the USE criterion (Usability & Output Quality) →](/docs/framework/use)
- [Start evaluating a vendor →](http://localhost:5174)
