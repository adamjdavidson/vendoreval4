# Setting Up ANTHROPIC_API_KEY for Auto-Generate Feature

The CMS has an **"Auto-Generate Corporate"** button that uses Claude API to convert "No BS" content into "Corporate Friendly" tone.

## 🔑 Get Your API Key

1. Go to **https://console.anthropic.com/settings/keys**
2. Create a new API key
3. Copy the key (starts with `sk-ant-api03-...`)

## 🛠️ Local Development Setup

### Step 1: Add Key to Supabase Edge Functions

Edit `supabase/.env` and replace `your-api-key-here` with your actual key:

```bash
# supabase/.env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### Step 2: Restart Edge Functions

Stop the current Edge Function server (if running) and restart:

```bash
# Kill any running supabase functions
pkill -f "supabase functions"

# Restart with environment variables loaded
supabase functions serve --env-file supabase/.env
```

### Step 3: Test Auto-Generate

1. Go to **http://localhost:3000/admin/pages**
2. Create or edit a page
3. Make sure you're on the **"No BS"** version
4. Fill in title and content with "No BS" style text
5. Click **"✨ Auto-Generate Corporate"**
6. Watch it generate the corporate version!

## 🚀 Production Setup

For production (when deploying to Supabase cloud):

```bash
# Set secret in Supabase production project
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-your-key

# Verify it's set
supabase secrets list
```

## ⚠️ Security Notes

- **Never commit** `supabase/.env` to git (it's in `.gitignore`)
- **Never commit** `.env.local` to git (also in `.gitignore`)
- **Don't share** your API key publicly
- **Rotate keys** if accidentally exposed

## 💰 Cost Considerations

The auto-generate feature uses **Claude 3.5 Sonnet** which costs:
- **Input:** $3 per million tokens (~$0.003 per 1000 tokens)
- **Output:** $15 per million tokens (~$0.015 per 1000 tokens)

**Typical usage per page:**
- Input: ~500 tokens (markdown content)
- Output: ~500 tokens (corporate version)
- **Cost per generation:** ~$0.01 (1 cent)

Very affordable for occasional use!

## 🧪 Testing Without API Key

If you don't have an API key yet, you can:
1. Manually enter corporate content (toggle to Corporate version and type)
2. Test all other CMS features (create, edit, delete, publish)
3. Add the API key later when needed

## 📝 Example Transformation

**No BS Input:**
```markdown
# Stop Wasting Time on BS

Vendor marketing is full of crap. This tool cuts through it.

- No fluff
- Real questions
- Honest answers
```

**Corporate Output (Auto-Generated):**
```markdown
# Optimize Your Vendor Selection Process

Vendor evaluation requires careful analysis beyond marketing materials. Our framework facilitates informed decisions.

- Structured assessment methodology
- Comprehensive evaluation criteria
- Data-driven insights
```

---

**Ready to test?** Add your API key to `supabase/.env` and restart Edge Functions!
