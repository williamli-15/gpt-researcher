from .base import BaseConfig

DEFAULT_CONFIG: BaseConfig = {
    "RETRIEVER": "tavily",
    "EMBEDDING": "openai:text-embedding-3-small",
    "SIMILARITY_THRESHOLD": 0.42,
    "FAST_LLM": "openai:gpt-4o-mini",
    "SMART_LLM": "openai:gpt-4.1",  # Has support for long responses (2k+ words).
    "STRATEGIC_LLM": "openai:o4-mini",  # Can be used with o1 or o3, please note it will make tasks slower.
    "FAST_TOKEN_LIMIT": 3000,
    "SMART_TOKEN_LIMIT": 6000,
    "STRATEGIC_TOKEN_LIMIT": 4000,
    "BROWSE_CHUNK_MAX_LENGTH": 8192,
    "CURATE_SOURCES": True,
    "SUMMARY_TOKEN_LIMIT": 700,
    "TEMPERATURE": 0.4,
    "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
    "MAX_SEARCH_RESULTS_PER_QUERY": 5,
    "MEMORY_BACKEND": "local",
    "TOTAL_WORDS": 1200,
    "REPORT_FORMAT": "APA",
    "MAX_ITERATIONS": 3,
    "AGENT_ROLE": None,
    "SCRAPER": "bs",
    "MAX_SCRAPER_WORKERS": 15,
    "MAX_SUBTOPICS": 3,
    "LANGUAGE": "english",
    "REPORT_SOURCE": "web",
    # --- ADD YOUR NEW DEFAULT DOMAIN LIST HERE ---
    "QUERY_DOMAINS": [
        # == Top-Level National & International Dental Associations ==
        "ada.org",              # American Dental Association (USA)
        "bda.org",              # British Dental Association (UK)
        "cda-adc.ca",           # Canadian Dental Association
        "fdiworlddental.org",   # FDI World Dental Federation (Global)

        # == Official U.S. Dental Specialty Organizations (All 12) ==
        "asda.org",             # Anesthesiology
        "aaphd.org",            # Public Health
        "aae.org",              # Endodontics
        "aaomp.org",            # Oral Pathology
        "aaomr.org",            # Oral Radiology
        "aaoms.org",            # Oral Surgery
        "aaom.com",             # Oral Medicine
        "aaop.org",             # Orofacial Pain
        "aaoinfo.org",          # Orthodontics
        "aapd.org",             # Pediatric Dentistry
        "perio.org",            # Periodontics
        "prosthodontics.org",   # Prosthodontics

        # == Core Research Databases & Government Bodies ==
        "pubmed.ncbi.nlm.nih.gov",   # PubMed (precise)
        "pmc.ncbi.nlm.nih.gov",      # PubMed Central full text
        "cochranelibrary.com",       # Cochrane Reviews
        "cochrane.org",              # Cochrane Oral Health (news/summaries)
        "nidcr.nih.gov",        # US National Institute of Dental & Craniofacial Research
        "cdc.gov",              # Centers for Disease Control and Prevention
        "who.int",              # World Health Organization

        # == Major Scientific Publishers (Hosts the journals you listed) ==
        "onlinelibrary.wiley.com",        # Hosts Periodontology 2000, IEJ, JCP, COIR
        "sciencedirect.com",            # Hosts Dental Materials, Journal of Dentistry, etc.
        "nature.com",                   # Hosts International Journal of Oral Science
        "journals.sagepub.com",         # Hosts Journal of Dental Research
        "link.springer.com",            # Main Springer site
        "progressinorthodontics.springeropen.com", # Specific host for Progress in Orthodontics

        "tandfonline.com",              # Taylor & Francis, another major publisher
        "quintpub.com",              # Quintessence Publishing, respected in dentistry
        "iadr.org",                  # Association materials & policy (not a publisher)

        # == DOI Resolver (helps land on the real article page) ==
        "doi.org",

        # # == High-Authority Guideline Producers ==
        # "nice.org.uk",               # NICE guidance (oral/dental)
        # "sign.ac.uk",                # SIGN dental guidelines
        # "sdcep.org.uk",              # SDCEP dental guidance
        # "efp.org",                   # EFP S3 perio guidelines
        # "eapd.eu",                   # EAPD guidance
        # "ahajournals.org",           # AHA IE prophylaxis statements (cross-discipline)

        # == Optional discovery-only (consider moving to a separate list) ==
        # "scholar.google.com",
        # "doaj.org",
        # "frontiersin.org",
        # "mdpi.com"
       
    ],
    # --- END OF YOUR ADDITION ---
    
    "DOC_PATH": "./my-docs",
    "PROMPT_FAMILY": "default",
    "LLM_KWARGS": {},
    "EMBEDDING_KWARGS": {},
    "VERBOSE": False,
    # Deep research specific settings
    "DEEP_RESEARCH_BREADTH": 3,
    "DEEP_RESEARCH_DEPTH": 2,
    "DEEP_RESEARCH_CONCURRENCY": 4,
    
    # MCP retriever specific settings
    "MCP_SERVERS": [],  # List of predefined MCP server configurations
    "MCP_AUTO_TOOL_SELECTION": True,  # Whether to automatically select the best tool for a query
    "MCP_ALLOWED_ROOT_PATHS": [],  # List of allowed root paths for local file access
    "MCP_STRATEGY": "fast",  # MCP execution strategy: "fast", "deep", "disabled"
    "REASONING_EFFORT": "medium",
}
