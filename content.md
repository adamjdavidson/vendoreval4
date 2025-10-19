# Content - All Questions & Explanations

## The 6 Categories & 20 Questions

### SEE - Can you see how it works?
**Category Color:** `#DFF7FF` (sky blue)

1. Can you see system prompts?
2. Can you see all other prompts?
3. Can you see which models are used?
4. Can you see how context/retrieval works?

---

### CHANGE - Can you control it?
**Category Color:** `#DFFEF1` (mint)

5. Can you edit the system prompt?
6. Can you edit all prompts?
7. Can you select which models are used?
8. Can you control/influence context?

---

### USE - Is it actually useful?
**Category Color:** `#FFF4E0` (cream)

9. When you test real output for your use case, does it improve or at least match your current work processes?
10. Is the output appropriate for your business context? (format, tone, length, analysis level)
11. Does it admit uncertainty and limitations rather than confidently asserting things it's uncertain about or are outright wrong?

---

### ADAPT - Can it evolve?
**Category Color:** `#F1D2FE` (lavender)

12. Does it use current-generation models, and does the vendor have a clear process for integrating new models?
13. Can you configure how much autonomy it has? (from human-in-the-loop at every step to full autonomy)
14. Can it connect to other tools through standard protocols (APIs, MCP, etc.)?

---

### LEAVE - Can you exit?
**Category Color:** `#FFE8E8` (rose)

15. Can you export everything in standard formats?
16. Will crucial organizational knowledge remain a capability of your company, or get locked into this tool?
17. Is there a clear, reasonable migration path to another vendor or in-house build?

---

### LEARN - Does it build capability?
**Category Color:** `#E8F5E9` (sage)

18. Does it use standard LLM-friendly language or proprietary jargon?
19. Is it designed to encourage experimentation and tinkering?
20. After 6 months, will power users have generalizable AI skills or just expertise in this one tool?

---

## Question Explanations (Both Voice Modes)

### Question 1: Can you see system prompts?

#### DIRECT MODE

**Why this matters:** System prompts are where the core intelligence and behavior of AI tools live. They define personality, constraints, output style, and decision-making logic. If you can't see them, you're buying a black box - the vendor can change behavior without your knowledge or consent, and you can't audit for bias, quality issues, or alignment with your needs.

**What good looks like:** The vendor shows you actual system prompts, explains their design rationale, and lets you review them for quality and appropriateness. You can see exactly how the AI is instructed to behave. Best vendors version-control prompts and notify you of changes.

**What bad looks like:** "Our prompts are proprietary IP" or "That's our secret sauce we can't share." This usually means either: (a) the prompts are embarrassingly simple and they're overcharging you, or (b) they're optimized for impressive-sounding output rather than accuracy, and they don't want you to know.

**What to ask the vendor:** "Can you show me the actual system prompts you're using? Can our compliance/security team audit them? How do you notify us when prompts change?"

#### SUITABLE FOR WORK MODE

**Why this matters:** System prompts establish the fundamental operating parameters and decision-making framework for AI tools. These instructions determine output quality, consistency, and alignment with organizational requirements. Visibility into system prompts enables proper governance, quality assurance, and compliance verification.

**What good looks like:** Vendors provide comprehensive documentation of system prompts, including design principles and version control. Organizations can review prompts for alignment with business requirements and receive notifications of any modifications to ensure continued compliance and performance standards.

**What bad looks like:** Vendors claim prompts constitute proprietary intellectual property and withhold access to system instructions. This opacity prevents organizations from conducting necessary due diligence regarding quality assurance, bias detection, and alignment with business objectives.

**What to ask the vendor:** "Can you provide documentation of your system prompts for our review? What processes exist for prompt governance and change notification? How can we ensure ongoing alignment with our requirements?"

---

### Question 2: Can you see all other prompts?

#### DIRECT MODE

**Why this matters:** Beyond system prompts, AI tools use function-specific prompts, routing prompts, evaluation prompts, and more. If these are hidden, you can't understand how the tool actually works or debug problems when they arise. Hidden prompts often contain the vendor's real logic about when to cut corners or degrade quality to save costs.

**What good looks like:** Complete prompt transparency across all functions. You can see prompts for summarization, analysis, routing decisions, quality checks, etc. The vendor documents their prompt architecture and explains how different prompts work together.

**What bad looks like:** "You can see the main prompt but our routing and evaluation logic is proprietary." This means they're hiding cost-optimization decisions - like when they route to cheaper models or reduce context windows. They don't want you seeing how they prioritize their margins over your quality.

**What to ask the vendor:** "Beyond system prompts, what other prompts does the tool use? Can we see all of them? Are there any prompts we can't access, and if so, why?"

#### SUITABLE FOR WORK MODE

**Why this matters:** AI systems typically employ multiple specialized prompts beyond the primary system prompt, including function-specific instructions, routing logic, and evaluation criteria. Complete visibility across all prompts enables comprehensive understanding of system behavior, facilitates troubleshooting, and ensures alignment with organizational standards.

**What good looks like:** Vendors provide complete documentation of all prompts within the system architecture, including specialized functions for different tasks. Clear explanations of how prompts interact and influence system behavior enable informed oversight and effective quality management.

**What bad looks like:** Vendors restrict access to certain prompts under claims of proprietary methodology. This selective transparency often obscures cost-optimization decisions that may impact output quality, such as routing strategies or context management approaches that prioritize vendor economics over client outcomes.

**What to ask the vendor:** "Can you provide comprehensive documentation of all prompts used throughout your system? What prompts, if any, are not accessible to clients, and what is the business justification for this restriction?"

---

### Question 3: Can you see which models are used?

#### DIRECT MODE

**Why this matters:** Most AI tools use the same commodity models (GPT-4, Claude, Gemini). The model determines cost, quality, speed, and capabilities - but vendors often hide which models they use because: (a) you'd realize you're not getting what you're paying for, or (b) they want flexibility to route to cheaper models without telling you. Without model visibility, you can't evaluate cost-effectiveness or quality trade-offs.

**What good looks like:** Complete transparency about which models power which features. You can see "This uses Claude Sonnet 4.5 for analysis, GPT-4o for summaries" with version numbers. Best vendors let you see model selection per request in logs or dashboards.

