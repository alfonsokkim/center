from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity as sk_cosine
import numpy as np
from urllib.parse import urlparse

# TRUSTED DOMAIN REGISTRY
# base  = score floor when scraping fails or returns empty content
# tags  = fields this domain is relevant to (drives goal-similarity blending)

TRUSTED_DOMAINS: dict[str, dict] = {

    # ── UNIVERSAL ACADEMIC / RESEARCH ────────────────────────────────────────
    "en.wikipedia.org":              {"base": 55, "tags": ["general", "research", "all"]},
    "www.britannica.com":            {"base": 60, "tags": ["general", "research", "all"]},
    "scholar.google.com":            {"base": 80, "tags": ["research", "all"]},
    "www.jstor.org":                 {"base": 78, "tags": ["research", "humanities", "social_science"]},
    "www.researchgate.net":          {"base": 75, "tags": ["research", "all"]},
    "academia.edu":                  {"base": 72, "tags": ["research", "humanities", "social_science"]},
    "pubmed.ncbi.nlm.nih.gov":       {"base": 85, "tags": ["medicine", "biology", "chemistry"]},
    "www.ncbi.nlm.nih.gov":          {"base": 85, "tags": ["medicine", "biology", "chemistry"]},
    "arxiv.org":                     {"base": 82, "tags": ["cs", "physics", "math", "engineering"]},
    "www.semanticscholar.org":       {"base": 78, "tags": ["research", "all"]},
    "www.scopus.com":                {"base": 78, "tags": ["research", "all"]},
    "www.worldcat.org":              {"base": 65, "tags": ["research", "all"]},
    "openstax.org":                  {"base": 72, "tags": ["general", "all"]},
    "www.khanacademy.org":           {"base": 60, "tags": ["general", "all"]},
    "ocw.mit.edu":                   {"base": 82, "tags": ["cs", "engineering", "math", "physics"]},
    "oyc.yale.edu":                  {"base": 78, "tags": ["humanities", "social_science", "all"]},
    "www.coursera.org":              {"base": 45, "tags": ["general", "all"]},
    "www.edx.org":                   {"base": 45, "tags": ["general", "all"]},
    "www.overleaf.com":              {"base": 75, "tags": ["research", "all"]},
    "www.zotero.org":                {"base": 70, "tags": ["research", "all"]},
    "owl.purdue.edu":                {"base": 72, "tags": ["humanities", "research", "all"]},

    # ── COMPUTER SCIENCE / PROGRAMMING ───────────────────────────────────────
    "github.com":                    {"base": 82, "tags": ["cs", "programming"]},
    "gitlab.com":                    {"base": 80, "tags": ["cs", "programming"]},
    "stackoverflow.com":             {"base": 78, "tags": ["cs", "programming"]},
    "www.geeksforgeeks.org":         {"base": 75, "tags": ["cs", "programming"]},
    "realpython.com":                {"base": 80, "tags": ["cs", "programming"]},
    "docs.python.org":               {"base": 82, "tags": ["cs", "programming"]},
    "developer.mozilla.org":         {"base": 80, "tags": ["cs", "programming", "web"]},
    "leetcode.com":                  {"base": 78, "tags": ["cs", "programming"]},
    "www.hackerrank.com":            {"base": 75, "tags": ["cs", "programming"]},
    "www.tutorialspoint.com":        {"base": 70, "tags": ["cs", "programming", "engineering"]},
    "www.w3schools.com":             {"base": 65, "tags": ["cs", "programming", "web"]},
    "visualgo.net":                  {"base": 82, "tags": ["cs", "algorithms"]},
    "www.codecademy.com":            {"base": 65, "tags": ["cs", "programming"]},
    "repl.it":                       {"base": 75, "tags": ["cs", "programming"]},
    "colab.research.google.com":     {"base": 80, "tags": ["cs", "programming", "data_science"]},
    "www.cppreference.com":          {"base": 82, "tags": ["cs", "programming"]},
    "docs.oracle.com":               {"base": 80, "tags": ["cs", "programming"]},
    "devdocs.io":                    {"base": 78, "tags": ["cs", "programming"]},
    "news.ycombinator.com":          {"base": 38, "tags": ["cs", "programming"]},
    "www.kaggle.com":                {"base": 72, "tags": ["cs", "data_science", "ml"]},
    "huggingface.co":                {"base": 75, "tags": ["cs", "ml", "ai"]},
    "pytorch.org":                   {"base": 80, "tags": ["cs", "ml", "programming"]},
    "www.tensorflow.org":            {"base": 80, "tags": ["cs", "ml", "programming"]},

    # ── MATHEMATICS ──────────────────────────────────────────────────────────
    "www.mathsisfun.com":            {"base": 65, "tags": ["math"]},
    "mathworld.wolfram.com":         {"base": 78, "tags": ["math"]},
    "www.wolframalpha.com":          {"base": 60, "tags": ["math", "engineering", "physics"]},
    "www.desmos.com":                {"base": 72, "tags": ["math"]},
    "math.stackexchange.com":        {"base": 78, "tags": ["math"]},
    "www.artofproblemsolving.com":   {"base": 72, "tags": ["math", "cs"]},
    "brilliant.org":                 {"base": 72, "tags": ["math", "physics", "cs"]},
    "www.3blue1brown.com":           {"base": 70, "tags": ["math", "physics"]},

    # ── PHYSICS / ENGINEERING ────────────────────────────────────────────────
    "www.allaboutcircuits.com":      {"base": 80, "tags": ["engineering", "physics", "ee"]},
    "www.electronics-tutorials.ws":  {"base": 78, "tags": ["engineering", "ee"]},
    "www.circuitlab.com":            {"base": 80, "tags": ["engineering", "ee"]},
    "www.falstad.com":               {"base": 78, "tags": ["engineering", "ee", "physics"]},
    "www.physicsclassroom.com":      {"base": 72, "tags": ["physics"]},
    "hyperphysics.phy-astr.gsu.edu": {"base": 78, "tags": ["physics"]},
    "www.engineeringtoolbox.com":    {"base": 72, "tags": ["engineering"]},
    "www.sciencedirect.com":         {"base": 75, "tags": ["engineering", "physics", "chemistry", "biology"]},
    "ieeexplore.ieee.org":           {"base": 82, "tags": ["engineering", "ee", "cs"]},
    "www.nist.gov":                  {"base": 75, "tags": ["engineering", "physics", "chemistry"]},

    # ── BIOLOGY / MEDICINE / CHEMISTRY ───────────────────────────────────────
    "www.drugs.com":                 {"base": 78, "tags": ["medicine", "pharmacology"]},
    "www.uptodate.com":              {"base": 85, "tags": ["medicine", "pharmacology"]},
    "www.medscape.com":              {"base": 80, "tags": ["medicine", "pharmacology"]},
    "www.mayoclinic.org":            {"base": 72, "tags": ["medicine", "biology"]},
    "www.cdc.gov":                   {"base": 72, "tags": ["medicine", "biology", "public_health"]},
    "www.who.int":                   {"base": 72, "tags": ["medicine", "public_health"]},
    "www.nih.gov":                   {"base": 80, "tags": ["medicine", "biology", "chemistry"]},
    "www.biochemistry.org":          {"base": 78, "tags": ["biology", "chemistry"]},
    "www.rcsb.org":                  {"base": 78, "tags": ["biology", "chemistry"]},
    "www.genome.gov":                {"base": 78, "tags": ["biology", "genetics"]},

    # ── HISTORY / HUMANITIES ─────────────────────────────────────────────────
    "www.history.com":               {"base": 65, "tags": ["history"]},
    "www.iwm.org.uk":                {"base": 78, "tags": ["history"]},
    "www.archives.gov":              {"base": 82, "tags": ["history", "law", "social_science"]},
    "www.nationalarchives.gov.uk":   {"base": 82, "tags": ["history"]},
    "avalon.law.yale.edu":           {"base": 85, "tags": ["history", "law"]},
    "www.loc.gov":                   {"base": 82, "tags": ["history", "law", "humanities"]},
    "www.bbc.co.uk":                 {"base": 55, "tags": ["history", "social_science", "general"]},
    "www.historytoday.com":          {"base": 68, "tags": ["history"]},
    "plato.stanford.edu":            {"base": 85, "tags": ["humanities", "philosophy"]},
    "www.gutenberg.org":             {"base": 72, "tags": ["humanities", "literature"]},
    "www.poetryfoundation.org":      {"base": 72, "tags": ["humanities", "literature"]},

    # ── LAW ──────────────────────────────────────────────────────────────────
    "www.austlii.edu.au":            {"base": 88, "tags": ["law"]},
    "www.legislation.gov.au":        {"base": 85, "tags": ["law"]},
    "www.asic.gov.au":               {"base": 82, "tags": ["law", "business"]},
    "www.hcourt.gov.au":             {"base": 85, "tags": ["law"]},
    "www.federalcourt.gov.au":       {"base": 82, "tags": ["law"]},
    "law.cornell.edu":               {"base": 85, "tags": ["law"]},
    "www.law.cornell.edu":           {"base": 85, "tags": ["law"]},
    "www.lawcouncil.asn.au":         {"base": 78, "tags": ["law"]},
    "supreme.justia.com":            {"base": 80, "tags": ["law"]},

    # ── ECONOMICS / BUSINESS / FINANCE ───────────────────────────────────────
    "www.investopedia.com":          {"base": 72, "tags": ["business", "economics", "finance"]},
    "www.abs.gov.au":                {"base": 82, "tags": ["business", "economics", "social_science"]},
    "www.rba.gov.au":                {"base": 80, "tags": ["economics", "finance"]},
    "www.imf.org":                   {"base": 80, "tags": ["economics", "finance"]},
    "www.worldbank.org":             {"base": 78, "tags": ["economics", "social_science"]},
    "www.federalreserve.gov":        {"base": 78, "tags": ["economics", "finance"]},
    "www.statista.com":              {"base": 72, "tags": ["business", "economics", "social_science"]},
    "www.ibisworld.com":             {"base": 80, "tags": ["business", "economics"]},
    "www.deloitte.com":              {"base": 72, "tags": ["business"]},
    "www.pwc.com":                   {"base": 72, "tags": ["business"]},
    "www.mckinsey.com":              {"base": 72, "tags": ["business"]},
    "hbr.org":                       {"base": 72, "tags": ["business", "economics"]},
    "www.ft.com":                    {"base": 68, "tags": ["business", "economics", "finance"]},
    "www.economist.com":             {"base": 70, "tags": ["economics", "business", "social_science"]},

    # ── PSYCHOLOGY / SOCIAL SCIENCES ─────────────────────────────────────────
    "www.simplypsychology.org":      {"base": 72, "tags": ["psychology", "social_science"]},
    "www.apa.org":                   {"base": 80, "tags": ["psychology", "social_science"]},
    "www.psychologytoday.com":       {"base": 60, "tags": ["psychology"]},
    "www.frontiersin.org":           {"base": 78, "tags": ["psychology", "biology", "medicine", "social_science"]},
    "www.pewresearch.org":           {"base": 75, "tags": ["social_science"]},
}

