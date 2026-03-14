from relevance import relevance_score_for_url

test_cases = [

    # ════════════════════════════════════════════════════════════════
    # GOAL 1 — CS student finishing a data structures assignment
    # "finishing my computer science assignment implementing binary search
    #  trees with insertion deletion traversal methods using Python"
    # ════════════════════════════════════════════════════════════════

    # ON TASK — where a CS student doing an assignment should be
    ("https://github.com/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://github.com/TheAlgorithms/Python",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://stackoverflow.com/questions/2598437/how-to-implement-a-binary-tree",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://realpython.com/binary-search-python/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://docs.python.org/3/tutorial/datastructures.html",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.tutorialspoint.com/data_structures_algorithms/tree_data_structure.htm",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://visualgo.net/en/bst",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://leetcode.com/problems/validate-binary-search-tree/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),

    # BORDERLINE — coding adjacent but drifting
    ("https://www.reddit.com/r/learnpython/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.youtube.com/watch?v=LFjCM2hDL9o",  # actual BST tutorial video
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://news.ycombinator.com/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.codecademy.com/learn/learn-python-3",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),

    # DISTRACTION — procrastinating
    ("https://www.twitch.tv/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.youtube.com/feed/trending",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.reddit.com/r/gaming/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.netflix.com/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.instagram.com/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),
    ("https://www.tiktok.com/",
     "finishing my computer science assignment implementing binary search trees with insertion deletion traversal methods using Python"),

    # ════════════════════════════════════════════════════════════════
    # GOAL 2 — History student researching primary sources
    # "writing an essay analysing primary sources about the causes
    #  of World War One including nationalism imperialism and the alliance system"
    # ════════════════════════════════════════════════════════════════

    # ON TASK — archives, encyclopaedias, academic sources
    ("https://www.britannica.com/event/World-War-I",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://en.wikipedia.org/wiki/Causes_of_World_War_I",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.archives.gov/education/lessons/wwi-propaganda",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.iwm.org.uk/history/the-causes-of-the-first-world-war",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://en.wikipedia.org/wiki/Nationalism",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://en.wikipedia.org/wiki/Imperialism",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://avalon.law.yale.edu/subject_menus/wwi.asp",  # Yale Avalon historical docs
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.history.com/topics/world-war-i/world-war-i-history",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://en.wikipedia.org/wiki/Triple_Entente",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.jstor.org/stable/1879515",  # academic journal article
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),

    # BORDERLINE
    ("https://en.wikipedia.org/wiki/World_War_II",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.bbc.co.uk/history/worldwars/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.reddit.com/r/history/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),

    # DISTRACTION
    ("https://www.netflix.com/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.twitch.tv/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.instagram.com/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.ebay.com/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.tiktok.com/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.youtube.com/feed/trending",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),
    ("https://www.reddit.com/r/memes/",
     "writing an essay analysing primary sources about the causes of World War One including nationalism imperialism and the alliance system"),

    # ════════════════════════════════════════════════════════════════
    # GOAL 3 — Business student working on a market analysis report
    # "completing a market analysis report on the Australian retail industry
    #  examining consumer trends competitor positioning and revenue forecasts"
    # ════════════════════════════════════════════════════════════════

    # ON TASK
    ("https://www.ibisworld.com/au/industry/retail/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.abs.gov.au/statistics/industry/retail-and-wholesale-trade",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.investopedia.com/terms/m/market-analysis.asp",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://en.wikipedia.org/wiki/Retail",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.statista.com/outlook/dmo/ecommerce/australia",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.deloitte.com/au/en/services/consulting/retail.html",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.pwc.com.au/industry/retail-consumer.html",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.investopedia.com/terms/p/porter.asp",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://en.wikipedia.org/wiki/SWOT_analysis",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.mckinsey.com/industries/retail/our-insights",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),

    # BORDERLINE
    ("https://www.bbc.com/news/business",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.reddit.com/r/business/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.linkedin.com/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),

    # DISTRACTION
    ("https://www.youtube.com/user/PewDiePie",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.twitch.tv/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.instagram.com/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.tiktok.com/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.reddit.com/r/ProgrammerHumor/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.netflix.com/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),
    ("https://www.imdb.com/",
     "completing a market analysis report on the Australian retail industry examining consumer trends competitor positioning and revenue forecasts"),

    # ════════════════════════════════════════════════════════════════
    # GOAL 4 — Medical student studying pharmacology
    # "studying pharmacology mechanisms of action for beta blockers calcium
    #  channel blockers and ACE inhibitors used in treating hypertension"
    # ════════════════════════════════════════════════════════════════

    # ON TASK
    ("https://www.khanacademy.org/science/health-and-medicine/circulatory-system-diseases/hypertension/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://en.wikipedia.org/wiki/Beta_blocker",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://en.wikipedia.org/wiki/ACE_inhibitor",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://en.wikipedia.org/wiki/Calcium_channel_blocker",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.ncbi.nlm.nih.gov/books/NBK532906/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.drugs.com/drug-class/beta-adrenergic-blocking-agents.html",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.britannica.com/science/hypertension",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3250026/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.uptodate.com/contents/choice-of-drug-therapy-in-primary-essential-hypertension",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://en.wikipedia.org/wiki/Antihypertensive_drug",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),

    # BORDERLINE
    ("https://en.wikipedia.org/wiki/Cardiovascular_disease",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.reddit.com/r/medicalschool/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.khanacademy.org/science/biology",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),

    # DISTRACTION
    ("https://www.twitch.tv/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.youtube.com/feed/trending",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.tiktok.com/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.netflix.com/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.reddit.com/r/funny/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.imdb.com/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),
    ("https://www.airbnb.com/",
     "studying pharmacology mechanisms of action for beta blockers calcium channel blockers and ACE inhibitors used in treating hypertension"),

    # ════════════════════════════════════════════════════════════════
    # GOAL 5 — Engineering student working on a circuit design report
    # "designing an analog low pass RC filter circuit calculating cutoff
    #  frequency impedance and signal attenuation for electrical engineering lab report"
    # ════════════════════════════════════════════════════════════════

    # ON TASK
    ("https://www.electronics-tutorials.ws/filter/filter_2.html",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://en.wikipedia.org/wiki/Low-pass_filter",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.allaboutcircuits.com/textbook/alternating-current/chpt-8/low-pass-filters/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.khanacademy.org/science/electrical-engineering/ee-circuit-analysis-topic",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://en.wikipedia.org/wiki/RC_circuit",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.geeksforgeeks.org/low-pass-filter/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.wolframalpha.com/input?i=RC+low+pass+filter+cutoff+frequency",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://en.wikipedia.org/wiki/Cutoff_frequency",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.circuitlab.com/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.falstad.com/circuit/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),

    # BORDERLINE
    ("https://en.wikipedia.org/wiki/Electronic_filter",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.reddit.com/r/electronics/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.youtube.com/watch?v=OmRelHdGGOY",  # actual EE tutorial
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),

    # DISTRACTION
    ("https://www.twitch.tv/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.tiktok.com/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.reddit.com/r/gaming/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.netflix.com/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.instagram.com/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.imdb.com/",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
    ("https://www.youtube.com/feed/trending",
     "designing an analog low pass RC filter circuit calculating cutoff frequency impedance and signal attenuation for electrical engineering lab report"),
]

for url, goal in test_cases:
    result = relevance_score_for_url(url, goal)
    print(result)