**What bad looks like:** "We use advanced AI" or "Our proprietary model" or "A mix of leading models." Translation: they're hiding something - usually that they use older/cheaper models than you'd expect for the price, or they route to the cheapest option available regardless of quality needs.

**What to ask the vendor:** "Which specific models do you use? Can you show me which model processes each type of request? Do you switch models based on your costs or my quality needs?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Contemporary AI applications typically leverage foundational models from major providers rather than proprietary AI systems. Model selection significantly impacts output quality, processing speed, and cost structure. Transparency regarding model usage enables informed evaluation of value proposition and helps organizations understand the relationship between pricing and underlying technology costs.

**What good looks like:** Vendors provide clear documentation of which foundational models power specific features, including version information and update schedules. Organizations can verify that model selection aligns with their quality requirements and can track which models processed specific requests for accountability purposes.

**What bad looks like:** Vendors use vague terminology such as "advanced AI" or "proprietary models" without specific disclosure. This opacity often indicates the use of older or less capable models than pricing would suggest, or dynamic routing to lower-cost alternatives based on vendor economics rather than client quality requirements.

**What to ask the vendor:** "Can you specify which foundational models your system employs and for which functions? How do you determine model selection for different types of requests? What transparency exists regarding model usage on our specific workload?"

---

### Question 4: Can you see how context/retrieval works?

#### DIRECT MODE

**Why this matters:** Context and retrieval (RAG) determine what information the AI uses to answer questions. Poor retrieval returns irrelevant information; poor context management sends too much or too little data. If this is a black box, you can't tell if bad outputs are due to retrieval problems, prompt problems, or model problems - making debugging impossible.

**What good looks like:** Clear documentation of chunking strategy, retrieval method, context window usage, and ranking algorithms. You can see what was retrieved for any given query and understand why. Best vendors let you tune retrieval parameters for your data characteristics.

**What bad looks like:** "Our proprietary AI automatically finds the right information" or "Advanced vector search with ML ranking." This obscures whether their approach actually works for your data structure. Often hides that they're using default settings that aren't optimized for your use case.

**What to ask the vendor:** "Can you explain your retrieval and chunking strategy? Can I see what context was used for a specific query? Can we adjust retrieval parameters if defaults don't work for our data?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Context management and retrieval mechanisms determine which information AI systems consider when generating responses. Retrieval quality directly impacts output relevance and accuracy. Insufficient visibility into these processes impedes troubleshooting, prevents optimization for specific data characteristics, and obscures the root causes of quality issues.

**What good looks like:** Vendors document their approach to data chunking, retrieval methodology, context window management, and relevance ranking. Organizations can inspect which information was retrieved for specific queries and understand the reasoning behind retrieval decisions. Advanced vendors provide configuration options to optimize retrieval for specific data structures and use cases.

**What to ask the vendor:** "Can you provide documentation of your context management and retrieval methodology? What visibility exists regarding which information was retrieved for specific queries? What configuration options are available to optimize retrieval for our specific data characteristics?"

---

### Question 5: Can you edit the system prompt?

#### DIRECT MODE

**Why this matters:** Your organization has unique needs, terminology, constraints, and quality standards. A fixed system prompt means you're stuck with the vendor's assumptions about how AI should behave. Editable system prompts let you customize tone, enforce policies, add domain knowledge, and refine behavior based on your actual usage patterns.

**What good looks like:** You can edit the system prompt directly, test changes safely, and version-control your customizations. The vendor provides guidance on effective prompt engineering but gives you full control. Changes take effect immediately or with minimal lag.

**What bad looks like:** "Our prompt is optimized by experts - we don't recommend changing it" or "Customization available in Enterprise tier." This reveals the vendor doesn't want you realizing their prompt is generic or mediocre, or they're using prompt editing as an upsell tactic.

**What to ask the vendor:** "Can I edit the system prompt? Is there a safe testing environment? Can I roll back changes? Are there any restrictions on what I can modify?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Organizations have distinct requirements regarding terminology, communication standards, compliance constraints, and quality criteria. Fixed system prompts limit the ability to align AI behavior with organizational needs. Editable system prompts enable customization to reflect domain-specific knowledge, enforce policies, and optimize outputs for particular contexts and audiences.

**What good looks like:** Organizations maintain full editorial control over system prompts with appropriate version management and testing capabilities. Vendors provide best practice guidance while enabling complete customization. Changes can be implemented efficiently with clear rollback procedures to manage risk.

**What bad looks like:** Vendors restrict system prompt modifications, citing expert optimization or positioning customization as a premium feature. This limitation often indicates generic prompt design that may not align with specific organizational requirements and prevents necessary adaptation to evolving business needs.

**What to ask the vendor:** "What capabilities exist for modifying system prompts to align with our organizational requirements? What testing and version control mechanisms support safe customization? Are there any limitations on system prompt modification?"

---

### Question 6: Can you edit all prompts?

#### DIRECT MODE

**Why this matters:** If you can only edit the main prompt but not function-specific prompts, you're stuck with vendor-controlled behavior for critical operations. The inability to edit all prompts often means the vendor is hiding quality-vs-cost trade-offs in those locked prompts (like downgrading context or routing to cheap models).

**What good looks like:** Full edit access across all prompts - summarization, analysis, routing, evaluation, etc. You can refine how each function works for your domain. Clear documentation explains what each prompt does and dependencies between them.

**What bad looks like:** "Main prompt is editable but our routing and processing prompts are optimized and locked." This is a control mechanism. They don't want you seeing (or fixing) how they make cost-optimization decisions that degrade your quality.

**What to ask the vendor:** "Can we edit all prompts in the system, not just the main one? Are any prompts locked, and if so, which ones and why? Can you show us what those locked prompts say?"

#### SUITABLE FOR WORK MODE

**Why this matters:** AI systems employ multiple specialized prompts for different functions beyond the primary system prompt. Complete editorial access across all prompts enables comprehensive customization and ensures alignment with organizational standards across all system behaviors. Restricted access often indicates that certain prompts contain vendor-controlled logic that may not align with client interests.

