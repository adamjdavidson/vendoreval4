# AI-Powered SaaS is Different
## Don't let the similarities fool you. 
  
AI-powered SaaS is an entirely different category of product from traditional SaaS.   
The business model is totally different.   
The way they work is totally different.   
The way you work with them is totally different. 
How they create value and how that value unfolds over time is totally different.  
How you should evaluate the build vs. buy decision is totally different.  
  
By my repeated use of the phrase "totally different," I hope I'm getting across that these are totally, totally, completely, and entirely different.  
  
And the companies that sell you AI-powered SaaS don't want you to think too much about this. (That’s why we created this guide.)   

## Built Around A Commodity Core
Nearly all AI-powered software uses one or more of the same standard AI models that you can use directly: the ones from OpenAI, Anthropic, Google, or one of a few others. 
Any time the AI tool takes a beat—a few seconds to minutes—to process, it’s sending data to one of those models, waiting for it to do its AI magic, and then receiving the result. 
### What are you buying?  
#### Just a Wrapper?
A lot of AI-Powered SaaS does little else. They are called “wrappers.” They are little more than a thin bit of pretty paper around those core models. The developers take your input—your data, your questions—and add a few prompts and then send them to the model and wait for the response. 
These Wrappers can have some value, such as some well-thought through prompts. Generally, though, they are adding only a tiny bit of value in the short-term and may be counterproductive in the long-term. They are preventing you and your team from learning how to prompt yourselves. And they are unlikely to stay on top of the latest advances in prompting. 
#### What’s the Special Sauce?
If the tool goes beyond just a prompt wrapped around an LLM, it is likely one of a few added-value techniques.  
##### Connectors
These connect key data to the LLMs. This might be your own company data, such as emails, slack messages, documents, sales info, etc. Providing this data to the LLM with all the right permissions is a massive engineering task and so when done well, it’s certainly added-value. 
##### Proprietary Data
Several vendors promise access to proprietary data that can make generic LLMs useful for specific industries or use cases. Some will add model fine-tuning or reinforced learning to focus generic LLMs on specific applications. 
##### Enterprise-Grade Security and Infrastructure
Left to themselves, LLMs don’t particularly care about security, permissions, rules. So, many (probably most) B2B AI-Powered SaaS tools are built to satisfy compliance and governance needs. 
##### Enterprise Control
Most B2B AI tools are designed to make it relatively easy to onboard new users, de-activate separated employees, manage permissions, and the rest. 

### What you are buying is … NOT AI
In most cases, the value added by a vendor is not the AI itself. The AI is the commodity LLM at the core. They are selling you the stuff that surrounds that LLM, which typically looks a lot like traditional software. 
> > Warning: the vendor should be able to clearly articulate the added value they provide distinct from the LLM. If they can’t, they aren’t adding much value. 

### Won’t the big LLM companies just take this business?
Probably. In many cases. It’s happened a lot already. And it’s what keeps AI SaaS executives up at night. 

### If it’s just prompts, can’t we build this ourselves?
Yes! Probably. And in trying to build it yourself, you will learn a lot about how LLMs work, how to best use LLMs in your specific context. And, sometimes, you’ll realize just how valuable a vendor’s tools actually are.   


## An Entirely Different Business Model
**Traditional SaaS** (Salesforce, Office, Workday, SAP, whatever) has a fairly simple foundational business model:
- Spend a ton of money and effort on proprietary software.
- Launch the product once enough functionality is proven.
- Every additional user and every additional use is essentially free. 
There is enormous attention paid to the LTV/CAC ratio in these kinds of businesses.   
LTV means lifetime value. (How much you spend each year) X (total number of years you use the tool)=LTV. They know that to get you using the tool for a long time, it has to be truly useful. 
CAC is the customer acquisition cost. They want to spend less money on acquiring new customers. This often means making a product good enough that you will recommend it to others and get others in your company to use it. 

**Your interests are (at least somewhat) aligned**: to increase LTV and reduce CAC, they need a product with value that is quickly graspable by new customers and useful enough over the long term to retain old ones. 

When this works, it’s magic. Almost all those FAANG businesses—the unicorns that have become the largest companies in the history of the world—operate on massive profit margins (often above 90%) when they tune LTV/CAC just right. (Apple is a fascinating case, in which it has both LTV/CAC and traditional hardware economics. It’s complicated, but essentially it’s more an LTV/CAC business than, say, Dell Computers). 

**AI Ain’t LTV/CAC it’s COGS** (i.e, your interests aren’t aligned)  
Most AI software costs money every single time it’s used. That’s because most AI-powered software has to pay OpenAI, Google, Anthropic or another vendor for every token called, every question asked. (That’s true for OpenAI, Google, and Anthropic, themselves, who incur real cost with every token call.)   
This introduces *Cost of Goods Sold* or COGS. If you use an AI-powered tool all of the time, you can be a net drain on a company’s balance sheet. You could cost them money. 
#### They have to balance their desire for you to use their tool against the risk of you using it too much or in too expensive a way. 
There is an inherent incentive to lower the cost of you using it each and every time. There are some above-board ways of doing this and some pretty shady ways too.   
Some of the shady ways:
- Using cheaper AI models when a better model would be more appropriate for the task. 
- Reducing the amount of context below what is optimal (more context=more tokens=more cost). 
- Creating output that appears more useful than it actually is. (It’s cheaper to dial in a long, comprehensive-seeming report than to spend the multiple turns and extra thinking time required for an actually useful report.) 
### Assume the worst
> > Assume the following about any tool unless you are shown otherwise:
> > - The system prompt has some tricks to lower the cost of your use even if a higher-cost model would do the job better for you. 

