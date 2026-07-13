import json, re

html_path = r'C:\Users\lpagan.FR\.gemini\antigravity-ide\brain\1777498b-559a-4621-adc4-a8e490fa12e1\.system_generated\steps\5\content.md'
html = open(html_path, encoding='utf-8').read()

m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
if m:
    data = json.loads(m.group(1))
    page_props = data.get('props', {}).get('pageProps', {})
    messages = page_props.get('messages', {})
    
    spec_data = {}
    for key, value in messages.items():
        if isinstance(value, dict) and 'parameter' in value:
            spec_data[key] = value['parameter']
        elif isinstance(value, dict):
            # check deeply
            for subk, subv in value.items():
                if isinstance(subv, dict) and 'parameter' in subv:
                    spec_data[f"{key}.{subk}"] = subv['parameter']
                    
    print(f"Found specs for: {list(spec_data.keys())}")
    
    # Dump one to see structure
    if spec_data:
        first_key = list(spec_data.keys())[0]
        print(f"\nExample for {first_key}:")
        print(json.dumps(spec_data[first_key], indent=2))