**What good looks like:** Organizations have full editorial control across all functional prompts within the system, with clear documentation of prompt architecture and interdependencies. This comprehensive access enables domain-specific optimization and ensures consistent alignment with organizational requirements across all system functions.

**What bad looks like:** Vendors restrict editing capabilities to primary prompts while locking access to functional prompts such as routing logic or evaluation criteria. This selective restriction often obscures vendor-controlled decisions regarding cost optimization that may impact output quality without client visibility or consent.

**What to ask the vendor:** "What scope of editorial control exists across all system prompts? Which prompts, if any, are not modifiable by clients? Can you provide transparency into the content of any restricted prompts?"

---

### Question 7: Can you select which models are used?

#### DIRECT MODE

**Why this matters:** Different models have different strengths, costs, and latency profiles. GPT-4 excels at reasoning, Claude at long documents, Gemini at multimodal. Without model selection control, you're paying for the vendor's optimization (usually: cheapest model that produces acceptable output) rather than your quality needs. This is especially critical as new models emerge.

**What good looks like:** You can specify models per function or per request type. Want GPT-4o for customer-facing content and Claude for internal analysis? You can configure that. You can force high-quality models for critical tasks and accept cheaper models for low-stakes work.

**What bad looks like:** "Our AI automatically selects the best model" or "Model selection handled by our optimization engine." Translation: they choose based on their costs, not your quality needs. You're subsidizing their margins with degraded output quality.

**What to ask the vendor:** "Can I choose which models to use? Can I force a specific model for specific use cases? How do you decide which model to use if I don't specify?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Different foundational models offer distinct capabilities, cost structures, and performance characteristics. Organizations have varying quality requirements across different use cases. The ability to specify model selection enables optimization of the quality-cost relationship according to business priorities rather than vendor preferences.

**What good looks like:** Organizations can configure model selection at the function or request level, enabling strategic allocation of premium models to high-value use cases while managing costs through appropriate model selection for routine tasks. Clear documentation of model capabilities informs effective configuration decisions.

**What bad looks like:** Vendors maintain exclusive control over model selection under the guise of optimization. This arrangement often prioritizes vendor cost management over client quality requirements, potentially resulting in the use of less capable models than pricing would suggest or than organizational needs require.

**What to ask the vendor:** "What capabilities exist for specifying model selection across different use cases? How does your system determine model selection in the absence of client specification? Can we ensure premium models are used for business-critical applications?"

---

### Question 8: Can you control/influence context?

#### DIRECT MODE

**Why this matters:** Context determines what information the AI considers when responding. Too little context = incomplete answers. Too much = slow, expensive, unfocused responses. Different tasks need different context strategies. Without control, you're stuck with vendor defaults that may not match your data structure, use cases, or quality-vs-cost preferences.

**What good looks like:** You can adjust context window size, retrieval count, ranking thresholds, and chunking parameters. You can tune for your specific data and use cases. The system provides feedback on context usage and cost implications of your choices.

**What bad looks like:** "Our AI automatically optimizes context" or "Context management is handled by our proprietary system." This obscures whether they're restricting context to save money or using context inefficiently. You can't diagnose or fix context-related quality problems.

**What to ask the vendor:** "Can I adjust how much context is used? Can I see what context was retrieved for a query? Can I change chunking or retrieval strategies for my data?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Context management significantly impacts both output quality and operational costs. Organizations have varying requirements for information completeness versus processing efficiency across different use cases. The ability to configure context parameters enables optimization according to specific business needs rather than vendor-determined defaults.

**What good looks like:** Organizations can configure context window sizes, retrieval parameters, and chunking strategies according to their specific data characteristics and use case requirements. The system provides visibility into context utilization and enables informed decisions regarding quality-cost trade-offs.

**What bad looks like:** Vendors maintain exclusive control over context management through proprietary optimization. This restriction prevents organizations from addressing context-related quality issues and obscures whether context limitations serve vendor cost management rather than client quality optimization.

**What to ask the vendor:** "What configuration capabilities exist for context management parameters? Can we optimize chunking and retrieval strategies for our specific data structure? What visibility exists regarding context utilization for specific queries?"

---

### Question 9: When you test real output for your use case, does it improve or at least match your current work processes?

#### DIRECT MODE

**Why this matters:** This is the fundamental value question. Impressive demos with generic examples mean nothing if the tool doesn't actually improve your specific work. Many AI tools look great on cherry-picked examples but fail on real-world complexity, edge cases, or domain-specific needs. Testing with your actual use case reveals if there's real value or just theater.

**What good looks like:** Output demonstrably saves time, improves quality, or enables work that wasn't feasible before. When you give the tool your actual inputs, it produces output you'd be comfortable using or that serves as a strong foundation requiring minimal editing.

**What bad looks like:** Vendor only shows pre-scripted demos or refuses to test on your data ("we need a pilot engagement first"). Output on your use case is generic, misses nuance, requires extensive editing, or introduces errors you then have to fix - creating more work, not less.

**What to ask the vendor:** "Can we test this on our actual data and use cases right now, not generic examples? Can you show me outputs on three different real scenarios we'd encounter? Can we compare output quality to our current process?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Fundamental value assessment requires evaluation against actual business use cases rather than generic demonstrations. AI tools often perform well on carefully selected examples while failing to deliver meaningful improvements when applied to real-world complexity, organizational context, and domain-specific requirements.

**What good looks like:** The system demonstrates measurable improvements in efficiency, output quality, or capability when tested against authentic organizational use cases. Outputs require minimal refinement and represent meaningful enhancements over existing processes, with clear value proposition relative to implementation costs.

**What bad looks like:** Vendors rely exclusively on pre-scripted demonstrations or require extensive pilot engagements before enabling testing on client data. When applied to authentic use cases, outputs prove generic, require substantial editing, or introduce errors that create additional work rather than efficiency gains.

**What to ask the vendor:** "What capabilities exist for testing the system against our specific use cases and data? Can you provide demonstrations using authentic scenarios representative of our operational requirements? What performance benchmarks can we establish against our current processes?"

---

### Question 10: Is the output appropriate for your business context?

#### DIRECT MODE