## Predetermined Vs. Emergent 
Traditional software was deliberately designed. Whatever function you're considering was put there on purpose as the result of a bunch of meetings that involved marketing, R&D, and the technical developers. If you ever find something that they didn't put there on purpose, then it's considered a problem, a bug that will be stamped out.  
  
AI-powered tools typically have emergent value. That means that nobody, not Sam Altman, or Sundar Pichai, or you or me, knows all the things they can do. And truly nobody knows how they will add the most value to your business. That's something you're going to figure out over time. 


## Is it Useful?
LLMs are incredibly good at creating _performance theater_: the impression of usefulness even when they provide output that is not useful at all or is counterproductive. 
You ask for a report on competitive threats or an analysis of sales from the last two quarters and you get a gorgeous response written in a casually confident style, complete with tons of data supporting every claim. 
And … it’s nonsense. The data was made up or misinterpreted. The analysis is thin and misses many crucial details. 
When properly guided and constrained, LLMs can also produce remarkably useful and trustworthy output. 
The problem is that the nonsense and the useful stuff look quite similar. And it’s a lot more work — and costs a lot more tokens, time, and money — to turn theater into a hiqh-quality performance. 

#### The AI Software Paradox
> > If it’s useful out of the box, it’s probably not good for you! 
Nobody wants software that isn't useful.   
But AI forces us to rethink what “useful” means. 
But if you're getting a sales pitch that's showing off a complete system with clear, pre-planned methods, tools, ways of adding value, it’s almost certainly not using the greatest strengths of AI.   

## AI SaaS and Time
Enterprise SaaS products are typically bought for years, often decades. When is the last time you changed your office suite, ERP, HR backbone, finance tools? It was a while ago. And it sucked. That transition took months. 
### A Clock Is Ticking
As you know, every few weeks—sometimes every few days—there are major advances in one or more of the LLM labs or a competitor in China or elsewhere who spurs a frenzy of development. 
Each new model generation and each new capability, such as agents, deep thinking, or skills, requires an adjustment in how LLM tools are used. These adjustments are great, because you can do more. But they are disruptive. 
In some cases, they render existing SaaS products redundant. 2023 and 2024 saw the collapse of hundreds of SaaS startups built around prompting techniques built around the limitations of GPT-3, only to see their entire value disappear with the launch of GPT-4. 
Vendors learned some lessons; good ones and bad ones. 
**Good Lessons**: 
- Build agile, flexible systems that can adjust to new models. 
- Quickly incorporate new capabilities of frontier models.  
- Adjust (sometimes radically) prompting and context approaches based on new models. 
- Communicate clearly to customers how they need to adjust workflows to take advantage of new capabilities. 
**Bad Lessons**:
- Build rigid workflows, customer interfaces that are locked in to existing/outmoded models. 
- Maintain old models that “work.” 
- Communicate stability rather than agility.   


## Building Capacity or Locking You In
This is all new. 
The AI models are new. The ways we work with them are new. The best practices and most effective processes are new. 
They’re not just new—they’re emerging in real time. The best practices of 2027 haven’t even been dreamed of yet. 
And, by 2027, you will want your entire staff to have at least basic AI literacy. They will need to have some intuition about how to get the best out of AI tools, how to best incorporate human- and AI-decision-making. 
And your senior leadership will need to have far more than basic-level literacy. They will need to understand how to think strategically about a company employing tens of thousands (at least) of AI agents. 
The next two years are crucial. The companies that succeed will be those that have deep AI capacity. 
**So don’t outsource your capacity to a vendor!** 
You know the folks in your company who use some specific tool all day, every day, for what they do. Like Workday. Have you ever heard an HR person talk about “Sup Orgs” and their “BPs” and maybe correct you when you ask about “headcount” and they say, “oh, you mean “position management.” That’s Workday-speak. Lots of big SaaS vendors use platform-specific language and so do their users. If you switch from Workday to SAP SuccessFactors, they will need to learn a new language and a new framework for thinking about how a company is organized. (Sorry, how “Foundation Objects” are defined). 
If you adopt AI tools from a big vendor, you are at risk of handing over the language and mental frameworks to this one provider, just as your company is in the early stages of developing AI literacy. 

## None of this is reasonable
Frankly, we’re being absurd here. At least from the perspective of a vendor. 

We want:
- Transparent prompts. 
- Complete user control of all variables. 
- Constant updating and adjusting as models improve. 
- Ease of exit. 

We want the vendor to spend a ton of money and time building a tool that adjusts quickly to our needs but we aren’t willing to do any of the things that would ensure they make money—like having long-term contracts and accepting their ownership of proprietary methods. 

But, well, that’s the friggin’ point! AI is different. The economics and capabilities are different:
- You really can build your own tools. 
- You don’t need vendors nearly as much as you used to. 

So, you should approach them differently. Demand different things. 