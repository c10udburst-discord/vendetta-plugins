from glob import glob
import json
import pathlib

PLUGIN_URL = "https://c10udburst-discord.github.io/vendetta-plugins"

with open("README.md", "r+", encoding="utf-8") as fp:
    before, _, after = fp.read().split("<!-- plugins -->\n")
    fp.seek(0)
    fp.write(before)
    fp.write("<!-- plugins -->\n")
    for manifest_file in glob("plugins/*/manifest.json"):
        folder = pathlib.Path(manifest_file).parent.name
        manifest = json.load(open(manifest_file, encoding="utf-8"))
        fp.write(f"- {manifest['name']}: \n")
        fp.write(f"    > {manifest['description']}\n")
        fp.write(f"    - Install link: `{PLUGIN_URL}/{folder}`\n")
    fp.write("<!-- plugins -->\n")
    fp.write(after)