**Why this matters:** AI that produces technically accurate but contextually inappropriate output creates extra work. If you need executive summaries but get detailed reports, or need formal analysis but get casual commentary, the tool isn't actually useful. Format and tone appropriateness determines whether output is immediately usable or requires time-consuming reformatting.

**What good looks like:** Output matches your organization's communication norms. Length is appropriate for the use case (concise for updates, detailed for analysis). Tone matches your context (formal for client-facing, conversational for internal). Analysis depth matches your audience's needs.

**What bad looks like:** Output is consistently too verbose, too casual, too technical, or requires reformatting before use. The tool has one default style and can't adapt. Or it tries to sound sophisticated/impressive rather than being appropriate for context.

**What to ask the vendor:** "Can you generate output in our style/format? Show me how this adapts to different audiences (executive vs technical). Can I control length, tone, and formality level?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Output appropriateness extends beyond technical accuracy to encompass format, tone, length, and analytical depth suitable for specific business contexts and audiences. Contextually inappropriate outputs require additional processing and reformatting, diminishing efficiency gains and potentially creating inconsistency with organizational communication standards.

**What good looks like:** The system generates outputs that align with organizational communication norms across multiple dimensions including format structure, tone appropriateness, length optimization for purpose, and analytical depth calibrated to audience requirements. Outputs require minimal adjustment before use in business contexts.

**What bad looks like:** The system produces outputs in a fixed style regardless of context, requiring substantial reformatting to align with organizational standards. Outputs may be excessively verbose, stylistically inappropriate, or fail to calibrate analytical depth to audience needs, creating additional processing requirements rather than efficiency gains.

**What to ask the vendor:** "What capabilities exist for configuring output characteristics to align with our organizational communication standards? Can the system adapt format, tone, and analytical depth to different business contexts and audiences? What examples can you provide of contextual output adaptation?"

---

### Question 11: Does it admit uncertainty and limitations rather than confidently asserting things it's uncertain about or are outright wrong?

#### DIRECT MODE

**Why this matters:** Confident-sounding wrong information is dangerous - it gets used in decisions, shared with clients, or shapes strategy. AI that admits "I'm not certain about this" or "I don't have enough information" protects you from confidently-delivered errors. This reveals if the tool is optimized for being helpful (truthful) or being impressive (confident).

**What good looks like:** When uncertain, the tool explicitly says so: "I don't have enough information to answer this confidently" or "This is speculative based on limited data." It caveats outputs appropriately. It asks clarifying questions rather than guessing.

**What bad looks like:** Tool generates plausible-sounding responses to questions it can't actually answer. Never admits uncertainty. Produces different answers to the same question without acknowledging variation. Optimized to always give an answer even when it shouldn't.

**What to ask the vendor:** "Show me how this tool handles questions it can't answer well. Does it admit uncertainty? Can you demonstrate it refusing to answer when it lacks information? How is it optimized - for accuracy or for sounding helpful?"

#### SUITABLE FOR WORK MODE

**Why this matters:** AI systems that present uncertain or incorrect information with high confidence create substantial business risk. Decisions based on confidently delivered but inaccurate information can lead to strategic errors, client misinformation, or operational problems. Systems that appropriately indicate uncertainty enable informed decision-making and risk management.

**What good looks like:** The system explicitly communicates uncertainty when appropriate, using clear indicators such as confidence levels, caveats, or requests for clarification. Rather than providing speculative responses, it acknowledges information limitations and indicates when outputs should be verified through additional means.

**What bad looks like:** The system consistently generates plausible-sounding responses regardless of information adequacy. Uncertainty is never acknowledged, and the system prioritizes providing an answer over accuracy. This optimization for apparent helpfulness over truthfulness creates unacknowledged business risk.

**What to ask the vendor:** "How does your system handle questions where information is insufficient for confident responses? Can you demonstrate uncertainty acknowledgment in practice? What mechanisms ensure the system is optimized for accuracy rather than apparent confidence?"

---

### Question 12: Does it use current-generation models, and does the vendor have a clear process for integrating new models?

#### DIRECT MODE

**Why this matters:** AI capabilities are advancing rapidly. Tools locked to old models become obsolete quickly. If the vendor doesn't have a systematic process for integrating new models, you'll be stuck with degrading relative performance even as you pay the same price. This reveals whether the vendor is building for the long-term or hoping to lock you in before you notice stagnation.

**What good looks like:** Currently uses latest-generation models (GPT-4o/4.5, Claude Sonnet 4.5, Gemini 2.5 Pro). Vendor has documented process for evaluating and integrating new models, with typical timelines (e.g., "new models integrated within 2-4 weeks of release"). Historical track record of timely updates.

**What bad looks like:** Uses older models (GPT-4, Claude 3.5) with vague promises about updates. No clear roadmap or timeline. "We evaluate new models carefully" without specifics on process or timing. Or implies their "proprietary optimization" means old models perform like new ones (rarely true).

**What to ask the vendor:** "Which specific model versions do you use? When GPT-5 or Claude 5 releases, what's your process for integration and typical timeline? Show me your history of model updates over the past year."

#### SUITABLE FOR WORK MODE

**Why this matters:** AI foundational model capabilities continue to advance at a rapid pace. Organizations require assurance that their AI investments will incorporate improved capabilities as they become available. Systems locked to older model generations risk degrading relative performance over time despite consistent costs, potentially requiring costly migrations to maintain competitive capabilities.

**What good looks like:** The system currently employs the latest generation of foundational models with documented processes for evaluating and integrating new model releases. Vendors provide clear timelines for model updates and demonstrate historical track records of timely model integration that maintains system currency with evolving AI capabilities.

**What bad looks like:** The system employs older model generations with vague commitments regarding future updates. Vendors lack documented processes for model integration or provide unclear timelines. Claims that proprietary optimization compensates for older models often prove insufficient as capability gaps widen with new model releases.

**What to ask the vendor:** "Which specific model versions does your system currently employ? What documented processes exist for evaluating and integrating new model releases? What timeline commitments can you provide for model updates, and what historical performance demonstrates these capabilities?"

---

### Question 13: Can you configure how much autonomy it has?

#### DIRECT MODE

**Why this matters:** Different tasks and organizational maturity levels need different autonomy levels. Early in adoption, you need human review at every step. As confidence grows, you want more automation. Tools that force one approach (always autonomous or always supervised) don't scale with your needs. Inability to configure autonomy often means the tool can't actually handle autonomous operation safely.

