import json
import re
from functools import lru_cache
from pathlib import Path
import json_repair
from ..prompts import PromptFamily

DEFAULT_AGENT_PROFILE = "a_clinic_daily"
_AGENT_CONFIG_DIR = Path(__file__).resolve().parent.parent / "config" / "agents"


@lru_cache(maxsize=None)
def _load_agent_profile(profile_id: str) -> dict:
    """Load an agent profile configuration from disk (cached)."""
    config_path = _AGENT_CONFIG_DIR / f"{profile_id}.json"
    if not config_path.exists():
        raise FileNotFoundError(f"Agent profile config not found for '{profile_id}' at {config_path}")
    with open(config_path, "r", encoding="utf-8") as fp:
        return json.load(fp)


def _resolve_agent_profile(profile_id: str | None) -> tuple[str, dict]:
    """Return the resolved profile id and configuration, falling back to default if needed."""
    candidates = []
    if profile_id:
        candidates.append(profile_id)
    candidates.append(DEFAULT_AGENT_PROFILE)

    last_exception: Exception | None = None
    for candidate in candidates:
        try:
            config = _load_agent_profile(candidate)
            return candidate, config
        except FileNotFoundError as exc:
            last_exception = exc
        except json.JSONDecodeError as exc:
            last_exception = exc
            print(f"❌ Failed to parse agent profile '{candidate}': {exc}")
        except Exception as exc:
            last_exception = exc
            print(f"❌ Unexpected error loading agent profile '{candidate}': {exc}")

    raise FileNotFoundError(f"Unable to load any agent profile. Last error: {last_exception}")

async def choose_agent(
    query,
    cfg,
    agent_profile: str | None = None,
    parent_query=None,
    cost_callback: callable = None,
    headers=None,
    prompt_family: type[PromptFamily] | PromptFamily = PromptFamily,
    **kwargs
):
    """
    Chooses the agent configuration based on a static profile.
    Profiles are stored in JSON files under `config/agents/` and contain the agent role prompt
    plus default domain filters. This replaces the legacy LLM-powered selection routine.
    """
    resolved_profile, agent_config = _resolve_agent_profile(agent_profile)

    agent_name = agent_config.get("agent_name", resolved_profile.replace("_", " ").title())
    agent_role_prompt = agent_config.get("agent_role_prompt")
    if not agent_role_prompt:
        raise ValueError(f"Agent profile '{resolved_profile}' is missing 'agent_role_prompt'.")

    query_domains = agent_config.get("query_domains", [])
    if not isinstance(query_domains, list):
        raise ValueError(f"'query_domains' must be a list in agent profile '{resolved_profile}'.")

    print(f"✅ Loaded agent profile '{resolved_profile}' ({agent_name}).")
    return agent_name, agent_role_prompt, query_domains, resolved_profile


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
