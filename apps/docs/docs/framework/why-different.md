# Why AI Procurement is Different

Buying AI tools isn't like buying traditional enterprise software. The stakes are higher, the risks are less obvious, and vendors often hide critical details behind claims of "proprietary technology." This framework exists because traditional procurement checklists fail to address what actually matters in AI vendor selection.

## Traditional Software vs. AI Systems

### Traditional Software Procurement
When you buy traditional enterprise software, you evaluate:
- **Features**: Does it have the capabilities we need?
- **Integration**: Does it connect to our systems?
- **Support**: Will the vendor help when things break?
- **Price**: Does it fit our budget?
- **Security**: Is our data protected?

This worked fine for CRM systems, ERPs, and productivity tools. The vendor built software, you bought it, and the relationship was straightforward.

### AI System Procurement is Fundamentally Different

AI vendors don't just sell software—they sell **decision-making systems** powered by:
- Third-party models they don't control (OpenAI, Anthropic, Google)
- Retrieval mechanisms that determine what information gets fed to those models
- System prompts that shape behavior in ways you can't see
- Training data and fine-tuning approaches they won't disclose

**The core problem**: You're not just buying a tool. You're outsourcing judgment.

## Five Critical Differences

### 1. **The Vendor Doesn't Control the Intelligence**

When you buy Salesforce, Salesforce controls the code. When you buy an AI vendor's product, they're wrapping someone else's model (Claude, GPT-4, Gemini) with their own secret sauce.

**Why this matters:**
- Models change without your consent (or even notification)
- Underlying model providers can deprecate APIs
- Your vendor has no leverage when the model provider changes terms
- You're dependent on two companies, not one

**What to ask:**
- Which models do you use?
- Can I choose or switch models?
- What happens if your model provider raises prices or shuts down?
- Do you fine-tune, and if so, on what data?

### 2. **"Proprietary" Usually Means "We Won't Tell You How It Works"**

Traditional software vendors document their features. AI vendors hide behind "proprietary algorithms" to avoid explaining:
- What their system prompts actually say
- How retrieval ranking works
- Why the system made a specific decision
- What training data was used

**Why this matters:**
- You can't audit what you can't see
- Compliance requires understanding decision-making logic
- Debugging failures becomes impossible
- Bias and errors are hidden until they cause damage

**What to demand:**
- Full visibility into system prompts (not just high-level descriptions)
- Documentation of retrieval mechanisms
- Explainable decision paths
- Audit logs with enough detail to reconstruct reasoning

### 3. **Lock-in is Structural, Not Just Contractual**

Traditional software lock-in comes from:
- Long contracts
- Migration costs
- Retraining users

AI system lock-in comes from:
- **Proprietary retrieval systems** you can't replicate
- **Fine-tuned models** trained on your data that you don't own
- **Embedded knowledge** in prompts and configurations you can't export
- **Behavioral dependencies** where users rely on system-specific responses

**Why this matters:**
- Switching costs are 10x higher than traditional software
- Your institutional knowledge gets embedded in their system
- Market leverage shifts entirely to the vendor after 12 months
- You can't negotiate from a position of strength

**What to demand:**
- Standard data export formats (not just raw logs)
- Portable prompt configurations
- Model-agnostic architectures
- Clear migration paths

### 4. **Output Quality is Subjective and Variable**

Traditional software either works or it doesn't. A button clicks or it doesn't. AI systems:
- Produce different outputs for the same input
- Degrade over time as models change
- Fail in ways that are hard to detect
- Require constant quality monitoring

**Why this matters:**
- ROI is hard to measure
- User trust is fragile and easily broken
- "Good enough" varies by use case and user
- Silent failures can persist for months

**What to demand:**
- Output quality metrics and benchmarks
- Version control for prompts and configurations
- Regression testing when models change
- User feedback mechanisms

### 5. **The Vendor's Expertise May Not Transfer to You**

Traditional software vendors train your team to use their product. AI vendors often:
- Keep their expertise internal
- Provide thin documentation
- Offer "managed services" that prevent skill transfer
- Create dependencies rather than building internal capabilities

**Why this matters:**
- You stay dependent on the vendor forever
- Internal teams can't improve or customize the system
- Your organization doesn't build AI literacy
- You can't attract AI talent because there's nothing to work on

**What to demand:**
- Comprehensive documentation (not just API references)
- Training programs that build internal expertise
- Access to underlying configurations
- Collaboration on improvements, not just support tickets

## The Bottom Line

**Traditional software procurement optimizes for features and price.**

**AI system procurement must optimize for:**
1. **Transparency**: Can you see how it actually works?
2. **Control**: Can you modify, tune, and direct it?
3. **Portability**: Can you leave without losing everything?
4. **Quality**: Does it actually produce good outputs consistently?
5. **Learning**: Does it build your team's capabilities or create dependencies?

If your AI vendor evaluation process looks like your SaaS evaluation process, you're asking the wrong questions.

## Next Steps

Ready to evaluate vendors the right way?

- [Explore the six evaluation criteria →](/docs/framework/see)
- [Start an evaluation →](http://localhost:5174)