**What good looks like:** You can set autonomy levels per workflow or task type. Can start with human approval for every action, then gradually automate as confidence builds. Clear controls for when the system should escalate to humans vs. proceed independently. Audit trail of autonomous decisions.

**What bad looks like:** "Our AI handles everything" (no control, risky) or "Requires human review of all outputs" (doesn't scale, expensive). No middle ground. Cannot configure per use case. Or "autonomous mode" is just marketing - it actually requires constant supervision anyway.

**What to ask the vendor:** "Can I configure autonomy levels? Can we start supervised and gradually increase automation? Can I set different autonomy levels for different tasks? Show me how escalation and approval workflows work."

#### SUITABLE FOR WORK MODE

**Why this matters:** Organizations require flexibility in human oversight levels that aligns with both use case criticality and organizational AI maturity. Systems that enforce fixed autonomy levels limit adaptability as confidence develops or as different applications require varying levels of human judgment. Configuration flexibility enables appropriate balance between efficiency and control.

**What good looks like:** The system provides configurable autonomy controls that can be calibrated to specific workflows and task types. Organizations can implement progressive automation as confidence develops, starting with comprehensive human oversight and gradually expanding autonomous operation based on demonstrated reliability. Clear escalation mechanisms ensure appropriate human involvement when needed.

**What bad looks like:** The system enforces a fixed autonomy model that cannot be adjusted to organizational needs or use case requirements. Either complete automation without adequate controls creates risk, or mandatory human review of all outputs limits scalability and efficiency gains. Configuration limitations prevent appropriate calibration to organizational context.

**What to ask the vendor:** "What capabilities exist for configuring autonomy levels across different workflows and use cases? How can we implement progressive automation as organizational confidence develops? What escalation mechanisms ensure appropriate human oversight when required?"

---

### Question 14: Can it connect to other tools through standard protocols?

#### DIRECT MODE

**Why this matters:** AI tools don't operate in isolation - they need to pull from your data sources, push to your workflows, and integrate with your tech stack. Standard protocols (REST APIs, webhooks, OAuth, MCP) ensure you can build a flexible ecosystem. Proprietary integration approaches create vendor lock-in and expensive custom integration work.

**What good looks like:** Well-documented REST API with standard authentication. Supports webhooks for events. Uses open protocols like MCP where applicable. Has pre-built integrations with common tools but doesn't require them - you can build custom integrations easily. Clear API rate limits and versioning.

**What bad looks like:** "We integrate with Salesforce, Slack, and Microsoft" but no general API. Proprietary integration methods that require vendor involvement. API exists but is poorly documented or requires enterprise tier. Integrations are rigid pre-built workflows you can't customize.

**What to ask the vendor:** "Do you have a full REST API? Can we build custom integrations? What protocols do you support? Can you show API documentation? Are there any integration limitations we should know about?"

#### SUITABLE FOR WORK MODE

**Why this matters:** AI systems must integrate with existing organizational technology infrastructure and workflows. Support for standard protocols and well-documented APIs enables flexible integration without vendor dependency. Proprietary integration approaches create technical debt, limit organizational flexibility, and often result in significant custom integration costs.

**What good looks like:** The system provides comprehensive API documentation supporting standard protocols such as REST, webhooks, and OAuth. While pre-built integrations with common enterprise tools may exist for convenience, organizations retain the capability to develop custom integrations without vendor involvement. Clear documentation of API capabilities, rate limits, and versioning supports effective integration planning.

**What bad looks like:** The system offers only pre-configured integrations with select enterprise tools without providing general API access. Integration capabilities require proprietary methods or vendor professional services. API documentation may be inadequate or restricted to premium service tiers, limiting integration flexibility and creating vendor dependencies.

**What to ask the vendor:** "What API capabilities exist for custom integration development? What standard protocols does your system support? Can you provide comprehensive API documentation? Are there any limitations on integration capabilities or requirements for vendor involvement?"

---

### Question 15: Can you export everything in standard formats?

#### DIRECT MODE

**Why this matters:** If you can't export your prompts, configurations, processed data, and organizational knowledge in standard formats, you're trapped. When you want to switch vendors, upgrade to in-house tools, or just maintain business continuity, proprietary exports make migration expensive or impossible. Export capability reveals whether the vendor views you as a partner or a hostage.

**What good looks like:** Complete export of all data in standard formats (JSON, CSV, plain text). Prompts, configurations, processed data, training history, logs - everything can be extracted. Single-click export or well-documented API endpoints. No vendor approval required for exports.

**What bad looks like:** "We can provide a data export in our format" (proprietary). Some data can't be exported ("system configurations are internal"). Exports require vendor approval or professional services engagement. Export format requires their proprietary tools to read.

**What to ask the vendor:** "Can we export everything - prompts, configs, data, history? What formats? Can we export without your involvement? Are there any limitations on what we can export?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Organizational data portability is fundamental to maintaining strategic flexibility and avoiding vendor lock-in. The ability to export all system configurations, processed data, and accumulated organizational knowledge in standard formats enables business continuity, facilitates vendor transitions, and ensures organizations retain ownership of their intellectual capital.

**What good looks like:** The system provides comprehensive export capabilities encompassing all prompts, configurations, processed data, training history, and operational logs in industry-standard formats such as JSON, CSV, or plain text. Export processes are fully automated or accessible through documented APIs, requiring no vendor involvement or approval.

**What bad looks like:** Export capabilities are limited to proprietary formats requiring vendor-specific tools for interpretation. Certain system configurations or processed data cannot be exported under vendor restrictions. Export processes require vendor approval or professional services engagement, creating dependencies that limit organizational autonomy.

**What to ask the vendor:** "What export capabilities exist for all system data and configurations? What formats are supported, and are they industry-standard? Can exports be executed without vendor involvement? Are there any restrictions on exportable data?"

---

### Question 16: Will crucial organizational knowledge remain a capability of your company, or get locked into this tool?

#### DIRECT MODE

**Why this matters:** Some tools are designed to capture and trap your organizational intelligence - how you make decisions, what language you use, how you evaluate quality. If this knowledge lives only inside the vendor's system, leaving means losing years of refinement. Your organizational intelligence should belong to you, not be held hostage by a SaaS tool.

**What good looks like:** The tool helps you codify knowledge in formats you own (documented prompts, decision frameworks, quality criteria). Skills and understanding developed by your team transfer beyond this tool. If the tool disappeared, your organizational capability would remain mostly intact.

**What bad looks like:** The tool becomes the only place your team knows how to do certain work. Customizations and learnings are trapped in the vendor's system. "Trained on your data" really means your knowledge is now their hostage. Leaving would mean starting from scratch because the tool hoarded capability.

**What to ask the vendor:** "If we used this for six months then left, what knowledge or capability would we lose? Can we document our customizations and learnings in formats we own? Does this build our AI capability or create dependency on you?"

#### SUITABLE FOR WORK MODE

**Why this matters:** AI systems can either build organizational capabilities or create dependencies. Systems that capture organizational knowledge, decision frameworks, and quality standards within proprietary structures risk creating situations where critical business intelligence becomes inaccessible if the vendor relationship terminates. True capability development ensures knowledge remains organizationally owned and transferable.

**What good looks like:** The system facilitates documentation of organizational knowledge in formats the organization controls, such as exportable prompts, decision frameworks, and quality criteria. Team development emphasizes transferable skills and understanding rather than vendor-specific expertise. Organizational capabilities developed through system use persist independently of the vendor relationship.

**What bad looks like:** The system becomes the exclusive repository for organizational knowledge regarding specific functions. Customizations, learnings, and accumulated expertise remain trapped within proprietary structures. Vendor terminology around "training on your data" may obscure that organizational intelligence is being captured in non-portable formats, creating substantial switching costs beyond technical migration.

**What to ask the vendor:** "What mechanisms ensure organizational knowledge developed through system use remains accessible and portable? How can we document customizations and learnings in formats we control? Does your approach build organizational AI capabilities or create vendor dependencies?"

---

### Question 17: Is there a clear, reasonable migration path to another vendor or in-house build?

#### DIRECT MODE

**Why this matters:** Migration difficulty is a tax the vendor collects every time you consider leaving. If switching vendors requires 6+ months of work or costs more than a year's subscription, you're economically locked in even if the service degrades or pricing becomes unreasonable. Unclear migration paths give vendors pricing power and reduce their incentive to serve you well.

**What good looks like:** Vendor provides migration documentation showing typical paths to alternatives. Export process is clear and complete. No technical dependencies that create lock-in. Other vendors can import your data. Realistic estimate: migration possible in 1-3 months with internal team resources.

**What bad looks like:** Vague promises: "our data is portable" without specifics. No documentation on migration. Proprietary dependencies that are expensive to replicate. When pressed, estimate is 6-12 months and requires consultants. Or: "customers don't usually leave" (deflection, not an answer).

**What to ask the vendor:** "Walk me through what it would take to migrate to [competitor] or an in-house build. What's a realistic timeline and cost? Do you have migration documentation? Can you show an example of a customer who successfully migrated out?"

#### SUITABLE FOR WORK MODE

**Why this matters:** The practical feasibility of vendor migration significantly impacts total cost of ownership and negotiating leverage. Substantial migration barriers create economic lock-in that persists even when service quality degrades or pricing becomes unfavorable. Clear migration documentation and reasonable switching costs indicate vendor confidence and commitment to client relationships based on value rather than technical dependencies.

**What good looks like:** Vendors provide comprehensive migration documentation outlining typical transition paths to alternative solutions. Export processes are complete and well-documented, with no proprietary technical dependencies that create artificial switching costs. Realistic migration estimates suggest feasibility within 1-3 months using internal resources, indicating reasonable switching costs.

**What bad looks like:** Migration information is vague or absent, with vendors deflecting inquiries about transition processes. Proprietary technical dependencies create substantial replication costs. When specific timeline and cost estimates are requested, projections suggest 6-12 month timelines requiring external consulting resources, indicating economic lock-in through technical complexity.

**What to ask the vendor:** "Can you provide detailed documentation regarding migration processes to alternative solutions? What realistic timeline and cost estimates apply to vendor transitions? Can you provide references from clients who have successfully completed migrations?"

---

### Question 18: Does it use standard LLM-friendly language or proprietary jargon?

#### DIRECT MODE

**Why this matters:** Tools that invent proprietary terminology for standard AI concepts create artificial learning curves and reduce portability of knowledge. If your team learns "Acme Cognitive Modules" instead of "prompts" or "Acme Intelligence Routing" instead of "model selection," their skills become vendor-specific. Standard language means learning transfers to other tools and your team can engage with broader AI community.

**What good looks like:** Uses industry-standard terminology: prompts, models, context windows, RAG, embeddings, tokens. Documentation references standard AI concepts. Your team learns skills and language that transfer directly to other AI tools and platforms.

**What bad looks like:** Proprietary terminology for standard concepts. "Neural synthesis engines" (prompts), "Cognitive routing fabric" (model selection), "Knowledge harmonization" (RAG). Creates artificial complexity and vendor lock-in on language. Team can't apply learning elsewhere.

**What to ask the vendor:** "What terminology do you use for core AI concepts? Is your documentation teaching us standard AI principles or vendor-specific approaches? Show me your glossary - is this industry-standard language?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Terminology standardization enables knowledge transfer and skill portability. Vendors who employ proprietary terminology for standard AI concepts create unnecessary learning curves and reduce the transferability of team expertise to other platforms or tools. Industry-standard language facilitates engagement with broader AI communities and ensures organizational learning investments have value beyond specific vendor relationships.

**What good looks like:** The system employs industry-standard terminology for core AI concepts such as prompts, models, context windows, retrieval-augmented generation, embeddings, and tokens. Documentation references standard AI principles and frameworks, enabling team members to apply their learning across multiple platforms and engage effectively with broader AI communities.

**What bad looks like:** The system introduces proprietary terminology for standard AI concepts, creating artificial learning curves and reducing knowledge portability. Vendor-specific language such as custom names for prompts, model routing, or retrieval processes limits the applicability of team learning beyond the specific vendor platform and creates linguistic lock-in alongside technical dependencies.

**What to ask the vendor:** "What terminology does your system employ for core AI concepts? Does your documentation reference industry-standard AI principles or vendor-specific frameworks? Can you provide a glossary demonstrating alignment with standard terminology?"

---

### Question 19: Is it designed to encourage experimentation and tinkering?

#### DIRECT MODE

**Why this matters:** The best AI learning happens through experimentation - trying different prompts, testing edge cases, understanding failure modes. Tools that discourage tinkering ("just trust it" or "experts only") prevent your team from building real understanding. Tools that facilitate safe experimentation build organizational AI capability. This reveals if the vendor wants sophisticated customers or dependent ones.

**What good looks like:** Sandbox/testing environments where you can experiment safely. Clear feedback on what changed and why. Encourages trying different approaches. Documentation includes experimentation guides. Team can learn through doing, not just reading. Mistakes don't cause problems - they're learning opportunities.

**What bad looks like:** "It just works - no need to adjust anything" or "Changes require expert support." No safe testing environment. Modifications are discouraged or locked behind enterprise tiers. "Trust our optimization" messaging. Team can't learn by experimenting because vendor doesn't want them touching anything.

**What to ask the vendor:** "Can we experiment with different configurations safely? Is there a sandbox environment? What happens if we break something while testing? Do you encourage customers to tinker or discourage it?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Organizational AI capability development requires safe environments for experimentation and learning. Systems that discourage modification or testing prevent teams from developing genuine understanding of AI system behavior and optimization. Facilitation of controlled experimentation indicates vendor confidence in system robustness and commitment to client capability development rather than dependency creation.

**What good looks like:** The system provides dedicated sandbox or testing environments enabling safe experimentation with configurations and approaches. Clear feedback mechanisms explain behavioral changes and their implications. Documentation includes guidance for experimentation and learning. Organizations can develop expertise through practical experience without risk to operational systems.

**What bad looks like:** The system discourages modification through messaging emphasizing "optimized configurations" or requiring vendor expertise for changes. Testing capabilities are limited or restricted to premium tiers. The vendor's approach suggests preference for dependent clients over sophisticated users capable of independent optimization and troubleshooting.

**What to ask the vendor:** "What capabilities exist for safe experimentation with system configurations? Are dedicated testing or sandbox environments available? Does your approach encourage organizational learning through experimentation or discourage modification?"

---

### Question 20: After 6 months, will power users have generalizable AI skills or just expertise in this one tool?

#### DIRECT MODE

**Why this matters:** This is the ultimate test of capability building vs. dependency creation. If your team's learning is all vendor-specific, you've built organizational dependence, not organizational capability. Generalizable skills (prompt engineering, model selection, context optimization) make your team more valuable and your organization more adaptable. Vendor-specific expertise makes you captive.

**What good looks like:** Power users understand prompt design principles, model trade-offs, context management, and evaluation approaches that apply beyond this tool. They can apply learnings to other AI tools, build custom solutions, or train others. Skills developed here increase their market value and your organization's AI maturity.

**What bad looks like:** Team expertise is entirely about "how Acme AI works" rather than "how AI works." They can navigate the vendor's interface but can't explain why something works or apply principles elsewhere. If you switch tools, their expertise becomes largely obsolete. Learning makes them more dependent, not more capable.

**What to ask the vendor:** "What does your typical power user learn that transfers beyond this tool? Can they take these skills to other AI platforms? Show me your training materials - are you teaching AI principles or just interface navigation?"

#### SUITABLE FOR WORK MODE

**Why this matters:** Long-term value of organizational AI investment extends beyond specific vendor capabilities to encompass development of transferable expertise within the team. Systems that build vendor-specific expertise rather than generalizable AI capabilities create organizational dependencies that persist beyond technical lock-in. True capability development ensures team learning increases organizational adaptability and employee market value independent of vendor relationships.

**What good looks like:** Team members who develop expertise through system use acquire transferable skills in areas such as prompt engineering, model selection, context optimization, and AI system evaluation. These capabilities apply across multiple AI platforms and enable independent solution development. Organizational learning increases AI maturity and strategic flexibility rather than creating vendor dependencies.

**What bad looks like:** Team expertise remains centered on vendor-specific interfaces and workflows rather than underlying AI principles. Users become proficient at navigating specific tools without developing transferable understanding of AI system behavior and optimization. This vendor-specific learning creates human capital lock-in that compounds technical dependencies and reduces organizational flexibility.

**What to ask the vendor:** "What transferable AI capabilities do users typically develop through system expertise? Can these skills be applied across multiple AI platforms and tools? Does your training approach emphasize AI principles or primarily focus on vendor-specific interface navigation?"

---

## Framework Documentation Content

### Why Traditional IT Evaluation Fails for AI

**DIRECT MODE:**

Traditional IT evaluation is built for buying software that's already finished. You check security, test integration, negotiate price. Done. But AI tools aren't like that. They're constantly making decisions about quality vs. cost that you can't see, using commodity models they don't admit to, and trapping your organizational knowledge in ways traditional IT frameworks completely miss.

Here's what traditional IT evaluation gets wrong:

**1. Cost Structure is Inverted**
Normal SaaS: More usage = better for everyone (zero marginal cost)
AI SaaS: More usage = vendor bleeds money on API calls = pressure to degrade quality

Traditional IT doesn't understand that every time you use an AI tool, it costs the vendor real money. They have massive incentive to quietly route you to cheaper models, reduce context windows, and optimize for "looks good enough" rather than accuracy. Your IT team is checking if it "works" without understanding that "works" will change over time as the vendor cuts costs.

**2. The Product is Hidden**
Traditional software: You can see and test what you're buying
AI tools: The actual product (prompts, routing logic, orchestration) is all hidden

IT teams are used to evaluating interfaces and features. But with AI, the interface is almost worthless. What matters is the prompts (which you can't see), the models (which keep changing), and the routing logic (which determines when they screw you). Traditional evaluation is testing the wrapping paper while the vendor hides the actual gift.

**3. Lock-in is Different**
Old lock-in: Your data is trapped
New lock-in: Your organizational AI capability is trapped

IT knows to check data export. But AI tools lock in something more valuable: your team's learned expertise about how to use AI effectively, the prompts you've refined, the workflows you've built. Traditional evaluation misses that the vendor is capturing and hoarding your organizational intelligence, not just your data.

**4. "Proprietary" is Now Bullshit**
Everyone's using the same models (GPT, Claude, Gemini). The "AI" is commoditized. Vendors yelling about "proprietary technology" are hiding that they're just wrapping public APIs with some prompts. Traditional IT hears "proprietary" and thinks "valuable IP." In AI, it usually means "we don't want you to know how simple this is."

You need different evaluation criteria that understand these dynamics.

---

**SUITABLE FOR WORK MODE:**

Traditional IT procurement frameworks were developed for conventional software with predictable cost structures and static capabilities. These frameworks prove insufficient for AI-powered tools, which present unique economic dynamics, opacity challenges, and lock-in mechanisms that conventional evaluation processes fail to address adequately.

**Fundamental Differences Requiring New Evaluation Approaches:**

**1. Economic Structure Inversion**
Conventional SaaS operates on zero marginal cost models where increased usage benefits both parties. AI SaaS involves per-use costs creating vendor incentives to optimize their costs rather than client quality. This economic reality produces pressure to route requests to less expensive models, reduce context windows, and prioritize cost management over output quality—dynamics traditional IT evaluation frameworks do not address.

**2. Product Opacity**
Traditional software evaluation focuses on visible features and interfaces. In AI tools, the actual product—prompts, routing logic, and orchestration mechanisms—typically remains hidden from evaluation. Traditional frameworks test surface-level functionality while the core value drivers and risk factors remain opaque, preventing adequate due diligence.

**3. Capability Lock-in Beyond Data**
Conventional lock-in assessment focuses on data portability. AI tools create additional lock-in through organizational knowledge capture: refined prompts, developed workflows, and team expertise become trapped in vendor-specific formats. Traditional evaluation processes overlook this strategic dependency layer that often exceeds the significance of data lock-in.

**4. Model Commoditization**
Most AI vendors utilize the same foundational models from major providers. Value differentiation occurs in orchestration layers rather than underlying technology. Traditional IT evaluation often misinterprets "proprietary" claims as indicators of unique technology, when such language frequently obscures the commoditized nature of core capabilities.

Organizations require evaluation frameworks specifically designed to address these AI-specific dynamics and risk factors.

---

### The Six Evaluation Criteria

**DIRECT MODE:**

Most vendor evaluations ask the wrong questions. They focus on features, pricing, and integration - basically checking if the tool does what it claims. But with AI, that's missing the point. You need to understand if you can actually see what you're buying, control how it works, and escape when it inevitably becomes obsolete.

**The Six Criteria That Actually Matter:**

**SEE** - Can you see how it works?
If you can't see the prompts, models, and routing logic, you're buying a black box. The vendor can change anything without telling you. You can't audit for quality, bias, or cost optimization that hurts you.

**CHANGE** - Can you control it?
If you can't edit prompts, select models, or adjust context, you're stuck with the vendor's choices. Those choices are optimized for their costs, not your quality. Every AI tool needs customization for your domain - if you can't customize, you're paying for generic mediocrity.

**USE** - Is it actually useful?
Impressive demos mean nothing. Test it on your real work. Is the output actually better than what you have now? Or is it plausible-sounding bullshit that creates more work when you have to fix its mistakes?

**ADAPT** - Can it evolve?
AI is changing fast. If the tool is locked to today's models and can't integrate new ones, it'll be obsolete in 6 months. You need vendors who have a real process for staying current, not vague promises about "evaluating new technology."

**LEAVE** - Can you exit?
If you can't export everything in standard formats and migrate to another vendor or in-house build, you're trapped. The vendor knows it. They'll squeeze you on price and degrade quality because you have no leverage.

**LEARN** - Does it build capability?
The worst vendors want you dependent. The best help you learn AI principles that transfer to other tools. After 6 months, will your team understand AI better, or just know how to navigate this one vendor's interface?

These six criteria cut through vendor marketing to reveal what actually matters.

---

**SUITABLE FOR WORK MODE:**

Effective AI vendor evaluation requires assessment criteria specifically designed to address the unique characteristics and risks of AI-powered tools. The following six criteria provide a comprehensive framework for strategic vendor assessment:

**SEE - Transparency and Visibility**
Comprehensive visibility into system components—prompts, model selection, routing logic, and context management—enables informed oversight and quality assurance. Opacity in these areas prevents adequate due diligence and accountability, creating unacceptable governance risks.

**CHANGE - Control and Customization**
The ability to configure prompts, specify models, and adjust context parameters ensures alignment with organizational requirements. Fixed configurations typically reflect vendor optimization for their costs rather than client quality needs. Domain-specific customization is essential for effective AI deployment.

**USE - Practical Value Delivery**
Evaluation must extend beyond demonstrations to assessment against authentic organizational use cases. Output quality, appropriateness for business context, and uncertainty acknowledgment determine whether the tool delivers genuine value or creates additional work through error correction requirements.

**ADAPT - Evolution and Future-Readiness**
Rapid advancement in AI capabilities requires vendors to demonstrate systematic processes for integrating new models and maintaining system currency. Architectural flexibility and documented update procedures indicate long-term viability and protection against technological obsolescence.

**LEAVE - Portability and Exit Capability**
Comprehensive export capabilities in standard formats and clear migration pathways preserve organizational flexibility and negotiating leverage. Proprietary data formats or unclear transition processes create economic lock-in that persists independent of service quality or pricing reasonableness.

**LEARN - Capability Development**
Systems should build transferable organizational AI expertise rather than vendor-specific dependencies. Standard terminology, experimentation facilitation, and skill portability ensure that organizational investment in AI capability development transcends specific vendor relationships.

These criteria provide strategic evaluation framework addressing AI-specific dynamics conventional IT assessment processes overlook.

---

_[Additional framework content sections would continue with both voice modes for: The Maturity Model, When to Buy vs Build, etc.]_

---

**End of CONTENT.md**

This document contains all questions, explanations, and key framework content in both voice modes. Additional framework pages for the documentation site can be developed using the same dual-voice pattern established here.