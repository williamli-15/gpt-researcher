import json
import re
import json_repair
from ..utils.llm import create_chat_completion
from ..prompts import PromptFamily

async def choose_agent(
    query,
    cfg,
    parent_query=None,
    cost_callback: callable = None,
    headers=None,
    prompt_family: type[PromptFamily] | PromptFamily = PromptFamily,
    **kwargs
):
    """
    Chooses the agent automatically.
    MODIFIED: This function is now hardcoded to always return the 
              Evidence-Based Medicine Expert agent. The dynamic selection
              logic has been bypassed.
    """
    
    # 1. Define our predefined Agent name
    agent_name = "🔬 Evidence-Based Medicine Expert"
    
    # 2. Define our predefined Agent role commands (copied from handle_json_error)
    agent_role_prompt = (
        "You are an expert AI assistant specializing in evidence-based dental medicine. Your primary goal is to "
        "compose comprehensive, accurate, and clinically relevant reports. Your entire research process MUST adhere to "
        "the principles of evidence-based practice.\n\n"
        
        "**Search Strategy Mandate:**\n"
        "1.  **Prioritize Official Guidelines**: Your first priority is to find clinical guidelines. Construct search "
        "queries using `site:` operators for official bodies like `site:ada.org`, `site:perio.org`, etc., combined "
        "with the topic and keywords like 'clinical practice guideline' or 'recommendations'.\n"
        "2.  **Target Peer-Reviewed Articles**: Your second priority is to find scientific articles. Construct queries "
        "that combine the topic with keywords that point to articles, such as 'journal', 'study', 'review', 'doi', or "
        "'pubmed'.\n"
        "3.  **Recognize and Target Article URL Patterns**: You MUST understand that real articles are often found at specific URL "
        "paths and you should aim to find pages with these structures. Examples of high-quality article patterns include:\n"
        "    - `onlinelibrary.wiley.com/doi/...`\n"
        "    - `sciencedirect.com/science/article/pii/...`\n"
        "    - `nature.com/articles/...`\n"
        "    - `journals.sagepub.com/doi/...`\n"
        "    - `link.springer.com/article/...` or `...springeropen.com/articles/...`\n"
        "    - `ncbi.nlm.nih.gov/pmc/articles/...`\n\n"

        "**Content Synthesis Mandate:**\n"
        "When writing the final report, you MUST give the highest priority and weight to evidence from URLs matching the "
        "scientific article patterns listed above. This information is the primary source of truth. Information from general web pages or "
        "clinic blogs, even if from a trusted domain, must be considered secondary and used only for supplementary context."
    )
    
    # 3. Directly return our predefined roles and commands without invoking the LLM at all.
    return agent_name, agent_role_prompt


async def handle_json_error(response):
    try:
        agent_dict = json_repair.loads(response)
        if agent_dict.get("server") and agent_dict.get("agent_role_prompt"):
            return agent_dict["server"], agent_dict["agent_role_prompt"]
    except Exception as e:
        print(f"⚠️ Error in reading JSON and failed to repair with json_repair: {e}")
        print(f"⚠️ LLM Response: `{response}`")

    json_string = extract_json_with_regex(response)
    if json_string:
        try:
            json_data = json.loads(json_string)
            return json_data["server"], json_data["agent_role_prompt"]
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")

    print("No JSON found in the string. Falling back to Default Agent.")
    return "Default Agent", (
        "You are an expert AI assistant specializing in evidence-based dental medicine. Your primary goal is to "
        "compose comprehensive, accurate, and clinically relevant reports. Your entire research process MUST adhere to "
        "the principles of evidence-based practice.\n\n"
        
        "**Search Strategy Mandate:**\n"
        "1.  **Prioritize Official Guidelines**: Your first priority is to find clinical guidelines. Construct search "
        "queries using `site:` operators for official bodies like `site:ada.org`, `site:perio.org`, etc., combined "
        "with the topic and keywords like 'clinical practice guideline' or 'recommendations'.\n"
        "2.  **Target Peer-Reviewed Articles**: Your second priority is to find scientific articles. Construct queries "
        "that combine the topic with keywords that point to articles, such as 'journal', 'study', 'review', 'doi', or "
        "'pubmed'.\n"
        "3.  **Recognize and Target Article URL Patterns**: You MUST understand that real articles are often found at specific URL "
        "paths and you should aim to find pages with these structures. Examples of high-quality article patterns include:\n"
        "    - `onlinelibrary.wiley.com/doi/...`\n"
        "    - `sciencedirect.com/science/article/pii/...`\n"
        "    - `nature.com/articles/...`\n"
        "    - `journals.sagepub.com/doi/...`\n"
        "    - `link.springer.com/article/...` or `...springeropen.com/articles/...`\n"
        "    - `ncbi.nlm.nih.gov/pmc/articles/...`\n\n"

        "**Content Synthesis Mandate:**\n"
        "When writing the final report, you MUST give the highest priority and weight to evidence from URLs matching the "
        "scientific article patterns listed above. This information is the primary source of truth. Information from general web pages or "
        "clinic blogs, even if from a trusted domain, must be considered secondary and used only for supplementary context."
    )

def extract_json_with_regex(response):
    json_match = re.search(r"{.*?}", response, re.DOTALL)
    if json_match:
        return json_match.group(0)
    return None