# FIELD DESCRIPTORS
# Natural language descriptions embedded at startup and reused for every
# goal — measuring how well the student's goal aligns with a domain's field.

FIELD_DESCRIPTIONS: dict[str, str] = {
    "cs":            "computer science programming software algorithms data structures coding Python Java C",
    "programming":   "writing code software development debugging functions classes programming languages",
    "web":           "web development HTML CSS JavaScript frontend backend websites",
    "algorithms":    "algorithms sorting searching graph traversal dynamic programming complexity",
    "data_science":  "data science machine learning statistics pandas numpy datasets analysis",
    "ml":            "machine learning deep learning neural networks AI model training",
    "ai":            "artificial intelligence large language models transformers NLP computer vision",
    "math":          "mathematics algebra calculus statistics proofs theorems equations",
    "physics":       "physics mechanics thermodynamics electromagnetism quantum relativity",
    "ee":            "electrical engineering circuits electronics signals filters components",
    "engineering":   "engineering design systems mechanics materials circuits lab reports",
    "biology":       "biology cells genetics evolution ecology organisms molecular biochemistry",
    "chemistry":     "chemistry reactions compounds molecules periodic table organic inorganic",
    "medicine":      "medicine anatomy physiology disease diagnosis treatment clinical pharmacology",
    "pharmacology":  "pharmacology drugs mechanisms dosage receptors side effects treatment",
    "public_health": "public health epidemiology disease prevention population health policy",
    "genetics":      "genetics DNA RNA genes inheritance genome sequencing mutation",
    "history":       "history historical events primary sources wars civilisations timeline",
    "humanities":    "humanities literature philosophy art culture language essay analysis",
    "philosophy":    "philosophy ethics logic metaphysics epistemology argument theory",
    "literature":    "literature novels poetry prose analysis themes authors writing",
    "law":           "law legislation statutes cases court rulings legal argument rights",
    "business":      "business management strategy marketing operations industry analysis report",
    "economics":     "economics supply demand GDP inflation monetary policy markets trade",
    "finance":       "finance investment stocks bonds valuation risk portfolio",
    "social_science":"social science sociology anthropology political science research methods",
    "psychology":    "psychology behaviour cognition mental health neuroscience experiments",
    "research":      "academic research peer review citations methodology scholarly sources",
    "general":       "general education learning study courses university academic",
    "all":           "university study assignment homework research any subject",
}


