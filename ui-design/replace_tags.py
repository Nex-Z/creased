import re

files = [
    'archive.html',
    'tags.html'
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace <span class="tag tag-xxx">Text</span> or with style
    content = re.sub(r'<span class="tag tag-[a-z]+"[^>]*>(.*?)</span>', r'<span class="meta-category">\1</span>', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done")
