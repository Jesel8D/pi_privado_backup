
import os
import re

search_dir = r"c:\Users\jaras\Downloads\git hub todos docuemntacion\claude code con ollama\proyecto integrsaaodr\pi_privado_backup\frontend\src"

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "useEffect" in content:
                        import_match = re.search(r"import\s+.*useEffect.*from\s+['\"]react['\"]", content)
                        react_dot_match = "React.useEffect" in content
                        if not import_match and not react_dot_match:
                            print(f"MISSING IMPORT: {path}")
            except Exception as e:
                pass