def build_field_embeddings(model: SentenceTransformer) -> dict[str, np.ndarray]:
    return {
        field: model.encode(desc)
        for field, desc in FIELD_DESCRIPTIONS.items()
    }


def get_goal_field_similarity(
    goal_embedding: np.ndarray,
    tags: list[str],
    field_embeddings: dict[str, np.ndarray],
) -> float:
    sims = [
        float(sk_cosine(goal_embedding.reshape(1, -1), field_embeddings[tag].reshape(1, -1))[0][0])
        for tag in tags
        if tag in field_embeddings
    ]
    return max(sims) if sims else 0.0


def trusted_domain_score(
    url: str,
    goal_embedding: np.ndarray,
    field_embeddings: dict[str, np.ndarray],
) -> float | None:
    domain = urlparse(url).netloc.lower()
    bare   = domain.replace("www.", "")

    entry = TRUSTED_DOMAINS.get(domain) or TRUSTED_DOMAINS.get(bare)
    if entry is None:
        return None

    base = entry["base"]
    tags = entry["tags"]

    # Domains tagged "all" are always considered relevant
    field_sim = 0.40 if "all" in tags else get_goal_field_similarity(
        goal_embedding, tags, field_embeddings
    )

    if field_sim >= 0.40:
        adjusted = base + (100 - base) * 0.25
    elif field_sim >= 0.30:
        adjusted = base
    elif field_sim >= 0.20:
        adjusted = base * 0.70
    elif field_sim >= 0.12:
        adjusted = base * 0.45
    else:
        adjusted = base * 0.20

    return round(min(adjusted, 99.0), 2)