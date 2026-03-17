
import os
import re

search_dir = r"c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\frontend\src"

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if "useEffect" in content and not re.search(r"import\s+.*useEffect.*from\s+['\"]react['\"]", content):
                    # Check if it's using React.useEffect
                    if "React.useEffect" not in content:
                        print(f"MISSING IMPORT: {path}")

print("Search complete.")
